const Mic = require('./mic.client')
const readline = require('readline');
const chalk = require('chalk');

let count = 0

const micClient = new Mic()
const rl = readline.createInterface({
  input: process.stdin,
  output: null,
  terminal: true
});

console.log(chalk.yellow('按下 a 开始录音，按下 s 结束录音'));

// 监听键盘
rl.input.on('keypress', (str, key) => {
  switch (key.name) {
    case 'a':
      micClient.start(`output${count++}.wav`).then(() => {
        console.log(chalk.green('开始录音...'));
        console.time('录音时长');
      });
      break;
    case 's':
      micClient.stop().then(() => {
        console.log(chalk.red('结束录音...'));
        console.timeEnd('录音时长');
      });
      break;
    default:
      break;
  }
});
