<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  defineProps<{ theme: 'dark' | 'light' }>()

  const enabled = ref(false)
  const visible = ref(false)
  const hovering = ref(false)
  const pressed = ref(false)
  const x = ref(0)
  const y = ref(0)
  const angle = ref(0)
  const trail = ref<Array<{ x: number, y: number }>>([])
  const tick = ref(0)

  let rawX = 0
  let rawY = 0
  let prevX = 0
  let prevY = 0
  let targetAngle = 0
  let raf = 0

  const TRAIL_LEN = 18
  const INTERACTIVE = 'a, button, [role="button"], label, input, textarea, select, .tag, .card, .article-link, .contact-card'

  const onMove = (e: MouseEvent) => {
    rawX = e.clientX
    rawY = e.clientY

    if (!visible.value) {
      x.value = rawX
      y.value = rawY
      prevX = rawX
      prevY = rawY
      trail.value = Array.from({ length: TRAIL_LEN }, () => ({ x: rawX, y: rawY }))
      visible.value = true
    }
  }

  const onEnterDoc = () => { /* will become visible on next move */ }

  const onLeaveDoc = () => { 
    visible.value = false 
  }

  const onOver = (e: MouseEvent) => {
    const t = e.target as HTMLElement | null
    hovering.value = !!(t && t.closest && t.closest(INTERACTIVE))
  }

  const onDown = () => { 
    pressed.value = true
  }

  const onUp = () => { 
    pressed.value = false
  }

  const animate = () => {
    const lerp = 0.32
    x.value += (rawX - x.value) * lerp
    y.value += (rawY - y.value) * lerp

    const dx = x.value - prevX
    const dy = y.value - prevY
    prevX = x.value
    prevY = y.value

    trail.value.unshift({ x: x.value, y: y.value })
    if (trail.value.length > TRAIL_LEN) {
      trail.value.length = TRAIL_LEN
    }

    const speed = Math.hypot(dx, dy)
    if (speed > 0.35) {
      targetAngle = Math.atan2(dy, dx)
    }

    let diff = targetAngle - angle.value
    while (diff > Math.PI) {
      diff -= Math.PI * 2
    }
    while (diff < -Math.PI) {
      diff += Math.PI * 2
    }
    angle.value += diff * 0.18

    tick.value += 1
    raf = requestAnimationFrame(animate)
  }

  onMounted(() => {
    if (typeof window === 'undefined') {
      return
    }

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!canHover || reduced) {
      return
    }

    enabled.value = true
    document.documentElement.classList.add('custom-cursor-on')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('mouseup', onUp, { passive: true })
    document.addEventListener('mouseenter', onEnterDoc)
    document.addEventListener('mouseleave', onLeaveDoc)

    raf = requestAnimationFrame(animate)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf)
    if (typeof window !== 'undefined') {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseenter', onEnterDoc)
      document.removeEventListener('mouseleave', onLeaveDoc)
      document.documentElement.classList.remove('custom-cursor-on')
    }
  })

  const angleDeg = computed(() => (angle.value * 180) / Math.PI)

  const flagellumPath = computed(() => {
    const t = tick.value * 0.18
    const segments = 9
    const len = hovering.value ? 32 : 28
    const ampMax = hovering.value ? 5.2 : 4.2
    let d = 'M 0 0'

    for (let i = 1; i <= segments; i++) {
      const r = i / segments
      const px = -r * len
      const py = Math.sin(t - i * 0.62) * ampMax * r
      const rMid = (i - 0.5) / segments
      const cpx = -rMid * len
      const cpy = Math.sin(t - (i - 0.5) * 0.62) * ampMax * rMid * 1.45

      d += ` Q ${cpx.toFixed(2)} ${cpy.toFixed(2)}, ${px.toFixed(2)} ${py.toFixed(2)}`
    }

    return d
  })

  const ciliaPaths = computed(() => {
    const t = tick.value * 0.22
    const count = 8
    const out: Array<{ d: string, op: number }> = []

    for (let i = 0; i < count; i++) {
      const baseAngle = Math.PI / 2 + ((i / (count - 1)) - 0.5) * Math.PI * 0.9
      const side = i % 2 === 0 ? 1 : -1
      const a = baseAngle * side
      const bodyRx = 5.5
      const bodyRy = 3.8
      const x0 = Math.cos(a) * bodyRx
      const y0 = Math.sin(a) * bodyRy
      const wave = Math.sin(t + i * 0.7) * 1.4
      const reach = 3.5
      const x1 = x0 + Math.cos(a) * reach + wave * Math.cos(a + Math.PI / 2) * 0.5
      const y1 = y0 + Math.sin(a) * reach + wave * Math.sin(a + Math.PI / 2) * 0.5
      
      out.push({
        d: `M ${x0.toFixed(2)} ${y0.toFixed(2)} Q ${((x0 + x1) / 2 + wave * 0.3).toFixed(2)} ${((y0 + y1) / 2 + wave * 0.3).toFixed(2)}, ${x1.toFixed(2)} ${y1.toFixed(2)}`,
        op: 0.55,
      })
    }

    return out
  })

  const trailFill = (i: number) => {
    const r = 255
    const g = Math.round(245 - i * 9)
    const b = Math.round(210 - i * 13)
    const alpha = Math.max(0, (1 - i / TRAIL_LEN) * 0.7)

    return `rgba(${r}, ${Math.max(80, g)}, ${Math.max(20, b)}, ${alpha.toFixed(3)})`
  }

  const trailRadius = (i: number) => Math.max(0.4, 4.6 - i * 0.27)
</script>

<template>
  <ClientOnly>
    <svg
      v-if="enabled"
      class="custom-cursor"
      :class="{ 'custom-cursor--visible': visible, 'custom-cursor--hover': hovering, 'custom-cursor--pressed': pressed }"
      :data-theme="theme"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="comet-head" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgb(255, 255, 255)" />
          <stop offset="55%" stop-color="rgb(255, 240, 200)" />
          <stop offset="100%" stop-color="rgba(255, 170, 80, 0.95)" />
        </radialGradient>
        <radialGradient id="comet-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(255, 240, 200, 0.85)" />
          <stop offset="40%" stop-color="rgba(255, 170, 80, 0.35)" />
          <stop offset="100%" stop-color="rgba(255, 80, 20, 0)" />
        </radialGradient>
        <radialGradient id="cell-body" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(94, 234, 212, 0.95)" />
          <stop offset="65%" stop-color="rgba(20, 184, 166, 0.85)" />
          <stop offset="100%" stop-color="rgba(15, 118, 110, 0.95)" />
        </radialGradient>
        <radialGradient id="cell-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(20, 184, 166, 0.55)" />
          <stop offset="60%" stop-color="rgba(20, 184, 166, 0.18)" />
          <stop offset="100%" stop-color="rgba(20, 184, 166, 0)" />
        </radialGradient>
        <filter id="cell-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <g v-if="theme === 'dark'">
        <circle
          v-for="(p, i) in trail.slice(1)"
          :key="`t-${i}`"
          :cx="p.x"
          :cy="p.y"
          :r="trailRadius(i + 1)"
          :fill="trailFill(i + 1)"
        />
        <circle :cx="x" :cy="y" :r="hovering ? 26 : 16" fill="url(#comet-halo)" />
        <circle :cx="x" :cy="y" :r="hovering ? 6 : 4" fill="url(#comet-head)" />
        <circle :cx="x" :cy="y" :r="pressed ? 1.2 : 1.8" fill="rgb(255, 255, 255)" />
      </g>

      <g v-else :transform="`translate(${x} ${y}) rotate(${angleDeg})`">
        <ellipse
          cx="0"
          cy="0"
          :rx="hovering ? 18 : 13"
          :ry="hovering ? 12 : 9"
          fill="url(#cell-glow)"
          filter="url(#cell-blur)"
        />
        <path
          :d="flagellumPath"
          fill="none"
          stroke="rgba(13, 148, 136, 0.85)"
          :stroke-width="hovering ? 1.8 : 1.4"
          stroke-linecap="round"
        />
        <path
          v-for="(c, i) in ciliaPaths"
          :key="`c-${i}`"
          :d="c.d"
          fill="none"
          stroke="rgba(13, 148, 136, 0.7)"
          stroke-width="1"
          stroke-linecap="round"
          :opacity="c.op"
        />
        <ellipse
          cx="0"
          cy="0"
          :rx="hovering ? 7 : 5.5"
          :ry="hovering ? 5 : 3.8"
          fill="url(#cell-body)"
          stroke="rgba(15, 118, 110, 0.9)"
          stroke-width="1"
        />
        <circle :cx="1.2" cy="0" :r="pressed ? 0.9 : 1.5" fill="rgba(15, 118, 110, 0.95)" />
        <circle cx="-2" cy="-0.8" r="0.6" fill="rgba(94, 234, 212, 0.9)" />
      </g>
    </svg>
  </ClientOnly>
</template>

<style scoped>
  .custom-cursor {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 100000;
    opacity: 0;
    transition: opacity 220ms ease-out;
    overflow: visible;
  }

  .custom-cursor--visible {
    opacity: 1;
  }

  .custom-cursor--hover[data-theme='dark'] {
    filter: drop-shadow(0 0 6px rgba(255, 200, 120, 0.45));
  }

  .custom-cursor--hover[data-theme='light'] {
    filter: drop-shadow(0 0 8px rgba(20, 184, 166, 0.55));
  }

  .custom-cursor circle,
  .custom-cursor ellipse,
  .custom-cursor path {
    transition: r 180ms ease-out, rx 180ms ease-out, ry 180ms ease-out, stroke-width 180ms ease-out;
  }
</style>
