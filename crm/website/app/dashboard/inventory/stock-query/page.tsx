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
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Pagination from '@mui/material/Pagination';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningIcon from '@mui/icons-material/Warning';
import InventoryIcon from '@mui/icons-material/Inventory';
import AppTheme from '../../../shared-theme/AppTheme';
import UserInfo from '../../components/UserInfo';
import AuthGuard from '../../components/AuthGuard';
import ThemeToggle from '../../components/ThemeToggle';

interface Product {
  id: string;
  name: string;
  specification: string;
  unit: string;
  currentStock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface StockStatistics {
  totalProducts: number;
  totalStockValue: number;
  lowStockCount: number;
  zeroStockCount: number;
  averageStock: number;
}

export default function StockQueryPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [statistics, setStatistics] = useState<StockStatistics>({
    totalProducts: 0,
    totalStockValue: 0,
    lowStockCount: 0,
    zeroStockCount: 0,
    averageStock: 0
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 筛选条件
  const [filters, setFilters] = useState({
    search: '',
    stockRange: '',
    status: ''
  });

  // 获取货品列表
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/products?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.pages);
        setTotal(data.data.pagination.total);
      }
    } catch (error) {
      console.error('获取货品列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算库存统计
  const calculateStatistics = (products: Product[]) => {
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, product) => sum + product.currentStock, 0);
    const lowStockCount = products.filter(p => p.currentStock > 0 && p.currentStock < 10).length;
    const zeroStockCount = products.filter(p => p.currentStock === 0).length;
    const averageStock = totalProducts > 0 ? totalStockValue / totalProducts : 0;

    return {
      totalProducts,
      totalStockValue,
      lowStockCount,
      zeroStockCount,
      averageStock: Math.round(averageStock * 100) / 100
    };
  };

  useEffect(() => {
    fetchProducts();
  }, [page, filters]);

  useEffect(() => {
    setStatistics(calculateStatistics(products));
  }, [products]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(1);
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      stockRange: '',
      status: ''
    });
    setPage(1);
  };

  const handleNavigateBack = () => {
    router.push('/dashboard/inventory');
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: '零库存', color: 'error' as const, icon: <WarningIcon /> };
    } else if (stock < 10) {
      return { label: '库存不足', color: 'warning' as const, icon: <TrendingDownIcon /> };
    } else {
      return { label: '库存充足', color: 'success' as const, icon: <TrendingUpIcon /> };
    }
  };

  const filteredProducts = products.filter(product => {
    if (filters.status === 'low') return product.currentStock > 0 && product.currentStock < 10;
    if (filters.status === 'zero') return product.currentStock === 0;
    if (filters.status === 'sufficient') return product.currentStock >= 10;
    return true;
  });

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
                返回出入库管理
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
                库存查询
              </Typography>
              <Typography variant="h6" color="text.secondary">
                查看当前库存状态和分析
              </Typography>
            </Box>

            {/* 库存统计卡片 */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 3,
                mb: 4,
              }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InventoryIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        总货品数
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        {statistics.totalProducts}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        总库存量
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {statistics.totalStockValue}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WarningIcon color="warning" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        低库存预警
                      </Typography>
                      <Typography variant="h4" color="warning.main">
                        {statistics.lowStockCount}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDownIcon color="error" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        零库存
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {statistics.zeroStockCount}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            {/* 库存预警 */}
            {(statistics.lowStockCount > 0 || statistics.zeroStockCount > 0) && (
              <Alert severity="warning" sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  库存预警提醒
                </Typography>
                {statistics.zeroStockCount > 0 && (
                  <Typography variant="body2">
                    • 有 {statistics.zeroStockCount} 个货品库存为零，请及时补货
                  </Typography>
                )}
                {statistics.lowStockCount > 0 && (
                  <Typography variant="body2">
                    • 有 {statistics.lowStockCount} 个货品库存不足，建议关注
                  </Typography>
                )}
              </Alert>
            )}

            {/* 筛选条件 */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                筛选条件
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                  },
                  gap: 2,
                }}
              >
                <TextField
                  fullWidth
                  label="搜索关键词"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="货品名称、规格等"
                />
                <FormControl fullWidth>
                  <InputLabel>库存状态</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="库存状态"
                  >
                    <MenuItem value="">全部状态</MenuItem>
                    <MenuItem value="sufficient">库存充足</MenuItem>
                    <MenuItem value="low">库存不足</MenuItem>
                    <MenuItem value="zero">零库存</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                  >
                    搜索
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                  >
                    清除筛选
                  </Button>
                </Box>
              </Box>
            </Paper>

            {/* 库存详情表格 */}
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>货品名称</TableCell>
                    <TableCell>规格</TableCell>
                    <TableCell>单位</TableCell>
                    <TableCell>当前库存</TableCell>
                    <TableCell>库存状态</TableCell>
                    <TableCell>最后更新</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InventoryIcon color="primary" />
                          <Typography variant="body1" fontWeight={600}>
                            {product.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{product.specification}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={600} color="primary.main">
                          {product.currentStock}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStockStatus(product.currentStock).icon}
                          label={getStockStatus(product.currentStock).label}
                          color={getStockStatus(product.currentStock).color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(product.updatedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 分页 */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  共 {total} 条记录
                </Typography>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </Container>
        </Box>
      </AppTheme>
    </AuthGuard>
  );
}
