# Xendra Wallet — Chrome Extension

Manifest V3 extension for Chrome and Chromium. The UI is a production build from the [wallet-core-web](https://github.com/zehraakar424-lgtm/wallet-core-web) app repo.

## Install (development)

1. Start the wallet API locally from the app repo:

   ```bash
   git clone https://github.com/zehraakar424-lgtm/wallet-core-web.git
   cd wallet-core-web
   npm install && npm run dev
   ```

   Server: `http://127.0.0.1:8790`

2. Chrome → `chrome://extensions` → enable **Developer mode** → **Load unpacked** → select this repository folder.

3. Click the Xendra toolbar icon to open the wallet.

## Production API

By default, `background.js` proxies requests to `http://127.0.0.1:8790`.

For production, set your hosted wallet origin (same `/api/*` routes as `server.mjs` in the app repo):

```js
chrome.storage.sync.set({ apiBase: "https://wallet.yourdomain.com" });
```

## Rebuild UI after app changes

From a clone of **wallet-core-web**:

```bash
npm run build:ext
# default output: sibling ../ext-git/app
# or: XENDRA_EXT_DIR=/path/to/this/repo npm run build:ext
```

Commit updated `app/` and `icons/` in this repository.

## Layout

```
manifest.json
background.js
icons/
app/          # Vite build (committed)
```

## Security

Recovery phrases and passwords stay in the browser (`localStorage` / `sessionStorage`). They are not stored in this repository.
