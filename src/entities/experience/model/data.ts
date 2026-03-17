import type { Experience } from './types'

export const experience: Experience[] = [
  {
    role: 'Senior Frontend Engineer',
    company: 'Dodo Brands - international food-tech company',
    period: 'November 2021 – Present',
    location: 'Belgrade, Serbia',
    projects: [
      {
        title: 'Key results',
        details: [
          'Revenue Growth (35% Increase): Worked within the engineering team to develop the Self-Service Kiosk platform from scratch; engineered the core architecture (cart flow, complex menu) using React, Redux Toolkit, and TypeScript, resulting in 53k+ daily orders.',
          'Engineering Velocity (92%+ Acceleration): Resolved a critical bottleneck in feedback loops by refactoring CI/CD pipelines (GitHub Actions, Azure, AWS). Reduced deployment cycles from 20 minutes to 1.5 minutes, enabling a 30%+ increase in feature velocity.',
          'Operational Cost Reduction (99% Speedup): Fully automated environment readiness (with Head of Frontend). Slashed setup time from 5 hours to 1 minute, freeing up hundreds of developer hours annually.',
          'Conversion Boost (15% Increase): Developed an interactive shop-window for the Self-Service Kiosk platform using React Transition Group and Styled Components, driving a 15% increase in orders and revenue.',
        ],
      },
      {
        title: 'Strategic impact',
        details: [
          'Service Evolution & Modernization: Led migration of 10+ legacy Razor/jQuery interfaces to React microfrontends; integrated i18next to streamline localization and accelerate feature delivery.',
          'System Stability & Performance: Partnered with Backend and QA teams to refactor C# API endpoints, optimizing operational efficiency and improving product stability.',
          'Business Scalability: Engineered 30+ B2B interfaces (React, TypeScript); scaled the ecosystem using Microfrontends architecture (single-spa, SystemJS, import maps); enabled the team to develop products 2x faster.',
          'Long-term Cost Efficiency: Partnered with the Head of Frontend to implement company-wide standards and automated tooling, significantly lowering long-term cost of ownership and technical debt.',
          'Delivery Metrics & Insights: Designed and implemented a delivery lead time dashboard (Node.js, Kusto, Redash) for the CTO, enabling data-driven comparison of deployment performance across microfrontends and backend services.',
          'Assisted in onboarding new frontend developers, including code reviews and mentorship support.',
          'Contributed to an internal API (NestJS, TypeORM) for version management across 70+ microfrontends, improving the team\'s release workflow.',
        ],
      },
    ],
  },
  {
    role: 'Frontend Developer',
    company: 'Sber-Korus - fintech company',
    period: 'January 2019 – September 2021',
    location: 'Saint-Petersburg, Russia',
    projects: [
      {
        title: 'Business clients section',
        details: [
          'User Conversion Efficiency (50%+ Acceleration): Architected and implemented a complex "pledge" step for a large enterprise onboarding flow using React, TypeScript, and Redux, reducing completion time from 7 minutes to 3 minutes.',
          'Process & Flow Optimization: Streamlined critical application steps (Main data, Withdrawal), cutting completion time by 50% and accelerating the overall loan application process.',
          'Worked in a cross-functional Agile team of 7, ensuring seamless integration between React frontend and Java-based backend.',
        ],
      },
      {
        title: 'VAT refund project',
        details: [
          'Completed the project for a major Russian bank using React, Redux, Flow.',
        ],
      },
    ],
  },
  {
    role: 'Software Engineering Specialist',
    company: 'Neolant-West',
    period: 'May 2018 – December 2018',
    location: 'Saint-Petersburg, Russia',
    projects: [
      {
        title: 'Product team',
        details: [
          'Implemented 5 sections of geo-information system using Vue.js, Vuex, Vue Router, Node.js, Express, Bootstrap.',
        ],
      },
    ],
  },
  {
    role: 'Web Developer',
    company: 'Fibernet',
    period: 'August 2017 – May 2018',
    location: 'Saint-Petersburg, Russia',
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
