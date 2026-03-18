import type { SidebarLayout, ExpandedCategory } from './types'

interface HelixState {
  stars: { x: number; y: number; r: number; phase: number; speed: number }[]
}

export const initHelixState = (w: number, h: number): HelixState => {
  const count = Math.floor((w * h) / 6000)
  return {
    stars: Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.2 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.002 + 0.001,
    })),
  }
}

const AMPLITUDE = 35
const FREQUENCY = 0.012
const ROT_SPEED = 0.0006

export const drawHelix = (
  ctx: CanvasRenderingContext2D,
  layout: SidebarLayout,
  state: HelixState,
  time: number,
  expanded: ExpandedCategory | null,
) => {
  const { canvasHeight: H, centerX: cx, nodes, branches } = layout
  const phase = time * ROT_SPEED

  // Stars
  for (const s of state.stars) {
    const a = 0.15 + (Math.sin(time * s.speed + s.phase) + 1) / 2 * 0.2
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${a})`
    ctx.fill()
  }

  // Double helix strands
  for (let s = 0; s < 2; s++) {
    const strandPhase = s * Math.PI
    ctx.beginPath()
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      const y = t * H
      const x = cx + Math.sin(y * FREQUENCY + phase + strandPhase) * AMPLITUDE
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = `rgba(237,237,237,${s === 0 ? 0.14 : 0.08})`
    ctx.lineWidth = s === 0 ? 1 : 0.7
    ctx.stroke()
  }

  // Crossbars
  for (let i = 0; i < 20; i++) {
    const y = (i + 0.5) * (H / 20)
    const a1 = y * FREQUENCY + phase
    const x1 = cx + Math.sin(a1) * AMPLITUDE
    const x2 = cx + Math.sin(a1 + Math.PI) * AMPLITUDE
    ctx.beginPath()
    ctx.moveTo(x1, y)
    ctx.lineTo(x2, y)
    ctx.strokeStyle = `rgba(237,237,237,${Math.abs(Math.cos(a1)) * 0.08})`
    ctx.lineWidth = 0.4
    ctx.stroke()
  }

  // Orbiting particles
  for (let i = 0; i < 30; i++) {
    const baseY = (i / 30) * H
    const oa = time * 0.001 * (0.5 + (i % 5) * 0.2) + i * 1.7
    const or = AMPLITUDE * (0.4 + Math.sin(i * 2.3) * 0.3)
    const px = cx + Math.sin(oa + baseY * FREQUENCY * 0.3) * or
    const py = baseY + Math.sin(oa * 0.7) * 8
    const d = (Math.cos(oa) + 1) / 2
    ctx.beginPath()
    ctx.arc(px, py, 0.5 + d, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(237,237,237,${0.04 + d * 0.08})`
    ctx.fill()
  }

  // Nav nodes
  for (const n of nodes) {
    const nx = cx + Math.sin(n.y * FREQUENCY + phase) * AMPLITUDE * 0.15
    if (n.active) {
      const g = ctx.createRadialGradient(nx, n.y, 0, nx, n.y, 14)
      g.addColorStop(0, 'rgba(237,237,237,0.08)')
      g.addColorStop(1, 'rgba(237,237,237,0)')
      ctx.beginPath()
      ctx.arc(nx, n.y, 14, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(nx, n.y, n.active ? 3.5 : 2.5, 0, Math.PI * 2)
    ctx.fillStyle = n.active ? '#ededed' : '#555'
    ctx.fill()
    ctx.font = n.active ? '600 14px DM Sans' : '14px DM Sans'
    ctx.fillStyle = n.active ? '#ededed' : '#555'
    ctx.fillText(n.label, nx + 16, n.y + 5)
  }

  // Category branches
  for (let i = 0; i < branches.length; i++) {
    const cat = branches[i]!
    const isExpanded = expanded?.index === i
    const otherExpanded = expanded !== null && expanded.index !== i
    const sx = cx + Math.sin(cat.y * FREQUENCY + phase) * AMPLITUDE * 0.3
    const ex = cat.side > 0 ? sx + 50 : sx - 50
    const ey = cat.y - 6
    const cx2 = (sx + ex) / 2
    const cy2 = cat.y - 10

    const branchAlpha = otherExpanded ? 0.04 : 0.1
    ctx.beginPath()
    ctx.moveTo(sx, cat.y)
    ctx.quadraticCurveTo(cx2, cy2, ex, ey)
    ctx.strokeStyle = `rgba(237,237,237,${branchAlpha})`
    ctx.lineWidth = 0.7
    ctx.lineCap = 'round'
    ctx.stroke()

    // Collapsed leaf dots
    if (!isExpanded) {
      for (let j = 0; j < 3; j++) {
        const t = 0.5 + j * 0.2
        const lx = (1 - t) ** 2 * sx + 2 * (1 - t) * t * cx2 + t ** 2 * ex
        const ly = (1 - t) ** 2 * cat.y + 2 * (1 - t) * t * cy2 + t ** 2 * ey
        ctx.beginPath()
        ctx.arc(lx, ly, 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(237,237,237,${branchAlpha})`
        ctx.fill()
      }
    }

    // Category label — positioned to stay within sidebar
    ctx.font = '700 11px Darker Grotesque'
    ctx.fillStyle = otherExpanded ? 'rgba(85,85,85,0.3)' : '#555'
    const catTextW = ctx.measureText(cat.label).width
    const catLabelX = cat.side > 0
      ? Math.min(ex - 4, 230 - catTextW)
      : Math.max(4, ex)
    ctx.fillText(cat.label, catLabelX, ey - 6)

    // Expanded skill leaves
    if (isExpanded && expanded) {
      drawExpandedSkills(ctx, cat, sx, cat.y, ex, ey, cx2, cy2, expanded.progress, true, time)
    }
  }
}

export const drawExpandedSkills = (
  ctx: CanvasRenderingContext2D,
  cat: { skills: string[]; side: 1 | -1 },
  _sx: number, _sy: number,
  ex: number, ey: number,
  _cx2: number, _cy2: number,
  progress: number,
  dark: boolean,
  time: number,
) => {
  const skills = cat.skills
  const maxVisible = Math.floor(progress * skills.length)

  if (dark) {
    drawOrbitalSkills(ctx, skills, ex, ey, maxVisible, progress, time)
  } else {
    drawRemoraSkills(ctx, skills, ex, ey, maxVisible, progress, time)
  }
}

// Dark theme: planets orbiting a star
const drawOrbitalSkills = (
  ctx: CanvasRenderingContext2D,
  skills: string[],
  ex: number, ey: number,
  maxVisible: number,
  progress: number,
  time: number,
) => {
  const goldenAngle = 137.508 * (Math.PI / 180)

  for (let j = 0; j < Math.min(maxVisible, skills.length); j++) {
    const baseAngle = j * goldenAngle
    // Chaotic radii: 40-110px
    const ringOffset = ((j * 31) % 7) / 7
    const baseRadius = 40 + ringOffset * 70

    // Orbit rotation
    const orbitSpeed = 0.0004 + ((j * 3) % 5) * 0.00008
    const angle = baseAngle + time * orbitSpeed

    const planetX = ex + Math.cos(angle) * baseRadius
    const planetY = ey + Math.sin(angle) * baseRadius

    const fadeIn = Math.min(1, (progress * skills.length - j) * 2)

    // Connecting line
    ctx.beginPath()
    ctx.moveTo(ex, ey)
    ctx.lineTo(planetX, planetY)
    ctx.strokeStyle = `rgba(237,237,237,${0.05 * fadeIn})`
    ctx.lineWidth = 0.3
    ctx.lineCap = 'round'
    ctx.stroke()

    // Planet dot
    const dotSize = 2 + ((j * 7) % 3) * 0.5
    ctx.beginPath()
    ctx.arc(planetX, planetY, dotSize, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(237,237,237,${0.3 * fadeIn})`
    ctx.fill()

    // Glow
    const g = ctx.createRadialGradient(planetX, planetY, 0, planetX, planetY, dotSize * 3)
    g.addColorStop(0, `rgba(237,237,237,${0.07 * fadeIn})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.arc(planetX, planetY, dotSize * 3, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()

  }
}

// Light theme: remora fish — organisms clinging to the parent, swaying
const drawRemoraSkills = (
  ctx: CanvasRenderingContext2D,
  skills: string[],
  ex: number, ey: number,
  maxVisible: number,
  progress: number,
  time: number,
) => {
  for (let j = 0; j < Math.min(maxVisible, skills.length); j++) {
    // Distribute along short tendrils around the endpoint
    // Golden angle for base direction, but short stems (20-50px)
    const goldenAngle = 137.508 * (Math.PI / 180)
    const baseAngle = j * goldenAngle
    const stemLen = 25 + ((j * 17) % 30)

    // Remora sway: forward-back oscillation along the stem direction
    // Each "fish" has its own rhythm
    const swaySpeed = 0.002 + ((j * 3) % 5) * 0.0004
    const swayAmount = 8 + ((j * 11) % 6)
    const sway = Math.sin(time * swaySpeed + j * 1.8) * swayAmount

    const stemX = ex + Math.cos(baseAngle) * (stemLen + sway)
    const stemY = ey + Math.sin(baseAngle) * (stemLen + sway)

    const fadeIn = Math.min(1, (progress * skills.length - j) * 2)

    // Organic tendril connecting to parent
    const midX = (ex + stemX) / 2 + Math.sin(time * 0.001 + j) * 3
    const midY = (ey + stemY) / 2 + Math.cos(time * 0.001 + j) * 3
    ctx.beginPath()
    ctx.moveTo(ex, ey)
    ctx.quadraticCurveTo(midX, midY, stemX, stemY)
    ctx.strokeStyle = `rgba(23,23,23,${0.08 * fadeIn})`
    ctx.lineWidth = 0.6
    ctx.lineCap = 'round'
    ctx.stroke()

    // Organism blob
    const blobSize = 2.5 + ((j * 7) % 3) * 0.5
    const breathe = 1 + Math.sin(time * 0.003 + j * 2) * 0.15
    ctx.beginPath()
    ctx.arc(stemX, stemY, blobSize * breathe, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(23,23,23,${0.12 * fadeIn})`
    ctx.fill()

    // Soft glow
    const g = ctx.createRadialGradient(stemX, stemY, 0, stemX, stemY, blobSize * 3)
    g.addColorStop(0, `rgba(23,23,23,${0.04 * fadeIn})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.arc(stemX, stemY, blobSize * 3, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()

  }
}

export interface SkillLabelPosition {
  text: string
  x: number
  y: number
  opacity: number
}

export const computeOrbitalPositions = (
  skills: string[],
  ex: number, ey: number,
  progress: number,
  time: number,
): SkillLabelPosition[] => {
  const goldenAngle = 137.508 * (Math.PI / 180)
  const maxVisible = Math.floor(progress * skills.length)
  const result: SkillLabelPosition[] = []

  for (let j = 0; j < Math.min(maxVisible, skills.length); j++) {
    const baseAngle = j * goldenAngle
    const ringOffset = ((j * 31) % 7) / 7
    const baseRadius = 40 + ringOffset * 70
    const orbitSpeed = 0.0004 + ((j * 3) % 5) * 0.00008
    const angle = baseAngle + time * orbitSpeed
    const planetX = ex + Math.cos(angle) * baseRadius
    const planetY = ey + Math.sin(angle) * baseRadius
    const dotSize = 2 + ((j * 7) % 3) * 0.5
    const fadeIn = Math.min(1, (progress * skills.length - j) * 2)

    result.push({
      text: skills[j]!,
      x: planetX + dotSize + 5,
      y: planetY - 6,
      opacity: fadeIn * 0.9,
    })
  }
  return result
}

export const computeRemoraPositions = (
  skills: string[],
  ex: number, ey: number,
  progress: number,
  time: number,
): SkillLabelPosition[] => {
  const goldenAngle = 137.508 * (Math.PI / 180)
  const maxVisible = Math.floor(progress * skills.length)
  const result: SkillLabelPosition[] = []

  for (let j = 0; j < Math.min(maxVisible, skills.length); j++) {
    const baseAngle = j * goldenAngle
    const stemLen = 25 + ((j * 17) % 30)
    const swaySpeed = 0.002 + ((j * 3) % 5) * 0.0004
    const swayAmount = 8 + ((j * 11) % 6)
    const sway = Math.sin(time * swaySpeed + j * 1.8) * swayAmount
    const stemX = ex + Math.cos(baseAngle) * (stemLen + sway)
    const stemY = ey + Math.sin(baseAngle) * (stemLen + sway)
    const blobSize = 2.5 + ((j * 7) % 3) * 0.5
    const fadeIn = Math.min(1, (progress * skills.length - j) * 2)

    result.push({
      text: skills[j]!,
      x: stemX + blobSize + 5,
      y: stemY - 6,
      opacity: fadeIn * 0.85,
    })
  }
  return result
}
