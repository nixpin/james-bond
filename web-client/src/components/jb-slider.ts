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

  _onInput(e: Event) {
    e.stopPropagation(); // Prevent native input event from leaking
    const input = e.target as HTMLInputElement;
    const val = parseFloat(input.value);
    this.value = val; // Update internal value for display
    this.dispatchEvent(new CustomEvent('input', { 
      detail: val,
      bubbles: true,
      composed: true 
    }));
  }

  _onChange(e: Event) {
    e.stopPropagation(); // Prevent native change event from leaking
    const input = e.target as HTMLInputElement;
    const val = parseFloat(input.value);
    this.dispatchEvent(new CustomEvent('change', { 
      detail: val,
      bubbles: true,
      composed: true 
    }));
  }

  render() {
    return html`
      <div class="slider-container">
        <div class="header">
          <label class="label">${this.label}</label>
          <span class="value">${this.value}${this.unit}</span>
        </div>
        <input 
          type="range" 
          .min=${this.min.toString()} 
          .max=${this.max.toString()} 
          .step=${this.step.toString()} 
          .value=${this.value.toString()}
          @input=${this._onInput}
          @change=${this._onChange}
        />
      </div>
    `;
  }
}
