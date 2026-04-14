import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dspApi } from './dsp-api';
import './components/dsp-bass';
import './components/dsp-master';
import './components/dsp-tube';
import './components/dsp-convolver';
import './components/dsp-equalizer';
import './components/jb-login';
import './components/jb-button';

@customElement('james-bond-app')
export class JamesBondApp extends LitElement {
  @state() private authenticated = dspApi.isAuthenticated();

  protected createRenderRoot() {
    return this; // For Tailwind integration
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('jb-auth-change', () => {
      this.authenticated = dspApi.isAuthenticated();
    });
    window.addEventListener('jb-unauthorized', () => {
      this.authenticated = false;
    });
  }

  _logout() {
    dspApi.logout();
  }

  render() {
    if (!this.authenticated) {
      return html`<jb-login></jb-login>`;
    }

    return html`
      <div class="p-6 max-w-5xl mx-auto">
        <header class="mb-10 flex items-center justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 class="text-4xl font-black text-blue-500 tracking-tighter uppercase italic">James Bond</h1>
            <p class="text-zinc-500 font-medium">Bridges the gap between JamesDSP and the web.</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="inline-flex h-3 w-3 rounded-full bg-green-500"></span>
              <span class="text-sm font-semibold text-zinc-400">Connected</span>
            </div>
            <jb-button variant="secondary" @click=${this._logout} class="text-xs">
              Logout
            </jb-button>
          </div>
        </header>

        <main class="grid gap-8 animate-in fade-in duration-700">
          <section id="equalizer">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              Frequency Response
            </h2>
            <dsp-equalizer></dsp-equalizer>
          </section>

          <section id="dsp-controls">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              DSP Modules
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
               <dsp-bass></dsp-bass>
               <dsp-master></dsp-master>
               <dsp-tube></dsp-tube>
               <dsp-convolver></dsp-convolver>
            </div>
          </section>
        </main>

        <footer class="mt-20 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-600 font-medium">
          James Bond &copy; 2026 — Designed for JamesDSP Headless
        </footer>
      </div>
    `;
  }
}
