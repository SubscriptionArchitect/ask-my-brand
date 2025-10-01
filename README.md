
# ask-my-brand

A tiny, dependency-free way to add a floating “Ask” widget to ANY site page and route questions to your brand’s Ask page.

There are **two scripts** in this repo:

1) **Site Page Widget** – add to any site page to render the floating Ask box and send users to your Ask page.  
2) **Ask Page Helper** – add to the Ask page itself to read the incoming query string, prefill your input, scroll to the right section, and programmatically press your Ask button.

No frameworks. All configuration is via `data-*` attributes on the widget tag.

---

## Quick Start

### 1) Site Page Widget (embed on any page)

Place this near the end of `<body>` on the pages where you want the widget to appear:

```html
<script
  src="https://cdn.jsdelivr.net/gh/SubscriptionArchitect/ask-my-brand@main/dist/ask-my-brand.min.js"
  data-endpoint="https://www.example.com/ask"                 <!-- REQUIRED: your Ask page URL -->
  data-logo-url="https://cdn.example.com/brand/logo.png"      <!-- REQUIRED: your brand logo -->

  data-prompt="Have a question? Ask us anything relevant to our brand."
  data-placeholder="Type your question..."

  data-sponsor-logo=""                                        <!-- optional -->
  data-primary="#297FA5"                                      <!-- optional -->
  data-secondary="#582E56"                                    <!-- optional -->
  data-position="bottom-right"                                <!-- optional: bottom-right | bottom-left -->
></script>
````

**Behavior:** When submitted, the widget opens your `data-endpoint` in a new tab:

* With a query param if the box has text: `?ask={encoded question}`
* Without a query param if empty

> Direct (raw) alternative URL (if you do not want jsDelivr):
> `https://raw.githubusercontent.com/SubscriptionArchitect/ask-my-brand/main/dist/ask-my-brand.min.js`

---

### 2) Ask Page Helper (include on the Ask page)

Add this **at the bottom** of your Ask page (right before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/gh/SubscriptionArchitect/ask-my-brand@main/scripts/ask-host-autofill.js"></script>
```

What it does:

* Reads `?ask=`, `?question=`, or `?q=` from the URL
* Smooth-scrolls to `#discoverySection` (if it exists)
* Prefills `#ai-search-client input`
* Programmatically clicks `#ai-search-client button` after your page UI is ready

> Direct (raw) alternative URL:
> `https://raw.githubusercontent.com/SubscriptionArchitect/ask-my-brand/main/scripts/ask-host-autofill.js`

If your Ask page uses different selectors, update them in `scripts/ask-host-autofill.js`.

---

## Configuration (widget `data-*` attributes)

| Attribute           | Required | Example                                  | Notes                                                                  |
| ------------------- | -------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| `data-endpoint`     | Yes      | `https://www.example.com/ask`            | Absolute URL to your Ask destination page.                             |
| `data-logo-url`     | Yes      | `https://cdn.example.com/brand/logo.png` | Brand logo shown in the widget header.                                 |
| `data-prompt`       | No       | `Have a question? Ask us anything!`      | Short message in the widget body. If omitted, the body text is hidden. |
| `data-placeholder`  | No       | `Type your question...`                  | Input placeholder text.                                                |
| `data-sponsor-logo` | No       | `https://cdn.example.com/sponsor.png`    | Sponsor image in the footer. Leave blank to hide.                      |
| `data-primary`      | No       | `#297FA5`                                | Primary color for border/header/button.                                |
| `data-secondary`    | No       | `#582E56`                                | Secondary color used in body text accents.                             |
| `data-position`     | No       | `bottom-right`                           | `bottom-right` (default) or `bottom-left`.                             |

The widget sends the question using the `ask` parameter by default. The helper accepts `ask`, `question`, or `q`.

---

## File Locations (in this repo)

* **Widget script (site pages)**: `dist/ask-my-brand.min.js`
* **Ask helper (Ask page)**: `scripts/ask-host-autofill.js`

---

## Minimal Examples

**Site page (widget):**

```html
<!-- ...your page content... -->
<script
  src="https://cdn.jsdelivr.net/gh/SubscriptionArchitect/ask-my-brand@main/dist/ask-my-brand.min.js"
  data-endpoint="https://www.example.com/ask"
  data-logo-url="https://cdn.example.com/brand/logo.svg"
  data-prompt="Questions about our products or services? Ask away."
  data-placeholder="Type your question here..."
  data-primary="#162247"
  data-secondary="#EF4627"
  data-position="bottom-right">
</script>
</body>
</html>
```

**Ask page (helper at bottom):**

```html
<!-- ...your Ask page content... -->
<section id="discoverySection">
  <div id="ai-search-client">
    <input type="text" placeholder="Ask your question" />
    <button type="button">Ask</button>
  </div>
</section>

<!-- Include helper right before closing body -->
<script src="https://cdn.jsdelivr.net/gh/SubscriptionArchitect/ask-my-brand@main/scripts/ask-host-autofill.js"></script>
</body>
</html>
```

> If your input/button live under different selectors, edit `scripts/ask-host-autofill.js` to match your DOM.

---

## Accessibility

* Keyboard friendly (Enter submits).
* Semantic HTML controls.
* High-contrast defaults; colors are configurable.

---

## Privacy & Data

* The widget does not post data to third parties. It only opens your Ask page URL with an optional query param.
* Handle any storage/logging on your Ask page per your privacy policy.

---

## License

Apache-2.0 © 2025 Brandon Decker.
Logos and trademarks referenced by integrators remain the property of their respective owners. See [LICENSE](./LICENSE) and [NOTICE](./NOTICE).

