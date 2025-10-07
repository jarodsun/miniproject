import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // 退出登录只需要返回成功，客户端会清除 localStorage
    res.status(200).json({
      message: '退出成功'
    })
  } catch (error) {
    console.error('退出错误:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}
