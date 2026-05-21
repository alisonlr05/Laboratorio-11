import styles from "./WeatherTime.css" with { type: "css" };

const CITY = "liberia+guanacaste";
const URL  = `https://goweather.xyz/v2/weather/${CITY}`;

const ICONS = {
  Sunny: "☀️", Cloudy: "⛅", Rainy: "🌧️",
  Stormy: "⛈️", Windy: "🌬️", Snowy: "❄️",
};

class WeatherTime extends HTMLElement {
  #data       = {};
  #time       = "";
  #intervalId = null;

  static get observedAttributes() {
    return ["city"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
    this.#init();            // fetch urgente, antes de conectar al DOM
  }

  async #init() {
    const response = await fetch(URL);
    this.#data = await response.json();
    if (this.isConnected) this.#render();
  }

  connectedCallback() {
    this.#updateTime();
    this.#startClock();
    this.#render();          // primer render — puede ser loading
  }

  disconnectedCallback() {
    clearInterval(this.#intervalId);
  }

  // ── Getter para leer la temperatura (patrón del curso) ──
  get temperature() {
    return this.#data?.temperature;
  }

  get condition() {
    return this.#data?.description;
  }

  get city() {
    return this.getAttribute("city") ?? "Liberia, Guanacaste";
  }

  #updateTime() {
    this.#time = new Date().toLocaleTimeString("es-CR", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  }

  #startClock() {
    this.#intervalId = setInterval(() => {
      this.#updateTime();
      const span = this.shadowRoot.querySelector(".clock");
      if (span) span.textContent = this.#time;
    }, 1000);
  }

  #render() {
    // Sin datos → mostrar loading (patrón del curso)
    if (!this.temperature) {
      this.shadowRoot.setHTMLUnsafe(/* html */`
        <div class="loading-wrapper">
          <div class="loading"></div>
          <div class="loading"></div>
          <div class="loading"></div>
        </div>
      `);
      return;
    }

    const icon = ICONS[this.condition] ?? "🌡️";

    this.shadowRoot.setHTMLUnsafe(/* html */`
      <div class="container" part="container">
        <slot name="city">
          <span class="city" part="city">📍 ${this.city}</span>
        </slot>
        <div class="weather-row" part="weather-row">
          <span class="icon" part="icon">${icon}</span>
          <div>
            <div class="temp" part="temp">${this.temperature}<sup>°C</sup></div>
            <slot name="condition">
              <span class="condition" part="condition">${this.condition}</span>
            </slot>
          </div>
        </div>
        <div class="clock-row">
          <span class="clock-label">⏱</span>
          <span class="clock" part="clock">${this.#time}</span>
        </div>
        <slot name="extra"></slot>
      </div>
    `);
  }
}

customElements.define("weather-time", WeatherTime);