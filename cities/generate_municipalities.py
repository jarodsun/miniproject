#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理直辖市的脚本

功能：
1. 读取 pcas.json 数据
2. 处理四个直辖市（市->区->街道）
"""

import json
from pathlib import Path
from typing import Dict, List, Any, Tuple

from common import (
    MUNICIPALITIES,
    to_pinyin, write_html_file
)
from html_renderer import get_renderer
from config import (
    DATA_FILE, OUTPUT_DIR,
    TITLE_TEMPLATES, DEFAULT_PAGE_URL, DEFAULT_FOOTER,
    get_product_context, DEFAULT_TEMPLATES, MUNICIPALITY_DISTRICTS_KEY
)


def generate_municipality_html(municipality_name: str, districts: List[Tuple[str, str]]) -> str:
    """
    生成直辖市级别 HTML
    municipality_name: 直辖市名称
    districts: [(区名称, 区拼音), ...]
    """
    # 生成下级列表 HTML
    district_list_html = "\n".join([
        f'        <li><a href="{district_pinyin}/index.html">{district_name}</a></li>'
        for district_name, district_pinyin in districts
    ])
    
    # 生成城市导航列表（用于复杂模板）
    city_nav_list_html = " | ".join([
        f'<a href="{district_pinyin}/index.html">{district_name}</a>'
        for district_name, district_pinyin in districts
    ])
    
    # 获取产品信息上下文（非根页面，不包含产品信息）
    product_context = get_product_context(include_products=False)
    
    # 生成页面标题
    page_title = TITLE_TEMPLATES["municipality"].format(municipality_name=municipality_name)
    
    renderer = get_renderer()
    context = {
        "页面标题": page_title,
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "直辖市名称": municipality_name,
        "下级列表": district_list_html,
        "城市导航列表": city_nav_list_html,
        "banner": "",
        # 产品区块变量（从配置中获取）
        **product_context,
    }
    
    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_municipality"],
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
    return html


def generate_district_html(
    district_name: str,
    city_name: str,
    province_name: str,
    streets: List[Tuple[str, str]],
    back_path: str = "../"
) -> str:
    """
    生成区级别 HTML（直辖市专用）
    district_name: 区名称
    city_name: 城市名称（直辖市时等于省份名称）
    province_name: 省份名称（直辖市名称）
    streets: [(街道名称, 街道拼音), ...]
    back_path: 返回上级的路径（用于生成相对链接）
    """
    # 生成下级列表 HTML
    street_list_html = "\n".join([
        f'        <li><a href="{street_pinyin}/index.html">{street_name}</a></li>'
        for street_name, street_pinyin in streets
    ])
    
    # 生成导航链接（直辖市只有城市链接，没有省份链接）
    province_link_html = f'        <p>所属城市：<a href="{back_path}index.html">{city_name}</a></p>'
    
    # 生成页面标题
    page_title = TITLE_TEMPLATES["district"].format(district_name=district_name, city_name=city_name)
    
    renderer = get_renderer()
    context = {
        "页面标题": page_title,
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "区县名称": district_name,
        "城市名称": city_name,
        "省份名称": province_name,
        "城市链接": f"{back_path}index.html",
        "省份链接": province_link_html,
        "下级列表": street_list_html,
    }
    
    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_district"],
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
    return html


def generate_street_html(
    street_name: str,
    district_name: str,
    city_name: str,
    province_name: str,
    back_path: str = "../"
) -> str:
    """
    生成街道级别 HTML（直辖市专用）
    street_name: 街道名称
    district_name: 区名称
    city_name: 城市名称（直辖市时等于省份名称）
    province_name: 省份名称（直辖市名称）
    back_path: 返回上级的路径（用于生成相对链接）
    """
    # 生成页面标题
    page_title = TITLE_TEMPLATES["street"].format(
        street_name=street_name,
        district_name=district_name,
        city_name=city_name
    )
    
    renderer = get_renderer()
    context = {
        "页面标题": page_title,
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "街道名称": street_name,
        "区县名称": district_name,
        "城市名称": city_name,
        "省份名称": province_name,
        "区县链接": f"{back_path}index.html",
        "城市链接": f"{back_path}../index.html",
        "省份链接": f"{back_path}../index.html",
    }
    
    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_street"],
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
    return html


def process_municipality(province_name: str, province_data: Dict[str, Any]):
    """
    处理直辖市
    """
    province_pinyin = to_pinyin(province_name)
    province_dir = OUTPUT_DIR / province_pinyin
    
    # 跳过"市辖区"层，直接获取区县数据
    shixiaqu_data = province_data.get(MUNICIPALITY_DISTRICTS_KEY, {})
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
                "../"  # back_path
            )
            write_html_file(street_dir / "index.html", street_html)
            print(f"    已生成: {street_name} 首页")


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
    
    # 筛选出直辖市数据
    municipality_data = {
        name: data[name] 
        for name in data.keys() 
        if name in MUNICIPALITIES
    }
    
    if not municipality_data:
        print("警告: 没有找到直辖市数据")
        return
    
    # 处理每个直辖市
    print("\n开始生成直辖市 HTML 文件...")
    total_municipalities = len(municipality_data)
    current = 0
    
    for province_name, province_data in municipality_data.items():
        current += 1
        print(f"\n[{current}/{total_municipalities}] 处理: {province_name}")
        process_municipality(province_name, province_data)
    
    print(f"\n完成! 所有直辖市 HTML 文件已生成到: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

