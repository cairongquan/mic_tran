const fs = require('fs');
const mic = require('mic');


module.exports = class Mic {
  constructor() {
    this.config = {
      rate: '16000',
      channels: '1',
      debug: false,
      exitOnSilence: 6,
      fileType: 'wav'
    };
    this.micInputStream = null;
    this.outputFileStream = null;
  }

  start(filePath) {
    this.micInstance = mic(this.config);
    return new Promise(resolve => {
      this.micInputStream = null
      this.outputFileStream = null

      this.micInputStream = this.micInstance.getAudioStream();
      this.outputFileStream = fs.createWriteStream(filePath).on('close', () => {
        // console.log('pipeClose')
      }).on('pipe', () => {
        // console.log('pipePipe')
      }).on('ready', () => {
        // console.log('pipeReady')
        resolve();
      }).on('error', (error) => {
        console.log(error)
      })
      this.micInputStream.pipe(this.outputFileStream);
      this.micInstance.start();
    });
  }

  stop() {
    return new Promise(resolve => {
      this.micInputStream.unpipe(this.outputFileStream)
      this.micInstance.stop();
      this.outputFileStream.end();
      this.micInputStream.removeAllListeners()
      resolve();
    });
  }
};