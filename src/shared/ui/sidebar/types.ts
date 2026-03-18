export interface NavNode {
  id: string
  label: string
  y: number
  active: boolean
}

export interface CategoryBranch {
  label: string
  shortLabel?: string
  skills: string[]
  y: number
  side: 1 | -1
}

export interface ExpandedCategory {
  index: number
  progress: number // 0..1 for animation
}

export interface SidebarLayout {
  nodes: NavNode[]
  branches: CategoryBranch[]
  canvasWidth: number
  canvasHeight: number
  centerX: number
}
