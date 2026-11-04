/* VS Movie Hub · Phase 6: device-only Watchlist, Recently Viewed, Share and honest live-view status.
   No backend, account, analytics endpoint, or cross-device sync is used.
*/
(() => {
  'use strict';
  if (window.__VS_PHASE6_STARTED__) return;
  window.__VS_PHASE6_STARTED__ = true;

  const movies = Array.isArray(window.VS_MOVIES) ? window.VS_MOVIES : [];
  const KEYS = {
    saved: 'vsMovieHub.watchlist.v1',
    recent: 'vsMovieHub.recentlyViewed.v1'
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function readList(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string'))] : [];
    } catch (_) { return []; }
  }
  function writeList(key, value) {
    try { localStorage.setItem(key, JSON.stringify([...new Set(value)])); return true; }
    catch (_) { toast('Device storage is unavailable in this browser.'); return false; }
  }
  const getSaved = () => readList(KEYS.saved);
  const getRecent = () => readList(KEYS.recent);
  const movieBySlug = slug => movies.find(movie => movie.slug === slug);
  function slugFromLink(link) {
    if (!link) return '';
    try {
      const path = new URL(link.getAttribute('href'), location.href).pathname;
      const match = path.match(/(?:^|\/)movie-([^/]+)\.html$/i);
      return match ? decodeURIComponent(match[1]) : '';
    } catch (_) { return ''; }
  }
  function currentMovie() {
    const match = location.pathname.split('/').pop().match(/^movie-(.+)\.html$/i);
    return match ? movieBySlug(decodeURIComponent(match[1])) : null;
  }

  let toastTimer;
  function toast(message) {
    let node = $('#vsmToast');
    if (!node) {
      node = document.createElement('div');
      node.id = 'vsmToast';
      node.className = 'vsm-toast';
      node.setAttribute('role', 'status');
      node.setAttribute('aria-live', 'polite');
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('is-visible'), 2400);
  }

  function mountLiveView() {
    const header = $('.topbar');
    if (!header) return;
    if (!$('#vsmLiveView')) {
      const badge = document.createElement('span');
      badge.id = 'vsmLiveView';
      badge.className = 'vsm-live-view';
      badge.setAttribute('role', 'status');
      badge.setAttribute('aria-live', 'polite');
      badge.title = 'This page is open on your device. This is not a site-wide visitor counter.';
      badge.innerHTML = '<span class="vsm-live-dot" aria-hidden="true"></span><b class="vsm-live-label">LIVE</b><span class="vsm-live-copy">THIS PAGE IS OPEN</span>';
      const menuButton = $('.menu-toggle', header);
      header.insertBefore(badge, menuButton || header.firstChild.nextSibling);
    }
    const status = $('#vsmLiveView');
    const sync = () => {
      const online = navigator.onLine !== false;
      status.dataset.connection = online ? 'online' : 'offline';
      const label = $('.vsm-live-label', status);
      const copy = $('.vsm-live-copy', status);
      label.textContent = online ? 'LIVE' : 'OFFLINE';
      copy.textContent = online ? 'THIS PAGE IS OPEN' : 'NO NETWORK';
      status.title = online
        ? 'This page is open in your current browser. This is not a site-wide visitor counter.'
        : 'Your browser reports that the network is offline. Cached pages may still work.';
    };
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);

    const nav = $('nav', header);
    if (nav && !$('.vsm-watchlist-nav', nav)) {
      const link = document.createElement('a');
      link.className = 'vsm-watchlist-nav';
      link.href = 'watchlist.html';
      link.innerHTML = 'Watchlist <span class="vsm-nav-count">0</span>';
      nav.appendChild(link);
    }
    updateNavCount();
  }

  function updateNavCount() {
    const count = getSaved().length;
    $$('.vsm-nav-count').forEach(node => { node.textContent = String(count); });
  }
  function actionButton(label, action, slug, extraClass = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `vsm-action-button ${extraClass}`.trim();
    button.dataset.vsmAction = action;
    button.dataset.vsmSlug = slug;
    button.textContent = label;
    return button;
  }
  function createMovieActions(movie) {
    const wrapper = document.createElement('div');
    wrapper.className = 'vsm-card-actions';
    wrapper.dataset.vsmActions = 'true';
    wrapper.append(
      actionButton('♡ Save', 'save', movie.slug),
      actionButton('Share ↗', 'share', movie.slug, 'vsm-share-button')
    );
    return wrapper;
  }
  function enrichMovieCards(root = document) {
    $$('.movie-card', root).forEach(card => {
      if ($('[data-vsm-actions]', card)) return;
      const link = $('a[href*="movie-"][href$=".html"]', card);
      const slug = slugFromLink(link);
      const movie = movieBySlug(slug);
      if (!movie) return;
      const body = $('.movie-card-body', card) || card;
      body.appendChild(createMovieActions(movie));
    });
    refreshSaveButtons();
  }
  function enrichDetailPage() {
    const movie = currentMovie();
    if (!movie || $('[data-vsm-detail-actions]')) return;
    const target = $('.detail-links') || $('.detail-footnote') || $('main');
    if (!target) return;
    const wrapper = createMovieActions(movie);
    wrapper.classList.add('vsm-detail-actions');
    wrapper.dataset.vsmDetailActions = 'true';
    target.parentNode.insertBefore(wrapper, target);
    refreshSaveButtons();
  }
  function refreshSaveButtons() {
    const saved = new Set(getSaved());
    $$('[data-vsm-action="save"]').forEach(button => {
      const isSaved = saved.has(button.dataset.vsmSlug);
      button.textContent = isSaved ? '♥ Saved' : '♡ Save';
      button.classList.toggle('is-saved', isSaved);
      button.setAttribute('aria-pressed', String(isSaved));
    });
    updateNavCount();
  }

  async function shareMovie(movie) {
    if (!movie) return;
    const url = new URL(`movie-${encodeURIComponent(movie.slug)}.html`, location.href).href;
    const shareData = { title: `${movie.title} | VS Movie Hub`, text: `Check the box-office report for ${movie.title} on VS Movie Hub.`, url };
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
        return;
      }
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(url);
        toast('Movie link copied.');
        return;
      }
      const field = document.createElement('textarea');
      field.value = url;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed'; field.style.opacity = '0';
      document.body.appendChild(field); field.select();
      const copied = document.execCommand('copy'); field.remove();
      toast(copied ? 'Movie link copied.' : 'Could not copy link on this browser.');
    } catch (error) {
      if (error && error.name !== 'AbortError') toast('Share is unavailable right now.');
    }
  }

  function listCard(movie, isRecent = false) {
    const saved = new Set(getSaved());
    const status = movie.statusLabel || 'Tracked title';
    const poster = movie.poster
      ? `<img src="${escapeHtml(movie.poster)}" alt="${escapeHtml(movie.title)} poster" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="vsm-poster-fallback">${escapeHtml(movie.title)}</span>`
      : `<span class="vsm-poster-fallback">${escapeHtml(movie.title)}</span>`;
    const action = isRecent
      ? `<button type="button" class="vsm-action-button" data-vsm-action="save" data-vsm-slug="${escapeHtml(movie.slug)}">${saved.has(movie.slug) ? '♥ Saved' : '♡ Save'}</button>`
      : `<button type="button" class="vsm-action-button is-remove" data-vsm-action="remove" data-vsm-slug="${escapeHtml(movie.slug)}">Remove</button>`;
    return `<article class="vsm-list-card">
      <a class="vsm-list-poster" href="movie-${encodeURIComponent(movie.slug)}.html">${poster}</a>
      <div class="vsm-list-copy"><p class="vsm-list-status">${escapeHtml(status)}</p><h3><a href="movie-${encodeURIComponent(movie.slug)}.html">${escapeHtml(movie.title)}</a></h3>
      <p>${escapeHtml(movie.language || '')} · ${escapeHtml(movie.releaseDate || '')}</p>
      <div class="vsm-list-actions">${action}<button type="button" class="vsm-action-button vsm-share-button" data-vsm-action="share" data-vsm-slug="${escapeHtml(movie.slug)}">Share ↗</button></div></div>
    </article>`;
  }
  function renderCollection(targetId, slugs, recent = false) {
    const target = document.getElementById(targetId);
    if (!target) return;
    const items = slugs.map(movieBySlug).filter(Boolean);
    target.innerHTML = items.map(movie => listCard(movie, recent)).join('');
    const empty = document.querySelector(`[data-vsm-empty="${targetId}"]`);
    if (empty) empty.hidden = items.length > 0;
  }
  function renderWatchlistPage() {
    if (!document.body.hasAttribute('data-vsm-watchlist-page')) return;
    renderCollection('vsmSavedGrid', getSaved());
    renderCollection('vsmRecentGrid', getRecent(), true);
    const clearSaved = $('#vsmClearSaved');
    const clearRecent = $('#vsmClearRecent');
    if (clearSaved) clearSaved.disabled = getSaved().length === 0;
    if (clearRecent) clearRecent.disabled = getRecent().length === 0;
  }
  function addRecentMovie(movie) {
    if (!movie) return;
    const list = getRecent().filter(slug => slug !== movie.slug);
    list.unshift(movie.slug);
    writeList(KEYS.recent, list.slice(0, 8));
  }

  document.addEventListener('click', event => {
    const clear = event.target.closest('[data-vsm-clear]');
    if (clear) {
      if (clear.dataset.vsmClear === 'saved') writeList(KEYS.saved, []);
      if (clear.dataset.vsmClear === 'recent') writeList(KEYS.recent, []);
      renderWatchlistPage(); refreshSaveButtons(); return;
    }
    const button = event.target.closest('[data-vsm-action]');
    if (!button) return;
    const movie = movieBySlug(button.dataset.vsmSlug);
    if (!movie) return;
    const action = button.dataset.vsmAction;
    if (action === 'save') {
      const saved = getSaved();
      const next = saved.includes(movie.slug) ? saved.filter(slug => slug !== movie.slug) : [...saved, movie.slug];
      if (writeList(KEYS.saved, next)) toast(next.includes(movie.slug) ? 'Added to your Watchlist.' : 'Removed from your Watchlist.');
      refreshSaveButtons(); renderWatchlistPage();
    } else if (action === 'remove') {
      writeList(KEYS.saved, getSaved().filter(slug => slug !== movie.slug));
      toast('Removed from your Watchlist.');
      renderWatchlistPage(); refreshSaveButtons();
    } else if (action === 'share') {
      shareMovie(movie);
    }
  });

  function mountManifestAndWorker() {
    if (!$('link[rel="manifest"]')) {
      const manifest = document.createElement('link');
      manifest.rel = 'manifest'; manifest.href = 'site.webmanifest';
      document.head.appendChild(manifest);
    }
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
      navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(error => {
        console.warn('VS Movie Hub offline support could not register.', error);
      });
    }
  }

  function setupInstallButton() {
    const button = $('#vsmInstallApp');
    if (!button) return;
    let promptEvent = null;
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault(); promptEvent = event; button.hidden = false;
    });
    button.addEventListener('click', async () => {
      if (!promptEvent) { toast('Use your browser menu and choose Add to Home screen.'); return; }
      promptEvent.prompt();
      try { await promptEvent.userChoice; } catch (_) {}
      promptEvent = null; button.hidden = true;
    });
    window.addEventListener('appinstalled', () => { button.hidden = true; toast('VS Movie Hub installed.'); });
  }

  mountLiveView();
  mountManifestAndWorker();
  addRecentMovie(currentMovie());
  enrichMovieCards();
  enrichDetailPage();
  renderWatchlistPage();
  setupInstallButton();

  const observer = new MutationObserver(records => {
    let changed = false;
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node.nodeType === 1) {
          if (node.matches?.('.movie-card') || node.querySelector?.('.movie-card')) changed = true;
        }
      }
    }
    if (changed) enrichMovieCards();
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
