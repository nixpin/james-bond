import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { dspApi, SoundPosition } from '../dsp-api';
import './jb-toggle';
import './jb-slider';
import './jb-select';

@customElement('dsp-sound-position')
export class DSPSoundPosition extends LitElement {
  @state() private config: SoundPosition = {
    crossfeed_enabled: false,
    crossfeed_mode: 0,
    crossfeed_feed: 60,
    crossfeed_fcut: 700,
    stereowide_enabled: false,
    stereowide_level: 60
  };

  protected createRenderRoot() {
    return this;
  }

  async connectedCallback() {
    super.connectedCallback();
    this.config = await dspApi.getSoundPosition();
  }

  _onInput(config: Partial<SoundPosition>) {
    this.config = { ...this.config, ...config };
  }

  async _onChange(config: Partial<SoundPosition>) {
    this.config = { ...this.config, ...config };
    await dspApi.setSoundPosition(this.config);
  }

  render() {
    const crossfeedOptions = [
      { label: 'BS2B Weak', value: 0 },
      { label: 'BS2B Strong', value: 1 },
      { label: 'Out of head', value: 2 },
      { label: 'Surround 1', value: 3 },
      { label: 'Surround 2', value: 4 },
      { label: 'Realistic Surround', value: 5 },
      { label: 'BS2B Custom', value: 99 }
    ];

    return html`
      <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-6">
        <header class="flex items-center gap-2 border-b border-zinc-800 pb-3 -mb-2">
          <div class="w-2 h-6 bg-blue-500 rounded-full"></div>
          <h3 class="font-bold text-zinc-100 tracking-tight">Sound Positioning</h3>
        </header>

        <div class="space-y-6">
          <!-- Crossfeed Section -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Crossfeed</span>
            </div>
            
            <jb-toggle 
              label="Enable Crossfeed" 
              .enabled=${this.config.crossfeed_enabled} 
              @change=${(e: CustomEvent<boolean>) => this._onChange({ crossfeed_enabled: e.detail })}
            ></jb-toggle>

            <jb-select 
              label="Mode" 
              .value=${this.config.crossfeed_mode.toString()} 
              .options=${crossfeedOptions}
              @change=${(e: CustomEvent<string>) => this._onChange({ crossfeed_mode: parseInt(e.detail) })}
            ></jb-select>

            ${this.config.crossfeed_mode === 99 ? html`
              <jb-slider 
                label="Feed Amount" 
                .value=${this.config.crossfeed_feed} 
                min="10" 
                max="150" 
                step="1" 
                unit=""
                @input=${(e: CustomEvent<number>) => this._onInput({ crossfeed_feed: Math.round(e.detail) })}
                @change=${(e: CustomEvent<number>) => this._onChange({ crossfeed_feed: Math.round(e.detail) })}
              ></jb-slider>

              <jb-slider 
                label="Cutoff Frequency" 
                .value=${this.config.crossfeed_fcut} 
                min="300" 
                max="2000" 
                step="10" 
                unit=" Hz"
                @input=${(e: CustomEvent<number>) => this._onInput({ crossfeed_fcut: Math.round(e.detail) })}
                @change=${(e: CustomEvent<number>) => this._onChange({ crossfeed_fcut: Math.round(e.detail) })}
              ></jb-slider>
            ` : ''}
          </div>

          <div class="border-t border-zinc-800/50 pt-4"></div>

          <!-- Stereowide Section -->
          <div class="space-y-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Stereo Wideness</span>
            </div>

            <jb-toggle 
              label="Enable Wideness" 
              .enabled=${this.config.stereowide_enabled} 
              @change=${(e: CustomEvent<boolean>) => this._onChange({ stereowide_enabled: e.detail })}
            ></jb-toggle>

            <jb-slider 
              label="Wideness Level" 
              .value=${this.config.stereowide_level} 
              min="30" 
              max="75" 
              step="1" 
              unit=""
              @input=${(e: CustomEvent<number>) => this._onInput({ stereowide_level: Math.round(e.detail) })}
              @change=${(e: CustomEvent<number>) => this._onChange({ stereowide_level: Math.round(e.detail) })}
            ></jb-slider>
          </div>
        </div>
      </div>
    `;
  }
}
