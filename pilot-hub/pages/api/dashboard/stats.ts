import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // 验证管理员权限
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      return res.status(401).json({ message: '无效的认证令牌' })
    }

    // 获取统计数据
    const [
      totalPilots,
      pilotsByRegion,
      recentRegistrations,
      lastMonthRegistrations
    ] = await Promise.all([
      // 总飞手数量
      prisma.pilot.count(),
      
      // 按地区统计
      prisma.pilot.groupBy({
        by: ['region'],
        _count: {
          region: true
        },
        orderBy: {
          _count: {
            region: 'desc'
          }
        }
      }),
      
      // 本月新增
      prisma.pilot.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // 上月新增
      prisma.pilot.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    // 计算增长率
    const growthRate = lastMonthRegistrations > 0 
      ? Math.round(((recentRegistrations - lastMonthRegistrations) / lastMonthRegistrations) * 100)
      : 0

    // 格式化地区数据
    const formattedPilotsByRegion = pilotsByRegion.map(item => ({
      region: item.region,
      count: item._count.region
    }))

    res.status(200).json({
      totalPilots,
      pilotsByRegion: formattedPilotsByRegion,
      recentRegistrations,
      growthRate
    })

  } catch (error) {
    console.error('获取统计数据错误:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}
