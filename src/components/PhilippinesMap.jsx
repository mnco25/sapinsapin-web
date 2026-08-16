import { useMemo, useState } from 'react'
import { languageAnchors, mapViewBox, philippinesMapPaths } from '../data/philippinesMapPaths'
import { models } from '../data/catalog'

// Marker positions come from scripts/prepare-map.mjs, which projects each
// language's real centre with the same transform as the coastline, so the dots
// cannot drift away from the geography they describe.
const languageMeta = {
  ilo: { label: 'Ilocano', region: 'Northern Luzon', side: 'right' },
  pag: { label: 'Pangasinan', region: 'Lingayen Gulf', side: 'left' },
  pam: { label: 'Kapampangan', region: 'Central Luzon', side: 'left' },
  fil: { label: 'Filipino', region: 'Southern Luzon', side: 'right' },
  bcl: { label: 'Bikol', region: 'Bicol Peninsula', side: 'right' },
  war: { label: 'Waray', region: 'Eastern Visayas', side: 'right' },
  hil: { label: 'Hiligaynon', region: 'Western Visayas', side: 'left' },
  ceb: { label: 'Cebuano', region: 'Central Visayas', side: 'right' },
  tsg: { label: 'Tausug', region: 'Sulu Archipelago', side: 'left' },
}

// Each PLD language has its own fine-tuned models on the Hub. Reading them out
// of the catalog keeps the map honest: the dots grow with real download counts
// rather than with a number chosen to look good.
function buildLayers() {
  const layers = languageAnchors.map(({ id, x, y }) => {
    const own = models.filter((model) => model.name.endsWith(`-pld-${id}`))
    const downloads = own.reduce((total, model) => total + (Number(model.downloads) || 0), 0)
    const tasks = [...new Set(own.map((model) => model.task))]
    return { id, x, y, ...languageMeta[id], code: id.toUpperCase(), models: own.length, downloads, tasks }
  })

  // Area, not radius, should track the value — hence the square root.
  const peak = Math.max(...layers.map((layer) => layer.downloads), 1)
  return layers.map((layer) => ({ ...layer, radius: 3.1 + Math.sqrt(layer.downloads / peak) * 6.4 }))
}

export default function PhilippinesMap() {
  const layers = useMemo(buildLayers, [])
  const [activeId, setActiveId] = useState('fil')
  const active = layers.find((layer) => layer.id === activeId) ?? layers[0]
  const totalDownloads = useMemo(() => layers.reduce((total, layer) => total + layer.downloads, 0), [layers])

  // The extrusion is one landmass definition reused by <use>, so the 22 kB of
  // path data is parsed once instead of once per depth step.
  const depth = Array.from({ length: 9 }, (_, step) => step)

  return (
    <figure className="language-map">
      <div className="map-stage">
        <div className="map-globe">
          <div className="map-graticule" aria-hidden="true" />
          <svg
            className="archipelago-svg"
            viewBox={`0 0 ${mapViewBox.width} ${mapViewBox.height}`}
            role="img"
            aria-labelledby="map-title map-desc"
          >
            <title id="map-title">Philippine language coverage map</title>
            <desc id="map-desc">
              An extruded relief map of the Philippines. A marker sits at the centre of each of the
              nine Philippine languages in the Philippine Language Dataset, sized by how many times
              that language&rsquo;s models have been downloaded from the Hugging Face Hub.
            </desc>

            <defs>
              <g id="ph-landmass">
                {philippinesMapPaths.map((path, index) => <path d={path} key={index} />)}
              </g>
              <linearGradient id="ph-surface" x1="0" y1="0" x2=".65" y2="1">
                <stop offset="0" className="surface-stop-a" />
                <stop offset="1" className="surface-stop-b" />
              </linearGradient>
              <filter id="ph-shadow" x="-25%" y="-15%" width="160%" height="145%">
                <feDropShadow dx="5" dy="12" stdDeviation="7" floodColor="#0B0906" floodOpacity=".26" />
              </filter>
            </defs>

            <g className="map-cast-shadow" filter="url(#ph-shadow)" transform="translate(7 13)">
              <use href="#ph-landmass" />
            </g>

            <g className="map-extrusion">
              {depth.map((step) => (
                <use href="#ph-landmass" key={step} transform={`translate(0 ${(depth.length - step) * 1.15})`} style={{ opacity: 0.22 + step * 0.07 }} />
              ))}
            </g>

            <g className="map-surface">
              <use href="#ph-landmass" />
            </g>

            <g className="map-markers">
              {layers.map((layer) => {
                const isActive = layer.id === activeId
                const toLeft = layer.side === 'left'
                const gap = layer.radius + 6
                return (
                  <g
                    key={layer.id}
                    className={`map-marker${isActive ? ' is-active' : ''}`}
                    onPointerEnter={() => setActiveId(layer.id)}
                    onClick={() => setActiveId(layer.id)}
                  >
                    {isActive && <circle className="marker-sonar" cx={layer.x} cy={layer.y} r={layer.radius + 3.5} />}
                    <circle className="marker-halo" cx={layer.x} cy={layer.y} r={layer.radius + 5.5} />
                    <circle className="marker-dot" cx={layer.x} cy={layer.y} r={layer.radius} />
                    <circle className="marker-core" cx={layer.x} cy={layer.y} r={layer.radius * 0.34} />
                    <line
                      className="marker-leader"
                      x1={layer.x + (toLeft ? -gap : gap)}
                      y1={layer.y}
                      x2={layer.x + (toLeft ? -gap - 5 : gap + 5)}
                      y2={layer.y}
                    />
                    <text
                      className="marker-label"
                      x={layer.x + (toLeft ? -gap - 8 : gap + 8)}
                      y={layer.y + 3}
                      textAnchor={toLeft ? 'end' : 'start'}
                    >
                      {layer.code}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>

          <div className="map-compass" aria-hidden="true"><i /><span>N</span></div>
        </div>

        <div className="map-panel">
          <div className="map-readout" aria-live="polite">
            <span className="map-readout-label">Active layer</span>
            <strong>{active.label}</strong>
            <small>{active.region}</small>
            <dl className="map-readout-stats">
              <div><dt>Models</dt><dd>{active.models}</dd></div>
              <div><dt>Downloads 30d</dt><dd>{active.downloads.toLocaleString()}</dd></div>
            </dl>
            <p className="map-readout-tasks">{active.tasks.join(' · ')}</p>
          </div>

          <p className="map-panel-head">Language layers <span>{layers.length}</span></p>

          <div className="map-layers" role="group" aria-label="Choose a Philippine language layer">
            {layers.map((layer) => (
              <button
                type="button"
                key={layer.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setActiveId(layer.id)}
                onPointerEnter={() => setActiveId(layer.id)}
                onFocus={() => setActiveId(layer.id)}
                aria-pressed={layer.id === activeId}
                className={layer.id === activeId ? 'is-active' : ''}
              >
                <span>{layer.code}</span>
                <i>{layer.label}</i>
                <b>{layer.downloads}</b>
              </button>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="map-note">
        Marker size tracks model downloads over the last 30 days ({totalDownloads.toLocaleString()} across these languages). Positions are
        research orientation markers, not language boundaries — the PLD also includes English as a training language.
      </figcaption>
    </figure>
  )
}
