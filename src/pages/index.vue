<script setup lang="ts">
import ThemeToggle from '~/features/theme-toggle/ui/ThemeToggle.vue'
import { profile } from '~/entities/profile'
import { experience } from '~/entities/experience'
import { education } from '~/entities/education'
import { languages } from '~/entities/languages'
import { articles } from '~/entities/articles'
import { skillCategories } from '~/entities/skills'
import { useScrollReveal } from '~/shared/lib/useScrollReveal'
import { useTheme } from '~/features/theme-toggle/model/useTheme'

const { observe, observeChildren } = useScrollReveal()
const { theme } = useTheme()

const url = useRequestURL()
useSeoMeta({
  title: `${profile.name} — ${profile.role}`,
  description: profile.summary || `${profile.name} — ${profile.role}. Experience, skills, education and contacts.`,
})

useSchemaOrg([
  defineWebSite({ name: `${profile.name} — CV`, url: url.origin }),
  definePerson({
    name: profile.name,
    jobTitle: profile.role,
    sameAs: [profile.linkedin],
    email: profile.email.replace('mailto:', ''),
  }),
  defineWebPage({ name: 'Resume', description: `${profile.name} — ${profile.role} resume` }),
])

const sections = ['summary', 'experience', 'education', 'languages', 'articles', 'contact'] as const
type Section = typeof sections[number]
const activeSection = ref<Section>(sections[0])

const typedRole = ref('')
const showCursor = ref(true)

const summaryRef = ref<HTMLElement>()
const experienceRef = ref<HTMLElement>()
const educationRef = ref<HTMLElement>()
const languagesRef = ref<HTMLElement>()
const skillsRef = ref<HTMLElement>()
const articlesRef = ref<HTMLElement>()
const contactRef = ref<HTMLElement>()

const timelineProgress = ref(0)
const activeDots = ref<Set<number>>(new Set())

onMounted(() => {
  const text = profile.role
  let i = 0
  const interval = setInterval(() => {
    typedRole.value = text.slice(0, ++i)
    if (i >= text.length) {
      clearInterval(interval)
      setTimeout(() => {
        showCursor.value = false
      }, 1500)
    }
  }, 60)
})

onMounted(() => {
  const onScroll = () => {
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 50

    if (atBottom) {
      activeSection.value = sections[sections.length - 1] as Section
      return
    }

    const threshold = window.innerHeight * 0.3
    let current: Section = sections[0]

    for (const id of sections) {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top <= threshold) {
        current = id
      }
    }

    activeSection.value = current

    const timelineEl = document.getElementById('experience')
    if (timelineEl) {
      const rect = timelineEl.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const sectionHeight = rect.height
      const viewportHeight = window.innerHeight
      const raw = (window.scrollY - sectionTop) / (sectionHeight - viewportHeight)
      timelineProgress.value = Math.max(0, Math.min(1, raw))

      const entries = timelineEl.querySelectorAll('.timeline__entry')
      entries.forEach((entry, i) => {
        const dot = entry.querySelector('.timeline__dot') as HTMLElement
        if (!dot) { return }
        const dotRect = dot.getBoundingClientRect()
        const timelineRect = timelineEl.getBoundingClientRect()
        const dotRelativePos = (dotRect.top - timelineRect.top) / timelineRect.height

        if (timelineProgress.value >= dotRelativePos) {
          if (!activeDots.value.has(i)) {
            activeDots.value.add(i)
            dot.classList.add('timeline__dot--active')
          }
        }
      })
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
  })
})

onMounted(() => {
  observe(summaryRef.value)
  observeChildren(experienceRef.value, 150)
  observe(educationRef.value)
  observe(languagesRef.value, 40)
  observe(skillsRef.value, 40)
  observe(articlesRef.value, 60)
  observe(contactRef.value, 100)
})
</script>

<template>
  <main class="cv">
    <header class="hero">
      <div class="hero__id">
        <h1 class="hero__name">
          <span class="hero__first">{{ profile.name.split(' ')[0] }}</span>
          <span class="hero__last">{{ profile.name.split(' ').slice(1).join(' ') }}</span>
        </h1>
        <p class="hero__role">
          <span>{{ typedRole }}</span><span v-if="showCursor" class="hero__cursor">|</span>
        </p>
      </div>
    </header>
    <ThemeToggle class="theme-toggle-sticky" />

    <aside class="sidebar">
      <SidebarNav :active-section="activeSection" />
    </aside>

    <section class="content">
      <section v-if="profile.summary" id="summary" ref="summaryRef" class="block reveal-fade">
        <h2 class="section-title">Summary</h2>
        <p class="summary">{{ profile.summary }}</p>
      </section>

      <section id="experience" ref="experienceRef" class="block">
        <h2 class="section-title">Experience</h2>
        <div class="timeline" :style="{ '--tl-progress': timelineProgress }">
          <article v-for="(item, i) in experience" :key="i" class="timeline__entry" data-reveal-child>
            <div class="timeline__dot" />
            <div class="card" :data-drift="theme" :style="{ '--card-i': i }">
              <header class="card__header">
                <div>
                  <h3 class="card__title">{{ item.role }}</h3>
                  <p class="card__company">{{ item.company }}</p>
                  <span v-if="item.location" class="card__meta">{{ item.location }}</span>
                </div>
                <span class="card__period">{{ item.period }}</span>
              </header>
              <template v-if="item.details?.length">
                <ul class="card__list">
                  <li v-for="(d, j) in item.details" :key="j">{{ d }}</li>
                </ul>
              </template>
              <template v-if="item.projects?.length">
                <div class="subprojects">
                  <div v-for="(p, k) in item.projects" :key="k" class="sub">
                    <div class="sub__head">
                      <strong class="sub__title">{{ p.title }}</strong>
                      <span v-if="p.period" class="card__period">{{ p.period }}</span>
                    </div>
                    <ul class="card__list">
                      <li v-for="(d, j) in p.details" :key="j">{{ d }}</li>
                    </ul>
                  </div>
                </div>
              </template>
            </div>
          </article>
        </div>
      </section>

      <section id="education" ref="educationRef" class="block reveal-scale">
        <h2 class="section-title">Education</h2>
        <div class="card" :data-drift="theme" style="--card-i: 0">
          <template v-for="(ed, i) in education" :key="i">
            <header class="card__header">
              <div>
                <h3 class="card__title">{{ ed.school }}</h3>
                <p class="card__company">{{ ed.degree }}<span v-if="ed.location"> · {{ ed.location }}</span></p>
              </div>
              <span class="card__period">{{ ed.period }}</span>
            </header>
            <ul v-if="ed.details?.length" class="card__list">
              <li v-for="(d, j) in ed.details" :key="j">{{ d }}</li>
            </ul>
          </template>
        </div>
      </section>

      <section id="languages" ref="languagesRef" class="block reveal-fade">
        <h2 class="section-title">Languages</h2>
        <ul class="tags">
          <li v-for="l in languages" :key="l" class="tag" data-reveal-child>{{ l }}</li>
        </ul>
      </section>

      <section id="skills" ref="skillsRef" class="block reveal-fade mobile-only">
        <h2 class="section-title">Skills</h2>
        <div v-for="cat in skillCategories" :key="cat.label" class="skill-group">
          <h3 class="skill-group__label">{{ cat.label }}</h3>
          <ul class="tags">
            <li v-for="s in cat.skills" :key="s" class="tag" data-reveal-child>{{ s }}</li>
          </ul>
        </div>
      </section>

      <section id="articles" ref="articlesRef" class="block reveal-slide-up">
        <h2 class="section-title">Articles</h2>
        <ul class="articles-list">
          <li v-for="(article, i) in articles" :key="article.url" class="article-item" data-reveal-child>
            <a :href="article.url" target="_blank" rel="noopener" class="article-link" :data-drift="theme" :style="{ '--card-i': i }">
              <span class="article-link__title">{{ article.title }}</span>
              <span v-if="article.description" class="article-link__desc">{{ article.description }}</span>
              <span class="article-link__arrow">&rarr;</span>
            </a>
          </li>
        </ul>
      </section>

      <section id="contact" ref="contactRef" class="block reveal-slide-up">
        <h2 class="section-title">Contact</h2>
        <div class="contact-grid">
          <a :href="profile.email" class="contact-card" data-reveal-child>
            <svg class="contact-card__icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span class="contact-card__label">Email</span>
            <span class="contact-card__value">{{ profile.email.replace('mailto:', '') }}</span>
          </a>
          <a :href="profile.linkedin" target="_blank" rel="noopener" class="contact-card" data-reveal-child>
            <svg class="contact-card__icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
            <span class="contact-card__label">LinkedIn</span>
            <span class="contact-card__value">pahanz</span>
          </a>
          <a :href="profile.github" target="_blank" rel="noopener" class="contact-card" data-reveal-child>
            <svg class="contact-card__icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span class="contact-card__label">GitHub</span>
            <span class="contact-card__value">pahan-fe</span>
          </a>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>
.cv {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px 96px;
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'hero hero'
    'sidebar content';
  gap: 32px 40px;
}

.hero {
  grid-area: hero;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 32px 0 40px;
  border-bottom: 1px solid var(--border);
  min-width: 0;
}

.theme-toggle-sticky {
  position: fixed;
  top: 24px;
  right: max(24px, calc((100vw - 1100px) / 2 + 24px));
  z-index: 100;
}

.hero__name {
  font-family: 'Electroharmonix', sans-serif;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.hero__first {
  display: block;
  font-size: 3.5rem;
}

.hero__last {
  display: block;
  font-size: 3.5rem;
  color: var(--muted);
}

.hero__role {
  margin-top: 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--muted);
  letter-spacing: 0.02em;
  min-height: 1.4em;
}

.hero__cursor {
  animation: blink 0.7s step-end infinite;
  color: var(--muted);
}

@keyframes blink {
  50% { opacity: 0; }
}

.sidebar {
  grid-area: sidebar;
  position: sticky;
  top: 32px;
  align-self: start;
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-width: 0;
}

.content {
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
}

.section-title {
  font-family: 'Darker Grotesque', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
  margin-bottom: 16px;
}

.summary {
  color: var(--muted);
  line-height: 1.7;
  max-width: 640px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 12px;
  bottom: 12px;
  width: 1px;
  background: var(--border);
  clip-path: inset(0 0 calc((1 - var(--tl-progress, 1)) * 100%) 0);
  transition: clip-path 50ms linear;
}

.timeline::after {
  content: '';
  position: absolute;
  left: 4px;
  width: 3px;
  top: 12px;
  bottom: 12px;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent calc(var(--tl-progress, 1) * 100% - 40px),
    var(--fg) calc(var(--tl-progress, 1) * 100%)
  );
  clip-path: inset(0 0 calc((1 - var(--tl-progress, 1)) * 100%) 0);
  opacity: 0.6;
  border-radius: 2px;
}

.timeline__entry {
  position: relative;
  padding-left: 32px;
  padding-bottom: 24px;
}

.timeline__entry:last-child {
  padding-bottom: 0;
}

.timeline__dot {
  position: absolute;
  left: 0;
  top: 10px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid var(--muted);
  background: var(--bg);
  z-index: 1;
  transition: transform 300ms ease-out, border-color 300ms, background-color 300ms;
}

.timeline__dot--active {
  border-color: var(--fg) !important;
  background: var(--fg) !important;
  animation: dot-pulse 600ms ease-out forwards;
}

@keyframes dot-pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 var(--fg); }
  40% { transform: scale(1.5); box-shadow: 0 0 0 4px color-mix(in srgb, var(--fg) 40%, transparent); }
  100% { transform: scale(1); box-shadow: 0 0 0 8px transparent; }
}

.card {
  position: relative;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  background: var(--card);
  overflow-wrap: anywhere;
  transition: border-color 300ms;
}

.card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 13px;
  padding: 1px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 0%,
    var(--fg) 5%,
    transparent 15%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 300ms;
}

.card:hover::before {
  opacity: 1;
  animation: border-spin 2.5s linear infinite;
}

@keyframes border-spin {
  to { --border-angle: 360deg; }
}

@property --border-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

/* Dark: elliptical orbit — traces a tilted ellipse */
@keyframes card-orbit {
  0%      { transform: translate(6px, 0)      scale(1.005); }
  8.3%    { transform: translate(5.2px, 1.8px) scale(1.004); }
  16.7%   { transform: translate(3px, 3px)     scale(1.002); }
  25%     { transform: translate(0, 3.5px)     scale(1); }
  33.3%   { transform: translate(-3px, 3px)    scale(1); }
  41.7%   { transform: translate(-5.2px, 1.8px) scale(1.002); }
  50%     { transform: translate(-6px, 0)      scale(1.005); }
  58.3%   { transform: translate(-5.2px, -1.8px) scale(1.004); }
  66.7%   { transform: translate(-3px, -3px)   scale(1.002); }
  75%     { transform: translate(0, -3.5px)    scale(1); }
  83.3%   { transform: translate(3px, -3px)    scale(1); }
  91.7%   { transform: translate(5.2px, -1.8px) scale(1.002); }
  100%    { transform: translate(6px, 0)       scale(1.005); }
}

/* Light: serpentine wave — horizontal sinusoidal with subtle vertical wobble */
@keyframes card-wave {
  0%      { transform: translate(0, 0)          scale(1); }
  12.5%   { transform: translate(4.2px, 1.2px)  scale(1.003); }
  25%     { transform: translate(6px, 0)         scale(1.005); }
  37.5%   { transform: translate(4.2px, -1.2px)  scale(1.003); }
  50%     { transform: translate(0, 0)           scale(1); }
  62.5%   { transform: translate(-4.2px, 1.2px)  scale(1.003); }
  75%     { transform: translate(-6px, 0)        scale(1.005); }
  87.5%   { transform: translate(-4.2px, -1.2px) scale(1.003); }
  100%    { transform: translate(0, 0)           scale(1); }
}

/* Dark articles: smaller orbit, no scale */
@keyframes article-orbit {
  0%      { transform: translate(3px, 0); }
  8.3%    { transform: translate(2.6px, 0.9px); }
  16.7%   { transform: translate(1.5px, 1.5px); }
  25%     { transform: translate(0, 1.8px); }
  33.3%   { transform: translate(-1.5px, 1.5px); }
  41.7%   { transform: translate(-2.6px, 0.9px); }
  50%     { transform: translate(-3px, 0); }
  58.3%   { transform: translate(-2.6px, -0.9px); }
  66.7%   { transform: translate(-1.5px, -1.5px); }
  75%     { transform: translate(0, -1.8px); }
  83.3%   { transform: translate(1.5px, -1.5px); }
  91.7%   { transform: translate(2.6px, -0.9px); }
  100%    { transform: translate(3px, 0); }
}

/* Light articles: smaller serpentine sway, no scale */
@keyframes article-wave {
  0%      { transform: translate(0, 0); }
  12.5%   { transform: translate(2px, 0.6px); }
  25%     { transform: translate(3px, 0); }
  37.5%   { transform: translate(2px, -0.6px); }
  50%     { transform: translate(0, 0); }
  62.5%   { transform: translate(-2px, 0.6px); }
  75%     { transform: translate(-3px, 0); }
  87.5%   { transform: translate(-2px, -0.6px); }
  100%    { transform: translate(0, 0); }
}

.card[data-drift='dark'] {
  animation: card-orbit 10s linear infinite;
  animation-delay: calc(var(--card-i, 0) * -2s);
  will-change: transform;
}

.card[data-drift='light'] {
  animation: card-wave 9s linear infinite;
  animation-delay: calc(var(--card-i, 0) * -2s);
  will-change: transform;
}

.article-link[data-drift='dark'] {
  animation: article-orbit 8s linear infinite;
  animation-delay: calc(var(--card-i, 0) * -2s);
  will-change: transform;
}

.article-link[data-drift='light'] {
  animation: article-wave 8s linear infinite;
  animation-delay: calc(var(--card-i, 0) * -2s);
  will-change: transform;
}

.card__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.card__title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: var(--fg);
}

.card__company {
  font-size: 0.9rem;
  color: var(--muted);
  margin-top: 2px;
}

.card__meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--muted);
  opacity: 0.7;
}

.card__period {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: var(--muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.card__list {
  margin: 12px 0 0 16px;
  padding: 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.65;
}

.card__list li {
  margin-bottom: 4px;
}

.card__list li::marker {
  color: var(--muted);
}

.subprojects {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.sub {
  border-top: 1px dashed var(--border);
  padding-top: 14px;
}

.sub__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.sub__title {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--fg);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag {
  position: relative;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: 'JetBrains Mono', monospace;
  transition: color 200ms;
}

.tag::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 7px;
  padding: 1px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 0%,
    var(--fg) 5%,
    transparent 15%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 300ms;
}

.tag:hover {
  color: var(--fg);
}

.tag:hover::before {
  opacity: 1;
  animation: border-spin 2s linear infinite;
}

.articles-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.article-link {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--card);
  color: var(--fg);
  text-decoration: none;
  transition: border-color 250ms, box-shadow 250ms;
}

.article-link:hover {
  border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
  box-shadow: var(--glow);
}

.article-link__title {
  font-weight: 600;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.article-link__desc {
  color: var(--muted);
  font-size: 0.85rem;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-link__arrow {
  color: var(--muted);
  font-size: 1.1rem;
  flex-shrink: 0;
  transition: transform 200ms;
}

.article-link:hover .article-link__arrow {
  transform: translateX(4px);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.contact-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--card);
  color: var(--fg);
  text-decoration: none;
  text-align: center;
  transition: border-color 300ms;
}

.contact-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 13px;
  padding: 1px;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    transparent 0%,
    var(--fg) 5%,
    transparent 15%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 300ms;
}

.contact-card:hover::before {
  opacity: 1;
  animation: border-spin 2.5s linear infinite;
}

.contact-card__icon {
  color: var(--muted);
  transition: color 200ms;
}

.contact-card:hover .contact-card__icon {
  color: var(--fg);
}

.contact-card__label {
  font-family: 'Darker Grotesque', sans-serif;
  font-weight: 700;
  font-size: 1rem;
}

.contact-card__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: var(--muted);
  word-break: break-all;
}

.mobile-only {
  display: none;
}

.skill-group {
  margin-bottom: 16px;
}

.skill-group:last-child {
  margin-bottom: 0;
}

.skill-group__label {
  font-family: 'Darker Grotesque', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
  margin-bottom: 8px;
}

@media (prefers-reduced-motion: reduce) {
  .card, .article-link { animation: none; transform: none !important; will-change: auto; }
  .timeline::before { clip-path: none; }
  .timeline::after { display: none; }
  .timeline__dot { transition: none; }
  .timeline__dot--active { animation: none; }
}

@media (max-width: 900px) {
  .mobile-only {
    display: block;
  }

  .cv {
    grid-template-columns: 1fr;
    grid-template-areas: 'hero' 'sidebar' 'content';
    gap: 24px;
    padding: 32px 16px 64px;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg);
    padding: 0;
    margin: 0 -16px;
  }

  .hero__first, .hero__last { font-size: 3rem; }

  .card__header { flex-direction: column; gap: 4px; }
  .card__period { align-self: flex-start; }

  .timeline::before { left: 5px; }
  .timeline__entry { padding-left: 28px; }

  .article-link { flex-direction: column; align-items: flex-start; gap: 6px; }
  .article-link__desc { white-space: normal; }
  .article-link__arrow { align-self: flex-end; }
}

@media (max-width: 600px) {
  .cv { padding: 24px 12px 48px; }
  .hero__first, .hero__last { font-size: 2.2rem; }
  .hero { flex-wrap: wrap; }
  .theme-toggle-sticky { top: 56px; right: 12px; }
  .card { padding: 14px; }
  .tag { font-size: 0.75rem; padding: 3px 8px; }
  .contact-grid { grid-template-columns: 1fr; }
  .contact-card { flex-direction: row; gap: 12px; padding: 14px 16px; }
  .contact-card__label { font-size: 0.9rem; }
}

@media print {
  .cv {
    max-width: 800px;
    padding: 0;
    gap: 16px;
    grid-template-columns: 1fr;
    grid-template-areas: 'hero' 'content';
  }
  .sidebar { display: none; }
  .theme-toggle-sticky { display: none; }
  .card, .article-link { animation: none; transform: none !important; will-change: auto; }
  .card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .reveal-fade, .reveal-slide-left, .reveal-scale, .reveal-slide-up,
  [data-reveal-child] {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
  .timeline::before { clip-path: none; }
  .timeline::after { display: none; }
  .timeline__dot--active { transform: none; animation: none; }
}
</style>
