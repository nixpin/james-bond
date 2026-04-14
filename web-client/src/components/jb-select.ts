import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './jb-select.css?inline';

@customElement('jb-select')
export class JBSelect extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: Array }) options: { label: string; value: string | number }[] = [];
  @property({ type: Boolean, reflect: true }) disabled = false;

  _onChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.dispatchEvent(new CustomEvent('change', { detail: select.value }));
  }

  render() {
    return html`
      <div class="select-container">
        <label>${this.label}</label>
        <select 
          ?disabled=${this.disabled}
          .value=${this.value}
          @change=${this._onChange}
        >
          ${this.options.map(opt => html`
            <option value=${opt.value} ?selected=${this.value === opt.value.toString()}>
              ${opt.label}
            </option>
          `)}
        </select>
      </div>
    `;
  }
}
