// Talks to the halohalo Gradio Space from the browser.
//
// This is the one place in the app that fetches at runtime. It is allowed to,
// where the Hub catalog is not, because the Space answers with
// `access-control-allow-origin: <whatever asked>` while the Hub API pins that
// header to huggingface.co. See CLAUDE.md.
//
// Three properties of the Space shape everything below. All three were measured
// against the live Space, not inferred from the docs:
//
// 1. It runs on free cpu-basic. Synthesis takes ~14s warm, and the first use of
//    a language pulls a ~1GB model first, so a minute is normal, not a fault.
//
// 2. It cannot do concurrency. Two requests in flight at once leave it waiting
//    on a session it never finishes, and a few of those make it stop answering
//    entirely for about a minute. Everything here goes through one FIFO queue
//    with exactly one request in flight — see `schedule`.
//
// 3. Gradio validates dropdown values against the choices that dropdown
//    currently holds *for this session*, and there is one live choice list per
//    dropdown per session. Asking for a Bikol voice without telling the Space
//    the language changed fails with "is not in the list of choices". Worse,
//    preparing Bikol and then Waray leaves Bikol invalid again — preparation is
//    a cursor, not a cache. See `withPrepared`.

import { spaceOrigin, languages as manifestLanguages } from '../data/spaceManifest.js'

const api = `${spaceOrigin}/gradio_api`

// A Gradio session is just an id the client makes up; the server hangs the
// dropdown state off it. One per page load, replaced only if the Space restarts
// underneath us and forgets what we told it.
let sessionHash = newSessionHash()
function newSessionHash() {
  return `sapinsapin-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

// Which language each prep-driven dropdown is currently showing, server-side.
// null means "unknown" — after a reset we cannot assume anything.
let prepared = { clips: null, voices: null }

export class SpaceError extends Error {
  constructor(message, { kind = 'failed', retryable = false, cause } = {}) {
    super(message)
    this.name = 'SpaceError'
    this.kind = kind
    this.retryable = retryable
    this.cause = cause
  }
}

const isAbort = (error) => error?.name === 'AbortError' || error?.name === 'TimeoutError'

/* ---------------------------------------------------------------- scheduler */

// One request at a time, in the order asked for. Jobs waiting their turn report
// how many are ahead so the UI can say so rather than showing a stalled bar.
const waiting = []
let running = false

function notifyPositions() {
  waiting.forEach((entry, index) => entry.onPosition?.(index + 1))
}

function schedule(task, { signal, onPosition } = {}) {
  return new Promise((resolve, reject) => {
    const entry = { task, resolve, reject, signal, onPosition }
    waiting.push(entry)
    notifyPositions()

    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          const index = waiting.indexOf(entry)
          // Only drop it here if it has not started; a running job is cancelled
          // by its own fetch seeing the same signal.
          if (index === -1) return
          waiting.splice(index, 1)
          notifyPositions()
          reject(new SpaceError('Cancelled.', { kind: 'cancelled' }))
        },
        { once: true },
      )
    }
    pump()
  })
}

async function pump() {
  if (running) return
  const entry = waiting.shift()
  if (!entry) return
  running = true
  notifyPositions()
  entry.onPosition?.(0)
  try {
    entry.resolve(await entry.task())
  } catch (error) {
    entry.reject(error)
  } finally {
    running = false
    pump()
  }
}

/* ------------------------------------------------------------- raw requests */

// The stream stays open for the life of the job, dripping heartbeats until the
// terminal frame. Reading it incrementally rather than awaiting .text() is what
// lets the UI distinguish "the Space is still working" from "the connection
// died" during a 60s model load.
async function readEvents(response, { onHeartbeat } = {}) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })

      let split
      while ((split = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, split)
        buffer = buffer.slice(split + 2)

        const event = frame.match(/^event:\s*(.+)$/m)?.[1]?.trim()
        const raw = frame.match(/^data:\s*([\s\S]*)$/m)?.[1]
        if (!event) continue
        if (event === 'heartbeat') {
          onHeartbeat?.()
          continue
        }
        if (event !== 'complete' && event !== 'error') continue

        let payload = null
        try {
          payload = raw ? JSON.parse(raw) : null
        } catch {
          payload = null
        }
        if (event === 'error') {
          const message = typeof payload?.error === 'string' ? payload.error : 'The Space rejected the request.'
          throw new SpaceError(message, { kind: /not in the list of choices/.test(message) ? 'stale-session' : 'failed' })
        }
        return payload
      }
    }
  } finally {
    reader.cancel().catch(() => {})
  }

  throw new SpaceError('The Space closed the connection before answering.', { kind: 'dropped', retryable: true })
}

async function request(endpoint, data, { signal, timeoutMs = 30_000, onHeartbeat } = {}) {
  // One timeout covering both legs, so a job cannot outlive its budget by
  // spending it twice.
  const timeout = AbortSignal.timeout(timeoutMs)
  const composed = signal ? AbortSignal.any([signal, timeout]) : timeout

  let posted
  try {
    posted = await fetch(`${api}/call/${endpoint}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ data, session_hash: sessionHash }),
      signal: composed,
    })
  } catch (error) {
    throw translate(error, signal, timeout)
  }

  if (posted.status === 503 || posted.status === 504) {
    throw new SpaceError('The Space is waking up.', { kind: 'waking', retryable: true })
  }
  if (!posted.ok) {
    throw new SpaceError(`The Space answered ${posted.status}.`, { kind: 'failed', retryable: posted.status >= 500 })
  }

  const { event_id: eventId } = await posted.json().catch(() => ({}))
  if (!eventId) throw new SpaceError('The Space accepted the request but gave no job id.', { kind: 'failed' })

  try {
    const stream = await fetch(`${api}/call/${endpoint}/${eventId}`, { signal: composed })
    if (!stream.ok || !stream.body) {
      throw new SpaceError(`The Space answered ${stream.status} on the result stream.`, { kind: 'failed' })
    }
    return await readEvents(stream, { onHeartbeat })
  } catch (error) {
    throw translate(error, signal, timeout)
  }
}

function translate(error, signal, timeout) {
  if (error instanceof SpaceError) return error
  if (signal?.aborted) return new SpaceError('Cancelled.', { kind: 'cancelled' })
  if (timeout?.aborted || isAbort(error)) {
    return new SpaceError('The Space did not answer in time.', { kind: 'timeout', retryable: true })
  }
  return new SpaceError('Could not reach the Space.', { kind: 'network', retryable: true, cause: error })
}

/* ------------------------------------------------------------- preparation */

const prepEndpoint = { clips: 'lambda', voices: 'lambda_1' }

// Gradio hands back {choices: [[label, value], …]}; the value is what it will
// validate against later.
const choiceValues = (payload) =>
  (payload?.[0]?.choices ?? []).map((choice) => (Array.isArray(choice) ? choice[1] : choice))

// Runs `task` with the named dropdown pointed at `language`, refreshing it
// whenever the cursor is somewhere else. Both calls happen inside a single
// queue slot, so nothing can move the cursor in between.
async function withPrepared(kind, language, task, options = {}) {
  let choices = null
  if (prepared[kind] !== language) {
    const payload = await request(prepEndpoint[kind], [language], { ...options, timeoutMs: 30_000 })
    choices = choiceValues(payload)
    prepared[kind] = language
  }
  return { choices, value: await task() }
}

export function resetSession(reason) {
  sessionHash = newSessionHash()
  prepared = { clips: null, voices: null }
  if (reason && import.meta.env?.DEV) console.warn(`[spaceClient] new session: ${reason}`)
}

/* ------------------------------------------------------------ warm tracking */

// The Space loads a model per language on first use, except voice conversion,
// which is a single language-independent model — one successful convert warms
// it for every language. Tracking that wrong shows a bogus "first run" notice.
const warm = new Set()
export const warmKey = (capability, language) => (capability === 'vc' ? 'vc' : `${capability}:${language}`)
export const isWarm = (capability, language) => warm.has(warmKey(capability, language))
const markWarm = (capability, language) => warm.add(warmKey(capability, language))

/* -------------------------------------------------------------------- files */

export async function uploadBlob(blob, filename, { signal } = {}) {
  const form = new FormData()
  form.append('files', blob, filename)
  let response
  try {
    response = await fetch(`${api}/upload`, { method: 'POST', body: form, signal })
  } catch (error) {
    throw translate(error, signal)
  }
  if (!response.ok) throw new SpaceError(`Upload failed (${response.status}).`, { kind: 'failed', retryable: true })
  const [path] = await response.json()
  if (!path) throw new SpaceError('Upload returned no path.', { kind: 'failed' })
  return { path, meta: { _type: 'gradio.FileData' } }
}

// Generated audio is served as application/octet-stream, which Safari refuses to
// decode from a bare <audio src>. Pulling the bytes and re-typing them as WAV
// makes it play everywhere, and gives us a stable object URL to revoke.
export async function fetchAudioBlob(fileData, { signal } = {}) {
  const url = fileData?.url ?? (fileData?.path ? `${api}/file=${fileData.path}` : null)
  if (!url) throw new SpaceError('The Space returned no audio.', { kind: 'failed' })
  let response
  try {
    response = await fetch(url, { signal })
  } catch (error) {
    throw translate(error, signal)
  }
  if (!response.ok) throw new SpaceError(`Could not download the audio (${response.status}).`, { kind: 'failed' })
  return new Blob([await response.arrayBuffer()], { type: 'audio/wav' })
}

/* ------------------------------------------------------------------- shapes */

// Outputs are read positionally and defensively: the Space's own API docs
// undercount /synthesize (they say two elements, it returns three), so anything
// that destructures a fixed shape would break on the next rebuild.
const text = (value) => (typeof value === 'string' ? value : '')
const file = (value) => (value && typeof value === 'object' && (value.url || value.path) ? value : null)

/* ---------------------------------------------------------------- endpoints */

const heavy = { timeoutMs: 180_000 }

// The Space forgets our session when it restarts, which surfaces as a choices
// error on a value we know we prepared. That is worth exactly one silent retry
// on a fresh session; retrying anything else would double a minute-long wait.
async function withStaleSessionRetry(run) {
  try {
    return await run()
  } catch (error) {
    if (error instanceof SpaceError && error.kind === 'stale-session') {
      resetSession('the Space restarted and lost our dropdown state')
      return run()
    }
    throw error
  }
}

export function listClips(language, options = {}) {
  return schedule(
    () =>
      withStaleSessionRetry(async () => {
        const { choices } = await withPrepared('clips', language, async () => null, options)
        return choices ?? manifestLanguages.find((entry) => entry.name === language)?.clips ?? []
      }),
    options,
  )
}

// The voice list is the one piece of baked state that can silently invalidate a
// request: offering a voice the Space has since renamed produces "is not in the
// list of choices" on submit, after the visitor has already waited. Refreshing
// from /lambda_1 lets the page correct itself between deploys.
export function listVoices(language, options = {}) {
  return schedule(
    () =>
      withStaleSessionRetry(async () => {
        const { choices } = await withPrepared('voices', language, async () => null, options)
        return choices ?? manifestLanguages.find((entry) => entry.name === language)?.voices ?? []
      }),
    options,
  )
}

export function loadSample(language, label, options = {}) {
  return schedule(
    () =>
      withStaleSessionRetry(async () => {
        const { value } = await withPrepared(
          'clips',
          language,
          () => request('load_sample', [language, label], { ...options, ...heavy }),
          options,
        )
        return { audio: file(value?.[0]), reference: text(value?.[1]) }
      }),
    options,
  )
}

export function synthesize({ language, voice, text: input }, options = {}) {
  return schedule(
    () =>
      withStaleSessionRetry(async () => {
        const { value } = await withPrepared(
          'voices',
          language,
          () => request('synthesize', [language, input, voice], { ...options, ...heavy }),
          options,
        )
        const audio = file(value?.[0])
        if (!audio) throw new SpaceError('The Space returned no audio.', { kind: 'failed' })
        markWarm('tts', language)
        return { audio, details: text(value?.[1]) }
      }),
    options,
  )
}

// /transcribe needs no preparation: its language dropdown holds all ten
// languages at all times, and the other two inputs are free-form.
export function transcribe({ language, audio, reference = '' }, options = {}) {
  return schedule(async () => {
    const value = await request('transcribe', [language, audio, reference], { ...options, ...heavy })
    markWarm('asr', language)
    return { text: text(value?.[0]) }
  }, options)
}

// /convert needs no preparation either: its target-voice dropdown holds all
// twenty voices, which is why they are the language-prefixed spelling.
export function convert({ audio, voice }, options = {}) {
  return schedule(async () => {
    const value = await request('convert', [audio, voice], { ...options, ...heavy })
    const output = file(value?.[0])
    if (!output) throw new SpaceError('The Space returned no audio.', { kind: 'failed' })
    markWarm('vc')
    return { audio: output, details: text(value?.[1]) }
  }, options)
}
