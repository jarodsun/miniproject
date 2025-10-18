# DronePilot - 飞手招募小程序

## 项目概述

DronePilot 是一个专为持证飞手设计的注册和管理平台，旨在建立一个专业的飞手资源库，为无人机服务提供商和飞手之间搭建桥梁。

## 项目需求

### 前端-小程序

#### TabBar设计
微信小程序底部导航栏，包含三个Tab：
1. **首页** - 项目介绍和飞手招募
2. **项目** - 项目相关内容和注册功能
3. **我的** - 个人信息和客服功能

#### 首页Tab
1. **项目介绍**
   - 通过项目，引导飞手注册
   - 希望从公众号拉取现成的文章内容
   - 除了注册按钮，还要有客服按钮，方便飞手咨询
2. **飞手招募**
   - 内容要吸引飞手，同时引导飞手进行注册
3. **联系我们**
   - 放置联系客服的按钮，点开可以直接跟客服聊天

#### 项目Tab
1. **项目详情**
   - 展示项目相关信息
   - 引导飞手了解项目价值
2. **注册入口**
   - 醒目的注册按钮
   - 跳转到注册页面

#### 我的Tab
1. **飞手个人信息页**
   - 飞手注册成功后，可以登录，查看是否审核通过
     - 审核中，只能查看信息
     - 审核通过，只能查看信息
     - 审核不通过，可以重新上传电子执照
2. **联系客服**
   - 提供联系客服的入口

#### 注册页面
1. **姓名**
2. **电话**
3. **所在地区**
4. **自我介绍**
5. **电子执照照片**

提交注册，跳转到个人信息页面。

#### 客服功能
- 微信小程序可以直接绑定个人微信为客服
- （可选）创建一个企业微信，用企业微信的账号作为客服号

### 前端-管理后台

#### 后台首页
1. **展示飞手总数**
2. **查看飞手列表**

#### 飞手列表页
1. **展示注册飞手信息**
2. **审核**

### 后端-API（服务端）
1. **根据前端及后台的功能，提供相应的API接口**
2. **数据持久化**

### 3. 系统要求

#### 技术规范
- **微信小程序端**：
  - **TabBar设计**：首页、项目、我的三个底部导航
  - **移动端优先**：专为手机端设计的用户体验
  - **微信生态集成**：利用微信登录、客服等功能
  - **小程序规范**：遵循微信小程序开发规范
- **管理后台**：
  - **PC端设计**：Dashboard管理页面采用PC端样式
  - **响应式适配**：支持不同屏幕尺寸
- **数据安全**：用户信息加密存储，数据库保护
- **性能要求**：小程序页面加载时间 < 2秒
- **文件上传**：支持图片压缩和格式验证，适配小程序环境

## 业务流程

### 飞手注册流程
1. 访问 DronePilot 网站
2. 点击"立即注册"按钮
3. 填写基本信息（姓名、电话、所在地区、自我介绍）
4. 上传电子执照照片
5. 确认信息无误后提交
6. 系统自动保存注册信息
7. 跳转到个人信息页面
8. 查看是否审核通过
9. 审核通过，可以查看信息
10. 审核不通过，可以重新上传电子执照
11. 联系客服

### 后台管理流程
1. 管理员登录后台系统
2. 查看飞手注册列表
3. 审核飞手信息
4. 筛选和搜索特定飞手信息
5. 导出数据用于商务洽谈
6. 统计飞手数量用于对外宣传

## 项目结构

```
drone-pilot/
├── wx/                    # 微信小程序端 (TypeScript)
│   ├── miniprogram/       # 小程序源码目录
│   │   ├── app.ts         # 小程序入口文件
│   │   ├── app.json       # 小程序配置文件
│   │   ├── app.wxss       # 全局样式文件
│   │   ├── sitemap.json   # 站点地图配置
│   │   ├── components/    # 小程序组件
│   │   │   └── navigation-bar/ # 导航栏组件
│   │   ├── pages/         # 小程序页面
│   │   │   ├── index/     # 首页Tab
│   │   │   └── logs/      # 日志页面
│   │   └── utils/         # 工具函数
│   ├── typings/           # TypeScript类型定义
│   │   ├── index.d.ts     # 全局类型定义
│   │   └── types/         # 详细类型定义
│   │       └── wx/        # 微信API类型定义
│   ├── package.json       # 依赖管理
│   ├── tsconfig.json       # TypeScript配置
│   ├── project.config.json # 小程序项目配置
│   └── project.private.config.json # 私有配置
├── backend/               # 后端服务和管理后台
│   ├── app/               # Next.js App Router (管理后台前端)
│   │   ├── dashboard/     # 仪表板页面 (PC端样式)
│   │   ├── globals.css    # 全局样式
│   │   ├── layout.tsx     # 根布局
│   │   └── page.tsx       # 后台首页
│   ├── pages/            # Next.js Pages Router (后端API)
│   │   ├── api/           # API路由
│   │   │   ├── auth/      # 认证API
│   │   │   ├── pilots/    # 飞手API
│   │   │   └── upload/    # 文件上传API
│   │   └── admin/         # 后台管理页面
│   ├── components/        # 共享组件
│   │   ├── ui/            # MUI基础组件
│   │   ├── forms/         # 表单组件
│   │   └── desktop/       # PC端专用组件
│   ├── lib/               # 工具库
│   │   ├── prisma.ts      # Prisma客户端
│   │   ├── jwt.ts         # JWT认证工具
│   │   └── utils.ts       # 工具函数
│   ├── prisma/            # 数据库相关
│   │   ├── schema.prisma  # 数据模型
│   │   └── migrations/    # 数据库迁移
│   ├── public/            # 静态资源
│   │   ├── images/        # 图片资源
│   │   └── uploads/       # 上传文件存储
│   ├── types/             # TypeScript类型定义
│   ├── package.json       # 依赖管理
│   ├── next.config.js     # Next.js配置
│   └── ecosystem.config.js # PM2配置文件
└── Docs/                  # 项目文档
    └── requirements.md    # 需求文档
```

## 数据模型

### 飞手信息表 (Pilots)
```prisma
model Pilot {
  id            String   @id @default(cuid())
  name          String   @db.VarChar(100)
  phone         String   @unique @db.VarChar(20)
  region        String   @db.VarChar(100) // 所在地区
  introduction  String?  @db.Text
  licenseImages String[] // 执照照片路径数组
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("pilots")
}
```

### 管理员表 (Admin)
```prisma
model Admin {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String   // 加密存储
  createdAt DateTime @default(now())
  
  @@map("admins")
}
```

## 开发计划

### 第一阶段：项目搭建
- [ ] Next.js 15 项目初始化
- [ ] Prisma + SQLite3 数据库配置
- [ ] Material-UI 组件库配置
- [ ] 移动端基础布局组件
- [ ] 首页两屏设计实现（飞手注册介绍 + 联系方式）

### 第二阶段：飞手注册功能
- [ ] 移动端飞手注册页面
- [ ] 表单验证和提交
- [ ] 图片上传和压缩
- [ ] 数据存储和API

### 第三阶段：后台管理
- [ ] JWT管理员认证系统
- [ ] PC端Dashboard管理界面
- [ ] 飞手信息管理页面
- [ ] 数据导出功能

### 第四阶段：优化完善
- [ ] 移动端性能优化
- [ ] 图片压缩和本地存储优化
- [ ] 服务器部署和Nginx配置
- [ ] 用户体验优化

## 技术栈

### 前端

#### 微信小程序端
- **微信小程序原生开发** - 使用微信小程序原生框架
- **TabBar导航** - 首页、项目、我的三个底部导航
- **微信生态集成** - 微信登录、微信客服、微信支付
- **小程序UI组件** - 使用微信小程序原生组件库
- **移动端优化** - 专为手机端设计的用户体验

#### 管理后台（Web端）
- **Next.js 15** - React 框架
- **App Router** - 前端路由模式
- **Material-UI (MUI)** - UI组件库
- **PC端设计** - Dashboard管理页面采用PC端样式
- **MUI Responsive Design** - 响应式设计系统

### 后端
- **Next.js Pages Router** - 后端API路由
- **SQLite3** - 轻量级数据库
- **Prisma ORM** - 数据库操作
- **JWT** - 简单身份验证
- **bcryptjs** - 密码加密
- **Multer** - 文件上传处理

### 部署
- **自建服务器** - 部署到自己的服务器
- **Nginx** - 反向代理和静态文件服务
- **PM2** - Node.js进程管理
- **本地文件存储** - 图片和文档存储在服务器本地

---

最后更新时间：2025年10月18日
创建时间：2025年10月17日

