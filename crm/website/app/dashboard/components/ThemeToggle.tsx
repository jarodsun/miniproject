'use client';

import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import { 
  IconButton, 
  Tooltip, 
  Box, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Typography 
} from '@mui/material';
import { 
  LightMode, 
  DarkMode, 
  SettingsBrightness,
  Palette 
} from '@mui/icons-material';

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // 确保组件只在客户端挂载后渲染
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 在服务器端渲染时，返回一个占位符避免布局偏移
  if (!mounted) {
    return (
      <Box sx={{ width: 40, height: 40 }} />
    );
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModeChange = (newMode: 'light' | 'dark' | 'system') => {
    setMode(newMode);
    handleClose();
  };

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return <LightMode />;
      case 'dark':
        return <DarkMode />;
      case 'system':
      default:
        return <SettingsBrightness />;
    }
  };

  const getTooltip = () => {
    switch (mode) {
      case 'light':
        return '当前：浅色模式';
      case 'dark':
        return '当前：深色模式';
      case 'system':
      default:
        return '当前：系统模式';
    }
  };

  const getModeLabel = (modeType: 'light' | 'dark' | 'system') => {
    switch (modeType) {
      case 'light':
        return '浅色模式';
      case 'dark':
        return '深色模式';
      case 'system':
        return '系统模式';
    }
  };

  return (
    <>
      <Tooltip title={getTooltip()} arrow>
        <IconButton
          onClick={handleClick}
          sx={{
            width: 40,
            height: 40,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            '&:hover': {
              backgroundColor: 'action.hover',
              borderColor: 'primary.main',
            },
          }}
          aria-label="切换主题"
          aria-controls={open ? 'theme-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {getIcon()}
        </IconButton>
      </Tooltip>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
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
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
            主题设置
          </Typography>
        </Box>
        
        <MenuItem onClick={() => handleModeChange('light')} selected={mode === 'light'}>
          <ListItemIcon>
            <LightMode fontSize="small" />
          </ListItemIcon>
          <ListItemText>{getModeLabel('light')}</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleModeChange('dark')} selected={mode === 'dark'}>
          <ListItemIcon>
            <DarkMode fontSize="small" />
          </ListItemIcon>
          <ListItemText>{getModeLabel('dark')}</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleModeChange('system')} selected={mode === 'system'}>
          <ListItemIcon>
            <SettingsBrightness fontSize="small" />
          </ListItemIcon>
          <ListItemText>{getModeLabel('system')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
