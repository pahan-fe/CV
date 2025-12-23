<script setup lang="ts">
import ThemeToggle from '~/features/theme-toggle/ui/ThemeToggle.vue'
import { profile } from '~/entities/profile'
import { experience } from '~/entities/experience'
import { education } from '~/entities/education'
import { skills } from '~/entities/skills'
import { languages } from '~/entities/languages'
import { articles } from '~/entities/articles'

// Page-level SEO
const url = useRequestURL()
useSeoMeta({
  title: `${profile.name} — ${profile.role}`,
  description: profile.summary || `${profile.name} — ${profile.role}. Experience, skills, education and contacts.`
})

// Schema.org
useSchemaOrg([
  defineWebSite({
    name: `${profile.name} — CV`,
    url: url.origin
  }),
  definePerson({
    name: profile.name,
    jobTitle: profile.role,
    sameAs: [profile.linkedin],
    email: profile.email.replace('mailto:', '')
  }),
  defineWebPage({
    name: 'Resume',
    description: `${profile.name} — ${profile.role} resume`
  })
])
</script>

<template>
  <main class="cv">
    <header class="hero">
      <div class="hero__id">
        <h1 class="name">{{ profile.name }}</h1>
        <p class="role">{{ profile.role }}</p>
      </div>
      <nav class="hero__nav">
        <a href="#summary">Summary</a>
        <a href="#experience">Experience</a>
        <a href="#education">Education</a>
        <a href="#languages">Languages</a>
        <a href="#articles">Articles</a>
        <a href="#contact">Contact</a>
        <ThemeToggle />
      </nav>
    </header>

    <aside class="sidebar">
      <section id="skills" class="block">
        <h2>Skills</h2>
        <ul class="tags">
          <li v-for="s in skills" :key="s" class="tag">{{ s }}</li>
        </ul>
      </section>
    </aside>

    <section class="content">
      <section v-if="profile.summary" id="summary" class="block">
        <h2>Summary</h2>
        <p class="summary">{{ profile.summary }}</p>
      </section>

      <section id="experience" class="block">
        <h2>Experience</h2>
        <div class="timeline">
          <article v-for="(item, i) in experience" :key="i" class="card">
            <header class="card__header">
              <h3 class="card__title">{{ item.role }} · {{ item.company }}</h3>
              <span class="card__period">{{ item.period }}</span>
            </header>
            <template v-if="item.details && item.details.length">
              <ul class="card__list">
                <li v-for="(d, j) in item.details" :key="j">{{ d }}</li>
              </ul>
            </template>
            <template v-if="item.projects && item.projects.length">
              <div class="subprojects">
                <div v-for="(p, k) in item.projects" :key="k" class="sub">
                  <div class="sub__head">
                    <strong class="sub__title">{{ p.title }}</strong>
                    <span v-if="p.period" class="sub__period">{{ p.period }}</span>
                  </div>
                  <ul class="card__list">
                    <li v-for="(d, j) in p.details" :key="j">{{ d }}</li>
                  </ul>
                </div>
              </div>
            </template>
          </article>
        </div>
      </section>

      <section id="education" class="block">
        <h2>Education</h2>
        <div class="timeline">
          <article v-for="(ed, i) in education" :key="i" class="card">
            <header class="card__header">
              <h3 class="card__title">{{ ed.school }}</h3>
              <span class="card__period">{{ ed.period }}</span>
            </header>
            <p class="card__desc">{{ ed.degree }}<span v-if="ed.location"> · {{ ed.location }}</span></p>
            <ul v-if="ed.details && ed.details.length" class="card__list">
              <li v-for="(d, j) in ed.details" :key="j">{{ d }}</li>
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

      <section id="articles" class="block">
        <h2>Articles</h2>
        <ul class="list">
          <li v-for="article in articles" :key="article.url">
            <a :href="article.url" target="_blank" rel="noopener">{{ article.title }}</a>
          </li>
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
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'hero hero'
    'sidebar content';
  gap: 28px;
}

.hero {
  grid-area: hero;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.hero__id .name { font-size: 2rem; margin: 0; color: var(--fg); }
.hero__id .role { margin: 4px 0 0; color: var(--muted); }
.hero__nav { display: flex; gap: 14px; flex-wrap: wrap; }
.hero__nav a {
  color: var(--fg);
  text-decoration: none;
  border: 1px solid var(--border);
  background: var(--bg);
  border-radius: 999px;
  padding: 8px 12px;
  transition: background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease;
}
.hero__nav a:hover {
  border-color: color-mix(in srgb, var(--muted) 40%, var(--border));
  background: color-mix(in srgb, var(--muted) 14%, var(--bg));
  transform: translateY(-1px);
}
.hero__nav a:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--muted) 35%, transparent);
}
.sidebar { grid-area: sidebar; position: relative; }
.content { grid-area: content; display: grid; gap: 24px; }

.block { margin: 0; scroll-margin-top: 80px; }
.block + .block { margin-top: 8px; }
.block h2 { margin: 0 0 12px; font-size: 1.05rem; color: var(--muted); font-weight: 700; letter-spacing: 0.2px; }

.list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
.list a { color: var(--fg); text-decoration: underline; text-underline-offset: 3px; }

#contact .list { display: inline-flex; gap: 12px; align-items: center; flex-wrap: wrap; }
#contact .list li { margin: 0; }

.tags { display: flex; flex-wrap: wrap; gap: 8px; list-style: none; padding: 0; margin: 0; }
.tag {
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--fg);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.9rem;
  box-shadow: var(--shadow);
}

.timeline { display: grid; gap: 16px; }
.card {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
  background: var(--card);
  box-shadow: var(--shadow);
}
.card__header { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.card__title { margin: 0; font-size: 1rem; }
.card__period { opacity: 0.7; font-size: 0.9rem; }
.card__list { margin: 8px 0 0 18px; }
.card__desc { opacity: 0.9; margin: 8px 0; }
.summary { opacity: 0.9; margin: 0; line-height: 1.6; }
.subprojects { display: grid; gap: 12px; margin-top: 8px; }
.sub { border-top: 1px dashed var(--border); padding-top: 10px; }
.sub__head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.sub__title { font-weight: 600; }
.sub__period { opacity: 0.7; font-size: 0.9rem; }

@media (max-width: 1200px) {
  .cv {
    max-width: 1000px;
    grid-template-columns: 220px 1fr;
    gap: 24px;
    padding: 32px 16px 64px;
  }
  .hero__id .name { font-size: 1.9rem; }
}

@media (max-width: 900px) {
  .cv {
    max-width: 720px;
    grid-template-columns: 1fr;
    grid-template-areas: 'hero' 'sidebar' 'content';
    gap: 20px;
  }
  .hero { flex-direction: column; align-items: flex-start; }
  .hero__nav { overflow-x: auto; padding-bottom: 2px; }
  .hero__nav a { padding: 7px 10px; }
  .content { gap: 20px; }
  .card { padding: 14px; border-radius: 12px; }
  .tag { font-size: 0.85rem; padding: 5px 10px; }
}

@media (max-width: 600px) {
  .cv { max-width: 560px; padding: 24px 12px 48px; }
  .hero__id .name { font-size: 1.6rem; }
  .hero__nav a { padding: 6px 10px; }
  .card { padding: 12px; }
  .list { gap: 6px; }
}

@media print {
  .cv { max-width: 800px; padding: 0; gap: 16px; }
  .card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
