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

