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
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm col-span-1 md:col-span-2">
        <header class="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
          <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
          <h3 class="font-bold text-zinc-100 tracking-tight text-lg">Parametric Equalizer</h3>
        </header>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-zinc-800/20 p-4 rounded-xl border border-zinc-800/50">
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

        <div class="flex items-end justify-between gap-2 overflow-x-auto pb-6 h-72 custom-scrollbar">
          ${this.config.bands.map((band, i) => html`
            <div class="flex flex-col items-center flex-1 min-w-[36px] h-full group">
              <div class="relative flex-1 w-full flex flex-col items-center">
                <input 
                  type="range" 
                  min="-12" 
                  max="12" 
                  step="0.5" 
                  .value=${this.config.gains[i].toString()}
                  @input=${(e: Event) => this._updateGain(i, parseFloat((e.target as HTMLInputElement).value))}
                  class="vertical-slider w-2 h-full bg-zinc-800 rounded-full appearance-none cursor-pointer accent-blue-500 hover:bg-zinc-700 transition-colors"
                />
              </div>
              <div class="mt-4 flex flex-col items-center gap-1">
                <span class="text-[10px] font-bold text-zinc-500 uppercase">
                  ${band < 1000 ? band : (band / 1000) + 'k'}
                </span>
                <span class="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1 rounded">
                  ${this.config.gains[i] > 0 ? '+' : ''}${this.config.gains[i]}
                </span>
              </div>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}
