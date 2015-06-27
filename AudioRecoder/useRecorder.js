/*global $, URL, exportWAV*/

$().ready(function () {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'audio/sample.mp3', true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    console.log(this.response.byteLength);
  };
  xhr.send();

  var audioContext = new AudioContext();
  var recorder = new Recorder(audioContext);
  window.recorder = recorder; // For debug
  var src = audioContext.createBufferSource();
  // recorder.recStart();
  // recorder.recStop();
  // recorder.getAudioBufferArray();
  // recorder.getAudioBuffer();
  $("#start").click(function () {
    recorder.recStart();
  });

  $("#stop").click(function () {
    recorder.recStop();

    var blob = exportWAV(recorder.getAudioBufferArray(), audioContext.sampleRate);
    var url = URL.createObjectURL(blob);
    $("#preview").attr("src", url);
    $("#download").
      attr({href: url, download: "hogehoge.wav"}).
      text("download");
  });

  $("#play").click(function () {
    src.buffer = recorder.getAudioBuffer();
    src.connect(audioContext.destination);
    src.start();
  });

});
