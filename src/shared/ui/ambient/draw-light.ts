interface Tentacle {
  angle: number; maxLen: number; len: number
  phase: 'wait' | 'grow' | 'hold' | 'shrink'
  timer: number; wait: number
  speed: number; wave: number; freq: number
  thick: number
}

interface Blob {
  ox: number; oy: number
  r: number; phase: number; speed: number
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

interface DriftCell {
  x: number; y: number
  vx: number; vy: number
  radius: number
  opacity: number
  phase: number
}

interface Ripple {
  x: number; y: number
  radius: number
  maxRadius: number
  life: number
  maxLife: number
}

const createTentacle = (startVisible = false): Tentacle => {
  const maxLen = 30 + Math.random() * 60
  if (startVisible) {
    const len = maxLen * (0.5 + Math.random() * 0.5)
    return {
      angle: Math.random() * Math.PI * 2,
      maxLen,
      len,
      phase: 'hold',
      timer: Math.random() * 400,
      wait: 1000 + Math.random() * 5000,
      speed: 0.2 + Math.random() * 0.3,
      wave: 5 + Math.random() * 10,
      freq: 0.04 + Math.random() * 0.04,
      thick: 1 + Math.random() * 1.5,
    }
  }
  return {
    angle: Math.random() * Math.PI * 2,
    maxLen,
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
    tentacles: Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => createTentacle(i < 2)),
  }
}

export const createLightRenderer = (ctx: CanvasRenderingContext2D) => {
  let symbiotes: Symbiote[] = []
  const spores: Spore[] = []
  const links: Link[] = []
  let cells: DriftCell[] = []
  const ripples: Ripple[] = []
  let sporeTimer = 0
  let linkTimer = 0
  let rippleTimer = 0

  const initSymbiotes = (w: number, h: number) => {
    const count = Math.max(8, Math.floor((w * h) / 70000))
    symbiotes = Array.from({ length: count }, () => createSymbiote(w, h))
  }

  const initCells = (w: number, h: number) => {
    const count = Math.max(8, Math.floor((w * h) / 50000))
    cells = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 3 + Math.random() * 6,
      opacity: 0.06 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
    }))
  }

  const drawCells = (time: number, dt: number, w: number, h: number) => {
    const t = dt / 16
    for (const c of cells) {
      c.x += c.vx * t
      c.y += c.vy * t

      if (c.x < -c.radius * 2) { c.x = w + c.radius }
      if (c.x > w + c.radius * 2) { c.x = -c.radius }
      if (c.y < -c.radius * 2) { c.y = h + c.radius }
      if (c.y > h + c.radius * 2) { c.y = -c.radius }

      const wobble = 1 + Math.sin(time * 0.001 + c.phase) * 0.08
      const r = c.radius * wobble

      ctx.beginPath()
      ctx.arc(c.x, c.y, r, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0,0,0,${c.opacity})`
      ctx.lineWidth = 1
      ctx.stroke()

      const nucleusR = r * 0.3
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, nucleusR)
      g.addColorStop(0, `rgba(0,0,0,${c.opacity * 0.8})`)
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.arc(c.x, c.y, nucleusR, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
  }

  const drawRipples = (dt: number, w: number, h: number) => {
    rippleTimer += dt
    if (rippleTimer > 1500 + Math.random() * 2500) {
      rippleTimer = 0
      ripples.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 0,
        maxRadius: 40 + Math.random() * 60,
        life: 0,
        maxLife: 2000 + Math.random() * 2000,
      })
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i]!
      r.life += dt
      const progress = r.life / r.maxLife

      if (r.life >= r.maxLife) {
        ripples.splice(i, 1)
        continue
      }

      r.radius = progress * r.maxRadius

      const alpha = progress < 0.15
        ? (progress / 0.15) * 0.07
        : 0.07 * (1 - (progress - 0.15) / 0.85)

      ctx.beginPath()
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(0,0,0,${alpha})`
      ctx.lineWidth = 1
      ctx.stroke()

      if (progress > 0.15 && progress < 0.6) {
        const innerR = r.radius * 0.6
        const innerAlpha = alpha * 0.5
        ctx.beginPath()
        ctx.arc(r.x, r.y, innerR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0,0,0,${innerAlpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }

  const spawnSpore = () => {
    if (symbiotes.length === 0) { return }
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

  const drawSpores = (dt: number, w: number, h: number) => {
    sporeTimer += dt
    if (sporeTimer > 800 + Math.random() * 1500) {
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

      if (s.life >= s.maxLife || s.x < -50 || s.x > w + 50 || s.y < -50 || s.y > h + 50) {
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
    if (symbiotes.length < 2) { return }
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

  return {
    init(w: number, h: number) {
      initSymbiotes(w, h)
      initCells(w, h)
    },
    draw(time: number, dt: number, w: number, h: number) {
      drawCells(time, dt, w, h)
      drawRipples(dt, w, h)
      drawLinks(dt)
      drawSymbiotes(time, dt)
      drawSpores(dt, w, h)
    },
  }
}
