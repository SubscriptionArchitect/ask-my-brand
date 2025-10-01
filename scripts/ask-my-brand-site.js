/*!
 * ask-my-brand — placeholder-mounted chat widget
 * - Brand-agnostic; all styling/content via data-* attributes on THIS <script>
 * - 4s delayed init to avoid racing page scripts/layout
 *
 * REQUIRED data-attributes:
 *   data-mount-id     -> ID of the placeholder container (e.g., "askMyBrandPlaceholder")
 *   data-endpoint     -> Absolute URL of your Ask page (e.g., "https://www.example.com/ask")
 *   data-logo-url     -> Brand logo URL
 *
 * OPTIONAL data-attributes:
 *   data-primary      -> Primary color (border/button/accent), e.g., "#297FA5"
 *   data-secondary    -> Secondary color (heading/label accents), e.g., "#582E56"
 *   data-sponsor-logo -> Sponsor logo URL (omit to hide)
 *   data-prompt       -> Greeting/intro text shown at the top of the chat
 *   data-placeholder  -> Input placeholder (default: "Type your question…")
 *   data-param        -> Query param name (default: "ask")
 *   data-button-text  -> Submit button text (default: "Send")
 *   data-sponsor-text -> Label before sponsor logo (default: "SPONSORED BY")
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

  // Delay init by 4s (matches your referenced pattern)
  setTimeout(init, 4000);

  function init() {
    // ---- Read config from data-* ----
    var mountId   = attr("data-mount-id");
    var endpoint  = attr("data-endpoint");
    var logoUrl   = attr("data-logo-url");

    if (!mountId || !endpoint || !logoUrl) {
      console.error("[ask-my-brand] Missing required attributes: data-mount-id, data-endpoint, data-logo-url");
      return;
    }

    var primary      = attr("data-primary")       || "#297FA5";
    var secondary    = attr("data-secondary")     || "#582E56";
    var sponsorLogo  = attr("data-sponsor-logo")  || "";
    var prompt       = attr("data-prompt")        || "";
    var placeholder  = attr("data-placeholder")   || "Type your question…";
    var qpName       = attr("data-param")         || "ask";
    var btnText      = attr("data-button-text")   || "Send";
    var sponsorText  = attr("data-sponsor-text")  || "SPONSORED BY";

    // ---- Find mount target ----
    var target = document.getElementById(mountId);
    if (!target) return;

    // ---- Inject CSS (brandable via primary/secondary) ----
    var style = document.createElement("style");
    style.textContent = [
      ".chat-wrapper{max-width:770px;margin:0 auto;background:#f9f9f9;border:3px solid ",primary,";border-radius:12px;box-shadow:0 12px 28px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;font-family:Arial,Helvetica,sans-serif;padding:15px}",
      ".chat-header{display:flex;align-items:center;gap:12px;padding:10px 18px 20px 18px;background:#f7f9fc;border-bottom:1px solid #e1e1e1;flex-wrap:wrap}",
      ".ask-icon{position:relative;display:inline-block;padding:2px 18px 4px;font:700 28px/1 Arial,Helvetica,sans-serif;color:",secondary,";border:3px solid ",primary,";border-radius:8px;background:#fff}",
      ".ask-icon::after{content:'';position:absolute;top:100%;left:50%;width:38px;height:14px;background:",primary,";border-bottom-left-radius:7px;border-bottom-right-radius:7px;transform:translate(-50%,0);clip-path:polygon(0 0,50% 100%,100% 0);padding-bottom:8px}",
      ".header-brand img{height:50px;width:auto}",
      ".header-sp{margin-left:auto;display:flex;align-items:center;gap:6px;font:11px/1 Arial,Helvetica,sans-serif;color:#000;margin-top:5px}",
      ".header-sp img{height:20px;width:auto}",
      ".chat-body{flex:1 1 auto;padding:20px 18px 80px;background:#ffffff;overflow-y:auto}",
      ".message{max-width:85%;margin-bottom:14px;padding:12px 16px;border-radius:12px;font-size:15px;line-height:1.4}",
      ".ai{background:#f3f4f7;color:#0f2a33;border:1px solid #e7e6f0}",
      ".user{background:",primary,";color:#ffffff;margin-left:auto;border:1px solid rgba(0,0,0,.12)}",
      ".input-bar{display:flex;gap:8px;align-items:center;padding:12px 18px;background:#f7f9fc;border-top:1px solid #e1e1e1}",
      "#questionBox{flex:1 1 auto;border:1px solid #d9d9d9;border-radius:18px;padding:10px 14px;font:15px/1.4 Arial,Helvetica,sans-serif;outline:none}",
      "#sendBtn{background:",primary,";color:#ffffff;border:none;border-radius:18px;font:700 16px/1 Arial,Helvetica,sans-serif;padding:10px 24px;cursor:pointer}",
      ".chat-body::-webkit-scrollbar{width:6px}",
      ".chat-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2);border-radius:4px}",
      "@media (max-width:768px){.chat-header{justify-content:center;padding:10px}.ask-icon{padding:2px 12px 4px;font-size:20px}.ask-icon::after{width:26px;height:10px}.header-sp{flex-basis:100%;justify-content:center;margin-top:6px;font-size:10px}.header-sp img{height:16px}}"
    ].join("");
    document.head.appendChild(style);

    // ---- Inject HTML (logo, optional sponsor, prompt) ----
    var wrapper = document.createElement("div");
    wrapper.innerHTML = [
      '<div class="chat-wrapper">',
        '<div class="chat-header">',
          '<div class="ask-icon">Ask</div>',
          '<div class="header-brand">',
            '<img src="',esc(logoUrl),'" alt="Brand Logo">',
          "</div>",
          sponsorLogo
            ? '<div class="header-sp">'+esc(sponsorText)+' <img src="'+esc(sponsorLogo)+'" alt="Sponsor Logo"></div>'
            : "",
        "</div>",
        '<div id="chatBody" class="chat-body">',
          '<div class="message ai" id="aiGreet">',
            esc(prompt || "Welcome! Ask us anything related to our brand. Type your question below to get started."),
          "</div>",
        "</div>",
        '<div class="input-bar">',
          '<input id="questionBox" type="text" placeholder="'+esc(placeholder)+'" aria-label="Your question">',
          '<button id="sendBtn" type="button">'+esc(btnText)+'</button>',
        "</div>",
      "</div>"
    ].join("");
    target.appendChild(wrapper);

    // ---- Behavior ----
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
        // Build redirect like: https://example.com/ask?ask=Your+Question
        var url = endpoint + (endpoint.indexOf("?") === -1 ? "?" : "&") +
                  encodeURIComponent(qpName) + "=" +
                  encodeURIComponent(q).replace(/%20/g, "+");
        window.location.href = url;
      }, 300);
    }

    sendBtn.addEventListener("click", send);
    box.addEventListener("keydown", function (e) { if (e.key === "Enter") send(); });

    // Type-in greeting
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
  }

  function attr(name) { return script.getAttribute(name) || ""; }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();

