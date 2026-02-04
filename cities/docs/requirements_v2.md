# 城市数据 HTML 生成系统需求说明

## 项目概述

基于 `pcas.json` 文件中的中国城市、区县、街道数据，按照拼音建立文件夹结构，并生成对应的 HTML 文件。

## 数据源

- **数据文件**: `pcas.json`
- **数据结构**: 
  ```
  省份/直辖市
    └── 城市（普通省份）或 市辖区（直辖市占位）
        └── 区县
            └── 街道列表
  ```

### 数据结构说明

1. **四个直辖市**（北京市、天津市、上海市、重庆市）：
   - 层级结构：**市 -> 区 -> 街道**
   - 数据中的"市辖区"是占位符，**需要跳过这一层**
   - 实际路径：`{直辖市拼音}/{区拼音}/{街道拼音}/index.html`

2. **其他省份**：
   - 层级结构：**省 -> 市 -> 区 -> 街道**
   - 实际路径：`{省拼音}/{市拼音}/{区拼音}/{街道拼音}/index.html`

3. **港澳台**（香港、澳门、台湾）：
   - 数据来源：可与大陆数据合并，或使用单独数据文件（如 `HK-MO-TW.json`）
   - **命名规则**：香港、澳门、台湾**使用英文**（不用拼音）；其**下级区域**若有国际通用/官方英文则用英文，找不到专用英文则继续使用拼音。
   - **香港特别行政区**：层级为 特区 → 区域（香港岛/九龙/新界）→ 区（18 区），无街道级；区域与区均有官方英文（见下文「港澳台特殊处理」）。
   - **澳门特别行政区**：层级为 特区 → 区域（澳门半岛/澳门外岛）→ 堂区，无街道级；堂区有葡文/英文专用名。
   - **台湾省**：层级为 省 → 市/县 → 区/乡镇，与大陆「省→市→区→街道」类似；市/县多有官方英文，区/乡镇无通用英文时用拼音。
   - 在**首页/索引页**中，港澳台作为独立分组展示，与「直辖市」「华北地区」等并列

## 功能需求

### 1. 文件夹结构生成

#### 1.1 四个直辖市（北京市、天津市、上海市、重庆市）

**层级结构**：市 -> 区 -> 街道（跳过"市辖区"占位层）

```
output/
  └── {直辖市拼音}/
      ├── index.html                    # 直辖市级别HTML
      └── {区拼音}/
          ├── index.html                # 区级别HTML
          └── {街道拼音}/
              └── index.html            # 街道级别HTML
```

**示例（北京市）**:
```
output/
  └── beijingshi/
      ├── index.html                    # 北京市首页
      └── dongchengqu/
          ├── index.html                # 东城区首页
          └── donghuamenjiedao/
              └── index.html            # 东华门街道首页
          └── jingshanjiedao/
              └── index.html            # 景山街道首页
          └── jiaodaokoujiedao/
              └── index.html            # 交道口街道首页
      └── xichengqu/
          ├── index.html                # 西城区首页
          └── xichanganjiejiedao/
              └── index.html            # 西长安街街道首页
          └── ...
```

#### 1.2 其他省份

**层级结构**：省 -> 市 -> 区 -> 街道

```
output/
  └── {省拼音}/
      ├── index.html                    # 省级别HTML
      └── {市拼音}/
          ├── index.html                # 市级别HTML
          └── {区拼音}/
              ├── index.html            # 区级别HTML
              └── {街道拼音}/
                  └── index.html       # 街道级别HTML
```

**示例（河北省石家庄市）**:
```
output/
  └── hebeisheng/
      ├── index.html                    # 河北省首页
      └── shijiazhuangshi/
          ├── index.html                # 石家庄市首页
          └── changanqu/
              ├── index.html            # 长安区首页
              └── jianbeijiedao/
                  └── index.html        # 建北街道首页
              └── qingyuanjiedao/
                  └── index.html        # 青园街道首页
```

### 2. 拼音转换规则

- **大陆地区**：使用中文转拼音库（如 `pypinyin`）将中文名称转换为拼音；拼音格式：全小写，去除空格和特殊字符；处理多音字：使用默认读音或根据上下文选择。
- **港澳台**：香港、澳门、台湾**不使用拼音，使用英文**（Hong Kong / Macau / Taiwan）；其**下级区域**若有专用英文（如香港 18 区、澳门堂区、台湾县市）则使用英文，找不到专用英文则继续使用拼音。

### 3. HTML 文件生成

需要为**省、市、区、街道**四个层级都生成对应的 HTML 文件：

#### 3.1 四个直辖市

**直辖市级别**：
- 文件名：`index.html`
- 文件路径：`output/{直辖市拼音}/index.html`
- 内容：显示该直辖市下的所有区列表

**区级别**：
- 文件名：`index.html`
- 文件路径：`output/{直辖市拼音}/{区拼音}/index.html`
- 内容：显示该区下的所有街道列表

**街道级别**：
- 文件夹名：`{街道拼音}/`
- 文件名：`index.html`
- 文件路径：`output/{直辖市拼音}/{区拼音}/{街道拼音}/index.html`
- 内容：显示该街道的详细信息
- **注意**：跳过"市辖区"这一层

#### 3.2 其他省份

**省级别**：
- 文件名：`index.html`
- 文件路径：`output/{省拼音}/index.html`
- 内容：显示该省下的所有市列表

**市级别**：
- 文件名：`index.html`
- 文件路径：`output/{省拼音}/{市拼音}/index.html`
- 内容：显示该市下的所有区列表

**区级别**：
- 文件名：`index.html`
- 文件路径：`output/{省拼音}/{市拼音}/{区拼音}/index.html`
- 内容：显示该区下的所有街道列表

**街道级别**：
- 文件夹名：`{街道拼音}/`
- 文件名：`index.html`
- 文件路径：`output/{省拼音}/{市拼音}/{区拼音}/{街道拼音}/index.html`
- 内容：显示该街道的详细信息

### 4. HTML 模板系统

每个 HTML 文件由三个模板部分组成：

#### 4.1 Head 模板 (`head_template.html`)
- 包含 HTML 头部信息
- `<head>` 标签内容
- 可包含 meta 标签、CSS 链接等
- 所有层级共用同一个 head 模板

#### 4.2 Body 模板

根据不同的层级，可以使用不同的 body 模板：

**省级别/直辖市级别 Body 模板** (`body_province_template.html` 或 `body_municipality_template.html`)：
- 显示该省/直辖市下的所有市/区列表
- 支持变量替换：
  - `{省份名称}` / `{直辖市名称}` - 省份或直辖市名称
  - `{省份拼音}` / `{直辖市拼音}` - 省份或直辖市的拼音
  - `{下级列表}` - 下级单位列表（市列表或区列表）

**市级别 Body 模板** (`body_city_template.html`)：
- 显示该市下的所有区列表
- 支持变量替换：
  - `{省份名称}` - 省份名称
  - `{城市名称}` - 城市名称
  - `{省份拼音}` - 省份的拼音
  - `{城市拼音}` - 城市的拼音
  - `{下级列表}` - 区列表

**区级别 Body 模板** (`body_district_template.html`)：
- 显示该区下的所有街道列表
- 支持变量替换：
  - `{省份名称}` - 省份或直辖市名称
  - `{城市名称}` - 城市名称（直辖市时与省份名称相同）
  - `{区县名称}` - 区县名称
  - `{省份拼音}` - 省份或直辖市的拼音
  - `{城市拼音}` - 城市的拼音（直辖市时与省份拼音相同）
  - `{区县拼音}` - 区县的拼音
  - `{下级列表}` - 街道列表

**街道级别 Body 模板** (`body_street_template.html`)：
- 显示该街道的详细信息
- 支持变量替换：
  - `{省份名称}` - 省份或直辖市名称
  - `{城市名称}` - 城市名称（直辖市时与省份名称相同）
  - `{区县名称}` - 区县名称
  - `{街道名称}` - 街道名称
  - `{省份拼音}` - 省份或直辖市的拼音
  - `{城市拼音}` - 城市的拼音（直辖市时与省份拼音相同）
  - `{区县拼音}` - 区县的拼音
  - `{街道拼音}` - 街道的拼音

**变量说明**：
- 对于**四个直辖市**：`{城市名称}` = `{省份名称}`（都是直辖市名称）
- 对于**普通省份**：`{城市名称}` ≠ `{省份名称}`（城市是省份下的地级市）
- `{下级列表}` 变量需要根据实际数据动态生成列表内容

#### 4.3 Foot 模板 (`foot_template.html`)
- 包含 HTML 底部信息
- `</body>` 和 `</html>` 标签
- 可包含 JavaScript 脚本、统计代码等
- 所有层级共用同一个 foot 模板

### 5. 生成流程

1. **读取数据**
   - 加载 `pcas.json` 文件
   - 解析 JSON 数据结构

2. **遍历数据并生成 HTML**
   - 遍历所有省份/直辖市
   - **判断是否为直辖市**（北京市、天津市、上海市、重庆市）
   - **如果是直辖市**：
     - **生成直辖市级别 HTML**：`output/{直辖市拼音}/index.html`
     - 跳过"市辖区"这一层（这是占位符）
     - 直接遍历区县
     - 对于每个区县：
       - **生成区级别 HTML**：`output/{直辖市拼音}/{区拼音}/index.html`
       - 遍历该区县下的所有街道
       - 对于每个街道：
         - **创建街道文件夹**：`output/{直辖市拼音}/{区拼音}/{街道拼音}/`
         - **生成街道级别 HTML**：`output/{直辖市拼音}/{区拼音}/{街道拼音}/index.html`
   - **如果是普通省份**：
     - **生成省级别 HTML**：`output/{省拼音}/index.html`
     - 遍历每个省份下的所有城市
     - 对于每个城市：
       - **生成市级别 HTML**：`output/{省拼音}/{市拼音}/index.html`
       - 遍历该城市下的所有区县
       - 对于每个区县：
         - **生成区级别 HTML**：`output/{省拼音}/{市拼音}/{区拼音}/index.html`
         - 遍历该区县下的所有街道
         - 对于每个街道：
           - **创建街道文件夹**：`output/{省拼音}/{市拼音}/{区拼音}/{街道拼音}/`
           - **生成街道级别 HTML**：`output/{省拼音}/{市拼音}/{区拼音}/{街道拼音}/index.html`

3. **拼音转换**
   - 将省份、城市、区县、街道名称转换为拼音
   - 生成文件夹路径和文件名

4. **创建文件夹**
   - 根据拼音路径创建对应的文件夹结构
   - 确保父目录存在

5. **生成 HTML**
   - 根据层级选择对应的 body 模板：
     - 省级别/直辖市级别：使用 `body_province_template.html` 或 `body_municipality_template.html`
     - 市级别：使用 `body_city_template.html`
     - 区级别：使用 `body_district_template.html`
     - 街道级别：使用 `body_street_template.html`
   - 读取 head、对应的 body、foot 模板文件
   - 替换 body 模板中的变量（包括生成下级列表）
   - 组合三个模板生成完整 HTML
   - 写入到对应路径

## 技术实现要求

### 依赖库
- `json`: 解析 JSON 数据
- `pypinyin`: 中文转拼音
- `os` / `pathlib`: 文件系统操作

### 模板文件位置
建议在 `cities/` 目录下创建模板文件夹：
```
cities/
  ├── pcas.json
  ├── templates/
  │   ├── head_template.html
  │   ├── body_province_template.html      # 省级别模板（普通省份）
  │   ├── body_municipality_template.html  # 直辖市级别模板
  │   ├── body_city_template.html         # 市级别模板
  │   ├── body_district_template.html     # 区级别模板
  │   ├── body_street_template.html        # 街道级别模板
  │   └── foot_template.html
  └── 需求说明.md
```

**注意**：如果某些层级使用相同的模板，可以复用同一个模板文件。

### 输出目录
- 默认输出目录：`cities/output/`
- 可配置输出路径

## 特殊处理

### 1. 直辖市特殊处理

**四个直辖市列表**：
- 北京市
- 天津市
- 上海市
- 重庆市

**处理规则**：
1. 识别四个直辖市：在遍历数据时，判断省份名称是否为上述四个直辖市之一
2. 跳过"市辖区"层：当遇到直辖市时，数据中的"市辖区"是占位符，需要跳过这一层，直接访问区县数据
3. 路径生成：直辖市的路径只有三层（市 -> 区 -> 街道），而普通省份有四层（省 -> 市 -> 区 -> 街道）
4. 变量替换：在模板中，直辖市的情况：
   - `{省份名称}` = 直辖市名称（如"北京市"）
   - `{城市名称}` = 直辖市名称（与省份名称相同）
   - `{区县名称}` = 区名称
   - `{街道名称}` = 街道名称

**实现示例**：
```python
# 四个直辖市列表
MUNICIPALITIES = ["北京市", "天津市", "上海市", "重庆市"]

# 判断是否为直辖市
is_municipality = province_name in MUNICIPALITIES

if is_municipality:
    # 跳过"市辖区"层，直接遍历区县
    for district_name, streets in city_data.items():
        # 生成路径：{直辖市拼音}/{区拼音}/{街道拼音}/index.html
        ...
else:
    # 普通省份，遍历城市
    for city_name, districts in province_data.items():
        # 生成路径：{省拼音}/{市拼音}/{区拼音}/{街道拼音}/index.html
        ...
```

### 2. 港澳台特殊处理

**命名原则**：香港、澳门、台湾**使用英文**（不用拼音）；下级区域**有专用英文则用英文，找不到专用英文则用拼音**。

**首页/索引页中的港澳台逻辑**（与模板 `templates_index/index.html` 一致）：

1. **分组位置**：在首页地区导航中，「港澳台」为独立分组，排在「直辖市」之后、「华北地区」等大陆区域之前。顺序为：
   - 直辖市 → **港澳台** → 华北地区 → 东北地区 → 华东地区 → 华中地区 → 华南地区 → 西南地区 → 西北地区

2. **港澳台三项（英文）**：固定展示三个地区，**使用英文名称与路径**：
   - **香港**：显示名 Hong Kong，路径/链接 `hong-kong`（或 `hongkong`，项目内统一即可）
   - **澳门**：显示名 Macau，路径/链接 `macau`（Macao 为另一拼法，择一统一）
   - **台湾**：显示名 Taiwan，路径/链接 `taiwan`

3. **链接与路径**：
   - 首页侧栏中每个产品（如云服务器、高防、托管、IDC、机柜等）下均有「港澳台」分组
   - 链接形式：`{地区英文路径}/{产品页}.html`，例如：
     - `hong-kong/cloud.html`、`macau/cloud.html`、`taiwan/cloud.html`
     - `hong-kong/ddos.html`、`macau/ddos.html`、`taiwan/ddos.html`
   - 生成索引时，港澳台区块的 HTML 结构可与直辖市一致（左侧「港澳台：」，右侧三个链接）。

4. **下级区域命名（有专用英文用英文，无则用拼音）**：

   **香港**（官方 18 区均有英文，建议全部使用英文；路径可用小写+连字符）：
   - 区域：香港岛 → **Hong Kong Island**，九龙 → **Kowloon**，新界 → **New Territories**
   - 18 区官方英文（路径建议：小写、空格改连字符）：Central and Western、Wan Chai、Eastern、Southern（香港岛）；Yau Tsim Mong、Sham Shui Po、Kowloon City、Wong Tai Sin、Kwun Tong（九龙）；Kwai Tsing、Tsuen Wan、Tuen Mun、Yuen Long、North、Tai Po、Sai Kung、Sha Tin、Islands（新界）

   **澳门**（堂区有葡文/英文专用名，建议使用）：
   - 区域：澳门半岛 → **Macau Peninsula**，澳门外岛（氹仔、路环）→ **Taipa and Coloane** 或 **Outer Islands**
   - 堂区英文（路径可用简短形式）：大堂区 Sé、望德堂区 São Lázaro、风顺堂区 São Lourenço、花地玛堂区 Nossa Senhora de Fátima（或 Fátima）、圣安多尼堂区 Santo António、嘉模堂区（氹仔）Taipa、圣方济各堂区（路环）Coloane

   **台湾**（市/县多有官方英文，区/乡镇多数无通用英文，用拼音）：
   - 市/县：台北市 Taipei、新北市 New Taipei、桃园市 Taoyuan、台中市 Taichung、台南市 Tainan、高雄市 Kaohsiung、基隆市 Keelung、新竹市 Hsinchu City、嘉义市 Chiayi City；新竹县 Hsinchu County、苗栗县 Miaoli、彰化县 Changhua、南投县 Nantou、云林县 Yunlin、嘉义县 Chiayi County、屏东县 Pingtung、宜兰县 Yilan、花莲县 Hualien、台东县 Taitung、澎湖县 Penghu 等（以政府/国际常用英文为准）
   - 区/乡镇：若查得到通用英文则用英文，否则用拼音（如 pypinyin 或 Wade–Giles 等统一罗马化）

5. **数据与层级**（若生成港澳台下级页面）：
   - 香港：输出到 `output/hong-kong/` 下，下级路径使用上述英文（如 `hong-kong-island/`、`central-and-western/` 等）
   - 澳门：输出到 `output/macau/` 下，下级路径使用上述英文或简短形式（如 `taipa`、`coloane`、`se`）
   - 台湾：输出到 `output/taiwan/` 下，市/县用英文路径，区/乡镇用英文或拼音
   - 若使用单独数据文件（如 `HK-MO-TW.json`），需在生成流程中合并或单独遍历，并做「中文名 → 英文/拼音」映射表（香港 18 区、澳门堂区、台湾县市等）

6. **实现要点**：
   - 首页索引生成时，港澳台三项**固定使用英文**：Hong Kong、Macau、Taiwan；路径 `hong-kong`、`macau`、`taiwan`。
   - 下级区域：维护「中文 → 英文」映射表（香港区、澳门堂区、台湾县市等）；表中无对应英文时，该级使用拼音。
   - **中英对照数据**：`cities/data/HK-MO-TW_name_mapping.json` 提供港澳台及下级区域的中-英对照（含 `name_en`、`path_slug`），供生成页面程序直接调用。

### 3. 同名处理
- 如果存在同名的街道（不同区县），需要确保文件路径唯一
- 建议在文件名中包含区县信息，或使用序号区分

### 4. 特殊字符处理
- 处理拼音转换中的特殊字符
- 处理文件系统不支持的字符（如 `/`, `\`, `:` 等）

### 5. 错误处理
- 处理 JSON 解析错误
- 处理文件写入错误
- 处理拼音转换失败的情况
- 记录错误日志

## 输出示例

### 文件夹结构示例

**直辖市示例（北京市）**：
```
output/
  └── beijingshi/
      ├── index.html                    # 北京市首页（列出所有区）
      └── dongchengqu/
          ├── index.html                # 东城区首页（列出所有街道）
          └── donghuamenjiedao/
              └── index.html            # 东华门街道首页
          └── jingshanjiedao/
              └── index.html            # 景山街道首页
          └── jiaodaokoujiedao/
              └── index.html            # 交道口街道首页
      └── xichengqu/
          ├── index.html                # 西城区首页（列出所有街道）
          └── xichanganjiejiedao/
              └── index.html            # 西长安街街道首页
          └── xinjiekoujiedao/
              └── index.html            # 新街口街道首页
```

**普通省份示例（河北省石家庄市）**：
```
output/
  └── hebeisheng/
      ├── index.html                    # 河北省首页（列出所有市）
      └── shijiazhuangshi/
          ├── index.html                # 石家庄市首页（列出所有区）
          └── changanqu/
              ├── index.html            # 长安区首页（列出所有街道）
              └── jianbeijiedao/
                  └── index.html        # 建北街道首页
              └── qingyuanjiedao/
                  └── index.html        # 青园街道首页
          └── qiaoxiqu/
              ├── index.html            # 桥西区首页（列出所有街道）
              └── donglijiedao/
                  └── index.html        # 东里街道首页
```

### HTML 文件内容示例

#### 省级别/直辖市级别 HTML 示例

**直辖市示例（北京市首页 - beijingshi/index.html）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>北京市 - 行政区划</title>
</head>
<body>
<div class="province">
    <h1>北京市</h1>
    <h2>下辖区县：</h2>
    <ul>
        <li><a href="dongchengqu/index.html">东城区</a></li>
        <li><a href="xichengqu/index.html">西城区</a></li>
        <li><a href="chaoyangqu/index.html">朝阳区</a></li>
        <!-- 更多区... -->
    </ul>
</div>
</body>
</html>
```

**普通省份示例（河北省首页 - hebeisheng/index.html）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>河北省 - 行政区划</title>
</head>
<body>
<div class="province">
    <h1>河北省</h1>
    <h2>下辖城市：</h2>
    <ul>
        <li><a href="shijiazhuangshi/index.html">石家庄市</a></li>
        <li><a href="tangshanshi/index.html">唐山市</a></li>
        <!-- 更多市... -->
    </ul>
</div>
</body>
</html>
```

#### 市级别 HTML 示例

**普通省份示例（石家庄市首页 - hebeisheng/shijiazhuangshi/index.html）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>石家庄市 - 河北省</title>
</head>
<body>
<div class="city">
    <h1>石家庄市</h1>
    <p>所属省份：<a href="../index.html">河北省</a></p>
    <h2>下辖区县：</h2>
    <ul>
        <li><a href="changanqu/index.html">长安区</a></li>
        <li><a href="qiaoxiqu/index.html">桥西区</a></li>
        <!-- 更多区... -->
    </ul>
</div>
</body>
</html>
```

#### 区级别 HTML 示例

**直辖市示例（东城区首页 - beijingshi/dongchengqu/index.html）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>东城区 - 北京市</title>
</head>
<body>
<div class="district">
    <h1>东城区</h1>
    <p>所属城市：<a href="../index.html">北京市</a></p>
    <h2>下辖街道：</h2>
    <ul>
        <li><a href="donghuamenjiedao/index.html">东华门街道</a></li>
        <li><a href="jingshanjiedao/index.html">景山街道</a></li>
        <li><a href="jiaodaokoujiedao/index.html">交道口街道</a></li>
        <!-- 更多街道... -->
    </ul>
</div>
</body>
</html>
```

**普通省份示例（长安区首页 - hebeisheng/shijiazhuangshi/changanqu/index.html）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>长安区 - 石家庄市</title>
</head>
<body>
<div class="district">
    <h1>长安区</h1>
    <p>所属城市：<a href="../index.html">石家庄市</a></p>
    <p>所属省份：<a href="../../index.html">河北省</a></p>
    <h2>下辖街道：</h2>
    <ul>
        <li><a href="jianbeijiedao/index.html">建北街道</a></li>
        <li><a href="qingyuanjiedao/index.html">青园街道</a></li>
        <!-- 更多街道... -->
    </ul>
</div>
</body>
</html>
```

#### 街道级别 HTML 示例

**直辖市示例（东华门街道 - beijingshi/dongchengqu/donghuamenjiedao/index.html）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>东华门街道 - 东城区 - 北京市</title>
</head>
<body>
<div class="street">
    <h1>东华门街道</h1>
    <p>所属区县：<a href="../index.html">东城区</a></p>
    <p>所属城市：<a href="../../index.html">北京市</a></p>
    <p>所属省份：<a href="../../index.html">北京市</a></p>
</div>
</body>
</html>
```

**普通省份示例（建北街道 - hebeisheng/shijiazhuangshi/changanqu/jianbeijiedao/index.html）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>建北街道 - 长安区 - 石家庄市</title>
</head>
<body>
<div class="street">
    <h1>建北街道</h1>
    <p>所属区县：<a href="../index.html">长安区</a></p>
    <p>所属城市：<a href="../../index.html">石家庄市</a></p>
    <p>所属省份：<a href="../../../index.html">河北省</a></p>
</div>
</body>
</html>
```

**注意**：
- 对于直辖市，`{城市名称}` 和 `{省份名称}` 的值相同，都是直辖市名称
- 每个层级的 HTML 文件都应该包含导航链接，方便用户在不同层级间跳转
- `{下级列表}` 变量需要根据实际数据动态生成列表内容

## 配置选项

建议支持以下配置：
- 输出目录路径
- 模板文件路径
- 拼音风格（如：带声调、不带声调、首字母等）
- 是否生成索引文件
- 日志级别

## 后续扩展

1. **索引生成**: 生成总索引 HTML 文件，列出所有城市、区县、街道
2. **数据验证**: 验证生成的文件数量和结构
3. **增量更新**: 支持只更新变化的数据
4. **批量处理**: 支持多线程/多进程处理大量数据
5. **统计报告**: 生成处理统计报告（总数量、成功/失败数量等）

## 注意事项

1. 确保有足够的磁盘空间存储生成的 HTML 文件
2. 处理大量数据时注意内存使用
3. 考虑文件系统的路径长度限制
4. 建议先在小数据集上测试，确认逻辑正确后再处理完整数据

