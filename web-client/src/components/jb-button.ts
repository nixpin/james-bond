import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './jb-button.css?inline';

@customElement('jb-button')
export class JBButton extends LitElement {
  static styles = css`${unsafeCSS(styles)}`;

  @property({ type: String }) variant: 'primary' | 'secondary' | 'danger' = 'primary';
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  _handleClick(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    
    if (this.type === 'submit') {
      const form = (this.getRootNode() as ShadowRoot | Document).querySelector('form') || this.closest('form');
      if (form) {
        // Create a temporary submit button and click it to trigger validation and submit events
        const tmpSubmit = document.createElement('button');
        tmpSubmit.type = 'submit';
        tmpSubmit.style.display = 'none';
        form.appendChild(tmpSubmit);
        tmpSubmit.click();
        form.removeChild(tmpSubmit);
      }
    }
  }

  render() {
    return html`
      <button 
        type=${this.type}
        ?disabled=${this.disabled}
        class="${this.variant}"
        @click=${this._handleClick}
      >
        <slot></slot>
      </button>
    `;
  }
}
