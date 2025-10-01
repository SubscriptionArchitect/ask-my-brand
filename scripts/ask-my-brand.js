<script>
(function makeFreshAddressWork(){
  // ---- selectors you can tweak if needed ----
  const FORM_SEL        = "#brand-join-form";
  const CTA_SEL         = "#bj-cta";
  const EMAIL_MOUNT_SEL = "#bj-email-mount";
  const EMAIL_ID        = "id13";                 // FA expects a stable id
  const FA_HOST_ID      = "freshaddressmessage";  // FA message target (we provide it)
  const INLINE_HINT_ID  = "fa-inline-hint";
  const INLINE_TEXT     = "Oops! The email address you entered isn't valid.";

  // small helper
  const $ = (s, r=document) => r.querySelector(s);

  // 1) make sure the CTA actually submits the form
  const form = $(FORM_SEL);
  const cta  = $(CTA_SEL);
  if (form && cta) {
    // if it's not a submit, make it one
    if (cta.getAttribute("type") !== "submit") cta.setAttribute("type", "submit");
  }

  // 2) ensure there is a real email input inside #bj-email-mount
  (function ensureEmailInput(){
    const mount = $(EMAIL_MOUNT_SEL);
    if (!mount) return;

    let email = document.getElementById(EMAIL_ID);
    if (!email) {
      // try to find an existing email-like input within the mount
      email = mount.querySelector("input[type='email'], input[name='email']");
    }
    if (!email) {
      // create a simple email input if nothing exists (keeps your styling light)
      email = document.createElement("input");
      email.type = "email";
      email.id = EMAIL_ID;
      email.name = "email";
      email.autocomplete = "email";
      email.required = true;
      email.placeholder = "Business Email";
      email.className = "bj-input bj-email";
      mount.appendChild(email);
    } else {
      // normalize attributes FA often expects
      if (!email.id) email.id = EMAIL_ID;
      if (!email.name) email.name = "email";
      if (!email.type) email.type = "email";
      email.autocomplete = email.autocomplete || "email";
    }
  })();

  // 3) ensure FA message host exists (so FA has somewhere to write)
  (function ensureFAMessageHost(){
    const mount = $(EMAIL_MOUNT_SEL);
    if (!mount) return;
    let host = document.getElementById(FA_HOST_ID);
    if (!host) {
      host = document.createElement("div");
      host.id = FA_HOST_ID;
      host.setAttribute("aria-live", "polite");
      host.style.minHeight = "1rem";
      host.style.marginTop = "6px";
      // place AFTER the email field by default
      const email = document.getElementById(EMAIL_ID);
      if (email && email.parentNode) {
        email.parentNode.insertBefore(host, email.nextSibling);
      } else {
        mount.appendChild(host);
      }
    }
  })();

  // 4) inline blue hint above the email when FA posts a message
  function ensureInlineHintAboveEmail(){
    const email = document.getElementById(EMAIL_ID);
    if (!email) return;
    let hint = document.getElementById(INLINE_HINT_ID);
    if (!hint) {
      hint = document.createElement("div");
      hint.id = INLINE_HINT_ID;
      hint.style.color = "#0066cc";
      hint.style.fontWeight = "500";
      hint.style.fontSize = "14px";
      hint.style.lineHeight = "1.4";
      hint.style.marginBottom = "6px";
      email.parentNode.insertBefore(hint, email);
    }
    return hint;
  }

  function removeInlineHint(){
    const hint = document.getElementById(INLINE_HINT_ID);
    if (hint && hint.parentNode) hint.parentNode.removeChild(hint);
  }

  function faHasText(){
    const host = document.getElementById(FA_HOST_ID);
    const t = host && (host.textContent || host.innerText || "");
    return !!(t && t.trim());
  }

  function syncInline(){
    const host = document.getElementById(FA_HOST_ID);
    if (!host) return;
    if (faHasText()) {
      const hint = ensureInlineHintAboveEmail();
      if (hint) hint.textContent = INLINE_TEXT; // only the “Oops!” line
      // hide the raw FA block to avoid duplicate messaging
      host.style.display = "none";
    } else {
      // restore FA block area and remove our hint
      host.style.display = "";
      removeInlineHint();
    }
  }

  // 5) observe FA host for changes (so inline updates instantly)
  (function watchFA(){
    const host = document.getElementById(FA_HOST_ID);
    if (!host) return;
    const mo = new MutationObserver(syncInline);
    mo.observe(host, { childList: true, characterData: true, subtree: true });
  })();

  // 6) nudge FA by firing typical events on the email field
  (function primeFA(){
    const email = document.getElementById(EMAIL_ID);
    if (!email) return;
    const debounced = (fn, ms=200) => {
      let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null,args), ms); };
    };
    const pokeFA = debounced(() => {
      // dispatch events FA often listens for
      ["input","change","blur"].forEach(type => email.dispatchEvent(new Event(type, { bubbles:true })));
    }, 150);

    email.addEventListener("input", pokeFA);
    email.addEventListener("blur",  pokeFA);
  })();

  // 7) one initial sync (in case FA injected early/inline)
  syncInline();
})();
</script>
