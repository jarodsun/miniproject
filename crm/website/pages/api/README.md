# 用户认证API文档

## 概述

本API提供用户登录、登出和身份验证功能，使用JWT令牌进行身份认证。

## API端点

### 1. 用户登录

**端点:** `POST /api/auth/login`

**请求体:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "user_id",
      "username": "admin",
      "role": "ADMIN"
    },
    "token": "jwt_token_here"
  }
}
```

**错误响应:**
- `400`: 用户名或密码为空
- `401`: 用户名或密码错误
- `405`: 请求方法不允许
- `500`: 服务器内部错误

### 2. 用户登出

**端点:** `POST /api/auth/logout`

**请求头:**
```
Authorization: Bearer <jwt_token>
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "登出成功"
}
```

**错误响应:**
- `401`: 未提供有效的认证令牌
- `405`: 请求方法不允许
- `500`: 服务器内部错误

### 3. 令牌验证

**端点:** `GET /api/auth/verify`

**请求头:**
```
Authorization: Bearer <jwt_token>
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "令牌验证成功",
  "data": {
    "user": {
      "id": "user_id",
      "username": "admin",
      "role": "ADMIN"
    }
  }
}
```

**错误响应:**
- `401`: 未提供有效的认证令牌或令牌已过期
- `405`: 请求方法不允许
- `500`: 服务器内部错误

## 使用示例

### JavaScript/TypeScript

```javascript
// 登录
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const loginData = await loginResponse.json();
if (loginData.success) {
  const token = loginData.data.token;
  // 保存token到localStorage或状态管理
  localStorage.setItem('token', token);
}

// 验证令牌
const verifyResponse = await fetch('/api/auth/verify', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const verifyData = await verifyResponse.json();
if (verifyData.success) {
  console.log('用户信息:', verifyData.data.user);
}

// 登出
const logoutResponse = await fetch('/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### cURL示例

```bash
# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 验证令牌
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer <your_jwt_token>"

# 登出
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <your_jwt_token>"
```

## 安全说明

1. **密码加密**: 使用bcryptjs对密码进行哈希加密存储
2. **JWT令牌**: 使用JWT进行身份认证，令牌有效期为24小时
3. **会话管理**: 每次登录都会创建新的会话记录
4. **令牌验证**: 验证令牌时会检查会话是否仍然有效

## 环境变量配置

确保在`.env.local`文件中配置以下环境变量：

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

## 数据库初始化

运行以下命令初始化数据库：

```bash
# 生成Prisma客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# 运行种子数据
npx prisma db seed
```
## 默认用户账号

- **管理员**: `admin` / `admin123`
- **操作员**: `operator` / `operator123`

---

## 基础信息管理模块 API

### 货品管理 (Products)

#### 1. 获取货品列表
**端点:** `GET /api/products`

**查询参数:**
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `search` (可选): 搜索关键词（货品名称或规格）
- `sortBy` (可选): 排序字段，默认 createdAt
- `sortOrder` (可选): 排序方向，asc/desc，默认 desc

**响应示例:**
```json
{
  "success": true,
  "message": "获取货品列表成功",
  "data": {
    "products": [
      {
        "id": "product_id",
        "name": "苹果",
        "specification": "红富士",
        "unit": "箱",
        "currentStock": 100,
        "imageUrl": null,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

#### 2. 创建货品
**端点:** `POST /api/products/create`

**请求体:**
```json
{
  "name": "苹果",
  "specification": "红富士",
  "unit": "箱",
  "currentStock": 100,
  "imageUrl": "https://example.com/image.jpg"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "创建货品成功",
  "data": {
    "id": "product_id",
    "name": "苹果",
    "specification": "红富士",
    "unit": "箱",
    "currentStock": 100,
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. 获取货品详情
**端点:** `GET /api/products/[id]`

**响应示例:**
```json
{
  "success": true,
  "message": "获取货品详情成功",
  "data": {
    "id": "product_id",
    "name": "苹果",
    "specification": "红富士",
    "unit": "箱",
    "currentStock": 100,
    "imageUrl": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "transactions": [
      {
        "id": "transaction_id",
        "type": "OUTBOUND",
        "quantity": 10,
        "date": "2024-01-01T00:00:00.000Z",
        "notes": "销售记录"
      }
    ]
  }
}
```

#### 4. 更新货品
**端点:** `PUT /api/products/[id]`

**请求体:**
```json
{
  "name": "苹果",
  "specification": "红富士",
  "unit": "箱",
  "currentStock": 120,
  "imageUrl": "https://example.com/new-image.jpg"
}
```

#### 5. 删除货品
**端点:** `DELETE /api/products/[id]`

**响应示例:**
```json
{
  "success": true,
  "message": "删除货品成功"
}
```

### 商家管理 (Merchants)

#### 1. 获取商家列表
**端点:** `GET /api/merchants`

**查询参数:**
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `search` (可选): 搜索关键词（商家名称、联系人或电话）
- `sortBy` (可选): 排序字段，默认 createdAt
- `sortOrder` (可选): 排序方向，asc/desc，默认 desc

**响应示例:**
```json
{
  "success": true,
  "message": "获取商家列表成功",
  "data": {
    "merchants": [
      {
        "id": "merchant_id",
        "name": "超市A",
        "contact": "张三",
        "phone": "13800138000",
        "address": "北京市朝阳区",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 20,
      "pages": 2
    }
  }
}
```

#### 2. 创建商家
**端点:** `POST /api/merchants/create`

**请求体:**
```json
{
  "name": "超市A",
  "contact": "张三",
  "phone": "13800138000",
  "address": "北京市朝阳区"
}
```

#### 3. 获取商家详情
**端点:** `GET /api/merchants/[id]`

**响应示例:**
```json
{
  "success": true,
  "message": "获取商家详情成功",
  "data": {
    "id": "merchant_id",
    "name": "超市A",
    "contact": "张三",
    "phone": "13800138000",
    "address": "北京市朝阳区",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "transactions": [
      {
        "id": "transaction_id",
        "type": "OUTBOUND",
        "quantity": 10,
        "date": "2024-01-01T00:00:00.000Z",
        "notes": "销售记录",
        "product": {
          "id": "product_id",
          "name": "苹果",
          "specification": "红富士"
        }
      }
    ]
  }
}
```

#### 4. 更新商家
**端点:** `PUT /api/merchants/[id]`

**请求体:**
```json
{
  "name": "超市A",
  "contact": "李四",
  "phone": "13900139000",
  "address": "上海市浦东区"
}
```

#### 5. 删除商家
**端点:** `DELETE /api/merchants/[id]`

**响应示例:**
```json
{
  "success": true,
  "message": "删除商家成功"
}
```

## 错误响应格式

所有 API 在出错时都会返回以下格式：

```json
{
  "success": false,
  "message": "错误描述"
}
```

## 状态码说明

- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `404`: 资源不存在
- `405`: 请求方法不允许
- `500`: 服务器内部错误

## 使用示例

### JavaScript/TypeScript

```javascript
// 用户认证
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const loginData = await loginResponse.json();
if (loginData.success) {
  const token = loginData.data.token;
  localStorage.setItem('token', token);
}

// 货品管理
const productsResponse = await fetch('/api/products?page=1&limit=10&search=苹果');
const productsData = await productsResponse.json();

const createProductResponse = await fetch('/api/products/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '苹果',
    specification: '红富士',
    unit: '箱',
    currentStock: 100
  })
});

// 商家管理
const merchantsResponse = await fetch('/api/merchants?page=1&limit=10');
const merchantsData = await merchantsResponse.json();

const createMerchantResponse = await fetch('/api/merchants/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '超市A',
    contact: '张三',
    phone: '13800138000',
    address: '北京市朝阳区'
  })
});
```

### cURL 示例

```bash
# 用户认证
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 货品管理
curl -X GET "http://localhost:3000/api/products?page=1&limit=10"
curl -X POST http://localhost:3000/api/products/create \
  -H "Content-Type: application/json" \
  -d '{"name":"苹果","specification":"红富士","unit":"箱","currentStock":100}'

# 商家管理
curl -X GET "http://localhost:3000/api/merchants?page=1&limit=10"
curl -X POST http://localhost:3000/api/merchants/create \
  -H "Content-Type: application/json" \
  -d '{"name":"超市A","contact":"张三","phone":"13800138000","address":"北京市朝阳区"}'
```

---

## 库存管理模块 API

### 出入库管理 (Inventory Management)

#### 1. 入库操作
**端点:** `POST /api/inventory/stock-in`

**请求头:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**请求体:**
```json
{
  "productId": "product_id",
  "quantity": 100,
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "采购入库"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "入库成功",
  "data": {
    "id": "transaction_id",
    "product": {
      "id": "product_id",
      "name": "苹果",
      "specification": "红富士",
      "unit": "箱"
    },
    "type": "INBOUND",
    "quantity": 100,
    "date": "2024-01-01T00:00:00.000Z",
    "notes": "采购入库",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. 出库操作
**端点:** `POST /api/inventory/stock-out`

**请求头:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**请求体:**
```json
{
  "productId": "product_id",
  "merchantId": "merchant_id",
  "quantity": 50,
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "销售出库"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "出库成功",
  "data": {
    "id": "transaction_id",
    "product": {
      "id": "product_id",
      "name": "苹果",
      "specification": "红富士",
      "unit": "箱"
    },
    "merchant": {
      "id": "merchant_id",
      "name": "超市A",
      "contact": "张三",
      "phone": "13800138000"
    },
    "type": "OUTBOUND",
    "quantity": 50,
    "date": "2024-01-01T00:00:00.000Z",
    "notes": "销售出库",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3. 库存流水查询
**端点:** `GET /api/inventory/transactions`

**请求头:**
```
Authorization: Bearer <jwt_token>
```

**查询参数:**
- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `search` (可选): 搜索关键词（货品名称、规格、商家名称、备注）
- `productId` (可选): 货品ID筛选
- `merchantId` (可选): 商家ID筛选
- `type` (可选): 类型筛选，INBOUND/OUTBOUND
- `startDate` (可选): 开始日期筛选
- `endDate` (可选): 结束日期筛选
- `sortBy` (可选): 排序字段，date/quantity/createdAt，默认 date
- `sortOrder` (可选): 排序方向，asc/desc，默认 desc

**响应示例:**
```json
{
  "success": true,
  "message": "获取库存流水成功",
  "data": {
    "transactions": [
      {
        "id": "transaction_id",
        "product": {
          "id": "product_id",
          "name": "苹果",
          "specification": "红富士",
          "unit": "箱"
        },
        "merchant": {
          "id": "merchant_id",
          "name": "超市A",
          "contact": "张三",
          "phone": "13800138000"
        },
        "type": "OUTBOUND",
        "quantity": 50,
        "date": "2024-01-01T00:00:00.000Z",
        "notes": "销售出库",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    },
    "statistics": {
      "inboundTotal": 1000,
      "outboundTotal": 800,
      "netChange": 200
    }
  }
}
```

#### 4. 批量入库
**端点:** `POST /api/inventory/batch-stock-in`

**请求头:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**请求体:**
```json
{
  "items": [
    {
      "productId": "product_id_1",
      "quantity": 100,
      "notes": "采购入库"
    },
    {
      "productId": "product_id_2",
      "quantity": 50,
      "notes": "采购入库"
    }
  ],
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "批量采购入库"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "批量入库成功，共处理 2 个货品",
  "data": {
    "transactions": [
      {
        "id": "transaction_id_1",
        "product": {
          "id": "product_id_1",
          "name": "苹果",
          "specification": "红富士",
          "unit": "箱"
        },
        "type": "INBOUND",
        "quantity": 100,
        "date": "2024-01-01T00:00:00.000Z",
        "notes": "采购入库",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "summary": {
      "totalItems": 2,
      "totalQuantity": 150
    }
  }
}
```

#### 5. 批量出库
**端点:** `POST /api/inventory/batch-stock-out`

**请求头:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**请求体:**
```json
{
  "merchantId": "merchant_id",
  "items": [
    {
      "productId": "product_id_1",
      "quantity": 50,
      "notes": "销售出库"
    },
    {
      "productId": "product_id_2",
      "quantity": 30,
      "notes": "销售出库"
    }
  ],
  "date": "2024-01-01T00:00:00.000Z",
  "notes": "批量销售出库"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "批量出库成功，共处理 2 个货品",
  "data": {
    "transactions": [
      {
        "id": "transaction_id_1",
        "product": {
          "id": "product_id_1",
          "name": "苹果",
          "specification": "红富士",
          "unit": "箱"
        },
        "merchant": {
          "id": "merchant_id",
          "name": "超市A",
          "contact": "张三",
          "phone": "13800138000"
        },
        "type": "OUTBOUND",
        "quantity": 50,
        "date": "2024-01-01T00:00:00.000Z",
        "notes": "销售出库",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "summary": {
      "totalItems": 2,
      "totalQuantity": 80,
      "merchant": "超市A"
    }
  }
}
```

## 库存管理API使用示例

### JavaScript/TypeScript

```javascript
// 入库操作
const stockInResponse = await fetch('/api/inventory/stock-in', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId: 'product_id',
    quantity: 100,
    date: new Date().toISOString(),
    notes: '采购入库'
  })
});

// 出库操作
const stockOutResponse = await fetch('/api/inventory/stock-out', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId: 'product_id',
    merchantId: 'merchant_id',
    quantity: 50,
    date: new Date().toISOString(),
    notes: '销售出库'
  })
});

// 查询库存流水
const transactionsResponse = await fetch('/api/inventory/transactions?page=1&limit=10&type=INBOUND', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 批量入库
const batchStockInResponse = await fetch('/api/inventory/batch-stock-in', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    items: [
      { productId: 'product_id_1', quantity: 100 },
      { productId: 'product_id_2', quantity: 50 }
    ],
    date: new Date().toISOString(),
    notes: '批量采购入库'
  })
});

// 批量出库
const batchStockOutResponse = await fetch('/api/inventory/batch-stock-out', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    merchantId: 'merchant_id',
    items: [
      { productId: 'product_id_1', quantity: 50 },
      { productId: 'product_id_2', quantity: 30 }
    ],
    date: new Date().toISOString(),
    notes: '批量销售出库'
  })
});
```

### cURL 示例

```bash
# 入库操作
curl -X POST http://localhost:3000/api/inventory/stock-in \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"product_id","quantity":100,"notes":"采购入库"}'

# 出库操作
curl -X POST http://localhost:3000/api/inventory/stock-out \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"productId":"product_id","merchantId":"merchant_id","quantity":50,"notes":"销售出库"}'

# 查询库存流水
curl -X GET "http://localhost:3000/api/inventory/transactions?page=1&limit=10" \
  -H "Authorization: Bearer <your_jwt_token>"

# 批量入库
curl -X POST http://localhost:3000/api/inventory/batch-stock-in \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"product_id_1","quantity":100}],"notes":"批量采购"}'

# 批量出库
curl -X POST http://localhost:3000/api/inventory/batch-stock-out \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"merchantId":"merchant_id","items":[{"productId":"product_id_1","quantity":50}],"notes":"批量销售"}'
```

## 库存管理API错误处理

### 常见错误响应

#### 库存不足错误
```json
{
  "success": false,
  "message": "库存不足",
  "details": [
    {
      "productName": "苹果",
      "currentStock": 30,
      "requiredQuantity": 50
    }
  ]
}
```

#### 批量操作部分失败
```json
{
  "success": false,
  "message": "以下货品不存在: product_id_1, product_id_2"
}
```

#### 库存检查失败
```json
{
  "success": false,
  "message": "库存不足，当前库存：30，需要出库：50"
}
```

## 库存管理API特性

### 1. 事务安全
- 所有库存操作都使用数据库事务确保数据一致性
- 批量操作要么全部成功，要么全部回滚

### 2. 库存检查
- 出库前自动检查库存是否充足
- 防止超量出库导致负库存

### 3. 实时更新
- 每次出入库操作都会实时更新货品库存
- 确保库存数据的准确性

### 4. 灵活查询
- 支持多维度筛选和排序
- 提供统计信息（入库总量、出库总量、净变化）

### 5. 批量操作
- 支持批量入库和出库
- 提高操作效率，减少重复操作

## 销售分析与预测模块 API

### 1. 采购趋势分析 API

#### GET /api/sales-analysis/trend
获取指定商家的年度采购趋势分析数据。

**请求参数：**
- `merchantId` (query): 商家ID

**请求示例：**
```bash
GET /api/sales-analysis/trend?merchantId=merchant_123
```

**响应示例：**
```json
{
  "success": true,
  "merchant": "示例商家",
  "trendData": [
    {
      "month": "1月",
      "totalQuantity": 150,
      "isHighVolume": false
    },
    {
      "month": "2月",
      "totalQuantity": 300,
      "isHighVolume": true
    }
  ],
  "summary": {
    "totalQuantity": 1800,
    "averageQuantity": 150,
    "highVolumeMonths": 3
  }
}
```

### 2. 库存预警系统 API

#### GET /api/sales-analysis/inventory-alert
获取库存预警数据，包括低库存货品和采购建议。

**请求示例：**
```bash
GET /api/sales-analysis/inventory-alert
```

**响应示例：**
```json
{
  "success": true,
  "products": [
    {
      "id": "product_123",
      "name": "示例货品",
      "specification": "规格A",
      "unit": "件",
      "currentStock": 5,
      "alertThreshold": 20,
      "averageMonthlySales": 15,
      "recommendedPurchase": 35,
      "alertLevel": "low"
    }
  ],
  "summary": {
    "totalProducts": 50,
    "lowStockProducts": 8,
    "criticalStockProducts": 2,
    "averageStockLevel": 45,
    "totalRecommendedPurchase": 280
  }
}
```

### 3. 销售分析API特性

#### 3.1 智能预警算法
- 基于历史销售数据计算月均销量
- 动态调整预警阈值
- 提供个性化采购建议

#### 3.2 趋势分析功能
- 识别采购高峰期
- 分析季节性采购规律
- 预测未来采购需求

#### 3.3 多维度统计
- 按商家维度分析采购趋势
- 按货品维度分析库存状况
- 提供综合统计报告

