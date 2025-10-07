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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AppTheme from '../../../shared-theme/AppTheme';
import UserInfo from '../../components/UserInfo';
import AuthGuard from '../../components/AuthGuard';
import ThemeToggle from '../../components/ThemeToggle';

interface Product {
  id: string;
  name: string;
  specification: string;
  unit: string;
}

interface Merchant {
  id: string;
  name: string;
  contact: string;
  phone: string;
}

interface Transaction {
  id: string;
  product: Product;
  merchant?: Merchant;
  type: 'INBOUND' | 'OUTBOUND';
  quantity: number;
  date: string;
  notes: string;
  createdAt: string;
}

interface Statistics {
  inboundTotal: number;
  outboundTotal: number;
  netChange: number;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({ inboundTotal: 0, outboundTotal: 0, netChange: 0 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 筛选条件
  const [filters, setFilters] = useState({
    search: '',
    productId: '',
    merchantId: '',
    type: '',
    startDate: '',
    endDate: ''
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

  // 获取库存流水
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (filters.search) params.append('search', filters.search);
      if (filters.productId) params.append('productId', filters.productId);
      if (filters.merchantId) params.append('merchantId', filters.merchantId);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`/api/inventory/transactions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data.transactions);
        setTotalPages(data.data.pagination.pages);
        setTotal(data.data.pagination.total);
        setStatistics(data.data.statistics);
      }
    } catch (error) {
      console.error('获取库存流水失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMerchants();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, filters]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
    setPage(1); // 重置到第一页
  };

  const handleSearch = () => {
    setPage(1);
    fetchTransactions();
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      productId: '',
      merchantId: '',
      type: '',
      startDate: '',
      endDate: ''
    });
    setPage(1);
  };

  const handleNavigateBack = () => {
    router.push('/dashboard/inventory');
  };

  const getTypeColor = (type: string) => {
    return type === 'INBOUND' ? 'success' : 'error';
  };

  const getTypeIcon = (type: string) => {
    return type === 'INBOUND' ? <TrendingUpIcon /> : <TrendingDownIcon />;
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
                    `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                库存流水
              </Typography>
              <Typography variant="h6" color="text.secondary">
                查看所有出入库历史记录
              </Typography>
            </Box>

            {/* 统计卡片 */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(3, 1fr)',
                },
                gap: 3,
                mb: 4,
              }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUpIcon color="success" sx={{ mr: 2 }} />
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        总入库量
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {statistics.inboundTotal}
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
                        总出库量
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {statistics.outboundTotal}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                      净变化
                    </Typography>
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        库存净变化
                      </Typography>
                      <Typography 
                        variant="h4" 
                        color={statistics.netChange >= 0 ? 'success.main' : 'error.main'}
                      >
                        {statistics.netChange >= 0 ? '+' : ''}{statistics.netChange}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

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
                  placeholder="货品名称、商家名称、备注等"
                />
                <FormControl fullWidth>
                  <InputLabel>货品</InputLabel>
                  <Select
                    value={filters.productId}
                    onChange={(e) => handleFilterChange('productId', e.target.value)}
                    label="货品"
                  >
                    <MenuItem value="">全部货品</MenuItem>
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>商家</InputLabel>
                  <Select
                    value={filters.merchantId}
                    onChange={(e) => handleFilterChange('merchantId', e.target.value)}
                    label="商家"
                  >
                    <MenuItem value="">全部商家</MenuItem>
                    {merchants.map((merchant) => (
                      <MenuItem key={merchant.id} value={merchant.id}>
                        {merchant.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>类型</InputLabel>
                  <Select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    label="类型"
                  >
                    <MenuItem value="">全部类型</MenuItem>
                    <MenuItem value="INBOUND">入库</MenuItem>
                    <MenuItem value="OUTBOUND">出库</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="开始日期"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="结束日期"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
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
            </Paper>

            {/* 流水记录表格 */}
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>类型</TableCell>
                    <TableCell>货品名称</TableCell>
                    <TableCell>规格</TableCell>
                    <TableCell>数量</TableCell>
                    <TableCell>单位</TableCell>
                    <TableCell>商家</TableCell>
                    <TableCell>日期</TableCell>
                    <TableCell>备注</TableCell>
                    <TableCell>创建时间</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <Chip
                          icon={getTypeIcon(transaction.type)}
                          label={transaction.type === 'INBOUND' ? '入库' : '出库'}
                          color={getTypeColor(transaction.type) as any}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={600}>
                          {transaction.product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.product.specification}</TableCell>
                      <TableCell>
                        <Typography 
                          variant="body1" 
                          fontWeight={600}
                          color={transaction.type === 'INBOUND' ? 'success.main' : 'error.main'}
                        >
                          {transaction.type === 'INBOUND' ? '+' : '-'}{transaction.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.product.unit}</TableCell>
                      <TableCell>
                        {transaction.merchant ? (
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {transaction.merchant.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {transaction.merchant.contact} - {transaction.merchant.phone}
                            </Typography>
                          </Box>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.notes || '-'}</TableCell>
                      <TableCell>{new Date(transaction.createdAt).toLocaleString()}</TableCell>
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
