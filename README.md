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
