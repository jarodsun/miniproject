import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { merchantId } = req.query;

    if (!merchantId) {
      return res.status(400).json({ message: 'Merchant ID is required' });
    }

    // 获取过去12个月的数据
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    // 查询出库记录（采购记录）
    const transactions = await prisma.transaction.findMany({
      where: {
        merchantId: merchantId as string,
        type: 'OUTBOUND', // 出库记录表示采购
        date: {
          gte: twelveMonthsAgo,
        },
      },
      include: {
        product: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    // 按月份汇总数据
    const monthlyData: { [key: string]: number } = {};
    const monthNames = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ];

    // 初始化过去12个月的数据
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = monthNames[date.getMonth()];
      monthlyData[monthKey] = 0;
    }

    // 汇总每个月的采购量
    transactions.forEach(transaction => {
      const monthKey = `${transaction.date.getFullYear()}-${String(transaction.date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey] += transaction.quantity;
      }
    });

    // 计算平均采购量
    const totalQuantity = Object.values(monthlyData).reduce((sum, qty) => sum + qty, 0);
    const averageQuantity = totalQuantity / 12;

    // 生成趋势数据
    const trendData = Object.entries(monthlyData).map(([monthKey, quantity]) => {
      const date = new Date(monthKey + '-01');
      const monthName = monthNames[date.getMonth()];
      const isHighVolume = quantity > averageQuantity * 1.5; // 超过平均值1.5倍认为是高峰期

      return {
        month: monthName,
        totalQuantity: quantity,
        isHighVolume,
      };
    });

    // 获取商家信息
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId as string },
      select: { name: true },
    });

    res.status(200).json({
      success: true,
      merchant: merchant?.name || '未知商家',
      trendData,
      summary: {
        totalQuantity,
        averageQuantity: Math.round(averageQuantity),
        highVolumeMonths: trendData.filter(item => item.isHighVolume).length,
      },
    });

  } catch (error) {
    console.error('获取采购趋势数据失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取采购趋势数据失败' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
