import type { Experience } from './types'

export const experience: Experience[] = [
  {
    role: 'Frontend Developer',
    company: 'Dodo Brands - international food-tech company',
    period: 'November 2021 – Present',
    projects: [
      {
        title: 'Core team',
        details: [
          'Automated project setup and reduced onboarding from 5 hours → 1 minute.',
          'Improved pipeline performance from 20 minutes → 1.5 minutes on average.',
          'Built and maintained internal tooling ecosystem for frontend teams (Node.js).',
          'Created custom ESLint rules, a Yarn plugin for Node.js version checks, and Vite plugins (service worker generation, HTML adjustments).',
          'Developed CI/CD workflows and GitHub Actions (Node.js, Azure, S3).',
          'Delivered ~30 internal B2B interfaces used across the company.',
          'Worked with microfrontends: single-spa, importmap, systemjs, native imports.',
          'Improved frontend performance through code-splitting, lazy loading and bundle optimization.',
        ],
      },
      {
        title: 'Redesign project',
        details: [
          'Rebuilt ~15 legacy interfaces, migrating them from Razor + jQuery to a React-based micro-frontend architecture.',
          'Restructured the frontend codebase to reduce complexity and speed up development.',
          'Designed scalable UI architecture and reusable components for the redesigned interfaces.',
          'Collaborated on backend redesign and refactored key C# API endpoints for cleaner contracts, better performance, and smoother frontend integration.',
        ],
      },
      {
        title: 'Self service kiosk project',
        details: [
          'Delivered core architecture, cart flow, combo logic and menu layout.',
          'Built page-to-page animations and a shop-window slider.',
        ],
      },
      {
        title: 'Additional',
        details: [
          'Participated in technical interviews for frontend and full-stack candidates.',
          'Assisted in onboarding new frontend developers, including code reviews and mentorship support.',
          'Light backend work with NestJS (internal dashboard for microfrontend versions).',
        ],
      },
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Sber-Korus - fintech company',
    period: 'January 2019 – September 2021',
    projects: [
      {
        title: 'Business clients section',
        details: [
          'Architected and implemented the "pledge" step for a large enterprise onboarding flow.',
          'Redesigned "Main data" step.',
          'Reduced the difficulty of "Withdrawal" step.',
          'Worked in a cross-functional team of 7 (2 frontend, 2 backend, 2 QA, 1 product manager).',
        ],
      },
      {
        title: 'VAT refund project',
        details: [
          'Completed the project for one of the most famous banks.',
        ],
      },
    ],
  },
  {
    role: 'Software Engineering Specialist',
    company: 'Neolant-West',
    period: 'May 2018 – December 2018',
    projects: [
      {
        title: 'Product team',
        details: [
          'Implemented 5 sections of geo-information system using Vue.js, Vuex, Vue Router.',
        ],
      },
    ],
  },
  {
    role: 'Web Developer',
    company: 'Fibernet',
    period: 'August 2017 – May 2018',
    projects: [
      {
        title: 'Product team',
        details: [
          'Creation of sites for companies-customers.',
          'Worked as a team with a copywriter.',
        ],
      },
    ],
  },
]
