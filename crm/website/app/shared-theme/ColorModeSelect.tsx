import * as React from 'react';
import { useColorScheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectProps } from '@mui/material/Select';

export default function ColorModeSelect(props: SelectProps) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  // 确保组件只在客户端挂载后渲染
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 在服务器端渲染时，返回一个占位符避免布局偏移
  if (!mounted) {
    return (
      <Select
        value="system"
        disabled
        sx={{ opacity: 0.7 }}
        {...props}
      >
        <MenuItem value="system">System</MenuItem>
      </Select>
    );
  }

  // 如果模式未设置，使用默认值
  if (!mode) {
    return null;
  }

  return (
    <Select
      value={mode}
      onChange={(event) =>
        setMode(event.target.value as 'system' | 'light' | 'dark')
      }
      SelectDisplayProps={{
        // @ts-ignore
        'data-screenshot': 'toggle-mode',
      }}
      {...props}
    >
      <MenuItem value="system">System</MenuItem>
      <MenuItem value="light">Light</MenuItem>
      <MenuItem value="dark">Dark</MenuItem>
    </Select>
  );
}
