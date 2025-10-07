'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';
import AppTheme from '../../shared-theme/AppTheme';
import UserInfo from '../components/UserInfo';
import AuthGuard from '../components/AuthGuard';
import ThemeToggle from '../components/ThemeToggle';

export default function SalesAnalysis() {
  const router = useRouter();

  const handleNavigateBack = () => {
    router.push('/dashboard');
  };

  const handleNavigateToTrendAnalysis = () => {
    router.push('/dashboard/sales-analysis/trend-analysis');
  };

  const handleNavigateToInventoryAlert = () => {
    router.push('/dashboard/sales-analysis/inventory-alert');
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
          <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* 用户信息栏 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <ThemeToggle />
              <UserInfo />
            </Box>

            {/* 返回按钮 */}
            <Box sx={{ mb: 4 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleNavigateBack}
                sx={{ mb: 2 }}
              >
                返回控制面板
              </Button>
            </Box>
            
            <Box sx={{ mb: 6, textAlign: 'center' }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                销售分析与预测
              </Typography>
              <Typography variant="h6" color="text.secondary">
                分析采购趋势、库存预警、销售预测等
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                },
                gap: 4,
                maxWidth: 800,
                mx: 'auto',
              }}
            >
              {/* 商家年度采购趋势分析卡片 */}
              <Box>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: (theme) =>
                        `0 20px 40px ${alpha(theme.palette.primary.main, 0.2)}`,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                    <Paper
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        background: (theme) =>
                          `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      }}
                    >
                      <TrendingUpIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Paper>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                      采购趋势分析
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      分析商家年度采购趋势，识别采购规律
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleNavigateToTrendAnalysis}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      进入趋势分析
                    </Button>
                  </CardActions>
                </Card>
              </Box>

              {/* 库存预警系统卡片 */}
              <Box>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: (theme) =>
                        `0 20px 40px ${alpha(theme.palette.warning.main, 0.2)}`,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                    <Paper
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        background: (theme) =>
                          `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                      }}
                    >
                      <WarningIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Paper>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                      库存预警系统
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      智能库存预警，提供采购建议和趋势预测
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleNavigateToInventoryAlert}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      进入预警系统
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Box>
          </Container>
        </Box>
      </AppTheme>
    </AuthGuard>
  );
}
