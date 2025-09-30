#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试导入脚本
"""

print("测试PyQt5导入...")
try:
    from PyQt5.QtWidgets import QApplication
    print("OK PyQt5导入成功")
except Exception as e:
    print(f"ERROR PyQt5导入失败: {e}")

print("\n测试matplotlib导入...")
try:
    import matplotlib
    matplotlib.use('Agg')  # 使用非交互式后端
    import matplotlib.pyplot as plt
    print("OK matplotlib导入成功")
except Exception as e:
    print(f"ERROR matplotlib导入失败: {e}")

print("\n测试分析模块导入...")
try:
    from modules.analysis_module import AnalysisModule
    print("OK 分析模块导入成功")
except Exception as e:
    print(f"ERROR 分析模块导入失败: {e}")

print("\n测试主窗口导入...")
try:
    from main_window import MainWindow
    print("OK 主窗口导入成功")
except Exception as e:
    print(f"ERROR 主窗口导入失败: {e}")

print("\n所有测试完成！")
