# Cloud Storage

Next.js app for cloud storage. Requires **Node.js 20.9+** (Next.js 16).

## Prerequisites

- Node.js `>=20.9.0` (recommended: Node 22)
- npm, pnpm, yarn, or bun

If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install    # reads .nvmrc (Node 22)
nvm use
node -v        # should be v20.9.0 or higher
```

With Homebrew:

```bash
brew install node@22
# then ensure that Node is first on your PATH
```

## Install

```bash
npm install
# or
pnpm install
# or
yarn
# or
bun install
```

## Run (development)

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

Edit `app/page.js` and the page updates as you save.

## Advanced running

### Production build locally

```bash
npm run build
npm start
```

`build` creates an optimized production bundle. `start` serves it on [http://localhost:3000](http://localhost:3000).

### Custom port

```bash
npx next dev -p 3001
# or
PORT=3001 npm start
```

### Lint

```bash
npm run lint
```

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `Node.js version ">=20.9.0" is required` | Switch Node: `nvm use` (or install Node 20.9+) |
| Port 3000 already in use | Use another port: `npx next dev -p 3001` |
| Stale `.next` cache | Delete `.next` and run `npm run build` or `npm run dev` again |
| Mixed lockfiles | Prefer one package manager (`package-lock.json` for npm, or `pnpm-lock.yaml` for pnpm) |

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

## Deploy

Deploy with [Vercel](https://vercel.com/new) or see the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
