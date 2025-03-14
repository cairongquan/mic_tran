const fs = require('fs')
const mic = require('mic')

module.exports = class Mic {
  constructor() {
    this.config = {
      rate: '16000',
      channels: '1',
      debug: false,
      exitOnSilence: 6,
      fileType: 'wav'
    }
    this.micInstance = mic(this.config)
    this.micInputStream = null;
    this.outputFileStream = null;
  }

  start(filePath) {
    return new Promise(resolve => {
      this.micInputStream = this.micInstance.getAudioStream();
      this.outputFileStream = fs.createWriteStream(filePath);
      this.micInputStream.pipe(this.outputFileStream);
      this.micInstance.start();
      let timer = setTimeout(() => {
        timer = null
        resolve();
      }, 100);
    })
  }

  stop() {
    return new Promise(resolve => {
      this.micInstance.stop();
      this.micInputStream.on('stopComplete', () => {
        this.micInputStream.unpipe(this.outputFileStream);
        this.outputFileStream = null;
        let timer = setTimeout(() => {
          timer = null
          resolve();
        }, 100);
      });
    });
  }
}