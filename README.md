# Cursor demo

This repository contains two standalone front-end demos. Each lives in its own folder with its own dependencies and scripts.

| Project | Description |
|--------|-------------|
| [social-media-feed](./social-media-feed/) | React feed UI (Tailwind) |
| [project-management-board](./project-management-board/) | Kanban-style board with light/dark toggle |

Both use **React 19**, **Vite 6**, **TypeScript**, and **Tailwind CSS**.

## Prerequisites

- [Node.js](https://nodejs.org/) **18+** (LTS recommended)
- **npm** (comes with Node)

Check versions:

```bash
node -v
npm -v
```

---

## Social media feed

```bash
cd social-media-feed
npm install
npm run dev
```

Then open the URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

### Other commands

| Command | Purpose |
|--------|---------|
| `npm run build` | Typecheck and production build to `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Project management board

```bash
cd project-management-board
npm install
npm run dev
```

Same default dev URL as above unless you change the port.

### Other commands

| Command | Purpose |
|--------|---------|
| `npm run build` | Typecheck and production build to `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Running both apps at once

Vite’s default dev port is **5173**. If you start the second app while the first is still running, start it on another port:

```bash
# Terminal 1
cd social-media-feed && npm run dev

# Terminal 2
cd project-management-board && npm run dev -- --port 5174
```

(You can use any free port instead of `5174`.)

---

## Repository layout

```
cursor-demo/
├── README.md
├── social-media-feed/          # Feed demo
└── project-management-board/   # Kanban demo
```

There is no root-level `package.json` workspace; install and run **inside** each project directory as shown above.
