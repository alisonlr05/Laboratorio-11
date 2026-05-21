import styles from "./UserDashboard.css" with { type: "css" };

class UserDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.shadowRoot.setHTMLUnsafe(/* html */`<slot></slot>`);
    this.addEventListener("user:greet", this.#handleGreet.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener("user:greet", this.#handleGreet);
  }

  #handleGreet(event) {
    const { name } = event.detail;
    const badge = this.querySelector("warning-badge");
    if (!badge) return;

    badge.setAttribute("message", `👋 ¡Hola, ${name}!`);
    badge.setAttribute("pulsing", "");

    setTimeout(() => {
      badge.removeAttribute("pulsing");
      badge.setAttribute("message", "Sesión por expirar");
    }, 4000);
  }
}

customElements.define("user-dashboard", UserDashboard);