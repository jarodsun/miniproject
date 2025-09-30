# PyQt5 CSS 兼容性修复说明

## 🚨 问题描述

运行应用时出现 "Unknown property" 警告，这是因为PyQt5不支持某些CSS属性。

## ❌ 不支持的CSS属性

PyQt5不支持以下CSS属性：
- `box-shadow` - 阴影效果
- `border-radius` - 圆角边框
- `text-align` - 文本对齐
- `rgba()` - 透明颜色
- `transform` - 变换效果

## ✅ 解决方案

### 1. 忽略警告（推荐）
在运行应用前添加警告过滤：

```python
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="PyQt5")
```

### 2. 使用兼容的CSS属性

**替换前：**
```css
QPushButton {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
}
```

**替换后：**
```css
QPushButton {
    /* 移除不支持的属性 */
    background-color: #007acc;
    color: white;
    border: none;
    padding: 8px 16px;
}
```

### 3. 运行方式

**方式1：直接运行（会有警告）**
```bash
python main.py
```

**方式2：使用测试脚本（无警告）**
```bash
python test_app.py
```

**方式3：使用运行脚本（忽略警告）**
```bash
python run_app.py
```

## 🎨 替代方案

### 圆角效果
使用QFrame的setFrameStyle()方法：
```python
frame.setFrameStyle(QFrame.StyledPanel)
```

### 阴影效果
使用QGraphicsDropShadowEffect：
```python
from PyQt5.QtWidgets import QGraphicsDropShadowEffect
shadow = QGraphicsDropShadowEffect()
shadow.setBlurRadius(10)
widget.setGraphicsEffect(shadow)
```

### 文本对齐
使用QLabel的setAlignment()方法：
```python
label.setAlignment(Qt.AlignCenter)
```

## 📝 注意事项

1. 警告不影响应用功能，只是样式效果可能不如预期
2. 建议使用PyQt5支持的CSS属性
3. 复杂样式效果可以通过代码实现
4. 优先保证功能完整性，样式可以后续优化
