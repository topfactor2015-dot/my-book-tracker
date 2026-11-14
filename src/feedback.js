// Quiet synthesized feedback avoids audio downloads and works offline.
let context;
let enabled = true;
let volume = 0.2;
let lastSound = -Infinity;
let lastCelebration = -Infinity;
try {
  enabled = localStorage.getItem('librimori_sound') !== 'off';
  const saved = localStorage.getItem('librimori_volume');
  if (saved !== null && Number.isFinite(Number(saved))) volume = Math.max(0, Math.min(0.5, Number(saved)));
} catch { /* Use defaults when storage is unavailable. */ }

export function feedbackPreferences() {
  let motion = true;
  try { motion = localStorage.getItem('librimori_motion') !== 'off'; } catch { /* Use default. */ }
  return { enabled, volume, motion };
}

export function configureFeedback(preferences) {
  enabled = preferences.enabled;
  volume = preferences.volume;
  document.documentElement.dataset.motion = preferences.motion ? 'on' : 'off';
  if (!enabled && context?.state === 'running') void context.suspend().catch(() => {});
  try {
    localStorage.setItem('librimori_sound', enabled ? 'on' : 'off');
    localStorage.setItem('librimori_volume', String(volume));
    localStorage.setItem('librimori_motion', preferences.motion ? 'on' : 'off');
  } catch { /* Preferences still work for this session. */ }
}

export function unlockFeedback() {
  if (!enabled || !volume) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    context ||= new Audio();
    if (context.state === 'suspended') void context.resume().catch(() => {});
  } catch { /* Audio support is optional. */ }
}

export function playFeedback(kind = 'tap') {
  if (!enabled || !volume || document.hidden || context?.state !== 'running') return;
  const now = performance.now();
  if (kind === 'complete') {
    if (now - lastCelebration < 600) return;
    lastCelebration = now;
  } else {
    if (now - lastSound < (kind === 'tick' ? 65 : 45)) return;
    lastSound = now;
  }
  try {
    const notes = kind === 'complete' ? [523.25, 659.25, 783.99] : kind === 'tick' ? [620] : kind === 'page' ? [390, 520] : [480];
    notes.forEach((frequency, index) => {
      const start = context.currentTime + index * (kind === 'complete' ? 0.12 : 0.035);
      const duration = kind === 'complete' ? 0.42 : kind === 'tick' ? 0.035 : 0.085;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, start);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.82, start + duration);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * (kind === 'tick' ? 0.12 : 0.25), start + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      oscillator.start(start);
      oscillator.stop(start + duration + 0.01);
    });
  } catch { /* Feedback must never interrupt an action. */ }
}
