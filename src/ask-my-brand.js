/**
 * ask-my-brand.js
 * A brand-agnostic Ask widget, configurable only via data attributes.
 * Author: Brandon Decker
 * License: Apache-2.0
 * Date: 2025-10-01
 */

(function () {
  const script = document.currentScript;
  if (!script) return;

  // Required
  const endpoint = script.getAttribute('data-endpoint');
  const logoUrl = script.getAttribute('data-logo-url');

  if (!endpoint || !logoUrl) {
    console.error(
      '[ask-my-brand] Missing required attributes: data-endpoint, data-logo-url'
    );
    return;
  }

  // Optional
  const prompt = script.getAttribute('data-prompt') || '';
  const placeholder =
    script.getAttribute('data-placeholder') || 'Type your question...';
  const colorPrimary = script.getAttribute('data-color-primary') || '#297FA5';
  const colorSecondary = script.getAttribute('data-color-secondary') || '#582E56';
  const position = script.getAttribute('data-position') || 'bottom-right';

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    .ask-widget {
      font-family: sans-serif;
      position: fixed;
      ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      background: #fff;
      border: 2px solid ${colorPrimary};
      border-radius: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      width: 280px;
      z-index: 9999;
      overflow: hidden;
    }
    .ask-header {
      background: ${colorPrimary};
      padding: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ask-header img {
      height: 24px;
    }
    .ask-body {
      padding: 12px;
    }
    .ask-prompt {
      font-size: 14px;
      margin-bottom: 8px;
      color: #333;
    }
    .ask-input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .ask-button {
      background: ${colorSecondary};
      color: #fff;
      border: none;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      width: 100%;
    }
    .ask-button:hover {
      opacity: 0.9;
    }
  `;
  document.head.appendChild(style);

  // Markup
  const widget = document.createElement('div');
  widget.className = 'ask-widget';
  widget.innerHTML = `
    <div class="ask-header">
      <img src="${logoUrl}" alt="Brand Logo">
    </div>
    <div class="ask-body">
      ${prompt ? `<div class="ask-prompt">${prompt}</div>` : ''}
      <input type="text" class="ask-input" placeholder="${placeholder}" />
      <button class="ask-button">Ask</button>
    </div>
  `;

  document.body.appendChild(widget);

  // Behavior
  const input = widget.querySelector('.ask-input');
  const button = widget.querySelector('.ask-button');

  button.addEventListener('click', () => {
    const q = encodeURIComponent(input.value.trim());
    const url = q ? `${endpoint}?q=${q}` : endpoint;
    window.open(url, '_blank');
  });
})();
