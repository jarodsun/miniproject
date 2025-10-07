import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MerchantResponse {
  success: boolean;
  message: string;
  data?: any;
}

// GET /api/merchants - 获取商家列表
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MerchantResponse>
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
          { contact: { contains: search as string } },
          { phone: { contains: search as string } }
        ]
      } : {};
      
      // 获取商家列表
      const [merchants, total] = await Promise.all([
        prisma.merchant.findMany({
          where,
          skip,
          take,
          orderBy: {
            [sortBy as string]: sortOrder as 'asc' | 'desc'
          }
        }),
        prisma.merchant.count({ where })
      ]);
      
      return res.status(200).json({
        success: true,
        message: '获取商家列表成功',
        data: {
          merchants,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      });
    }
    
    if (req.method === 'POST') {
      const { name, contact, phone, address } = req.body;
      
      // 验证必填字段
      if (!name) {
        return res.status(400).json({
          success: false,
          message: '商家名称不能为空'
        });
      }
      
      // 检查商家名称是否已存在
      const existingMerchant = await prisma.merchant.findFirst({
        where: { name }
      });
      
      if (existingMerchant) {
        return res.status(400).json({
          success: false,
          message: '商家名称已存在'
        });
      }
      
      // 创建新商家
      const newMerchant = await prisma.merchant.create({
        data: {
          name,
          contact,
          phone,
          address
        }
      });
      
      return res.status(201).json({
        success: true,
        message: '创建商家成功',
        data: newMerchant
      });
    }
    
    return res.status(405).json({
      success: false,
      message: '请求方法不允许'
    });
    
  } catch (error) {
    console.error('获取商家列表错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  } finally {
    await prisma.$disconnect();
  }
}
