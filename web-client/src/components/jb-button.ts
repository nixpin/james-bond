import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('jb-button')
export class JBButton extends LitElement {
  @property({ type: String }) variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @property({ type: Boolean }) disabled = false;

  protected createRenderRoot() {
    return this;
  }

  render() {
    const baseClasses = "px-4 py-2 rounded-md font-medium text-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2";
    const variantClasses = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 focus:ring-zinc-600",
      danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
    };

    return html`
      <button 
        .disabled=${this.disabled}
        class="${baseClasses} ${variantClasses[this.variant]} ${this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
      >
        <slot></slot>
      </button>
    `;
  }
}
