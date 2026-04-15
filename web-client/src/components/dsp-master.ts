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
    
    // Sync logic for bypass changes from other components
    window.addEventListener('jb-master-change', (e: any) => {
      this.config = e.detail;
    });
  }

  async _onInput(config: Partial<Master>) {
    this.config = { ...this.config, ...config };
  }

  async _onChange(config: Partial<Master>) {
    this.config = { ...this.config, ...config };
    await dspApi.setMaster(this.config);
    window.dispatchEvent(new CustomEvent('jb-master-change', { detail: this.config }));
  }

  render() {
    return html`
      <div class="jb-card">
        <header class="card-header">
          <div class="card-indicator"></div>
          <h3 class="card-title">Master & Limiter</h3>
        </header>

        <div class="space-y-6" ?inert=${!this.config.enabled}>
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
      </div>
    `;
  }
}
