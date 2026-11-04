(() => {
"use strict";
const movies = Array.isArray(window.VS_MOVIES) ? window.VS_MOVIES : [];
const $ = id => document.getElementById(id);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const metric = (m, label) => (m.metrics || []).find(x => String(x[0]).toLowerCase() === label.toLowerCase())?.[1] || "";
function crore(v) {
  const s = String(v || "").replace(/,/g, "");
  const match = s.match(/[0-9]+(?:\.[0-9]+)?/);
  if (!match) return NaN;
  const n = Number(match[0]);
  if (/lakh/i.test(s)) return n / 100;
  if (/\bcr\b/i.test(s)) return n;
  return NaN;
}
function parseDate(v) {
  if (!v) return null;
  const s = String(v).trim();
  const match = s.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
  const d = match ? new Date(`${match[2]} ${match[1]}, ${match[3]}T00:00:00`) : new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}
function moviePath(m) { return `movie-${encodeURIComponent(m.slug)}.html`; }
function status(m) { return m.statusLabel || ({"now-running":"In cinemas","advance-booking":"Advance booking","coming-soon":"Coming soon","highlights":"2026 highlight"}[m.status] || "Tracked"); }
function card(m) {
  const poster = m.poster ? `<img src="${esc(m.poster)}" alt="${esc(m.title)} poster" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.hidden=true">` : "";
  const values = (m.metrics || []).slice(0, 2).map(([k,v]) => `<div class="metric"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("");
  return `<article class="movie-card"><a class="movie-poster" href="${moviePath(m)}">${poster}<span class="poster-status">${esc(status(m))}</span></a><div class="movie-card-body"><div class="movie-meta"><span>${esc(m.language)}</span><span>${esc(m.releaseDate)}</span></div><h4><a href="${moviePath(m)}">${esc(m.title)}</a></h4><p class="movie-subtitle">${esc(m.subtitle)}</p><div class="metric-list">${values}</div><p class="update-note">${esc(m.update || m.reportedAt || "Source snapshot")}</p><a class="text-link" href="${moviePath(m)}">Full movie report ↗</a></div></article>`;
}
function home() {
  const shelves = {"now-running":"nowRunningGrid","advance-booking":"advanceBookingGrid","coming-soon":"comingSoonGrid","highlights":"highlightsGrid"};
  const input = $("movieSearch"), clear = $("clearSearch");
  const filters = [...document.querySelectorAll("[data-filter]")];
  let active = "all";
  function draw() {
    const query = (input?.value || "").trim().toLowerCase();
    let count = 0;
    Object.entries(shelves).forEach(([st,id]) => {
      const found = movies.filter(m => (active === "all" || active === st) && m.status === st && [m.title,m.subtitle,m.language,m.releaseDate,(m.genres || []).join(" ")].join(" ").toLowerCase().includes(query));
      const grid = $(id); if (grid) grid.innerHTML = found.map(card).join("");
      const section = document.querySelector(`[data-shelf="${st}"]`); if (section) section.hidden = !found.length;
      count += found.length;
    });
    if ($("emptyState")) $("emptyState").hidden = count > 0;
    if (clear) clear.hidden = !query;
    filters.forEach(b => b.classList.toggle("active", b.dataset.filter === active));
  }
  filters.forEach(b => b.addEventListener("click", () => { active = b.dataset.filter; draw(); }));
  input?.addEventListener("input", draw);
  clear?.addEventListener("click", () => { input.value = ""; draw(); input.focus(); });
  if ($("totalMovies")) $("totalMovies").textContent = movies.length;
  if ($("runningCount")) $("runningCount").textContent = movies.filter(m => m.status === "now-running").length;
  if ($("bookingCount")) $("bookingCount").textContent = movies.filter(m => m.status === "advance-booking").length;
  if ($("upcomingCount")) $("upcomingCount").textContent = movies.filter(m => m.status === "coming-soon").length;
  draw();
}
function rankings() {
  const body = $("rankingRows"); if (!body) return;
  function draw() {
    const filter = $("rankFilter")?.value || "all", sort = $("rankSort")?.value || "net-desc";
    let rows = movies.map(m => ({m, net: crore(metric(m,"India Net")), gross: metric(m,"India Gross")})).filter(x => Number.isFinite(x.net));
    if (filter !== "all") rows = rows.filter(x => x.m.status === filter);
    rows.sort((a,b) => sort === "net-asc" ? a.net-b.net : sort === "date-desc" ? (parseDate(b.m.releaseDate)?.getTime() || 0)-(parseDate(a.m.releaseDate)?.getTime() || 0) : b.net-a.net);
    body.innerHTML = rows.map((x,i) => `<tr><td class="rank-num">#${i+1}</td><td><a class="movie-cell" href="${moviePath(x.m)}"><img src="${esc(x.m.poster || "")}" alt="" loading="lazy" onerror="this.hidden=true"><span>${esc(x.m.title)}<small>${esc(x.m.language)} · ${esc(x.m.releaseDate)}</small></span></a></td><td><span class="status-tag ${x.m.status === "highlights" ? "highlight" : "running"}">${esc(status(x.m))}</span></td><td><strong>₹ ${x.net.toFixed(2)} Cr</strong></td><td>${esc(x.gross || "Not listed")}</td><td>${esc(x.m.reportedAt || x.m.update || "Snapshot")}<br><a class="text-link" target="_blank" rel="noopener noreferrer" href="${esc(x.m.sourceUrl || "#")}">${esc(x.m.sourceName || "Source")} ↗</a></td></tr>`).join("");
    if ($("rankingSummary")) $("rankingSummary").textContent = `Showing ${rows.length} tracked titles with numeric India Net figures. This is not a complete industry-wide list.`;
  }
  $("rankFilter")?.addEventListener("change",draw); $("rankSort")?.addEventListener("change",draw); draw();
}
function compare() {
  const selects = [$("compareOne"),$("compareTwo"),$("compareThree")]; if (!selects[0]) return;
  const eligible = movies.filter(m => Number.isFinite(crore(metric(m,"India Net"))));
  const options = eligible.map(m => `<option value="${esc(m.slug)}">${esc(m.title)}</option>`).join("");
  selects[0].innerHTML = options; selects[1].innerHTML = options; selects[2].innerHTML = `<option value="">None</option>${options}`;
  if (eligible[1]) selects[1].value = eligible[1].slug;
  const output = $("compareOutput");
  function draw() {
    const chosen = selects.map(s => eligible.find(m => m.slug === s.value)).filter(Boolean);
    const items = [...new Map(chosen.map(m => [m.slug,m])).values()].map(m => ({m,net:crore(metric(m,"India Net"))}));
    if (items.length < 2) { output.innerHTML = '<p class="small-note">Choose at least two different movies to compare.</p>'; return; }
    const max = Math.max(...items.map(x => x.net), 1);
    output.innerHTML = `<div class="compare-cards">${items.map(x => `<article class="compare-card"><img src="${esc(x.m.poster || "")}" alt="${esc(x.m.title)} poster" onerror="this.hidden=true"><h3>${esc(x.m.title)}</h3><div class="compare-value">₹ ${x.net.toFixed(2)} Cr</div><small>India Net · ${esc(x.m.reportedAt || x.m.update || "Source snapshot")}</small></article>`).join("")}</div><div class="bar-chart"><h3>India Net · snapshot comparison</h3>${items.map(x => `<div class="bar-row"><span>${esc(x.m.title)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.max(2,x.net/max*100)}%"></div></div><strong>₹ ${x.net.toFixed(2)} Cr</strong></div>`).join("")}</div><div class="plain-panel"><h2>Sources and timestamps</h2>${items.map(x => `<p><b>${esc(x.m.title)}:</b> ${esc(x.m.reportedAt || x.m.update || "Snapshot")} · <a class="text-link" target="_blank" rel="noopener noreferrer" href="${esc(x.m.sourceUrl || "#")}">${esc(x.m.sourceName || "Source")}</a></p>`).join("")}</div>`;
  }
  selects.forEach(s => s.addEventListener("change",draw)); draw();
}
function calendar() {
  const el = $("calendarList"); if (!el) return;
  function draw() {
    const filter = $("calendarFilter")?.value || "all", sort = $("calendarSort")?.value || "soonest";
    const today = new Date(); today.setHours(0,0,0,0);
    let rows = movies.map(m => ({m,d:parseDate(m.releaseDate)})).filter(x => x.d);
    if (filter === "upcoming") rows = rows.filter(x => x.d >= today);
    if (filter === "released") rows = rows.filter(x => x.d < today);
    rows.sort((a,b) => sort === "latest" ? b.d-a.d : a.d-b.d);
    el.innerHTML = rows.map(({m,d}) => { const released = d < today; const day = String(d.getDate()).padStart(2,"0"), month = d.toLocaleString("en-IN",{month:"short",year:"numeric"}); return `<article class="calendar-item"><div class="calendar-date">${day}<small>${month}</small></div><div><h3><a href="${moviePath(m)}">${esc(m.title)}</a></h3><p>${esc(m.language)} · ${esc(m.subtitle)} · ${esc(m.dateStatus || "Date reported " + (m.reportedAt || "source snapshot"))}</p></div><span class="status-tag ${released ? "running" : "highlight"}">${released ? "Released" : "Coming soon"}</span></article>`; }).join("") || '<p class="small-note">No dates found for this filter.</p>';
  }
  $("calendarFilter")?.addEventListener("change",draw); $("calendarSort")?.addEventListener("change",draw); draw();
}
const menu = $("menuToggle"), nav = $("mainNav");
menu?.addEventListener("click",() => { const open = nav.classList.toggle("open"); menu.setAttribute("aria-expanded",String(open)); });
const page = document.body.dataset.page;
if (page === "home") home(); if (page === "rankings") rankings(); if (page === "compare") compare(); if (page === "release-calendar") calendar();
})();
