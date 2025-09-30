@echo off
echo 正在打包PyQt应用到exe文件...

REM 清理之前的构建文件
if exist "dist" rmdir /s /q "dist"
if exist "build" rmdir /s /q "build"

REM 使用PyInstaller打包
pyinstaller --onefile --windowed --name "MiniCRM" main.py

echo 打包完成！exe文件位于 dist 文件夹中
pause
