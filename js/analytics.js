// One generic click-tracking pattern for the whole site: any element with a
// data-cta attribute fires a single "cta_click" dataLayer event carrying its
// name. A new button never needs new GTM configuration — just add the
// attribute. Mirrors the pattern documented in the Sexy Pace case study.
window.dataLayer = window.dataLayer || [];

document.addEventListener("click", function (event) {
  var el = event.target.closest("[data-cta]");
  if (!el) return;
  window.dataLayer.push({
    event: "cta_click",
    cta_name: el.getAttribute("data-cta"),
  });
});
