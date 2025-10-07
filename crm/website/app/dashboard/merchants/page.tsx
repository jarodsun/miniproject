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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';

interface Merchant {
  id: number;
  name: string;
  contact: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export default function MerchantsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    address: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchMerchants = async () => {
    try {
      setLoading(true);
      console.log('正在获取商家数据...');
      const response = await fetch(`/api/merchants?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`);
      console.log('API 响应状态:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('API 响应数据:', result);
        
        if (result.success && result.data) {
          setMerchants(result.data.merchants || []);
          setTotalPages(result.data.pagination?.pages || 1);
          console.log('设置商家数据:', result.data.merchants);
        } else {
          setError(result.message || '获取商家列表失败');
        }
      } else {
        const errorText = await response.text();
        console.error('API 错误响应:', errorText);
        setError('获取商家列表失败');
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
      fetchMerchants();
    }
  }, [currentPage, searchTerm, isAuthenticated]);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleOpenDialog = (merchant?: Merchant) => {
    if (merchant) {
      setEditingMerchant(merchant);
      setFormData({
        name: merchant.name,
        contact: merchant.contact,
        phone: merchant.phone,
        address: merchant.address,
      });
    } else {
      setEditingMerchant(null);
      setFormData({
        name: '',
        contact: '',
        phone: '',
        address: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMerchant(null);
    setFormData({
      name: '',
      contact: '',
      phone: '',
      address: '',
    });
  };

  const handleSave = async () => {
    try {
      const url = editingMerchant ? `/api/merchants/${editingMerchant.id}` : '/api/merchants';
      const method = editingMerchant ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        handleCloseDialog();
        fetchMerchants();
      } else {
        setError(editingMerchant ? '更新商家失败' : '创建商家失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个商家吗？')) {
      try {
        const response = await fetch(`/api/merchants/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchMerchants();
        } else {
          setError('删除商家失败');
        }
      } catch (err) {
        setError('网络错误，请重试');
      }
    }
  };

  const filteredMerchants = merchants.filter(merchant =>
    merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    merchant.phone.includes(searchTerm)
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
              商家管理
            </Typography>
            <Typography variant="body1" color="text.secondary">
              管理商家信息、联系方式、合作状态等
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
                placeholder="搜索商家名称、联系人或电话..."
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
                添加商家
              </Button>
            </Box>

            {/* 商家列表 */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>商家名称</TableCell>
                      <TableCell>联系人</TableCell>
                      <TableCell>联系电话</TableCell>
                      <TableCell>地址</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredMerchants.map((merchant) => (
                      <TableRow key={merchant.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32 }}>
                              <BusinessIcon />
                            </Avatar>
                            {merchant.name}
                          </Box>
                        </TableCell>
                        <TableCell>{merchant.contact}</TableCell>
                        <TableCell>{merchant.phone}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {merchant.address}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(merchant)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(merchant.id)}
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
          {editingMerchant ? '编辑商家' : '添加商家'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="商家名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="联系人"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            <TextField
              fullWidth
              label="联系电话"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="地址"
              multiline
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>取消</Button>
          <Button onClick={handleSave} variant="contained">
            {editingMerchant ? '更新' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>
      </AppTheme>
    </AuthGuard>
  );
}
