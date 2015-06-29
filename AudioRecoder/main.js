$().ready(function () {
  var offlineAudioContext = new OfflineAudioContext(2, 441000, 44100);
  offlineAudioContext.oncomplete = completeCallback;
  
  var context = new AudioContext();
  var recNode = new models.RecodedAudioNode({context: context});
  var bufferSize = 4096;
  var fileNode = null;
  $("#fileUploaded").change(function (e) {
    var files = e.target.files;
    console.log(files[0]);
    fileNode = new models.File({file: files[0], context: context});
    fileNode.readFile();
    window.file = fileNode;
  });
  $("#recStart").click(function () {
    recNode.recStart(function () {
      window.file.play();
    });
  });
  $("#recStop").click(function () {
    window.file.stop();
    recNode.recStop();
  });
  $("#play").click(function () {
    fileNode.play();
    recNode.play();
  });
  $("#stop").click(function () {
    fileNode.stop();
    recNode.stop();
  });
  $("#range").change(function () {
    handler(this);
  });
  var handler = function(element) {
    var x = parseInt(element.value) / parseInt(element.max);
    // Use an equal-power crossfading curve:
    var gain1 = Math.cos(x * 0.5*Math.PI);
    var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
    console.log("gain1", gain1);
    console.log("gain2", gain2);
    fileNode.setGainValue(gain1);
    recNode.setGainValue(gain2);
  };
  $("#showPreview").click(function () {
    fileNode.changeContext(offlineAudioContext);
    recNode.changeContext(offlineAudioContext);
    offlineAudioContext.startRendering();
  });
});
