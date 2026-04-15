import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './jb-slider.css?inline';

@customElement('jb-slider')
export class JBSlider extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @property({ type: String }) label = '';
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: String }) unit = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  _onInput(e: Event) {
    e.stopPropagation(); // Prevent duplicate/conflicting native events
    const input = e.target as HTMLInputElement;
    const val = parseFloat(input.value);
    this.value = val; // Smoother dragging
    this.dispatchEvent(new CustomEvent('input', { 
      detail: val,
      bubbles: true,
      composed: true 
    }));
  }

  _onChange(e: Event) {
    e.stopPropagation(); // Prevent duplicate/conflicting native events
    const input = e.target as HTMLInputElement;
    const val = parseFloat(input.value);
    this.value = val;
    this.dispatchEvent(new CustomEvent('change', { 
      detail: val,
      bubbles: true,
      composed: true 
    }));
  }

  render() {
    const displayValue = this.value ?? 0;
    return html`
      <div class="slider-container">
        <div class="header">
          <label class="label">${this.label}</label>
          <span class="value">${displayValue}${this.unit}</span>
        </div>
        <input 
          type="range" 
          ?disabled=${this.disabled}
          .min=${(this.min ?? 0).toString()} 
          .max=${(this.max ?? 100).toString()} 
          .step=${(this.step ?? 1).toString()} 
          .value=${displayValue.toString()}
          @input=${this._onInput}
          @change=${this._onChange}
        />
      </div>
    `;
  }
}
