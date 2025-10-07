import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('开始初始化数据库...');

  // 创建默认系统管理员用户
  const hashedPassword = await bcrypt.hash('A7bK9mX2', 10);
  
  await prisma.user.create({
    data: {
      username: '1@1.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ 创建管理员用户: 1@1.com / A7bK9mX2');

  // 创建示例系统操作员用户
  const operatorPassword = await bcrypt.hash('P3nQ8rY5', 10);
  
  await prisma.user.create({
    data: {
      username: '2@2.com',
      password: operatorPassword,
      role: 'USER'
    }
  });

  console.log('✅ 创建操作员用户: 2@2.com / P3nQ8rY5');

  // 创建示例货品
  const product = await prisma.product.create({
    data: {
      name: '苹果',
      specification: '红富士',
      unit: '箱',
      currentStock: 50  // 初始库存50箱
    }
  });

  console.log('✅ 创建示例货品数据');

  // 创建示例商家
  const merchant = await prisma.merchant.create({
    data: {
      name: '超市A',
      contact: '张三',
      phone: '13800138000',
      address: '北京市朝阳区'
    }
  });

  console.log('✅ 创建示例商家数据');

  // 创建示例交易记录
  // 先入库100箱，再出库50箱，最终库存50箱
  await prisma.transaction.createMany({
    data: [
      {
        productId: product.id,
        type: 'INBOUND',
        quantity: 100,
        date: new Date('2024-01-15'),
        notes: '新货入库'
      },
      {
        productId: product.id,
        merchantId: merchant.id,
        type: 'OUTBOUND',
        quantity: 50,
        date: new Date('2024-01-16'),
        notes: '正常销售'
      }
    ]
  });

  // 更新货品库存（100 - 50 = 50）
  await prisma.product.update({
    where: { id: product.id },
    data: {
      currentStock: 50
    }
  });

  console.log('✅ 创建示例交易记录');

  console.log('🎉 数据库初始化完成！');
  console.log('');
  console.log('默认用户账号：');
  console.log('管理员: 1@1.com / A7bK9mX2');
  console.log('操作员: 2@2.com / P3nQ8rY5');
}

main()
  .catch((e) => {
    console.error('❌ 数据库初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
