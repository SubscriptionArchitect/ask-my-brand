# ask-my-brand (brand-agnostic Ask widget)

A tiny, dependency-free widget you can drop on **any brand site** to capture a user’s question and open your brand’s “Ask” page with the query in the URL. The widget is fully configured via **data-attributes** (no JS defaults), including the **prompt** copy.

## What this repo includes

- `src/ask-my-brand.js` – the embeddable widget (reads ONLY from data-attributes)
- `dist/ask-my-brand.min.js` – same as src for v1; wire minification later
- `scripts/ask-host-autofill.js` – a script for the **destination “Ask” page** that:
  - Reads the query from `ask`, `question`, or `q` URL params
  - Smooth-scrolls to your discovery/AI section
  - Prefills and programmatically clicks your on-page Ask button
- Project docs: `LICENSE` (Apache-2.0), `NOTICE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`

---

## 1) Embed the widget (on any brand page)

Place near the end of `<body>`:

```html
<script
  src="https://YOUR_CDN/ask-my-brand/dist/ask-my-brand.min.js"
  data-endpoint="https://www.food-safety.com/ask-fsm"
  data-logo-url="https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/FSM-FB.png"
  data-sponsor-logo="https://cdn.omeda.com/hosted/images/CLIENT_BNP/BNPCD/trustwell-logo.png"
  data-primary="#297FA5"
  data-secondary="#582E56"
  data-position="bottom-right"
  data-prompt="Have a food safety question? Ask us about HACCP, audits, recalls, regulatory changes, sanitation, and more."
  data-placeholder="Type your question..."
></script>
