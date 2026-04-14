import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dspApi, Equalizer } from '../dsp-api';
import './jb-toggle';
import './jb-select';

@customElement('dsp-equalizer')
export class DSPEqualizer extends LitElement {
  @state() private config: Equalizer = { enabled: false, bands: [], gains: [], filter_type: 0, interpolation: 0 };

  protected createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.config = await dspApi.getEqualizer();
  }

  async _update(config: Partial<Equalizer>) {
    this.config = { ...this.config, ...config };
    await dspApi.setEqualizer(this.config);
  }

  _onInputGain(index: number, val: number) {
    const newGains = [...this.config.gains];
    newGains[index] = val;
    this.config = { ...this.config, gains: newGains };
  }

  async _onChangeGain(index: number, val: number) {
    const newGains = [...this.config.gains];
    newGains[index] = val;
    this.config = { ...this.config, gains: newGains };
    await dspApi.setEqualizer(this.config);
  }

  render() {
    const filterOptions = [
      { label: 'FIR Minimum Phase', value: 0 },
      { label: 'IIR 4 order', value: 1 },
      { label: 'IIR 6 order', value: 2 },
      { label: 'IIR 8 order', value: 3 },
      { label: 'IIR 10 order', value: 4 },
      { label: 'IIR 12 order', value: 5 }
    ];

    const interpOptions = [
      { label: 'Cubic Hermite', value: 0 },
      { label: 'Modified Akima', value: 1 }
    ];

    return html`
      <div class="jb-card col-span-1 md:col-span-2">
        <header class="card-header">
          <div class="card-indicator"></div>
          <h3 class="card-title text-lg">Parametric Equalizer</h3>
        </header>
        
        <jb-toggle 
          label="Enable" 
          .enabled=${this.config.enabled} 
          @change=${(e: CustomEvent<boolean>) => this._update({ enabled: e.detail })}
        ></jb-toggle>

        <div class="space-y-8" ?inert=${!this.config.enabled}>
          <div class="eq-settings-panel">
            <div class="eq-setting-item-large">
              <jb-select 
                label="Filter Type" 
                .value=${this.config.filter_type.toString()} 
                .options=${filterOptions}
                @change=${(e: CustomEvent<string>) => this._update({ filter_type: parseInt(e.detail) })}
              ></jb-select>
            </div>

            <div class="eq-setting-item-large">
              <jb-select 
                label="Interpolation" 
                .value=${this.config.interpolation.toString()} 
                .options=${interpOptions}
                @change=${(e: CustomEvent<string>) => this._update({ interpolation: parseInt(e.detail) })}
              ></jb-select>
            </div>
          </div>

          <div class="eq-visualizer-container">
            <div class="eq-visualizer-content">
              ${this.config.bands.map((band, i) => html`
                <div class="eq-band">
                  <div class="eq-band-slider-container">
                    <input 
                      type="range" 
                      min="-12" 
                      max="12" 
                      step="0.5" 
                      .value=${this.config.gains[i].toString()}
                      @input=${(e: Event) => this._onInputGain(i, parseFloat((e.target as HTMLInputElement).value))}
                      @change=${(e: Event) => this._onChangeGain(i, parseFloat((e.target as HTMLInputElement).value))}
                      class="vertical-slider"
                    />
                  </div>

                  <div class="eq-band-label-container">
                    <span class="eq-band-freq">
                      ${band < 1000 ? band : (band / 1000) + 'k'}
                    </span>
                    <span class="eq-band-value">
                      ${this.config.gains[i] > 0 ? '+' : ''}${this.config.gains[i]}
                    </span>
                  </div>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
