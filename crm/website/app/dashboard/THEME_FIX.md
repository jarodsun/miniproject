# 主题背景修复说明

## 问题描述

在深色主题下，控制面板页面的背景显示为白色，而不是预期的深色渐变背景。

## 问题原因

之前的实现使用了 `theme.palette.mode === 'dark'` 来检测主题，但这种方式在某些情况下不够可靠，特别是在主题切换的过渡期间。

## 解决方案

### 修复前（问题代码）
```tsx
backgroundImage: (theme) =>
  theme.palette.mode === 'dark'
    ? 'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
    : 'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
```

### 修复后（正确代码）
```tsx
backgroundImage:
  'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
backgroundRepeat: 'no-repeat',
...(theme) => theme.applyStyles('dark', {
  backgroundImage:
    'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
}),
```

## 技术说明

### 使用 `theme.applyStyles()` 的优势

1. **更可靠的主题检测**：Material-UI 的 `applyStyles` 方法能更准确地检测当前主题状态
2. **与首页一致**：使用与首页相同的主题检测方式
3. **更好的性能**：避免在每次渲染时进行主题检测
4. **CSS 变量支持**：更好地支持 Material-UI 的 CSS 变量系统

### 实现原理

- **默认样式**：设置浅色模式的背景为默认值
- **深色覆盖**：使用 `theme.applyStyles('dark', {...})` 在深色模式下覆盖背景
- **自动切换**：Material-UI 会自动处理主题切换时的样式更新

## 修复范围

已修复所有Dashboard页面的背景样式：
- ✅ 控制面板主页面 (`/dashboard/page.tsx`)
- ✅ 货品管理页面 (`/dashboard/products/page.tsx`)
- ✅ 商家管理页面 (`/dashboard/merchants/page.tsx`)

## 验证方法

1. 切换到深色主题
2. 检查页面背景是否为深色渐变
3. 切换到浅色主题
4. 检查页面背景是否为浅色渐变
5. 测试主题切换的平滑过渡

## 注意事项

- 确保所有Dashboard页面使用相同的背景样式实现
- 保持与首页的背景样式一致
- 测试不同浏览器的兼容性
