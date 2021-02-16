osc('square', 440, 0.5, 1);

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
    console.log('Done playing.');
  }
}
