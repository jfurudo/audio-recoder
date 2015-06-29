var models = {};
models.AudioNode = Backbone.Model.extend({
   
  defaults: {
    contxt: null,
    arrayBuffer: null,
    audioBuffer: null,
    source: null,
    gain: null
  },
 
  _setSourceNode: function() {
    var self = this;
    var context = self.get("context");

    var source = context.createBufferSource();
    var gainNode = context.createGain ?
          context.createGain() :
          context.createGainNode();
    
    console.log(self.get("audioBuffer"));
    var ab = self.get("audioBuffer").getChannelData(0).buffer;
    var view1 = new Float32Array(ab, 0, 10000);

    console.log(view1);
    
    source.buffer = self.get("audioBuffer");
    // Turn on looping
    source.loop = true;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);
    // gainNode.connect(scriptProcessorNode);

    self.set("source", source);
    self.set("gain", gainNode);
  },

  setGainValue: function (value) {
    var self = this;

    self.get("gain").gain.value = value;
    console.log(self.get("gain"));
  },

  changeContext: function (context) {
    var self = this;
    self.set("context", context);
    self._setSourceNode();
  },
  
  play: function () {
    var self = this;
    
    self._setSourceNode();
    self.get("source").start(0);;
  },

  stop: function () {
    var self = this;
    self.get("source").stop();
  }
});


models.File = models.AudioNode.extend({
  defaults: {
    file: null
  },

  initialize: function(attr) {
    this.reader = new FileReader();
    this._eventify();
  },

  _eventify: function() {
    var self = this;
    self.reader.addEventListener('load', function() {
      self.set('arrayBuffer', self.reader.result);
      self.get('context').decodeAudioData(self.reader.result, function (buffer) {
        self.set('audioBuffer', buffer);
      });
    }, false);
  },

  readFile: function() {
    var self = this;
    if (self.get("file") instanceof File) {
      this.reader.readAsArrayBuffer(this.get('file'));
    } else {
      console.error("file property is not initialized.");
    }
  }
});

models.RecodedAudioNode = models.AudioNode.extend({
  defaults: {
    
  },

  initialize: function (attr) {
    var self = this;
    self.recorder = new _Recorder(attr.context);
  },

  /**
   * @param{Function} cb 録音と同時に行いたい処理
   */
  recStart: function (cb) {
    var self = this;
    self.recorder.recStart(cb);
  },
  
  recStop: function () {
    var self = this;
    self.recorder.recStop();
    self.set("audioBuffer", self.recorder.getAudioBuffer());
  }
});
