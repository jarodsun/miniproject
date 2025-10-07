'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

export default function UserInfo() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    // 可以添加个人资料页面路由
    console.log('跳转到个人资料页面');
  };

  const handleSettings = () => {
    handleClose();
    // 可以添加设置页面路由
    console.log('跳转到设置页面');
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ 
          ml: 2,
          '&:hover': {
            backgroundColor: 'action.hover',
          }
        }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {user.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user.role === 'admin' ? '管理员' : '用户'}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>个人资料</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>设置</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText>登出</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}
