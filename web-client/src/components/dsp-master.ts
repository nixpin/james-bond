import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dspApi, Master } from '../dsp-api';
import './jb-toggle';
import './jb-slider';

@customElement('dsp-master')
export class DSPMaster extends LitElement {
  @state() private config: Master = { enabled: false, limiter_release: 60, limiter_threshold: 0, post_gain: 0 };

  protected createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.config = await dspApi.getMaster();
  }

  _onInput(config: Partial<Master>) {
    this.config = { ...this.config, ...config };
  }

  async _onChange(config: Partial<Master>) {
    this.config = { ...this.config, ...config };
    await dspApi.setMaster(this.config);
  }

  async _onToggle(e: CustomEvent<boolean>) {
    this.config = { ...this.config, enabled: e.detail };
    await dspApi.setMaster(this.config);
  }

  render() {
    return html`
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <header class="flex items-center gap-2 border-b border-zinc-800 pb-3 -mb-2">
          <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
          <h3 class="font-bold text-zinc-100 tracking-tight">Master & Limiter</h3>
        </header>
        
        <jb-toggle 
          label="Enable" 
          .enabled=${this.config.enabled} 
          @change=${this._onToggle}
        ></jb-toggle>

        <jb-slider 
          label="Limiter Threshold" 
          .value=${this.config.limiter_threshold} 
          min="-60" 
          max="0" 
          step="0.5" 
          unit=" dB"
          @input=${(e: CustomEvent<number>) => this._onInput({ limiter_threshold: e.detail })}
          @change=${(e: CustomEvent<number>) => this._onChange({ limiter_threshold: e.detail })}
        ></jb-slider>

        <jb-slider 
          label="Limiter Release" 
          .value=${this.config.limiter_release} 
          min="2" 
          max="500" 
          step="1" 
          unit=" ms"
          @input=${(e: CustomEvent<number>) => this._onInput({ limiter_release: Math.round(e.detail) })}
          @change=${(e: CustomEvent<number>) => this._onChange({ limiter_release: Math.round(e.detail) })}
        ></jb-slider>

        <jb-slider 
          label="Post Gain" 
          .value=${this.config.post_gain} 
          min="-15" 
          max="15" 
          step="0.5" 
          unit=" dB"
          @input=${(e: CustomEvent<number>) => this._onInput({ post_gain: e.detail })}
          @change=${(e: CustomEvent<number>) => this._onChange({ post_gain: e.detail })}
        ></jb-slider>
      </div>
    `;
  }
}
