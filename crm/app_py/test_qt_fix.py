#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试Qt属性设置修复
"""

import sys
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import Qt

def test_qt_attributes():
    print("测试Qt属性设置...")
    
    try:
        # 在创建QApplication之前设置Qt属性
        QApplication.setAttribute(Qt.AA_EnableHighDpiScaling, True)
        QApplication.setAttribute(Qt.AA_UseHighDpiPixmaps, True)
        print("OK Qt属性设置成功")
        
        app = QApplication(sys.argv)
        print("OK QApplication创建成功")
        
        app.setStyle('Fusion')
        print("OK 应用样式设置成功")
        
        # 测试主窗口导入
        from main_window import MainWindow
        print("OK 主窗口导入成功")
        
        # 创建主窗口（不显示）
        window = MainWindow()
        print("OK 主窗口创建成功")
        
        print("所有测试通过！程序应该能正常运行。")
        
    except Exception as e:
        print(f"ERROR 测试失败: {e}")
        return False
    
    return True

if __name__ == "__main__":
    test_qt_attributes()
