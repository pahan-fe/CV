<script setup lang="ts">
import { useTheme } from '~/features/theme-toggle/model/useTheme'
import { skillCategories } from '~/entities/skills'
import { computeLayout, computeMobileLayout, SECTIONS } from './sidebar/layout'
import type { MobileLayout } from './sidebar/layout'
import { initHelixState, drawHelix, computeOrbitalPositions, computeRemoraPositions } from './sidebar/draw-helix'
import type { SkillLabelPosition } from './sidebar/draw-helix'
import { drawTendril } from './sidebar/draw-tendril'
import { drawMobileHelix, drawMobileTendril } from './sidebar/draw-mobile'
import type { ExpandedCategory, SidebarLayout } from './sidebar/types'

// Note: ref, watch, onMounted, onBeforeUnmount are auto-imported by Nuxt in .vue files

const props = defineProps<{
  activeSection: string
}>()

const { theme } = useTheme()
const canvas = ref<HTMLCanvasElement>()
const container = ref<HTMLElement>()
const reducedMotion = ref(false)

let animationId = 0
let helixState: ReturnType<typeof initHelixState> | null = null
let layout: SidebarLayout | null = null

const mobile = ref(false)
let mobileLayout: MobileLayout | null = null

// Expanded category state
const expanded = ref<ExpandedCategory | null>(null)
let expandAnimFrame = 0

// Collapse skills on theme or section change
watch(theme, () => { expanded.value = null })
watch(() => props.activeSection, () => { expanded.value = null })

// Dynamic positioning for invisible overlay elements
const linkPositions = ref<{ top: string; left: string }[]>([])
const branchPositions = ref<{ top: string; left: string }[]>([])

// HTML skill labels — updated each frame via rAF
const skillLabels = ref<SkillLabelPosition[]>([])

const updatePositions = () => {
  if (mobile.value && mobileLayout) {
    linkPositions.value = mobileLayout.nodes.map(n => ({
      top: `${mobileLayout!.centerY - 12}px`,
      left: `${n.x - 30}px`,
    }))
    branchPositions.value = []
  } else if (layout) {
    linkPositions.value = layout.nodes.map(n => ({
      top: `${n.y - 12}px`,
      left: `${layout!.centerX + 14}px`,
    }))
    const cx = layout!.centerX
    branchPositions.value = layout.branches.map(b => {
      const ex = b.side > 0 ? cx + 50 : cx - 50
      return {
        top: `${b.y - 26}px`,
        left: `${ex - 70}px`,
      }
    })
  }
}

const expandCategory = (index: number) => {
  if (expanded.value?.index === index) {
    expanded.value = null
    return
  }
  expanded.value = { index, progress: 0 }
  const start = performance.now()
  const duration = 400
  const animate = (now: number) => {
    const t = Math.min(1, (now - start) / duration)
    // ease-out cubic
    const eased = 1 - (1 - t) ** 3
    expanded.value = { index, progress: eased }
    if (t < 1) {
      expandAnimFrame = requestAnimationFrame(animate)
    }
  }
  cancelAnimationFrame(expandAnimFrame)
  expandAnimFrame = requestAnimationFrame(animate)
}

const collapseCategory = () => {
  cancelAnimationFrame(expandAnimFrame)
  expanded.value = null
}

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const el = canvas.value
  if (!el) {
    return
  }
  const ctx = el.getContext('2d')
  if (!ctx) {
    return
  }

  let width = 0
  let height = 0

  const resize = () => {
    const cont = container.value
    if (!cont) {
      return
    }
    mobile.value = window.innerWidth <= 900

    if (mobile.value) {
      width = cont.offsetWidth
      height = 48
    } else {
      width = cont.offsetWidth
      height = Math.max(520, cont.offsetHeight)
    }
    el.width = width * devicePixelRatio
    el.height = height * devicePixelRatio
    el.style.width = width + 'px'
    el.style.height = height + 'px'
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)

    if (mobile.value) {
      mobileLayout = computeMobileLayout(width, height, skillCategories)
    } else {
      helixState = initHelixState(width, height)
      layout = computeLayout(width, height, skillCategories)
    }
    updatePositions()
  }

  const draw = (time: number) => {
    const drawTime = reducedMotion.value ? 0 : time
    ctx.clearRect(0, 0, width, height)

    if (mobile.value && mobileLayout) {
      for (const n of mobileLayout.nodes) n.active = n.id === props.activeSection
      if (theme.value === 'dark') {
        drawMobileHelix(ctx, mobileLayout, drawTime)
      } else {
        drawMobileTendril(ctx, mobileLayout, drawTime)
      }
      skillLabels.value = []
    } else if (layout) {
      for (const n of layout.nodes) n.active = n.id === props.activeSection
      if (theme.value === 'dark') {
        drawHelix(ctx, layout, helixState!, drawTime, expanded.value)
      } else {
        drawTendril(ctx, layout, drawTime, expanded.value)
      }

      // Compute HTML label positions for expanded category
      if (expanded.value && layout.branches[expanded.value.index]) {
        const branch = layout.branches[expanded.value.index]!
        const cx = layout.centerX
        const branchEx = branch.side > 0 ? cx + 50 : cx - 50
        const branchEy = branch.y - 6
        skillLabels.value = theme.value === 'dark'
          ? computeOrbitalPositions(branch.skills, branchEx, branchEy, expanded.value.progress, drawTime)
          : computeRemoraPositions(branch.skills, branchEx, branchEy, expanded.value.progress, drawTime)
      } else {
        skillLabels.value = []
      }
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
      start()
    }
  }

  resize()
  start()
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', onVisibility)

  onBeforeUnmount(() => {
    stop()
    cancelAnimationFrame(expandAnimFrame)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', onVisibility)
  })
})
</script>

<template>
  <div ref="container" class="sidebar-nav" role="navigation">
    <canvas ref="canvas" class="sidebar-nav__canvas" aria-hidden="true" />

    <!-- Invisible accessible overlay links -->
    <a
      v-for="(s, idx) in SECTIONS"
      :key="s"
      :href="`#${s}`"
      class="sidebar-nav__link"
      :style="linkPositions[idx] ?? {}"
      :aria-current="props.activeSection === s ? 'true' : undefined"
    >
      {{ s }}
    </a>

    <!-- Category hover/tap zones -->
    <div
      v-for="(cat, i) in skillCategories"
      :key="cat.label"
      class="sidebar-nav__branch-zone"
      :style="branchPositions[i] ?? {}"
      @mouseenter="expandCategory(i)"
      @mouseleave="collapseCategory"
      @click.prevent="expandCategory(i)"
    />

    <!-- HTML skill labels — rendered over canvas, can overflow freely -->
    <span
      v-for="(label, i) in skillLabels"
      :key="`skill-${i}`"
      class="sidebar-nav__skill-label"
      :style="{
        transform: `translate(${label.x}px, ${label.y}px)`,
        opacity: label.opacity,
      }"
    >{{ label.text }}</span>
  </div>
</template>

<style scoped>
.sidebar-nav {
  position: relative;
  width: 100%;
  min-height: 520px;
}

.sidebar-nav__canvas {
  display: block;
  pointer-events: none;
}

.sidebar-nav__link {
  position: absolute;
  opacity: 0;
  pointer-events: auto;
  width: 120px;
  height: 24px;
  text-decoration: none;
  color: inherit;
}

.sidebar-nav__link:focus-visible {
  opacity: 1;
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
  background: var(--accent-soft);
  padding: 2px 8px;
  font-size: 0.88rem;
  text-transform: capitalize;
}

.sidebar-nav__branch-zone {
  position: absolute;
  width: 140px;
  height: 40px;
  pointer-events: auto;
  cursor: pointer;
}

.sidebar-nav__skill-label {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  color: var(--muted);
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  will-change: transform, opacity;
}

@media (max-width: 900px) {
  .sidebar-nav {
    min-height: auto;
    height: 48px;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .sidebar-nav::-webkit-scrollbar { display: none; }
  .sidebar-nav__canvas { height: 48px; }
  .sidebar-nav__link { width: 60px; height: 32px; }
  .sidebar-nav__branch-zone { display: none; }
}
</style>
