var models = {};
models.File = Backbone.Model.extend({
   
  defaults: {
    contxt: null,
    file: null,
    arrayBuffer: null,
    audioBuffer: null,
    source: null,
    gain: null
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
        self._setSourceNode();
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
  },

  _setSourceNode: function() {
    var self = this;
    var context = self.get("context");

    var source = context.createBufferSource();
    var gainNode = context.createGain ?
          context.createGain() :
          context.createGainNode();
    
    source.buffer = self.get("audioBuffer");
    // Turn on looping
    source.loop = false;
    // Connect source to gain.
    source.connect(gainNode);
    // Connect gain to destination.
    gainNode.connect(context.destination);
    // gainNode.connect(scriptProcessorNode);

    self.set("source", source);
    self.set("gain", gainNode);
  },

  play: function () {
    var self = this;
    self.get("source").start(0);;
  }
});
