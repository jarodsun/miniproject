const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 这里可以添加需要在渲染进程中使用的 API
  // 例如：
  // openFile: () => ipcRenderer.invoke('dialog:openFile'),
  // saveFile: (content) => ipcRenderer.invoke('dialog:saveFile', content),
  
  // 获取应用版本
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // 获取平台信息
  getPlatform: () => process.platform,
  
  // 示例：显示消息
  showMessage: (message) => {
    console.log('来自主进程的消息:', message);
  }
});

// 监听来自主进程的消息
ipcRenderer.on('main-process-message', (event, message) => {
  console.log('收到主进程消息:', message);
});

// 页面加载完成后的初始化
window.addEventListener('DOMContentLoaded', () => {
  console.log('Electron 预加载脚本已加载');
});
