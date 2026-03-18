import type { NavNode, CategoryBranch, SidebarLayout } from './types'
import type { SkillCategory } from '~/entities/skills'

const PADDING = 40
export const SECTIONS = ['summary', 'experience', 'education', 'languages', 'articles', 'contact'] as const
export type Section = typeof SECTIONS[number]

export const computeLayout = (
  canvasWidth: number,
  canvasHeight: number,
  categories: SkillCategory[],
): SidebarLayout => {
  const usableHeight = canvasHeight - PADDING * 2
  const nodeCount = SECTIONS.length
  const centerX = canvasWidth * 0.375

  const nodes: NavNode[] = SECTIONS.map((id, i) => ({
    id,
    label: id,
    y: PADDING + i * usableHeight / (nodeCount - 1),
    active: false,
  }))

  const branches: CategoryBranch[] = categories.map((cat, i) => {
    const nodeA = nodes[i]!
    const nodeB = nodes[i + 1] ?? nodes[nodes.length - 1]!
    return {
      label: cat.label,
      shortLabel: cat.shortLabel,
      skills: cat.skills,
      y: (nodeA.y + nodeB.y) / 2,
      side: (i % 2 === 0 ? -1 : 1) as 1 | -1,
    }
  })

  return { nodes, branches, canvasWidth, canvasHeight, centerX }
}

export interface MobileLayout {
  nodes: { id: string; label: string; x: number; active: boolean }[]
  branches: { label: string; shortLabel?: string; skills: string[]; x: number }[]
  canvasWidth: number
  canvasHeight: number
  centerY: number
}

export const computeMobileLayout = (
  canvasWidth: number,
  canvasHeight: number,
  categories: SkillCategory[],
): MobileLayout => {
  const padding = 28
  const nodeCount = SECTIONS.length
  const centerY = canvasHeight * 0.45
  const usableWidth = canvasWidth - padding * 2

  const nodes = SECTIONS.map((id, i) => ({
    id,
    label: id,
    x: padding + i * usableWidth / (nodeCount - 1),
    active: false,
  }))

  const branches = categories.map((cat, i) => {
    const nodeA = nodes[i]!
    const nodeB = nodes[i + 1] ?? nodes[nodes.length - 1]!
    return {
      label: cat.label,
      shortLabel: cat.shortLabel,
      skills: cat.skills,
      x: (nodeA.x + nodeB.x) / 2,
    }
  })

  return { nodes, branches, canvasWidth, canvasHeight, centerY }
}
