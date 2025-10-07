'use client';

import { 
  Box, 
  Container, 
  Typography, 
  Button,
  Card,
  CardContent
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 4
    }}>
      <Container maxWidth="sm">
        <Box sx={{ mb: 4 }}>
          <Link href="/" passHref>
            <Button
              startIcon={<ArrowBack />}
              sx={{ mb: 2 }}
            >
              返回首页
            </Button>
          </Link>
          
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#333',
              mb: 2
            }}
          >
            飞手注册
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center',
              color: '#666',
              mb: 4
            }}
          >
            请填写您的详细信息，加入我们的专业飞手资源库
          </Typography>
        </Box>

        <Card sx={{ 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center',
                color: '#999',
                mb: 4
              }}
            >
              注册表单正在开发中...
            </Typography>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#666' }}>
                即将推出完整的注册功能
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
