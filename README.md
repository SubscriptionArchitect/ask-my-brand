
## Quick Start

There are two parts to using **ask-my-brand**:

---

### 1. Embed the widget on any site page

Drop this snippet near the end of your `<body>` tag.  
Replace values with your brand’s logo, endpoint, and colors.

```html
<script
  src="https://cdn.jsdelivr.net/gh/SubscriptionArchitect/ask-my-brand@main/dist/ask-my-brand.min.js"
  data-endpoint="https://www.example.com/ask"                 <!-- destination Ask page -->
  data-logo-url="https://cdn.example.com/brand/logo.png"      
  data-sponsor-logo=""                                        
  data-primary="#297FA5"                                     
  data-secondary="#582E56"                                    
  data-position="bottom-right"                                <!-- bottom-right | bottom-left -->
  data-prompt="Have a question? Ask us about anything relevant to our brand."
  data-placeholder="Type your question..."
></script>
````

* Required: `data-endpoint`, `data-logo-url`
* Optional: `data-prompt`, `data-placeholder`, `data-sponsor-logo`, `data-primary`, `data-secondary`, `data-position`

---

### 2. Add the host-page script to your Ask page

On the page you specified in `data-endpoint`, add this script at the very bottom (before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/gh/SubscriptionArchitect/ask-my-brand@main/scripts/ask-host-autofill.js"></script>
```

This script:

* Reads `?ask=`, `?question=`, or `?q=` from the URL
* Smooth-scrolls to `#discoverySection` (if present)
* Autofills `#ai-search-client input`
* Programmatically clicks `#ai-search-client button`

If your Ask page uses different selectors, edit `scripts/ask-host-autofill.js` accordingly.

---

✅ That’s it — drop the widget anywhere, and it will send the user’s question to your Ask page where the host script takes over.


