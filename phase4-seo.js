// Phase 4 SEO hardening: the HTML already contains crawlable movie links and text.
// This enhancement keeps filtering client-side and makes failed poster loads visually explicit.
document.addEventListener("error", function (event) {
  const img = event.target;
  if (img && img.tagName === "IMG" && img.classList.contains("poster-image")) {
    img.hidden = true;
    const card = img.closest(".movie-poster");
    if (card && !card.querySelector(".poster-fallback")) {
      const fallback = document.createElement("span");
      fallback.className = "poster-fallback";
      fallback.textContent = img.alt.replace(/ poster( artwork)?$/i, "");
      card.prepend(fallback);
    }
  }
}, true);
