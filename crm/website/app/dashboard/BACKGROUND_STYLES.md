# Dashboard 背景样式说明

## 背景设计

控制面板系统现在使用与首页一致的背景样式，提供统一的视觉体验。

## 样式实现

### 浅色模式背景
```css
radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))
```
- 从中心向外的径向渐变
- 浅蓝色到白色的过渡
- 适合日间使用

### 深色模式背景
```css
radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))
```
- 从中心向外的径向渐变
- 深蓝色到深灰色的过渡
- 适合夜间使用

## 技术实现

### CSS 伪元素方法
```tsx
sx={{
  minHeight: '100vh',
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage: (theme) =>
      theme.palette.mode === 'dark'
        ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
        : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
  },
}}
```

### 优势
1. **性能优化**：使用伪元素避免额外的DOM节点
2. **主题响应**：根据当前主题自动切换背景
3. **视觉一致性**：与首页保持相同的背景样式
4. **响应式设计**：适配不同屏幕尺寸

## 应用范围

所有Dashboard页面都使用相同的背景样式：
- 控制面板主页面 (`/dashboard/page.tsx`)
- 货品管理页面 (`/dashboard/products/page.tsx`)
- 商家管理页面 (`/dashboard/merchants/page.tsx`)

## 视觉效果

### 浅色模式
- 清新的浅蓝色渐变
- 提供良好的对比度
- 适合长时间使用

### 深色模式
- 优雅的深色渐变
- 减少眼部疲劳
- 现代感十足

## 维护说明

如需修改背景样式，请同时更新所有Dashboard页面以保持一致性。
