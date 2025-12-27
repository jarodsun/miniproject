#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
主入口脚本 - 生成所有 HTML 文件

功能：
统一调用所有生成脚本，按顺序执行：
1. 生成根目录首页
2. 生成直辖市
3. 生成普通省份
4. 生成港澳台

这样只需要运行一个脚本就可以完成所有工作。
"""

import sys
import subprocess
from pathlib import Path

from common import copy_template_assets
from config import BASE_DIR, GENERATION_SCRIPTS

# 脚本列表（按执行顺序，从配置中读取）
SCRIPTS = GENERATION_SCRIPTS


def run_script(script_name: str) -> bool:
    """
    运行指定的脚本
    
    Args:
        script_name: 脚本文件名
        
    Returns:
        True 如果成功，False 如果失败
    """
    script_path = BASE_DIR / script_name
    
    if not script_path.exists():
        print(f"错误: 脚本文件不存在: {script_path}")
        return False
    
    print(f"\n{'='*60}")
    print(f"正在运行: {script_name}")
    print(f"{'='*60}\n")
    
    try:
        # 使用 subprocess 运行脚本
        result = subprocess.run(
            [sys.executable, str(script_path)],
            cwd=str(BASE_DIR),
            check=True
        )
        print(f"\n✓ {script_name} 执行成功")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n✗ {script_name} 执行失败: {e}")
        return False
    except Exception as e:
        print(f"\n✗ {script_name} 执行出错: {e}")
        return False


def main():
    """
    主函数
    """
    print("="*60)
    print("开始生成所有 HTML 文件")
    print("="*60)
    
    # 首先复制模板资源文件
    copy_template_assets()
    
    success_count = 0
    fail_count = 0
    
    # 按顺序运行所有脚本
    for script_name in SCRIPTS:
        if run_script(script_name):
            success_count += 1
        else:
            fail_count += 1
            # 继续执行下一个脚本（即使当前脚本失败）
    
    # 输出总结
    print("\n" + "="*60)
    print("执行总结")
    print("="*60)
    print(f"成功: {success_count}/{len(SCRIPTS)}")
    print(f"失败: {fail_count}/{len(SCRIPTS)}")
    
    if fail_count == 0:
        print("\n✓ 所有脚本执行成功！")
        return 0
    else:
        print(f"\n✗ 有 {fail_count} 个脚本执行失败")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)

