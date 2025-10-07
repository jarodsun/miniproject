import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建管理员账号...')

  // 管理员账号数据
  const admins = [
    {
      username: 'admin_7k9m',
      password: 'P@ssw0rd!'
    },
    {
      username: 'root_2x8n', 
      password: 'Secure#123'
    }
  ]

  for (const adminData of admins) {
    // 检查是否已存在
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: adminData.username }
    })

    if (existingAdmin) {
      console.log(`管理员 ${adminData.username} 已存在，跳过创建`)
      continue
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(adminData.password, 12)

    // 创建管理员
    const admin = await prisma.admin.create({
      data: {
        username: adminData.username,
        password: hashedPassword
      }
    })

    console.log(`✅ 管理员账号创建成功: ${admin.username}`)
    console.log(`   用户名: ${adminData.username}`)
    console.log(`   密码: ${adminData.password}`)
    console.log(`   创建时间: ${admin.createdAt}`)
    console.log('---')
  }

  console.log('🎉 所有管理员账号创建完成！')
}

main()
  .catch((e) => {
    console.error('❌ 创建管理员账号失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
