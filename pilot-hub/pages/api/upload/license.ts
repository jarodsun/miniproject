import { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

// 扩展 NextApiRequest 类型
interface NextApiRequestWithFiles extends NextApiRequest {
  files: Express.Multer.File[]
}

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'licenses')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `license-${uniqueSuffix}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型'))
    }
  }
})

// 禁用 Next.js 的默认 body 解析
export const config = {
  api: {
    bodyParser: false,
  },
}

export default function handler(req: NextApiRequestWithFiles, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  upload.array('licenseImages', 5)(req as any, res as any, (err) => {
    if (err) {
      console.error('上传错误:', err)
      return res.status(400).json({ message: err.message })
    }

    const files = req.files
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: '请选择要上传的文件' })
    }

    // 返回文件路径
    const filePaths = files.map(file => `/uploads/licenses/${file.filename}`)
    
    res.status(200).json({
      message: '上传成功',
      files: filePaths
    })
  })
}
