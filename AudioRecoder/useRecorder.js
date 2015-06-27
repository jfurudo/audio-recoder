$().ready(function () {
  audioContext = new AudioContext();
  recorder = new Recorder(audioContext);
  // recorder.recStart();
  // recorder.recStop();
  // recorder.getAudioBufferArray();
  // recorder.getAudioBuffer();
});
