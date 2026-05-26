/**
 * Custom Sound Synthesizer using Web Audio API
 */
export class SoundSynth {
  private static ctx: AudioContext | null = null;

  private static init(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch((err) => {
          console.warn("AudioContext resume failed:", err);
        });
      }
      return this.ctx;
    } catch (e) {
      console.warn("Failed to initialize or resume AudioContext:", e);
      return null;
    }
  }

  public static playTick() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn("Synth tick failed to play:", e);
    }
  }

  public static playSuccess() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      
      notes.forEach((freq, idx) => {
        const noteTime = now + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.04, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.3);
      });
    } catch (e) {
      console.warn("Synth success failed to play:", e);
    }
  }

  public static playAlert() {
    try {
      const ctx = this.init();
      if (!ctx) return;
      
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const now = ctx.currentTime;
      
      const playBeep = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.155);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.2);
      };

      playBeep(now, 587.33); // D5
      playBeep(now + 0.18, 587.33);
      playBeep(now + 0.36, 783.99); // G5
    } catch (e) {
      console.warn("Synth alert failed to play:", e);
    }
  }
}
export default SoundSynth;
