import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MerchantResponse {
  success: boolean;
  message: string;
  data?: any;
}

// POST /api/merchants/create - 创建新商家
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MerchantResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: '请求方法不允许'
    });
  }
  
  try {
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
    
  } catch (error) {
    console.error('创建商家错误:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  } finally {
    await prisma.$disconnect();
  }
}
