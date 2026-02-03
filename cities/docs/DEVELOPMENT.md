# 开发文档 v2

## 项目概述

本项目是一个批量生成中国行政区划静态 HTML 页面的系统。系统通过读取 JSON 数据文件，按照拼音建立文件夹结构，并使用 Jinja2 模板引擎生成对应的 HTML 文件。

**模板说明**：当前生成程序使用 `templates_index/` 目录下的新页面样式（head/body_*/foot 三部分模板，Swiper 轮播、侧栏地区导航等）。旧版 `templates/` 目录保留作参考。

### 核心功能

- 读取 `pcas.json` 和 `HK-MO-TW.json` 数据文件
- 将中文地名转换为拼音作为文件夹名
- 使用 Jinja2 模板引擎生成省、市、区、街道四个层级的 HTML 页面
- 处理直辖市、普通省份、港澳台等不同数据结构的特殊逻辑
- 生成根目录总入口页面（按地区分类，包含 Banner 和产品信息）
- 自动生成 SEO 信息（页面标题、关键词、描述）
- 自动复制模板资源文件（CSS、JS、图片等）到输出目录

## 项目结构

```
cities/
├── common.py                    # 公共函数模块（共享工具函数）
├── config.py                    # 配置管理模块（统一管理所有配置）
├── html_renderer.py             # HTML 模板渲染模块（使用 Jinja2）
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
├── templates_index/             # 模板文件目录（Jinja2 模板，当前使用的新样式）
│   ├── head_template.html       # 页面头部模板
│   ├── foot_template.html       # 页面底部模板
│   ├── body_root_template.html  # 根页面内容模板
│   ├── body_province_template.html    # 省份页面内容模板
│   ├── body_municipality_template.html # 直辖市页面内容模板
│   ├── body_city_template.html  # 城市页面内容模板
│   ├── body_district_template.html    # 区县页面内容模板
│   ├── body_street_template.html      # 街道页面内容模板
│   ├── css/                    # 样式文件
│   ├── images/                 # 图片等静态资源
│   ├── js/                     # JavaScript 文件
│   └── index.html               # 原始完整页面（参考）
├── templates/                   # 旧版模板目录（已切换至 templates_index）
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
- **jinja2**: 模板引擎（用于 HTML 模板渲染）
  ```bash
  pip install jinja2
  ```
- **标准库**:
  - `json`: JSON 数据解析
  - `pathlib`: 文件路径操作
  - `subprocess`: 子进程管理（用于 `generate_all.py`）
  - `typing`: 类型提示
  - `re`: 正则表达式
  - `shutil`: 文件复制（用于复制模板资源）

### 编码规范

- 文件编码：UTF-8
- 代码风格：遵循 PEP 8
- 类型提示：使用 `typing` 模块提供类型提示

## 核心模块说明

### 1. `common.py` - 公共函数模块

**功能**：包含所有脚本共享的工具函数

**主要函数**：

- `to_pinyin(text: str) -> str`
  - 功能：将中文转换为拼音（全小写，无空格）
  - 实现：使用 `pypinyin.lazy_pinyin()` 获取拼音列表，然后连接并移除特殊字符
  - 返回：纯小写字母和数字的字符串

- `write_html_file(file_path: Path, html_content: str)`
  - 功能：写入 HTML 文件
  - 实现：自动创建父目录，使用 UTF-8 编码写入

- `copy_template_assets()`
  - 功能：将 `templates_index/` 目录下的资源文件（CSS、JS、图片等）复制到 `output/` 目录
  - 实现：从 `config.py` 读取需要复制的文件夹和文件列表，使用 `shutil` 进行复制
  - 用途：确保生成的 HTML 页面可以正确加载样式和脚本

**注意**：配置常量已迁移到 `config.py` 模块

### 2. `config.py` - 配置管理模块

**功能**：统一管理所有配置项，包括路径、地区分类、SEO、产品信息、Banner、模板等

**主要配置项**：

- **路径配置**：`BASE_DIR`、`OUTPUT_DIR`、`DATA_DIR`、`TEMPLATE_DIR`、数据文件路径
- **地区分类配置**：`MUNICIPALITIES`、`HONG_KONG`、`MACAO`、`TAIWAN`、`REGIONS`、`REGION_ORDER`
- **SEO 配置**：
  - `BASE_SERVICE_KEYWORDS`：基础服务关键词列表
  - `get_seo_context()`：根据页面类型自动生成 SEO 信息（标题、关键词、描述）
  - 支持根页面、省份、城市、区县、街道等不同页面类型的 SEO 生成
- **产品信息配置**：
  - `ROOT_PAGE_PRODUCTS`：根页面显示的产品信息
  - `get_product_context()`：获取产品信息上下文（根页面包含产品，其他页面为空）
- **Banner 配置**：
  - `BANNER_SLIDES`：Banner 轮播项列表（path、alt、link），与 templates_index 新样式一致
  - `generate_banner_html()`：生成 Swiper 结构 Banner HTML（swiper-container / swiper-wrapper / swiper-slide）
- **模板配置**：`DEFAULT_TEMPLATES`：默认模板文件名映射
- **资源复制配置**：`FOLDERS_TO_COPY`、`FILES_TO_COPY`：需要复制的文件夹和文件列表
- **名称简化规则**：
  - `simplify_city_name()`、`simplify_province_name()`、`simplify_district_name()`、`simplify_special_region_name()`
  - 用于在根页面导航中简化显示名称（移除后缀）
- **生成脚本配置**：`GENERATION_SCRIPTS`：脚本执行顺序列表

### 3. `html_renderer.py` - HTML 模板渲染模块

**功能**：使用 Jinja2 模板引擎渲染 HTML 模板

**核心类**：

- `HTMLRenderer`：HTML 模板渲染器类
  - 使用 `FileSystemLoader` 从 `templates_index/` 目录加载模板（配置见 `config.TEMPLATE_DIR`）
  - 支持自动转义 HTML 特殊字符
  - 组合 `head`、`body`、`foot` 三个模板生成完整 HTML

**主要方法**：

- `render_html(head_template, body_template, foot_template, context)`
  - 功能：组合三个模板生成完整 HTML
  - 参数：
    - `head_template`：头部模板文件名（如 `head_template.html`）
    - `body_template`：内容模板文件名（如 `body_province_template.html`）
    - `foot_template`：底部模板文件名（如 `foot_template.html`）
    - `context`：模板变量字典
  - 返回：完整的 HTML 字符串

**全局函数**：

- `get_renderer()`：获取全局模板渲染器实例（单例模式）

### 4. `generate_all.py` - 主入口脚本

**功能**：统一调用所有生成脚本，按顺序执行

**执行流程**：

1. **复制模板资源文件**：调用 `copy_template_assets()` 将 CSS、JS、图片等资源复制到 `output/` 目录
2. 生成根目录首页（`generate_root_index.py`）
3. 生成直辖市（`generate_municipalities.py`）
4. 生成普通省份（`generate_provinces.py`）
5. 生成港澳台（`generate_hk_mo_tw.py`）

**特点**：

- 使用 `subprocess` 运行各个脚本
- 提供执行状态反馈
- 统计成功/失败数量
- 即使某个脚本失败，也会继续执行后续脚本
- 脚本执行顺序从 `config.py` 的 `GENERATION_SCRIPTS` 配置中读取

**使用方法**：

```bash
python3 generate_all.py
```

### 5. `generate_municipalities.py` - 处理直辖市

**功能**：

- 读取 `pcas.json` 数据文件
- 处理四个直辖市（北京市、天津市、上海市、重庆市）
- 层级结构：市 -> 区 -> 街道（跳过"市辖区"层）

**核心函数**：

- `generate_municipality_html()`: 生成直辖市级别 HTML（使用模板渲染）
- `generate_district_html()`: 生成区级别 HTML（直辖市专用，使用模板渲染）
- `generate_street_html()`: 生成街道级别 HTML（直辖市专用，使用模板渲染）
- `process_municipality()`: 处理直辖市逻辑

**模板使用**：

- 使用 `html_renderer.get_renderer()` 获取模板渲染器
- 使用 `DEFAULT_TEMPLATES` 中的模板文件名
- 通过 `context` 字典传递模板变量（如 `直辖市名称`、`下级列表`、`页面标题` 等）

**特殊处理**：

- 需要跳过"市辖区"这一占位层
- 路径只有三层（市 -> 区 -> 街道）
- 导航链接不包含省份层级（因为直辖市本身就是省级）

### 6. `generate_provinces.py` - 处理普通省份

**功能**：

- 读取 `pcas.json` 数据文件
- 处理所有普通省份（排除四个直辖市）
- 层级结构：省 -> 市 -> 区 -> 街道

**核心函数**：

- `generate_province_html()`: 生成省级别 HTML（使用模板渲染）
- `generate_city_html()`: 生成市级别 HTML（使用模板渲染）
- `generate_district_html()`: 生成区级别 HTML（普通省份专用，使用模板渲染）
- `generate_street_html()`: 生成街道级别 HTML（普通省份专用，使用模板渲染）
- `process_province()`: 处理普通省份逻辑

**模板使用**：

- 使用 `html_renderer.get_renderer()` 获取模板渲染器
- 使用 `DEFAULT_TEMPLATES` 中的模板文件名
- 通过 `context` 字典传递模板变量（如 `省份名称`、`城市名称`、`下级列表`、`页面标题` 等）

**特殊处理**：

- 路径有四层（省 -> 市 -> 区 -> 街道）
- 导航链接包含完整的层级关系（区、市、省）

### 7. `generate_hk_mo_tw.py` - 处理港澳台

**功能**：

- 读取 `HK-MO-TW.json` 数据文件
- 处理香港/澳门特别行政区（特别行政区 -> 区域 -> 区）
- 处理台湾省（省 -> 市/县 -> 区）

**核心函数**：

- `generate_municipality_html()`: 生成特别行政区级别 HTML（使用模板渲染）
- `generate_region_html()`: 生成区域级别 HTML（香港/澳门，使用模板渲染）
- `generate_district_only_html()`: 生成区级别 HTML（没有街道层级，使用模板渲染）
- `generate_province_html()`: 生成省级别 HTML（台湾，使用模板渲染）
- `generate_taiwan_city_html()`: 生成台湾城市级别 HTML（使用模板渲染）
- `process_hong_kong_macao()`: 处理香港/澳门逻辑
- `process_taiwan()`: 处理台湾逻辑

**模板使用**：

- 使用 `html_renderer.get_renderer()` 获取模板渲染器
- 使用 `DEFAULT_TEMPLATES` 中的模板文件名
- 通过 `context` 字典传递模板变量

**特殊处理**：

- 香港/澳门：三层结构（特别行政区 -> 区域 -> 区），没有街道层级
- 台湾：三层结构（省 -> 市/县 -> 区），没有街道层级

### 8. `generate_root_index.py` - 生成根目录首页

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
- `generate_region_nav_list()`: 生成地区导航列表 HTML（参考 yisu.com/city/ 的格式）
- `generate_root_html()`: 生成根目录 HTML（使用模板渲染）

**特殊功能**：

- 根页面包含 Banner 轮播（通过 `generate_banner_html()` 生成）
- 根页面包含产品信息（通过 `get_product_context(include_products=True)` 获取）
- 根页面使用特殊的 SEO 信息（使用"全国"前缀）
- 地区导航列表使用 `<dl>` 结构，显示省份和下级城市/区县的链接
- 使用名称简化函数（`simplify_city_name()`、`simplify_province_name()` 等）优化显示

**模板使用**：

- 使用 `body_root_template.html` 作为内容模板
- 通过 `context` 字典传递 `地区导航列表`、`banner`、产品信息、SEO 信息等变量

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

**当前实现方式**：**使用 Jinja2 模板引擎生成 HTML**

**模板系统架构**：

- **三部分模板结构**：
  - `head_template.html`：页面头部（包含 `<!DOCTYPE>`、`<html>`、`<head>`、`<body>` 开始标签和 header 内容）
  - `body_*_template.html`：页面主体内容（根据页面类型选择不同的 body 模板）
  - `foot_template.html`：页面底部（包含 footer 和 `</body></html>` 结束标签）

- **模板渲染流程**：
  1. 准备模板变量（`context` 字典）
  2. 使用 `HTMLRenderer.render_html()` 方法渲染三个模板
  3. 自动组合生成完整 HTML

**模板变量**：

所有模板通过 `context` 字典接收变量，主要包括：
- **通用变量**：
  - `当前页面URL地址`：页面 URL（从 `config.DEFAULT_PAGE_URL` 获取）
  - `main_site_footer`：网站底部内容（从 `config.DEFAULT_FOOTER` 获取）
- **SEO 变量**（通过 `get_seo_context()` 生成）：
  - `页面标题`：页面 `<title>` 标签内容
  - `页面关键词`：页面 `<meta name="keywords">` 内容
  - `页面描述`：页面 `<meta name="description">` 内容
- **内容变量**：
  - `省份名称`、`城市名称`、`区县名称`、`街道名称`：当前页面显示的名称
  - `下级列表`：下级行政区划的 HTML 列表（`<li><a>` 结构）
  - `城市导航列表`：城市导航链接（用于复杂模板，使用 `|` 分隔）
  - `省份链接`、`城市链接`、`区县链接`：导航链接 HTML
- **特殊变量**（根页面）：
  - `banner`：Banner 轮播 HTML（通过 `generate_banner_html()` 生成）
  - `地区导航列表`：按地区分类的导航列表 HTML
  - 产品信息变量：`产品名称1`、`地区信息1`、`规格1` 等（通过 `get_product_context()` 生成）

**HTML 结构**：

- 标准的 HTML5 文档结构
- `<head>` 部分：meta 标签、title、SEO 信息
- `<body>` 部分：根据层级显示相应内容
  - 列表页面：显示下级行政区划列表
  - 详情页面：显示导航链接和基本信息
  - 根页面：显示 Banner、地区导航列表、产品信息

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

### 1. 性能优化空间

- **问题**：拼音转换可能被重复计算
- **影响**：处理大量数据时性能下降
- **建议**：添加缓存机制（使用 `@lru_cache`）

### 2. 错误处理不完善

- **问题**：错误处理比较简单，缺少详细日志
- **影响**：调试困难，难以追踪问题
- **建议**：使用 `logging` 模块，添加详细的错误日志

### 3. 模板变量命名

- **问题**：模板变量使用中文命名（如 `省份名称`、`城市名称`），虽然直观但不符合常见规范
- **影响**：可能影响代码可读性（对于不熟悉中文的开发者）
- **建议**：考虑使用英文命名（如 `province_name`、`city_name`），但需要同步更新所有模板文件

## 扩展建议

### 短期优化

1. **添加拼音转换缓存**：使用 `@lru_cache` 装饰器缓存拼音转换结果，提升性能
2. **完善错误处理和日志**：使用 `logging` 模块，区分不同级别的日志（INFO、WARNING、ERROR）
3. **添加数据验证**：确保数据完整性，对缺失数据提供更友好的错误提示

### 中期优化

1. **模板变量命名规范化**：考虑将中文变量名改为英文（需要同步更新所有模板）
2. **支持模板继承**：使用 Jinja2 的模板继承功能，减少模板代码重复
3. **添加单元测试**：为关键函数添加单元测试，确保代码质量
4. **支持增量更新**：只更新修改过的页面，提升生成速度

### 长期优化

1. **性能优化**：支持批量处理和并发生成
2. **功能扩展**：
   - 支持统计报告（生成页面数量、文件大小等）
   - 支持自定义模板主题
   - 支持多语言（国际化）
3. **架构优化**：按功能模块重新组织代码，提高可维护性

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

## SEO 功能说明

### SEO 信息自动生成

系统会根据页面类型和地区信息自动生成 SEO 信息（页面标题、关键词、描述）。

**生成规则**：

- **根页面**：使用"全国"作为地区前缀
  - 标题：`全国IDC服务器托管,全国BGP带宽,... - 亿人互联`
  - 关键词：`全国IDC服务器托管,全国BGP带宽,...`
  - 描述：`亿人互联全国客户服务中心，提供全国IDC服务器托管、全国BGP带宽等服务...`

- **省份/直辖市页面**：使用省份/直辖市名称作为前缀
  - 标题：`{省份名称}IDC服务器托管,{省份名称}BGP带宽,... - 亿人互联`
  - 关键词：`{省份名称}IDC服务器托管,{省份名称}BGP带宽,...`
  - 描述：`亿人互联{省份名称}地区，提供{省份名称}IDC服务器托管、{省份名称}BGP带宽等服务...`

- **城市/区县/街道页面**：使用对应名称作为前缀，生成规则类似

**配置位置**：

- SEO 相关配置在 `config.py` 中
- `BASE_SERVICE_KEYWORDS`：基础服务关键词列表
- `get_seo_context()`：根据页面类型生成 SEO 信息的函数

## 产品信息功能说明

### 产品信息显示

根页面（`output/index.html`）会显示产品信息，其他页面不显示。

**配置位置**：

- 产品信息配置在 `config.py` 中
- `ROOT_PAGE_PRODUCTS`：根页面显示的产品信息字典
- `get_product_context()`：获取产品信息上下文的函数

**产品信息结构**：

每个产品包含以下字段：
- `产品名称`：产品名称
- `地区信息`：产品所在地区
- `规格`：产品规格（如 "1核 4G"）
- `带宽`：带宽信息（如 "2M"）
- `独享IP`：IP 数量
- `优惠价`：优惠价格
- `原价`：原价
- `购买链接`：购买链接 URL

## Banner 功能说明

### Banner 轮播

根页面（`output/index.html`）会显示 Banner 轮播（Swiper 结构，与 templates_index 新样式一致）。

**配置位置**：

- Banner 配置在 `config.py` 中
- `BANNER_SLIDES`：轮播项列表，每项含 `path`（图片路径）、`alt`、`link`（相对于 output 目录）
- `generate_banner_html()`：生成 Swiper HTML（`swiper-container` / `swiper-wrapper` / `swiper-slide` / `swiper-pagination`）

**实现方式**：

- 使用 Swiper 轮播结构，与 templates_index 的 CSS/JS 一致
- 支持多张图片及对应链接（如 `./images/page/banner1.jpg` 等）
- 依赖 `./js/swiper-4.3.5.min0fee.js` 与 `./css/swiper-4.3.5.min0fee.css` 进行轮播切换

## 资源复制功能说明

### 模板资源自动复制

运行 `generate_all.py` 时，会自动将 `templates_index/` 目录下的资源文件复制到 `output/` 目录。

**复制的资源**（当前使用 templates_index 新样式）：

- **文件夹**（从 `config.FOLDERS_TO_COPY` 读取）：
  - `css/`：样式文件（含 base、swiper、region 等）
  - `images/`：图片等静态资源（含 page/banner、logo 等）
  - `js/`：JavaScript 文件（含 jquery、swiper、region 等）

- **文件**（从 `config.FILES_TO_COPY` 读取）：
  - 当前为空（favicon 位于 `images/` 下，随文件夹复制）

**实现方式**：

- `common.py` 中的 `copy_template_assets()` 函数负责复制
- 如果目标文件夹已存在，会先删除再复制（确保资源最新）
- 复制过程会输出日志信息

---

**文档版本**: v1.1  
**最后更新**: 2025年12月27日（基于实际代码实现更新）  
**维护者**: Jarod Sun
