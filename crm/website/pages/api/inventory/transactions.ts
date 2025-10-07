import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
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

    // 获取查询参数
    const {
      page = '1',
      limit = '10',
      search = '',
      productId = '',
      merchantId = '',
      type = '',
      startDate = '',
      endDate = '',
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // 构建查询条件
    const where: any = {};

    // 搜索条件
    if (search) {
      where.OR = [
        {
          product: {
            name: {
              contains: search as string
            }
          }
        },
        {
          product: {
            specification: {
              contains: search as string
            }
          }
        },
        {
          merchant: {
            name: {
              contains: search as string
            }
          }
        },
        {
          notes: {
            contains: search as string
          }
        }
      ];
    }

    // 货品筛选
    if (productId) {
      where.productId = productId;
    }

    // 商家筛选
    if (merchantId) {
      where.merchantId = merchantId;
    }

    // 类型筛选
    if (type && (type === 'INBOUND' || type === 'OUTBOUND')) {
      where.type = type;
    }

    // 日期范围筛选
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.date.lte = new Date(endDate as string);
      }
    }

    // 排序条件
    const orderBy: any = {};
    if (sortBy === 'date') {
      orderBy.date = sortOrder === 'asc' ? 'asc' : 'desc';
    } else if (sortBy === 'quantity') {
      orderBy.quantity = sortOrder === 'asc' ? 'asc' : 'desc';
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.date = 'desc';
    }

    // 查询数据
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              specification: true,
              unit: true
            }
          },
          merchant: {
            select: {
              id: true,
              name: true,
              contact: true,
              phone: true
            }
          }
        }
      }),
      prisma.transaction.count({ where })
    ]);

    // 计算统计信息
    const stats = await prisma.transaction.groupBy({
      by: ['type'],
      where,
      _sum: {
        quantity: true
      }
    });

    const inboundTotal = stats.find(s => s.type === 'INBOUND')?._sum.quantity || 0;
    const outboundTotal = stats.find(s => s.type === 'OUTBOUND')?._sum.quantity || 0;

    return res.status(200).json({
      success: true,
      message: '获取库存流水成功',
      data: {
        transactions: transactions.map(transaction => ({
          id: transaction.id,
          product: transaction.product,
          merchant: transaction.merchant,
          type: transaction.type,
          quantity: transaction.quantity,
          date: transaction.date,
          notes: transaction.notes,
          createdAt: transaction.createdAt
        })),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        statistics: {
          inboundTotal,
          outboundTotal,
          netChange: inboundTotal - outboundTotal
        }
      }
    });

  } catch (error) {
    console.error('获取库存流水失败:', error);
    return res.status(500).json({ 
      success: false, 
      message: '服务器内部错误' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
