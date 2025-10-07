'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import { 
  FlightTakeoff, 
  Phone, 
  Email, 
  Chat,
  LocationOn,
  Security,
  Speed,
  Group
} from '@mui/icons-material';
import Link from 'next/link';

export default function Home() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      {/* 第一屏：飞手注册介绍 */}
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 背景装饰 */}
        <Box sx={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 0
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            {/* Logo和标题 */}
            <Box sx={{ mb: 4 }}>
              <FlightTakeoff sx={{ fontSize: 80, mb: 2, color: '#ffd700' }} />
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                PilotHub
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  opacity: 0.9,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                专业飞手资源库
              </Typography>
            </Box>

            {/* 平台价值介绍 */}
            <Box sx={{ mb: 6 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  mb: 3,
                  fontWeight: 'bold',
                  fontSize: { xs: '1.8rem', md: '2.2rem' }
                }}
              >
                为什么选择PilotHub？
              </Typography>
              
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                gap: 3,
                mb: 4
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Security sx={{ fontSize: 40, mb: 1, color: '#ffd700' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    专业认证
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    持证飞手专业认证平台
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Speed sx={{ fontSize: 40, mb: 1, color: '#ffd700' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    快速匹配
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    精准匹配服务需求
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Group sx={{ fontSize: 40, mb: 1, color: '#ffd700' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    资源整合
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    汇聚优质飞手资源
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <LocationOn sx={{ fontSize: 40, mb: 1, color: '#ffd700' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    地域覆盖
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    全国范围服务网络
                  </Typography>
                </Box>
              </Box>

              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' }
                }}
              >
                加入我们，成为专业飞手资源库的一员，获得更多商业机会和合作伙伴
              </Typography>
            </Box>

            {/* 立即注册按钮 */}
            <Link href="/register" passHref>
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: '#ffd700',
                  color: '#333',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  px: 6,
                  py: 2,
                  borderRadius: '50px',
                  boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                  '&:hover': {
                    backgroundColor: '#ffed4e',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(255, 215, 0, 0.4)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                立即注册
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* 第二屏：平台联系方式 */}
      <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        py: 8
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                fontWeight: 'bold',
                mb: 2,
                color: '#333',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              联系我们
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#666',
                mb: 4,
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}
            >
              有任何问题或合作意向，欢迎随时联系我们
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 4
          }}>
            {/* 项目负责人 */}
            <Card sx={{ 
              height: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              border: '1px solid #e0e0e0'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  项目负责人
                </Typography>
                
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Phone sx={{ color: '#667eea' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      [您的电话]
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Chat sx={{ color: '#667eea' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      [您的微信]
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Email sx={{ color: '#667eea' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      [您的邮箱]
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* 合伙人 */}
            <Card sx={{ 
              height: '100%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              border: '1px solid #e0e0e0'
            }}>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#333' }}>
                  合伙人
                </Typography>
                
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Phone sx={{ color: '#667eea' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      [合伙人电话]
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Chat sx={{ color: '#667eea' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      [合伙人微信]
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <Email sx={{ color: '#667eea' }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                      [合伙人邮箱]
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* 底部信息 */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
              PilotHub - 专业飞手资源库管理系统
            </Typography>
            <Typography variant="body2" sx={{ color: '#999' }}>
              最后更新时间：2025年10月7日
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
