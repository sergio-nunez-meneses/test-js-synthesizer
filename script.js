var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
  freqs = {
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
  },
  voices = {},
  voice;

function validKeys(e, key) {
  if (e.repeat) {
    return false;
  }

  var keyCodes = Object.keys(freqs),
    key = e.keyCode;

  if (!keyCodes.includes(key.toString())) {
    return false;
  }

  return key;
}

function osc(wave, freq, amp) {
  var osc = audioCtx.createOscillator(),
    gainNode = audioCtx.createGain();

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.type = wave;
  osc.frequency.value = freq;
  gainNode.gain.value = amp;
  osc.start();

  return [osc, gainNode];
}

document.addEventListener('keydown', (e) => {
  var key = validKeys(e, e.keyCode);

  if (key === false) {
    return;
  }

  if (voices[key]) {
    return;
  }

  voice = osc('square', freqs[key], 0.125);
  voices[key] = e.type == 'keydown';

  console.log('pressed:', voice);
  console.log('pressed:', voices);
});

document.addEventListener('keyup', (e) => {
  var key = validKeys(e, e.keyCode);

  if (key === false) {
    return;
  }

  if (voices[key]) {
    voice[1].disconnect();
    voice[0].stop(voice[0].context.currentTime);
    voices[key] = e.type == 'keydown';
  }

  console.log('released:', voice);
  console.log('released:', voices);
});
