# ask-my-brand

A tiny, dependency-free way to add an “Ask” widget to any site page and route questions to your brand’s Ask page.

There are **two scripts** in this repo:

1. **Site Page Widget** — embed on any site page to render the Ask box and send users to your Ask page.
2. **Ask Page Helper** — include on the Ask page itself to read the incoming query string, prefill your input, scroll to a section, and programmatically press your Ask button.

No frameworks. All configuration is via `data-*` attributes on the widget tag.

---

## Quick Start (self-hosted from this repo)

> The examples below load files directly from **GitHub Pages** for this repo (correct MIME type).
> Replace `subscriptionarchitect` and `ask-my-brand` if your org/repo differ.

### 1) Site Page Widget (embed on any page)

Add a placeholder where you want the widget to render, then include the script with `data-mount-id` pointing to that placeholder.

```html
<!-- Placeholder container (required) -->
<div id="ask-my-brand-placeholder"></div>

<!-- Widget script (mounted into the placeholder above) -->
<script
  src="https://subscriptionarchitect.github.io/ask-my-brand/scripts/ask-my-brand.js"
  data-endpoint="https://www.example.com/ask"                 <!-- REQUIRED: your Ask page URL -->
  data-logo-url="https://cdn.example.com/brand/logo.png"      <!-- REQUIRED: your brand logo -->
  data-mount-id="ask-my-brand-placeholder"                    <!-- REQUIRED: ID of the placeholder container -->

  data-prompt="Have a question? Ask us anything relevant to our brand."
  data-placeholder="Type your question…"

  data-sponsor-logo=""                                        <!-- optional -->
  data-sponsor-href=""                                        <!-- optional: make sponsor logo clickable -->
  data-primary="#297FA5"                                      <!-- optional -->
  data-secondary="#000000"                                    <!-- optional (default is black) -->
></script>
```

**Behavior:** When submitted, the widget navigates your browser to `data-endpoint`:

* With a query param if the box has text: `?ask={encoded question}`
* Without a query param if empty

> Note: The widget initializes ~4 seconds after page load to avoid racing other scripts.

---

### 2) Ask Page Helper (include on the Ask page)

Add this **at the bottom** of your Ask page (right before `</body>`):

```html
<script src="https://subscriptionarchitect.github.io/ask-my-brand/scripts/ask-host-autofill.js"></script>
```

What it does:

* Reads `?ask=`, `?question=`, or `?q=` from the URL
* Smooth-scrolls to `#discoverySection` (if it exists)
* Prefills `#ai-search-client input`
* Programmatically clicks `#ai-search-client button` after your page UI is ready

> If your Ask page uses different selectors, update them in `scripts/ask-host-autofill.js`.

---

## Configuration (widget `data-*` attributes)

| Attribute           | Required | Example                                  | Notes                                                                                      |
| ------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| `data-endpoint`     | Yes      | `https://www.example.com/ask`            | Absolute URL to your Ask destination page.                                                 |
| `data-logo-url`     | Yes      | `https://cdn.example.com/brand/logo.png` | Brand logo shown in the widget header.                                                     |
| `data-mount-id`     | Yes      | `ask-my-brand-placeholder`               | **ID** of the placeholder element to mount into.                                           |
| `data-prompt`       | No       | `Have a question? Ask us anything!`      | Short message in the widget body.                                                          |
| `data-placeholder`  | No       | `Type your question…`                    | Input placeholder text.                                                                    |
| `data-sponsor-logo` | No       | `https://cdn.example.com/sponsor.png`    | Sponsor image in the header; leave blank to hide.                                          |
| `data-sponsor-href` | No       | `https://sponsor.example.com/`           | Makes the sponsor logo a hyperlink (opens in a new tab).                                   |
| `data-primary`      | No       | `#297FA5`                                | Primary color for border/header/button.                                                    |
| `data-secondary`    | No       | `#000000`                                | Secondary/accent color (used for “Ask” badge text + AI bubble text). Default is **black**. |

The widget sends the question using the `ask` parameter by default. The helper accepts `ask`, `question`, or `q`.

---

## File Locations (in this repo)

* **Widget script (site pages)**: `scripts/ask-my-brand.js`
* **Ask helper (Ask page)**: `scripts/ask-host-autofill.js`

---

## Minimal Examples

**Site page (widget mounted in a placeholder):**

```html
<div id="ask-my-brand-placeholder"></div>
<script
  src="https://subscriptionarchitect.github.io/ask-my-brand/scripts/ask-my-brand.js"
  data-endpoint="https://www.example.com/ask"
  data-logo-url="https://cdn.example.com/brand/logo.svg"
  data-mount-id="ask-my-brand-placeholder"
  data-prompt="Questions about our products or services? Ask away."
  data-placeholder="Type your question here…"
  data-sponsor-logo="https://cdn.example.com/sponsor.svg"
  data-sponsor-href="https://sponsor.example.com/"
  data-primary="#162247"
  data-secondary="#111827">
</script>
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
<script src="https://subscriptionarchitect.github.io/ask-my-brand/scripts/ask-host-autofill.js"></script>
</body>
</html>
```

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
