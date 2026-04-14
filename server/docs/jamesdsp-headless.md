# James DSP Headless is a commands

## Available commands:
```
jamesdsp --help

JamesDSP is an advanced audio processing engine available for Linux and Android systems.

Options:
  -v, --version                                      Displays version information.
  -w, --watch                                        Watch audio.conf and apply changes made by external apps automatically (GUI)
  -l, --lang <lang>                                  Override language (example: de, es, uk, zh_CN)
  -d, --spinlock-on-crash                            Wait for debugger in case of crash
  -s, --silent                                       Suppress log output
  -c, --no-color                                     Disable colored log output
  -m, --min-verbosity <level>                        Minimum log verbosity (0 = Debug; ...; 5 = Critical)
  --is-connected                                     Check if JamesDSP service is active. Returns exit code 1 if not. (Remote)
  --status                                           Show status (Remote)
  --list-keys                                        List available audio configuration keys (Remote)
  --get-all                                          Get all audio configuration values (Remote)
  --get <key>                                        Get audio configuration value (Remote)
  --set <key=value>                                  Set audio configuration value (format: key=value) (Remote)
  --list-presets                                     List presets (Remote)
  --load-preset <name>                               Load preset by name (Remote)
  --save-preset <name>                               Save current settings as preset (Remote)
  --delete-preset <name>                             Delete preset by name (Remote)
  --list-devices                                     List audio devices and output routes (Remote)
  --list-preset-rules                                List preset rules (Remote)
  --set-preset-rule <deviceId[:routeId]=presetName>  Add/modify preset rule (Remote)
  --delete-preset-rule <deviceId[:routeId]>          Delete preset rule by device id and route id (Remote)
```

## All parameters (Example):
```
$ jamesdsp --get-all
```

## Bass/Misc

### Dynamic bass boost
bass_enable=true
bass_maxgain=10 [3 - 15] - Maximum gain in dB

### Analog modelling
tube_enable=false
tube_pregain=114 [-300 - 1200] - Pregain dB (x100)

### Limiter/Master
master_enable=false
master_limrelease=60 [2 - 500] - Release time in ms
master_limthreshold=0 [-60 - 0] - Threshold in dB
master_postgain=0 [-15 - 15] - Postgain in dB

### Dynamic range compander
compander_enable=false
compander_timeconstant=0.22000 [0.06 - 0.3] - Timeconstant in seconds
compander_granularity=2 [0 - 4] - Granularity/Number of frequency bands
compander_time_freq_transforms=0 [0 - 4] - Time-Frequency transforms (0 = Uniform(Short-time Fourier), 1 = Multiresolution(Continuous Wavelet, incomplete dual frame), 2 = Pseudo multiresolution(Undersampling frame), 3 = Pseudo multiresolution(Time domain, zero latency))
compander_response=95.0;200.0;400.0;800.0;1600.0;3400.0;7500.0;0;0;-0.020043;0;0;0;0.211681

## Equalizer

### Parametric EQ
tone_enable=true
tone_eq=25.0;40.0;63.0;100.0;160.0;250.0;400.0;630.0;1000.0;1600.0;2500.0;4000.0;6300.0;10000.0;16000.0;6.58676;5.79675;5.46985;5.17019;4.92501;5.9;-5.9;-4.5;-2.5;2.5;1;-0.8;-0.8;-0.8;-0.8
tone_filtertype=0 [0 - 5] - Filter type (0 = FIR Minimum Phase, 1 = IIR 4 order, 2 = IIR 6 order, 3 = IIR 8 order, 4 = IIR 10 order, 5 = IIR 12 order)
tone_interpolation=0 [0 - 1] - Interpolation (0 = Picewise Cubic Hermite Inerpolation Polynomial, 1 = Modefified Hiroshi Akima Spline)

### Extended Graphic EQ
graphiceq_enable=false
graphiceq_param=GraphicEQ: 25 0; 40 0; 63 0; 100 0; 160 0; 250 0; 400 0; 630 0; 1000 0; 1600 0; 2500 0; 4000 0; 6300 0; 10000 0; 16000 0


## Convolution
convolver_enable=false
convolver_file=/home/user/.config/jamesdsp/irs/Church.wav
convolver_optimization_mode=0 [0 - 2] - Optimization mode (0 = Original, 1 = Shrink, 2 = Minimum phase transformed and shrinked)
convolver_waveform_edit=-80;-100;0;0;0;0
```
Advanced waveform editing (default: -80;-100;0;0;0;0)

Set threshold of auto-IR-cropping and add delay to a chopped/minimum phase transformed IR. This setting is only in effect if IR optimization is enabled.

1st value: Start threshold auto-cropping (dB)
2nd value: End threshold auto-cropping (dB)
3rd value: Channel 1 delay (samples)
4th value: Channel 2 delay (samples)
5th value: Channel 3 delay (samples)
6th value: Channel 4 delay (samples)
```

## Sound positioning

### Crossfeed
crossfeed_enable=false
crossfeed_mode=0 [0 - 5, 99] - Crossfeed mode (0 = BS2B Weak, 1 = BS2B Strong, 2 = Out of head, 3 = Surround 1, 4 = Surround 2, 5 = Joe0Bloggs Realistic Surround, 99 - BS2B Custom)
crossfeed_bs2b_feed=60 [10 - 150] - Crossfeed amount in dB (x10)
crossfeed_bs2b_fcut=700 [300 - 2000] - Crossfeed cutoff frequency in Hz

### Soundstage wideness
stereowide_enable=false
stereowide_level=60 [30 - 75] - Soundstage wideness level

## Reverbiration
reverb_enable=false
reverb_bassboost=0.25000
reverb_decay=2.08000
reverb_delay=0.00000
reverb_finaldry=-7.00000
reverb_finalwet=-9.00000
reverb_lfo_spin=0.70000
reverb_lfo_wander=0.30000
reverb_lpf_bass=600
reverb_lpf_damp=9000
reverb_lpf_input=18000
reverb_lpf_output=17000
reverb_osf=1
reverb_reflection_amount=0.30000
reverb_reflection_factor=1.00000
reverb_reflection_width=0.70000
reverb_wet=-8.00000
reverb_width=1.00000

## DDC (Digital Device Correction)
ddc_enable=false
ddc_file=


## Live Programming
liveprog_enable=false
liveprog_file=





