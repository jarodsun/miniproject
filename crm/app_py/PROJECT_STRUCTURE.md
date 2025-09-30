# CRM 项目结构说明

## 📁 项目文件结构

```
crm/app_py/
├── main.py                    # 主程序入口
├── main_window.py            # 主窗口类
├── modules/                  # 功能模块
│   ├── products_module.py    # 货品管理模块
│   ├── merchants_module.py   # 商家管理模块
│   ├── inventory_module.py   # 出入库管理模块
│   └── analysis_module.py    # 销售分析模块
├── components/               # 通用组件
│   └── dashboard.py          # 首页仪表盘组件
├── dialogs/                  # 对话框组件
│   ├── product_dialog.py     # 货品添加/编辑对话框
│   └── merchant_dialog.py    # 商家添加/编辑对话框
├── build.bat                 # 标准打包脚本
├── build_minimal.bat         # 最小体积打包脚本
├── MiniCRM.spec             # PyInstaller配置文件
├── requirements.txt         # 依赖包列表
├── .gitignore              # Git忽略文件
└── README.md               # 项目说明
```

## 🎯 功能模块说明

### 1. 主窗口 (main_window.py)
- 创建应用主界面
- 左侧导航栏
- 右侧内容区域
- 页面切换逻辑

### 2. 货品管理 (products_module.py)
- 货品列表展示
- 搜索和过滤功能
- 添加/编辑/删除货品
- 库存管理

### 3. 商家管理 (merchants_module.py)
- 商家列表展示
- 搜索和过滤功能
- 添加/编辑/删除商家
- 联系人信息管理

### 4. 出入库管理 (inventory_module.py)
- 出入库操作表单
- 记录查询功能
- 库存变动记录
- 数据统计

### 5. 销售分析 (analysis_module.py)
- 商家采购趋势分析
- 年度/月度统计
- 图表展示（占位符）
- 数据分析报告

### 6. 首页仪表盘 (dashboard.py)
- 系统概览
- 功能导航卡片
- 欢迎界面

### 7. 对话框组件
- **product_dialog.py**: 货品添加/编辑对话框
- **merchant_dialog.py**: 商家添加/编辑对话框

## 🚀 运行方式

### 开发模式
```bash
python main.py
```

### 打包为exe
```bash
# 标准打包
build.bat

# 最小体积打包
build_minimal.bat
```

## 📋 功能特性

### ✅ 已实现功能
- [x] 主界面导航
- [x] 货品管理界面
- [x] 商家管理界面
- [x] 出入库管理界面
- [x] 销售分析界面
- [x] 添加货品对话框
- [x] 添加商家对话框
- [x] 搜索和过滤功能
- [x] 表格数据展示
- [x] 响应式界面设计

### 🔄 待实现功能
- [ ] 数据库集成
- [ ] 数据持久化
- [ ] 图表组件集成
- [ ] 数据导入/导出
- [ ] 用户权限管理
- [ ] 系统设置

## 🎨 界面设计

- **现代化UI**: 使用Material Design风格
- **响应式布局**: 适配不同屏幕尺寸
- **直观导航**: 左侧导航栏，右侧内容区
- **数据表格**: 支持搜索、排序、分页
- **表单验证**: 输入验证和错误提示
- **状态反馈**: 操作成功/失败提示

## 🔧 技术栈

- **GUI框架**: PyQt5
- **打包工具**: PyInstaller
- **界面设计**: Material Design风格
- **数据展示**: QTableWidget
- **对话框**: QDialog
- **布局管理**: QVBoxLayout, QHBoxLayout
