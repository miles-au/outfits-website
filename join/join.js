(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var code = readCode();
    if (!code) return;
    var wrap = document.querySelector("[data-join-code-wrap]");
    var el = document.querySelector("[data-join-code]");
    var open = document.querySelector("[data-open-app]");
    if (wrap) wrap.hidden = false;
    if (el) el.textContent = code;
    if (open) open.setAttribute("href", "outfits://join/" + encodeURIComponent(code));
  });

  function readCode() {
    var params = new URLSearchParams(window.location.search);
    if (params.get("code")) return params.get("code").trim().toUpperCase();
    var parts = window.location.pathname.split("/").filter(Boolean);
    // /join/{code}
    if (parts.length >= 2 && parts[0] === "join") {
      return parts[1].trim().toUpperCase();
    }
    return null;
  }
})();
