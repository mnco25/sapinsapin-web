import { hubDatasets, hubModels, hubTotals, syncedAt } from './hubSnapshot'

// Editorial copy lives here; every number comes from the Hub sync so the page
// cannot drift from the org. Run `npm run sync` before a deploy.
export const catalogSnapshot = new Date(`${syncedAt}T00:00:00Z`).toLocaleDateString('en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
})
export const totals = hubTotals

const datasetCopy = [
  {
    id: 'pld', title: 'Philippine Language Dataset', kicker: 'Speech · flagship collection',
    description: 'Prompted 16 kHz speech across ten Philippine languages, prepared for speech recognition and text-to-speech research.',
    languages: 'Bikol · Cebuano · Filipino · Hiligaynon · Ilocano · Pangasinan · Kapampangan · Tausug · Waray',
    size: '334,268 utterances · 448.2 h', license: 'up-dsp-research', updated: '11 Aug 2026',
    tags: ['speech', 'multilingual', 'ASR', 'TTS'], href: 'https://huggingface.co/datasets/sapinsapin/pld', featured: true,
  },
  {
    id: 'filipinospeechcorpus', title: 'Filipino Speech Corpus', kicker: 'Speech · open corpus',
    description: 'The UP-DSP Filipino Speech Corpus as sentence-level 16 kHz segments, designed for ASR and TTS-ready workflows.',
    languages: 'Filipino · Tagalog', size: '305,246 segments · 65.1 h', license: 'MIT', updated: '11 Aug 2026',
    tags: ['speech', 'ASR', 'TTS', 'low-resource'], href: 'https://huggingface.co/datasets/sapinsapin/filipinospeechcorpus', featured: true,
  },
  {
    id: 'kumu-livestream-segmented', title: 'halo-livestream', kicker: 'Speech · access controlled',
    description: 'Taglish code-switched livestream speech, segmented for ASR and TTS research. Public metadata identifies Filipino, Tagalog, and English.',
    languages: 'Tagalog · Filipino · English', size: '{{VERIFY}}', license: '{{VERIFY}}', updated: '11 Aug 2026',
    tags: ['speech', 'Taglish', 'ASR', 'TTS'], href: 'https://huggingface.co/datasets/sapinsapin/kumu-livestream-segmented', gated: true,
  },
  {
    id: 'kumu-livestream-raw', title: 'halo-livestream-raw', kicker: 'Speech · access controlled',
    description: 'Unsegmented Taglish livestream source recordings. Access requires agreement to the dataset’s research-use and speaker-protection terms.',
    languages: 'Tagalog · Filipino · English', size: '{{VERIFY}}', license: '{{VERIFY}}', updated: '11 Aug 2026',
    tags: ['speech', 'Taglish', 'raw'], href: 'https://huggingface.co/datasets/sapinsapin/kumu-livestream-raw', gated: true,
  },
  {
    id: 'BantayWika', title: 'BantayWika', kicker: 'Text · literary & reference corpus',
    description: 'A FineWeb-compatible pretraining corpus derived from the UP Sentro ng Wikang Filipino and UP-DSP Bantay-Wika collection.',
    languages: 'Filipino · Cebuano · Ilocano', size: '6.09M verified tokens', license: '{{VERIFY}}', updated: '14 Mar 2026',
    tags: ['text', 'FineWeb', 'pretraining'], href: 'https://huggingface.co/datasets/sapinsapin/BantayWika',
  },
  {
    id: 'halohalo', title: 'halohalo', kicker: 'Text · combined web corpus',
    description: 'A FineWeb-compatible pretraining corpus built from cleaned Philippine-language web data, with document-level provenance.',
    languages: 'Tagalog · Hiligaynon · Bikol', size: '45,536 rows', license: '{{VERIFY}}', updated: '28 Mar 2026',
    tags: ['text', 'FineWeb', 'web corpus'], href: 'https://huggingface.co/datasets/sapinsapin/halohalo',
  },
  {
    id: 'halo-tgl', title: 'halo-tgl', kicker: 'Text · Tagalog',
    description: 'A cleaned web-scraped Tagalog text corpus for LLM pretraining, with raw and cleaned text preserved side by side.',
    languages: 'Tagalog', size: '6,589 documents', license: 'MIT', updated: '27 Mar 2026',
    tags: ['text', 'Tagalog', 'pretraining'], href: 'https://huggingface.co/datasets/sapinsapin/halo-tgl',
  },
  {
    id: 'halo-hil', title: 'halo-hil', kicker: 'Text · Hiligaynon',
    description: 'A cleaned web-scraped Hiligaynon text corpus for LLM pretraining, with raw and cleaned text preserved side by side.',
    languages: 'Hiligaynon', size: '9,860 documents', license: 'MIT', updated: '27 Mar 2026',
    tags: ['text', 'Hiligaynon', 'pretraining'], href: 'https://huggingface.co/datasets/sapinsapin/halo-hil',
  },
  {
    id: 'halo-bcl', title: 'halo-bcl', kicker: 'Text · Bikol',
    description: 'A cleaned web-scraped Bikol text corpus for LLM pretraining, with raw and cleaned text preserved side by side.',
    languages: 'Bikol', size: '1,264 documents', license: '{{VERIFY}}', updated: '27 Mar 2026',
    tags: ['text', 'Bikol', 'pretraining'], href: 'https://huggingface.co/datasets/sapinsapin/halo-bcl',
  },
]

function formatDay(value) {
  if (!value) return '{{VERIFY}}'
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
}

const modelRows = [
  ['qwen3vl-balitanlp-news-writer', '{{VERIFY}}', 'aisingapore/Qwen-SEA-LION-v4-8B-VL', '{{VERIFY}}', '0', '14 Dec 2025'],
  ['llama31-8b-balitanlp-cpt', 'Text generation', 'meta-llama/Llama-3.1-8B', 'LanceBunag/BalitaNLP', '10', '24 Dec 2025'],
  ['llama31-8b-balitanlp-IT', '{{VERIFY}}', 'internetoftim/llama31-8b-balitanlp-cpt', 'CohereLabs/aya_dataset', '0', '16 Dec 2025'],
  ['gpt-oss-20b-balitanlp-cpt', 'Text generation', 'openai/gpt-oss-20b', 'LanceBunag/BalitaNLP', '61', '16 Apr 2026'],
  ['bikoLLM', 'Text generation', 'meta-llama/Llama-3.1-8B', 'sapinsapin/halo-bikol', '13', '28 Dec 2025'],
  ['speecht5_tts-fsc', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/filipinospeechcorpus', '29', '7 Aug 2026'],
  ['whisper-small-fsc', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/filipinospeechcorpus', '13', '8 Aug 2026'],
  ['speecht5_tts-pld-bcl', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '13', '8 Aug 2026'],
  ['speecht5_tts-pld-ceb', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '84', '8 Aug 2026'],
  ['speecht5_tts-pld-eng', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '11', '8 Aug 2026'],
  ['speecht5_tts-pld-fil', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '65', '8 Aug 2026'],
  ['speecht5_tts-pld-hil', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '130', '8 Aug 2026'],
  ['speecht5_tts-pld-ilo', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '31', '8 Aug 2026'],
  ['speecht5_tts-pld-pag', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '17', '8 Aug 2026'],
  ['speecht5_tts-pld-pam', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '17', '8 Aug 2026'],
  ['speecht5_tts-pld-tsg', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '20', '8 Aug 2026'],
  ['speecht5_tts-pld-war', 'Text to speech', 'microsoft/speecht5_tts', 'sapinsapin/pld', '20', '8 Aug 2026'],
  ['speecht5_vc-pld', 'Audio to audio', 'microsoft/speecht5_vc', 'sapinsapin/pld', '52', '8 Aug 2026'],
  ['whisper-small-pld-bcl', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '22', '12 Aug 2026'],
  ['whisper-small-pld-ceb', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '41', '11 Aug 2026'],
  ['whisper-small-pld-eng', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '9', '11 Aug 2026'],
  ['whisper-small-pld-fil', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '19', '11 Aug 2026'],
  ['whisper-small-pld-hil', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '22', '11 Aug 2026'],
  ['whisper-small-pld-ilo', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '20', '11 Aug 2026'],
  ['whisper-small-pld-pag', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '6', '11 Aug 2026'],
  ['whisper-small-pld-pam', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '8', '11 Aug 2026'],
  ['whisper-small-pld-tsg', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '8', '11 Aug 2026'],
  ['whisper-small-pld-war', 'Speech recognition', 'openai/whisper-small', 'sapinsapin/pld', '8', '11 Aug 2026'],
]

const liveModel = new Map(hubModels.map((model) => [model.name, model]))
const liveDataset = new Map(hubDatasets.map((dataset) => [dataset.id, dataset]))

export const datasets = datasetCopy.map((item) => {
  const live = liveDataset.get(item.id)
  return {
    ...item,
    downloads: live?.downloads ?? 0,
    updated: live ? formatDay(live.updated) : item.updated,
    gated: live?.gated ?? item.gated ?? false,
  }
})

export const models = modelRows.map(([name, fallbackTask, architecture, trainingData]) => {
  const live = liveModel.get(name)
  return {
    name,
    architecture,
    trainingData,
    task: live?.task ?? fallbackTask,
    downloads: String(live?.downloads ?? 0),
    updated: live ? formatDay(live.updated) : '{{VERIFY}}',
    href: `https://huggingface.co/sapinsapin/${name}`,
  }
}).sort((a, b) => Number(b.downloads) - Number(a.downloads))
