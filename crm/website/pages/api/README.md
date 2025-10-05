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
