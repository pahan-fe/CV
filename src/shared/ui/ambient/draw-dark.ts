const STAR_COLORS = [
  [255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255], [255, 255, 255],
  [255, 240, 220], [255, 230, 200], [255, 210, 170],
  [200, 220, 255], [180, 200, 255], [255, 180, 150],
]

const NEBULA_COLORS: number[][] = [
  [80, 60, 200],
  [160, 50, 140],
  [60, 140, 180],
  [180, 50, 50],
  [100, 80, 200],
  [40, 100, 160],
]

const GALAXY_COLORS: number[][] = [
  [200, 180, 255],
  [255, 220, 160],
  [180, 210, 255],
  [255, 190, 200],
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

interface NebulaCloud {
  ox: number; oy: number; r: number
  color: number[]; opacity: number
}

interface Nebula {
  x: number; y: number
  clouds: NebulaCloud[]
}

type GalaxyType = 'spiral' | 'elliptical' | 'edge-on'

interface Galaxy {
  x: number; y: number
  type: GalaxyType
  radius: number
  rotation: number
  rotationSpeed: number
  tilt: number
  color: number[]
  arms: number
}

export const createDarkRenderer = (ctx: CanvasRenderingContext2D) => {
  let stars: Star[] = []
  const shootingStars: ShootingStar[] = []
  let nebulae: Nebula[] = []
  let galaxies: Galaxy[] = []
  let shootingTimer = 0

  const initStars = (w: number, h: number) => {
    const count = Math.floor((w * h) / 4000)
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2.5 + 0.5,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]!,
    }))
  }

  const initNebulae = (w: number, h: number) => {
    const count = 4 + Math.floor(Math.random() * 3)
    nebulae = Array.from({ length: count }, () => {
      const cloudCount = 3 + Math.floor(Math.random() * 3)
      const baseColor = NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)]!
      const baseR = 100 + Math.random() * 200
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        clouds: Array.from({ length: cloudCount }, () => ({
          ox: (Math.random() - 0.5) * baseR * 0.6,
          oy: (Math.random() - 0.5) * baseR * 0.6,
          r: baseR * (0.4 + Math.random() * 0.6),
          color: baseColor,
          opacity: 0.012 + Math.random() * 0.02,
        })),
      }
    })
  }

  const initGalaxies = (w: number, h: number) => {
    const types: GalaxyType[] = ['spiral', 'elliptical', 'edge-on']
    const count = 2 + Math.floor(Math.random() * 3)
    galaxies = Array.from({ length: count }, () => {
      const type = types[Math.floor(Math.random() * types.length)]!
      const color = GALAXY_COLORS[Math.floor(Math.random() * GALAXY_COLORS.length)]!
      let radius: number
      let tilt: number
      switch (type) {
        case 'spiral':
          radius = 40 + Math.random() * 40
          tilt = 0.4 + Math.random() * 0.4
          break
        case 'elliptical':
          radius = 25 + Math.random() * 30
          tilt = 0.5 + Math.random() * 0.4
          break
        case 'edge-on':
          radius = 50 + Math.random() * 40
          tilt = 0.12 + Math.random() * 0.08
          break
      }
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        type,
        radius,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (0.00003 + Math.random() * 0.00007) * (Math.random() > 0.5 ? 1 : -1),
        tilt,
        color,
        arms: type === 'spiral' ? 2 + Math.floor(Math.random() * 2) : 0,
      }
    })
  }

  const drawNebulae = (scrollY: number) => {
    for (const n of nebulae) {
      for (const c of n.clouds) {
        const cx = n.x + c.ox
        const parallax = scrollY * 0.08
        const cy = n.y + c.oy - parallax
        const [cr, cg, cb] = c.color
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, c.r)
        g.addColorStop(0, `rgba(${cr},${cg},${cb},${c.opacity})`)
        g.addColorStop(0.5, `rgba(${cr},${cg},${cb},${c.opacity * 0.5})`)
        g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
        ctx.beginPath()
        ctx.arc(cx, cy, c.r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }
    }
  }

  const drawSpiralGalaxy = (gal: Galaxy, cr: number, cg: number, cb: number) => {
    const outerG = ctx.createRadialGradient(0, 0, 0, 0, 0, gal.radius)
    outerG.addColorStop(0, `rgba(${cr},${cg},${cb},0.08)`)
    outerG.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.03)`)
    outerG.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
    ctx.beginPath()
    ctx.arc(0, 0, gal.radius, 0, Math.PI * 2)
    ctx.fillStyle = outerG
    ctx.fill()

    for (let arm = 0; arm < gal.arms; arm++) {
      const baseAngle = (Math.PI * 2 / gal.arms) * arm
      const steps = 50

      ctx.beginPath()
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const theta = baseAngle + t * Math.PI * 2.5
        const r = gal.radius * 0.15 + t * gal.radius * 0.85
        const x = r * Math.cos(theta)
        const y = r * Math.sin(theta)
        if (i === 0) { ctx.moveTo(x, y) } else { ctx.lineTo(x, y) }
      }
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.06)`
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      ctx.beginPath()
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const theta = baseAngle + t * Math.PI * 2.5
        const r = gal.radius * 0.15 + t * gal.radius * 0.85
        const x = r * Math.cos(theta)
        const y = r * Math.sin(theta)
        if (i === 0) { ctx.moveTo(x, y) } else { ctx.lineTo(x, y) }
      }
      ctx.strokeStyle = `rgba(${cr},${cg},${cb},0.15)`
      ctx.lineWidth = 1.5
      ctx.stroke()

      for (let i = 0; i < 8; i++) {
        const t = (i + 0.5) / 8
        const theta = baseAngle + t * Math.PI * 2.5
        const r = gal.radius * 0.15 + t * gal.radius * 0.85
        const sx = Math.sin(i * 127.1 + arm * 311.7) * 3
        const sy = Math.cos(i * 83.3 + arm * 197.1) * 3
        const x = r * Math.cos(theta) + sx
        const y = r * Math.sin(theta) + sy
        const dotR = 1 + (1 - t) * 1.5
        const alpha = 0.25 * (1 - t * 0.6)
        const dotG = ctx.createRadialGradient(x, y, 0, x, y, dotR)
        dotG.addColorStop(0, `rgba(255,255,255,${alpha})`)
        dotG.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
        ctx.beginPath()
        ctx.arc(x, y, dotR, 0, Math.PI * 2)
        ctx.fillStyle = dotG
        ctx.fill()
      }
    }

    const coreR = gal.radius * 0.15
    const coreG = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR)
    coreG.addColorStop(0, 'rgba(255,255,255,0.5)')
    coreG.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.2)`)
    coreG.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
    ctx.beginPath()
    ctx.arc(0, 0, coreR, 0, Math.PI * 2)
    ctx.fillStyle = coreG
    ctx.fill()
  }

  const drawEllipticalGalaxy = (gal: Galaxy, cr: number, cg: number, cb: number) => {
    const outerG = ctx.createRadialGradient(0, 0, 0, 0, 0, gal.radius)
    outerG.addColorStop(0, `rgba(${cr},${cg},${cb},0.12)`)
    outerG.addColorStop(0.3, `rgba(${cr},${cg},${cb},0.06)`)
    outerG.addColorStop(0.7, `rgba(${cr},${cg},${cb},0.02)`)
    outerG.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
    ctx.beginPath()
    ctx.arc(0, 0, gal.radius, 0, Math.PI * 2)
    ctx.fillStyle = outerG
    ctx.fill()

    const coreR = gal.radius * 0.3
    const coreG = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR)
    coreG.addColorStop(0, 'rgba(255,255,255,0.4)')
    coreG.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.15)`)
    coreG.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
    ctx.beginPath()
    ctx.arc(0, 0, coreR, 0, Math.PI * 2)
    ctx.fillStyle = coreG
    ctx.fill()
  }

  const drawEdgeOnGalaxy = (gal: Galaxy, cr: number, cg: number, cb: number) => {
    const diskR = gal.radius
    const diskG = ctx.createRadialGradient(0, 0, 0, 0, 0, diskR)
    diskG.addColorStop(0, `rgba(${cr},${cg},${cb},0.15)`)
    diskG.addColorStop(0.4, `rgba(${cr},${cg},${cb},0.06)`)
    diskG.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
    ctx.beginPath()
    ctx.arc(0, 0, diskR, 0, Math.PI * 2)
    ctx.fillStyle = diskG
    ctx.fill()

    ctx.save()
    ctx.scale(1, 3)
    const bulgeR = gal.radius * 0.2
    const bulgeG = ctx.createRadialGradient(0, 0, 0, 0, 0, bulgeR)
    bulgeG.addColorStop(0, 'rgba(255,255,255,0.5)')
    bulgeG.addColorStop(0.5, `rgba(${cr},${cg},${cb},0.2)`)
    bulgeG.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
    ctx.beginPath()
    ctx.arc(0, 0, bulgeR, 0, Math.PI * 2)
    ctx.fillStyle = bulgeG
    ctx.fill()
    ctx.restore()

    const lineGrad = ctx.createLinearGradient(-diskR, 0, diskR, 0)
    lineGrad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`)
    lineGrad.addColorStop(0.2, `rgba(${cr},${cg},${cb},0.1)`)
    lineGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)')
    lineGrad.addColorStop(0.8, `rgba(${cr},${cg},${cb},0.1)`)
    lineGrad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
    ctx.beginPath()
    ctx.moveTo(-diskR, 0)
    ctx.lineTo(diskR, 0)
    ctx.strokeStyle = lineGrad
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  const drawGalaxies = (time: number, scrollY: number) => {
    for (const gal of galaxies) {
      ctx.save()
      const parallax = scrollY * 0.08
      ctx.translate(gal.x, gal.y - parallax)
      ctx.rotate(gal.rotation + time * gal.rotationSpeed)
      ctx.scale(1, gal.tilt)
      const cr = gal.color[0]!
      const cg = gal.color[1]!
      const cb = gal.color[2]!

      switch (gal.type) {
        case 'spiral':
          drawSpiralGalaxy(gal, cr, cg, cb)
          break
        case 'elliptical':
          drawEllipticalGalaxy(gal, cr, cg, cb)
          break
        case 'edge-on':
          drawEdgeOnGalaxy(gal, cr, cg, cb)
          break
      }

      ctx.restore()
    }
  }

  const drawStars = (time: number, scrollY: number) => {
    for (const s of stars) {
      const flicker = (Math.sin(time * s.speed + s.phase) + 1) / 2
      const alpha = 0.3 + flicker * 0.7
      const [cr, cg, cb] = s.color
      const parallax = s.radius > 1.5 ? scrollY * 0.12 : scrollY * 0.05
      const sy = s.y - parallax
      const g = ctx.createRadialGradient(s.x, sy, 0, s.x, sy, s.radius)
      g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`)
      g.addColorStop(0.4, `rgba(${cr},${cg},${cb},${alpha * 0.5})`)
      g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
      ctx.beginPath()
      ctx.arc(s.x, sy, s.radius, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
  }

  const spawnShootingStar = (w: number, h: number) => {
    const edge = Math.random()
    let x: number, y: number
    if (edge < 0.7) {
      x = Math.random() * w
      y = -10
    } else {
      x = w + 10
      y = Math.random() * h * 0.5
    }
    const angle = Math.PI * (0.15 + Math.random() * 0.25)
    const speed = 4 + Math.random() * 6
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)]!
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

  const drawShootingStars = (dt: number, w: number, h: number) => {
    shootingTimer += dt
    if (shootingTimer > 2000 + Math.random() * 4000) {
      shootingTimer = 0
      spawnShootingStar(w, h)
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

      if (s.life >= s.maxLife || s.x < -100 || s.x > w + 100 || s.y > h + 100) {
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

  return {
    init(w: number, h: number) {
      initStars(w, h)
      initNebulae(w, h)
      initGalaxies(w, h)
    },
    draw(time: number, dt: number, w: number, h: number, scrollY: number) {
      drawNebulae(scrollY)
      drawGalaxies(time, scrollY)
      drawStars(time, scrollY)
      drawShootingStars(dt, w, h)
    },
  }
}
