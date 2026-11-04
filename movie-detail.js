(() => {
"use strict";
const movies=Array.isArray(window.VS_MOVIES)?window.VS_MOVIES:[];
const slug=document.body.dataset.slug;
const host=document.getElementById("detailContent");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
if(!host)return;
const m=movies.find(x=>x.slug===slug);
if(!m){host.innerHTML='<section class="plain-panel"><h1>Movie report unavailable</h1><p>This movie is not in the current tracker. <a href="index.html">Return home</a>.</p></section>';return;}
const metrics=(m.metrics||[]).map(([k,v])=>`<div class="detail-metric"><span>${esc(k)}</span><strong>${esc(v)}</strong></div>`).join("");
const poster=m.poster?`<img class="detail-poster" src="${esc(m.poster)}" alt="${esc(m.title)} poster artwork" referrerpolicy="no-referrer" onerror="this.hidden=true">`:"";
const source=m.sourceUrl?`<a href="${esc(m.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(m.sourceName||"Open source")} ↗</a>`:"Source not supplied";
const psrc=m.posterSource||m.poster;
const note=m.booking?.note||"Figures are third-party estimates or reports and may be revised. They are not audited producer accounts.";
const basis=m.collectionStatus||m.booking?.basis||(m.status==="coming-soon"?"Not released — no box-office collection available":"See linked source for reporting basis");
host.innerHTML=`<div class="detail-top">${poster}<div><p class="eyebrow">${esc(m.statusLabel||m.status)}</p><h1>${esc(m.title)}</h1><p class="detail-copy">${esc(m.subtitle)} · ${esc(m.language)} · Release: ${esc(m.releaseDate)}</p><p class="detail-copy">${esc(m.summary||"Movie information and source-labelled figures.")}</p><p class="small-note">Genres: ${esc((m.genres||[]).join(", ")||"Not listed")}</p></div></div><div class="detail-metrics">${metrics}</div><section class="detail-source"><b>Data source:</b> ${source}<br><b>Reporting snapshot:</b> ${esc(m.reportedAt||m.update||"Not supplied")}<br><b>Figure basis:</b> ${esc(basis)}<p>${esc(note)}</p>${psrc?`<p>Poster source: <a href="${esc(psrc)}" target="_blank" rel="noopener noreferrer">View artwork source ↗</a>. Source credit is not a commercial image licence.</p>`:""}</section><section class="history-placeholder"><b>Day-wise collection history</b><br>Verified date-by-date cumulative figures are not included in the current dataset for this title. No invented daily chart is shown.</section><p class="detail-footnote">VS Movie Hub is an independent information project and is not affiliated with the film's producer, studio or distributor. Film posters and trademarks remain the property of their respective rights holders.</p>`;
})();
