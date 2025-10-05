import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// JWT密钥，实际项目中应该从环境变量获取
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface VerifyResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      username: string;
      role: string;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyResponse>
) {
  // 只允许GET请求
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: '方法不允许，请使用GET请求'
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

    // 检查会话是否仍然有效
    const session = await prisma.userSession.findFirst({
      where: {
        userId: decoded.userId,
        token: token,
        expiresAt: {
          gt: new Date() // 未过期
        }
      },
      include: {
        user: true
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: '会话已过期，请重新登录'
      });
    }

    // 返回用户信息
    return res.status(200).json({
      success: true,
      message: '令牌验证成功',
      data: {
        user: {
          id: session.user.id,
          username: session.user.username,
          role: session.user.role
        }
      }
    });

  } catch (error) {
    console.error('令牌验证错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误，请稍后重试'
    });
  } finally {
    await prisma.$disconnect();
  }
}
