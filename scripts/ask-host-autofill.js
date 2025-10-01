/*!
 * Project: ask-my-brand (Host Page Helper)
 * File: scripts/ask-host-autofill.js
 * Version: 1.2.0
 * Description: On the Ask page, reads ?ask= / ?question= / ?q=, scrolls to your section,
 *              prefills your input, and programmatically clicks your Ask button.
 *
 * Author: Brandon Decker
 * Copyright: © 2025 Brandon Decker
 * License: Apache-2.0
 * Repository: https://github.com/SubscriptionArchitect/ask-my-brand
 * Issues: https://github.com/SubscriptionArchitect/ask-my-brand/issues
 *
 * Usage: Include this script at the very bottom of your Ask page (before </body>).
 * Defaults expect:
 *   - Section ID:        #discoverySection               (optional; scroll target)
 *   - Container + input: #ai-search-client input
 *   - Button:            #ai-search-client button
 *
 * If your DOM differs, edit the selectors below.
 */

(function () {
  "use strict";

  // Start after 4 seconds (post-DOM load)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(initAfterDelay, 4000);
    });
  } else {
    setTimeout(initAfterDelay, 4000);
  }

  function initAfterDelay() {
    var q = getQueryFromURL();
    if (!q) return;

    // Poll until UI is mounted/ready
    var tries = 0;
    var maxTries = 40; // 4s extra if needed
    var poll = setInterval(function () {
      var input = document.querySelector("#ai-search-client input");
      var btn   = document.querySelector("#ai-search-client button");
      if ((input && btn) || ++tries >= maxTries) {
        clearInterval(poll);
        if (input && btn) {
          fireQuestion(q);
        }
      }
    }, 100);
  }

  function fireQuestion(q) {
    // Smooth scroll to the discovery section if present
    var section = document.getElementById("discoverySection");
    if (section && section.scrollIntoView) {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    var input = document.querySelector("#ai-search-client input");
    var btn   = document.querySelector("#ai-search-client button");
    if (!input || !btn) return;

    // Fill input and notify any reactive bindings
    input.value = q;
    input.dispatchEvent(new Event("input",  { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));

    // Simulate a human click sequence
    setTimeout(function () {
      ["pointerdown","mousedown","pointerup","mouseup","click"].forEach(function(type){
        btn.dispatchEvent(new MouseEvent(type, { bubbles: true }));
      });
    }, 50);
  }

  function getQueryFromURL() {
    var params = new URLSearchParams(location.search);
    var raw = params.get("ask") || params.get("question") || params.get("q");
    return raw ? decodeURIComponent(String(raw).replace(/\+/g, " ")) : null;
    // Note: If your upstream always sends + for spaces and you don't URL-encode,
    // this still normalizes + to spaces before decoding.
  }
})();
