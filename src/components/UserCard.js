import styles from "./UserCard.css" with { type: "css" };

const DEFAULT_AVATAR = "https://api.dicebear.com/8.x/bottts/svg?seed=default";
const DEFAULT_NAME   = "Usuario";
const DEFAULT_ROLE   = "Invitado";

class UserCard extends HTMLElement {
  #avatar = DEFAULT_AVATAR;
  #name   = DEFAULT_NAME;
  #role   = DEFAULT_ROLE;

  static get observedAttributes() {
    return ["avatar", "name", "role"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.#avatar = this.getAttribute("avatar") ?? DEFAULT_AVATAR;
    this.#name   = this.getAttribute("name")   ?? DEFAULT_NAME;
    this.#role   = this.getAttribute("role")   ?? DEFAULT_ROLE;
    this.#render();
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal === newVal) return;
    if (attr === "avatar") this.#avatar = newVal;
    if (attr === "name")   this.#name   = newVal;
    if (attr === "role")   this.#role   = newVal;
    if (this.isConnected) this.#render();
  }

  #render() {
    this.shadowRoot.setHTMLUnsafe(/* html */`
      <div class="container" part="container">
        <div class="avatar-wrapper" part="avatar">
          <img src="${this.#avatar}" alt="Avatar de ${this.#name}" />
        </div>
        <div class="info" part="info">
          <slot name="name">
            <span class="name">${this.#name}</span>
          </slot>
          <slot name="role">
            <p class="role">${this.#role}</p>
          </slot>
        </div>
        <button class="btn-greet" part="button">Saludar</button>
      </div>
    `);

    this.shadowRoot.querySelector(".btn-greet")
      .addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("user:greet", {
          bubbles:  true,
          composed: true,
          detail:   { name: this.#name }
        }));
      });
  }
}

customElements.define("user-card", UserCard);