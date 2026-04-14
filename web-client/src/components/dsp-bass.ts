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

  _onInput(e: CustomEvent<number>) {
    this.config = { ...this.config, max_gain: e.detail };
  }

  async _onChange(e: CustomEvent<number>) {
    this.config = { ...this.config, max_gain: e.detail };
    await dspApi.setBass(this.config);
  }

  async _toggle(e: CustomEvent<boolean>) {
    this.config = { ...this.config, enabled: e.detail };
    await dspApi.setBass(this.config);
  }

  render() {
    return html`
      <div class="jb-card">
        <header class="card-header">
          <div class="card-indicator"></div>
          <h3 class="card-title">Dynamic Bass Boost</h3>
        </header>
        
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
          @input=${this._onInput}
          @change=${this._onChange}
        ></jb-slider>
      </div>
    `;
  }
}
