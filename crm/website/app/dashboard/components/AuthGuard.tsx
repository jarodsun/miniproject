'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import AppTheme from '../../shared-theme/AppTheme';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <AppTheme>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: 2,
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" color="text.secondary">
            正在验证身份...
          </Typography>
        </Box>
      </AppTheme>
    );
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated) {
    router.push('/');
    return (
      <AppTheme>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            正在重定向到登录页面...
          </Typography>
        </Box>
      </AppTheme>
    );
  }

  // 如果已认证，渲染子组件
  return <>{children}</>;
}
