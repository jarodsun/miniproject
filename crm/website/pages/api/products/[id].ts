import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductResponse {
  success: boolean;
  message: string;
  data?: any;
}

// GET /api/products/[id] - 获取单个货品
// PUT /api/products/[id] - 更新货品
// DELETE /api/products/[id] - 删除货品
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse>
) {
  const { id } = req.query;
  
  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      message: '货品ID无效'
    });
  }
  
  try {
    switch (req.method) {
      case 'GET':
        const product = await prisma.product.findUnique({
          where: { id },
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        });
        
        if (!product) {
          return res.status(404).json({
            success: false,
            message: '货品不存在'
          });
        }
        
        return res.status(200).json({
          success: true,
          message: '获取货品详情成功',
          data: product
        });
        
      case 'PUT':
        const { name, specification, unit, currentStock, imageUrl } = req.body;
        
        if (!name) {
          return res.status(400).json({
            success: false,
            message: '货品名称不能为空'
          });
        }
        
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            name,
            specification,
            unit: unit || '个',
            currentStock: currentStock || 0,
            imageUrl
          }
        });
        
        return res.status(200).json({
          success: true,
          message: '更新货品成功',
          data: updatedProduct
        });
        
      case 'DELETE':
        // 检查是否有相关交易记录
        const transactionCount = await prisma.transaction.count({
          where: { productId: id }
        });
        
        if (transactionCount > 0) {
          return res.status(400).json({
            success: false,
            message: '该货品存在交易记录，无法删除'
          });
        }
        
        await prisma.product.delete({
          where: { id }
        });
        
        return res.status(200).json({
          success: true,
          message: '删除货品成功'
        });
        
      default:
        return res.status(405).json({
          success: false,
          message: '请求方法不允许'
        });
    }
    
  } catch (error) {
    console.error('货品操作错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  } finally {
    await prisma.$disconnect();
  }
}
