const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// 配置输入和输出文件夹
const inputFolder = './10_201031'; // 替换为你的输入文件夹路径
const outputFolder = './output_wavs'; // 替换为你的输出文件夹路径

// 确保输出文件夹存在
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// 音频处理配置
const processWavFile = (inputFilePath, outputFilePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .output(outputFilePath)
      .audioChannels(1) // 设置单声道
      .audioFrequency(16000) // 设置采样率为 16000 Hz
      .audioCodec('pcm_s16le') // 设置 PCM 16-bit
      .on('end', () => {
        console.log(`Processed: ${inputFilePath} -> ${outputFilePath}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error processing ${inputFilePath}:`, err.message);
        reject(err);
      })
      .run();
  });
};

// 批量处理文件夹中的所有 WAV 文件
const processFolder = async () => {
  try {
    const files = fs.readdirSync(inputFolder);
    const wavFiles = files.filter((file) => path.extname(file).toLowerCase() === '.wav');

    if (wavFiles.length === 0) {
      console.log('No WAV files found in the input folder.');
      return;
    }

    console.log(`Found ${wavFiles.length} WAV files. Processing...`);
    for (const file of wavFiles) {
      const inputFilePath = path.join(inputFolder, file);
      const outputFilePath = path.join(outputFolder, file);

      // 确保文件名唯一，避免覆盖
      const uniqueOutputFilePath = outputFilePath.replace(/\.wav$/, `.wav`);

      await processWavFile(inputFilePath, uniqueOutputFilePath);
    }

    console.log('All files processed successfully!');
  } catch (error) {
    console.error('Error processing folder:', error.message);
  }
};

// 执行批量处理
processFolder();
