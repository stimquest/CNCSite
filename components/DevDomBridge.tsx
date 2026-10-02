'use client';

import { useEffect } from 'react';

/** Local DOM inspection for development. Never mounted in production. */
export default function DevDomBridge() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' ||
        !['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;

    const tabId = crypto.randomUUID();
    let previous = '';
    let busy = false;
    let stopped = false;
    const controller = new AbortController();
    async function capture() {
      if (busy || stopped || document.visibilityState !== 'visible') return;
      busy = true;
      try {
        const clone = document.body.cloneNode(true) as HTMLElement;
        clone.querySelectorAll('script, noscript, nextjs-portal').forEach(el => el.remove());
        // Do not record field values, credentials, or inline event handlers.
        clone.querySelectorAll('input, textarea').forEach(el => {
          el.removeAttribute('value');
          if (el.tagName === 'TEXTAREA') el.textContent = '';
        });
        [clone, ...Array.from(clone.querySelectorAll('*'))].forEach(el => {
          for (const attr of Array.from(el.attributes)) {
            if (/^on/i.test(attr.name) || /token|secret|password/i.test(attr.name)) {
              el.removeAttribute(attr.name);
            }
          }
        });
        const html = clone.outerHTML;
        const signature = location.pathname + html;
        if (signature === previous) return;
        const response = await fetch('/api/dev-dom', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ tabId, path: location.pathname, title: document.title,
            capturedAt: new Date().toISOString(),
            viewport: { width: innerWidth, height: innerHeight, scrollX, scrollY }, html }),
        });
        if (response.ok) previous = signature;
      } catch { /* Inspection must never interfere with the page. */ }
      finally { busy = false; }
    }
    void capture();
    const interval = window.setInterval(capture, 2000);
    const onVisible = () => { void capture(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      stopped = true;
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);
  return null;
}
