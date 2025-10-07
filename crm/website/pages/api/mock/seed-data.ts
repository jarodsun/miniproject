import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 清空现有数据（按依赖关系顺序删除）
    await prisma.transaction.deleteMany();
    await prisma.product.deleteMany();
    await prisma.merchant.deleteMany();

    // 创建5个商家
    const merchants = await Promise.all([
      prisma.merchant.create({
        data: {
          name: '北京科技有限公司',
          contact: '张经理',
          phone: '13800138001',
          address: '北京市朝阳区科技园区',
        },
      }),
      prisma.merchant.create({
        data: {
          name: '上海贸易有限公司',
          contact: '李总',
          phone: '13900139002',
          address: '上海市浦东新区贸易大厦',
        },
      }),
      prisma.merchant.create({
        data: {
          name: '广州电子科技',
          contact: '王主任',
          phone: '13700137003',
          address: '广州市天河区电子城',
        },
      }),
      prisma.merchant.create({
        data: {
          name: '深圳创新企业',
          contact: '陈总监',
          phone: '13600136004',
          address: '深圳市南山区创新园',
        },
      }),
      prisma.merchant.create({
        data: {
          name: '杭州互联网公司',
          contact: '刘经理',
          phone: '13500135005',
          address: '杭州市西湖区互联网小镇',
        },
      }),
    ]);

    // 创建10个货品
    const products = await Promise.all([
      prisma.product.create({
        data: {
          name: '笔记本电脑',
          specification: '15.6英寸',
          unit: '台',
          currentStock: 50,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '无线鼠标',
          specification: '2.4G无线',
          unit: '个',
          currentStock: 200,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '机械键盘',
          specification: '青轴',
          unit: '个',
          currentStock: 80,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '显示器',
          specification: '27英寸4K',
          unit: '台',
          currentStock: 30,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '耳机',
          specification: '蓝牙降噪',
          unit: '个',
          currentStock: 150,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '移动硬盘',
          specification: '1TB USB3.0',
          unit: '个',
          currentStock: 100,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '摄像头',
          specification: '1080P高清',
          unit: '个',
          currentStock: 60,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '路由器',
          specification: 'WiFi6',
          unit: '台',
          currentStock: 40,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '手机支架',
          specification: '可调节角度',
          unit: '个',
          currentStock: 300,
          imageUrl: null,
        },
      }),
      prisma.product.create({
        data: {
          name: '数据线',
          specification: 'Type-C 1米',
          unit: '根',
          currentStock: 500,
          imageUrl: null,
        },
      }),
    ]);

    // 为每个商家创建12个月的进货记录
    const currentDate = new Date();
    const transactions = [];

    for (const merchant of merchants) {
      for (let monthOffset = 11; monthOffset >= 0; monthOffset--) {
        const transactionDate = new Date(currentDate);
        transactionDate.setMonth(transactionDate.getMonth() - monthOffset);
        
        // 随机选择2-5个货品进行采购
        const numProducts = Math.floor(Math.random() * 4) + 2;
        const selectedProducts = products
          .sort(() => 0.5 - Math.random())
          .slice(0, numProducts);

        for (const product of selectedProducts) {
          // 生成随机采购数量（10-100之间）
          const quantity = Math.floor(Math.random() * 91) + 10;
          
          // 创建出库记录（表示商家采购）
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

          // 更新产品库存（确保不会变成负数）
          const updatedProduct = await prisma.product.update({
            where: { id: product.id },
            data: {
              currentStock: {
                decrement: quantity,
              },
            },
          });

          // 如果库存变成负数，重新设置为0
          if (updatedProduct.currentStock < 0) {
            await prisma.product.update({
              where: { id: product.id },
              data: {
                currentStock: 0,
              },
            });
          }

          transactions.push(transaction);
        }
      }
    }

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
