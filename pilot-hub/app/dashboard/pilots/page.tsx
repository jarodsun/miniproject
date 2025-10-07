'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Chip,
  Pagination,
  Alert,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  Download,
  Visibility,
  MoreVert,
  Logout,
  ArrowBack,
  CheckCircle,
  Cancel,
  Image
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Pilot {
  id: string;
  name: string;
  phone: string;
  region: string;
  introduction?: string;
  licenseImages?: string;
  status?: string;
  createdAt: string;
}

interface PilotsResponse {
  pilots: Pilot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function PilotsPage() {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);
  const [selectedLicenseImages, setSelectedLicenseImages] = useState<string[]>([]);
  const router = useRouter();

  const fetchPilots = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setError('未登录，请先登录');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(region && { region })
      });

      const response = await fetch(`/api/pilots/list?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data: PilotsResponse = await response.json();
      
      if (response.ok) {
        setPilots(data.pilots);
        setPagination(data.pagination);
      } else {
        setError((data as any).message || '获取飞手列表失败');
      }
    } catch (err) {
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPilots();
  }, [page, search, region]);

  const handleSearch = () => {
    setPage(1);
    fetchPilots();
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

  const handleViewLicense = (licenseImages: string) => {
    try {
      const images = JSON.parse(licenseImages || '[]');
      setSelectedLicenseImages(images);
      setLicenseDialogOpen(true);
    } catch (error) {
      console.error('解析执照图片失败:', error);
      setError('执照图片数据格式错误');
    }
  };

  const handleApprove = async (pilotId: string) => {
    // TODO: 实现审核通过功能
    console.log('审核通过:', pilotId);
  };

  const handleReject = async (pilotId: string) => {
    // TODO: 实现审核拒绝功能
    console.log('审核拒绝:', pilotId);
  };

  const handleExport = () => {
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
  };

  if (loading && pilots.length === 0) {
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

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* 页面标题和导航 */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              飞手管理
            </Typography>
            <Typography variant="body1" color="text.secondary">
              查看和管理所有注册飞手信息
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              component={Link}
              href="/dashboard/index"
            >
              返回仪表板
            </Button>
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
        </Box>

        {/* 搜索和筛选 */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="搜索姓名或电话"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: '#667eea' }} />
                }}
              />
              <TextField
                label="筛选地区"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  startAdornment: <FilterList sx={{ mr: 1, color: '#667eea' }} />
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{ backgroundColor: '#667eea' }}
              >
                搜索
              </Button>
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={handleExport}
              >
                导出
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* 错误提示 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* 飞手列表 */}
        <Card>
          <CardContent>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>姓名</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>电话</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>地区</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>飞行执照</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>状态</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>注册时间</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pilots.map((pilot) => (
                    <TableRow key={pilot.id} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {pilot.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {pilot.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={pilot.region} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {pilot.licenseImages ? (
                          <Button
                            size="small"
                            startIcon={<Image />}
                            onClick={() => handleViewLicense(pilot.licenseImages || '')}
                            variant="outlined"
                          >
                            查看执照
                          </Button>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            未上传
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={pilot.status || '待审核'} 
                          size="small" 
                          color={pilot.status === '已通过' ? 'success' : pilot.status === '已拒绝' ? 'error' : 'warning'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(pilot.createdAt).toLocaleDateString('zh-CN')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleApprove(pilot.id)}
                            color="success"
                            variant="outlined"
                          >
                            通过
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => handleReject(pilot.id)}
                            color="error"
                            variant="outlined"
                          >
                            拒绝
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 分页 */}
            {pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pagination.pages}
                  page={page}
                  onChange={(_, newPage) => setPage(newPage)}
                  color="primary"
                />
              </Box>
            )}

            {/* 空状态 */}
            {pilots.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  暂无飞手数据
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  还没有飞手注册，请等待用户注册
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* 执照查看弹窗 */}
        <Dialog
          open={licenseDialogOpen}
          onClose={() => setLicenseDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            飞行执照查看
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {selectedLicenseImages.map((imagePath, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <img
                    src={imagePath}
                    alt={`执照图片 ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '400px',
                      objectFit: 'contain',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}
                    onError={(e) => {
                      console.error('图片加载失败:', imagePath);
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    执照图片 {index + 1}
                  </Typography>
                </Box>
              ))}
              {selectedLicenseImages.length === 0 && (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  暂无执照图片
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLicenseDialogOpen(false)}>
              关闭
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
