<script setup lang="ts">
import { createDarkRenderer } from './ambient/draw-dark'
import { createLightRenderer } from './ambient/draw-light'

const props = defineProps<{ dark: boolean; scrollY: number }>()

const canvas = ref<HTMLCanvasElement>()
let animationId: number

onMounted(() => {
  const el = canvas.value
  if (!el) { return }
  const ctx = el.getContext('2d')
  if (!ctx) { return }

  const dark = createDarkRenderer(ctx)
  const light = createLightRenderer(ctx)

  let width = 0
  let height = 0

  const resize = () => {
    width = el.offsetWidth
    height = el.offsetHeight
    el.width = width * devicePixelRatio
    el.height = height * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    dark.init(width, height)
    light.init(width, height)
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let lastTime = 0
  const draw = (time: number) => {
    const dt = lastTime ? time - lastTime : 16
    lastTime = time
    ctx.clearRect(0, 0, width, height)

    const sy = reducedMotion ? 0 : props.scrollY

    if (props.dark) {
      dark.draw(time, dt, width, height, sy)
    } else {
      light.draw(time, dt, width, height, sy)
    }

    animationId = requestAnimationFrame(draw)
  }

  const start = () => {
    if (!animationId) {
      animationId = requestAnimationFrame(draw)
    }
  }

  const stop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = 0
    }
  }

  const onVisibility = () => {
    if (document.hidden) {
      stop()
    } else {
      lastTime = 0
      start()
    }
  }

  resize()
  start()
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibility)

  onBeforeUnmount(() => {
    stop()
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
  })
})
</script>

<template>
  <canvas ref="canvas" class="ambient-canvas" aria-hidden="true" />
</template>

<style scoped>
.ambient-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
