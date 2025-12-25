#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成根目录 index.html 的脚本

功能：
1. 读取 pcas.json 和 HK-MO-TW.json 数据
2. 生成根目录的总入口 index.html
"""

import json
from pathlib import Path
from typing import List, Tuple

from common import (
    BASE_DIR, OUTPUT_DIR,
    to_pinyin, write_html_file
)


DATA_FILE = BASE_DIR / "pcas.json"
HK_MO_TW_FILE = BASE_DIR / "HK-MO-TW.json"


def generate_root_html(provinces: List[Tuple[str, str]]) -> str:
    """
    生成根目录 index.html（所有省份/直辖市的总入口）
    provinces: [(省份/直辖市名称, 省份/直辖市拼音), ...]
    """
    province_list_html = "\n".join([
        f'        <li><a href="{province_pinyin}/index.html">{province_name}</a></li>'
        for province_name, province_pinyin in provinces
    ])
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>中国行政区划 - 总入口</title>
</head>
<body>
    <div class="root">
        <h1>中国行政区划</h1>
        <h2>省份/直辖市列表：</h2>
        <ul>
{province_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def main():
    """
    主函数
    """
    # 创建输出目录
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 读取 pcas.json 数据
    data = {}
    if DATA_FILE.exists():
        print("正在读取 pcas.json 数据文件...")
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"警告: 无法读取 pcas.json 数据文件: {e}")
    else:
        print(f"警告: pcas.json 数据文件不存在: {DATA_FILE}")
    
    # 读取港澳台数据
    hk_mo_tw_data = {}
    if HK_MO_TW_FILE.exists():
        print("正在读取 HK-MO-TW.json 数据文件...")
        try:
            with open(HK_MO_TW_FILE, 'r', encoding='utf-8') as f:
                hk_mo_tw_data = json.load(f)
        except Exception as e:
            print(f"警告: 无法读取 HK-MO-TW.json 数据文件: {e}")
    else:
        print(f"警告: HK-MO-TW.json 数据文件不存在: {HK_MO_TW_FILE}")
    
    # 合并数据
    all_data = {**data, **hk_mo_tw_data}
    
    if not all_data:
        print("错误: 没有可用的数据文件")
        return
    
    # 收集所有省份/直辖市/特别行政区信息，用于生成根目录 index.html
    provinces = []
    for province_name in all_data.keys():
        province_pinyin = to_pinyin(province_name)
        provinces.append((province_name, province_pinyin))
    
    # 按名称排序（可选，使列表更有序）
    provinces.sort(key=lambda x: x[0])
    
    # 生成根目录 index.html
    print("生成根目录 index.html...")
    root_html = generate_root_html(provinces)
    write_html_file(OUTPUT_DIR / "index.html", root_html)
    print(f"已生成: 根目录总入口 index.html")
    print(f"包含 {len(provinces)} 个省份/直辖市/特别行政区")


if __name__ == "__main__":
    main()

