import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '请求方法不允许' });
  }

  try {
    // 验证JWT令牌
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '未提供认证令牌' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: '无效的认证令牌' });
    }

    const { productId, quantity, date, notes } = req.body;

    // 验证必填字段
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: '货品ID和数量为必填项，且数量必须大于0' 
      });
    }

    // 检查货品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: '货品不存在' 
      });
    }

    // 创建入库记录
    const transaction = await prisma.transaction.create({
      data: {
        productId,
        type: 'INBOUND',
        quantity,
        date: date ? new Date(date) : new Date(),
        notes: notes || null
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            specification: true,
            unit: true
          }
        }
      }
    });

    // 更新货品库存
    await prisma.product.update({
      where: { id: productId },
      data: {
        currentStock: {
          increment: quantity
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: '入库成功',
      data: {
        id: transaction.id,
        product: transaction.product,
        type: transaction.type,
        quantity: transaction.quantity,
        date: transaction.date,
        notes: transaction.notes,
        createdAt: transaction.createdAt
      }
    });

  } catch (error) {
    console.error('入库操作失败:', error);
    return res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
