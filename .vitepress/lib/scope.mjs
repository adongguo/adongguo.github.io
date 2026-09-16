// Geometry for the scope in the home hero: the compound interest sequence
// (1 + 1/n)^n drawn on semi-log paper as it settles on e. Plain ESM with no
// dependencies so node:test can exercise it, and deterministic so the SVG
// rendered at build time hydrates without mismatches.

/** Compounding once a year, month, week, day and hour. */
export const COMPOUNDING_STEPS = Object.freeze([
  Object.freeze({ n: 1, unit: '年' }),
  Object.freeze({ n: 12, unit: '月' }),
  Object.freeze({ n: 52, unit: '周' }),
  Object.freeze({ n: 365, unit: '日' }),
  Object.freeze({ n: 8760, unit: '时' }),
])

/**
 * @typedef {{
 *   width: number,
 *   height: number,
 *   plot: { left: number, right: number, top: number, bottom: number },
 *   decades: number,
 *   range: readonly [number, number],
 *   samples: number,
 * }} ScopeOptions
 */

/**
 * Coordinates are SVG user units in a square viewBox. The plot runs one decade
 * past hourly compounding so the trace visibly holds on e before it ends.
 */
export const DEFAULT_SCOPE = Object.freeze({
  width: 400,
  height: 400,
  plot: Object.freeze({ left: 48, right: 352, top: 116, bottom: 324 }),
  decades: 5,
  range: Object.freeze([1.9, 2.8]),
  samples: 200,
})

/** @param {number} n */
export function compound(n) {
  return (1 + 1 / n) ** n
}

/** @param {number} value */
function round(value) {
  return Math.round(value * 100) / 100
}

/**
 * @param {ScopeOptions} [options]
 */
export function createScope(options = DEFAULT_SCOPE) {
  const { plot, decades, samples } = options
  const [min, max] = options.range
  const x = (n) => plot.left + (Math.log10(n) / decades) * (plot.right - plot.left)
  const y = (value) => plot.bottom - ((value - min) / (max - min)) * (plot.bottom - plot.top)

  // Samples are evenly spaced in log n, so each marker falls between two known
  // samples and its distance along the trace can be interpolated.
  const points = []
  for (let index = 0; index <= samples; index += 1) {
    const n = 10 ** ((index / samples) * decades)
    points.push([round(x(n)), round(y(compound(n)))])
  }
  const lengths = [0]
  for (let index = 1; index < points.length; index += 1) {
    const [x0, y0] = points[index - 1]
    const [x1, y1] = points[index]
    lengths.push(lengths[index - 1] + Math.hypot(x1 - x0, y1 - y0))
  }
  const total = lengths[lengths.length - 1]

  const traceFraction = (n) => {
    const position = (Math.log10(n) / decades) * samples
    const index = Math.min(Math.floor(position), samples - 1)
    const length = lengths[index] + (lengths[index + 1] - lengths[index]) * (position - index)
    return Math.round((length / total) * 1000) / 1000
  }

  const columns = []
  for (let decade = 0; decade <= decades; decade += 1) {
    columns.push({ x: round(x(10 ** decade)), major: true })
    if (decade === decades) break
    for (let multiple = 2; multiple <= 9; multiple += 1) {
      columns.push({ x: round(x(multiple * 10 ** decade)), major: false })
    }
  }

  // Rows every 0.1; stepping in integer tenths avoids drift from adding 0.1.
  const firstTenth = Math.round(min * 10)
  const lastTenth = Math.round(max * 10)
  const rows = []
  for (let tenth = firstTenth; tenth <= lastTenth; tenth += 1) {
    rows.push({
      y: round(y(tenth / 10)),
      major: tenth === firstTenth || tenth === lastTenth || tenth % 5 === 0,
    })
  }

  const ticks = []
  for (let tenth = firstTenth; tenth <= lastTenth; tenth += 1) {
    if (tenth % 5 === 0) ticks.push({ label: (tenth / 10).toFixed(1), y: round(y(tenth / 10)) })
  }

  const last = points[points.length - 1]
  return {
    width: options.width,
    height: options.height,
    plot,
    trace: `M${points.map(([px, py]) => `${px} ${py}`).join(' ')}`,
    e: round(y(Math.E)),
    end: { x: last[0], y: last[1] },
    markers: COMPOUNDING_STEPS.map(({ n, unit }) => ({
      n,
      unit,
      value: compound(n),
      x: round(x(n)),
      y: round(y(compound(n))),
      at: traceFraction(n),
    })),
    columns,
    rows,
    ticks,
  }
}
