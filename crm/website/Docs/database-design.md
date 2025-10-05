# **数据库设计文档 - MiniCRM 系统**

## **1. 数据库技术选型**

### **1.1 SQLite 数据库**
*   **选择理由：**
    *   轻量级，无需独立数据库服务器
    *   文件型数据库，便于部署和备份
    *   支持 SQL 标准，学习成本低
    *   适合中小型应用的数据存储需求
    *   跨平台兼容性好

### **1.2 Prisma ORM**
*   **选择理由：**
    *   **类型安全：** 自动生成 TypeScript 类型
    *   **数据库迁移：** 版本化的数据库结构管理
    *   **查询构建器：** 类型安全的数据库查询
    *   **关系管理：** 自动处理表间关系
    *   **开发体验：** Prisma Studio 提供可视化数据库管理

## **2. 数据模型设计**

### **2.1 核心数据表**

#### **2.1.1 系统用户表 (User)**
```prisma
model User {
  id        String   @id @default(cuid())
  username  String   @unique
  password  String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?
  
  // 关系
  sessions UserSession[]
  
  @@map("users")
}
```

**字段说明：**
- `id`: 系统用户唯一标识符
- `username`: 系统用户名（唯一）
- `password`: 加密后的密码
- `role`: 用户角色（ADMIN/USER）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间
- `lastLogin`: 最后登录时间

**说明：** 此表存储的是 CRM 系统的内部用户（如管理员、操作员、财务人员等），用于系统登录和权限管理，与上下游企业客户无关。系统用户不直接参与业务交易操作。

#### **2.1.2 系统用户会话表 (UserSession)**
```prisma
model UserSession {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  deviceInfo String?
  createdAt DateTime @default(now())
  
  // 关系
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("user_sessions")
}
```

**字段说明：**
- `id`: 会话唯一标识符
- `userId`: 关联系统用户ID
- `token`: 会话令牌（唯一）
- `expiresAt`: 过期时间
- `deviceInfo`: 设备信息（可选）
- `createdAt`: 创建时间

**说明：** 此表存储系统用户的登录会话信息，用于管理内部用户的登录状态。

#### **2.1.3 货品表 (Product)**
```prisma
model Product {
  id            String   @id @default(cuid())
  name          String
  specification String?
  unit          String   @default("个")
  currentStock  Int      @default(0)
  imageUrl      String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  // 关系
  transactions Transaction[]
  
  @@map("products")
}
```

**字段说明：**
- `id`: 货品唯一标识符
- `name`: 货品名称
- `specification`: 规格说明（可选）
- `unit`: 计量单位（默认：个）
- `currentStock`: 当前库存数量
- `imageUrl`: 图片URL（可选）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### **2.1.4 商家表 (Merchant)**
```prisma
model Merchant {
  id        String   @id @default(cuid())
  name      String
  contact   String?
  phone     String?
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // 关系
  transactions Transaction[]
  
  @@map("merchants")
}
```

**字段说明：**
- `id`: 商家唯一标识符
- `name`: 商家名称
- `contact`: 联系人（可选）
- `phone`: 联系电话（可选）
- `address`: 地址（可选）
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

#### **2.1.5 出入库记录表 (Transaction)**
```prisma
model Transaction {
  id          String          @id @default(cuid())
  productId   String
  merchantId  String?
  type        TransactionType
  quantity    Int
  date        DateTime        @default(now())
  notes       String?
  createdAt   DateTime        @default(now())
  
  // 关系
  product   Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  merchant  Merchant? @relation(fields: [merchantId], references: [id], onDelete: SetNull)
  
  @@map("transactions")
}
```

**字段说明：**
- `id`: 交易记录唯一标识符
- `productId`: 关联货品ID
- `merchantId`: 关联商家ID（入库时可为空）
- `type`: 交易类型（INBOUND/OUTBOUND）
- `quantity`: 数量
- `date`: 操作日期
- `notes`: 备注信息（可选）
- `createdAt`: 创建时间

### **2.2 枚举类型**

#### **2.2.1 用户角色 (UserRole)**
```prisma
enum UserRole {
  ADMIN  // 管理员
  USER   // 普通用户
}
```

#### **2.2.2 交易类型 (TransactionType)**
```prisma
enum TransactionType {
  INBOUND   // 入库
  OUTBOUND  // 出库
}
```

## **3. 数据库关系设计**

### **3.1 关系图**
```
SystemUser (1) ──── (N) UserSession
Product (1) ──── (N) Transaction
Merchant (1) ──── (N) Transaction
```

### **3.2 关系说明**
- **系统用户与会话：** 一对多关系，一个系统用户可以有多个登录会话
- **货品与交易：** 一对多关系，一个货品可以有多个交易记录
- **商家与交易：** 一对多关系，一个商家可以有多个交易记录（入库时可为空）

**重要说明：** 
- `User` 表存储的是 CRM 系统的内部用户（管理员、操作员等），仅用于系统登录和权限管理
- `Merchant` 表存储的是上下游企业客户信息
- `Transaction` 表记录货品的出入库操作，不直接关联系统用户
- 商家是货品的接收方（出库时）或供应商（入库时）

### **3.3 级联删除策略**
- **系统用户删除：** 级联删除相关会话
- **货品删除：** 级联删除相关交易记录
- **商家删除：** 设置交易记录中的商家ID为空（SetNull）

## **4. 数据库配置**

### **4.1 开发环境配置**

#### **4.1.1 Prisma 初始化**
```bash
# 安装 Prisma
npm install prisma @prisma/client

# 初始化 Prisma
npx prisma init

# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 打开 Prisma Studio
npx prisma studio
```

#### **4.1.2 环境变量配置**
```env
# .env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### **4.2 生产环境配置**

#### **4.2.1 数据库连接配置**
```env
# 生产环境
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="production-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

#### **4.2.2 性能优化配置**
```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["metrics"]
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

## **5. 数据迁移管理**

### **5.1 迁移工作流**
```bash
# 创建新的迁移
npx prisma migrate dev --name add_new_feature

# 应用迁移到生产环境
npx prisma migrate deploy

# 重置数据库（仅开发环境）
npx prisma migrate reset
```

### **5.2 数据种子**
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建默认系统管理员用户
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  })

  // 创建示例系统操作员用户
  const operatorPassword = await bcrypt.hash('operator123', 10)
  
  await prisma.user.create({
    data: {
      username: 'operator',
      password: operatorPassword,
      role: 'USER'
    }
  })

  // 创建示例货品
  await prisma.product.createMany({
    data: [
      {
        name: '苹果',
        specification: '红富士',
        unit: '箱',
        currentStock: 100
      },
      {
        name: '香蕉',
        specification: '进口',
        unit: '箱',
        currentStock: 50
      }
    ]
  })

  // 创建示例商家
  await prisma.merchant.createMany({
    data: [
      {
        name: '超市A',
        contact: '张三',
        phone: '13800138000',
        address: '北京市朝阳区'
      },
      {
        name: '超市B',
        contact: '李四',
        phone: '13900139000',
        address: '上海市浦东区'
      }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

## **6. 数据库特性**

### **6.1 数据完整性**
- **外键约束：** 确保数据引用完整性
- **唯一约束：** 防止重复数据
- **非空约束：** 确保关键字段不为空
- **默认值：** 为字段设置合理的默认值

### **6.2 性能优化**
- **索引策略：** 为常用查询字段建立索引
- **查询优化：** 使用 Prisma 查询优化功能
- **连接池：** 配置适当的数据库连接池
- **分页查询：** 大数据量查询使用分页

### **6.3 安全特性**
- **密码加密：** 使用 bcrypt 加密用户密码
- **会话管理：** 安全的用户会话管理
- **数据验证：** 输入数据验证和清理
- **权限控制：** 基于角色的访问控制

## **7. 监控与维护**

### **7.1 数据库监控**
- **性能监控：** 监控查询性能和响应时间
- **存储监控：** 监控数据库文件大小增长
- **错误日志：** 记录数据库操作错误
- **连接监控：** 监控数据库连接状态

### **7.2 维护任务**
- **定期清理：** 清理过期的系统用户会话
- **数据归档：** 归档历史交易数据
- **索引维护：** 定期重建数据库索引
- **备份恢复：** 定期备份和测试恢复

### **7.3 备份策略**
- **自动备份：** 每日自动备份 SQLite 数据库文件
- **版本控制：** 使用 Git 管理数据库迁移文件
- **恢复机制：** 提供数据库恢复脚本
- **异地备份：** 重要数据异地备份

---

**文档版本：** v1.0  
**创建日期：** 2025年10月5日  
**最后更新：** 2025年10月5日  
**维护人员：** 开发团队
