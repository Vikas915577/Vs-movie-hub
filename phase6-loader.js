/* VS Movie Hub · shared Phase 6 asset loader
   Loads Phase 6 styles before its browser-only features. No backend is used.
*/
(() => {
  'use strict';
  if (window.__VS_PHASE6_LOADER_STARTED__) return;
  window.__VS_PHASE6_LOADER_STARTED__ = true;

  const source = document.currentScript && document.currentScript.src
    ? document.currentScript.src
    : window.location.href;
  const cssHref = new URL('./phase6.css', source).href;
  const jsHref = new URL('./phase6.js', source).href;

  function loadFeatures() {
    if (window.__VS_PHASE6_STARTED__) return;
    const script = document.createElement('script');
    script.src = jsHref;
    script.async = false;
    script.onerror = () => console.warn('VS Movie Hub Phase 6 features could not load.');
    document.head.appendChild(script);
  }

  let style = document.querySelector('link[data-vsm-phase6-css]');
  if (!style) {
    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = cssHref;
    style.dataset.vsmPhase6Css = 'true';
    style.onload = loadFeatures;
    style.onerror = loadFeatures;
    document.head.appendChild(style);
  } else {
    loadFeatures();
  }
})();
