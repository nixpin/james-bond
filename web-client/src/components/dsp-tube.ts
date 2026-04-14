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
    this.config = await dspApi.getTube();
  }

  _onInput(e: CustomEvent<number>) {
    this.config = { ...this.config, pre_gain: e.detail };
  }

  async _onChange(e: CustomEvent<number>) {
    this.config = { ...this.config, pre_gain: e.detail };
    await dspApi.setTube(this.config);
  }

  async _onToggle(e: CustomEvent<boolean>) {
    this.config = { ...this.config, enabled: e.detail };
    await dspApi.setTube(this.config);
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
            min="-300" 
            max="1200" 
            step="1" 
            unit=""
            @input=${this._onInput}
            @change=${this._onChange}
          ></jb-slider>
        </div>
      </div>
    `;
  }
}
