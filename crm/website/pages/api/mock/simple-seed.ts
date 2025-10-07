import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('开始创建Mock数据...');

    // 步骤1: 清空现有数据
    console.log('清空现有数据...');
    await prisma.transaction.deleteMany();
    await prisma.product.deleteMany();
    await prisma.merchant.deleteMany();

    // 步骤2: 创建商家
    console.log('创建商家...');
    const merchant1 = await prisma.merchant.create({
      data: {
        name: '北京科技有限公司',
        contact: '张经理',
        phone: '13800138001',
        address: '北京市朝阳区科技园区',
      },
    });

    const merchant2 = await prisma.merchant.create({
      data: {
        name: '上海贸易有限公司',
        contact: '李总',
        phone: '13900139002',
        address: '上海市浦东新区贸易大厦',
      },
    });

    const merchant3 = await prisma.merchant.create({
      data: {
        name: '广州电子科技',
        contact: '王主任',
        phone: '13700137003',
        address: '广州市天河区电子城',
      },
    });

    const merchant4 = await prisma.merchant.create({
      data: {
        name: '深圳创新企业',
        contact: '陈总监',
        phone: '13600136004',
        address: '深圳市南山区创新园',
      },
    });

    const merchant5 = await prisma.merchant.create({
      data: {
        name: '杭州互联网公司',
        contact: '刘经理',
        phone: '13500135005',
        address: '杭州市西湖区互联网小镇',
      },
    });

    const merchants = [merchant1, merchant2, merchant3, merchant4, merchant5];
    console.log(`创建了 ${merchants.length} 个商家`);

    // 步骤3: 创建货品
    console.log('创建货品...');
    const product1 = await prisma.product.create({
      data: {
        name: '笔记本电脑',
        specification: '15.6英寸',
        unit: '台',
        currentStock: 50,
        imageUrl: null,
      },
    });

    const product2 = await prisma.product.create({
      data: {
        name: '无线鼠标',
        specification: '2.4G无线',
        unit: '个',
        currentStock: 200,
        imageUrl: null,
      },
    });

    const product3 = await prisma.product.create({
      data: {
        name: '机械键盘',
        specification: '青轴',
        unit: '个',
        currentStock: 80,
        imageUrl: null,
      },
    });

    const product4 = await prisma.product.create({
      data: {
        name: '显示器',
        specification: '27英寸4K',
        unit: '台',
        currentStock: 30,
        imageUrl: null,
      },
    });

    const product5 = await prisma.product.create({
      data: {
        name: '耳机',
        specification: '蓝牙降噪',
        unit: '个',
        currentStock: 150,
        imageUrl: null,
      },
    });

    const products = [product1, product2, product3, product4, product5];
    console.log(`创建了 ${products.length} 个货品`);

    // 步骤4: 创建简单的交易记录
    console.log('创建交易记录...');
    const transactions = [];
    const currentDate = new Date();

    // 为每个商家创建3个月的简单记录
    for (let i = 0; i < merchants.length; i++) {
      const merchant = merchants[i];
      
      for (let monthOffset = 2; monthOffset >= 0; monthOffset--) {
        const transactionDate = new Date(currentDate);
        transactionDate.setMonth(transactionDate.getMonth() - monthOffset);
        
        // 每个商家每月采购2个货品
        const selectedProducts = products.slice(0, 2);
        
        for (const product of selectedProducts) {
          const quantity = 20; // 固定数量，避免库存问题
          
          const transaction = await prisma.transaction.create({
            data: {
              productId: product.id,
              merchantId: merchant.id,
              type: 'OUTBOUND',
              quantity: quantity,
              notes: `商家采购 - ${merchant.name}`,
              date: transactionDate,
            },
          });

          // 更新库存
          await prisma.product.update({
            where: { id: product.id },
            data: {
              currentStock: {
                decrement: quantity,
              },
            },
          });

          transactions.push(transaction);
        }
      }
    }

    console.log(`创建了 ${transactions.length} 条交易记录`);

    res.status(200).json({
      success: true,
      message: 'Mock数据创建成功',
      data: {
        merchants: merchants.length,
        products: products.length,
        transactions: transactions.length,
      },
    });

  } catch (error) {
    console.error('创建Mock数据失败:', error);
    console.error('错误详情:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    res.status(500).json({
      success: false,
      message: '创建Mock数据失败',
      error: error instanceof Error ? error.message : '未知错误',
      details: error instanceof Error ? error.stack : undefined,
    });
  } finally {
    await prisma.$disconnect();
  }
}
