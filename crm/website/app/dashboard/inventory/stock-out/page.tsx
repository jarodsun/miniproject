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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RemoveIcon from '@mui/icons-material/Remove';
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
}

interface Merchant {
  id: string;
  name: string;
  contact: string;
  phone: string;
}

interface StockOutRecord {
  id: string;
  product: Product;
  merchant: Merchant;
  quantity: number;
  date: string;
  notes: string;
  createdAt: string;
}

export default function StockOutPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [stockOutRecords, setStockOutRecords] = useState<StockOutRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // 表单数据
  const [formData, setFormData] = useState({
    productId: '',
    merchantId: '',
    quantity: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // 获取货品列表
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error('获取货品列表失败:', error);
    }
  };

  // 获取商家列表
  const fetchMerchants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/merchants?limit=1000', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setMerchants(data.data.merchants);
      }
    } catch (error) {
      console.error('获取商家列表失败:', error);
    }
  };

  // 获取出库记录
  const fetchStockOutRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/inventory/transactions?type=OUTBOUND&page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStockOutRecords(data.data.transactions);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      console.error('获取出库记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMerchants();
    fetchStockOutRecords();
  }, [page]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      productId: '',
      merchantId: '',
      quantity: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const handleSave = async () => {
    if (!formData.productId || !formData.merchantId || !formData.quantity) {
      setSnackbar({ open: true, message: '请填写完整信息', severity: 'error' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/inventory/stock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: formData.productId,
          merchantId: formData.merchantId,
          quantity: parseInt(formData.quantity),
          date: formData.date,
          notes: formData.notes
        })
      });

      const data = await response.json();
      if (data.success) {
        setSnackbar({ open: true, message: '出库成功', severity: 'success' });
        handleClose();
        fetchStockOutRecords();
        fetchProducts(); // 刷新货品列表以更新库存
      } else {
        setSnackbar({ open: true, message: data.message || '出库失败', severity: 'error' });
      }
    } catch (error) {
      console.error('出库操作失败:', error);
      setSnackbar({ open: true, message: '出库操作失败', severity: 'error' });
    }
  };

  const handleNavigateBack = () => {
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
                    `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                出库管理
              </Typography>
              <Typography variant="h6" color="text.secondary">
                记录货品出库，关联商家信息
              </Typography>
            </Box>

            {/* 操作按钮 */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<RemoveIcon />}
                onClick={handleOpen}
                sx={{
                  py: 1.5,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                新增出库
              </Button>
            </Box>

            {/* 出库记录表格 */}
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>货品名称</TableCell>
                    <TableCell>规格</TableCell>
                    <TableCell>出库数量</TableCell>
                    <TableCell>单位</TableCell>
                    <TableCell>商家</TableCell>
                    <TableCell>出库日期</TableCell>
                    <TableCell>备注</TableCell>
                    <TableCell>创建时间</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockOutRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" fontWeight={600}>
                            {record.product.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{record.product.specification}</TableCell>
                      <TableCell>
                        <Chip
                          label={`-${record.quantity}`}
                          color="error"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{record.product.unit}</TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {record.merchant.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {record.merchant.contact} - {record.merchant.phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.notes || '-'}</TableCell>
                      <TableCell>{new Date(record.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* 分页 */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}

            {/* 出库对话框 */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
              <DialogTitle>新增出库</DialogTitle>
              <DialogContent>
                <Box sx={{ pt: 2 }}>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>选择货品</InputLabel>
                    <Select
                      value={formData.productId}
                      onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                      label="选择货品"
                    >
                      {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                          {product.name} ({product.specification}) - 当前库存: {product.currentStock}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>选择商家</InputLabel>
                    <Select
                      value={formData.merchantId}
                      onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                      label="选择商家"
                    >
                      {merchants.map((merchant) => (
                        <MenuItem key={merchant.id} value={merchant.id}>
                          {merchant.name} - {merchant.contact} ({merchant.phone})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label="出库数量"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    sx={{ mb: 3 }}
                    inputProps={{ min: 1 }}
                  />

                  <TextField
                    fullWidth
                    label="出库日期"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="备注"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="请输入出库备注信息..."
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSave} variant="contained">
                  确认出库
                </Button>
              </DialogActions>
            </Dialog>

            {/* 消息提示 */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ width: '100%' }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Container>
        </Box>
      </AppTheme>
    </AuthGuard>
  );
}
