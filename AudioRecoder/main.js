$().ready(function () {
  var context = new AudioContext();
  $("#fileUploaded").change(function (e) {
    var files = e.target.files;
    console.log(files[0]);
    var file = new models.File({file: files[0], context: context});
    file.readFile();
    window.file = file;
  });
  navigator.getUserMedia(
    {video: false, audio: true},
    function (stream) {
      var source = context.createMediaStreamSource(stream);
//       source.connect(audioContext.destination);
    },
    function (err) {
      console.log(err.name ? err.name : err);
    }
  );
});
