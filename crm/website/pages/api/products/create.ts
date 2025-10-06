import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductResponse {
  success: boolean;
  message: string;
  data?: any;
}

// POST /api/products/create - 创建新货品
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: '请求方法不允许'
    });
  }
  
  try {
    const { name, specification, unit, currentStock, imageUrl } = req.body;
    
    // 验证必填字段
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '货品名称不能为空'
      });
    }
    
    // 检查货品名称是否已存在
    const existingProduct = await prisma.product.findFirst({
      where: { name }
    });
    
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: '货品名称已存在'
      });
    }
    
    // 创建新货品
    const newProduct = await prisma.product.create({
      data: {
        name,
        specification,
        unit: unit || '个',
        currentStock: currentStock || 0,
        imageUrl
      }
    });
    
    return res.status(201).json({
      success: true,
      message: '创建货品成功',
      data: newProduct
    });
    
  } catch (error) {
    console.error('创建货品错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  } finally {
    await prisma.$disconnect();
  }
}
