import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { validatePhone, validateName, validateRegion, validateIntroduction } from '../../../lib/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, phone, region, introduction, licenseImages } = req.body

    // 验证必填字段
    if (!name || !phone || !region) {
      return res.status(400).json({ message: '姓名、电话和地区为必填项' })
    }

    // 验证字段格式
    if (!validateName(name)) {
      return res.status(400).json({ message: '姓名长度必须在2-50个字符之间' })
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ message: '电话号码格式不正确' })
    }

    if (!validateRegion(region)) {
      return res.status(400).json({ message: '地区名称长度必须在2-100个字符之间' })
    }

    if (introduction && !validateIntroduction(introduction)) {
      return res.status(400).json({ message: '自我介绍不能超过500个字符' })
    }

    if (!licenseImages || licenseImages.length === 0) {
      return res.status(400).json({ message: '请上传至少一张执照照片' })
    }

    // 检查手机号是否已存在
    const existingPilot = await prisma.pilot.findUnique({
      where: { phone }
    })

    if (existingPilot) {
      return res.status(400).json({ message: '该手机号已注册' })
    }

    // 创建飞手记录
    const pilot = await prisma.pilot.create({
      data: {
        name,
        phone,
        region,
        introduction: introduction || null,
        licenseImages: JSON.stringify(licenseImages) // 将数组转换为JSON字符串存储
      }
    })

    res.status(201).json({ 
      message: '注册成功',
      pilot: {
        id: pilot.id,
        name: pilot.name,
        phone: pilot.phone,
        region: pilot.region,
        createdAt: pilot.createdAt
      }
    })

  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: '服务器内部错误' })
  }
}