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

    // 获取所有飞手数据
    const pilots = await prisma.pilot.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phone: true,
        region: true,
        introduction: true,
        createdAt: true
      }
    })

    // 生成 CSV 内容
    const csvHeader = 'ID,姓名,电话,地区,自我介绍,注册时间\n'
    const csvRows = pilots.map(pilot => {
      const introduction = pilot.introduction ? pilot.introduction.replace(/,/g, '，') : ''
      const createdAt = new Date(pilot.createdAt).toLocaleString('zh-CN')
      
      return `${pilot.id},"${pilot.name}","${pilot.phone}","${pilot.region}","${introduction}","${createdAt}"`
    }).join('\n')

    const csvContent = csvHeader + csvRows

    // 设置响应头
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="pilots-${new Date().toISOString().split('T')[0]}.csv"`)
    
    // 添加 BOM 以支持中文
    const bom = '\uFEFF'
    res.status(200).send(bom + csvContent)

  } catch (error) {
    console.error('导出数据错误:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}
