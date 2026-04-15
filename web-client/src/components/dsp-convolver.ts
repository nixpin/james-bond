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
      <div class="jb-card">
        <header class="card-header">
          <div class="card-indicator"></div>
          <h3 class="card-title">Convolution</h3>
        </header>
        
        <jb-toggle 
          label="Enable" 
          .enabled=${this.config.enabled} 
          @change=${(e: CustomEvent<boolean>) => this._update({ enabled: e.detail })}
        ></jb-toggle>

        <div class="space-y-6" ?inert=${!this.config.enabled}>
          <div class="convolver-file-info">
            <label class="convolver-file-label">Impulse Response File</label>
            <div class="convolver-file-name">
              ${this.config.file || 'No file selected'}
            </div>
          </div>

          <jb-select 
            label="Optimization Mode" 
            .value=${(this.config.optimization_mode ?? 0).toString()} 
            .options=${[
              { label: 'Original', value: 0 },
              { label: 'Shrink', value: 1 },
              { label: 'Min-phase Transformed', value: 2 }
            ]}
            @change=${(e: CustomEvent<string>) => this._update({ optimization_mode: parseInt(e.detail) })}
          ></jb-select>
        </div>
      </div>
    `;
  }
}
