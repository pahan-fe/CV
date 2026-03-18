import type { SidebarLayout, ExpandedCategory } from './types'
import { drawExpandedSkills } from './draw-helix'

const WAVE_FREQ = 0.022
const WAVE_SPEED = 0.0008
const WAVE_AMP = 18

const getSnakeX = (y: number, time: number, cx: number): number =>
  cx + Math.sin(y * WAVE_FREQ - time * WAVE_SPEED) * WAVE_AMP

export const drawTendril = (
  ctx: CanvasRenderingContext2D,
  layout: SidebarLayout,
  time: number,
  expanded: ExpandedCategory | null,
) => {
  const { canvasHeight: H, centerX: cx, nodes, branches } = layout

  // Main vine
  ctx.beginPath()
  for (let y = 0; y <= H; y += 1.5) {
    const x = getSnakeX(y, time, cx)
    if (y === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.strokeStyle = 'rgba(23,23,23,0.13)'
  ctx.lineWidth = 2.2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()

  // Shadow vine
  ctx.beginPath()
  for (let y = 0; y <= H; y += 2) {
    const x = getSnakeX(y - 15, time, cx) - 4
    if (y === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.strokeStyle = 'rgba(23,23,23,0.04)'
  ctx.lineWidth = 0.8
  ctx.stroke()

  // Category branches
  for (let i = 0; i < branches.length; i++) {
    const cat = branches[i]!
    const isExpanded = expanded?.index === i
    const otherExpanded = expanded !== null && expanded.index !== i
    const vineX = getSnakeX(cat.y, time, cx)
    const bw = Math.sin(time * 0.0012 + cat.y * 0.02) * 5
    const endX = cat.side > 0 ? vineX + 45 + bw : vineX - 45 - bw
    const endY = cat.y - 8 + Math.sin(time * 0.001 + cat.y) * 3
    const ctrlX = (vineX + endX) / 2 + cat.side * 12
    const ctrlY = cat.y - 14 + Math.sin(time * 0.0015 + cat.y * 0.5) * 4

    const branchAlpha = otherExpanded ? 0.03 : 0.09
    ctx.beginPath()
    ctx.moveTo(vineX, cat.y)
    ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY)
    ctx.strokeStyle = `rgba(23,23,23,${branchAlpha})`
    ctx.lineWidth = 0.9
    ctx.lineCap = 'round'
    ctx.stroke()

    // Bud endpoint
    const budR = 2.5 + Math.sin(time * 0.002 + cat.y) * 0.5
    ctx.beginPath()
    ctx.arc(endX, endY, budR, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(23,23,23,${otherExpanded ? 0.01 : 0.04})`
    ctx.fill()

    // Sub-tendrils (collapsed)
    if (!isExpanded) {
      for (let j = 0; j < 2; j++) {
        const t = 0.4 + j * 0.25
        const bx = (1 - t) ** 2 * vineX + 2 * (1 - t) * t * ctrlX + t ** 2 * endX
        const by = (1 - t) ** 2 * cat.y + 2 * (1 - t) * t * ctrlY + t ** 2 * endY
        const sa = cat.side > 0 ? -0.6 - j * 0.3 : 0.6 + j * 0.3
        const sl = 12 + Math.sin(time * 0.001 + j * 2) * 3
        const sex = bx + Math.cos(sa) * sl * cat.side
        const sey = by + Math.sin(sa) * sl
        ctx.beginPath()
        ctx.moveTo(bx, by)
        ctx.lineTo(sex, sey)
        ctx.strokeStyle = `rgba(23,23,23,${branchAlpha * 0.5})`
        ctx.lineWidth = 0.5
        ctx.lineCap = 'round'
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(sex, sey, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(23,23,23,${branchAlpha * 0.3})`
        ctx.fill()
      }
    }

    // Category label
    ctx.font = '700 11px Darker Grotesque'
    ctx.fillStyle = otherExpanded ? 'rgba(153,153,153,0.3)' : '#999'
    ctx.fillText(cat.label, cat.side > 0 ? endX - 4 : endX, endY - 8)

    // Expanded skills
    if (isExpanded && expanded) {
      drawExpandedSkills(ctx, cat, vineX, cat.y, endX, endY, ctrlX, ctrlY, expanded.progress, false, time)
    }
  }

  // Nav nodes
  for (const n of nodes) {
    const nx = getSnakeX(n.y, time, cx)
    if (n.active) {
      const g = ctx.createRadialGradient(nx, n.y, 0, nx, n.y, 16)
      g.addColorStop(0, 'rgba(23,23,23,0.06)')
      g.addColorStop(1, 'rgba(23,23,23,0)')
      ctx.beginPath()
      ctx.arc(nx, n.y, 16, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
    const bs = n.active ? 5 + Math.sin(time * 0.003) * 0.5 : 3.5
    ctx.beginPath()
    ctx.arc(nx, n.y, bs, 0, Math.PI * 2)
    ctx.fillStyle = n.active ? 'rgba(23,23,23,0.85)' : '#ccc'
    ctx.fill()
    ctx.font = n.active ? '600 14px DM Sans' : '14px DM Sans'
    ctx.fillStyle = n.active ? '#171717' : '#999'
    ctx.fillText(n.label, nx + 18, n.y + 4)
  }
}
