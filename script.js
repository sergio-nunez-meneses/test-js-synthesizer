var freqs = {
  65: 261.6256,
  87: 277.1826,
  83: 293.6648,
  69: 311.1270,
  68: 329.6276,
  70: 349.2282,
  84: 369.9944,
  71: 391.9954,
  89: 415.3047,
  72: 440,
  85: 466.1638,
  74: 493.8833,
  75: 523.2511
};

function osc(wave, freq, amp, dur) {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
    osc = audioCtx.createOscillator(),
    gainNode = audioCtx.createGain();

  osc.connect(gainNode).connect(audioCtx.destination);

  osc.type = wave;
  osc.frequency.value = freq;
  gainNode.gain.value = amp;
  osc.start();
  osc.stop(dur);

  osc.onended = function() {
    //
  }
}

window.addEventListener('keydown', (e) => {
  var keyCodes = Object.keys(freqs),
    key = e.keyCode;

  if (!keyCodes.includes(key.toString())) {
    return;
  }

  osc('square', freqs[key], 0.4, 1);
});
