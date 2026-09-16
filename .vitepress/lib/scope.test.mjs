import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { COMPOUNDING_STEPS, DEFAULT_SCOPE, compound, createScope } from './scope.mjs'

function tracePoints(trace) {
  const numbers = trace.slice(1).split(' ').map(Number)
  const points = []
  for (let index = 0; index < numbers.length; index += 2) {
    points.push([numbers[index], numbers[index + 1]])
  }
  return points
}

describe('compound', () => {
  it('starts at 2 and approaches e as compounding gets more frequent', () => {
    assert.equal(compound(1), 2)
    const values = COMPOUNDING_STEPS.map(({ n }) => compound(n))
    values.slice(1).forEach((value, index) => assert.ok(value > values[index]))
    assert.ok(values.every((value) => value < Math.E))
    assert.ok(Math.E - compound(8760) < 2e-4)
  })
})

describe('createScope', () => {
  const scope = createScope()
  const { plot } = DEFAULT_SCOPE

  it('traces from the left edge of the plot to the right edge, rising throughout', () => {
    const points = tracePoints(scope.trace)
    assert.equal(points.length, DEFAULT_SCOPE.samples + 1)
    assert.equal(points[0][0], plot.left)
    assert.equal(points.at(-1)[0], plot.right)
    for (const [x, y] of points) {
      assert.ok(Number.isFinite(x) && Number.isFinite(y))
      assert.ok(x >= plot.left && x <= plot.right)
      assert.ok(y >= plot.top && y <= plot.bottom)
    }
    // SVG y grows downwards, so a rising value means a non-increasing y.
    points.slice(1).forEach(([, y], index) => assert.ok(y <= points[index][1]))
    assert.deepEqual(scope.end, { x: points.at(-1)[0], y: points.at(-1)[1] })
  })

  it('draws the e line above every compounding marker and next to the end of the trace', () => {
    assert.ok(scope.e > plot.top && scope.e < plot.bottom)
    assert.ok(scope.markers.every((marker) => marker.y >= scope.e))
    assert.ok(Math.abs(scope.end.y - scope.e) < 0.5)
  })

  it('places one marker per compounding step in order along the trace', () => {
    assert.deepEqual(
      scope.markers.map(({ n, unit }) => ({ n, unit })),
      COMPOUNDING_STEPS.map(({ n, unit }) => ({ n, unit })),
    )
    assert.equal(scope.markers[0].x, plot.left)
    assert.equal(scope.markers[0].at, 0)
    scope.markers.slice(1).forEach((marker, index) => {
      assert.ok(marker.x > scope.markers[index].x)
      assert.ok(marker.at > scope.markers[index].at)
      assert.ok(marker.at <= 1)
    })
  })

  it('rules semi-log paper: decades are major columns with eight minor columns between them', () => {
    const major = scope.columns.filter((column) => column.major)
    assert.equal(major.length, DEFAULT_SCOPE.decades + 1)
    assert.equal(scope.columns.length - major.length, DEFAULT_SCOPE.decades * 8)
    assert.equal(major[0].x, plot.left)
    assert.equal(major.at(-1).x, plot.right)
  })

  it('rules a row every 0.1 with the plot edges and half units as major rows', () => {
    assert.equal(scope.rows.length, 10)
    assert.equal(scope.rows[0].y, plot.bottom)
    assert.equal(scope.rows.at(-1).y, plot.top)
    assert.deepEqual(
      scope.rows.filter((row) => row.major).map((row) => row.y),
      [plot.bottom, scope.ticks[0].y, scope.ticks[1].y, plot.top],
    )
    assert.deepEqual(scope.ticks.map((tick) => tick.label), ['2.0', '2.5'])
  })

  it('is deterministic so server and client renders match', () => {
    assert.deepEqual(createScope(), scope)
  })
})
