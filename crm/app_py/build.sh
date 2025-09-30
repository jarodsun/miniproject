#!/bin/bash
echo "正在打包PyQt应用到exe文件..."

# 清理之前的构建文件
rm -rf dist build *.spec

# 使用PyInstaller打包
pyinstaller --onefile --windowed --name "MiniCRM" main.py

echo "打包完成！exe文件位于 dist 文件夹中"
