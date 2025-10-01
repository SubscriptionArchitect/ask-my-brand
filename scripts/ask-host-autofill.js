/**
 * ask-host-autofill.js
 * Handles autofilling questions on the Ask page when redirected from ask-my-brand widget.
 * Author: Brandon Decker
 * License: Apache-2.0
 * Date: 2025-10-01
 */

document.addEventListener('DOMContentLoaded', function () {
  // Acceptable query param keys
  const KEYS = ['q', 'ask', 'question'];
  const params = new URLSearchParams(window.location.search);

  let query = '';
  for (const key of KEYS) {
    if (params.has(key)) {
      query = params.get(key).trim();
      break;
    }
  }
  if (!query) return; // nothing passed

  // Locate the Ask form input + button
  const input = document.querySelector('input[type="text"], textarea');
  const button = document.querySelector('button, input[type="submit"]');
  const scrollTarget = document.querySelector('#discoverySection') || input;

  if (!input || !button) {
    console.warn('[ask-host-autofill] Input or button not found on Ask page.');
    return;
  }

  // Fill and scroll
  input.value = query;
  if (scrollTarget) {
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Auto-click submit after a short delay (optional)
  setTimeout(() => {
    button.click();
  }, 600);
});
