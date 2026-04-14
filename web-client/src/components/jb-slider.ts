import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('jb-slider')
export class JBSlider extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: Number }) value = 0;
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) step = 1;
  @property({ type: String }) unit = '';

  protected createRenderRoot() {
    return this;
  }

  _onInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('change', { detail: parseFloat(input.value) }));
  }

  render() {
    return html`
      <div class="mb-4">
        <div class="flex justify-between mb-1">
          <label class="text-sm font-medium text-zinc-300">${this.label}</label>
          <span class="text-sm font-mono text-zinc-400">${this.value}${this.unit}</span>
        </div>
        <input 
          type="range" 
          .min=${this.min} 
          .max=${this.max} 
          .step=${this.step} 
          .value=${this.value}
          @input=${this._onInput}
          class="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>
    `;
  }
}
