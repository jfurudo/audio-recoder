$().ready(function () {
  var context = new AudioContext();
  var node = new models.RecodedAudioNode({context: context});
  $("#recStart").click(function () {
    node.recStart(function () {
      $("#video").trigger("play");
    });
  });
  
  $("#recStop").click(function () {
    node.recStop();
    $("#video").trigger("pause");
  });
  
  $("#download").click(function () {
    var blob = exportWAV(node.get("audioBufferArray"),
                                  context.sampleRate);
    var url = URL.createObjectURL(blob);
    $("#audio").attr("src", url);
  });
});

