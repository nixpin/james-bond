import { LitElement, html, css } from 'lit';

export class JamesBondApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      padding: 20px;
    }
  `;

  render() {
    return html`
      <h1>James Bond - Management Suite</h1>
      <p>Bridges the gap between JamesDSP and the web.</p>
    `;
  }
}

customElements.define('james-bond-app', JamesBondApp);
