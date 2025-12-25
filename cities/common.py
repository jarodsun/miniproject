#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
公共函数模块
包含所有脚本共享的工具函数
"""

import re
from pathlib import Path
from typing import List, Tuple

try:
    from pypinyin import lazy_pinyin, Style
except ImportError:
    print("错误: pypinyin 未安装，请运行: pip install pypinyin")
    exit(1)

# 配置
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"

# 四个直辖市
MUNICIPALITIES = ["北京市", "天津市", "上海市", "重庆市"]

# 港澳台
HONG_KONG = "香港特别行政区"
MACAO = "澳门特别行政区"
TAIWAN = "台湾省"


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

