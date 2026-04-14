import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dspApi, Convolver } from '../dsp-api';
import './jb-toggle';
import './jb-select';

@customElement('dsp-convolver')
export class DSPConvolver extends LitElement {
  @state() private config: Convolver = { enabled: false, file: '', optimization_mode: 0, waveform_edit: '-80;-100;0;0;0;0' };

  protected createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.config = await dspApi.getConvolver();
  }

  async _update(config: Partial<Convolver>) {
    this.config = { ...this.config, ...config };
    await dspApi.setConvolver(this.config);
  }

  render() {
    return html`
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <header class="flex items-center gap-2 border-b border-zinc-800 pb-3 -mb-2">
          <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
          <h3 class="font-bold text-zinc-100 tracking-tight">Convolution</h3>
        </header>
        
        <jb-toggle 
          label="Enable" 
          .enabled=${this.config.enabled} 
          @change=${(e: CustomEvent<boolean>) => this._update({ enabled: e.detail })}
        ></jb-toggle>

        <div class="bg-zinc-800/50 rounded-lg p-3 border border-zinc-800">
          <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Impulse Response File</label>
          <div class="text-sm text-zinc-300 overflow-hidden text-ellipsis whitespace-nowrap font-mono">
            ${this.config.file || 'No file selected'}
          </div>
        </div>

        <jb-select 
          label="Optimization Mode" 
          .value=${this.config.optimization_mode.toString()} 
          .options=${[
            { label: 'Original', value: 0 },
            { label: 'Shrink', value: 1 },
            { label: 'Min-phase Transformed', value: 2 }
          ]}
          @change=${(e: CustomEvent<string>) => this._update({ optimization_mode: parseInt(e.detail) })}
        ></jb-select>
      </div>
    `;
  }
}
