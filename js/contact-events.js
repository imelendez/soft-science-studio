/* Load once with defer. Integrate with the existing script rather than duplicating
   handlers. This sends dataLayer events only; GTM forwarding is required. */
(function () {
  'use strict';
  if (window.softScienceContactEventsInstalled) return;
  window.softScienceContactEventsInstalled = true;
  var locations = ['header', 'hero', 'article_end', 'contact_page', 'footer'];
  var methods = ['contact_page', 'email', 'google_form'];
  var articles = [
    'nonprofit-seo-existing-pages', 'campaign-traffic-meaningful-engagement',
    'crm-rollout-team-adoption', 'grant-reporting-event-intake',
    'ga4-small-team-website-measurement'
  ];
  document.addEventListener('click', function (event) {
    var node = event.target;
    var link = node && node.closest ? node.closest('a[data-contact-method]') : null;
    if (!link) return;
    var method = link.getAttribute('data-contact-method');
    var placement = link.getAttribute('data-cta-location');
    if (methods.indexOf(method) === -1 || locations.indexOf(placement) === -1) return;
    var slug = document.body.getAttribute('data-article-id');
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'contact_click',
      contact_method: method,
      cta_location: placement,
      article_id: articles.indexOf(slug) !== -1 ? slug : 'not_article'
    });
  });
}());
