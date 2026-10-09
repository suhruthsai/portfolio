# Suhruth Sai — Portfolio

Personal portfolio of **K. Suhruth Sai**, AI/ML engineer (B.Tech IT, MVSR Engineering College, 2023–2027).

Built with **React + TypeScript + Three.js + GSAP** on Vite.

**Live site:** https://suhruthsai.github.io/portfolio/

## Features
- **"Digital twin of me" hero**: a scanner line splits the portrait. One side is the real photo, the other a live dot-matrix twin with a glowing edge wireframe, and the line follows the cursor or a finger drag. On load, about 20,000 particles assemble the twin before the scanner sweeps it into the real photo. Clicking rebuilds it. Replace `public/portrait.webp` to change the photo.
- **Pre-flight loading screen** with a systems-check counter.
- **Targeting-reticle custom cursor** that locks onto links and buttons (desktop only).
- **Scroll-scrubbed About statement**, where words light up as you scroll.
- **"What I do" panels** that expand on hover or tap.
- **Pinned horizontal project showcase** on desktop, falling back to a vertical stack on phones.
- **Flight-path journey timeline** that draws itself as you scroll.
- Respects `prefers-reduced-motion`. Fully responsive.

## Edit your details
All content lives in **`src/data/profile.ts`**: name, links, projects, services and timeline.
Fill in `linkedin`, `email` and `resume` there; empty values are hidden automatically.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Deploy

**GitHub Pages (already set up):** the ready-to-serve site is in `docs/index.html`. In repo **Settings → Pages**, set the source to **Deploy from a branch → main → /docs**.

### Or deploy on Vercel
1. Push this folder to a new GitHub repo.
2. On vercel.com, choose **Add New → Project** and import the repo. Vercel detects Vite automatically.
3. Click **Deploy**.

## Credits
Design and code are original. The general idea of a 3D-avatar portfolio was inspired by
[Moncy Yohannan's portfolio](https://github.com/MoncyDev/Portfolio-Website). No code or assets from it are used.
