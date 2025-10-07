'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  Grid,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  People, 
  LocationOn, 
  TrendingUp, 
  Download,
  Refresh,
  Logout
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalPilots: number;
  pilotsByRegion: { region: string; count: number }[];
  recentRegistrations: number;
  growthRate: number;
}

export default function DashboardIndexPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setError('未登录，请先登录');
        return;
      }

      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        setError(data.message || '获取统计数据失败');
      }
    } catch (err) {
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // 调用退出 API
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      
      // 清除本地存储的 token
      localStorage.removeItem('admin_token');
      
      // 跳转到登录页面
      router.push('/dashboard');
    } catch (error) {
      console.error('退出失败:', error);
      // 即使 API 调用失败，也清除本地 token 并跳转
      localStorage.removeItem('admin_token');
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={fetchStats} startIcon={<Refresh />}>
          重新加载
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* 页面标题和退出按钮 */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              飞手管理后台
            </Typography>
            <Typography variant="body1" color="text.secondary">
              管理飞手注册信息，查看统计数据
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ 
              color: '#ef4444',
              borderColor: '#ef4444',
              '&:hover': {
                backgroundColor: '#fef2f2',
                borderColor: '#dc2626'
              }
            }}
          >
            退出登录
          </Button>
        </Box>

        {/* 统计卡片 */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 40, color: '#667eea', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats?.totalPilots || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    总飞手数量
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#10b981', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats?.recentRegistrations || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    本月新增
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ fontSize: 40, color: '#f59e0b', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats?.pilotsByRegion.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    覆盖地区
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 40, color: '#ef4444', mr: 2 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    +{stats?.growthRate || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    增长率
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* 操作按钮 */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            component={Link}
            href="/dashboard/pilots"
            sx={{ backgroundColor: '#667eea' }}
          >
            查看飞手列表
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => {
              const token = localStorage.getItem('admin_token');
              if (!token) {
                setError('未登录，请先登录');
                return;
              }
              
              // 创建一个隐藏的链接来下载文件
              const link = document.createElement('a');
              link.href = '/api/pilots/export';
              link.style.display = 'none';
              document.body.appendChild(link);
              
              // 添加认证头
              fetch('/api/pilots/export', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }).then(response => {
                if (response.ok) {
                  return response.blob();
                }
                throw new Error('导出失败');
              }).then(blob => {
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.download = `pilots-${new Date().toISOString().split('T')[0]}.csv`;
                link.click();
                window.URL.revokeObjectURL(url);
              }).catch(err => {
                setError('导出失败，请重试');
              }).finally(() => {
                document.body.removeChild(link);
              });
            }}
          >
            导出数据
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchStats}
          >
            刷新数据
          </Button>
        </Box>

        {/* 地区分布 */}
        {stats?.pilotsByRegion && stats.pilotsByRegion.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                地区分布统计
              </Typography>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2
              }}>
                {stats.pilotsByRegion.slice(0, 6).map((item, index) => (
                  <Box key={index} sx={{ 
                    p: 2, 
                    backgroundColor: '#f8fafc', 
                    borderRadius: 2,
                    border: '1px solid #e2e8f0'
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {item.region}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {item.count} 人
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}
