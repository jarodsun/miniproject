# 销售分析统计卡片主题修复

## 问题描述

在销售分析模块中，统计信息区域的4个卡片（总采购量、平均月采购、最高月采购、采购高峰月）在深色主题下没有变化，仍然显示为浅色主题样式。

## 问题分析

### 根本原因
1. **硬编码样式**: `create_stat_card` 方法中有硬编码的浅色主题样式
2. **样式覆盖**: 卡片创建时设置的样式覆盖了后续的主题应用
3. **缺少主题响应**: 统计卡片没有响应主题切换事件

### 具体问题
```python
# 原来的代码有硬编码样式
card.setStyleSheet(f"""
    QWidget {{
        background-color: white;  # 硬编码浅色背景
        border: 1px solid #ddd;  # 硬编码浅色边框
        border-radius: 8px;
        padding: 15px;
    }}
""")

title_label.setStyleSheet("color: #666;")  # 硬编码浅色文字
```

## 解决方案

### 1. 移除硬编码样式
修改 `create_stat_card` 方法，移除硬编码的浅色主题样式：

```python
def create_stat_card(self, title, value, unit, color):
    card = QWidget()
    card.setObjectName("stat_card")  # 设置对象名称用于样式选择
    # 只设置基本样式，主题样式将在主题应用中设置
    card.setStyleSheet("""
        QWidget {
            border-radius: 8px;
            padding: 15px;
        }
    """)
```

### 2. 添加主题响应方法
为分析模块添加 `apply_stat_cards_theme` 方法，专门处理统计卡片的主题应用：

```python
def apply_stat_cards_theme(self):
    """为统计卡片应用主题样式"""
    stat_cards = self.findChildren(QWidget, "stat_card")
    
    # 获取当前主题
    current_theme = self.get_current_theme()
    
    for card in stat_cards:
        if current_theme == "dark":
            # 深色主题样式
            card.setStyleSheet("""
                QWidget {
                    background-color: #2d2d2d;
                    border: 1px solid #404040;
                    border-radius: 8px;
                    padding: 15px;
                }
                QWidget:hover {
                    border-color: #007bff;
                    background-color: #404040;
                }
                QLabel {
                    color: #ffffff;
                }
            """)
        else:
            # 浅色主题样式
            card.setStyleSheet("""
                QWidget {
                    background-color: white;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 15px;
                }
                QWidget:hover {
                    border-color: #007bff;
                    background-color: #f8f9fa;
                }
                QLabel {
                    color: #333333;
                }
            """)
```

### 3. 集成到主题系统
在主窗口的 `update_modules_theme` 方法中添加统计卡片的主题更新：

```python
if hasattr(self, 'analysis_module'):
    self.analysis_module.setStyleSheet(styles["content"])
    # 为分析模块的统计卡片应用主题
    if hasattr(self.analysis_module, 'apply_stat_cards_theme'):
        self.analysis_module.apply_stat_cards_theme()
```

### 4. 初始主题应用
在 `apply_initial_theme` 方法中调用统计卡片主题应用：

```python
def apply_initial_theme(self):
    # ... 其他主题应用代码
    # 为统计卡片应用特殊样式
    self.apply_stat_cards_theme()
```

## 修改的文件

### analysis_module.py
- 修改 `create_stat_card` 方法，移除硬编码样式
- 添加 `apply_stat_cards_theme` 方法
- 在 `apply_initial_theme` 中调用统计卡片主题应用

### main_window.py
- 在 `update_modules_theme` 方法中添加统计卡片主题更新

## 技术要点

### 对象名称选择器
使用 `setObjectName("stat_card")` 和 `findChildren(QWidget, "stat_card")` 来精确定位统计卡片组件。

### 主题检测
通过 `ThemeManager` 获取当前主题状态，动态应用相应的样式。

### 样式优先级
确保主题样式能够正确覆盖初始样式，避免硬编码样式的干扰。

## 测试验证

### 测试步骤
1. 启动应用程序
2. 导航到销售分析页面
3. 检查统计信息区域的4个卡片是否显示深色主题
4. 测试主题切换功能，确保卡片能正确响应主题变化

### 预期结果
- 深色主题下：卡片背景为深色，文字为浅色
- 浅色主题下：卡片背景为浅色，文字为深色
- 主题切换时：卡片样式能正确更新

## 总结

通过移除硬编码样式、添加主题响应方法和集成到主题系统，成功解决了销售分析模块中统计卡片的主题应用问题。现在统计卡片能够正确响应深色/浅色主题切换。

