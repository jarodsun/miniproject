import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // 获取所有货品
    const products = await prisma.product.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // 获取过去6个月的出库数据用于计算月均销量
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const transactions = await prisma.inventoryTransaction.findMany({
      where: {
        type: 'OUT',
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        productId: true,
        quantity: true,
        createdAt: true,
      },
    });

    // 按货品计算月均销量
    const productSales: { [key: string]: number[] } = {};
    transactions.forEach(transaction => {
      if (!productSales[transaction.productId]) {
        productSales[transaction.productId] = [];
      }
      productSales[transaction.productId].push(transaction.quantity);
    });

    // 计算每个货品的月均销量
    const productAverageSales: { [key: string]: number } = {};
    Object.entries(productSales).forEach(([productId, sales]) => {
      const totalSales = sales.reduce((sum, qty) => sum + qty, 0);
      productAverageSales[productId] = Math.round(totalSales / 6); // 6个月的平均值
    });

    // 生成预警数据
    const alertProducts = products.map(product => {
      const averageMonthlySales = productAverageSales[product.id] || 0;
      const alertThreshold = Math.max(10, Math.round(averageMonthlySales * 0.5)); // 预警阈值设为月均销量的50%，最少10
      const recommendedPurchase = Math.max(0, alertThreshold - product.currentStock + averageMonthlySales * 2); // 建议采购量

      let alertLevel: 'low' | 'critical' | 'normal' = 'normal';
      if (product.currentStock <= 0) {
        alertLevel = 'critical';
      } else if (product.currentStock <= alertThreshold) {
        alertLevel = 'low';
      }

      return {
        id: product.id,
        name: product.name,
        specification: product.specification,
        unit: product.unit,
        currentStock: product.currentStock,
        alertThreshold,
        averageMonthlySales,
        recommendedPurchase,
        alertLevel,
      };
    });

    // 计算统计信息
    const totalProducts = alertProducts.length;
    const lowStockProducts = alertProducts.filter(p => p.alertLevel === 'low').length;
    const criticalStockProducts = alertProducts.filter(p => p.alertLevel === 'critical').length;
    const averageStockLevel = totalProducts > 0 
      ? Math.round(alertProducts.reduce((sum, p) => sum + p.currentStock, 0) / totalProducts)
      : 0;
    const totalRecommendedPurchase = alertProducts.reduce((sum, p) => sum + p.recommendedPurchase, 0);

    res.status(200).json({
      success: true,
      products: alertProducts,
      summary: {
        totalProducts,
        lowStockProducts,
        criticalStockProducts,
        averageStockLevel,
        totalRecommendedPurchase,
      },
    });

  } catch (error) {
    console.error('获取库存预警数据失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取库存预警数据失败' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
