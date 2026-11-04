(() => {
  'use strict';
  const movies = Array.isArray(window.VS_MOVIES) ? window.VS_MOVIES : [];
  const shelves = {
    'now-running': document.getElementById('nowRunningGrid'),
    'advance-booking': document.getElementById('advanceBookingGrid'),
    'coming-soon': document.getElementById('comingSoonGrid'),
    'highlights': document.getElementById('highlightsGrid')
  };
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const emptyState = document.getElementById('emptyState');
  const filterTabs = [...document.querySelectorAll('.filter-tab')];
  const shelfSections = [...document.querySelectorAll('[data-shelf]')];
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  const dialog = document.getElementById('movieDialog');
  const dialogContent = document.getElementById('dialogContent');
  let activeFilter = 'all';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const moneyOrText = value => esc(value);
  const detailPath = movie => `movies/${encodeURIComponent(movie.slug)}/index.html`;
  const statusClass = status => status === 'now-running' ? 'poster-running' : status === 'advance-booking' ? 'poster-booking' : status === 'highlights' ? 'poster-highlight' : 'poster-upcoming';
  function cardTemplate(movie) {
    const metrics = (movie.metrics || []).slice(0,3).map(([label,value]) => `<div class="metric"><span>${esc(label)}</span><strong>${moneyOrText(value)}</strong></div>`).join('');
    const poster = movie.poster ? `<img class="poster-image" src="${esc(movie.poster)}" alt="${esc(movie.title)} poster artwork" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span class="poster-credit">Poster artwork · ${esc(movie.posterSource ? new URL(movie.posterSource).hostname.replace(/^www\./,'') : 'source')}</span>` : `<span class="poster-fallback">${esc(movie.title)}</span>`;
    return `<article class="movie-card">
      <a class="movie-poster ${statusClass(movie.status)}" href="${detailPath(movie)}" aria-label="Open ${esc(movie.title)} details">${poster}<span class="poster-status">${esc(movie.statusLabel)}</span></a>
      <div class="movie-card-body">
        <div class="movie-card-meta"><span>${esc(movie.language)}</span><span>${esc(movie.releaseDate)}</span></div>
        <h4><a href="${detailPath(movie)}">${esc(movie.title)}</a></h4>
        <p class="movie-subtitle">${esc(movie.subtitle)}</p>
        <div class="metric-list">${metrics}</div>
        <p class="update-note"><span class="update-dot"></span>${esc(movie.update)}</p>
        <a class="details-button" href="${detailPath(movie)}">Full movie report <span>↗</span></a>
      </div>
    </article>`;
  }
  function isMatch(movie, query) {
    const searchable = [movie.title,movie.subtitle,movie.language,movie.statusLabel,(movie.genres||[]).join(' '),movie.releaseDate].join(' ').toLowerCase();
    return searchable.includes(query);
  }
  function render() {
    const query = searchInput.value.trim().toLowerCase();
    let matchCount = 0;
    Object.entries(shelves).forEach(([key,grid]) => {
      const matchingFilter = activeFilter === 'all' || activeFilter === key;
      const list = matchingFilter ? movies.filter(movie => movie.status === key && isMatch(movie,query)) : [];
      grid.innerHTML = list.map(cardTemplate).join('');
      const section = document.querySelector(`[data-shelf="${key}"]`);
      section.hidden = list.length === 0;
      matchCount += list.length;
    });
    emptyState.hidden = matchCount > 0;
    clearSearch.hidden = !query;
    filterTabs.forEach(tab => {
      const selected = tab.dataset.filter === activeFilter;
      tab.classList.toggle('active',selected);
      tab.setAttribute('aria-selected',String(selected));
    });
    shelfSections.forEach(section => section.classList.toggle('filtered-out',section.hidden));
  }
  filterTabs.forEach(tab => tab.addEventListener('click',() => { activeFilter=tab.dataset.filter; render(); }));
  searchInput.addEventListener('input',render);
  clearSearch.addEventListener('click',() => { searchInput.value=''; render(); searchInput.focus(); });
  document.querySelectorAll('[data-nav-filter]').forEach(link => link.addEventListener('click',() => {
    activeFilter=link.dataset.navFilter; render();
    primaryNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false');
  }));
  document.getElementById('dialogClose').addEventListener('click',() => dialog.close());
  dialog.addEventListener('click',event => { if(event.target===dialog) dialog.close(); });
  menuToggle.addEventListener('click',() => {
    const expanded=menuToggle.getAttribute('aria-expanded')==='true';
    menuToggle.setAttribute('aria-expanded',String(!expanded)); primaryNav.classList.toggle('open',!expanded);
  });
  primaryNav.addEventListener('click',event => { if(event.target.closest('a')) { primaryNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); } });
  document.getElementById('year').textContent = new Date().getFullYear();
  document.body.addEventListener('error',event => { const img=event.target; if(img && img.classList && img.classList.contains('poster-image')) { img.style.display='none'; img.closest('.movie-poster')?.classList.add('poster-image-missing'); } }, true);
  render();
})();
