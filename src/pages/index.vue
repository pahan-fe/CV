<script setup lang="ts">
import ThemeToggle from '~/features/theme-toggle/ui/ThemeToggle.vue'
import { profile } from '~/entities/profile'
import { experience } from '~/entities/experience'
import { education } from '~/entities/education'
import { skills } from '~/entities/skills'
import { languages } from '~/entities/languages'
import { articles } from '~/entities/articles'

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
const activeSection = ref(sections[0])

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = entry.target.id as typeof sections[number]
        }
      }
    },
    { rootMargin: '-20% 0px -60% 0px' },
  )

  for (const id of sections) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }

  onBeforeUnmount(() => observer.disconnect())
})
</script>

<template>
  <main class="cv">
    <header class="hero reveal">
      <div class="hero__id">
        <h1 class="hero__name">{{ profile.name }}</h1>
        <p class="hero__role">{{ profile.role }}</p>
      </div>
      <ThemeToggle />
    </header>

    <aside class="sidebar">
      <nav class="sidebar__nav reveal" style="animation-delay: 0.1s">
        <a
          v-for="s in sections"
          :key="s"
          :href="`#${s}`"
          class="sidebar__link"
          :class="{ 'sidebar__link--active': activeSection === s }"
        >
          {{ s }}
        </a>
      </nav>

      <section class="sidebar__skills reveal" style="animation-delay: 0.2s">
        <h2 class="section-title">Skills</h2>
        <ul class="tags">
          <li v-for="s in skills" :key="s" class="tag">{{ s }}</li>
        </ul>
      </section>
    </aside>

    <section class="content">
      <section v-if="profile.summary" id="summary" class="block reveal" style="animation-delay: 0.15s">
        <h2 class="section-title">Summary</h2>
        <p class="summary">{{ profile.summary }}</p>
      </section>

      <section id="experience" class="block reveal" style="animation-delay: 0.2s">
        <h2 class="section-title">Experience</h2>
        <div class="timeline">
          <article v-for="(item, i) in experience" :key="i" class="timeline__entry">
            <div class="timeline__dot" />
            <div class="card">
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

      <section id="education" class="block reveal" style="animation-delay: 0.25s">
        <h2 class="section-title">Education</h2>
        <div class="card">
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

      <section id="languages" class="block reveal" style="animation-delay: 0.3s">
        <h2 class="section-title">Languages</h2>
        <ul class="tags">
          <li v-for="l in languages" :key="l" class="tag">{{ l }}</li>
        </ul>
      </section>

      <section id="articles" class="block reveal" style="animation-delay: 0.35s">
        <h2 class="section-title">Articles</h2>
        <ul class="articles-list">
          <li v-for="article in articles" :key="article.url" class="article-item">
            <a :href="article.url" target="_blank" rel="noopener" class="article-link">
              <span class="article-link__title">{{ article.title }}</span>
              <span v-if="article.description" class="article-link__desc">{{ article.description }}</span>
              <span class="article-link__arrow">&rarr;</span>
            </a>
          </li>
        </ul>
      </section>

      <section id="contact" class="block reveal" style="animation-delay: 0.4s">
        <h2 class="section-title">Contact</h2>
        <div class="contact-row">
          <a :href="profile.email" class="contact-link">Email</a>
          <a :href="profile.linkedin" target="_blank" rel="noopener" class="contact-link">LinkedIn</a>
          <a :href="profile.github" target="_blank" rel="noopener" class="contact-link">GitHub</a>
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
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
  min-width: 0;
}

.hero__name {
  font-family: 'Syne', sans-serif;
  font-size: 2.6rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--fg);
}

.hero__role {
  margin-top: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--muted);
  letter-spacing: 0.03em;
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

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__link {
  display: block;
  padding: 6px 12px;
  color: var(--muted);
  text-decoration: none;
  font-size: 0.88rem;
  text-transform: capitalize;
  border-radius: 6px;
  transition: color 200ms, background-color 200ms;
}

.sidebar__link:hover {
  color: var(--fg);
  background: var(--accent-soft);
}

.sidebar__link--active {
  color: var(--fg);
  background: var(--accent-soft);
  font-weight: 600;
}

.sidebar__skills {
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.content {
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;
}

.section-title {
  font-family: 'Syne', sans-serif;
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
}

.timeline__entry:first-child .timeline__dot {
  border-color: var(--fg);
  background: var(--fg);
}

.card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  background: var(--card);
  overflow-wrap: anywhere;
  transition: border-color 250ms, box-shadow 250ms;
}

.card:hover {
  border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
  box-shadow: var(--glow);
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
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--muted);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: 'JetBrains Mono', monospace;
  transition: transform 200ms, border-color 200ms, color 200ms;
}

.tag:hover {
  transform: scale(1.05);
  border-color: var(--accent);
  color: var(--fg);
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

.contact-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.contact-link {
  display: inline-block;
  padding: 8px 20px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--card);
  color: var(--fg);
  text-decoration: none;
  font-size: 0.9rem;
  transition: border-color 250ms, box-shadow 250ms, transform 200ms;
}

.contact-link:hover {
  border-color: var(--accent);
  box-shadow: var(--glow);
  transform: translateY(-1px);
}

@media (max-width: 900px) {
  .cv {
    grid-template-columns: 1fr;
    grid-template-areas: 'hero' 'content';
    gap: 24px;
    padding: 32px 16px 64px;
  }

  .sidebar {
    position: static;
    grid-area: content;
    display: contents;
  }

  .sidebar__nav {
    flex-direction: row;
    overflow-x: auto;
    gap: 4px;
    order: -1;
    padding-bottom: 4px;
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg);
    padding: 12px 0;
    margin: 0 -16px;
    padding-left: 16px;
    padding-right: 16px;
  }

  .sidebar__link {
    white-space: nowrap;
    padding: 6px 10px;
    font-size: 0.82rem;
  }

  .sidebar__skills {
    border-top: none;
    padding-top: 0;
  }

  .hero__name { font-size: 2.2rem; }

  .timeline::before { left: 5px; }
  .timeline__entry { padding-left: 28px; }

  .article-link { flex-wrap: wrap; }
  .article-link__desc { white-space: normal; }
}

@media (max-width: 600px) {
  .cv { padding: 24px 12px 48px; }
  .hero__name { font-size: 1.8rem; }
  .hero { flex-direction: column; align-items: flex-start; }
  .card { padding: 14px; }
  .tag { font-size: 0.75rem; padding: 3px 8px; }
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
  .card { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .reveal { animation: none !important; opacity: 1 !important; }
}
</style>
