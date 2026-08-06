/*
 * Outfits — invitation landing page.
 *
 * Privacy rules enforced here:
 *   - The invitation token is read from the URL only to decide whether to
 *     show the masked "Invitation: ••••••••" badge.
 *   - The token is NEVER rendered, logged, stored, or transmitted anywhere.
 *   - No invitation validation happens on the website; the mobile app and
 *     its backend own that entirely.
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    showMaskedTokenBadge();
    tailorStoreButtons();
    wireRetryLink();
  });

  /* If a token is present, reveal the badge with a fixed-length mask.
     A fixed length avoids leaking even the token's size. */
  function showMaskedTokenBadge() {
    var params = new URLSearchParams(window.location.search);
    var token = params.get("token");
    if (!token) return;

    var badge = document.querySelector("[data-invite-token]");
    var mask = document.querySelector("[data-invite-mask]");
    if (!badge || !mask) return;

    mask.textContent = "••••••••";
    badge.hidden = false;
  }

  /* Show only the store button for the visitor's platform.
     Desktop (or unknown) keeps both. No automatic redirects. */
  function tailorStoreButtons() {
    var platform = detectPlatform();
    if (platform === "unknown") return;

    var hide = platform === "ios" ? "android" : "ios";
    document
      .querySelectorAll('[data-store="' + hide + '"]')
      .forEach(function (btn) {
        btn.hidden = true;
      });
  }

  function detectPlatform() {
    var ua = navigator.userAgent || "";

    // iPadOS 13+ reports a Mac user agent but still supports touch.
    var iPadOS =
      /Macintosh/.test(ua) &&
      typeof navigator.maxTouchPoints === "number" &&
      navigator.maxTouchPoints > 1;

    if (/iPhone|iPad|iPod/.test(ua) || iPadOS) return "ios";
    if (/Android/.test(ua)) return "android";
    return "unknown";
  }

  /* "I already have Outfits" links back to this exact invitation URL,
     including the token, so tapping it re-fires the Universal Link /
     Android App Link and opens the app if it is installed. */
  function wireRetryLink() {
    var retry = document.querySelector("[data-invite-retry]");
    if (!retry) return;
    retry.setAttribute("href", window.location.href);
  }
})();
