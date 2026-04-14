import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './jb-toggle.css?inline';

@customElement('jb-toggle')
export class JBToggle extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @property({ type: Boolean, reflect: true }) enabled = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = '';

  render() {
    return html`
      <div class="toggle-container">
        <label class="label">${this.label}</label>
        <button 
          class="switch"
          role="switch"
          aria-checked=${this.enabled}
          ?disabled=${this.disabled}
          @click=${() => this.dispatchEvent(new CustomEvent('change', { detail: !this.enabled }))}
        >
          <span class="thumb"></span>
        </button>
      </div>
    `;
  }
}
