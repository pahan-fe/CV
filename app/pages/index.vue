<script setup lang="ts">
type Experience = { role: string; company: string; period: string; details: string[] }

const profile = {
  name: 'Pavel Zagvozdin',
  role: 'JavaScript/TypeScript Developer',
  email: 'mailto:zagvzdin.pakhan.webdev@gmail.com',
  linkedin: 'https://linkedin.com/pahanz',
}

const languages = [
  'English (B2)', 'Russian (native)', 'Japanese (N5)',
]

const skills = [
  // Programming
  'JavaScript (JS)', 'TypeScript (TS)',
  // Frontend frameworks & libs
  'React', 'Redux', 'Redux Toolkit', 'Zustand', 'React Router', 'TanStack Query', 'TanStack Router',
  'Vue', 'Vuex', 'Vue Router', 'NestJS',
  // Tooling & platforms
  'Git', 'Node.js', 'CI/CD', 'Azure', 'S3', 'single-spa', 'importmap', 'systemjs', 'Yarn', 'Vite', 'Webpack',
  // UI & styling
  'HTML', 'CSS', 'CSS Modules', 'Styled Components', 'Ant Design (Antd)', 'Bootstrap', 'SASS/SCSS', 'Stylus',
  // Other
  'codegen', 'PUG', 'jQuery', 'Gulp', 'Flow'
]

const experience: Experience[] = [
  {
    role: 'Frontend Developer (Core team)',
    company: 'Dodo Brands',
    period: 'November 2021 – Present',
    details: [
      'Created and supported internal boilerplate tools for frontend developers (reduced project start from 5h to 1m).',
      'Implemented 3 custom ESLint rules for styled-components.',
      'Built 1 Yarn plugin to enforce Node.js version across projects.',
      'Developed 2 Vite plugins (service worker generation and HTML correction).',
      'Set up GitHub Actions for version publish and deploy; reduced pipeline time from ~20m to ~1.5m.',
      'Delivered ~20 B2B interfaces.',
      'Stack: React, TypeScript, React Router, TanStack Router/Query, Redux Toolkit, Zustand, Styled Components, Ant Design, Git.',
    ],
  },
  {
    role: 'Frontend Developer (Self service kiosk)',
    company: 'Dodo Brands',
    period: '—',
    details: [
      'Completed the first project stage; architected combo flow and cart layout.',
      'Designed menu layout, page transition animations, and shopwindow slider.',
      'Stack: React, Redux Toolkit, TypeScript, codegen, CSS/Styled Components, Git.',
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Sber-Korus',
    period: 'January 2019 – September 2021',
    details: [
      'Section for legal entities: implemented “pledge” step; redesigned “Main data”; simplified “Withdrawal”.',
      'Worked in a cross-functional team of 7 (2 FE, 2 BE, 2 QA, 1 PM).',
      'VAT refund project delivered for a major bank.',
      'Stack: React, Redux, Redux-Saga, Flow, TypeScript, HTML, CSS, SASS.',
    ],
  },
  {
    role: 'Software Engineering Specialist',
    company: 'Neolant-West',
    period: 'May 2018 – December 2018',
    details: [
      'Implemented 5 sections of a geo‑information system.',
      'Stack: HTML, PUG, SASS, Bootstrap, Stylus, Vue, Vuex, Vue Router, Node.js, Git.',
    ],
  },
  {
    role: 'Web Developer',
    company: 'Fibernet',
    period: 'August 2017 – May 2018',
    details: [
      'Built websites for client companies; collaborated with a copywriter.',
      'Stack: HTML, SASS, Bootstrap, JS, jQuery, Gulp.',
    ],
  },
]
</script>

<template>
  <main class="cv">
    <aside class="sidebar">
      <h1 class="name">{{ profile.name }}</h1>
      <p class="role">{{ profile.role }}</p>

      <div class="divider" />

      <section id="skills" class="block">
        <h2>Skills</h2>
        <ul class="tags">
          <li v-for="s in skills" :key="s" class="tag">{{ s }}</li>
        </ul>
      </section>
    </aside>

    <section class="content">
      <section id="experience" class="block">
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

      <section id="languages" class="block">
        <h2>Languages</h2>
        <ul class="tags">
          <li v-for="l in languages" :key="l" class="tag">{{ l }}</li>
        </ul>
      </section>

      <section id="contact" class="block">
        <h2>Contact</h2>
        <ul class="list">
          <li><a :href="profile.email">Email</a></li>
          <li><a :href="profile.linkedin" target="_blank" rel="noopener">LinkedIn</a></li>
        </ul>
      </section>
    </section>
  </main>
</template>

<style scoped>
.cv {
  max-width: 1024px;
  margin: 0 auto;
  padding: 32px 16px 64px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.sidebar { position: relative; }
.name { font-size: 1.8rem; margin: 0 0 6px; color: var(--accent); }
.role { opacity: 0.9; margin: 0 0 12px; }
.summary { opacity: 0.9; }
.divider { height: 1px; background: var(--accent); opacity: 0.4; margin: 16px 0; }

.block { margin: 24px 0; }
.block h2 { margin: 0 0 12px; font-size: 1.1rem; color: var(--accent); }

.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 6px; }
.list a { color: var(--fg); text-decoration: underline; text-underline-offset: 3px; }

.tags { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; margin: 0; }
.tags.small { gap: 6px; }
.tag { border: 1px solid var(--accent); color: var(--accent); padding: 4px 10px; border-radius: 999px; font-size: 0.9rem; }

.content { display: grid; gap: 20px; }
.timeline { display: grid; gap: 16px; }
.grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }

.card { border: 1px solid var(--accent); border-radius: 12px; padding: 14px; background: var(--card); }
.card__header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.card__title { margin: 0; font-size: 1rem; }
.card__period { opacity: 0.7; font-size: 0.9rem; }
.card__list { margin: 8px 0 0 18px; }
.card__desc { opacity: 0.9; margin: 8px 0; }

.btn { background: var(--accent); color: var(--bg); padding: 8px 14px; border-radius: 8px; text-decoration: none; border: 1px solid var(--accent); }
.btn.ghost { background: transparent; color: var(--accent); }
.btn.small { padding: 6px 10px; font-size: 0.9rem; }

/* Responsive */
@media (max-width: 900px) {
  .cv { grid-template-columns: 1fr; }
}

/* Print styles */
@media print {
  .cv { max-width: 800px; padding: 0; gap: 16px; }
  .card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
