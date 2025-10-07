'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppTheme from '../../../shared-theme/AppTheme';
import UserInfo from '../../components/UserInfo';
import AuthGuard from '../../components/AuthGuard';
import ThemeToggle from '../../components/ThemeToggle';
import {
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  specification: string;
  unit: string;
  currentStock: number;
  alertThreshold: number;
  averageMonthlySales: number;
  recommendedPurchase: number;
  alertLevel: 'low' | 'critical' | 'normal';
}

interface AlertSummary {
  totalProducts: number;
  lowStockProducts: number;
  criticalStockProducts: number;
  averageStockLevel: number;
  totalRecommendedPurchase: number;
}

export default function InventoryAlert() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [alertSummary, setAlertSummary] = useState<AlertSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAlertData();
  }, []);

  const fetchAlertData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/sales-analysis/inventory-alert');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setAlertSummary(data.summary || null);
      } else {
        setError('获取库存预警数据失败');
      }
    } catch (err) {
      setError('获取库存预警数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/sales-analysis');
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'error';
      case 'low':
        return 'warning';
      default:
        return 'success';
    }
  };

  const getAlertLevelText = (level: string) => {
    switch (level) {
      case 'critical':
        return '严重不足';
      case 'low':
        return '库存不足';
      default:
        return '库存充足';
    }
  };

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <TrendingDownIcon />;
      case 'low':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
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
                onClick={handleGoBack}
                sx={{ mb: 2 }}
              >
                返回销售分析
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
                    `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                库存预警系统
              </Typography>
              <Typography variant="h6" color="text.secondary">
                智能库存预警，提供采购建议和趋势预测
              </Typography>
            </Box>

            {/* 错误提示 */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* 加载状态 */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            )}

            {/* 预警概览 */}
            {!loading && alertSummary && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  预警概览
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
                  gap: 3 
                }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        总货品数
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {alertSummary.totalProducts}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="warning.main" gutterBottom>
                        库存不足
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {alertSummary.lowStockProducts}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="error.main" gutterBottom>
                        严重不足
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {alertSummary.criticalStockProducts}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="info.main" gutterBottom>
                        建议采购总量
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {alertSummary.totalRecommendedPurchase}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}

            {/* 预警详情 */}
            {!loading && products.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  库存预警详情
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>货品名称</TableCell>
                        <TableCell>规格</TableCell>
                        <TableCell>单位</TableCell>
                        <TableCell>当前库存</TableCell>
                        <TableCell>预警阈值</TableCell>
                        <TableCell>月均销量</TableCell>
                        <TableCell>建议采购</TableCell>
                        <TableCell>预警状态</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.specification}</TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color={product.currentStock <= product.alertThreshold ? 'error.main' : 'text.primary'}
                            >
                              {product.currentStock}
                            </Typography>
                          </TableCell>
                          <TableCell>{product.alertThreshold}</TableCell>
                          <TableCell>{product.averageMonthlySales}</TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              color="primary.main"
                            >
                              {product.recommendedPurchase}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getAlertIcon(product.alertLevel)}
                              label={getAlertLevelText(product.alertLevel)}
                              color={getAlertLevelColor(product.alertLevel) as any}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}

            {/* 无数据提示 */}
            {!loading && products.length === 0 && (
              <Alert severity="info">
                暂无库存预警数据
              </Alert>
            )}
          </Container>
        </Box>
      </AppTheme>
    </AuthGuard>
  );
}
