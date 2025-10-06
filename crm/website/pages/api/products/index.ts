import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductResponse {
  success: boolean;
  message: string;
  data?: any;
}

// GET /api/products - 获取货品列表
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse>
) {
  try {
    if (req.method === 'GET') {
      const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      const take = Number(limit);
      
      // 构建搜索条件
      const where = search ? {
        OR: [
          { name: { contains: search as string } },
          { specification: { contains: search as string } }
        ]
      } : {};
      
      // 获取货品列表
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take,
          orderBy: {
            [sortBy as string]: sortOrder as 'asc' | 'desc'
          }
        }),
        prisma.product.count({ where })
      ]);
      
      return res.status(200).json({
        success: true,
        message: '获取货品列表成功',
        data: {
          products,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    }
    
    return res.status(405).json({
      success: false,
      message: '请求方法不允许'
    });
    
  } catch (error) {
    console.error('获取货品列表错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  } finally {
    await prisma.$disconnect();
  }
}
