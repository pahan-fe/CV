const reducedMotion = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const useScrollReveal = () => {
  const observer = ref<IntersectionObserver | null>(null)

  onMounted(() => {
    observer.value = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          const el = entry.target as HTMLElement
          const alreadyPassed = entry.boundingClientRect.top < 0

          if (alreadyPassed || reducedMotion) {
            el.classList.add('revealed', 'revealed--fast')
          } else {
            el.classList.add('revealed')
          }

          applyStagger(el)
          observer.value!.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
  })

  onBeforeUnmount(() => {
    observer.value?.disconnect()
  })

  const observe = (el: HTMLElement | null | undefined, stagger?: number) => {
    if (!el) {
      return
    }
    if (stagger) {
      el.dataset.revealStagger = String(stagger)
    }
    observer.value?.observe(el)
  }

  const observeChildren = (parent: HTMLElement | null | undefined, delay = 80) => {
    if (!parent) {
      return
    }
    const children = parent.querySelectorAll<HTMLElement>('[data-reveal-child]')
    children.forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${i * delay}ms`)
      observer.value?.observe(child)
    })
  }

  return { observe, observeChildren }
}

const applyStagger = (el: HTMLElement) => {
  const staggerMs = Number(el.dataset.revealStagger || 0)
  if (!staggerMs) {
    return
  }
  const children = el.querySelectorAll<HTMLElement>('[data-reveal-child]')
  children.forEach((child, i) => {
    child.style.setProperty('--reveal-delay', `${i * staggerMs}ms`)
  })
}
