const Mic = require('./mic.client')
const readline = require('readline');
const chalk = require('chalk');

const micClient = new Mic()
const rl = readline.createInterface({
  input: process.stdin,
  output: null,
  terminal: true
});

// 监听键盘
rl.input.on('keypress', (str, key) => {
  switch (key.name) {
    case 'a':
      console.log(chalk.green('开始录音...'));
      micClient.start('output.wav');
      break;
    case 's':
      console.log(chalk.red('结束录音...'));
      micClient.stop();
      break;
    default:
      break;
  }
});
