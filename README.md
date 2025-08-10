# CV

This is a personal resume website built with Nuxt 4.

## SEO

- Set your production domain for correct canonical URLs and sitemap:
	- Locally: export NUXT_SITE_URL=http://localhost:3000
	- In production: set environment variable NUXT_SITE_URL=https://your-domain.tld
- Robots and sitemap are generated automatically at /robots.txt and /sitemap.xml.
- Schema.org (Person, WebSite, WebPage) is embedded on the home page.

## Setup

Install dependencies and run the dev server:

```sh
yarn
yarn dev
```

Build for production:

```sh
yarn build
```

Preview the production build:

```sh
yarn preview
```
