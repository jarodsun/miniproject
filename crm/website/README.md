# @website/ - MiniCRM Web 应用

基于 Next.js 15 + Material-UI 的现代化 CRM 管理系统前端应用。

## 📁 项目结构说明

### 🏗️ 根目录文件
```
website/
├── package.json          # 项目依赖和脚本配置
├── next.config.ts        # Next.js 配置文件
├── tsconfig.json         # TypeScript 配置
├── eslint.config.mjs     # ESLint 代码规范配置
├── postcss.config.mjs   # PostCSS 配置
├── .gitignore           # Git 忽略文件配置
└── README.md            # 项目说明文档
```

### 📱 App Router 结构 (`app/`)
```
app/
├── layout.tsx            # 根布局组件
├── page.tsx              # 首页（登录页面）
├── globals.css           # 全局样式
├── favicon.ico           # 网站图标
│
├── components/           # 全局共享组件
│   ├── CustomIcons.tsx   # 自定义图标组件
│   └── ForgotPassword.tsx # 忘记密码组件
│
├── shared-theme/         # 共享主题系统
│   ├── AppTheme.tsx      # 主题提供者组件
│   ├── themePrimitives.ts # 主题基础配置
│   ├── ColorModeIconDropdown.tsx # 颜色模式切换
│   ├── ColorModeSelect.tsx # 颜色模式选择器
│   └── customizations/   # 主题自定义配置
│       ├── dataDisplay.tsx    # 数据展示组件样式
│       ├── feedback.tsx       # 反馈组件样式
│       ├── inputs.tsx         # 输入组件样式
│       ├── navigation.tsx    # 导航组件样式
│       └── surfaces.ts        # 表面组件样式
│
└── dashboard/            # 仪表板模块
    ├── page.tsx          # 仪表板主页面
    ├── components/       # 仪表板专用组件
    │   ├── AppNavbar.tsx         # 应用导航栏
    │   ├── SideMenu.tsx          # 侧边菜单
    │   ├── SideMenuMobile.tsx    # 移动端侧边菜单
    │   ├── Header.tsx            # 页面头部
    │   ├── MainGrid.tsx          # 主网格布局
    │   ├── StatCard.tsx          # 统计卡片
    │   ├── ChartUserByCountry.tsx # 用户国家图表
    │   ├── CustomDatePicker.tsx  # 自定义日期选择器
    │   ├── CustomizedDataGrid.tsx # 自定义数据网格
    │   ├── CustomizedTreeView.tsx # 自定义树形视图
    │   └── ... (其他组件)
    │
    ├── internals/        # 内部组件和数据
    │   ├── components/   # 内部组件
    │   │   ├── Copyright.tsx     # 版权信息
    │   │   └── CustomIcons.tsx  # 自定义图标
    │   └── data/        # 数据文件
    │       └── gridData.tsx      # 网格数据
    │
    └── theme/           # 仪表板主题配置
        └── customizations/
            ├── charts.ts        # 图表主题
            ├── dataGrid.js      # 数据网格主题
            ├── datePickers.ts   # 日期选择器主题
            ├── treeView.ts      # 树形视图主题
            └── index.ts         # 主题导出
```

## 🚀 技术栈

### 核心框架
- **Next.js 15.5.4** - React 全栈框架，使用 App Router
- **React 19.1.0** - 用户界面库
- **TypeScript 5** - 类型安全的 JavaScript

### UI 组件库
- **Material-UI v7.3.4** - Google Material Design 组件库
- **@mui/x-charts** - 图表组件
- **@mui/x-data-grid** - 数据网格组件
- **@mui/x-date-pickers** - 日期选择器组件
- **@mui/x-tree-view** - 树形视图组件

### 样式和主题
- **Emotion** - CSS-in-JS 样式库
- **Tailwind CSS 4** - 实用优先的 CSS 框架
- **自定义主题系统** - 基于 Material-UI 的主题定制

### 开发工具
- **ESLint** - 代码质量检查
- **PostCSS** - CSS 后处理器
- **Turbopack** - 快速构建工具

## 🎯 功能模块

### 1. 认证系统
- 登录页面 (`app/page.tsx`)
- 忘记密码功能
- 主题切换支持

### 2. 仪表板系统
- 响应式布局设计
- 侧边导航菜单
- 数据可视化图表
- 统计卡片展示
- 自定义数据网格

### 3. 主题系统
- 明暗主题切换
- 自定义 Material-UI 组件样式
- 响应式设计支持
- 统一的视觉语言

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 📦 依赖说明

### 生产依赖
- **@emotion/react & @emotion/styled** - CSS-in-JS 样式解决方案
- **@mui/material & @mui/icons-material** - Material-UI 核心组件
- **@mui/x-*** - Material-UI 扩展组件
- **@react-spring/web** - 动画库
- **dayjs** - 轻量级日期处理库

### 开发依赖
- **@types/node, @types/react, @types/react-dom** - TypeScript 类型定义
- **eslint & eslint-config-next** - 代码规范检查
- **tailwindcss** - CSS 框架

## 🎨 设计特色

1. **现代化设计** - 基于 Material Design 3.0
2. **响应式布局** - 支持桌面端和移动端
3. **主题定制** - 完整的明暗主题支持
4. **组件化架构** - 高度可复用的组件系统
5. **类型安全** - 完整的 TypeScript 支持

## 🔧 配置说明

- **Next.js 配置** - 使用 Turbopack 加速构建
- **TypeScript 配置** - 严格的类型检查
- **ESLint 配置** - Next.js 推荐的代码规范
- **PostCSS 配置** - Tailwind CSS 集成

## 📝 开发规范

1. 使用 TypeScript 进行类型安全开发
2. 遵循 Material-UI 设计规范
3. 组件采用函数式编程
4. 使用 Emotion 进行样式管理
5. 遵循 Next.js App Router 最佳实践

---

> 这是一个基于 Next.js 15 和 Material-UI 的现代化 CRM 管理系统前端应用，具有完整的主题系统、响应式设计和组件化架构。