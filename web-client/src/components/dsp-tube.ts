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

  async _update(config: Partial<Tube>) {
    this.config = { ...this.config, ...config };
    await dspApi.setTube(this.config);
  }

  render() {
    return html`
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <header class="flex items-center gap-2 border-b border-zinc-800 pb-3 -mb-2">
          <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
          <h3 class="font-bold text-zinc-100 tracking-tight">Analog Modelling (Tube)</h3>
        </header>
        
        <jb-toggle 
          label="Enable" 
          .enabled=${this.config.enabled} 
          @change=${(e: CustomEvent<boolean>) => this._update({ enabled: e.detail })}
        ></jb-toggle>

        <jb-slider 
          label="Pregain" 
          .value=${this.config.pre_gain} 
          min="-300" 
          max="1200" 
          step="1" 
          unit=""
          @change=${(e: CustomEvent<number>) => this._update({ pre_gain: e.detail })}
        ></jb-slider>
      </div>
    `;
  }
}
