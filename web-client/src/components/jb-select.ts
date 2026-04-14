import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('jb-select')
export class JBSelect extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: String }) value = '';
  @property({ type: Array }) options: { label: string; value: string | number }[] = [];

  protected createRenderRoot() {
    return this;
  }

  _onChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.dispatchEvent(new CustomEvent('change', { detail: select.value }));
  }

  render() {
    return html`
      <div class="mb-4">
        <label class="block text-sm font-medium text-zinc-300 mb-1">${this.label}</label>
        <select 
          .value=${this.value}
          @change=${this._onChange}
          class="block w-full rounded-md border-0 bg-zinc-800 py-1.5 px-3 text-zinc-100 ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
