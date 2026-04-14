import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('jb-toggle')
export class JBToggle extends LitElement {
  @property({ type: Boolean }) enabled = false;
  @property({ type: String }) label = '';

  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="flex items-center justify-between mb-4">
        <label class="text-sm font-medium text-zinc-300">${this.label}</label>
        <button 
          @click=${() => this.dispatchEvent(new CustomEvent('change', { detail: !this.enabled }))}
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${this.enabled ? 'bg-blue-600' : 'bg-zinc-700'}"
        >
          <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${this.enabled ? 'translate-x-5' : 'translate-x-0'}"></span>
        </button>
      </div>
    `;
  }
}
