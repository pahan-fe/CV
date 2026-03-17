<script setup lang="ts">
const props = defineProps<{ dark: boolean }>()

const canvas = ref<HTMLCanvasElement>()
let animationId: number

const DARK_COLORS = [
  [255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
  [255, 240, 220], [255, 230, 200], [255, 210, 170],
  [200, 220, 255], [180, 200, 255], [255, 180, 150],
]

interface Star {
  x: number; y: number; radius: number
  speed: number; phase: number; color: number[]
}

interface Tentacle {
  angle: number; maxLen: number; len: number
  phase: 'wait' | 'grow' | 'hold' | 'shrink'
  timer: number; wait: number
  speed: number; wave: number; freq: number
  thick: number
}

interface Symbiote {
  x: number; y: number
  radius: number
  opacity: number
  pulse: number
  pulseSpeed: number
  blobs: Blob[]
  tentacles: Tentacle[]
}

function createTentacle(): Tentacle {
  return {
    angle: Math.random() * Math.PI * 2,
    maxLen: 30 + Math.random() * 60,
    len: 0,
    phase: 'wait',
    timer: 0,
    wait: 1000 + Math.random() * 5000,
    speed: 0.2 + Math.random() * 0.3,
    wave: 5 + Math.random() * 10,
    freq: 0.04 + Math.random() * 0.04,
    thick: 1 + Math.random() * 1.5,
  }
}

interface Blob {
  ox: number; oy: number
  r: number; phase: number; speed: number
}

function createSymbiote(w: number, h: number): Symbiote {
  const blobCount = 3 + Math.floor(Math.random() * 3)
  const baseR = 10 + Math.random() * 16
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    radius: baseR,
    opacity: 0.08 + Math.random() * 0.06,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.001 + Math.random() * 0.001,
    blobs: Array.from({ length: blobCount }, () => ({
      ox: (Math.random() - 0.5) * baseR * 0.8,
      oy: (Math.random() - 0.5) * baseR * 0.8,
      r: baseR * (0.5 + Math.random() * 0.6),
      phase: Math.random() * Math.PI * 2,
      speed: 0.0005 + Math.random() * 0.001,
    })),
    tentacles: Array.from({ length: 3 + Math.floor(Math.random() * 3) }, createTentacle),
  }
}

onMounted(() => {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return

  let stars: Star[] = []
  let symbiotes: Symbiote[] = []
  let width = 0
  let height = 0

  function resize() {
    width = el.offsetWidth
    height = el.offsetHeight
    el.width = width * devicePixelRatio
    el.height = height * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    initStars()
    initSymbiotes()
  }

  function initStars() {
    const count = Math.floor((width * height) / 4000)
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)],
    }))
  }

  function initSymbiotes() {
    const count = Math.max(4, Math.floor((width * height) / 150000))
    symbiotes = Array.from({ length: count }, () => createSymbiote(width, height))
  }

  function drawStars(time: number) {
    for (const s of stars) {
      const flicker = (Math.sin(time * s.speed + s.phase) + 1) / 2
      const alpha = 0.3 + flicker * 0.7
      const [cr, cg, cb] = s.color
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius)
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`)
      g.addColorStop(0.4, `rgba(${cr},${cg},${cb},${alpha * 0.5})`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
  }

  function drawSymbiotes(time: number, dt: number) {
    for (const s of symbiotes) {
      const breathe = 1 + Math.sin(time * s.pulseSpeed + s.pulse) * 0.15

      for (const b of s.blobs) {
        const drift = Math.sin(time * b.speed + b.phase) * 3
        const bx = s.x + b.ox + drift
        const by = s.y + b.oy + Math.cos(time * b.speed + b.phase) * 2
        const br = b.r * breathe
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        g.addColorStop(0, `rgba(0, 0, 0, ${s.opacity})`)
        g.addColorStop(0.6, `rgba(0, 0, 0, ${s.opacity * 0.5})`)
        g.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.beginPath()
        ctx.arc(bx, by, br, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      const r = s.radius * breathe

      for (const t of s.tentacles) {
        switch (t.phase) {
          case 'wait':
            t.timer += dt
            if (t.timer >= t.wait) { t.phase = 'grow'; t.timer = 0 }
            break
          case 'grow':
            t.len += t.speed * dt * 0.06
            if (t.len >= t.maxLen) { t.len = t.maxLen; t.phase = 'hold'; t.timer = 0 }
            break
          case 'hold':
            t.timer += dt
            if (t.timer >= 600 + Math.random() * 400) { t.phase = 'shrink' }
            break
          case 'shrink':
            t.len -= t.speed * dt * 0.04
            if (t.len <= 0) {
              t.len = 0; t.phase = 'wait'; t.timer = 0
              t.wait = 2000 + Math.random() * 6000
              t.angle += (Math.random() - 0.5) * 1.5
              t.maxLen = 30 + Math.random() * 60
            }
            break
        }

        if (t.len <= 1) continue

        const steps = Math.ceil(t.len / 2)
        const startX = s.x + Math.cos(t.angle) * r * 0.6
        const startY = s.y + Math.sin(t.angle) * r * 0.6

        ctx.beginPath()
        ctx.moveTo(startX, startY)

        for (let i = 1; i <= steps; i++) {
          const frac = i / steps
          const dist = frac * t.len
          const sway = Math.sin(dist * t.freq + time * 0.002) * t.wave * frac
          const perpA = t.angle + Math.PI / 2
          const px = startX + Math.cos(t.angle) * dist + Math.cos(perpA) * sway
          const py = startY + Math.sin(t.angle) * dist + Math.sin(perpA) * sway
          ctx.lineTo(px, py)
        }

        const fade = t.len / t.maxLen
        const taper = t.thick * fade
        ctx.strokeStyle = `rgba(0, 0, 0, ${s.opacity * 1.8 * fade})`
        ctx.lineWidth = Math.max(0.5, taper * (1 - 0.7 * (t.len / t.maxLen > 0.8 ? 1 : 0)))
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      }
    }
  }

  let lastTime = 0
  function draw(time: number) {
    const dt = lastTime ? time - lastTime : 16
    lastTime = time
    ctx.clearRect(0, 0, width, height)

    if (props.dark) {
      drawStars(time)
    } else {
      drawSymbiotes(time, dt)
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
