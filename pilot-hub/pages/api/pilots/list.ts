import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { page = 1, limit = 10, search, region } = req.query

    const skip = (Number(page) - 1) * Number(limit)
    const take = Number(limit)

    // 构建查询条件
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { phone: { contains: search as string } }
      ]
    }

    if (region) {
      where.region = { contains: region as string }
    }

    // 获取飞手列表
    const [pilots, total] = await Promise.all([
      prisma.pilot.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          phone: true,
          region: true,
          introduction: true,
          licenseImages: true,
          createdAt: true
        }
      }),
      prisma.pilot.count({ where })
    ])

    res.status(200).json({
      pilots,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })

  } catch (error) {
    console.error('获取飞手列表错误:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}