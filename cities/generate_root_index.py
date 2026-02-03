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
from typing import List, Tuple, Dict, Any

from common import (
    MUNICIPALITIES, HONG_KONG, MACAO, TAIWAN,
    to_pinyin, write_html_file
)
from html_renderer import get_renderer
from config import (
    DATA_FILE, HK_MO_TW_FILE, OUTPUT_DIR,
    REGIONS, REGION_ORDER,
    DEFAULT_PAGE_URL, DEFAULT_FOOTER,
    generate_banner_html, get_product_context, get_seo_context,
    simplify_city_name, simplify_province_name, simplify_district_name,
    simplify_special_region_name, MUNICIPALITY_DISTRICTS_KEY
)


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


def generate_region_nav_list(all_data: Dict[str, Any], classified_provinces: dict) -> str:
    """
    生成地区导航列表 HTML（参考 yisu.com/city/ 的格式）
    
    Args:
        all_data: 完整的数据字典
        classified_provinces: 按地区分类的省份字典
        
    Returns:
        地区导航列表的 HTML 字符串
    """
    nav_items = []
    
    for region_name in REGION_ORDER:
        provinces = classified_provinces.get(region_name, [])
        if not provinces:
            continue
        
        # 生成该地区的导航内容
        region_dl_items = []
        
        for province_name, province_pinyin in provinces:
            province_data = all_data.get(province_name, {})
            
            if province_name in MUNICIPALITIES:
                # 直辖市：直接列出区县
                shixiaqu_data = province_data.get(MUNICIPALITY_DISTRICTS_KEY, {})
                if shixiaqu_data:
                    districts = list(shixiaqu_data.keys())
                    district_links = " | ".join([
                        f'<a href="{province_pinyin}/{to_pinyin(district)}/index.html">{simplify_district_name(district)}</a>'
                        for district in districts
                    ])
                    province_display = province_name.replace("市", "")
                    region_dl_items.append(f'<dt><a href="{province_pinyin}/index.html">{province_display}</a></dt><dd>{district_links}</dd>')
                else:
                    province_display = province_name.replace("市", "")
                    region_dl_items.append(f'<dt><a href="{province_pinyin}/index.html">{province_display}</a></dt>')
            
            elif province_name in [HONG_KONG, MACAO]:
                # 香港/澳门：列出区域
                regions = list(province_data.keys())
                region_links = " | ".join([
                    f'<a href="{province_pinyin}/{to_pinyin(region)}/index.html">{region}</a>'
                    for region in regions
                ])
                province_display = simplify_special_region_name(province_name)
                region_dl_items.append(f'<dt><a href="{province_pinyin}/index.html">{province_display}</a></dt><dd>{region_links}</dd>')
            
            elif province_name == TAIWAN:
                # 台湾：列出城市/县
                cities = list(province_data.keys())
                city_links = " | ".join([
                    f'<a href="{province_pinyin}/{to_pinyin(city)}/index.html">{city}</a>'
                    for city in cities
                ])
                province_display = simplify_province_name(province_name)
                region_dl_items.append(f'<dt><a href="{province_pinyin}/index.html">{province_display}</a></dt><dd>{city_links}</dd>')
            
            else:
                # 普通省份：列出城市
                cities = list(province_data.keys())
                # 简化城市名称显示（移除常见的后缀）
                city_links = " | ".join([
                    f'<a href="{province_pinyin}/{to_pinyin(city)}/index.html">{simplify_city_name(city)}</a>'
                    for city in cities
                ])
                # 简化省份名称显示
                province_display = simplify_province_name(province_name)
                region_dl_items.append(f'<dt><a href="{province_pinyin}/index.html">{province_display}</a></dt><dd>{city_links}</dd>')
        
        # 组合该地区的导航（使用新侧栏结构：address-item-left / address-item-right）
        if region_dl_items:
            region_nav = (
                f'<li>\n'
                f'                            <div class="address-item-left">{region_name}：</div>\n'
                f'                            <div class="address-item-right">\n'
                f'                                <dl>\n'
                f'                                    {"".join(region_dl_items)}\n'
                f'                                </dl>\n'
                f'                            </div>\n'
                f'                        </li>'
            )
            nav_items.append(region_nav)
    
    # 返回侧栏内的 <li> 列表（模板中已有 <ul> 包裹）
    return "\n                        ".join(nav_items)


def generate_root_html(all_data: Dict[str, Any], classified_provinces: dict) -> str:
    """
    生成根目录 index.html（所有省份/直辖市的总入口，按地区分类）
    
    Args:
        all_data: 完整的数据字典
        classified_provinces: {地区名称: [(省份名称, 省份拼音), ...], ...}
    """
    # 生成地区导航列表
    region_nav_list = generate_region_nav_list(all_data, classified_provinces)
    
    # 生成 Banner HTML（使用配置中的函数）
    banner_html = generate_banner_html()
    
    # 获取产品信息上下文（根页面包含产品信息）
    product_context = get_product_context(include_products=True)
    
    # 获取SEO信息（根页面使用"全国"前缀，包含页面标题）
    seo_context = get_seo_context(page_type="root")
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "banner": banner_html,
        "地区导航列表": region_nav_list,
        # 产品区块变量（从配置中获取）
        **product_context,
        # SEO信息（从配置中获取，包含页面标题、关键词、描述）
        **seo_context,
    }
    
    html = renderer.render_html(
        head_template="head_template.html",
        body_template="body_root_template.html",
        foot_template="foot_template.html",
        context=context
    )
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
    root_html = generate_root_html(all_data, classified_provinces)
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

