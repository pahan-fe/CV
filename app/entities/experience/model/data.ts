import type { Experience } from './types'

export const experience: Experience[] = [
  {
    role: 'Frontend Developer',
    company: 'Dodo Brands',
    period: 'November 2021 – Present',
    projects: [
      {
        title: 'Core team',
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
        title: 'Self service kiosk',
        details: [
          'Completed the first project stage; architected combo flow and cart layout.',
          'Designed menu layout, page transition animations, and shopwindow slider.',
          'Stack: React, Redux Toolkit, TypeScript, codegen, CSS/Styled Components, Git.',
        ],
      },
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
