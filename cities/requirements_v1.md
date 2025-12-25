# 城市数据 HTML 生成系统需求说明 v1.0

## 项目概述

基于 `pcas.json` 文件中的中国城市、区县、街道数据，按照拼音建立文件夹结构，并直接生成对应的 HTML 文件。

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

- 使用中文转拼音库（如 `pypinyin`）将中文名称转换为拼音
- 拼音格式：全小写，去除空格和特殊字符
- 处理多音字：使用默认读音或根据上下文选择

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

### 4. HTML 内容生成规则

直接使用 `pcas.json` 中的数据生成 HTML，不使用模板系统。HTML 结构如下：

#### 4.1 省级别/直辖市级别 HTML

**直辖市示例（北京市首页）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>北京市 - 行政区划</title>
</head>
<body>
    <div class="municipality">
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

**普通省份示例（河北省首页）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

#### 4.2 市级别 HTML

**普通省份示例（石家庄市首页）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

#### 4.3 区级别 HTML

**直辖市示例（东城区首页）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

**普通省份示例（长安区首页）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

#### 4.4 街道级别 HTML

**直辖市示例（东华门街道）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>东华门街道 - 东城区 - 北京市</title>
</head>
<body>
    <div class="street">
        <h1>东华门街道</h1>
        <p>所属区县：<a href="../index.html">东城区</a></p>
        <p>所属城市：<a href="../../index.html">北京市</a></p>
    </div>
</body>
</html>
```

**普通省份示例（建北街道）**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

**HTML 生成规则说明**：
- 所有 HTML 文件都包含标准的 HTML5 结构
- `<head>` 部分包含基本的 meta 标签和 title
- `<body>` 部分根据层级显示相应的内容：
  - 省级别/直辖市级别：显示下级市/区列表
  - 市级别：显示所属省份链接和下级区列表
  - 区级别：显示所属城市/省份链接和下级街道列表
  - 街道级别：显示所属区县/城市/省份链接
- 每个层级都包含导航链接，方便在不同层级间跳转
- 链接路径使用相对路径（`../` 表示上一级目录）

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
   - 根据层级和数据结构直接生成 HTML 内容
   - 生成导航链接（相对路径）
   - 写入到对应路径

## 技术实现要求

### 依赖库
- `json`: 解析 JSON 数据
- `pypinyin`: 中文转拼音
- `os` / `pathlib`: 文件系统操作

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
4. HTML 内容：在生成 HTML 时，直辖市的情况：
   - 直辖市级别页面：显示所有区列表
   - 区级别页面：显示所属城市为直辖市名称，链接指向 `../index.html`
   - 街道级别页面：显示所属城市为直辖市名称，链接指向 `../../index.html`

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
        # 生成 HTML 内容
        ...
else:
    # 普通省份，遍历城市
    for city_name, districts in province_data.items():
        # 生成路径：{省拼音}/{市拼音}/{区拼音}/{街道拼音}/index.html
        # 生成 HTML 内容
        ...
```

### 2. 同名处理
- 如果存在同名的街道（不同区县），需要确保文件路径唯一
- 建议在文件名中包含区县信息，或使用序号区分

### 3. 特殊字符处理
- 处理拼音转换中的特殊字符
- 处理文件系统不支持的字符（如 `/`, `\`, `:` 等）

### 4. 错误处理
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

## 配置选项

建议支持以下配置：
- 输出目录路径
- 拼音风格（如：带声调、不带声调、首字母等）
- 是否生成索引文件
- 日志级别

## 后续扩展

1. **索引生成**: 生成总索引 HTML 文件，列出所有城市、区县、街道
2. **数据验证**: 验证生成的文件数量和结构
3. **增量更新**: 支持只更新变化的数据
4. **批量处理**: 支持多线程/多进程处理大量数据
5. **统计报告**: 生成处理统计报告（总数量、成功/失败数量等）
6. **模板系统**: 支持使用模板文件生成 HTML（v2.0 功能）

## 注意事项

1. 确保有足够的磁盘空间存储生成的 HTML 文件
2. 处理大量数据时注意内存使用
3. 考虑文件系统的路径长度限制
4. 建议先在小数据集上测试，确认逻辑正确后再处理完整数据
5. HTML 内容直接硬编码在代码中，不使用外部模板文件

