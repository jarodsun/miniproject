import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  // 创建默认系统管理员用户
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ 创建管理员用户: admin / admin123');

  // 创建示例系统操作员用户
  const operatorPassword = await bcrypt.hash('operator123', 10);
  
  await prisma.user.create({
    data: {
      username: 'operator',
      password: operatorPassword,
      role: 'USER'
    }
  });

  console.log('✅ 创建操作员用户: operator / operator123');

  // 创建示例货品
  await prisma.product.createMany({
    data: [
      {
        name: '苹果',
        specification: '红富士',
        unit: '箱',
        currentStock: 100
      },
      {
        name: '香蕉',
        specification: '进口',
        unit: '箱',
        currentStock: 50
      },
      {
        name: '橙子',
        specification: '脐橙',
        unit: '箱',
        currentStock: 80
      }
    ]
  });

  console.log('✅ 创建示例货品数据');

  // 创建示例商家
  await prisma.merchant.createMany({
    data: [
      {
        name: '超市A',
        contact: '张三',
        phone: '13800138000',
        address: '北京市朝阳区'
      },
      {
        name: '超市B',
        contact: '李四',
        phone: '13900139000',
        address: '上海市浦东区'
      },
      {
        name: '便利店C',
        contact: '王五',
        phone: '13700137000',
        address: '广州市天河区'
      }
    ]
  });

  console.log('✅ 创建示例商家数据');

  // 创建示例交易记录
  const products = await prisma.product.findMany();
  const merchants = await prisma.merchant.findMany();

  if (products.length > 0 && merchants.length > 0) {
    await prisma.transaction.createMany({
      data: [
        {
          productId: products[0].id,
          merchantId: merchants[0].id,
          type: 'OUTBOUND',
          quantity: 10,
          date: new Date('2024-01-15'),
          notes: '正常销售'
        },
        {
          productId: products[1].id,
          merchantId: merchants[1].id,
          type: 'OUTBOUND',
          quantity: 5,
          date: new Date('2024-01-16'),
          notes: '促销活动'
        },
        {
          productId: products[0].id,
          type: 'INBOUND',
          quantity: 20,
          date: new Date('2024-01-17'),
          notes: '新货入库'
        }
      ]
    });

    console.log('✅ 创建示例交易记录');
  }

  console.log('🎉 数据库初始化完成！');
  console.log('');
  console.log('默认用户账号：');
  console.log('管理员: admin / admin123');
  console.log('操作员: operator / operator123');
}

main()
  .catch((e) => {
    console.error('❌ 数据库初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
