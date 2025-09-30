@echo off
echo 正在打包PyQt应用到exe文件（最小体积版本）...

REM 清理之前的构建文件
if exist "dist" rmdir /s /q "dist"
if exist "build" rmdir /s /q "build"

REM 使用spec文件打包（最小体积）
pyinstaller MiniCRM.spec

echo 打包完成！exe文件位于 dist 文件夹中
echo 这是最小体积版本，应该比标准版本小很多
pause
