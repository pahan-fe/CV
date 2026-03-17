<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>()
let animationId: number

interface Star {
  x: number
  y: number
  radius: number
  opacity: number
  speed: number
  phase: number
}

onMounted(() => {
  const el = canvas.value
  if (!el) return

  const ctx = el.getContext('2d')
  if (!ctx) return

  let stars: Star[] = []
  let width = 0
  let height = 0

  function resize() {
    width = el.offsetWidth
    height = el.offsetHeight
    el.width = width * devicePixelRatio
    el.height = height * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    init()
  }

  function init() {
    const count = Math.floor((width * height) / 4000)
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      opacity: Math.random(),
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
    }))
  }

  function draw(time: number) {
    ctx.clearRect(0, 0, width, height)

    for (const star of stars) {
      const flicker = (Math.sin(time * star.speed + star.phase) + 1) / 2
      const alpha = 0.3 + flicker * 0.7
      const r = star.radius

      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, r)
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
      gradient.addColorStop(0.4, `rgba(255, 255, 255, ${alpha * 0.5})`)
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.beginPath()
      ctx.arc(star.x, star.y, r, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    animationId = requestAnimationFrame(draw)
  }

  resize()
  animationId = requestAnimationFrame(draw)
  window.addEventListener('resize', resize)

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
})
</script>

<template>
  <canvas ref="canvas" class="starfield" aria-hidden="true" />
</template>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
