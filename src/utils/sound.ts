// مؤثرات صوتية مولّدة عبر Web Audio API — بدون أي ملفات خارجية.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.18,
) {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = audio.currentTime + start;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

/** صوت النجاح عند إيجاد المنتج (نغمتان صاعدتان مبهجتان) */
export function playFound() {
  tone(660, 0, 0.12, "triangle", 0.2);
  tone(880, 0.1, 0.12, "triangle", 0.2);
  tone(1180, 0.2, 0.18, "triangle", 0.22);
}

/** صوت الخطأ عند عدم وجود الصنف (نغمتان هابطتان) */
export function playError() {
  tone(300, 0, 0.16, "sawtooth", 0.14);
  tone(180, 0.14, 0.22, "sawtooth", 0.14);
}

/** نقرة بسيطة عند المسح */
export function playBeep() {
  tone(1000, 0, 0.06, "square", 0.08);
}

/** صوت خصم / ختم */
export function playStamp() {
  tone(520, 0, 0.1, "triangle", 0.18);
  tone(780, 0.08, 0.12, "triangle", 0.18);
}
