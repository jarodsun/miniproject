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
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AppTheme from '../../shared-theme/AppTheme';
import { useAuth } from '../../hooks/useAuth';
import CircularProgress from '@mui/material/CircularProgress';
import UserInfo from '../components/UserInfo';
import AuthGuard from '../components/AuthGuard';
import ThemeToggle from '../components/ThemeToggle';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  InputAdornment,
  Pagination,
  Alert,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface Product {
  id: number;
  name: string;
  specification: string;
  unit: string;
  currentStock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specification: '',
    unit: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('正在获取货品数据...');
      const response = await fetch(`/api/products?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      console.log('API 响应状态:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API 响应数据:', result);
        
        if (result.success && result.data) {
          setProducts(result.data.products || []);
          setTotalPages(result.data.pagination?.pages || 1);
          console.log('设置货品数据:', result.data.products);
        } else {
          setError(result.message || '获取货品列表失败');
        }
      } else {
        const errorText = await response.text();
        console.error('API 错误响应:', errorText);
        setError('获取货品列表失败');
      }
    } catch (err) {
      console.error('网络错误:', err);
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [currentPage, searchTerm, isAuthenticated]);

  const handleGoBack = () => {
    router.push('/dashboard');
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

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        specification: product.specification,
        unit: product.unit,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        specification: '',
        unit: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      specification: '',
      unit: '',
    });
  };

  const handleSave = async () => {
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseDialog();
        fetchProducts();
      } else {
        setError(editingProduct ? '更新货品失败' : '创建货品失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个货品吗？')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchProducts();
        } else {
          setError('删除货品失败');
        }
      } catch (err) {
        setError('网络错误，请重试');
      }
    }
  };


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.specification.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              管理货品基础信息（名称、规格、单位、图片等）
            </Typography>
          </Box>

          {/* 错误提示 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* 搜索和添加按钮 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="搜索货品名称或规格..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ 
                  whiteSpace: 'nowrap',
                  px: 2
                }}
              >
                添加货品
              </Button>
              <Button
                variant="outlined"
                startIcon={<InventoryIcon />}
                onClick={() => router.push('/dashboard/inventory')}
                sx={{ 
                  whiteSpace: 'nowrap',
                  px: 2
                }}
              >
                库存管理
              </Button>
            </Box>

            {/* 货品列表 */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>货品名称</TableCell>
                      <TableCell>规格</TableCell>
                      <TableCell>单位</TableCell>
                      <TableCell>当前库存</TableCell>
                      <TableCell>库存状态</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <InventoryIcon />
                            </Avatar>
                            {product.name}
                          </Box>
                        </TableCell>
                        <TableCell>{product.specification}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
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
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(product.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                />
              </Box>
            )}
          </Paper>
        </Container>
      </Box>

      {/* 创建/编辑对话框 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingProduct ? '编辑货品' : '添加货品'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="货品名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="规格"
              value={formData.specification}
              onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
            />
            <TextField
              fullWidth
              label="单位"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              placeholder="如：个、箱、包等"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSave} variant="contained">
            {editingProduct ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
      </AppTheme>
    </AuthGuard>
  );
}
