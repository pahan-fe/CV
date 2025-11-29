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
          'Created and supported internal boilerplate tools for frontend developers.',
          'Reduced project start time from 5 hours to 1 minute.',
          'Developed 3 custom ESLint rules for styled-components files.',
          'Created Yarn plugin to check Node.js version in projects.',
          'Developed Vite plugin to generate service worker.',
          'Developed Vite plugin to correct HTML files.',
          'Implemented GitHub Action to publish version artifacts.',
          'Implemented GitHub Action to deploy version artifacts.',
          'Reduced CI/CD pipeline time from 20 minutes to 1.5 minutes.',
          'Developed 30 B2B interfaces.',
        ],
      },
      {
        title: 'Self service kiosk',
        details: [
          'Completed first stage of project.',
          'Architected and implemented combo meal selection feature.',
          'Designed cart layout.',
          'Designed menu layout.',
          'Created animations between pages.',
          'Developed shopwindow slider.',
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
        title: 'Section for legal entities',
        details: [
          'Architected and implemented "pledge" step.',
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
          'Implemented 5 sections of geo-information system.',
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
