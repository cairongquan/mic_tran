/*
 * @Author: cairq cairq@tongbaninfo.com
 * @Date: 2025-03-16 19:55:03
 * @LastEditors: cairq cairq@tongbaninfo.com
 * @LastEditTime: 2025-03-16 23:49:11
 * @FilePath: \mic_tran\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const Mic = require('./mic.client')
const readline = require('readline');
const chalk = require('chalk');

const fs = require('fs')

const needTransName = require('./needTransName.json')
const ffmpeg = require('fluent-ffmpeg');

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
            console.log(`当前录音字符串:${count}/${needTransName.length}` + "  \t " + chalk.bgGreen(needTransName[count]))
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
                const stats = fs.statSync(currentPath);
                console.log(`文件大小: ${stats.size / 1024} kb`);
                fs.writeFileSync('./readCount.json', JSON.stringify(currentObj))
                let currentText = fs.readFileSync('./TRANS.txt', 'utf-8')
                currentText += `${currentPath.split('/').at(-1)}\t 10_201031 \t ${currentObj.tranText}\n`
                fs.writeFileSync('./TRANS.txt', currentText)
                count++
                console.timeEnd('录音时长');
                ffmpeg(currentPath)
                    .output(currentPath)
                    .audioChannels(1) // 设置单声道
                    .audioFrequency(16000) // 设置采样率为 16000 Hz
                    .audioCodec('pcm_s16le') // 设置 PCM 16-bit
                    .on('end', () => {
                        console.log(chalk.red('结束录音'));
                    })
                    .on('error', (err) => {
                        console.log(currentPath, err)
                    })
                    .run();

            });
            break;
        default:
            break;
    }
});
