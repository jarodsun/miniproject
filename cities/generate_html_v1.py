#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
城市数据 HTML 生成脚本 v1.0

功能：
1. 读取 pcas.json 数据
2. 直接生成省、市、区、街道四个层级的 HTML 文件（不使用模板）
3. 处理四个直辖市的特殊情况
"""

import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any, Tuple

try:
    from pypinyin import lazy_pinyin, Style
except ImportError:
    print("错误: pypinyin 未安装，请运行: pip install pypinyin")
    exit(1)

# 配置
BASE_DIR = Path(__file__).parent
DATA_FILE = BASE_DIR / "pcas.json"
OUTPUT_DIR = BASE_DIR / "output"

# 四个直辖市
MUNICIPALITIES = ["北京市", "天津市", "上海市", "重庆市"]


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


def generate_province_html(province_name: str, cities: List[Tuple[str, str]]) -> str:
    """
    生成省级别 HTML
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
        <h2>下辖城市：</h2>
        <ul>
{city_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def generate_municipality_html(municipality_name: str, districts: List[Tuple[str, str]]) -> str:
    """
    生成直辖市级别 HTML
    municipality_name: 直辖市名称
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
    <title>{municipality_name} - 行政区划</title>
</head>
<body>
    <div class="municipality">
        <h1>{municipality_name}</h1>
        <h2>下辖区县：</h2>
        <ul>
{district_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def generate_city_html(
    city_name: str,
    province_name: str,
    province_pinyin: str,
    districts: List[Tuple[str, str]]
) -> str:
    """
    生成市级别 HTML
    city_name: 城市名称
    province_name: 省份名称
    province_pinyin: 省份拼音
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
        <h2>下辖区县：</h2>
        <ul>
{district_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def generate_district_html(
    district_name: str,
    city_name: str,
    province_name: str,
    is_municipality: bool,
    streets: List[Tuple[str, str]],
    back_path: str = "../"
) -> str:
    """
    生成区级别 HTML
    district_name: 区名称
    city_name: 城市名称
    province_name: 省份名称
    is_municipality: 是否为直辖市
    streets: [(街道名称, 街道拼音), ...]
    back_path: 返回上级的路径（用于生成相对链接）
    """
    street_list_html = "\n".join([
        f'        <li><a href="{street_pinyin}/index.html">{street_name}</a></li>'
        for street_name, street_pinyin in streets
    ])
    
    # 生成导航链接
    nav_html = f'        <p>所属城市：<a href="{back_path}index.html">{city_name}</a></p>'
    if not is_municipality:
        nav_html += f'\n        <p>所属省份：<a href="{back_path}../index.html">{province_name}</a></p>'
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{district_name} - {city_name}</title>
</head>
<body>
    <div class="district">
        <h1>{district_name}</h1>
{nav_html}
        <h2>下辖街道：</h2>
        <ul>
{street_list_html}
        </ul>
    </div>
</body>
</html>"""
    return html


def generate_street_html(
    street_name: str,
    district_name: str,
    city_name: str,
    province_name: str,
    is_municipality: bool,
    back_path: str = "../"
) -> str:
    """
    生成街道级别 HTML
    street_name: 街道名称
    district_name: 区名称
    city_name: 城市名称
    province_name: 省份名称
    is_municipality: 是否为直辖市
    back_path: 返回上级的路径（用于生成相对链接）
    """
    nav_html = f'        <p>所属区县：<a href="{back_path}index.html">{district_name}</a></p>'
    nav_html += f'\n        <p>所属城市：<a href="{back_path}../index.html">{city_name}</a></p>'
    if not is_municipality:
        nav_html += f'\n        <p>所属省份：<a href="{back_path}../../index.html">{province_name}</a></p>'
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{street_name} - {district_name} - {city_name}</title>
</head>
<body>
    <div class="street">
        <h1>{street_name}</h1>
{nav_html}
    </div>
</body>
</html>"""
    return html


def write_html_file(file_path: Path, html_content: str):
    """
    写入 HTML 文件
    """
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html_content)


def process_municipality(province_name: str, province_data: Dict[str, Any]):
    """
    处理直辖市
    """
    province_pinyin = to_pinyin(province_name)
    province_dir = OUTPUT_DIR / province_pinyin
    
    # 跳过"市辖区"层，直接获取区县数据
    shixiaqu_data = province_data.get("市辖区", {})
    if not shixiaqu_data:
        print(f"警告: {province_name} 没有找到市辖区数据")
        return
    
    # 收集所有区县信息
    districts = []
    for district_name, streets_list in shixiaqu_data.items():
        district_pinyin = to_pinyin(district_name)
        districts.append((district_name, district_pinyin))
    
    # 生成直辖市级别 HTML
    municipality_html = generate_municipality_html(province_name, districts)
    write_html_file(province_dir / "index.html", municipality_html)
    print(f"已生成: {province_name} 首页")
    
    # 处理每个区县
    for district_name, district_pinyin in districts:
        district_dir = province_dir / district_pinyin
        streets_list = shixiaqu_data[district_name]
        
        # 收集街道信息
        streets = []
        for street_name in streets_list:
            street_pinyin = to_pinyin(street_name)
            streets.append((street_name, street_pinyin))
        
        # 生成区级别 HTML
        district_html = generate_district_html(
            district_name,
            province_name,  # 直辖市时，城市名称等于省份名称
            province_name,
            True,  # is_municipality
            streets,
            "../"  # back_path
        )
        write_html_file(district_dir / "index.html", district_html)
        print(f"  已生成: {district_name} 首页")
        
        # 处理每个街道
        for street_name, street_pinyin in streets:
            street_dir = district_dir / street_pinyin
            
            # 生成街道级别 HTML
            street_html = generate_street_html(
                street_name,
                district_name,
                province_name,  # 直辖市时，城市名称等于省份名称
                province_name,
                True,  # is_municipality
                "../"  # back_path
            )
            write_html_file(street_dir / "index.html", street_html)
            print(f"    已生成: {street_name} 首页")


def process_province(province_name: str, province_data: Dict[str, Any]):
    """
    处理普通省份
    """
    province_pinyin = to_pinyin(province_name)
    province_dir = OUTPUT_DIR / province_pinyin
    
    # 收集所有城市信息
    cities = []
    for city_name, districts_data in province_data.items():
        city_pinyin = to_pinyin(city_name)
        cities.append((city_name, city_pinyin))
    
    # 生成省级别 HTML
    province_html = generate_province_html(province_name, cities)
    write_html_file(province_dir / "index.html", province_html)
    print(f"已生成: {province_name} 首页")
    
    # 处理每个城市
    for city_name, city_pinyin in cities:
        city_dir = province_dir / city_pinyin
        districts_data = province_data[city_name]
        
        # 收集区县信息
        districts = []
        for district_name, streets_list in districts_data.items():
            district_pinyin = to_pinyin(district_name)
            districts.append((district_name, district_pinyin))
        
        # 生成市级别 HTML
        city_html = generate_city_html(
            city_name,
            province_name,
            province_pinyin,
            districts
        )
        write_html_file(city_dir / "index.html", city_html)
        print(f"  已生成: {city_name} 首页")
        
        # 处理每个区县
        for district_name, district_pinyin in districts:
            district_dir = city_dir / district_pinyin
            streets_list = districts_data[district_name]
            
            # 收集街道信息
            streets = []
            for street_name in streets_list:
                street_pinyin = to_pinyin(street_name)
                streets.append((street_name, street_pinyin))
            
            # 生成区级别 HTML
            district_html = generate_district_html(
                district_name,
                city_name,
                province_name,
                False,  # is_municipality
                streets,
                "../"  # back_path
            )
            write_html_file(district_dir / "index.html", district_html)
            print(f"    已生成: {district_name} 首页")
            
            # 处理每个街道
            for street_name, street_pinyin in streets:
                street_dir = district_dir / street_pinyin
                
                # 生成街道级别 HTML
                street_html = generate_street_html(
                    street_name,
                    district_name,
                    city_name,
                    province_name,
                    False,  # is_municipality
                    "../"  # back_path
                )
                write_html_file(street_dir / "index.html", street_html)
                print(f"      已生成: {street_name} 首页")


def main():
    """
    主函数
    """
    # 检查数据文件是否存在
    if not DATA_FILE.exists():
        print(f"错误: 数据文件不存在: {DATA_FILE}")
        return
    
    # 创建输出目录
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # 读取数据
    print("正在读取数据文件...")
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"错误: 无法读取数据文件: {e}")
        return
    
    # 处理每个省份/直辖市
    print("开始生成 HTML 文件...")
    total_provinces = len(data)
    current = 0
    
    for province_name, province_data in data.items():
        current += 1
        print(f"\n[{current}/{total_provinces}] 处理: {province_name}")
        
        if province_name in MUNICIPALITIES:
            # 处理直辖市
            process_municipality(province_name, province_data)
        else:
            # 处理普通省份
            process_province(province_name, province_data)
    
    print(f"\n完成! 所有 HTML 文件已生成到: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

