#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理普通省份的脚本

功能：
1. 读取 pcas.json 数据
2. 处理普通省份（省->市->区->街道）
3. 生成省份二级页面（与直辖市页面结构一致，仅右侧侧栏不同）
"""

import json
from pathlib import Path
from typing import Dict, List, Any, Tuple

from common import (
    MUNICIPALITIES,
    to_pinyin, write_html_file, rewrite_asset_prefix
)
from html_renderer import get_renderer
from config import (
    DATA_FILE, OUTPUT_DIR,
    TITLE_TEMPLATES, DEFAULT_PAGE_URL, DEFAULT_FOOTER,
    DEFAULT_TEMPLATES, get_seo_context, get_product_context,
    SIDEBAR_PRODUCTS, generate_banner_html,
)

# 类型定义
# 省份：[(市名称, 市拼音, [(区县名称, 区县拼音), ...]), ...]
CitiesWithDistricts = List[Tuple[str, str, List[Tuple[str, str]]]]


def build_province_sidebar_html(
    province_name: str,
    cities_with_districts: CitiesWithDistricts,
) -> str:
    """
    省份页右侧侧栏：与首页一致无 sidebar-current；address-item-left 用「河北省」；
    address-item-right 模仿首页，dt 放市（链接），dd 放该市下区县（链接 | 分隔）。
    
    Args:
        province_name: 省份名称（如「河北省」「广东省」）
        cities_with_districts: 城市及区县数据 [(市名称, 市拼音, [(区县名称, 区县拼音), ...]), ...]
    """
    nav_items = []
    for idx, (data_for, label, _) in enumerate(SIDEBAR_PRODUCTS):
        active_class = "sidebar-nav-active" if idx == 0 else ""
        nav_items.append(
            f'<li class="{active_class}" data-for="{data_for}">{label}</li>'
        )
    nav_list_html = "\n".join(nav_items)

    # 生成 dt/dd 内容：dt 市，dd 该市下区县
    dt_dd_parts = []
    for city_name, city_pinyin, districts in cities_with_districts:
        dt_part = f'<dt><a href="{city_pinyin}/index.html">{city_name}</a></dt>'
        district_links = " | ".join([
            f'<a href="{city_pinyin}/{district_pinyin}/index.html">{district_name}</a>'
            for district_name, district_pinyin in districts
        ])
        dd_part = f"<dd>{district_links}</dd>" if district_links else "<dd></dd>"
        dt_dd_parts.append(dt_part + dd_part)
    dl_content = "".join(dt_dd_parts)

    address_lists = []
    for idx, (data_for, label, _) in enumerate(SIDEBAR_PRODUCTS):
        active = " active" if idx == 0 else ""
        block = f"""                <div class="address-list product-{data_for}{active}">
                    <ul>
                        <li>
                            <div class="address-item-left">{province_name}：</div>
                            <div class="address-item-right">
                                <dl>
                                    {dl_content}
                                </dl>
                            </div>
                        </li>
                    </ul>
                </div>"""
        address_lists.append(block)

    address_lists_html = "\n".join(address_lists)

    # 与首页一致：无 sidebar-current，直接 sidebar-nav-list + address-list
    sidebar_html = f"""<div class="sidebar">
            <button class="sidebar-toggle" aria-label="展开地区导航">展开地区导航</button>
            <div class="sidebar-content">
                <div class="sidebar-nav-list">
                    <ul>
{nav_list_html}
                    </ul>
                </div>
{address_lists_html}
            </div>
        </div>"""
    return sidebar_html


def generate_province_html(
    province_name: str,
    cities_with_districts: CitiesWithDistricts,
) -> str:
    """
    生成省级别 HTML。左侧与首页一致（nav、banner、5 个 list-box），右侧侧栏：本省全称 + dt 市、dd 区县。
    
    Args:
        province_name: 省份名称（如「河北省」「广东省」）
        cities_with_districts: 城市及区县数据 [(市名称, 市拼音, [(区县名称, 区县拼音), ...]), ...]
    """
    # 生成省份右侧侧栏 HTML（使用与直辖市相同的变量名以兼容模板）
    直辖市右侧侧栏 = build_province_sidebar_html(
        province_name,
        cities_with_districts,
    )

    # 左侧与首页一致：banner、产品 list-boxes
    banner_html = generate_banner_html()
    product_context = get_product_context(include_products=True)
    seo_context = get_seo_context(page_type="province", province_name=province_name)

    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "banner": banner_html,
        "直辖市右侧侧栏": 直辖市右侧侧栏,  # 使用与直辖市相同的变量名以兼容模板
        "直辖市名称": province_name,  # 使用相同变量名以兼容模板
        **product_context,
        **seo_context,
    }

    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_municipality"],  # 使用与直辖市相同的模板
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
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
    # 生成下级列表 HTML
    district_list_html = "\n".join([
        f'        <li><a href="{district_pinyin}/index.html">{district_name}</a></li>'
        for district_name, district_pinyin in districts
    ])
    
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="city", city_name=city_name)
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        **seo_context,
        "城市名称": city_name,
        "省份名称": province_name,
        "省份链接": "../index.html",
        "下级列表": district_list_html,
    }
    
    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_city"],
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
    生成区级别 HTML（普通省份专用）
    district_name: 区名称
    city_name: 城市名称
    province_name: 省份名称
    streets: [(街道名称, 街道拼音), ...]
    back_path: 返回上级的路径（用于生成相对链接）
    """
    # 生成下级列表 HTML
    street_list_html = "\n".join([
        f'        <li><a href="{street_pinyin}/index.html">{street_name}</a></li>'
        for street_name, street_pinyin in streets
    ])
    
    # 生成省份链接 HTML（普通省份有城市和省份链接）
    province_link_html = f'        <p>所属城市：<a href="{back_path}index.html">{city_name}</a></p>\n        <p>所属省份：<a href="{back_path}../index.html">{province_name}</a></p>'
    
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="district", district_name=district_name)
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        **seo_context,
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
    生成街道级别 HTML（普通省份专用）
    street_name: 街道名称
    district_name: 区名称
    city_name: 城市名称
    province_name: 省份名称
    back_path: 返回上级的路径（用于生成相对链接）
    """
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="street", street_name=street_name)
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        **seo_context,
        "街道名称": street_name,
        "区县名称": district_name,
        "城市名称": city_name,
        "省份名称": province_name,
        "区县链接": f"{back_path}index.html",
        "城市链接": f"{back_path}../index.html",
        "省份链接": f"{back_path}../../index.html",
    }
    
    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_street"],
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
    return html


def process_province(province_name: str, province_data: Dict[str, Any]):
    """
    处理普通省份
    """
    province_pinyin = to_pinyin(province_name)
    province_dir = OUTPUT_DIR / province_pinyin
    
    # 收集所有城市及区县信息（用于生成省份页面侧栏）
    cities_with_districts: CitiesWithDistricts = []
    for city_name, districts_data in province_data.items():
        city_pinyin = to_pinyin(city_name)
        districts = []
        for district_name in districts_data.keys():
            district_pinyin = to_pinyin(district_name)
            districts.append((district_name, district_pinyin))
        cities_with_districts.append((city_name, city_pinyin, districts))
    
    # 生成省级别 HTML（与直辖市页面结构一致，带 banner 和侧栏）
    province_html = generate_province_html(province_name, cities_with_districts)
    province_file = province_dir / "index.html"
    depth = len(province_file.relative_to(OUTPUT_DIR).parts) - 1
    write_html_file(province_file, rewrite_asset_prefix(province_html, depth))
    print(f"已生成: {province_name} 首页")
    
    # 处理每个城市
    for city_name, city_pinyin, districts in cities_with_districts:
        city_dir = province_dir / city_pinyin
        districts_data = province_data[city_name]
        
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
    
    # 筛选出普通省份数据（排除直辖市）
    province_data = {
        name: data[name] 
        for name in data.keys() 
        if name not in MUNICIPALITIES
    }
    
    if not province_data:
        print("警告: 没有找到普通省份数据")
        return
    
    # 处理每个省份
    print("\n开始生成普通省份 HTML 文件...")
    total_provinces = len(province_data)
    current = 0
    
    for province_name, province_info in province_data.items():
        current += 1
        print(f"\n[{current}/{total_provinces}] 处理: {province_name}")
        process_province(province_name, province_info)
    
    print(f"\n完成! 所有普通省份 HTML 文件已生成到: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

