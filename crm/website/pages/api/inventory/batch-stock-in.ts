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

    const { items, date, notes } = req.body;

    // 验证必填字段
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '入库项目列表不能为空' 
      });
    }

    // 验证每个入库项目
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: '每个入库项目必须包含有效的货品ID和数量' 
        });
      }
    }

    // 检查所有货品是否存在
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== productIds.length) {
      const foundIds = products.map(p => p.id);
      const missingIds = productIds.filter(id => !foundIds.includes(id));
      return res.status(404).json({ 
        success: false, 
        message: `以下货品不存在: ${missingIds.join(', ')}` 
      });
    }

    // 使用事务处理批量入库
    const result = await prisma.$transaction(async (tx) => {
      const transactions = [];
      const stockUpdates = [];

      // 创建入库记录
      for (const item of items) {
        const transaction = await tx.transaction.create({
          data: {
            productId: item.productId,
            type: 'INBOUND',
            quantity: item.quantity,
            date: date ? new Date(date) : new Date(),
            notes: notes || item.notes || null
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
        transactions.push(transaction);

        // 准备库存更新
        stockUpdates.push({
          where: { id: item.productId },
          data: {
            currentStock: {
              increment: item.quantity
            }
          }
        });
      }

      // 批量更新库存
      for (const update of stockUpdates) {
        await tx.product.update(update);
      }

      return transactions;
    });

    return res.status(201).json({
      success: true,
      message: `批量入库成功，共处理 ${result.length} 个货品`,
      data: {
        transactions: result.map(transaction => ({
          id: transaction.id,
          product: transaction.product,
          type: transaction.type,
          quantity: transaction.quantity,
          date: transaction.date,
          notes: transaction.notes,
          createdAt: transaction.createdAt
        })),
        summary: {
          totalItems: result.length,
          totalQuantity: result.reduce((sum, t) => sum + t.quantity, 0)
        }
      }
    });

  } catch (error) {
    console.error('批量入库操作失败:', error);
    return res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
