import type { SkillCategory } from './types'

export const skillCategories: SkillCategory[] = [
  {
    label: 'CORE',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
  },
  {
    label: 'FRAMEWORKS',
    shortLabel: 'FRMWKS',
    skills: [
      'Redux Toolkit', 'Zustand', 'React Router', 'TanStack Query',
      'TanStack Router', 'i18next', 'Next.js', 'Vue.js', 'Vuex',
      'Vue Router', 'NestJS',
    ],
  },
  {
    label: 'TOOLS',
    skills: [
      'Git', 'Webpack', 'Vite', 'Vitest', 'Jest', 'React Testing Library',
      'Yarn', 'CI/CD (GitHub Actions)', 'Azure', 'AWS (S3)', 'Docker',
      'Microfrontends', 'Single-spa', 'Import Maps', 'SystemJS', 'Claude',
    ],
  },
  {
    label: 'UI',
    skills: ['HTML', 'CSS', 'SASS', 'Styled Components', 'Ant Design', 'Bootstrap'],
  },
  {
    label: 'METHODOLOGIES',
    skills: [
      'Agile (Scrum/Kanban)', 'Cross-functional Collaboration',
      'Technical Mentorship', 'Code Review', 'Test Driven Development',
    ],
  },
]

export const skills = skillCategories.flatMap(c => c.skills)
