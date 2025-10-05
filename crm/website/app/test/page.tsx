'use client';
import { useState } from 'react';
import { Button, TextField, Box, Typography, Alert, Paper } from '@mui/material';

interface User {
  id: string;
  username: string;
  role: string;
}

export default function ApiTest() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      setMessage('');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setToken(data.data.token);
        setUser(data.data.user);
        setMessage('登录成功！');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('登录失败：' + err);
    }
  };

  const handleVerify = async () => {
    try {
      setError('');
      setMessage('');
      
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.data.user);
        setMessage('令牌验证成功！');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('验证失败：' + err);
    }
  };

  const handleLogout = async () => {
    try {
      setError('');
      setMessage('');
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setToken('');
        setUser(null);
        setMessage('登出成功！');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('登出失败：' + err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        API 测试页面
      </Typography>
      
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          登录测试
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <TextField
            label="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="small"
          />
          <TextField
            label="密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={handleLogin}>
            登录
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          令牌验证测试
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleVerify}
            disabled={!token}
          >
            验证令牌
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleLogout}
            disabled={!token}
          >
            登出
          </Button>
        </Box>
      </Paper>

      {user && (
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            用户信息
          </Typography>
          <Typography>ID: {user.id}</Typography>
          <Typography>用户名: {user.username}</Typography>
          <Typography>角色: {user.role}</Typography>
        </Paper>
      )}

      {token && (
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            JWT 令牌
          </Typography>
          <Typography 
            sx={{ 
              wordBreak: 'break-all', 
              fontSize: '0.8rem',
              backgroundColor: '#f5f5f5',
              padding: 1,
              borderRadius: 1
            }}
          >
            {token}
          </Typography>
        </Paper>
      )}

      {message && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
