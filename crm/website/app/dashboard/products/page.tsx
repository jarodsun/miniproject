'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AppTheme from '../../shared-theme/AppTheme';
import { useAuth } from '../../hooks/useAuth';
import CircularProgress from '@mui/material/CircularProgress';
import UserInfo from '../components/UserInfo';
import AuthGuard from '../components/AuthGuard';
import ThemeToggle from '../components/ThemeToggle';

export default function ProductsPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/dashboard');
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
        <Container maxWidth="xl" sx={{ py: 4 }}>
          {/* 用户信息栏 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <ThemeToggle />
            <UserInfo />
          </Box>
          
          {/* 页面头部 */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{ mb: 2 }}
            >
              返回控制面板
            </Button>
            <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
              货品管理
            </Typography>
            <Typography variant="body1" color="text.secondary">
              管理商品信息、库存、价格等
            </Typography>
          </Box>

          {/* 操作栏 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ minWidth: 140 }}
              >
                添加货品
              </Button>
              <Button
                variant="outlined"
                startIcon={<SearchIcon />}
                sx={{ minWidth: 120 }}
              >
                搜索
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{ minWidth: 120 }}
              >
                筛选
              </Button>
            </Box>
          </Paper>

          {/* 内容区域 */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              货品列表
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
                color: 'text.secondary',
              }}
            >
              <Typography variant="body1">
                货品列表功能正在开发中...
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      </AppTheme>
    </AuthGuard>
  );
}
