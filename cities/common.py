#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
公共函数模块
包含所有脚本共享的工具函数
"""

import re
import shutil
from pathlib import Path
from typing import List, Tuple

try:
    from pypinyin import lazy_pinyin, Style
except ImportError:
    print("错误: pypinyin 未安装，请运行: pip install pypinyin")
    exit(1)

# 从配置模块导入配置
from config import (
    BASE_DIR, OUTPUT_DIR, MUNICIPALITIES, HONG_KONG, MACAO, TAIWAN,
    TEMPLATE_DIR, FOLDERS_TO_COPY, FILES_TO_COPY
)


def to_pinyin(text: str) -> str:
    """
    将中文转换为拼音（全小写，无空格）
    """
    if not text:
        return ""
    # 使用 lazy_pinyin 获取拼音列表，然后连接
    pinyin_list = lazy_pinyin(text, style=Style.NORMAL)
    pinyin = "".join(pinyin_list).lower()
    # 移除特殊字符，只保留字母和数字
    pinyin = re.sub(r'[^a-z0-9]', '', pinyin)
    return pinyin


def write_html_file(file_path: Path, html_content: str):
    """
    写入 HTML 文件
    """
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)


def copy_template_assets():
    """
    将 templates 目录下的素材文件夹复制到 output 目录
    
    复制的文件夹和文件列表从 config.py 中读取
    """
    # 确保输出目录存在
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    print("正在复制模板资源文件...")
    
    # 复制文件夹
    for folder_name in FOLDERS_TO_COPY:
        src_folder = TEMPLATE_DIR / folder_name
        dst_folder = OUTPUT_DIR / folder_name
        
        if src_folder.exists() and src_folder.is_dir():
            # 如果目标文件夹已存在，先删除
            if dst_folder.exists():
                shutil.rmtree(dst_folder)
            
            # 复制整个文件夹
            shutil.copytree(src_folder, dst_folder)
            print(f"  ✓ 已复制: {folder_name}/")
        else:
            print(f"  ⚠ 警告: 源文件夹不存在: {src_folder}")
    
    # 复制文件
    for file_name in FILES_TO_COPY:
        src_file = TEMPLATE_DIR / file_name
        dst_file = OUTPUT_DIR / file_name
        
        if src_file.exists() and src_file.is_file():
            shutil.copy2(src_file, dst_file)
            print(f"  ✓ 已复制: {file_name}")
        else:
            print(f"  ⚠ 警告: 源文件不存在: {src_file}")
    
    print("模板资源文件复制完成！\n")

