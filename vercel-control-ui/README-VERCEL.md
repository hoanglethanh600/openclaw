# OpenClaw Control UI — Vercel deployment

Static build of the official OpenClaw Control UI (from the published
`openclaw` npm package v2026.10.9, `dist/control-ui`). Deploy this
folder as a static Vercel project (no build command, output = this
folder).

The Control UI is only the browser front-end. It connects over
WebSocket to an OpenClaw Gateway, which must run on a persistent
host (your computer, Fly.io, Render, Railway, a VPS — see
`docs/install/` in the main repo). Vercel cannot run the Gateway
itself: it needs a long-lived process and a persistent disk.

Open the deployed site, then in the connection screen / Settings ->
Gateway enter your Gateway URL (e.g. `wss://your-gateway-host`)
and its gateway token/password.
