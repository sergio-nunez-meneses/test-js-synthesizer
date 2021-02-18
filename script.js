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
  codesToNotes = {
    65: 'c4',
    87: 'c#4',
    83: 'd4',
    69: 'd#4',
    68: 'e4',
    70: 'f4',
    84: 'f#4',
    71: 'g4',
    89: 'g#4',
    72: 'a4',
    85: 'a#4',
    74: 'b4',
    75: 'c5'
  },
  notesToFreqs = {
    'c4': 261.6256,
    'c#4': 277.1826,
    'd4': 293.6648,
    'd#4': 311.1270,
    'e4': 329.6276,
    'f4': 349.2282,
    'f#4': 369.9944,
    'g4': 391.9954,
    'g#4': 415.3047,
    'a4': 440,
    'a#4': 466.1638,
    'b4': 493.8833,
    'c5': 523.2511
  },
  notesTracker = {},
  note;

var keyboardContainer = getBy('class', 'keyboard-container')[0];

var eventStart, eventEnd;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  eventStart = 'touchstart';
  eventEnd = 'touchcancel';
} else {
  eventStart = 'keydown';
  eventEnd = 'keyup';
}

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

  var keyCodes = Object.keys(freqs);

  if (!keyCodes.includes(key.toString())) {
    return false;
  }

  // prevent key combinations such as cmd+alt+k

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

document.addEventListener(eventStart, (e) => {
  var key = validKeys(e, e.keyCode);

  if (key === false) {
    return;
  }

  var dB = scaleInput(-30, [-75, 0], [0, 1]);

  note = new Voice('square', freqs[key], dB);
  notesTracker[key] = note;
  note.attack();

  // console.log('pressed:', notesTracker);
});

document.addEventListener(eventEnd, (e) => {
  var key = validKeys(e, e.keyCode);

  if (key === false) {
    return;
  }

  notesTracker[key].release();
  delete notesTracker[key];

  // console.log('released:', notesTracker);
});

keyboardContainer.addEventListener('mousedown', (e) => {
  var key = e.target;

  if (!key.classList.contains('key-pressed')) {
    key.classList.add('key-pressed');
  }

  var dB = scaleInput(-30, [-75, 0], [0, 1]);
  key = key.dataset.note;

  note = new Voice('square', notesToFreqs[key], dB);
  notesTracker[key] = note;
  note.attack();
});

keyboardContainer.addEventListener('mouseup', (e) => {
  var key = e.target;

  if (key.classList.contains('key-pressed')) {
    key.classList.remove('key-pressed');
  }

  key = key.dataset.note;
  notesTracker[key].release();
  delete notesTracker[key];
});
