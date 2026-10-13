const DEFAULT_API = "http://127.0.0.1:8790";

async function apiBase() {
  const stored = await chrome.storage.sync.get(["apiBase"]);
  const base = (stored.apiBase || DEFAULT_API).trim().replace(/\/$/, "");
  return base || DEFAULT_API;
}

chrome.action.onClicked.addListener(async function () {
  const url = chrome.runtime.getURL("app/index.html");
  await chrome.tabs.create({ url });
});

chrome.runtime.onMessage.addListener(function (msg, _sender, sendResponse) {
  if (msg?.type !== "xendra-api") return;
  (async function () {
    try {
      const base = await apiBase();
      const path = msg.path.startsWith("/") ? msg.path : "/" + msg.path;
      const url = base + path;
      const headers = Object.assign({ Accept: "application/json" }, msg.headers || {});
      const init = {
        method: msg.method || "GET",
        headers,
      };
      if (msg.body != null && msg.body !== "") init.body = msg.body;
      const r = await fetch(url, init);
      const body = await r.text();
      const ct = r.headers.get("content-type") || "application/json";
      if (!r.ok) {
        let err = "HTTP " + r.status;
        try {
          const j = JSON.parse(body);
          err = j.error || j.message || err;
        } catch (e) {}
        sendResponse({ ok: false, status: r.status, error: err, body });
        return;
      }
      sendResponse({ ok: true, status: r.status, body, contentType: ct });
    } catch (e) {
      sendResponse({ ok: false, error: String(e.message || e) });
    }
  })();
  return true;
});
