/*global $, URL, exportWAV*/

// var audioContext = new AudioContext();
var audioContext = new OfflineAudioContext(2, 441000, 44100);
var completeCallback = function (e) {
  console.log(e.renderedBuffer.getChannelData(0).buffer);
  var hoge = [
    e.renderedBuffer.getChannelData(0).buffer,
    e.renderedBuffer.getChannelData(1).buffer
  ];
  var ab = e.renderedBuffer.getChannelData(0).buffer;
  var view1 = new Float32Array(ab, 0, 10000);

  console.log(view1);
  console.log(this);
  var worker = new Worker('Recorderjs/recorderWorker.js');

  var buffer = e.renderedBuffer;

  var ac = new AudioContext();
  var r = createSource(buffer, ac);
  r.source.start(0);
  
  // initialize the new worker
  worker.postMessage({
    command: 'init',
    config: {
      sampleRate: 44100,
      numChannels: 2
    }
  });
  
  worker.onmessage = function (e) {
    var blob = e.data;
    console.log(e);
    var url = URL.createObjectURL(blob);
    $("#preview").attr("src", url);
    $("#download").
      attr({href: url, download: "hogehoge.wav"}).
      text("download");
  };
  
  worker.postMessage({
    command: 'record',
    buffer: [
      buffer.getChannelData(0),
      buffer.getChannelData(1)
    ]
  });
  
  // ask the worker for a WAV
  worker.postMessage({
    command: 'exportWAV',
    type: 'audio/wav'
  });  
};
audioContext.oncomplete = completeCallback;

// var scriptProcessorNode = audioContext.createScriptProcessor(16384, 2, 1);
// scriptProcessorNode.connect(audioContext.destination);
// scriptProcessorNode.onaudioprocess = function () {
//   console.log(arguments);
//   arguments[0].outputBuffer = arguments[0].inputBuffer;
// };
var recorder = new _Recorder(audioContext);

$().ready(function () {
  window.ac = audioContext;

  var sampleAudioBuffer = null;
  var sampleAudioBuffer2 = null;
  getAudioSourceWithXhr("audio/sample.mp3", function (buffer) {
    sampleAudioBuffer = buffer;
  });
  getAudioSourceWithXhr("audio/sample2.mp3", function (buffer) {
    sampleAudioBuffer2 = buffer;
  });
  
  var uiInit = function() {
    // $("#recStart").click(function () {
    //   recorder.recStart();
    // });

    // $("#recStop").click(function () {
    //   recorder.recStop();

    //   var blob = exportWAV(recorder.getAudioBufferArray(),
    //                        audioContext.sampleRate);
    //   var url = URL.createObjectURL(blob);
    //   $("#preview").attr("src", url);
    //   $("#download").
    //     attr({href: url, download: "hogehoge.wav"}).
    //     text("download");
    // });

    var sampleSource = null;
    var recordedSource = null;
    $("#hoge").click(function () {
      console.log(sampleAudioBuffer);
      console.log(sampleAudioBuffer2);
      sampleSource = createSource(sampleAudioBuffer, audioContext);
      // recordedSource = createSource(recorder.getAudioBuffer(), audioContext);
      recordedSource = createSource(sampleAudioBuffer2, audioContext);
      sampleSource.gainNode.gain.value = 0.5;
      console.log();
      audioContext.startRendering();

      if (false && !sampleSource.source.start) {


        
        
        sampleSource.source.noteOn(0);
        recordedSource.source.noteOn(0);
      } else {
        sampleSource.source.start(0);
        recordedSource.source.start(0);
      }
    });
    // $("#stop").click(function () {
    //   if (!sampleSource.source.stop) {
    //     sampleSource.source.noteOff(0);
    //     recordedSource.source.noteOff(0);
    //   } else {
    //     sampleSource.source.stop();
    //     recordedSource.source.stop();
    //   }
    // });
    // $("#range").change(function () {
    //   console.log(this.max);
    //   hoge(this);
    // });
    // var hoge = function(element) {
    //   var x = parseInt(element.value) / parseInt(element.max);
    //   console.log(x);
    //   // Use an equal-power crossfading curve:
    //   var gain1 = Math.cos(x * 0.5*Math.PI);
    //   var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
    //   console.log("gain1", gain1);
    //   console.log("gain2", gain2);
    //   sampleSource.gainNode.gain.value = gain1;
    //   recordedSource.gainNode.gain.value = gain2;
    // };
  };

  uiInit();

});

function createSource(buffer, context) {
  var source = context.createBufferSource();
  var gainNode = context.createGain ? context.createGain() : context.createGainNode();
  console.log(buffer);
  source.buffer = buffer;
  console.log(source);
  // Turn on looping
  source.loop = true;
  // Connect source to gain.
  source.connect(gainNode);
  // Connect gain to destination.
  gainNode.connect(context.destination);
  // gainNode.connect(scriptProcessorNode);

  return {
    source: source,
    gainNode: gainNode
  };
}

var getAudioSourceWithXhr = function (path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    console.log(this.response.byteLength);
    audioContext.decodeAudioData(this.response, callback);// function(buffer) {
    //   resultBuffer = buffer;
    // }, onError);
    var onError = function () {alert("XHR error");};
  };
  xhr.send();
};
