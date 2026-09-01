# tejas-os

Source for [tejasnaladala.com](https://tejasnaladala.com).

The site is static HTML, CSS, and JavaScript deployed on Vercel. Work and research records live in `content.js`; `section.js` renders the long-form pages. The blog keeps its narrative structures in the same content module.

## Routes

- `/about` - personal background and photographs
- `/work` - five roles across machine learning, research, and machine building
- `/research` - studies, projects, technical notes, papers, and open systems
- `/investing` - angel-investing focus and 20-point rubric
- `/blog` - "Un"Supervised stories
- `/cv` - embedded and downloadable CV

## Local preview

```bash
npm run check
npm run dev
```

The preview runs at `http://127.0.0.1:3010` by default. Set `PORT` to use another port.

`npm run check` parses every JavaScript entry point and rejects retired facts and stock professional-copy phrases before deployment.

## Deployment

The Vercel configuration serves the repository root directly. Production deploys can be created with:

```bash
vercel --prod
```

## License

MIT. See [LICENSE](./LICENSE).
