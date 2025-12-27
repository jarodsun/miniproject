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


DATA_FILE = BASE_DIR / "data" / "pcas.json"
HK_MO_TW_FILE = BASE_DIR / "data" / "HK-MO-TW.json"

# 地区分类定义
REGIONS = {
    "直辖市": ["北京市", "天津市", "上海市", "重庆市"],
    "港澳台": ["香港特别行政区", "澳门特别行政区", "台湾省"],
    "华北地区": ["河北省", "山西省", "内蒙古自治区"],
    "东北地区": ["辽宁省", "吉林省", "黑龙江省"],
    "华东地区": ["江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省"],
    "华中地区": ["河南省", "湖北省", "湖南省"],
    "华南地区": ["广东省", "广西壮族自治区", "海南省"],
    "西南地区": ["四川省", "贵州省", "云南省", "西藏自治区"],
    "西北地区": ["陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区"],
}

# 地区显示顺序
REGION_ORDER = [
    "直辖市",
    "港澳台",
    "华北地区",
    "东北地区",
    "华东地区",
    "华中地区",
    "华南地区",
    "西南地区",
    "西北地区",
]


def classify_provinces(provinces: List[Tuple[str, str]]) -> dict:
    """
    将省份按地区分类
    
    Args:
        provinces: [(省份名称, 省份拼音), ...]
        
    Returns:
        按地区分类的字典 {地区名称: [(省份名称, 省份拼音), ...], ...}
    """
    classified = {region: [] for region in REGION_ORDER}
    unclassified = []
    
    # 创建省份名称到地区的映射
    province_to_region = {}
    for region, province_list in REGIONS.items():
        for province in province_list:
            province_to_region[province] = region
    
    # 分类省份
    for province_name, province_pinyin in provinces:
        region = province_to_region.get(province_name)
        if region:
            classified[region].append((province_name, province_pinyin))
        else:
            unclassified.append((province_name, province_pinyin))
    
    # 如果有未分类的省份，打印警告
    if unclassified:
        print(f"警告: 以下省份未分类: {[p[0] for p in unclassified]}")
        # 将未分类的省份添加到"其他"类别（如果需要）
        # classified["其他"] = unclassified
    
    # 对每个地区的省份按名称排序
    for region in classified:
        classified[region].sort(key=lambda x: x[0])
    
    return classified


def generate_root_html(classified_provinces: dict) -> str:
    """
    生成根目录 index.html（所有省份/直辖市的总入口，按地区分类）
    classified_provinces: {地区名称: [(省份名称, 省份拼音), ...], ...}
    """
    sections_html = []
    
    for region_name in REGION_ORDER:
        provinces = classified_provinces.get(region_name, [])
        if not provinces:
            continue
        
        province_list_html = "\n".join([
            f'            <li><a href="{province_pinyin}/index.html">{province_name}</a></li>'
            for province_name, province_pinyin in provinces
        ])
        
        section_html = f"""        <div class="region-section">
            <h2>{region_name}</h2>
            <ul>
{province_list_html}
            </ul>
        </div>"""
        sections_html.append(section_html)
    
    sections_content = "\n".join(sections_html)
    
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
{sections_content}
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
    
    # 按地区分类
    print("正在按地区分类省份...")
    classified_provinces = classify_provinces(provinces)
    
    # 统计总数
    total_count = sum(len(provinces) for provinces in classified_provinces.values())
    
    # 生成根目录 index.html
    print("生成根目录 index.html...")
    root_html = generate_root_html(classified_provinces)
    write_html_file(OUTPUT_DIR / "index.html", root_html)
    print(f"已生成: 根目录总入口 index.html")
    print(f"包含 {total_count} 个省份/直辖市/特别行政区")
    
    # 打印分类统计
    print("\n分类统计:")
    for region_name in REGION_ORDER:
        count = len(classified_provinces.get(region_name, []))
        if count > 0:
            print(f"  {region_name}: {count} 个")


if __name__ == "__main__":
    main()

