#!/usr/bin/env python3
"""
运行CRM应用的脚本，忽略CSS警告
"""
import sys
import warnings
import os

# 忽略PyQt5的CSS警告
warnings.filterwarnings("ignore", category=UserWarning, module="PyQt5")

# 添加当前目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from main import main
    if __name__ == "__main__":
        main()
except ImportError as e:
    print(f"导入错误: {e}")
    print("请确保所有模块文件都存在")
    sys.exit(1)
except Exception as e:
    print(f"运行错误: {e}")
    sys.exit(1)
