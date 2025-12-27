# 开发文档 v1

## 项目概述

本项目是一个批量生成中国行政区划静态 HTML 页面的系统。系统通过读取 JSON 数据文件，按照拼音建立文件夹结构，并生成对应的 HTML 文件。

### 核心功能

- 读取 `pcas.json` 和 `HK-MO-TW.json` 数据文件
- 将中文地名转换为拼音作为文件夹名
- 生成省、市、区、街道四个层级的 HTML 页面
- 处理直辖市、普通省份、港澳台等不同数据结构的特殊逻辑
- 生成根目录总入口页面

## 项目结构

```
cities/
├── common.py                    # 公共函数模块（共享工具函数）
├── generate_all.py              # 主入口脚本（推荐使用）
├── generate_municipalities.py  # 处理直辖市（北京市、天津市、上海市、重庆市）
├── generate_provinces.py        # 处理普通省份
├── generate_hk_mo_tw.py         # 处理港澳台
├── generate_root_index.py       # 生成根目录首页
├── generate_mainland.py         # 旧版本（已拆分，保留作为参考）
├── generate_html_v1.py          # 旧版本脚本（已废弃）
├── data/                        # 数据文件目录
│   ├── pcas.json               # 大陆省份数据
│   └── HK-MO-TW.json           # 港澳台数据
├── templates/                   # 模板文件目录（当前未使用）
├── output/                      # 输出目录（生成的 HTML 文件）
└── docs/                        # 文档目录
    ├── DEVELOPMENT.md           # 开发文档
    ├── notes.md                 # 优化分析报告
    ├── requirements_v1.md       # 需求文档 v1.0
    ├── requirements_v2.md       # 需求文档 v2.0
    └── README_SCRIPTS.md        # 脚本使用说明
```

## 技术栈

### 依赖库

- **Python 3.x**: 开发语言
- **pypinyin**: 中文转拼音库
  ```bash
  pip install pypinyin
  ```
- **标准库**:
  - `json`: JSON 数据解析
  - `pathlib`: 文件路径操作
  - `subprocess`: 子进程管理（用于 `generate_all.py`）
  - `typing`: 类型提示
  - `re`: 正则表达式

### 编码规范

- 文件编码：UTF-8
- 代码风格：遵循 PEP 8
- 类型提示：使用 `typing` 模块提供类型提示

## 核心模块说明

### 1. `common.py` - 公共函数模块

**功能**：包含所有脚本共享的工具函数和配置常量

**主要函数**：

- `to_pinyin(text: str) -> str`
  - 功能：将中文转换为拼音（全小写，无空格）
  - 实现：使用 `pypinyin.lazy_pinyin()` 获取拼音列表，然后连接并移除特殊字符
  - 返回：纯小写字母和数字的字符串

- `write_html_file(file_path: Path, html_content: str)`
  - 功能：写入 HTML 文件
  - 实现：自动创建父目录，使用 UTF-8 编码写入

**配置常量**：

```python
BASE_DIR = Path(__file__).parent          # 项目根目录
OUTPUT_DIR = BASE_DIR / "output"          # 输出目录
MUNICIPALITIES = ["北京市", "天津市", "上海市", "重庆市"]  # 四个直辖市
HONG_KONG = "香港特别行政区"
MACAO = "澳门特别行政区"
TAIWAN = "台湾省"
```

### 2. `generate_all.py` - 主入口脚本

**功能**：统一调用所有生成脚本，按顺序执行

**执行流程**：

1. 生成根目录首页（`generate_root_index.py`）
2. 生成直辖市（`generate_municipalities.py`）
3. 生成普通省份（`generate_provinces.py`）
4. 生成港澳台（`generate_hk_mo_tw.py`）

**特点**：

- 使用 `subprocess` 运行各个脚本
- 提供执行状态反馈
- 统计成功/失败数量
- 即使某个脚本失败，也会继续执行后续脚本

**使用方法**：

```bash
python3 generate_all.py
```

### 3. `generate_municipalities.py` - 处理直辖市

**功能**：

- 读取 `pcas.json` 数据文件
- 处理四个直辖市（北京市、天津市、上海市、重庆市）
- 层级结构：市 -> 区 -> 街道（跳过"市辖区"层）

**核心函数**：

- `generate_municipality_html()`: 生成直辖市级别 HTML
- `generate_district_html()`: 生成区级别 HTML（直辖市专用）
- `generate_street_html()`: 生成街道级别 HTML（直辖市专用）
- `process_municipality()`: 处理直辖市逻辑

**特殊处理**：

- 需要跳过"市辖区"这一占位层
- 路径只有三层（市 -> 区 -> 街道）
- 导航链接不包含省份层级（因为直辖市本身就是省级）

### 4. `generate_provinces.py` - 处理普通省份

**功能**：

- 读取 `pcas.json` 数据文件
- 处理所有普通省份（排除四个直辖市）
- 层级结构：省 -> 市 -> 区 -> 街道

**核心函数**：

- `generate_province_html()`: 生成省级别 HTML
- `generate_city_html()`: 生成市级别 HTML
- `generate_district_html()`: 生成区级别 HTML（普通省份专用）
- `generate_street_html()`: 生成街道级别 HTML（普通省份专用）
- `process_province()`: 处理普通省份逻辑

**特殊处理**：

- 路径有四层（省 -> 市 -> 区 -> 街道）
- 导航链接包含完整的层级关系（区、市、省）

### 5. `generate_hk_mo_tw.py` - 处理港澳台

**功能**：

- 读取 `HK-MO-TW.json` 数据文件
- 处理香港/澳门特别行政区（特别行政区 -> 区域 -> 区）
- 处理台湾省（省 -> 市/县 -> 区）

**核心函数**：

- `generate_municipality_html()`: 生成特别行政区级别 HTML
- `generate_region_html()`: 生成区域级别 HTML（香港/澳门）
- `generate_district_only_html()`: 生成区级别 HTML（没有街道层级）
- `generate_province_html()`: 生成省级别 HTML（台湾）
- `generate_taiwan_city_html()`: 生成台湾城市级别 HTML
- `process_hong_kong_macao()`: 处理香港/澳门逻辑
- `process_taiwan()`: 处理台湾逻辑

**特殊处理**：

- 香港/澳门：三层结构（特别行政区 -> 区域 -> 区），没有街道层级
- 台湾：三层结构（省 -> 市/县 -> 区），没有街道层级

### 6. `generate_root_index.py` - 生成根目录首页

**功能**：

- 读取 `pcas.json` 和 `HK-MO-TW.json` 数据
- 生成根目录的总入口 `index.html`
- 按地区分类显示所有省份/直辖市/特别行政区

**地区分类**：

```python
REGIONS = {
    "直辖市": ["北京市", "天津市", "上海市", "重庆市"],
    "港澳台": ["香港特别行政区", "澳门特别行政区", "台湾省"],
    "华北地区": ["河北省", "山西省", "内蒙古自治区"],
    "东北地区": ["辽宁省", "吉林省", "黑龙江省"],
    "华东地区": ["江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省"],
    "华中地区": ["河南省", "湖北省", "湖南省"],
    "华南地区": ["广东省", "广西壮族自治区", "海南省"],
    "西南地区": ["四川省", "贵州省", "云南省", "西藏自治区"],
    "西北地区": ["陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区"],
}
```

**核心函数**：

- `classify_provinces()`: 将省份按地区分类
- `generate_root_html()`: 生成根目录 HTML

## 数据流程

### 1. 数据读取

```python
# 读取 JSON 数据
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)
```

### 2. 数据处理流程

#### 普通省份处理流程

```
读取省份数据
  ↓
生成省级别 HTML (output/{省拼音}/index.html)
  ↓
遍历城市
  ↓
生成市级别 HTML (output/{省拼音}/{市拼音}/index.html)
  ↓
遍历区县
  ↓
生成区级别 HTML (output/{省拼音}/{市拼音}/{区拼音}/index.html)
  ↓
遍历街道
  ↓
生成街道级别 HTML (output/{省拼音}/{市拼音}/{区拼音}/{街道拼音}/index.html)
```

#### 直辖市处理流程

```
读取直辖市数据
  ↓
跳过"市辖区"层（占位符）
  ↓
生成直辖市级别 HTML (output/{直辖市拼音}/index.html)
  ↓
遍历区县
  ↓
生成区级别 HTML (output/{直辖市拼音}/{区拼音}/index.html)
  ↓
遍历街道
  ↓
生成街道级别 HTML (output/{直辖市拼音}/{区拼音}/{街道拼音}/index.html)
```

#### 港澳台处理流程

```
读取港澳台数据
  ↓
判断类型（香港/澳门/台湾）
  ↓
生成特别行政区/省级别 HTML
  ↓
遍历区域/城市
  ↓
生成区域/城市级别 HTML
  ↓
遍历区（没有街道层级）
  ↓
生成区级别 HTML
```

### 3. 拼音转换

所有地名都需要转换为拼音作为文件夹名：

```python
def to_pinyin(text: str) -> str:
    """将中文转换为拼音（全小写，无空格）"""
    pinyin_list = lazy_pinyin(text, style=Style.NORMAL)
    pinyin = "".join(pinyin_list).lower()
    pinyin = re.sub(r'[^a-z0-9]', '', pinyin)  # 移除特殊字符
    return pinyin
```

### 4. HTML 生成

当前实现方式：**直接通过字符串拼接生成 HTML**（不使用模板系统）

HTML 结构包含：
- 标准的 HTML5 文档结构
- `<head>` 部分：meta 标签、title
- `<body>` 部分：根据层级显示相应内容
  - 列表页面：显示下级行政区划列表
  - 详情页面：显示导航链接和基本信息

## 特殊处理逻辑

### 1. 直辖市特殊处理

**识别方式**：

```python
MUNICIPALITIES = ["北京市", "天津市", "上海市", "重庆市"]
is_municipality = province_name in MUNICIPALITIES
```

**处理要点**：

- 数据中的"市辖区"是占位符，需要跳过这一层
- 路径只有三层：`{直辖市拼音}/{区拼音}/{街道拼音}/index.html`
- HTML 中的导航链接需要特殊处理（直辖市没有省份层级）

**实现示例**：

```python
def process_municipality(province_name: str, province_data: Dict[str, Any]):
    # 跳过"市辖区"层
    shixiaqu_data = province_data.get("市辖区", {})
    
    # 直接遍历区县
    for district_name, streets_list in shixiaqu_data.items():
        # 生成区级别和街道级别 HTML
        ...
```

### 2. 路径计算

**相对路径规则**：

- 省级别：无上级链接
- 市级别：返回省级别使用 `../index.html`
- 区级别：返回市级别使用 `../index.html`，返回省级别使用 `../../index.html`
- 街道级别：返回区级别使用 `../index.html`，返回市级别使用 `../../index.html`，返回省级别使用 `../../../index.html`

**直辖市路径规则**：

- 区级别：返回直辖市级别使用 `../index.html`
- 街道级别：返回区级别使用 `../index.html`，返回直辖市级别使用 `../../index.html`

### 3. 数据验证

当前实现中，对于数据缺失的情况：

```python
if not shixiaqu_data:
    print(f"警告: {province_name} 没有找到市辖区数据")
    return
```

建议增强数据验证逻辑，确保数据完整性。

## HTML 生成规则

### HTML 结构

所有 HTML 文件都遵循以下结构：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{页面标题}</title>
</head>
<body>
    <div class="{层级类型}">
        <h1>{当前名称}</h1>
        <!-- 导航链接 -->
        <!-- 列表或详情内容 -->
    </div>
</body>
</html>
```

### 不同层级的 HTML 内容

#### 省级别/直辖市级别

- 显示：省份/直辖市名称
- 内容：下级城市/区列表（链接形式）

#### 市级别

- 显示：城市名称
- 导航：所属省份链接
- 内容：下级区列表（链接形式）

#### 区级别

- 显示：区名称
- 导航：所属城市链接（普通省份还有所属省份链接）
- 内容：下级街道列表（链接形式）

#### 街道级别

- 显示：街道名称
- 导航：所属区、城市、省份链接（根据层级）
- 内容：基本信息（当前实现较简单）

## 开发规范

### 代码组织

1. **模块化设计**：功能拆分到不同脚本文件
2. **公共函数提取**：共享功能放在 `common.py`
3. **类型提示**：使用 `typing` 模块提供类型提示
4. **文档字符串**：所有函数都包含文档字符串

### 命名规范

- 函数名：使用小写字母和下划线（snake_case）
- 常量名：使用大写字母和下划线（UPPER_CASE）
- 变量名：使用小写字母和下划线（snake_case）

### 错误处理

当前实现：

```python
try:
    # 处理逻辑
except Exception as e:
    print(f"错误: {e}")
```

建议增强：

- 添加详细的错误日志
- 区分不同类型的错误
- 提供更友好的错误信息

### 日志输出

当前使用 `print()` 输出信息，建议：

- 使用 `logging` 模块
- 区分不同级别的日志（INFO、WARNING、ERROR）
- 支持输出到文件

## 运行方式

### 方式一：使用主入口脚本（推荐）

```bash
python3 generate_all.py
```

这会按顺序执行所有生成脚本。

### 方式二：单独运行各个脚本

```bash
# 1. 生成根目录首页
python3 generate_root_index.py

# 2. 生成直辖市的 HTML
python3 generate_municipalities.py

# 3. 生成普通省份的 HTML
python3 generate_provinces.py

# 4. 生成港澳台的 HTML
python3 generate_hk_mo_tw.py
```

### 输出目录

所有生成的 HTML 文件都会输出到 `output/` 目录下。

## 数据结构说明

### pcas.json 结构

```json
{
  "省份名称": {
    "城市名称": {
      "区名称": ["街道1", "街道2", ...]
    }
  },
  "直辖市名称": {
    "市辖区": {
      "区名称": ["街道1", "街道2", ...]
    }
  }
}
```

### HK-MO-TW.json 结构

```json
{
  "香港特别行政区": {
    "区域名称": ["区1", "区2", ...]
  },
  "澳门特别行政区": {
    "区域名称": ["区1", "区2", ...]
  },
  "台湾省": {
    "城市/县名称": ["区1", "区2", ...]
  }
}
```

## 已知问题和限制

### 1. 模板系统未使用

- **问题**：代码中完全没有使用 `templates/` 目录下的模板文件
- **影响**：HTML 结构硬编码在代码中，难以维护和修改样式
- **建议**：实现模板系统（使用 Jinja2 等模板引擎）

### 2. 代码重复

- **问题**：多个脚本中有重复的 HTML 生成函数
- **影响**：维护成本高，容易遗漏更新
- **建议**：统一 HTML 生成逻辑到公共模块

### 3. 性能优化空间

- **问题**：拼音转换可能被重复计算
- **影响**：处理大量数据时性能下降
- **建议**：添加缓存机制（使用 `@lru_cache`）

### 4. 错误处理不完善

- **问题**：错误处理比较简单，缺少详细日志
- **影响**：调试困难，难以追踪问题
- **建议**：使用 `logging` 模块，添加详细的错误日志

## 扩展建议

### 短期优化

1. **实现模板系统**：使用 Jinja2 模板引擎，提高可维护性
2. **消除代码重复**：统一 HTML 生成逻辑
3. **添加拼音转换缓存**：提升性能

### 中期优化

1. **完善错误处理和日志**：使用 `logging` 模块
2. **优化配置管理**：创建 `config.py` 统一配置
3. **添加数据验证**：确保数据完整性

### 长期优化

1. **架构重构**：按功能模块重新组织代码
2. **性能优化**：支持批量处理和并发
3. **功能扩展**：支持增量更新、统计报告等

## 开发注意事项

1. **数据文件位置**：确保 `data/` 目录下有正确的 JSON 数据文件
2. **输出目录**：确保有写入权限，输出目录会自动创建
3. **编码问题**：所有文件使用 UTF-8 编码
4. **路径处理**：使用 `pathlib.Path` 处理路径，避免跨平台问题
5. **测试**：修改代码后建议先在小数据集上测试

## 相关文档

- `requirements_v1.md`: 需求文档 v1.0
- `requirements_v2.md`: 需求文档 v2.0（包含模板系统需求）
- `README_SCRIPTS.md`: 脚本使用说明

---

**文档版本**: v1.0  
**最后更新**: 2025年12月27日
**维护者**: Jarod Sun
