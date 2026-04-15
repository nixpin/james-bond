import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dspApi, Tube } from '../dsp-api';
import './jb-toggle';
import './jb-slider';

@customElement('dsp-tube')
export class DSPTube extends LitElement {
  @state() private config: Tube = { enabled: false, pre_gain: 0 };

  protected createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    const data = await dspApi.getTube();
    // Convert raw (e.g. 200) to dB (e.g. 2.0)
    this.config = { ...data, pre_gain: data.pre_gain / 100 };
  }

  _onInput(e: CustomEvent<number>) {
    this.config = { ...this.config, pre_gain: e.detail };
  }

  async _onChange(e: CustomEvent<number>) {
    this.config = { ...this.config, pre_gain: e.detail };
    await this._sync();
  }

  async _onToggle(e: CustomEvent<boolean>) {
    this.config = { ...this.config, enabled: e.detail };
    await this._sync();
  }

  private async _sync() {
    // Convert dB back to raw integer (2.0 -> 200)
    const payload = { 
      ...this.config, 
      pre_gain: Math.round(this.config.pre_gain * 100) 
    };
    await dspApi.setTube(payload);
  }

  render() {
    return html`
      <div class="jb-card">
        <header class="card-header">
          <div class="card-indicator"></div>
          <h3 class="card-title">Analog Modelling (Tube)</h3>
        </header>
        
        <jb-toggle 
          label="Enable" 
          .enabled=${this.config.enabled} 
          @change=${this._onToggle}
        ></jb-toggle>

        <div ?inert=${!this.config.enabled}>
          <jb-slider 
            label="Pregain" 
            .value=${this.config.pre_gain} 
            min="-3" 
            max="12" 
            step="0.1" 
            unit=" dB"
            @input=${this._onInput}
            @change=${this._onChange}
          ></jb-slider>
        </div>
      </div>
    `;
  }
}
