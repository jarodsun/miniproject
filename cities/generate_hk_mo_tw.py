#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理港澳台的脚本

功能：
1. 读取 HK-MO-TW.json 数据
2. 处理香港/澳门特别行政区（特别行政区->区域->区）
3. 处理台湾省（省->市/县->区）
"""

import json
from pathlib import Path
from typing import Dict, List, Any, Tuple

from common import (
    BASE_DIR, OUTPUT_DIR, HONG_KONG, MACAO, TAIWAN,
    to_pinyin, write_html_file
)


HK_MO_TW_FILE = BASE_DIR / "HK-MO-TW.json"


def generate_municipality_html(municipality_name: str, districts: List[Tuple[str, str]]) -> str:
    """
    生成特别行政区级别 HTML（用于香港/澳门）
    municipality_name: 特别行政区名称
    districts: [(区域名称, 区域拼音), ...]
    """
    district_list_html = "\n".join([
        f'        <li><a href="{district_pinyin}/index.html">{district_name}</a></li>'
        for district_name, district_pinyin in districts
    ])
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{municipality_name} - 行政区划</title>
</head>
<body>
    <div class="municipality">
        <h1>{municipality_name}</h1>
        <h2>下辖区域：</h2>
        <ul>
{district_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def generate_region_html(region_name: str, province_name: str, districts: List[Tuple[str, str]]) -> str:
    """
    生成区域级别 HTML（用于香港/澳门的区域）
    region_name: 区域名称
    province_name: 特别行政区名称
    districts: [(区名称, 区拼音), ...]
    """
    district_list_html = "\n".join([
        f'        <li><a href="{district_pinyin}/index.html">{district_name}</a></li>'
        for district_name, district_pinyin in districts
    ])
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{region_name} - {province_name}</title>
</head>
<body>
    <div class="region">
        <h1>{region_name}</h1>
        <p>所属特别行政区：<a href="../index.html">{province_name}</a></p>
        <h2>下辖区：</h2>
        <ul>
{district_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def generate_district_only_html(
    district_name: str,
    region_name: str,
    province_name: str,
    back_path: str = "../",
    is_region: bool = True
) -> str:
    """
    生成区级别 HTML（用于港澳台的区，没有街道层级）
    district_name: 区名称
    region_name: 区域/城市名称
    province_name: 省份/特别行政区名称
    back_path: 返回上级的路径
    is_region: 是否为区域（True=区域，False=城市）
    """
    if is_region:
        nav_label = "所属区域"
    else:
        nav_label = "所属城市"
    
    if province_name in [HONG_KONG, MACAO]:
        nav_text = f'        <p>{nav_label}：<a href="{back_path}index.html">{region_name}</a></p>\n        <p>所属特别行政区：<a href="{back_path}../index.html">{province_name}</a></p>'
    else:
        nav_text = f'        <p>{nav_label}：<a href="{back_path}index.html">{region_name}</a></p>\n        <p>所属省份：<a href="{back_path}../index.html">{province_name}</a></p>'
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{district_name} - {region_name} - {province_name}</title>
</head>
<body>
    <div class="district">
        <h1>{district_name}</h1>
{nav_text}
    </div>
</body>
</html>"""
    return html


def generate_province_html(province_name: str, cities: List[Tuple[str, str]]) -> str:
    """
    生成省级别 HTML（用于台湾省）
    province_name: 省份名称
    cities: [(城市名称, 城市拼音), ...]
    """
    city_list_html = "\n".join([
        f'        <li><a href="{city_pinyin}/index.html">{city_name}</a></li>'
        for city_name, city_pinyin in cities
    ])
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{province_name} - 行政区划</title>
</head>
<body>
    <div class="province">
        <h1>{province_name}</h1>
        <h2>下辖城市/县：</h2>
        <ul>
{city_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def generate_taiwan_city_html(
    city_name: str,
    province_name: str,
    districts: List[Tuple[str, str]]
) -> str:
    """
    生成台湾城市级别 HTML
    city_name: 城市名称
    province_name: 省份名称（台湾省）
    districts: [(区名称, 区拼音), ...]
    """
    district_list_html = "\n".join([
        f'        <li><a href="{district_pinyin}/index.html">{district_name}</a></li>'
        for district_name, district_pinyin in districts
    ])
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{city_name} - {province_name}</title>
</head>
<body>
    <div class="city">
        <h1>{city_name}</h1>
        <p>所属省份：<a href="../index.html">{province_name}</a></p>
        <h2>下辖区：</h2>
        <ul>
{district_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def process_hong_kong_macao(province_name: str, province_data: Dict[str, Any]):
    """
    处理香港/澳门特别行政区
    结构：特别行政区 -> 区域 -> 区（数组，没有街道）
    """
    province_pinyin = to_pinyin(province_name)
    province_dir = OUTPUT_DIR / province_pinyin
    
    # 收集所有区域信息
    regions = []
    for region_name, districts_list in province_data.items():
        region_pinyin = to_pinyin(region_name)
        regions.append((region_name, region_pinyin))
    
    # 生成特别行政区级别 HTML（类似直辖市）
    municipality_html = generate_municipality_html(province_name, regions)
    write_html_file(province_dir / "index.html", municipality_html)
    print(f"已生成: {province_name} 首页")
    
    # 处理每个区域
    for region_name, region_pinyin in regions:
        region_dir = province_dir / region_pinyin
        districts_list = province_data[region_name]
        
        # 收集区信息
        districts = []
        for district_name in districts_list:
            district_pinyin = to_pinyin(district_name)
            districts.append((district_name, district_pinyin))
        
        # 生成区域级别 HTML
        region_html = generate_region_html(region_name, province_name, districts)
        write_html_file(region_dir / "index.html", region_html)
        print(f"  已生成: {region_name} 首页")
        
        # 处理每个区（没有街道层级）
        for district_name, district_pinyin in districts:
            district_dir = region_dir / district_pinyin
            
            # 生成区级别 HTML（没有街道）
            district_html = generate_district_only_html(
                district_name,
                region_name,
                province_name,
                "../",  # back_path
                True  # is_region
            )
            write_html_file(district_dir / "index.html", district_html)
            print(f"    已生成: {district_name} 首页")


def process_taiwan(province_name: str, province_data: Dict[str, Any]):
    """
    处理台湾省
    结构：省 -> 市/县 -> 区（数组，没有街道）
    """
    province_pinyin = to_pinyin(province_name)
    province_dir = OUTPUT_DIR / province_pinyin
    
    # 收集所有城市/县信息
    cities = []
    for city_name, districts_list in province_data.items():
        city_pinyin = to_pinyin(city_name)
        cities.append((city_name, city_pinyin))
    
    # 生成省级别 HTML
    province_html = generate_province_html(province_name, cities)
    write_html_file(province_dir / "index.html", province_html)
    print(f"已生成: {province_name} 首页")
    
    # 处理每个城市/县
    for city_name, city_pinyin in cities:
        city_dir = province_dir / city_pinyin
        districts_list = province_data[city_name]
        
        # 收集区信息
        districts = []
        for district_name in districts_list:
            district_pinyin = to_pinyin(district_name)
            districts.append((district_name, district_pinyin))
        
        # 生成市级别 HTML
        city_html = generate_taiwan_city_html(
            city_name,
            province_name,
            districts
        )
        write_html_file(city_dir / "index.html", city_html)
        print(f"  已生成: {city_name} 首页")
        
        # 处理每个区（没有街道层级）
        for district_name, district_pinyin in districts:
            district_dir = city_dir / district_pinyin
            
            # 生成区级别 HTML（没有街道）
            district_html = generate_district_only_html(
                district_name,
                city_name,
                province_name,
                "../",  # back_path
                False  # is_region (台湾是城市，不是区域)
            )
            write_html_file(district_dir / "index.html", district_html)
            print(f"    已生成: {district_name} 首页")


def main():
    """
    主函数
    """
    # 检查数据文件是否存在
    if not HK_MO_TW_FILE.exists():
        print(f"错误: 数据文件不存在: {HK_MO_TW_FILE}")
        return
    
    # 创建输出目录
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 读取港澳台数据
    print("正在读取港澳台数据文件...")
    try:
        with open(HK_MO_TW_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"错误: 无法读取数据文件: {e}")
        return
    
    # 处理每个特别行政区/省
    print("\n开始生成 HTML 文件...")
    total_provinces = len(data)
    current = 0
    
    for province_name, province_data in data.items():
        current += 1
        print(f"\n[{current}/{total_provinces}] 处理: {province_name}")
        
        if province_name == HONG_KONG or province_name == MACAO:
            # 处理香港/澳门特别行政区
            process_hong_kong_macao(province_name, province_data)
        elif province_name == TAIWAN:
            # 处理台湾省
            process_taiwan(province_name, province_data)
        else:
            print(f"警告: 未知的省份类型: {province_name}")
    
    print(f"\n完成! 所有 HTML 文件已生成到: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

