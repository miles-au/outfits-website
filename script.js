/*
 * Outfits — shared site behaviour.
 * No dependencies, no analytics, no tracking.
 */
(function () {
  "use strict";

  // Mark that JS is available so CSS can opt elements into scroll reveals.
  document.documentElement.classList.add("js");

  // Keep the footer year current.
  document.addEventListener("DOMContentLoaded", function () {
    var year = String(new Date().getFullYear());
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = year;
    });

    initReveals();
  });

  // Reveal .reveal elements as they scroll into view.
  // Skipped entirely when the visitor prefers reduced motion.
  function initReveals() {
    var targets = document.querySelectorAll(".reveal");
    if (targets.length === 0) return;

    var reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }
})();
