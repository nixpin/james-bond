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

  async _updateGain(index: number, val: number) {
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
      <div class="bg-zinc-900 border border-zinc-800 rounded-lg p-4 col-span-1 md:col-span-2">
        <h3 class="font-medium mb-4 text-zinc-100">Parametric Equalizer</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <jb-toggle 
            label="Enable" 
            .enabled=${this.config.enabled} 
            @change=${(e: CustomEvent<boolean>) => this._update({ enabled: e.detail })}
          ></jb-toggle>

          <jb-select 
            label="Filter Type" 
            .value=${this.config.filter_type.toString()} 
            .options=${filterOptions}
            @change=${(e: CustomEvent<string>) => this._update({ filter_type: parseInt(e.detail) })}
          ></jb-select>

          <jb-select 
            label="Interpolation" 
            .value=${this.config.interpolation.toString()} 
            .options=${interpOptions}
            @change=${(e: CustomEvent<string>) => this._update({ interpolation: parseInt(e.detail) })}
          ></jb-select>
        </div>

        <div class="flex items-end justify-between gap-1 overflow-x-auto pb-4 h-64">
          ${this.config.bands.map((band, i) => html`
            <div class="flex flex-col items-center flex-1 min-w-[30px] h-full">
              <input 
                type="range" 
                min="-12" 
                max="12" 
                step="0.5" 
                .value=${this.config.gains[i].toString()}
                @input=${(e: Event) => this._updateGain(i, parseFloat((e.target as HTMLInputElement).value))}
                class="w-full h-full vertical-slider bg-zinc-800 rounded appearance-none cursor-pointer accent-blue-500"
                style="writing-mode: bt-lr; appearance: slider-vertical;"
              />
              <span class="text-[10px] text-zinc-500 mt-2 rotate-45 md:rotate-0 whitespace-nowrap">
                ${band < 1000 ? band : (band / 1000) + 'k'}
              </span>
              <span class="text-[10px] font-mono text-blue-400">
                ${this.config.gains[i]}
              </span>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}
