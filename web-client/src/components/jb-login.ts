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
      <div class="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div class="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
          <div class="mb-8 text-center">
            <h1 class="text-3xl font-black text-blue-500 tracking-tighter uppercase italic mb-2">James Bond</h1>
            <p class="text-zinc-500 text-sm">Sign in to manage JamesDSP</p>
          </div>

          <form @submit=${this._handleSubmit} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-zinc-400 mb-2">Username</label>
              <input 
                type="text" 
                .value=${this.username}
                @input=${(e: any) => this.username = e.target.value}
                required
                class="block w-full rounded-lg border-0 bg-zinc-800 py-2.5 px-4 text-zinc-100 ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="Admin or Client"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input 
                type="password" 
                .value=${this.password}
                @input=${(e: any) => this.password = e.target.value}
                class="block w-full rounded-lg border-0 bg-zinc-800 py-2.5 px-4 text-zinc-100 ring-1 ring-inset ring-zinc-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                placeholder="Leave blank for clients"
              />
            </div>

            ${this.error ? html`
              <div class="bg-red-900/20 border border-red-900/50 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ${this.error}
              </div>
            ` : ''}

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
