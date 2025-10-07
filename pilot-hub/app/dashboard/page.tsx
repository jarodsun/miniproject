'use client';

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Lock, 
  Person,
  Login as LoginIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // 保存 token 到 localStorage
        localStorage.setItem('admin_token', result.token);
        // 跳转到仪表盘
        router.push('/dashboard/index');
      } else {
        setError(result.message || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <Container maxWidth="sm">
        <Card sx={{ 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: '16px'
        }}>
          <CardContent sx={{ p: 6 }}>
            {/* 标题 */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Lock sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                管理员登录
              </Typography>
              <Typography variant="body1" color="text.secondary">
                请输入您的管理员账号和密码
              </Typography>
            </Box>

            {/* 错误提示 */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* 登录表单 */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="用户名"
                  value={formData.username}
                  onChange={handleInputChange('username')}
                  required
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: '#667eea' }} />
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  label="密码"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  InputProps={{
                    startAdornment: <Lock sx={{ mr: 1, color: '#667eea' }} />
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  backgroundColor: '#667eea',
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#5a6fd8'
                  }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    登录中...
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LoginIcon />
                    登录
                  </Box>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
