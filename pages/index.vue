<script setup lang="ts">
type Project = { name: string; description: string; stack: string[]; link?: string }
type Experience = { role: string; company: string; period: string; details: string[] }

const profile = {
  name: 'Pavel Zagvozdin',
  role: 'Frontend Developer',
  summary:
    'I build fast, accessible web apps with Vue/Nuxt, TypeScript, and modern tooling. Focused on clean UI, performance, and DX.',
  location: 'Remote / Europe',
  email: 'mailto:hello@example.com', // TODO: replace with your email
  github: 'https://github.com/', // TODO: replace with your GitHub
  linkedin: 'https://www.linkedin.com/', // TODO: replace with your LinkedIn
}

const skills = [
  'JavaScript', 'TypeScript', 'Vue 3', 'Nuxt 3/4', 'Pinia', 'Vue Router',
  'HTML5', 'CSS3', 'Tailwind', 'Vite', 'Vitest', 'Playwright', 'ESLint', 'Prettier'
]

const experience: Experience[] = [
  {
    role: 'Frontend Developer',
    company: 'Acme Corp',
    period: '2023 — Present',
    details: [
      'Built SPA features with Vue 3 + TypeScript, improving Core Web Vitals (LCP < 2.0s).',
      'Led migration to Vite and modern linting/formatting for faster DX.',
      'Collaborated with design on accessible, responsive UI components.',
    ],
  },
  {
    role: 'Frontend Engineer',
    company: 'Startup XYZ',
    period: '2021 — 2023',
    details: [
      'Shipped a Nuxt app with SSR and PWA for offline-first UX.',
      'Introduced E2E testing and CI, reducing regressions by 30%.',
    ],
  },
]

const projects: Project[] = [
  {
    name: 'Minimal CV Site',
    description: 'This Nuxt-based personal CV with offline support and SEO best practices.',
    stack: ['Nuxt', 'Vue', 'TypeScript', 'PWA'],
    link: '#', // TODO: deploy URL
  },
  {
    name: 'Component Library',
    description: 'Reusable Vue 3 UI components with docs and tests.',
    stack: ['Vue 3', 'Vite', 'Vitest'],
  },
]
</script>

<template>
  <main>
    <!-- Hero / About -->
    <section id="about" class="section hero">
      <h1 class="title">{{ profile.name }}</h1>
      <p class="subtitle">{{ profile.role }}</p>
      <p class="summary">{{ profile.summary }}</p>
      <div class="cta">
        <a :href="profile.email" class="btn">Contact</a>
        <a :href="profile.github" target="_blank" rel="noopener" class="btn ghost">GitHub</a>
        <a :href="profile.linkedin" target="_blank" rel="noopener" class="btn ghost">LinkedIn</a>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="section">
      <h2>Skills</h2>
      <ul class="tags">
        <li v-for="s in skills" :key="s" class="tag">{{ s }}</li>
      </ul>
    </section>

    <!-- Experience -->
    <section id="experience" class="section">
      <h2>Experience</h2>
      <div class="timeline">
        <article v-for="(item, i) in experience" :key="i" class="card">
          <header class="card__header">
            <h3 class="card__title">{{ item.role }} · {{ item.company }}</h3>
            <span class="card__period">{{ item.period }}</span>
          </header>
          <ul class="card__list">
            <li v-for="(d, j) in item.details" :key="j">{{ d }}</li>
          </ul>
        </article>
      </div>
    </section>

    <!-- Projects -->
    <section id="projects" class="section">
      <h2>Projects</h2>
      <div class="grid">
        <article v-for="(p, i) in projects" :key="i" class="card">
          <header class="card__header">
            <h3 class="card__title">{{ p.name }}</h3>
          </header>
          <p class="card__desc">{{ p.description }}</p>
          <ul class="tags small">
            <li v-for="t in p.stack" :key="t" class="tag">{{ t }}</li>
          </ul>
          <a v-if="p.link" :href="p.link" class="btn small" target="_blank" rel="noopener">View</a>
        </article>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section contact">
      <h2>Contact</h2>
      <p>Open to frontend roles and interesting projects. Reach out via email or socials.</p>
      <div class="cta">
        <a :href="profile.email" class="btn">Email</a>
        <a :href="profile.github" target="_blank" rel="noopener" class="btn ghost">GitHub</a>
        <a :href="profile.linkedin" target="_blank" rel="noopener" class="btn ghost">LinkedIn</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px 64px;
}

.section { margin: 40px 0; }
.section h2 { margin: 0 0 16px; font-size: 1.25rem; color: #00DC82; }

.hero { text-align: center; margin-top: 24px; }
.title { font-size: 2rem; margin: 0 0 6px; }
.subtitle { opacity: 0.9; margin: 0 0 12px; }
.summary { opacity: 0.85; max-width: 64ch; margin: 0 auto; }

.cta { display: flex; gap: 10px; justify-content: center; margin-top: 16px; flex-wrap: wrap; }
.btn { background: #00DC82; color: #020420; padding: 8px 14px; border-radius: 8px; text-decoration: none; border: 1px solid #00DC82; }
.btn.ghost { background: transparent; color: #00DC82; }
.btn.small { padding: 6px 10px; font-size: 0.9rem; }

.tags { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; margin: 0; }
.tags.small { gap: 6px; }
.tag { border: 1px solid #00DC82; color: #00DC82; padding: 4px 10px; border-radius: 999px; font-size: 0.9rem; }

.timeline { display: grid; gap: 16px; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }

.card { border: 1px solid #00DC82; border-radius: 12px; padding: 14px; background: #02062a; }
.card__header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.card__title { margin: 0; font-size: 1rem; }
.card__period { opacity: 0.7; font-size: 0.9rem; }
.card__list { margin: 8px 0 0 18px; }
.card__desc { opacity: 0.9; margin: 8px 0; }

.contact { text-align: center; }

/* section anchors */
section { scroll-margin-top: 72px; }

/* Grow to fill vertical space */
:host, main { display: block; flex: 1 0 auto; width: 100%; }
</style>
