# Mini CRM - PyQt 桌面应用

这是一个使用PyQt5开发的简单桌面应用。

## 功能特性

- 简洁的首页界面
- 点击按钮显示"Hello World"消息

## 安装依赖

```bash
pip install -r requirements.txt
```

## 运行应用

```bash
python main.py
```

## 打包成exe文件

### 🚀 快速打包（标准版本）

**Windows用户：**
```bash
build.bat
```

**Linux/Mac用户：**
```bash
chmod +x build.sh
./build.sh
```

### 📦 体积优化打包

#### 方法一：优化版本（推荐）
```bash
build_optimized.bat
```
- 排除大量不需要的模块
- 使用UPX压缩
- 体积减少约50-70%

#### 方法二：最小体积版本
```bash
build_minimal.bat
```
- 使用预配置的spec文件
- 最大程度减少体积
- 可能减少80%以上

### 🔧 手动打包

```bash
# 基本打包命令
pyinstaller --onefile --windowed --name "MiniCRM" main.py

# 优化体积打包
pyinstaller --onefile --windowed --name "MiniCRM" --exclude-module tkinter --exclude-module matplotlib --strip main.py

# 使用spec文件打包（最小体积）
pyinstaller MiniCRM.spec
```

### 📊 体积对比

| 打包方式 | 预计大小 | 说明 |
|---------|---------|------|
| 标准打包 | 50-80MB | 包含完整Python环境 |
| 优化打包 | 15-30MB | 排除不需要的模块 |
| 最小打包 | 8-15MB | 最大程度精简 |

### 打包参数说明

- `--onefile`: 打包成单个exe文件
- `--windowed`: 不显示控制台窗口（适合GUI应用）
- `--name`: 指定生成的exe文件名
- `--exclude-module`: 排除不需要的模块
- `--strip`: 去除调试信息减小体积
- `--icon`: 指定应用图标

### 打包后的文件

打包完成后，exe文件将位于 `dist` 文件夹中。

## 项目结构

```
app_py/
├── main.py                    # 主应用文件
├── requirements.txt           # 依赖包列表
├── build.bat                 # Windows标准打包脚本
├── build_optimized.bat       # Windows优化体积打包脚本
├── build_minimal.bat         # Windows最小体积打包脚本
├── build.sh                  # Linux/Mac打包脚本
├── MiniCRM.spec              # PyInstaller配置文件（优化版）
└── README.md                 # 项目说明
```

## 技术栈

- Python 3.x
- PyQt5
- PyInstaller（用于打包）
