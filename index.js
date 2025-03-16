const Mic = require('./mic.client')
const readline = require('readline');
const chalk = require('chalk');

const fs = require('fs')

const needTransName = require('./needTransName.json')

let count = 0
let currentPath = ''

const micClient = new Mic()
const rl = readline.createInterface({
  input: process.stdin,
  output: null,
  terminal: true
});

const currentObj = JSON.parse(fs.readFileSync('./readCount.json', 'utf8'))
if (currentObj.count === undefined) {
  currentObj.count = count
  currentObj.tranText = needTransName[0]
  currentObj.tranFilePath = ""
} else {
  count = currentObj.count + 1
}

console.log(chalk.yellow('按下 a 开始录音，按下 s 结束录音'));


// 监听键盘
rl.input.on('keypress', (str, key) => {
  switch (key.name) {
    case 'a':
      console.log(chalk.blue("请稍等..."))
      console.log(chalk.bgGreen(needTransName[count]))
      setTimeout(() => {
        currentPath = `./10_201031/10_201031_${new Date().getTime()}.wav`
        micClient.start(currentPath).then(() => {
          console.log(chalk.green('开始录音'));
          console.time('录音时长');
        });
      }, 500)
      break;
    case 's':
      micClient.stop().then(() => {
        console.log(chalk.blue("请稍等..."))
        currentObj.tranText = needTransName[count]
        currentObj.count = count
        currentObj.tranFilePath = currentPath
        fs.writeFileSync('./readCount.json', JSON.stringify(currentObj))
        let currentText = fs.readFileSync('./TRANS.txt', 'utf-8')
        currentText += `${currentPath.split('/').at(-1)}\t 10_201031 \t ${currentObj.tranText}\n`
        fs.writeFileSync('./TRANS.txt', currentText)
        count++
        console.log(chalk.red('结束录音'));
        console.timeEnd('录音时长');
      });
      break;
    default:
      break;
  }
});
