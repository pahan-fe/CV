import type { Article } from './types'

export const articles: Article[] = [
  {
    title: 'Microverse of Madness',
    url: 'https://medium.com/dodoengineering/microverse-of-madness-or-how-we-organized-microfrontends-c9cbc36d52d6',
    description: 'An in-depth guide on organizing micro-frontend architecture in large-scale projects.',
  },
  {
    title: 'Away From Webpack',
    url: 'https://medium.com/dodoengineering/away-from-webpack-or-how-we-migrated-microfrontends-bundling-using-vite-7f8d86da33ab',
    description: 'A case study on migrating micro-frontend bundling to Vite for improved DX and performance.',
  },
  {
    title: 'Our Yarn Odyssey',
    url: 'https://medium.com/dodoengineering/our-yarn-odyssey-f4d16b42ebbd',
    description: 'Exploring the transition to modern package management, sharing practical insights on dependency resolution, Zero Installs, and the trade-offs of the Yarn ecosystem.',
  },
]
