export default function HeroVisual() {
  const nodes = [
    [110, 55, 7, 'bcl'], [190, 35, 5, 'war'], [265, 75, 7, 'hil'], [355, 48, 5, 'ceb'],
    [77, 142, 5, 'pag'], [165, 132, 8, 'fil'], [248, 157, 5, 'ilo'], [337, 135, 7, 'pam'],
    [124, 221, 7, 'tsg'], [222, 242, 5, 'tgl'], [317, 225, 6, 'eng'],
  ]
  return (
    <div className="hero-visual" aria-label="An abstract network representing Philippine languages" role="img">
      <div className="visual-grid" />
      <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
      <svg viewBox="0 0 430 285" className="relative z-10 h-full w-full" fill="none" aria-hidden="true">
        <path d="M28 216C74 148 81 113 159 123c53 7 68-61 124-48 50 11 57 70 117 41" stroke="#5B3E96" strokeOpacity=".22" strokeWidth="1" />
        <path d="M29 216c55-6 72-63 136-44 63 18 67-70 133-45 38 15 56 39 103 25" stroke="#7FA65C" strokeOpacity=".36" strokeWidth="1" />
        {nodes.map(([cx, cy, r, label], i) => <g key={label} className={`node node-${i}`}><circle cx={cx} cy={cy} r={r + 5} fill="#5B3E96" opacity=".06"/><circle cx={cx} cy={cy} r={r} fill={i % 3 === 0 ? '#7FA65C' : '#5B3E96'} opacity={i % 2 ? '.82' : '.64'}/><text x={cx + 12} y={cy + 4} fill="#4B4035" fontSize="10" fontFamily="Inter, sans-serif" letterSpacing="1.4">{label.toUpperCase()}</text></g>)}
      </svg>
      <div className="absolute bottom-6 left-6 z-20 rounded-full border border-ink/10 bg-paper/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.18em] text-ink/75 backdrop-blur">10 languages, connected</div>
    </div>
  )
}
