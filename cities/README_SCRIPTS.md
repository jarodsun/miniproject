# 脚本使用说明

代码已拆分为3个独立的脚本，每个脚本负责不同的功能。

## 文件结构

```
cities/
├── generate_all.py           # 主入口脚本（推荐使用）
├── common.py                 # 公共函数模块（共享工具函数）
├── generate_mainland.py      # 处理普通省份和直辖市
├── generate_hk_mo_tw.py      # 处理港澳台
├── generate_root_index.py    # 生成根目录首页
├── pcas.json                # 大陆省份数据
└── HK-MO-TW.json            # 港澳台数据
```

## 快速开始

**推荐方式**：使用主入口脚本，一键生成所有HTML文件：

```bash
python3 generate_all.py
```

这个脚本会按顺序自动执行：
1. 生成根目录首页
2. 生成普通省份和直辖市
3. 生成港澳台

## 脚本说明

### 1. `common.py` - 公共模块
包含所有脚本共享的工具函数：
- `to_pinyin()`: 中文转拼音
- `write_html_file()`: 写入HTML文件
- 配置常量和路径定义

### 2. `generate_mainland.py` - 处理普通省份和直辖市
**功能**：
- 读取 `pcas.json` 数据
- 处理普通省份（省->市->区->街道）
- 处理四个直辖市（市->区->街道）

**使用方法**：
```bash
python3 generate_mainland.py
```

### 3. `generate_hk_mo_tw.py` - 处理港澳台
**功能**：
- 读取 `HK-MO-TW.json` 数据
- 处理香港/澳门特别行政区（特别行政区->区域->区）
- 处理台湾省（省->市/县->区）

**使用方法**：
```bash
python3 generate_hk_mo_tw.py
```

### 4. `generate_root_index.py` - 生成根目录首页
**功能**：
- 读取 `pcas.json` 和 `HK-MO-TW.json` 数据
- 生成根目录的总入口 `index.html`
- 列出所有省份/直辖市/特别行政区

**使用方法**：
```bash
python3 generate_root_index.py
```

## 详细使用说明

### 方式一：使用主入口脚本（推荐）

运行一个脚本即可完成所有工作：

```bash
python3 generate_all.py
```

### 方式二：单独运行各个脚本

如果需要单独运行某个脚本（例如只更新某个地区的数据），可以按以下顺序运行：

```bash
# 1. 生成根目录首页（可选，但建议先运行）
python3 generate_root_index.py

# 2. 生成普通省份和直辖市的HTML
python3 generate_mainland.py

# 3. 生成港澳台的HTML
python3 generate_hk_mo_tw.py
```

## 注意事项

1. 所有脚本都会在 `output/` 目录下生成HTML文件
2. 脚本可以独立运行，也可以按顺序运行
3. 如果只更新某个地区的数据，可以只运行对应的脚本
4. 根目录的 `index.html` 需要读取所有数据，所以建议在生成其他HTML之前或之后运行

