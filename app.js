(() => {
  const movies = Array.isArray(window.VS_MOVIES) ? window.VS_MOVIES : [];
  const grid = document.getElementById('movieGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const emptyState = document.getElementById('emptyState');
  const filterTabs = [...document.querySelectorAll('.filter-tab')];
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const dialog = document.getElementById('movieDialog');
  const dialogContent = document.getElementById('dialogContent');
  let activeFilter = 'all';

  const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const statusIcon = status => status === 'now-running' ? '▣' : status === 'advance-booking' ? '◷' : '✦';
  const posterClass = status => status === 'now-running' ? 'poster-running' : status === 'advance-booking' ? 'poster-booking' : 'poster-upcoming';

  function cardTemplate(movie) {
    const metrics = movie.metrics.slice(0, 3).map(([label, value]) => `
      <div class="metric"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`).join('');
    return `
      <article class="movie-card">
        <div class="movie-poster ${posterClass(movie.status)}">
          <span class="poster-kicker">VS MOVIE HUB · PREVIEW</span>
          <span class="poster-symbol">${statusIcon(movie.status)}</span>
          <span class="poster-title">${escapeHTML(movie.title)}</span>
          <span class="poster-status">${escapeHTML(movie.statusLabel)}</span>
        </div>
        <div class="movie-card-body">
          <div class="movie-card-meta"><span>${escapeHTML(movie.language)}</span><span>${escapeHTML(movie.releaseDate)}</span></div>
          <h3>${escapeHTML(movie.title)}</h3>
          <p class="movie-subtitle">${escapeHTML(movie.subtitle)}</p>
          <div class="metric-list">${metrics}</div>
          <p class="update-note"><span class="update-dot"></span>${escapeHTML(movie.update)}</p>
          <button class="details-button" type="button" data-movie-id="${escapeHTML(movie.id)}">View movie layout <span>↗</span></button>
        </div>
      </article>`;
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const visible = movies.filter(movie => {
      const matchesFilter = activeFilter === 'all' || movie.status === activeFilter;
      const searchable = [movie.title, movie.subtitle, movie.language, movie.statusLabel].join(' ').toLowerCase();
      return matchesFilter && searchable.includes(query);
    });
    grid.innerHTML = visible.map(cardTemplate).join('');
    emptyState.hidden = visible.length !== 0;
    grid.hidden = visible.length === 0;
    clearSearch.hidden = !query;
    document.querySelectorAll('.filter-tab').forEach(tab => {
      const selected = tab.dataset.filter === activeFilter;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
  }

  filterTabs.forEach(tab => tab.addEventListener('click', () => {
    activeFilter = tab.dataset.filter;
    render();
  }));
  searchInput.addEventListener('input', render);
  clearSearch.addEventListener('click', () => { searchInput.value = ''; render(); searchInput.focus(); });

  grid.addEventListener('click', event => {
    const button = event.target.closest('[data-movie-id]');
    if (!button) return;
    const movie = movies.find(item => item.id === button.dataset.movieId);
    if (!movie) return;
    dialogContent.innerHTML = `
      <div class="dialog-eyebrow">PHASE 1 MOVIE PAGE TEMPLATE</div>
      <h2 id="dialogTitle">${escapeHTML(movie.title)}</h2>
      <p>${escapeHTML(movie.summary)}</p>
      <div class="dialog-data">${movie.metrics.map(([label, value]) => `<div><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></div>`).join('')}</div>
      <p class="dialog-footnote">${escapeHTML(movie.update)}. Figures are intentionally not invented in this preview.</p>`;
    dialog.showModal();
  });
  document.getElementById('dialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    primaryNav.classList.toggle('open', !expanded);
  });
  primaryNav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      primaryNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  render();
})();
