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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HistoryIcon from '@mui/icons-material/History';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AppTheme from '../../shared-theme/AppTheme';
import UserInfo from '../components/UserInfo';
import AuthGuard from '../components/AuthGuard';
import ThemeToggle from '../components/ThemeToggle';

export default function InventoryManagement() {
  const router = useRouter();

  const handleNavigateBack = () => {
    router.push('/dashboard');
  };

  const handleNavigateToStockIn = () => {
    router.push('/dashboard/inventory/stock-in');
  };

  const handleNavigateToStockOut = () => {
    router.push('/dashboard/inventory/stock-out');
  };

  const handleNavigateToTransactions = () => {
    router.push('/dashboard/inventory/transactions');
  };

  const handleNavigateToStockQuery = () => {
    router.push('/dashboard/inventory/stock-query');
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
                    `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                出入库管理
              </Typography>
              <Typography variant="h6" color="text.secondary">
                执行库存变动操作（入库、出库、流水记录）
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(2, 1fr)',
                  lg: 'repeat(4, 1fr)',
                },
                gap: 4,
                maxWidth: 1400,
                mx: 'auto',
              }}
            >
              {/* 入库管理卡片 */}
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
                        `0 20px 40px ${alpha(theme.palette.success.main, 0.2)}`,
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
                          `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                      }}
                    >
                      <AddIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Paper>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                      入库管理
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      记录货品入库，更新库存数量
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleNavigateToStockIn}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      进入入库管理
                    </Button>
                  </CardActions>
                </Card>
              </Box>

              {/* 出库管理卡片 */}
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
                        `0 20px 40px ${alpha(theme.palette.error.main, 0.2)}`,
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
                          `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                      }}
                    >
                      <RemoveIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Paper>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                      出库管理
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      记录货品出库，关联商家信息
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleNavigateToStockOut}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      进入出库管理
                    </Button>
                  </CardActions>
                </Card>
              </Box>

              {/* 库存流水卡片 */}
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
                        `0 20px 40px ${alpha(theme.palette.info.main, 0.2)}`,
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
                          `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                      }}
                    >
                      <HistoryIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Paper>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                      库存流水
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      查看所有出入库历史记录
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleNavigateToTransactions}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      查看库存流水
                    </Button>
                  </CardActions>
                </Card>
              </Box>

              {/* 库存查询卡片 */}
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
                      <QueryStatsIcon sx={{ fontSize: 40, color: 'white' }} />
                    </Paper>
                    <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                      库存查询
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      查看当前库存状态和分析
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleNavigateToStockQuery}
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                      }}
                    >
                      查看库存状态
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
