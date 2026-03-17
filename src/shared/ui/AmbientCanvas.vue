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

interface ShootingStar {
  x: number; y: number
  vx: number; vy: number
  len: number; life: number; maxLife: number
  color: number[]
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

const createTentacle = (): Tentacle => ({
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
})

interface Spore {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  size: number; curve: number
}

interface Link {
  a: number; b: number
  life: number; maxLife: number
  ctrl: { x: number; y: number }
}

interface Blob {
  ox: number; oy: number
  r: number; phase: number; speed: number
}

const createSymbiote = (w: number, h: number): Symbiote => {
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
  if (!el) {
    return
  }
  const ctx = el.getContext('2d')
  if (!ctx) {
    return
  }

  let stars: Star[] = []
  const shootingStars: ShootingStar[] = []
  let symbiotes: Symbiote[] = []
  const spores: Spore[] = []
  const links: Link[] = []
  let width = 0
  let height = 0
  let shootingTimer = 0
  let sporeTimer = 0
  let linkTimer = 0

  const resize = () => {
    width = el.offsetWidth
    height = el.offsetHeight
    el.width = width * devicePixelRatio
    el.height = height * devicePixelRatio
    ctx.scale(devicePixelRatio, devicePixelRatio)
    initStars()
    initSymbiotes()
  }

  const initStars = () => {
    const count = Math.floor((width * height) / 4000)
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)]!,
    }))
  }

  const initSymbiotes = () => {
    const count = Math.max(4, Math.floor((width * height) / 150000))
    symbiotes = Array.from({ length: count }, () => createSymbiote(width, height))
  }

  const drawStars = (time: number) => {
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

  const spawnShootingStar = () => {
    const edge = Math.random()
    let x: number, y: number
    if (edge < 0.7) {
      x = Math.random() * width
      y = -10
    } else {
      x = width + 10
      y = Math.random() * height * 0.5
    }
    const angle = Math.PI * (0.15 + Math.random() * 0.25)
    const speed = 4 + Math.random() * 6
    const color = DARK_COLORS[Math.floor(Math.random() * DARK_COLORS.length)]!
    shootingStars.push({
      x, y,
      vx: Math.cos(angle) * speed * (edge < 0.7 ? 1 : -1),
      vy: Math.sin(angle) * speed,
      len: 40 + Math.random() * 80,
      life: 0,
      maxLife: 800 + Math.random() * 1200,
      color,
    })
  }

  const drawShootingStars = (dt: number) => {
    shootingTimer += dt
    if (shootingTimer > 2000 + Math.random() * 4000) {
      shootingTimer = 0
      spawnShootingStar()
    }

    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i]!
      s.life += dt
      s.x += s.vx * (dt / 16)
      s.y += s.vy * (dt / 16)

      const progress = s.life / s.maxLife
      const alpha = progress < 0.1
        ? progress / 0.1
        : progress > 0.7
          ? 1 - (progress - 0.7) / 0.3
          : 1

      if (s.life >= s.maxLife || s.x < -100 || s.x > width + 100 || s.y > height + 100) {
        shootingStars.splice(i, 1)
        continue
      }

      const [cr, cg, cb] = s.color
      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
      const nx = -s.vx / speed
      const ny = -s.vy / speed

      const grad = ctx.createLinearGradient(s.x, s.y, s.x + nx * s.len, s.y + ny * s.len)
      grad.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha * 0.9})`)
      grad.addColorStop(0.3, `rgba(${cr},${cg},${cb},${alpha * 0.4})`)
      grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)

      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x + nx * s.len, s.y + ny * s.len)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.stroke()

      const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 3)
      headGrad.addColorStop(0, `rgba(255,255,255,${alpha})`)
      headGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath()
      ctx.arc(s.x, s.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = headGrad
      ctx.fill()
    }
  }

  const spawnSpore = () => {
    if (symbiotes.length === 0) return
    const src = symbiotes[Math.floor(Math.random() * symbiotes.length)]!
    const angle = Math.random() * Math.PI * 2
    const speed = 1.5 + Math.random() * 3
    spores.push({
      x: src.x,
      y: src.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 1200 + Math.random() * 1800,
      size: 2 + Math.random() * 3,
      curve: (Math.random() - 0.5) * 0.03,
    })
  }

  const drawSpores = (dt: number) => {
    sporeTimer += dt
    if (sporeTimer > 3000 + Math.random() * 5000) {
      sporeTimer = 0
      spawnSpore()
    }

    for (let i = spores.length - 1; i >= 0; i--) {
      const s = spores[i]!
      s.life += dt
      const t = dt / 16
      s.vx += s.curve * t
      s.vy += s.curve * 0.5 * t
      s.x += s.vx * t
      s.y += s.vy * t

      const progress = s.life / s.maxLife
      const alpha = progress < 0.1
        ? progress / 0.1
        : progress > 0.6
          ? 1 - (progress - 0.6) / 0.4
          : 1

      if (s.life >= s.maxLife || s.x < -50 || s.x > width + 50 || s.y < -50 || s.y > height + 50) {
        spores.splice(i, 1)
        continue
      }

      const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
      const nx = -s.vx / speed
      const ny = -s.vy / speed
      const tailLen = 15 + speed * 8

      const grad = ctx.createLinearGradient(s.x, s.y, s.x + nx * tailLen, s.y + ny * tailLen)
      grad.addColorStop(0, `rgba(0,0,0,${alpha * 0.12})`)
      grad.addColorStop(0.5, `rgba(0,0,0,${alpha * 0.05})`)
      grad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x + nx * tailLen, s.y + ny * tailLen)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1
      ctx.lineCap = 'round'
      ctx.stroke()

      const headGrad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size)
      headGrad.addColorStop(0, `rgba(0,0,0,${alpha * 0.15})`)
      headGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fillStyle = headGrad
      ctx.fill()
    }
  }

  const spawnLink = () => {
    if (symbiotes.length < 2) return
    let bestA = 0, bestB = 1, bestDist = Infinity
    for (let i = 0; i < symbiotes.length; i++) {
      for (let j = i + 1; j < symbiotes.length; j++) {
        const dx = symbiotes[i]!.x - symbiotes[j]!.x
        const dy = symbiotes[i]!.y - symbiotes[j]!.y
        const d = dx * dx + dy * dy
        if (d < bestDist && d > 2500) {
          bestDist = d
          bestA = i
          bestB = j
        }
      }
    }
    const a = symbiotes[bestA]!
    const b = symbiotes[bestB]!
    const mx = (a.x + b.x) / 2
    const my = (a.y + b.y) / 2
    const offset = 30 + Math.random() * 50
    const angle = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2
    links.push({
      a: bestA,
      b: bestB,
      life: 0,
      maxLife: 2000 + Math.random() * 2000,
      ctrl: {
        x: mx + Math.cos(angle) * offset * (Math.random() > 0.5 ? 1 : -1),
        y: my + Math.sin(angle) * offset * (Math.random() > 0.5 ? 1 : -1),
      },
    })
  }

  const drawLinks = (dt: number) => {
    linkTimer += dt
    if (linkTimer > 5000 + Math.random() * 8000) {
      linkTimer = 0
      spawnLink()
    }

    for (let i = links.length - 1; i >= 0; i--) {
      const l = links[i]!
      l.life += dt
      const progress = l.life / l.maxLife
      const alpha = progress < 0.2
        ? progress / 0.2
        : progress > 0.7
          ? 1 - (progress - 0.7) / 0.3
          : 1

      if (l.life >= l.maxLife) {
        links.splice(i, 1)
        continue
      }

      const a = symbiotes[l.a]
      const b = symbiotes[l.b]
      if (!a || !b) {
        links.splice(i, 1)
        continue
      }

      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.quadraticCurveTo(l.ctrl.x, l.ctrl.y, b.x, b.y)
      ctx.strokeStyle = `rgba(0,0,0,${alpha * 0.06})`
      ctx.lineWidth = 0.8
      ctx.lineCap = 'round'
      ctx.stroke()
    }
  }

  const drawSymbiotes = (time: number, dt: number) => {
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
            if (t.timer >= t.wait) {
              t.phase = 'grow'
              t.timer = 0
            }
            break
          case 'grow':
            t.len += t.speed * dt * 0.06
            if (t.len >= t.maxLen) {
              t.len = t.maxLen
              t.phase = 'hold'
              t.timer = 0
            }
            break
          case 'hold':
            t.timer += dt
            if (t.timer >= 600 + Math.random() * 400) {
              t.phase = 'shrink'
            }
            break
          case 'shrink':
            t.len -= t.speed * dt * 0.04
            if (t.len <= 0) {
              t.len = 0
              t.phase = 'wait'
              t.timer = 0
              t.wait = 2000 + Math.random() * 6000
              t.angle += (Math.random() - 0.5) * 1.5
              t.maxLen = 30 + Math.random() * 60
            }
            break
        }

        if (t.len <= 1) {
          continue
        }

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
  const draw = (time: number) => {
    const dt = lastTime ? time - lastTime : 16
    lastTime = time
    ctx.clearRect(0, 0, width, height)

    if (props.dark) {
      drawStars(time)
      drawShootingStars(dt)
    } else {
      drawLinks(dt)
      drawSymbiotes(time, dt)
      drawSpores(dt)
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
