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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';

interface Merchant {
  id: string;
  name: string;
}

interface TrendData {
  month: string;
  totalQuantity: number;
  isHighVolume: boolean;
}

export default function TrendAnalysis() {
  const router = useRouter();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<string>('');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    try {
      const response = await fetch('/api/merchants');
      if (response.ok) {
        const data = await response.json();
        // console.log('商家API响应:', data);
        setMerchants(data.data?.merchants || []);
      } else {
        // console.error('获取商家列表失败，状态码:', response.status);
      }
    } catch (err) {
      // console.error('获取商家列表失败:', err);
    }
  };

  const fetchTrendData = async (merchantId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/sales-analysis/trend?merchantId=${merchantId}`);
      if (response.ok) {
        const data = await response.json();
        setTrendData(data.trendData || []);
      } else {
        setError('获取趋势数据失败');
      }
    } catch (err) {
      setError('获取趋势数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantChange = (merchantId: string) => {
    setSelectedMerchant(merchantId);
    if (merchantId) {
      fetchTrendData(merchantId);
    } else {
      setTrendData([]);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard/sales-analysis');
  };

  // 计算平均采购量
  const averageQuantity = trendData.length > 0 
    ? trendData.reduce((sum, item) => sum + item.totalQuantity, 0) / trendData.length 
    : 0;

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
                    `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                商家年度采购趋势分析
              </Typography>
              <Typography variant="h6" color="text.secondary">
                分析商家近一年的采购规律，识别采购高峰期
              </Typography>
            </Box>

            {/* 商家选择 */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <FormControl fullWidth>
                <InputLabel>选择商家</InputLabel>
                <Select
                  value={selectedMerchant}
                  onChange={(e) => handleMerchantChange(e.target.value)}
                  label="选择商家"
                >
                  {merchants.length === 0 ? (
                    <MenuItem disabled>
                      暂无商家数据
                    </MenuItem>
                  ) : (
                    merchants.map((merchant) => (
                      <MenuItem key={merchant.id} value={merchant.id}>
                        {merchant.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Paper>

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

            {/* 趋势数据展示 */}
            {!loading && trendData.length > 0 && (
              <Box>
                {/* 统计信息 */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="primary" gutterBottom>
                        平均月采购量
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {Math.round(averageQuantity)}
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="success.main" gutterBottom>
                        采购高峰期
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {trendData.filter(item => item.isHighVolume).length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        个月
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" color="info.main" gutterBottom>
                        最高采购量
                      </Typography>
                      <Typography variant="h4" fontWeight={600}>
                        {Math.max(...trendData.map(item => item.totalQuantity))}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>

                {/* 趋势图表 */}
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    近12个月采购趋势图
                  </Typography>
                  <Box sx={{ height: 400, display: 'flex', alignItems: 'end', gap: 1, mt: 3 }}>
                    {trendData.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            width: '100%',
                            height: `${(item.totalQuantity / Math.max(...trendData.map(d => d.totalQuantity))) * 300}px`,
                            backgroundColor: item.isHighVolume 
                              ? (theme) => theme.palette.error.main 
                              : (theme) => theme.palette.primary.main,
                            borderRadius: 1,
                            position: 'relative',
                            '&::after': {
                              content: `"${item.totalQuantity}"`,
                              position: 'absolute',
                              top: -25,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: 'text.primary',
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {item.month}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {(() => {
                            // 根据月份名称计算对应的年份
                            const currentDate = new Date();
                            const currentMonth = currentDate.getMonth();
                            const currentYear = currentDate.getFullYear();
                            
                            // 月份名称到数字的映射
                            const monthMap: { [key: string]: number } = {
                              '1月': 0, '2月': 1, '3月': 2, '4月': 3, '5月': 4, '6月': 5,
                              '7月': 6, '8月': 7, '9月': 8, '10月': 9, '11月': 10, '12月': 11
                            };
                            
                            const monthIndex = monthMap[item.month];
                            if (monthIndex <= currentMonth) {
                              return currentYear;
                            } else {
                              return currentYear - 1;
                            }
                          })()}
                        </Typography>
                        {item.isHighVolume && (
                          <Typography variant="caption" color="error.main" fontWeight={600}>
                            高峰期
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Box>
            )}

            {/* 无数据提示 */}
            {!loading && selectedMerchant && trendData.length === 0 && (
              <Alert severity="info">
                该商家在过去12个月内没有采购记录
              </Alert>
            )}
          </Container>
        </Box>
      </AppTheme>
    </AuthGuard>
  );
}
