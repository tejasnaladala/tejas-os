# tejas-os

my personal site. built it as a CRT-themed terminal portfolio because of my bestfriend here at udub (he loves crt themed stuff)
live at [tejasnaladala.com](https://tejasnaladala.com)

## whats in here

- landing page with ascii art and terminal-style status block
- `/thesis` - things i believe to be true about engineering
- `/work` - projects, roles, technical details
- `/gallery` - photo grid
- `/arcade` - retro games (snake, tetris, etc)
- `/stories` - locked behind engineering brain teasers. solve to read
- `/ocean` - interactive ROV deep-sea explorer with stations, combat, discovery system
- `/resume` - the boring but necessary stuff

the ocean page is basically a whole game. WASD to move, ENTER to dock at stations, SPACE to shoot creatures. theres a konami code easter egg too

## stack

next.js 16, react 19, typescript, tailwind v4, framer motion, zustand

## running locally

```
npm install
npm run dev
```

thats it. opens on localhost:3000

## deploy

hosted on vercel. just push to master and it deploys automatically, or run `npx vercel --prod`
