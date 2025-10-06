import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MerchantResponse {
  success: boolean;
  message: string;
  data?: any;
}

// GET /api/merchants/[id] - 获取单个商家
// PUT /api/merchants/[id] - 更新商家
// DELETE /api/merchants/[id] - 删除商家
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MerchantResponse>
) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: '商家ID无效'
    });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        const merchant = await prisma.merchant.findUnique({
          where: { id },
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10,
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    specification: true
                  }
                }
              }
            }
          }
        });
        
        if (!merchant) {
          return res.status(404).json({
            success: false,
            message: '商家不存在'
          });
        }
        
        return res.status(200).json({
          success: true,
          message: '获取商家详情成功',
          data: merchant
        });
        
      case 'PUT':
        const { name, contact, phone, address } = req.body;
        
        if (!name) {
          return res.status(400).json({
            success: false,
            message: '商家名称不能为空'
          });
        }
        
        const updatedMerchant = await prisma.merchant.update({
          where: { id },
          data: {
            name,
            contact,
            phone,
            address
          }
        });
        
        return res.status(200).json({
          success: true,
          message: '更新商家成功',
          data: updatedMerchant
        });
        
      case 'DELETE':
        // 检查是否有相关交易记录
        const transactionCount = await prisma.transaction.count({
          where: { merchantId: id }
        });
        
        if (transactionCount > 0) {
          return res.status(400).json({
            success: false,
            message: '该商家存在交易记录，无法删除'
          });
        }
        
        await prisma.merchant.delete({
          where: { id }
        });
        
        return res.status(200).json({
          success: true,
          message: '删除商家成功'
        });
        
      default:
        return res.status(405).json({
          success: false,
          message: '请求方法不允许'
        });
    }
    
  } catch (error) {
    console.error('商家操作错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  } finally {
    await prisma.$disconnect();
  }
}
