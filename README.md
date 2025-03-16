# 录音脚本

该脚本用于录制音频文件并保存相关信息。

## 文件说明

- `index.js`: 主脚本文件，包含录音逻辑。
- `mic.client.js`: 录音客户端模块。
- `needTransName.json`: 包含需要录音的文本列表。
- `readCount.json`: 记录当前录音进度。
- `TRANS.txt`: 保存录音文件路径和对应文本的记录。

## 使用方法

1. 安装依赖：

    ```sh
    npm install
    ```

2. 运行脚本：

    ```sh
    node index.js
    ```

3. 按键操作：

    - 按下 `a` 键开始录音。
    - 按下 `s` 键结束录音。

## 录音流程

1. 按下 `a` 键后，脚本会开始录音，并将录音文件保存到 `10_201031` 目录下，文件名为当前时间戳。
2. 按下 `s` 键后，脚本会结束录音，并将录音文件信息保存到 `readCount.json` 和 `TRANS.txt` 文件中。
3. 录音文件会经过 `ffmpeg` 处理，设置为单声道、采样率为 16000 Hz、PCM 16-bit 编码。

## 依赖

- `fluent-ffmpeg`: 用于处理音频文件。
- `chalk`: 用于在控制台输出彩色文本。
- `readline`: 用于读取用户输入。
- `fs`: 用于文件操作。

## 注意事项

- 请确保 `ffmpeg` 已安装并配置在系统路径中。
- 请根据需要修改 `needTransName.json` 文件中的文本列表。

## 作者

- cairq (cairongquan@live.com)