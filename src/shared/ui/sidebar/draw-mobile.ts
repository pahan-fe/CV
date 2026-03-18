import type { MobileLayout } from './layout'

const DARK_FREQ = 0.02
const DARK_SPEED = 0.0006
const DARK_AMP = 8
const LIGHT_FREQ = 0.03
const LIGHT_SPEED = 0.0008
const LIGHT_AMP = 6

export const drawMobileHelix = (
  ctx: CanvasRenderingContext2D,
  layout: MobileLayout,
  time: number,
) => {
  const { canvasWidth: W, centerY: cy, nodes, branches } = layout

  // Horizontal double helix
  for (let s = 0; s < 2; s++) {
    const sp = s * Math.PI
    ctx.beginPath()
    for (let i = 0; i <= 200; i++) {
      const t = i / 200
      const x = t * W
      const y = cy + Math.sin(x * DARK_FREQ + time * DARK_SPEED + sp) * DARK_AMP
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.strokeStyle = `rgba(237,237,237,${s === 0 ? 0.12 : 0.06})`
    ctx.lineWidth = s === 0 ? 0.8 : 0.5
    ctx.stroke()
  }

  // Nodes
  for (const n of nodes) {
    const ny = cy + Math.sin(n.x * DARK_FREQ + time * DARK_SPEED) * DARK_AMP * 0.15
    if (n.active) {
      const g = ctx.createRadialGradient(n.x, ny, 0, n.x, ny, 8)
      g.addColorStop(0, 'rgba(237,237,237,0.08)')
      g.addColorStop(1, 'rgba(237,237,237,0)')
      ctx.beginPath()
      ctx.arc(n.x, ny, 8, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(n.x, ny, n.active ? 3 : 2, 0, Math.PI * 2)
    ctx.fillStyle = n.active ? '#ededed' : '#555'
    ctx.fill()
    ctx.font = n.active ? '600 8.5px DM Sans' : '8.5px DM Sans'
    ctx.fillStyle = n.active ? '#ededed' : '#555'
    ctx.textAlign = 'center'
    ctx.fillText(n.label, n.x, ny + 16)
    ctx.textAlign = 'start'
  }

  // Category dots between nodes
  for (const b of branches) {
    ctx.beginPath()
    ctx.arc(b.x, cy, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(237,237,237,0.08)'
    ctx.fill()
  }
}

export const drawMobileTendril = (
  ctx: CanvasRenderingContext2D,
  layout: MobileLayout,
  time: number,
) => {
  const { canvasWidth: W, centerY: cy, nodes, branches } = layout

  // Horizontal vine
  ctx.beginPath()
  for (let x = 0; x <= W; x += 1.5) {
    const y = cy + Math.sin(x * LIGHT_FREQ - time * LIGHT_SPEED) * LIGHT_AMP
    if (x === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.strokeStyle = 'rgba(23,23,23,0.12)'
  ctx.lineWidth = 1.8
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.stroke()

  // Nodes
  for (const n of nodes) {
    const ny = cy + Math.sin(n.x * LIGHT_FREQ - time * LIGHT_SPEED) * LIGHT_AMP
    if (n.active) {
      const g = ctx.createRadialGradient(n.x, ny, 0, n.x, ny, 10)
      g.addColorStop(0, 'rgba(23,23,23,0.06)')
      g.addColorStop(1, 'rgba(23,23,23,0)')
      ctx.beginPath()
      ctx.arc(n.x, ny, 10, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }
    const bs = n.active ? 4 : 2.5
    ctx.beginPath()
    ctx.arc(n.x, ny, bs, 0, Math.PI * 2)
    ctx.fillStyle = n.active ? 'rgba(23,23,23,0.85)' : '#ccc'
    ctx.fill()
    ctx.font = n.active ? '600 8.5px DM Sans' : '8.5px DM Sans'
    ctx.fillStyle = n.active ? '#171717' : '#999'
    ctx.textAlign = 'center'
    ctx.fillText(n.label, n.x, ny + 16)
    ctx.textAlign = 'start'
  }

  // Category bud dots
  for (const b of branches) {
    const by = cy + Math.sin(b.x * LIGHT_FREQ - time * LIGHT_SPEED) * LIGHT_AMP
    ctx.beginPath()
    ctx.arc(b.x, by - 6, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(23,23,23,0.05)'
    ctx.fill()
  }
}
