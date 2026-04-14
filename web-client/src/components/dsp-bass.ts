import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dspApi, BassBoost } from '../dsp-api';
import './jb-toggle';
import './jb-slider';

@customElement('dsp-bass')
export class DSPBass extends LitElement {
  @state() private config: BassBoost = { enabled: false, max_gain: 10 };

  protected createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.config = await dspApi.getBass();
  }

  async _toggle(e: CustomEvent<boolean>) {
    this.config = { ...this.config, enabled: e.detail };
    await dspApi.setBass(this.config);
  }

  async _updateGain(e: CustomEvent<number>) {
    this.config = { ...this.config, max_gain: e.detail };
    await dspApi.setBass(this.config);
  }

  render() {
    return html`
      <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 class="font-medium mb-4 text-zinc-100">Dynamic Bass Boost</h3>
        
        <jb-toggle 
          label="Enable" 
          .enabled=${this.config.enabled} 
          @change=${this._toggle}
        ></jb-toggle>

        <jb-slider 
          label="Maximum Gain" 
          .value=${this.config.max_gain} 
          min="3" 
          max="15" 
          step="0.5" 
          unit=" dB"
          @change=${this._updateGain}
        ></jb-slider>
      </div>
    `;
  }
}
