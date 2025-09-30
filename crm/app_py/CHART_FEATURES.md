# 销售分析图表功能

## 功能概述

为销售分析模块添加了12个月采购趋势折线图功能，支持matplotlib图表和文本备选方案。

## 主要功能

### 📊 12个月折线图
- **横轴**: 12个月份（1月-12月）
- **纵轴**: 采购数量（箱）
- **数据源**: 基于商家和年份的模拟数据
- **图表类型**: 折线图，带数据点标记

### 🎯 图表特性
- 显示12个月的采购趋势
- 高亮显示最高采购月份
- 网格线和数据标签
- 响应式图表大小
- 支持主题切换

### 📈 数据生成
- 根据商家类型生成不同的采购模式
- 添加随机变化模拟真实数据
- 支持不同年份的数据分析

## 技术实现

### 1. 双重方案支持
```python
# 尝试导入matplotlib，如果失败则使用备选方案
try:
    import matplotlib.pyplot as plt
    from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
    MATPLOTLIB_AVAILABLE = True
except ImportError:
    MATPLOTLIB_AVAILABLE = False
```

### 2. 图表组件初始化
```python
def create_chart_area(self, parent_layout):
    if MATPLOTLIB_AVAILABLE:
        # 创建matplotlib图表
        self.figure = Figure(figsize=(12, 6), dpi=100)
        self.canvas = FigureCanvas(self.figure)
    else:
        # 备选方案：使用QLabel显示图表信息
        self.chart_label = QLabel("📈 图表区域...")
```

### 3. 折线图生成
```python
def create_line_chart(self, merchant, year, monthly_data):
    if MATPLOTLIB_AVAILABLE:
        # 创建matplotlib折线图
        ax.plot(months, values, marker='o', linewidth=2, markersize=6)
        # 设置图表样式、网格、标签等
    else:
        # 备选方案：显示文本格式的图表数据
        self.show_text_chart(merchant, year, monthly_data)
```

### 4. 文本图表备选方案
```python
def show_text_chart(self, merchant, year, monthly_data):
    chart_text = f"""
📊 {merchant} - {year}年12个月采购趋势

📈 月度采购数据：
"""
    for month, value in monthly_data.items():
        bar = "█" * (value // 10)  # 每10箱用一个方块表示
        chart_text += f"{month:>3}: {value:>3}箱 {bar}\n"
```

## 数据生成逻辑

### 商家数据模式
```python
base_values = {
    "超市A": [120, 95, 180, 160, 140, 110, 130, 150, 125, 135, 145, 100],
    "超市B": [80, 70, 140, 120, 100, 90, 110, 130, 105, 115, 125, 85],
    "超市C": [100, 85, 160, 140, 120, 100, 120, 140, 115, 125, 135, 95],
    "便利店D": [60, 50, 100, 80, 70, 60, 80, 90, 75, 85, 95, 65],
    "商场E": [150, 120, 200, 180, 160, 130, 150, 170, 145, 155, 165, 125]
}
```

### 随机变化
```python
for i, month in enumerate(month_names):
    variation = random.randint(-20, 20)
    monthly_data[month] = max(0, base_data[i] + variation)
```

## 主题支持

### 深色主题
- 图表背景：深色
- 文字颜色：白色
- 边框颜色：深灰色

### 浅色主题
- 图表背景：浅色
- 文字颜色：深色
- 边框颜色：浅灰色

## 使用方法

### 1. 选择分析条件
- 选择商家（超市A、超市B、超市C、便利店D、商场E）
- 选择年份（2024、2023、2022）

### 2. 生成分析报告
- 点击"生成分析报告"按钮
- 系统自动生成12个月采购数据
- 显示折线图和统计信息

### 3. 查看结果
- **图表区域**: 显示12个月采购趋势折线图
- **统计信息**: 显示4个统计卡片
- **数据详情**: 显示具体数值和趋势分析

## 统计信息

### 统计卡片
1. **总采购量**: 12个月采购总量
2. **平均月采购**: 月度平均采购量
3. **最高月采购**: 单月最高采购量
4. **采购高峰月**: 采购量最高的月份

### 图表特性
- 折线图显示趋势变化
- 数据点标记具体数值
- 高亮显示最高点
- 网格线辅助读数
- 标题和轴标签

## 备选方案

当matplotlib不可用时，系统会自动切换到文本图表模式：

### 文本图表特性
- 使用ASCII字符绘制简单条形图
- 显示详细的月度数据
- 包含统计信息和趋势分析
- 支持主题切换

### 示例输出
```
📊 超市A - 2024年12个月采购趋势

📈 月度采购数据：
  1: 120箱 ████████████
  2:  95箱 █████████
  3: 180箱 ████████████████████
  ...
```

## 扩展性

### 数据源扩展
- 可以连接真实数据库
- 支持更多商家类型
- 添加更多年份数据

### 图表类型扩展
- 柱状图
- 饼图
- 散点图
- 多系列对比图

### 分析功能扩展
- 季节性分析
- 趋势预测
- 异常检测
- 对比分析

## 总结

通过双重方案设计，确保在任何环境下都能正常显示图表功能。matplotlib可用时显示专业图表，不可用时显示文本图表，保证功能的完整性和可用性。

