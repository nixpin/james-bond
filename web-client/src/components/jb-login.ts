import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dspApi } from '../dsp-api';
import './jb-button';

@customElement('jb-login')
export class JBLogin extends LitElement {
  @state() private username = '';
  @state() private password = '';
  @state() private error = '';
  @state() private loading = false;

  protected createRenderRoot() {
    return this;
  }

  async _handleSubmit(e: Event) {
    e.preventDefault();
    this.error = '';
    this.loading = true;

    try {
      await dspApi.login({ username: this.username, password: this.password });
    } catch (err: any) {
      this.error = err.message || 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <img src="/logo.png" alt="Logo" class="login-logo" />
            <h1 class="login-title">James Bond</h1>
            <p class="login-subtitle">Sign in to manage JamesDSP</p>
          </div>

          <form @submit=${this._handleSubmit} class="login-form">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input 
                type="text" 
                .value=${this.username}
                @input=${(e: any) => this.username = e.target.value}
                required
                class="form-input"
                placeholder="Admin or Client"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input 
                type="password" 
                .value=${this.password}
                @input=${(e: any) => this.password = e.target.value}
                class="form-input"
                placeholder="Leave blank for clients"
              />
            </div>

            ${this.error ? html`
              <div class="login-error">
                <svg class="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ${this.error}
              </div>
            ` : ''}

            <!-- Hidden submit button for Enter key support -->
            <button type="submit" class="hidden" aria-hidden="true"></button>

            <jb-button 
              type="submit"
              variant="primary" 
              class="w-full"
              .disabled=${this.loading}
            >
              ${this.loading ? 'Signing in...' : 'Sign In'}
            </jb-button>
          </form>
        </div>
      </div>
    `;
  }
}
