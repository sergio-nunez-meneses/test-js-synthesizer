var btn = document.getElementsByName('play')[0],
  text = document.createElement('p');
  document.body.appendChild(text);

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
    text.innerHTML = 'Done playing.';
  }
}

btn.addEventListener('click', () => {
  text.innerHTML = 'Playing...';
  osc('square', 440, 0.5, 1);
});
