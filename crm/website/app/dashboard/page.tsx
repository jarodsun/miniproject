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
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AppTheme from '../shared-theme/AppTheme';
import { useAuth } from '../hooks/useAuth';
import CircularProgress from '@mui/material/CircularProgress';
import UserInfo from './components/UserInfo';
import AuthGuard from './components/AuthGuard';
import ThemeToggle from './components/ThemeToggle';

export default function Dashboard() {
  const router = useRouter();

  const handleNavigateToProducts = () => {
    router.push('/dashboard/products');
  };

  const handleNavigateToMerchants = () => {
    router.push('/dashboard/merchants');
  };

  const handleNavigateToInventory = () => {
    router.push('/dashboard/inventory');
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
              控制面板
            </Typography>
            <Typography variant="h6" color="text.secondary">
              选择您要管理的模块
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 4,
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            {/* 出入库管理卡片 */}
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
                    <WarehouseIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Paper>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                    出入库管理
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    管理货品入库、出库、库存流水等
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNavigateToInventory}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    进入出入库管理
                  </Button>
                </CardActions>
              </Card>
            </Box>

            {/* 货品管理卡片 */}
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
                    <InventoryIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Paper>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                    货品管理
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    管理商品信息、库存、价格等
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNavigateToProducts}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    进入货品管理
                  </Button>
                </CardActions>
              </Card>
            </Box>

            {/* 商家管理卡片 */}
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
                      `0 20px 40px ${alpha(theme.palette.secondary.main, 0.2)}`,
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
                        `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Paper>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
                    商家管理
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    管理商家信息、联系方式、合作状态等
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleNavigateToMerchants}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                    }}
                  >
                    进入商家管理
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
