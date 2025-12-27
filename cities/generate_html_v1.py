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
DATA_FILE = BASE_DIR / "data" / "pcas.json"
HK_MO_TW_FILE = BASE_DIR / "data" / "HK-MO-TW.json"
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
    
    # 读取 pcas.json 数据
    print("正在读取数据文件...")
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"错误: 无法读取数据文件: {e}")
        return
    
    # 读取港澳台数据
    hk_mo_tw_data = {}
    if HK_MO_TW_FILE.exists():
        print("正在读取港澳台数据文件...")
        try:
            with open(HK_MO_TW_FILE, 'r', encoding='utf-8') as f:
                hk_mo_tw_data = json.load(f)
        except Exception as e:
            print(f"警告: 无法读取港澳台数据文件: {e}")
    else:
        print(f"警告: 港澳台数据文件不存在: {HK_MO_TW_FILE}")
    
    # 合并数据
    all_data = {**data, **hk_mo_tw_data}
    
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
    
    # 处理每个省份/直辖市
    print("\n开始生成 HTML 文件...")
    total_provinces = len(all_data)
    current = 0
    
    for province_name, province_data in all_data.items():
        current += 1
        print(f"\n[{current}/{total_provinces}] 处理: {province_name}")
        
        if province_name in MUNICIPALITIES:
            # 处理直辖市
            process_municipality(province_name, province_data)
        elif province_name == HONG_KONG or province_name == MACAO:
            # 处理香港/澳门特别行政区
            process_hong_kong_macao(province_name, province_data)
        elif province_name == TAIWAN:
            # 处理台湾省
            process_taiwan(province_name, province_data)
        else:
            # 处理普通省份
            process_province(province_name, province_data)
    
    print(f"\n完成! 所有 HTML 文件已生成到: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

