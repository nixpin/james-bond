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
      <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 class="font-medium mb-4 text-zinc-100">Convolution</h3>
        
        <jb-toggle 
          label="Enable" 
          .enabled=${this.config.enabled} 
          @change=${(e: CustomEvent<boolean>) => this._update({ enabled: e.detail })}
        ></jb-toggle>

        <div class="mb-4">
          <label class="block text-sm font-medium text-zinc-300 mb-1">Impulse Response File</label>
          <div class="text-sm text-zinc-500 bg-zinc-800 rounded p-2 overflow-hidden text-ellipsis">
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
