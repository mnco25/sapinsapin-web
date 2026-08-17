import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/* The 404 page's one piece of imagery: the address that was requested, drawn
   as if it were an utterance the site had tried to transcribe.

   It is deterministic — the same URL always produces the same trace — which is
   the whole reason it earns its place. A random waveform would be wallpaper; a
   fingerprint of the actual bad link is a picture of *this* mistake, and two
   people comparing broken links can see at a glance that they hit different
   ones.

   Nothing here is audio and nothing is sent anywhere: the caption on the card
   says so, because a speech project drawing a waveform on an error page owes
   the reader that much.

   SVG rather than canvas, so the bars inherit the theme tokens through CSS and
   follow the light/dark wipe for free. The sweep writes two attributes per
   frame through refs instead of re-rendering sixty-odd rects. */

const BAR_COUNT = 72
const SWEEP_MS = 2100

/* FNV-1a. Cheap, and it avalanches well enough that /models and /model land on
   visibly different traces rather than near-identical ones. */
function hashString(text) {
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/* mulberry32 — a small seeded PRNG, so the trace is a pure function of the
   seed rather than of when the page happened to load. */
function makeRandom(seed) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

/* Flat noise reads as static, and static does not read as speech. Two slow
   envelopes at incommensurate rates give the syllable rhythm, a threshold
   opens gaps where the speaker would have paused, and per-bar jitter keeps it
   from looking like a rendered sine. */
function buildTrace(seed) {
  const random = makeRandom(seed)
  const phase = random() * Math.PI * 2
  const rate = 0.34 + random() * 0.22
  const gapBias = 0.12 + random() * 0.1

  return Array.from({ length: BAR_COUNT }, (_, index) => {
    const syllable = (Math.sin(index * rate + phase) + 1) / 2
    const breath = (Math.sin(index * rate * 0.31 + phase * 1.7) + 1) / 2
    // Fades in and out at the edges, the way a clipped recording does not.
    const taper = Math.sin((index / (BAR_COUNT - 1)) * Math.PI) ** 0.45
    const envelope = (syllable * 0.62 + breath * 0.38) * taper
    const jitter = 0.55 + random() * 0.45
    const amplitude = envelope * jitter
    return amplitude < gapBias ? amplitude * 0.35 : amplitude
  })
}

export default function SignalTrace({ seed, className = '' }) {
  const bars = useMemo(() => buildTrace(hashString(seed)), [seed])
  const fingerprint = useMemo(() => {
    const hash = hashString(seed).toString(16).padStart(8, '0')
    return `${hash.slice(0, 4)}·${hash.slice(4)}`
  }, [seed])

  const clipRef = useRef(null)
  const headRef = useRef(null)
  const frameRef = useRef(0)
  const [phase, setPhase] = useState('idle') // idle → scanning → settled
  const [pinned, setPinned] = useState(null) // 0–1 while a pointer is scrubbing

  // One attribute write per frame, straight to the DOM. Re-rendering 72 rects
  // sixty times a second to move one edge would be the wrong trade.
  const paint = useCallback((position) => {
    const clamped = Math.max(0, Math.min(1, position))
    clipRef.current?.setAttribute('width', String(clamped * BAR_COUNT))
    headRef.current?.setAttribute('transform', `translate(${clamped * BAR_COUNT} 0)`)
  }, [])

  const run = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    // Re-running while the pointer is still on the stage would otherwise leave
    // the readout reporting the pinned position of a head that has moved on.
    setPinned(null)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      paint(1)
      setPhase('settled')
      return
    }
    setPhase('scanning')
    const started = performance.now()
    const step = (now) => {
      const progress = Math.min(1, (now - started) / SWEEP_MS)
      // Decelerating, so the pass ends by running out of signal rather than by
      // being cut off at the right-hand edge.
      paint(1 - (1 - progress) ** 2.2)
      if (progress < 1) { frameRef.current = requestAnimationFrame(step); return }
      setPhase('settled')
    }
    frameRef.current = requestAnimationFrame(step)
  }, [paint])

  useEffect(() => {
    run()
    return () => cancelAnimationFrame(frameRef.current)
  }, [run])

  // Scrubbing takes the head off the sweep and puts it under the cursor, so the
  // trace can be read position by position instead of only watched.
  const onScrub = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    if (!box.width) return
    cancelAnimationFrame(frameRef.current)
    const position = (event.clientX - box.left) / box.width
    setPinned(Math.max(0, Math.min(1, position)))
    setPhase('settled')
    paint(position)
  }

  const endScrub = () => {
    setPinned(null)
    paint(1)
  }

  const readPosition = pinned === null ? 1 : pinned

  return <figure className={`nf-trace ${className}`} data-phase={phase} data-scrub={pinned !== null}>
    <figcaption className="nf-trace-head">
      <span className="nf-trace-label">{phase === 'scanning' ? 'Decoding' : 'No transcript'}</span>
      <span className="nf-trace-sig">sig {fingerprint}</span>
    </figcaption>

    {/* The bars are drawn twice: once dim for the whole signal, once tinted and
        clipped to the head, which is what makes the pass read as decoding
        rather than as a bar chart lighting up. */}
    <div
      className="nf-trace-stage"
      onPointerMove={onScrub}
      onPointerLeave={endScrub}
      onPointerCancel={endScrub}
    >
      <svg viewBox={`0 0 ${BAR_COUNT} 40`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <clipPath id="nf-trace-clip">
            <rect ref={clipRef} x="0" y="0" width="0" height="40" />
          </clipPath>
        </defs>
        <g className="nf-trace-bars">
          {bars.map((amplitude, index) => (
            <rect key={index} x={index + 0.22} y={20 - amplitude * 19} width="0.56" height={Math.max(0.5, amplitude * 38)} rx="0.28" />
          ))}
        </g>
        <g className="nf-trace-bars is-read" clipPath="url(#nf-trace-clip)">
          {bars.map((amplitude, index) => (
            <rect key={index} x={index + 0.22} y={20 - amplitude * 19} width="0.56" height={Math.max(0.5, amplitude * 38)} rx="0.28" />
          ))}
        </g>
        <g ref={headRef} className="nf-trace-cursor">
          <line x1="0" y1="1" x2="0" y2="39" />
        </g>
      </svg>
    </div>

    <dl className="nf-trace-readout">
      {/* The head moves through refs rather than through state, so during the
          pass there is no per-frame number to report — it is only a readable
          figure once the trace is still or under a cursor. */}
      <div><dt>Position</dt><dd>{phase === 'scanning' ? '—' : `${(readPosition * 100).toFixed(0)}%`}</dd></div>
      <div><dt>Confidence</dt><dd className="nf-trace-null">0.00</dd></div>
      <div><dt>Routes matched</dt><dd className="nf-trace-null">0</dd></div>
      <div className="nf-trace-action">
        <button type="button" onClick={run}>Re-run</button>
      </div>
    </dl>

    <p className="nf-trace-note">
      Drawn from the address itself, not from audio — the same URL always makes the same trace. Nothing was recorded and nothing was sent anywhere.
    </p>
  </figure>
}
