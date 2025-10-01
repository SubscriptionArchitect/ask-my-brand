/*!
 * Project: ask-my-brand (Widget Embed)
 * File: scripts/ask-my-brand.js
 * Version: 1.2.4
 * Description: Brand-agnostic chat/ask widget that mounts into a placeholder container
 *              and redirects to your Ask page with the user’s query as a URL parameter.
 *
 * Author: Brandon Decker
 * License: Apache-2.0
 * Repo: https://github.com/SubscriptionArchitect/ask-my-brand
 *
 * Required data-* on THIS <script>:
 *   - data-mount-id  (preferred) OR data-mount (legacy)  -> placeholder target
 *   - data-endpoint                                       -> Ask page URL
 *   - data-logo-url                                       -> Brand logo URL
 *
 * Optional:
 *   - data-primary, data-secondary, data-sponsor-logo, data-sponsor-text, data-sponsor-href
 *   - data-prompt, data-placeholder, data-button-text, data-param
 *   - data-debug="true" to enable console logging
 *
 * Behavior: Waits ~4s after DOM ready, injects UI, redirects to endpoint?param={encoded}.
 *
 * Changes
 *   1.2.2: AI chat bubble text uses brand secondary; larger sponsor logo.
 *   1.2.3: Sponsor logo can be a hyperlink via data-sponsor-href (opens in new tab).
 *   1.2.4: Default secondary color changed from purple (#582E56) to BLACK (#000000).
 */

(function () {
  "use strict";

  var script =
    document.currentScript ||
    (function () {
      var s = document.getElementsByTagName("script");
      return s[s.length - 1] || null;
    })();
  if (!script) return;

  var DEBUG = (script.getAttribute("data-debug") || "").toLowerCase() === "true";
  function log(){ if (DEBUG) console.log.apply(console, ["[ask-my-brand]"].concat([].slice.call(arguments))); }
  function err(){ console.error.apply(console, ["[ask-my-brand]"].concat([].slice.call(arguments))); }

  // Start after 4 seconds (post-DOM load)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(init, 4000);
    });
  } else {
    setTimeout(init, 4000);
  }

  function init() {
    // Read config
    var mountId        = getAttr("data-mount-id") || "";  // preferred
    var mountSelLegacy = getAttr("data-mount")    || "";  // legacy support
    var endpoint       = getAttr("data-endpoint");
    var logoUrl        = getAttr("data-logo-url");

    // Determine mount target
    var target = null;
    if (mountId) target = document.getElementById(mountId);
    if (!target && mountSelLegacy) target = safeQuery(mountSelLegacy);

    log("mountId:", mountId, "legacy mount selector:", mountSelLegacy, "endpoint:", endpoint, "logo:", logoUrl);

    if (!endpoint || !logoUrl) {
      return err("Missing required attributes: data-endpoint and/or data-logo-url");
    }
    if (!mountId && !mountSelLegacy) {
      return err("Missing required mount: set data-mount-id (preferred) or data-mount (legacy).");
    }
    if (!target) {
      return err("Mount target not found. data-mount-id='" + mountId + "', data-mount='" + mountSelLegacy + "'");
    }

    // Brand options (defaults)
    var primary      = getAttr("data-primary")       || "#297FA5";  // border/button
    var secondary    = getAttr("data-secondary")     || "#000000";  // headings/accents (DEFAULT BLACK)
    var sponsorLogo  = getAttr("data-sponsor-logo")  || "";
    var sponsorText  = getAttr("data-sponsor-text")  || "SPONSORED BY";
    var sponsorHref  = getAttr("data-sponsor-href")  || "";
    var prompt       = getAttr("data-prompt")        || "";
    var placeholder  = getAttr("data-placeholder")   || "Type your question…";
    var btnText      = getAttr("data-button-text")   || "Send";
    var qpName       = getAttr("data-param")         || "ask";

    // CSS
    var style = document.createElement("style");
    style.textContent = [
      ".chat-wrapper{max-width:770px;margin:0 auto;background:#f9f9f9;border:3px solid ",primary,";border-radius:12px;box-shadow:0 12px 28px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:Arial,Helvetica,sans-serif;padding:15px}",
      ".chat-header{display:flex;align-items:center;gap:12px;padding:10px 18px 20px 18px;background:#f7f9fc;border-bottom:1px solid #e1e1e1;flex-wrap:wrap}",
      ".ask-icon{position:relative;display:inline-block;padding:2px 18px 4px;font:700 28px/1 Arial,Helvetica,sans-serif;color:",secondary,";border:3px solid ",primary,";border-radius:8px;background:#fff}",
      ".ask-icon::after{content:'';position:absolute;top:100%;left:50%;width:38px;height:14px;background:",primary,";border-bottom-left-radius:7px;border-bottom-right-radius:7px;transform:translate(-50%,0);clip-path:polygon(0 0,50% 100%,100% 0);padding-bottom:8px}",
      ".header-brand img{height:50px;width:auto}",
      ".header-sp{margin-left:auto;display:flex;align-items:center;gap:8px;font:11px/1 Arial,Helvetica,sans-serif;color:#000;margin-top:5px}",
      ".header-sp a{display:inline-block;line-height:0}",
      ".header-sp img{height:28px;width:auto}", /* bigger sponsor logo */
      ".chat-body{flex:1 1 auto;padding:20px 18px 80px;background:#ffffff;overflow-y:auto}",
      ".message{max-width:85%;margin-bottom:14px;padding:12px 16px;border-radius:12px;font-size:15px;line-height:1.4}",
      ".ai{background:#f3f4f7;color:",secondary,";border:1px solid #e7e6f0}", /* AI text uses secondary (now default black) */
      ".user{background:",primary,";color:#ffffff;margin-left:auto;border:1px solid rgba(0,0,0,.12)}",
      ".input-bar{display:flex;gap:8px;align-items:center;padding:12px 18px;background:#f7f9fc;border-top:1px solid #e1e1e1}",
      "#questionBox{flex:1 1 auto;border:1px solid #d9d9d9;border-radius:18px;padding:10px 14px;font:15px/1.4 Arial,Helvetica,sans-serif;outline:none}",
      "#sendBtn{background:",primary,";color:#ffffff;border:none;border-radius:18px;font:700 16px/1 Arial,Helvetica,sans-serif;padding:10px 24px;cursor:pointer}",
      ".chat-body::-webkit-scrollbar{width:6px}",
      ".chat-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2);border-radius:4px}",
      "@media (max-width:768px){.chat-header{justify-content:center;padding:10px}.ask-icon{padding:2px 12px 4px;font-size:20px}.ask-icon::after{width:26px;height:10px}.header-sp{flex-basis:100%;justify-content:center;margin-top:6px;font-size:10px}.header-sp img{height:24px}}"
    ].join("");
    document.head.appendChild(style);

    // Sponsor block (supports hyperlink)
    var headerSponsor = "";
    if (sponsorLogo) {
      var logoTag = sponsorHref
        ? '<a href="'+esc(sponsorHref)+'" target="_blank" rel="noopener noreferrer"><img src="'+esc(sponsorLogo)+'" alt="Sponsor Logo"></a>'
        : '<img src="'+esc(sponsorLogo)+'" alt="Sponsor Logo">';
      headerSponsor = '<div class="header-sp">'+esc(sponsorText)+' ' + logoTag + '</div>';
    }

    // HTML
    var wrapper = document.createElement("div");
    wrapper.innerHTML = [
      '<div class="chat-wrapper">',
        '<div class="chat-header">',
          '<div class="ask-icon">Ask</div>',
          '<div class="header-brand"><img src="',esc(logoUrl),'" alt="Brand Logo"></div>',
          headerSponsor,
        "</div>",
        '<div id="chatBody" class="chat-body">',
          '<div class="message ai" id="aiGreet">', esc(prompt || "Welcome! Ask us anything related to our brand. Type your question below to get started."), "</div>",
        "</div>",
        '<div class="input-bar">',
          '<input id="questionBox" type="text" placeholder="'+esc(placeholder)+'" aria-label="Your question">',
          '<button id="sendBtn" type="button">'+esc(btnText)+'</button>',
        "</div>",
      "</div>"
    ].join("");
    target.appendChild(wrapper);

    // Behavior
    var chatBody = document.getElementById("chatBody");
    var box      = document.getElementById("questionBox");
    var sendBtn  = document.getElementById("sendBtn");
    var greetEl  = document.getElementById("aiGreet");

    function addMessage(text, cls) {
      var div = document.createElement("div");
      div.className = "message " + cls;
      div.textContent = text;
      chatBody.appendChild(div);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    function send() {
      var q = (box.value || "").trim();
      if (!q) { box.focus(); return; }
      addMessage(q, "user");
      setTimeout(function () {
        var sep = endpoint.indexOf("?") === -1 ? "?" : "&";
        var url = endpoint + sep + encodeURIComponent(qpName) + "=" + encodeURIComponent(q).replace(/%20/g, "+");
        window.location.href = url;
      }, 300);
    }

    sendBtn.addEventListener("click", send);
    box.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });

    // Typewriter effect
    if (greetEl) {
      var txt = greetEl.textContent;
      greetEl.textContent = "";
      var i = 0;
      (function typeLoop() {
        if (i < txt.length) {
          greetEl.textContent += txt.charAt(i++);
          setTimeout(typeLoop, 35);
        }
      })();
    }

    log("Widget initialized successfully.");
  }

  // Helpers
  function getAttr(name) { return script.getAttribute(name) || ""; }
  function safeQuery(sel){ try { return document.querySelector(sel); } catch(e) { err("Invalid selector in data-mount:", sel); return null; } }
  function esc(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
})();
