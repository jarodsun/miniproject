'use client';

import * as React from 'react';
import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AppTheme from '../shared-theme/AppTheme';
import AuthGuard from '../dashboard/components/AuthGuard';

export default function MockDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const createMockData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/mock/seed-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || '创建Mock数据失败');
      }
    } catch (err) {
      setError('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  const createSimpleMockData = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/mock/simple-seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || '创建Mock数据失败');
      }
    } catch (err) {
      setError('网络请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <AppTheme>
        <CssBaseline enableColorScheme />
        <Box
          sx={{
            minHeight: '100vh',
            position: 'relative',
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              zIndex: -1,
              inset: 0,
              backgroundRepeat: 'no-repeat',
              ...(theme) => theme.applyStyles('dark', {
                backgroundImage:
                  'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
              }),
            },
          }}
        >
          <Container maxWidth="md" sx={{ py: 8 }}>
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Mock数据初始化
              </Typography>
              <Typography variant="h6" color="text.secondary">
                创建测试数据：5个商家、10个货品、12个月进货记录
              </Typography>
            </Box>

            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                数据说明
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                此操作将创建以下测试数据：
              </Typography>
              
              <Box component="ul" sx={{ mb: 3, pl: 2 }}>
                <li>5个商家（北京科技、上海贸易、广州电子、深圳创新、杭州互联网）</li>
                <li>10个货品（笔记本电脑、无线鼠标、机械键盘等）</li>
                <li>每个商家12个月的进货记录（每月2-5个货品）</li>
                <li>每个货品随机采购数量（10-100件）</li>
              </Box>

              <Alert severity="warning" sx={{ mb: 3 }}>
                注意：此操作会清空现有数据，请谨慎使用！
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={createMockData}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? '创建中...' : '创建完整Mock数据'}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={createSimpleMockData}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  {loading ? '创建中...' : '创建简化Mock数据'}
                </Button>
                
                {loading && <CircularProgress size={24} />}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}

              {result && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Mock数据创建成功！
                  </Typography>
                  <Typography variant="body2">
                    创建了 {result.data.merchants} 个商家、{result.data.products} 个货品、{result.data.transactions} 条交易记录
                  </Typography>
                </Alert>
              )}
            </Paper>
          </Container>
        </Box>
      </AppTheme>
    </AuthGuard>
  );
}
