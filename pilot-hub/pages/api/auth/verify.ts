import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: '未提供认证令牌' })
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

    res.status(200).json({
      valid: true,
      admin: {
        id: decoded.id,
        username: decoded.username
      }
    })

  } catch (error) {
    console.error('Token验证错误:', error)
    res.status(401).json({ message: '无效的认证令牌' })
  }
}
