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
      <div class="jb-card">
        <header class="card-header">
          <div class="card-indicator"></div>
          <h3 class="card-title">Sound Positioning</h3>
        </header>

        <div class="sound-pos-container">
          <!-- Crossfeed Section -->
          <div class="sound-pos-group">
            <div class="sound-pos-header">
              <span class="sound-pos-label">Crossfeed</span>
            </div>
            
            <jb-toggle 
              label="Enable Crossfeed" 
              .enabled=${this.config.crossfeed_enabled} 
              @change=${(e: CustomEvent<boolean>) => this._onChange({ crossfeed_enabled: e.detail })}
            ></jb-toggle>

            <jb-select 
              label="Mode" 
              .value=${this.config.crossfeed_mode.toString()} 
              .disabled=${!this.config.crossfeed_enabled}
              .options=${crossfeedOptions}
              @change=${(e: CustomEvent<string>) => this._onChange({ crossfeed_mode: parseInt(e.detail) })}
            ></jb-select>

            ${this.config.crossfeed_mode === 99 ? html`
              <jb-slider 
                label="Feed Amount" 
                .value=${this.config.crossfeed_feed} 
                .disabled=${!this.config.crossfeed_enabled}
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
                .disabled=${!this.config.crossfeed_enabled}
                min="300" 
                max="2000" 
                step="10" 
                unit=" Hz"
                @input=${(e: CustomEvent<number>) => this._onInput({ crossfeed_fcut: Math.round(e.detail) })}
                @change=${(e: CustomEvent<number>) => this._onChange({ crossfeed_fcut: Math.round(e.detail) })}
              ></jb-slider>
            ` : ''}
          </div>

          <div class="sound-pos-divider"></div>

          <!-- Stereowide Section -->
          <div class="sound-pos-group">
            <div class="sound-pos-header">
              <span class="sound-pos-label">Stereo Wideness</span>
            </div>

            <jb-toggle 
              label="Enable Wideness" 
              .enabled=${this.config.stereowide_enabled} 
              @change=${(e: CustomEvent<boolean>) => this._onChange({ stereowide_enabled: e.detail })}
            ></jb-toggle>

            <jb-slider 
              label="Wideness Level" 
              .value=${this.config.stereowide_level} 
              .disabled=${!this.config.stereowide_enabled}
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
