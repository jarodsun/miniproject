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
    to_pinyin, write_html_file, rewrite_asset_prefix
)
from html_renderer import get_renderer
from config import (
    DATA_FILE, OUTPUT_DIR,
    TITLE_TEMPLATES, DEFAULT_PAGE_URL, DEFAULT_FOOTER,
    get_product_context, get_seo_context, DEFAULT_TEMPLATES, MUNICIPALITY_DISTRICTS_KEY,
    SIDEBAR_PRODUCTS, generate_banner_html,
)

# 直辖市页侧栏：districts_with_streets = [(区名称, 区拼音, [(街道名称, 街道拼音), ...]), ...]
DistrictsWithStreets = List[Tuple[str, str, List[Tuple[str, str]]]]


def build_municipality_sidebar_html(
    municipality_name: str,
    districts_with_streets: DistrictsWithStreets,
) -> str:
    """
    直辖市页右侧侧栏：与首页一致无 sidebar-current；address-item-left 用「北京市」；
    address-item-right 模仿首页，dt 放区（链接），dd 放街道（链接 | 分隔）。
    """
    nav_items = []
    for idx, (data_for, label, _) in enumerate(SIDEBAR_PRODUCTS):
        active_class = "sidebar-nav-active" if idx == 0 else ""
        nav_items.append(
            f'<li class="{active_class}" data-for="{data_for}">{label}</li>'
        )
    nav_list_html = "\n".join(nav_items)

    # 单个 <li>：address-item-left = 北京市；address-item-right = <dl> 下多组 <dt>区</dt><dd>街道 | 街道</dd>
    dt_dd_parts = []
    for district_name, district_pinyin, streets in districts_with_streets:
        dt_part = f'<dt><a href="{district_pinyin}/index.html">{district_name}</a></dt>'
        street_links = " | ".join([
            f'<a href="{district_pinyin}/{sp}/index.html">{sn}</a>'
            for sn, sp in streets
        ])
        dd_part = f"<dd>{street_links}</dd>" if street_links else "<dd></dd>"
        dt_dd_parts.append(dt_part + dd_part)
    dl_content = "".join(dt_dd_parts)

    address_lists = []
    for idx, (data_for, label, _) in enumerate(SIDEBAR_PRODUCTS):
        active = " active" if idx == 0 else ""
        block = f"""                <div class="address-list product-{data_for}{active}">
                    <ul>
                        <li>
                            <div class="address-item-left">{municipality_name}：</div>
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


def build_district_sidebar_html(
    district_name: str,
    streets: List[Tuple[str, str]],
) -> str:
    """
    区页面右侧侧栏：与首页/直辖市页结构一致；address-item-left 用「本区全称」（如东城区：）；
    address-item-right 仅 dd 街道（无 dt），链接为 {街道拼音}/index.html。
    """
    nav_items = []
    for idx, (data_for, label, _) in enumerate(SIDEBAR_PRODUCTS):
        active_class = "sidebar-nav-active" if idx == 0 else ""
        nav_items.append(
            f'<li class="{active_class}" data-for="{data_for}">{label}</li>'
        )
    nav_list_html = "\n".join(nav_items)

    # 仅 dd：本区下街道，多个用 | 分隔，链接为 街道拼音/index.html
    street_links = " | ".join([
        f'<a href="{sp}/index.html">{sn}</a>'
        for sn, sp in streets
    ])
    dd_content = f"<dd>{street_links}</dd>" if street_links else "<dd></dd>"

    address_lists = []
    for idx, (data_for, label, _) in enumerate(SIDEBAR_PRODUCTS):
        active = " active" if idx == 0 else ""
        block = f"""                <div class="address-list product-{data_for}{active}">
                    <ul>
                        <li>
                            <div class="address-item-left">{district_name}：</div>
                            <div class="address-item-right">
                                <dl>
                                    {dd_content}
                                </dl>
                            </div>
                        </li>
                    </ul>
                </div>"""
        address_lists.append(block)

    address_lists_html = "\n".join(address_lists)

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


def generate_municipality_html(
    municipality_name: str,
    districts_with_streets: DistrictsWithStreets,
) -> str:
    """
    生成直辖市级别 HTML。左侧与首页一致（nav、banner、5 个 list-box），右侧侧栏：北京市：、dt 区、dd 街道。
    municipality_name: 直辖市名称（如 北京市）
    districts_with_streets: [(区名称, 区拼音, [(街道名称, 街道拼音), ...]), ...]
    """
    # 生成直辖市右侧侧栏 HTML（无 sidebar-current；address-item-left 北京市：；dt 区 dd 街道）
    直辖市右侧侧栏 = build_municipality_sidebar_html(municipality_name, districts_with_streets)

    # 左侧与首页一致：banner、产品 list-boxes
    banner_html = generate_banner_html()
    product_context = get_product_context(include_products=True)
    seo_context = get_seo_context(page_type="municipality", municipality_name=municipality_name)

    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "banner": banner_html,
        "直辖市右侧侧栏": 直辖市右侧侧栏,
        **product_context,
        **seo_context,
    }

    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_municipality"],
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
    return html


def generate_municipality_district_html(
    district_name: str,
    municipality_name: str,
    streets: List[Tuple[str, str]],
) -> str:
    """
    生成直辖市下区页面 HTML。左侧与首页、直辖市页完全一致（nav、banner、5 个 list-box），
    右侧侧栏：本区全称 + 仅 dd 街道。
    district_name: 区名称（如 东城区）
    municipality_name: 直辖市名称（如 北京市）
    streets: [(街道名称, 街道拼音), ...]
    """
    区页面右侧侧栏 = build_district_sidebar_html(district_name, streets)

    banner_html = generate_banner_html()
    product_context = get_product_context(include_products=True)
    seo_context = get_seo_context(page_type="district", district_name=district_name)

    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "banner": banner_html,
        "区页面右侧侧栏": 区页面右侧侧栏,
        "直辖市名称": municipality_name,
        **product_context,
        **seo_context,
    }

    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_municipality_district"],
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
    
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="district", district_name=district_name)
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "区县名称": district_name,
        "城市名称": city_name,
        "省份名称": province_name,
        "城市链接": f"{back_path}index.html",
        "省份链接": province_link_html,
        "下级列表": street_list_html,
        **seo_context,
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
    
    # 收集区县及下属街道：[(区名称, 区拼音, [(街道名称, 街道拼音), ...]), ...]
    districts_with_streets = []
    for district_name, streets_list in shixiaqu_data.items():
        district_pinyin = to_pinyin(district_name)
        streets = [(sn, to_pinyin(sn)) for sn in streets_list]
        districts_with_streets.append((district_name, district_pinyin, streets))
    
    # 生成直辖市级别 HTML（二级页需重写资源路径为 ../）
    municipality_html = generate_municipality_html(province_name, districts_with_streets)
    municipality_file = province_dir / "index.html"
    depth = len(municipality_file.relative_to(OUTPUT_DIR).parts) - 1
    write_html_file(municipality_file, rewrite_asset_prefix(municipality_html, depth))
    print(f"已生成: {province_name} 首页")
    
    # 处理每个区县
    for district_name, district_pinyin, streets in districts_with_streets:
        district_dir = province_dir / district_pinyin

        # 生成区页面 HTML（与直辖市页同布局：左侧 nav/banner/5 list-box，右侧本区+dd 街道；三级页需重写资源路径为 ../../）
        district_html = generate_municipality_district_html(
            district_name,
            province_name,  # 直辖市名称
            streets,
        )
        district_file = district_dir / "index.html"
        depth = len(district_file.relative_to(OUTPUT_DIR).parts) - 1
        write_html_file(district_file, rewrite_asset_prefix(district_html, depth))
        print(f"  已生成: {district_name} 首页")
        
        # 处理每个街道
        for street_name, street_pinyin in streets:
            street_dir = district_dir / street_pinyin
            
            # 生成街道级别 HTML（四级页需重写资源路径为 ../../../）
            street_html = generate_street_html(
                street_name,
                district_name,
                province_name,  # 直辖市时，城市名称等于省份名称
                province_name,
                "../"  # back_path
            )
            street_file = street_dir / "index.html"
            depth = len(street_file.relative_to(OUTPUT_DIR).parts) - 1
            write_html_file(street_file, rewrite_asset_prefix(street_html, depth))
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

