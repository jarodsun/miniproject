import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT密钥，实际项目中应该从环境变量获取
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface LogoutResponse {
  success: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: '方法不允许，请使用POST请求'
    });
  }

  try {
    // 从请求头获取Authorization token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未提供有效的认证令牌'
      });
    }

    const token = authHeader.substring(7); // 移除 "Bearer " 前缀

    // 验证JWT令牌
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as any;
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '无效的认证令牌'
      });
    }

    // 删除用户会话记录
    await prisma.userSession.deleteMany({
      where: {
        userId: decoded.userId,
        token: token
      }
    });

    return res.status(200).json({
      success: true,
      message: '登出成功'
    });

  } catch (error) {
    console.error('登出错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误，请稍后重试'
    });
  } finally {
    await prisma.$disconnect();
  }
}
