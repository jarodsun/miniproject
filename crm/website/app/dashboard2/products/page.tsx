'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  InputAdornment,
  Pagination,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import AppNavbar from '../components/AppNavbar';
import SideMenu from '../components/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';
import { useAuth } from '../../hooks/useAuth';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

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

export default function ProductsPage(props: { disableCustomTheme?: boolean }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
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
    currentStock: 0,
    imageUrl: '',
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

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <AppTheme {...props} themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </AppTheme>
    );
  }

  // 如果未认证，重定向到登录页面
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

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
        currentStock: product.currentStock,
        imageUrl: product.imageUrl || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        specification: '',
        unit: '',
        currentStock: 0,
        imageUrl: '',
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
      currentStock: 0,
      imageUrl: '',
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

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: '缺货', color: 'error' as const };
    if (stock < 10) return { label: '库存不足', color: 'warning' as const };
    return { label: '库存充足', color: 'success' as const };
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.specification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            {/* 页面标题 */}
            <Box sx={{ width: '100%', mt: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                货品管理
              </Typography>
            </Box>

            {/* 错误提示 */}
            {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* 搜索和添加按钮 */}
            <Card sx={{ width: '100%' }}>
              <CardContent>
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
                        {filteredProducts.map((product) => {
                          const stockStatus = getStockStatus(product.currentStock);
                          return (
                            <TableRow key={product.id}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {product.imageUrl ? (
                                    <Avatar
                                      src={product.imageUrl}
                                      sx={{ width: 32, height: 32 }}
                                    />
                                  ) : (
                                    <Avatar sx={{ width: 32, height: 32 }}>
                                      <InventoryIcon />
                                    </Avatar>
                                  )}
                                  {product.name}
                                </Box>
                              </TableCell>
                              <TableCell>{product.specification}</TableCell>
                              <TableCell>{product.unit}</TableCell>
                              <TableCell>{product.currentStock}</TableCell>
                              <TableCell>
                                <Chip
                                  label={stockStatus.label}
                                  color={stockStatus.color}
                                  size="small"
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
                          );
                        })}
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
              </CardContent>
            </Card>
          </Stack>
        </Box>
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
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="单位"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
              <TextField
                fullWidth
                label="当前库存"
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
              />
            </Box>
            <TextField
              fullWidth
              label="图片URL"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
  );
}