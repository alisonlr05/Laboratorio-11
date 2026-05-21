import styles from "./WarningBadge.css" with { type: "css" };

const DEFAULT_MESSAGE = "Sesión por expirar";

class WarningBadge extends HTMLElement {
  #message = DEFAULT_MESSAGE;

  static get observedAttributes() {
    return ["pulsing", "message"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.#message = this.getAttribute("message") ?? DEFAULT_MESSAGE;
    this.#render();
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (attr === "message" && oldVal !== newVal) {
      this.#message = newVal ?? DEFAULT_MESSAGE;
      if (this.isConnected) this.#render();
    }
    // "pulsing" lo maneja :host([pulsing]) en el CSS — no necesita render
  }

  #render() {
    this.shadowRoot.setHTMLUnsafe(/* html */`
      <div class="badge" part="badge">
        <div class="badge-content" part="content">
          <slot name="icon">
            <span class="badge-icon" part="icon">⚠️</span>
          </slot>
          <slot name="message">
            <span part="message">${this.#message}</span>
          </slot>
          <slot name="extra"></slot>
        </div>
      </div>
    `);
  }
}

customElements.define("warning-badge", WarningBadge);