/**
 * Every figure and description below was read off the live Hugging Face cards
 * for the sapinsapin org. Anything still unconfirmed is marked {{VERIFY}} —
 * see README.md for the running list.
 */

export const HF_ORG = 'https://huggingface.co/sapinsapin'
export const GITHUB_ORG = 'https://github.com/sapinsapin'

export const stats = [
  {
    value: '513+',
    unit: 'hours',
    label: 'Speech recorded',
    note: '448.2h in PLD, 65.1h in the Filipino Speech Corpus.',
  },
  {
    value: '647,652',
    unit: 'utterances',
    label: 'Transcribed segments',
    note: 'Across the speech corpora, each aligned to a transcript.',
  },
  {
    value: '10',
    unit: 'languages',
    label: 'Languages covered',
    note: 'Nine Philippine languages plus Philippine English.',
  },
  {
    value: '9',
    unit: 'datasets',
    label: 'Public datasets',
    note: 'Speech and text corpora on the Hugging Face Hub.',
  },
]

export const problems = [
  {
    number: '01',
    title: 'Speech AI speaks English',
    body: 'The models the world runs on are trained overwhelmingly on English and a short list of high-resource languages. Everything else is an afterthought — or absent entirely.',
  },
  {
    number: '02',
    title: 'Philippine languages are low-resource',
    body: 'Not because they lack speakers — Tagalog alone has tens of millions — but because almost no public, permissively licensed training data exists. The recordings sit in university archives, not on the Hub.',
  },
  {
    number: '03',
    title: 'No data, no tools',
    body: 'Without open corpora nobody can build transcription, dictation, search or assistive tech that actually works in Filipino, Cebuano, Ilocano, Bikol, Waray, Hiligaynon, Kapampangan, Pangasinan or Tausug. The gap compounds.',
  },
]

export const datasets = [
  {
    name: 'pld',
    title: 'Philippine Language Dataset',
    description:
      'Ten Philippine languages, 980 speakers, 448 hours of prompted speech — one of the largest multilingual Philippine speech collections available as Parquet. Collected by the UP Diliman DSP Laboratory.',
    languages: ['Bikol', 'Cebuano', 'English', 'Filipino', 'Hiligaynon', 'Ilocano', 'Pangasinan', 'Kapampangan', 'Tausug', 'Waray'],
    size: '334,268 utterances · 448.2 hours · 980 speakers',
    kind: 'Speech',
    license: 'Other — see dataset card',
    href: 'https://huggingface.co/datasets/sapinsapin/pld',
    featured: true,
  },
  {
    name: 'filipinospeechcorpus',
    title: 'Filipino Speech Corpus',
    description:
      'Studio-recorded Filipino read, spontaneous, and word-level speech — 125 speakers, packaged as ready-to-stream Parquet with inline audio.',
    languages: ['Filipino', 'Tagalog'],
    size: '313,322 segments · 65.1 hours · 125 speakers',
    kind: 'Speech',
    license: 'MIT',
    href: 'https://huggingface.co/datasets/sapinsapin/filipinospeechcorpus',
    featured: true,
  },
  {
    name: 'halo-livestream',
    title: 'Taglish livestream speech',
    description:
      'Real Taglish code-switching from livestreams — every segment carries forced-alignment confidence, ASR round-trip CER, SNR, loudness and overlap flags. A seed release: it exists to publish the pipeline and schema, not to train on.',
    languages: ['Taglish', 'Tagalog', 'English'],
    size: '62 segments · 3 speakers · ~7 minutes',
    kind: 'Speech',
    license: 'Gated — request access',
    href: 'https://huggingface.co/datasets/sapinsapin/kumu-livestream-segmented',
    gated: true,
  },
  {
    name: 'halohalo',
    title: 'Combined web text corpus',
    description:
      'A FineWeb-compatible pretraining text corpus for Philippine languages, assembled from the cleaned halo-* web crawls with boilerplate, navigation and markup noise stripped.',
    languages: ['Tagalog', 'Hiligaynon', 'Bikol'],
    size: '16,727 documents',
    kind: 'Text',
    license: '{{VERIFY}} — no license on card',
    href: 'https://huggingface.co/datasets/sapinsapin/halohalo',
  },
  {
    name: 'BantayWika',
    title: 'Literary and news text',
    description:
      'A FineWeb-compatible pretraining corpus derived from the Bantay-Wika corpus collected by the UP Sentro ng Wikang Filipino and the UP DSP Laboratory, tracking Philippine media language since 1994.',
    languages: ['Filipino', 'Cebuano', 'Ilocano'],
    size: '27,800 documents',
    kind: 'Text',
    license: '{{VERIFY}} — no license on card',
    href: 'https://huggingface.co/datasets/sapinsapin/BantayWika',
  },
  {
    name: 'halo-tgl',
    title: 'Tagalog web text',
    description:
      'A web-scraped Tagalog text corpus assembled for LLM pre-training, drawn from news sites, blogs, academic journals and other web sources.',
    languages: ['Tagalog'],
    size: '6,589 documents (cleaned)',
    kind: 'Text',
    license: 'MIT',
    href: 'https://huggingface.co/datasets/sapinsapin/halo-tgl',
  },
  {
    name: 'halo-hil',
    title: 'Hiligaynon web text',
    description:
      'A web-scraped Hiligaynon text corpus assembled for LLM pre-training, drawn from news sites, blogs, academic journals and other web sources.',
    languages: ['Hiligaynon'],
    size: '8,874 documents (cleaned)',
    kind: 'Text',
    license: 'MIT',
    href: 'https://huggingface.co/datasets/sapinsapin/halo-hil',
  },
  {
    name: 'halo-bcl',
    title: 'Bikol web text',
    description:
      'A web-scraped Bikol text corpus assembled for LLM pre-training, drawn from news sites, blogs, academic journals and other web sources.',
    languages: ['Bikol'],
    size: '1,264 documents (cleaned)',
    kind: 'Text',
    license: '{{VERIFY}} — no license on card',
    href: 'https://huggingface.co/datasets/sapinsapin/halo-bcl',
  },
  {
    name: 'kumu-livestream-raw',
    title: 'Livestream source audio',
    description:
      'Unsegmented source recordings behind halo-livestream — the archival input to the pipeline, not a training set.',
    languages: ['Taglish', 'Tagalog', 'English'],
    size: '1 recording · 26:56',
    kind: 'Speech',
    license: 'Gated — request access',
    href: 'https://huggingface.co/datasets/sapinsapin/kumu-livestream-raw',
    gated: true,
  },
]

export const modelGroups = [
  {
    title: 'Speech recognition',
    subtitle: 'Whisper-small, fine-tuned per language',
    models: [
      { name: 'whisper-small-fsc', note: 'Filipino (FSC)', href: 'https://huggingface.co/sapinsapin/whisper-small-fsc' },
      { name: 'whisper-small-pld-fil', note: 'Filipino', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-fil' },
      { name: 'whisper-small-pld-ceb', note: 'Cebuano', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-ceb' },
      { name: 'whisper-small-pld-ilo', note: 'Ilocano', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-ilo' },
      { name: 'whisper-small-pld-hil', note: 'Hiligaynon', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-hil' },
      { name: 'whisper-small-pld-bcl', note: 'Bikol', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-bcl' },
      { name: 'whisper-small-pld-war', note: 'Waray', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-war' },
      { name: 'whisper-small-pld-pam', note: 'Kapampangan', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-pam' },
      { name: 'whisper-small-pld-pag', note: 'Pangasinan', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-pag' },
      { name: 'whisper-small-pld-tsg', note: 'Tausug', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-tsg' },
      { name: 'whisper-small-pld-eng', note: 'Philippine English', href: 'https://huggingface.co/sapinsapin/whisper-small-pld-eng' },
    ],
  },
  {
    title: 'Speech synthesis',
    subtitle: 'SpeechT5 TTS and voice conversion',
    models: [
      { name: 'speecht5_tts-fsc', note: 'Filipino (FSC)', href: 'https://huggingface.co/sapinsapin/speecht5_tts-fsc' },
      { name: 'speecht5_tts-pld-fil', note: 'Filipino', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-fil' },
      { name: 'speecht5_tts-pld-ceb', note: 'Cebuano', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-ceb' },
      { name: 'speecht5_tts-pld-ilo', note: 'Ilocano', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-ilo' },
      { name: 'speecht5_tts-pld-hil', note: 'Hiligaynon', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-hil' },
      { name: 'speecht5_tts-pld-bcl', note: 'Bikol', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-bcl' },
      { name: 'speecht5_tts-pld-war', note: 'Waray', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-war' },
      { name: 'speecht5_tts-pld-pam', note: 'Kapampangan', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-pam' },
      { name: 'speecht5_tts-pld-pag', note: 'Pangasinan', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-pag' },
      { name: 'speecht5_tts-pld-tsg', note: 'Tausug', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-tsg' },
      { name: 'speecht5_tts-pld-eng', note: 'Philippine English', href: 'https://huggingface.co/sapinsapin/speecht5_tts-pld-eng' },
      { name: 'speecht5_vc-pld', note: 'Voice conversion, all ten languages', href: 'https://huggingface.co/sapinsapin/speecht5_vc-pld' },
    ],
  },
  {
    title: 'Language models',
    subtitle: 'Continued pre-training on Philippine text',
    models: [
      { name: 'bikoLLM', note: 'Llama 3.1 8B on Bikol text', href: 'https://huggingface.co/sapinsapin/bikoLLM' },
      { name: 'llama31-8b-balitanlp-cpt', note: 'Llama 3.1 8B on Philippine news', href: 'https://huggingface.co/sapinsapin/llama31-8b-balitanlp-cpt' },
      { name: 'llama31-8b-balitanlp-IT', note: 'Instruction-tuned variant', href: 'https://huggingface.co/sapinsapin/llama31-8b-balitanlp-IT' },
      { name: 'gpt-oss-20b-balitanlp-cpt', note: 'GPT-OSS 20B on Philippine news', href: 'https://huggingface.co/sapinsapin/gpt-oss-20b-balitanlp-cpt' },
      { name: 'qwen3vl-balitanlp-news-writer', note: 'Vision-language news writer', href: 'https://huggingface.co/sapinsapin/qwen3vl-balitanlp-news-writer' },
    ],
  },
]

export const contributePaths = [
  {
    title: 'Use the datasets',
    body: 'Everything streams from the Hub. Pull a corpus, fine-tune on it, publish what you build — and tell us, so we can point people at it.',
    code: 'load_dataset("sapinsapin/pld")',
    linkLabel: 'Browse the org on Hugging Face',
    href: HF_ORG,
  },
  {
    title: 'Contribute code',
    body: 'The scraping, cleaning and alignment pipelines are open. Improve the cleaners, add a language, or file an issue when a corpus looks wrong.',
    linkLabel: 'sapinsapin on GitHub',
    href: GITHUB_ORG,
  },
  {
    title: 'Contribute data',
    body: 'Recordings, transcripts, archives — if you hold Philippine-language material and want it in the open, or you represent an institution with a corpus gathering dust, get in touch.',
    linkLabel: 'Start a discussion on the Hub',
    href: 'https://huggingface.co/spaces/sapinsapin/halohalo-dashboard/discussions',
  },
]
