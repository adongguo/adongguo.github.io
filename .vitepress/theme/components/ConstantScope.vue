<script setup lang="ts">
import { createScope } from '../../lib/scope.mjs'

const scope = createScope()
const { plot } = scope

const digits = `${Math.E}…`
const units = scope.markers.map((marker) => marker.unit).join('、')
const values = scope.markers.map((marker) => marker.value.toFixed(3)).join('、')
const label = `复利越频繁，(1 + 1/n) 的 n 次方越接近自然常量 e ≈ 2.71828：按${units}复利依次为 ${values}。`
</script>

<template>
  <div class="zt-scope" role="img" :aria-label="label">
    <svg
      class="screen"
      :viewBox="`0 0 ${scope.width} ${scope.height}`"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="zt-scope-spectrum"
          gradientUnits="userSpaceOnUse"
          :x1="plot.left"
          y1="0"
          :x2="plot.right"
          y2="0"
        >
          <stop offset="0" class="stop-1" />
          <stop offset="0.3" class="stop-2" />
          <stop offset="0.65" class="stop-3" />
          <stop offset="1" class="stop-4" />
        </linearGradient>
        <filter id="zt-scope-glow" x="-10%" y="-40%" width="120%" height="180%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <g class="grid">
        <line
          v-for="column in scope.columns"
          :key="`column-${column.x}`"
          :class="{ major: column.major }"
          :x1="column.x"
          :x2="column.x"
          :y1="plot.top"
          :y2="plot.bottom"
        />
        <line
          v-for="row in scope.rows"
          :key="`row-${row.y}`"
          :class="{ major: row.major }"
          :x1="plot.left"
          :x2="plot.right"
          :y1="row.y"
          :y2="row.y"
        />
      </g>

      <g class="axis">
        <text
          v-for="tick in scope.ticks"
          :key="tick.label"
          class="tick"
          :x="plot.left - 8"
          :y="tick.y"
          dy="0.35em"
        >{{ tick.label }}</text>
        <template v-for="marker in scope.markers" :key="`label-${marker.n}`">
          <text class="count" :x="marker.x" :y="plot.bottom + 24">{{ marker.n }}</text>
          <text class="unit" :x="marker.x" :y="plot.bottom + 42">{{ marker.unit }}</text>
        </template>
      </g>

      <line class="constant" :x1="plot.left" :x2="plot.right" :y1="scope.e" :y2="scope.e" />
      <text class="constant-label" :x="plot.right + 12" :y="scope.e" dy="0.35em">e</text>

      <path class="trace glow" :d="scope.trace" pathLength="1" filter="url(#zt-scope-glow)" />
      <path class="trace" :d="scope.trace" pathLength="1" />

      <circle
        v-for="marker in scope.markers"
        :key="`marker-${marker.n}`"
        class="marker"
        :cx="marker.x"
        :cy="marker.y"
        r="3.5"
        :style="{ '--at': marker.at }"
      />

      <circle class="lock-pulse" :cx="scope.end.x" :cy="scope.end.y" r="5" />
      <circle class="lock" :cx="scope.end.x" :cy="scope.end.y" r="4.5" />
    </svg>

    <div class="readout" aria-hidden="true">
      <p class="formula">(1 + 1/n)<sup>n</sup></p>
      <p class="value"><span class="symbol">e</span> = <span class="digits">{{ digits }}</span></p>
    </div>
  </div>
</template>

<style scoped>
/* The trace is plotted over --draw; markers pop in as the trace reaches them,
   then the end of the trace locks onto e and the digits of e are read out. */
.zt-scope {
  --delay: 0.3s;
  --draw: 2.2s;

  position: absolute;
  inset: 0;
  container-type: inline-size;
  /* Opaque so the viewport's square graph paper does not show through the
     semi-log grid drawn here. */
  background-color: var(--zt-scope-bg);
}

.screen {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.stop-1 { stop-color: var(--zt-spectrum-1); }
.stop-2 { stop-color: var(--zt-spectrum-2); }
.stop-3 { stop-color: var(--zt-spectrum-3); }
.stop-4 { stop-color: var(--zt-spectrum-4); }

.grid line {
  stroke: var(--zt-scope-grid);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.grid line.major {
  stroke: var(--zt-scope-grid-major);
}

.axis text {
  font-family: var(--zt-font-mono);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
  text-anchor: middle;
}

.axis .tick {
  fill: var(--zt-text-3);
  text-anchor: end;
}

.axis .count {
  fill: var(--zt-text-2);
}

.axis .unit {
  font-family: var(--vp-font-family-base);
  fill: var(--zt-text-3);
}

.constant {
  stroke: var(--zt-signal);
  stroke-opacity: 0.6;
  stroke-width: 1;
  stroke-dasharray: 3 5;
  vector-effect: non-scaling-stroke;
  animation: zt-scope-fade 0.8s ease-out 0.1s both;
}

.constant-label {
  fill: var(--zt-signal);
  font-family: var(--zt-font-mono);
  font-size: 15px;
  font-weight: 700;
  animation: zt-scope-fade 0.8s ease-out 0.1s both;
}

.trace {
  fill: none;
  stroke: url(#zt-scope-spectrum);
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1 1;
  animation: zt-scope-draw var(--draw) linear var(--delay) both;
}

.trace.glow {
  stroke-width: 7;
  opacity: var(--zt-scope-glow-opacity);
}

.marker {
  fill: var(--zt-scope-bg);
  stroke: url(#zt-scope-spectrum);
  stroke-width: 1.75;
  transform-box: fill-box;
  transform-origin: center;
  animation: zt-scope-pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
  animation-delay: calc(var(--delay) + var(--at) * var(--draw));
}

.lock {
  fill: var(--zt-scope-bg);
  stroke: var(--zt-text-1);
  stroke-width: 2;
  transform-box: fill-box;
  transform-origin: center;
  animation: zt-scope-pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
  animation-delay: calc(var(--delay) + var(--draw));
}

.lock-pulse {
  fill: none;
  stroke: var(--zt-signal);
  stroke-width: 1.5;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  animation: zt-scope-ring 2.8s ease-out infinite backwards;
  animation-delay: calc(var(--delay) + var(--draw) + 0.4s);
}

.readout {
  position: absolute;
  top: 7.5%;
  left: 12%;
  right: 8%;
  font-family: var(--zt-font-mono);
  pointer-events: none;
}

.formula,
.value {
  margin: 0;
  white-space: nowrap;
}

/* Pixel sizes first for browsers without container query units. */
.formula {
  font-size: 11px;
  font-size: 2.9cqw;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: var(--zt-text-3);
}

.formula sup {
  font-size: 0.72em;
  line-height: 0;
  vertical-align: 0.55em;
}

.value {
  margin-top: 4px;
  margin-top: 1.2cqw;
  font-size: 16px;
  font-size: 4.6cqw;
  line-height: 1.3;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--zt-text-1);
}

.symbol {
  font-weight: 700;
  color: var(--zt-signal);
}

.digits {
  display: inline-block;
  animation: zt-scope-type 1.2s steps(18, end) both;
  animation-delay: calc(var(--delay) + var(--draw) + 0.1s);
}

@keyframes zt-scope-draw {
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
}

@keyframes zt-scope-fade {
  from { opacity: 0; }
}

@keyframes zt-scope-pop {
  from { opacity: 0; transform: scale(0.2); }
}

@keyframes zt-scope-ring {
  0% { opacity: 0; transform: scale(1); }
  8% { opacity: 0.9; }
  100% { opacity: 0; transform: scale(3.4); }
}

@keyframes zt-scope-type {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

@media (prefers-reduced-motion: reduce) {
  .zt-scope *,
  .zt-scope *::before,
  .zt-scope *::after {
    animation: none !important;
  }
}
</style>
