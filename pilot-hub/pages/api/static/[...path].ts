import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import fs from 'fs'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: filePath } = req.query
  
  // 处理数组路径参数
  let actualPath: string
  if (Array.isArray(filePath)) {
    actualPath = filePath.join('/')
  } else if (typeof filePath === 'string') {
    actualPath = filePath
  } else {
    return res.status(400).json({ message: 'Invalid file path' })
  }

  const fullPath = path.join(process.cwd(), 'uploads', actualPath)
  
  // 调试日志
  console.log('Static file request:', {
    originalPath: filePath,
    actualPath,
    fullPath,
    exists: fs.existsSync(fullPath)
  })
  
  // 安全检查：确保文件在 uploads 目录内
  const uploadsDir = path.join(process.cwd(), 'uploads')
  const resolvedPath = path.resolve(fullPath)
  const resolvedUploadsDir = path.resolve(uploadsDir)
  
  if (!resolvedPath.startsWith(resolvedUploadsDir)) {
    console.log('Access denied:', { resolvedPath, resolvedUploadsDir })
    return res.status(403).json({ message: 'Access denied' })
  }

  try {
    // 检查文件是否存在
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ message: 'File not found' })
    }

    // 获取文件信息
    const stat = fs.statSync(fullPath)
    
    if (!stat.isFile()) {
      return res.status(400).json({ message: 'Not a file' })
    }

    // 设置适当的 Content-Type
    const ext = path.extname(fullPath).toLowerCase()
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
    }
    
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', stat.size)
    
    // 设置缓存头
    res.setHeader('Cache-Control', 'public, max-age=31536000')
    
    // 读取并返回文件
    const fileStream = fs.createReadStream(fullPath)
    fileStream.pipe(res)
    
  } catch (error) {
    console.error('Error serving file:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
