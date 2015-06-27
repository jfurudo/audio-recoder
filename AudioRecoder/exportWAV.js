window.exportWAV = function(audioData, sampleRate) {
    var encodeWAV = function(samples, sampleRate) {
        var buffer = new ArrayBuffer(44 + samples.length * 2);
        var view = new DataView(buffer);
        var writeString = function(view, offset, string) {
            for (var i = 0; i < string.length; i++){
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };
        var floatTo16BitPCM = function(output, offset, input) {
            for (var i = 0; i < input.length; i++, offset += 2){
                var s = Math.max(-1, Math.min(1, input[i]));
                output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            }
        };
        writeString(view, 0, 'RIFF');  
        view.setUint32(4, 32 + samples.length * 2, true); 
        writeString(view, 8, 'WAVE'); 
        writeString(view, 12, 'fmt '); 
        view.setUint32(16, 16, true); 
        view.setUint16(20, 1, true); 
        view.setUint16(22, 1, true); 
        view.setUint32(24, sampleRate, true); 
        view.setUint32(28, sampleRate * 2, true); 
        view.setUint16(32, 2, true); 
        view.setUint16(34, 16, true); 
        writeString(view, 36, 'data'); 
        view.setUint32(40, samples.length * 2, true); 
        floatTo16BitPCM(view, 44, samples); 
        return view;
    };
    var mergeBuffers = function(audioData) {
        var sampleLength = 0;
        for (var i = 0; i < audioData.length; i++) {
          sampleLength += audioData[i].length;
        }
        var samples = new Float32Array(sampleLength);
        var sampleIdx = 0;
        for (var i = 0; i < audioData.length; i++) {
          for (var j = 0; j < audioData[i].length; j++) {
            samples[sampleIdx] = audioData[i][j];
            sampleIdx++;
          }
        }
        return samples;
    };
    var dataview = encodeWAV(mergeBuffers(audioData), sampleRate);
    var audioBlob = new Blob([dataview], { type: 'audio/wav' });
    return audioBlob;
};
