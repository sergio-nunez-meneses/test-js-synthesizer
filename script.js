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
  notesOn = {},
  note,
  keys = getBy('class', 'key');

function getBy(attribute, value) {
  if (attribute === 'tag') {
    return document.getElementsByTagName(value);
  } else if (attribute === 'id') {
    return document.getElementById(value);
  } else if (attribute === 'name') {
    return document.getElementsByName(value)[0];
  } else if (attribute === 'class') {
    return document.getElementsByClassName(value);
  }
}

function scaleInput(input, r1, r2) {
  return (input - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
}

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

class Voice {
  constructor(wave, freq, amp) {
    this.wave = wave;
    this.freq = freq;
    this.amp = amp;
    this.voices = [];
  }

  attack = function() {
    var osc = audioCtx.createOscillator();
    osc.type = this.wave;
    osc.frequency.value = this.freq;

    var gainNode = audioCtx.createGain();
    gainNode.gain.value = this.amp;

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(0);
    this.voices.push(osc);
  }

  release = function() {
    this.voices.forEach((osc) => {
      osc.stop();
    });
  }
};

document.addEventListener('keydown', (e) => {
  var key = validKeys(e, e.keyCode);

  if (key === false) {
    return;
  }

  var dB = scaleInput(-30, [-75, 0], [0, 1]);

  note = new Voice('square', freqs[key], dB);
  notesOn[key] = note;
  note.attack();

  console.log('pressed:', notesOn);
});

document.addEventListener('keyup', (e) => {
  var key = validKeys(e, e.keyCode);

  if (key === false) {
    return;
  }

  notesOn[key].release();
  delete notesOn[key];

  console.log('released:', notesOn);
});
