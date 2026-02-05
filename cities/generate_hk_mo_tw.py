#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理港澳台的脚本

功能：
1. 读取 HK-MO-TW.json 数据
2. 处理香港/澳门特别行政区（特别行政区->区域->区）
3. 处理台湾省（省->市/县->区）
4. 生成港澳台二级页面（与直辖市页面结构一致，仅右侧侧栏不同）
"""

import json
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional

from common import (
    HONG_KONG, MACAO, TAIWAN,
    to_pinyin, write_html_file, rewrite_asset_prefix
)
from html_renderer import get_renderer
from config import (
    HK_MO_TW_FILE, OUTPUT_DIR, DATA_DIR,
    TITLE_TEMPLATES, DEFAULT_PAGE_URL, DEFAULT_FOOTER,
    get_product_context, get_seo_context, DEFAULT_TEMPLATES,
    SIDEBAR_PRODUCTS, generate_banner_html,
)

# 港澳台名称映射文件路径
HK_MO_TW_NAME_MAPPING_FILE = DATA_DIR / "HK-MO-TW_name_mapping.json"

# 类型定义
# 香港：[(区域名称, 区域英文路径, [(区名称, 区英文路径), ...]), ...]
RegionsWithDistricts = List[Tuple[str, str, List[Tuple[str, str]]]]
# 澳门：[(区域名称, 区域英文路径, [(堂区名称, 堂区英文路径), ...]), ...]
RegionsWithParishes = List[Tuple[str, str, List[Tuple[str, str]]]]
# 台湾：[(市/县名称, 市/县英文路径, [(区/乡镇名称, 区/乡镇英文或拼音路径), ...]), ...]
CitiesCountiesWithDistricts = List[Tuple[str, str, List[Tuple[str, str]]]]


def load_name_mapping() -> Dict[str, Any]:
    """
    加载港澳台名称映射文件
    
    Returns:
        名称映射字典
    """
    if not HK_MO_TW_NAME_MAPPING_FILE.exists():
        print(f"警告: 名称映射文件不存在: {HK_MO_TW_NAME_MAPPING_FILE}")
        return {}
    
    try:
        with open(HK_MO_TW_NAME_MAPPING_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"错误: 无法读取名称映射文件: {e}")
        return {}


def get_path_slug(chinese_name: str, mapping: Dict[str, Any], region_type: str, parent_key: Optional[str] = None) -> str:
    """
    根据中文名称获取英文路径slug
    
    Args:
        chinese_name: 中文名称
        mapping: 名称映射字典
        region_type: 区域类型（"香港", "澳门", "台湾"）
        parent_key: 父级键名（如 "regions", "districts", "parishes", "cities_counties"）
        
    Returns:
        英文路径slug，如果找不到则使用拼音
    """
    if region_type not in mapping:
        return to_pinyin(chinese_name)
    
    region_data = mapping[region_type]
    
    # 根据parent_key查找对应的映射
    if parent_key == "regions" and "regions" in region_data:
        if chinese_name in region_data["regions"]:
            return region_data["regions"][chinese_name].get("path_slug", to_pinyin(chinese_name))
    elif parent_key == "districts" and "districts" in region_data:
        if chinese_name in region_data["districts"]:
            return region_data["districts"][chinese_name].get("path_slug", to_pinyin(chinese_name))
    elif parent_key == "parishes" and "parishes" in region_data:
        if chinese_name in region_data["parishes"]:
            return region_data["parishes"][chinese_name].get("path_slug", to_pinyin(chinese_name))
    elif parent_key == "cities_counties" and "cities_counties" in region_data:
        if chinese_name in region_data["cities_counties"]:
            return region_data["cities_counties"][chinese_name].get("path_slug", to_pinyin(chinese_name))
    
    # 如果找不到，使用拼音
    return to_pinyin(chinese_name)


def build_hk_mo_tw_sidebar_html(
    region_name: str,
    regions_with_districts: Optional[RegionsWithDistricts] = None,
    regions_with_parishes: Optional[RegionsWithParishes] = None,
    cities_counties_with_districts: Optional[CitiesCountiesWithDistricts] = None,
) -> str:
    """
    港澳台页右侧侧栏：与首页一致无 sidebar-current；address-item-left 用「香港特别行政区：」等；
    address-item-right 模仿首页，dt 放区域/市/县（链接），dd 放区/堂区/乡镇（链接 | 分隔）。
    
    Args:
        region_name: 地区名称（如「香港特别行政区」「澳门特别行政区」「台湾省」）
        regions_with_districts: 香港数据 [(区域名称, 区域英文路径, [(区名称, 区英文路径), ...]), ...]
        regions_with_parishes: 澳门数据 [(区域名称, 区域英文路径, [(堂区名称, 堂区英文路径), ...]), ...]
        cities_counties_with_districts: 台湾数据 [(市/县名称, 市/县英文路径, [(区/乡镇名称, 区/乡镇英文或拼音路径), ...]), ...]
    """
    nav_items = []
    for idx, (data_for, label, _) in enumerate(SIDEBAR_PRODUCTS):
        active_class = "sidebar-nav-active" if idx == 0 else ""
        nav_items.append(
            f'<li class="{active_class}" data-for="{data_for}">{label}</li>'
        )
    nav_list_html = "\n".join(nav_items)

    # 生成 dt/dd 内容
    dt_dd_parts = []
    
    if regions_with_districts:
        # 香港：dt 区域，dd 区
        for region_name_item, region_path, districts in regions_with_districts:
            dt_part = f'<dt><a href="{region_path}/index.html">{region_name_item}</a></dt>'
            district_links = " | ".join([
                f'<a href="{region_path}/{dp}/index.html">{dn}</a>'
                for dn, dp in districts
            ])
            dd_part = f"<dd>{district_links}</dd>" if district_links else "<dd></dd>"
            dt_dd_parts.append(dt_part + dd_part)
    elif regions_with_parishes:
        # 澳门：dt 区域，dd 堂区
        for region_name_item, region_path, parishes in regions_with_parishes:
            dt_part = f'<dt><a href="{region_path}/index.html">{region_name_item}</a></dt>'
            parish_links = " | ".join([
                f'<a href="{region_path}/{pp}/index.html">{pn}</a>'
                for pn, pp in parishes
            ])
            dd_part = f"<dd>{parish_links}</dd>" if parish_links else "<dd></dd>"
            dt_dd_parts.append(dt_part + dd_part)
    elif cities_counties_with_districts:
        # 台湾：dt 市/县，dd 区/乡镇
        for city_county_name, city_county_path, districts in cities_counties_with_districts:
            dt_part = f'<dt><a href="{city_county_path}/index.html">{city_county_name}</a></dt>'
            district_links = " | ".join([
                f'<a href="{city_county_path}/{dp}/index.html">{dn}</a>'
                for dn, dp in districts
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
                            <div class="address-item-left">{region_name}：</div>
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


def generate_hk_mo_tw_html(
    region_name: str,
    regions_with_districts: Optional[RegionsWithDistricts] = None,
    regions_with_parishes: Optional[RegionsWithParishes] = None,
    cities_counties_with_districts: Optional[CitiesCountiesWithDistricts] = None,
) -> str:
    """
    生成港澳台级别 HTML。左侧与首页一致（nav、banner、5 个 list-box），右侧侧栏：香港特别行政区：、dt 区域/市/县、dd 区/堂区/乡镇。
    
    Args:
        region_name: 地区名称（如「香港特别行政区」「澳门特别行政区」「台湾省」）
        regions_with_districts: 香港数据
        regions_with_parishes: 澳门数据
        cities_counties_with_districts: 台湾数据
    """
    # 生成港澳台右侧侧栏 HTML（使用与直辖市相同的变量名以兼容模板）
    直辖市右侧侧栏 = build_hk_mo_tw_sidebar_html(
        region_name,
        regions_with_districts,
        regions_with_parishes,
        cities_counties_with_districts,
    )

    # 左侧与首页一致：banner、产品 list-boxes
    banner_html = generate_banner_html()
    product_context = get_product_context(include_products=True)
    seo_context = get_seo_context(page_type="municipality", municipality_name=region_name)

    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "banner": banner_html,
        "直辖市右侧侧栏": 直辖市右侧侧栏,  # 使用与直辖市相同的变量名以兼容模板
        "直辖市名称": region_name,  # 使用相同变量名以兼容模板
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


def build_hk_mo_tw_level3_sidebar_html(
    node_name: str,
    children: List[Tuple[str, str]],
    child_link_prefix: str = "",
) -> str:
    """
    港澳台三级页面右侧侧栏（区域页 / 市县页）：
    - 与首页结构一致，无 sidebar-current
    - address-item-left 为当前节点全称（如 香港岛： / 台北市：）
    - address-item-right 仅 dd：下级列表（区/堂区/区乡镇），多个用 | 分隔

    Args:
        node_name: 当前三级节点名称（区域名或市/县名）
        children: [(下级名称, 下级路径slug), ...]
        child_link_prefix: 子链接前缀（默认空；用于更深层页面复用时可传 "../"）
    """
    nav_items = []
    for idx, (data_for, label, _) in enumerate(SIDEBAR_PRODUCTS):
        active_class = "sidebar-nav-active" if idx == 0 else ""
        nav_items.append(f'<li class="{active_class}" data-for="{data_for}">{label}</li>')
    nav_list_html = "\n".join(nav_items)

    child_links = " | ".join([
        f'<a href="{child_link_prefix}{child_slug}/index.html">{child_name}</a>'
        for child_name, child_slug in children
    ])
    dd_content = f"<dd>{child_links}</dd>" if child_links else "<dd></dd>"

    address_lists = []
    for idx, (data_for, _, _) in enumerate(SIDEBAR_PRODUCTS):
        active = " active" if idx == 0 else ""
        block = f"""                <div class="address-list product-{data_for}{active}">
                    <ul>
                        <li>
                            <div class="address-item-left">{node_name}：</div>
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


def generate_hk_mo_tw_level3_html(
    province_name: str,
    node_name: str,
    children: List[Tuple[str, str]],
) -> str:
    """
    生成港澳台三级页面（区域页 / 市县页）HTML：
    - 左侧与首页/港澳台二级页一致（nav、banner、5 个 list-box）
    - 右侧侧栏：本节点全称 + 仅 dd 下级列表

    复用模板 `body_municipality_district_template.html`：
    - 面包屑：../../index.html -> ../index.html -> 当前节点
    - 右侧插槽：{{ 区页面右侧侧栏 | safe }}
    """
    区页面右侧侧栏 = build_hk_mo_tw_level3_sidebar_html(node_name, children)

    banner_html = generate_banner_html()
    product_context = get_product_context(include_products=True)
    seo_context = get_seo_context(page_type="district", district_name=node_name)

    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "banner": banner_html,
        "区页面右侧侧栏": 区页面右侧侧栏,
        "直辖市名称": province_name,  # 复用模板变量名：二级页名称
        "区县名称": node_name,        # 复用模板变量名：三级节点名称
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


def generate_municipality_html(municipality_name: str, districts: List[Tuple[str, str]]) -> str:
    """
    生成特别行政区级别 HTML（用于香港/澳门）
    municipality_name: 特别行政区名称
    districts: [(区域名称, 区域拼音), ...]
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
    
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="municipality", municipality_name=municipality_name)
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        "直辖市名称": municipality_name,
        "下级列表": district_list_html,
        "城市导航列表": city_nav_list_html,
        "banner": "",
        # 产品区块变量（从配置中获取）
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


def generate_region_html(region_name: str, province_name: str, districts: List[Tuple[str, str]]) -> str:
    """
    生成区域级别 HTML（用于香港/澳门的区域）
    region_name: 区域名称
    province_name: 特别行政区名称
    districts: [(区名称, 区拼音), ...]
    """
    # 生成下级列表 HTML
    district_list_html = "\n".join([
        f'        <li><a href="{district_pinyin}/index.html">{district_name}</a></li>'
        for district_name, district_pinyin in districts
    ])
    
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="region", region_name=region_name)
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        **seo_context,
        "区县名称": region_name,
        "城市名称": region_name,
        "省份名称": province_name,
        "城市链接": "../index.html",
        "省份链接": f'        <p>所属特别行政区：<a href="../index.html">{province_name}</a></p>',
        "下级列表": district_list_html,
    }
    
    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_district"],
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
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
        province_link_html = f'        <p>{nav_label}：<a href="{back_path}index.html">{region_name}</a></p>\n        <p>所属特别行政区：<a href="{back_path}../index.html">{province_name}</a></p>'
    else:
        province_link_html = f'        <p>{nav_label}：<a href="{back_path}index.html">{region_name}</a></p>\n        <p>所属省份：<a href="{back_path}../index.html">{province_name}</a></p>'
    
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="taiwan_district", district_name=district_name)
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        **seo_context,
        "区县名称": district_name,
        "城市名称": region_name,
        "省份名称": province_name,
        "城市链接": f"{back_path}index.html",
        "省份链接": province_link_html,
        "下级列表": "",  # 没有街道层级
    }
    
    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_district"],
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
    return html


def generate_province_html(province_name: str, cities: List[Tuple[str, str]]) -> str:
    """
    生成省级别 HTML（用于台湾省）
    province_name: 省份名称
    cities: [(城市名称, 城市拼音), ...]
    """
    # 生成下级列表 HTML
    city_list_html = "\n".join([
        f'        <li><a href="{city_pinyin}/index.html">{city_name}</a></li>'
        for city_name, city_pinyin in cities
    ])
    
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="province", province_name=province_name)
    
    renderer = get_renderer()
    context = {
        "当前页面URL地址": DEFAULT_PAGE_URL,
        "main_site_footer": DEFAULT_FOOTER,
        **seo_context,
        "省份名称": province_name,
        "下级列表": city_list_html,
    }
    
    html = renderer.render_html(
        head_template=DEFAULT_TEMPLATES["head"],
        body_template=DEFAULT_TEMPLATES["body_province"],
        foot_template=DEFAULT_TEMPLATES["foot"],
        context=context
    )
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
    # 生成下级列表 HTML
    district_list_html = "\n".join([
        f'        <li><a href="{district_pinyin}/index.html">{district_name}</a></li>'
        for district_name, district_pinyin in districts
    ])
    
    # 生成SEO信息（包含页面标题）
    seo_context = get_seo_context(page_type="taiwan_city", city_name=city_name)
    
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


def process_hong_kong_macao(province_name: str, province_data: Dict[str, Any], name_mapping: Dict[str, Any]):
    """
    处理香港/澳门特别行政区
    结构：特别行政区 -> 区域 -> 区（数组，没有街道）
    
    Args:
        province_name: 特别行政区名称（如「香港特别行政区」「澳门特别行政区」）
        province_data: 特别行政区数据
        name_mapping: 名称映射字典
    """
    # 获取英文路径slug
    region_key = "香港" if province_name == HONG_KONG else "澳门"
    if region_key in name_mapping:
        province_path_slug = name_mapping[region_key].get("path_slug", to_pinyin(province_name))
    else:
        province_path_slug = to_pinyin(province_name)
    
    province_dir = OUTPUT_DIR / province_path_slug
    
    if province_name == HONG_KONG:
        # 香港：收集区域和区信息
        regions_with_districts = []
        for region_name, districts_list in province_data.items():
            region_path = get_path_slug(region_name, name_mapping, region_key, "regions")
            districts = []
            for district_name in districts_list:
                district_path = get_path_slug(district_name, name_mapping, region_key, "districts")
                districts.append((district_name, district_path))
            regions_with_districts.append((region_name, region_path, districts))
        
        # 生成港澳台二级页面 HTML（与直辖市页结构一致）
        hk_mo_tw_html = generate_hk_mo_tw_html(
            province_name,
            regions_with_districts=regions_with_districts,
        )
        hk_mo_tw_file = province_dir / "index.html"
        depth = len(hk_mo_tw_file.relative_to(OUTPUT_DIR).parts) - 1
        write_html_file(hk_mo_tw_file, rewrite_asset_prefix(hk_mo_tw_html, depth))
        print(f"已生成: {province_name} 首页")
        
        # 处理每个区域
        for region_name, region_path, districts in regions_with_districts:
            region_dir = province_dir / region_path
            
            # 生成三级页面 HTML（区域页）：本区域 + 仅 dd 下级区列表
            region_html = generate_hk_mo_tw_level3_html(
                province_name=province_name,
                node_name=region_name,
                children=districts,
            )
            region_file = region_dir / "index.html"
            depth = len(region_file.relative_to(OUTPUT_DIR).parts) - 1
            write_html_file(region_file, rewrite_asset_prefix(region_html, depth))
            print(f"  已生成: {region_name} 首页")
            
            # 处理每个区（没有街道层级）
            for district_name, district_path in districts:
                district_dir = region_dir / district_path
                
                # 生成区级别 HTML（没有街道）
                district_html = generate_district_only_html(
                    district_name,
                    region_name,
                    province_name,
                    "../",  # back_path
                    True  # is_region
                )
                district_file = district_dir / "index.html"
                depth = len(district_file.relative_to(OUTPUT_DIR).parts) - 1
                write_html_file(district_file, rewrite_asset_prefix(district_html, depth))
                print(f"    已生成: {district_name} 首页")
    
    elif province_name == MACAO:
        # 澳门：收集区域和堂区信息
        regions_with_parishes = []
        for region_name, parishes_list in province_data.items():
            region_path = get_path_slug(region_name, name_mapping, region_key, "regions")
            parishes = []
            for parish_name in parishes_list:
                # 映射文件中包含括号的完整名称（如「嘉模堂区（氹仔）」），直接使用完整名称查找
                parish_path = get_path_slug(parish_name, name_mapping, region_key, "parishes")
                parishes.append((parish_name, parish_path))
            regions_with_parishes.append((region_name, region_path, parishes))
        
        # 生成港澳台二级页面 HTML（与直辖市页结构一致）
        hk_mo_tw_html = generate_hk_mo_tw_html(
            province_name,
            regions_with_parishes=regions_with_parishes,
        )
        hk_mo_tw_file = province_dir / "index.html"
        depth = len(hk_mo_tw_file.relative_to(OUTPUT_DIR).parts) - 1
        write_html_file(hk_mo_tw_file, rewrite_asset_prefix(hk_mo_tw_html, depth))
        print(f"已生成: {province_name} 首页")
        
        # 处理每个区域
        for region_name, region_path, parishes in regions_with_parishes:
            region_dir = province_dir / region_path
            
            # 生成三级页面 HTML（区域页）：本区域 + 仅 dd 下级堂区列表
            region_html = generate_hk_mo_tw_level3_html(
                province_name=province_name,
                node_name=region_name,
                children=parishes,
            )
            region_file = region_dir / "index.html"
            depth = len(region_file.relative_to(OUTPUT_DIR).parts) - 1
            write_html_file(region_file, rewrite_asset_prefix(region_html, depth))
            print(f"  已生成: {region_name} 首页")
            
            # 处理每个堂区（没有街道层级）
            for parish_name, parish_path in parishes:
                parish_dir = region_dir / parish_path
                
                # 生成堂区级别 HTML（没有街道）
                district_html = generate_district_only_html(
                    parish_name,
                    region_name,
                    province_name,
                    "../",  # back_path
                    True  # is_region
                )
                district_file = parish_dir / "index.html"
                depth = len(district_file.relative_to(OUTPUT_DIR).parts) - 1
                write_html_file(district_file, rewrite_asset_prefix(district_html, depth))
                print(f"    已生成: {parish_name} 首页")


def process_taiwan(province_name: str, province_data: Dict[str, Any], name_mapping: Dict[str, Any]):
    """
    处理台湾省
    结构：省 -> 市/县 -> 区（数组，没有街道）
    
    Args:
        province_name: 省份名称（「台湾省」）
        province_data: 省份数据
        name_mapping: 名称映射字典
    """
    # 获取英文路径slug
    region_key = "台湾"
    if region_key in name_mapping:
        province_path_slug = name_mapping[region_key].get("path_slug", to_pinyin(province_name))
    else:
        province_path_slug = to_pinyin(province_name)
    
    province_dir = OUTPUT_DIR / province_path_slug
    
    # 收集市/县和区/乡镇信息
    cities_counties_with_districts = []
    for city_county_name, districts_list in province_data.items():
        city_county_path = get_path_slug(city_county_name, name_mapping, region_key, "cities_counties")
        districts = []
        for district_name in districts_list:
            # 台湾的区/乡镇如果没有专用英文，使用拼音
            district_path = to_pinyin(district_name)
            districts.append((district_name, district_path))
        cities_counties_with_districts.append((city_county_name, city_county_path, districts))
    
    # 生成港澳台二级页面 HTML（与直辖市页结构一致）
    hk_mo_tw_html = generate_hk_mo_tw_html(
        province_name,
        cities_counties_with_districts=cities_counties_with_districts,
    )
    hk_mo_tw_file = province_dir / "index.html"
    depth = len(hk_mo_tw_file.relative_to(OUTPUT_DIR).parts) - 1
    write_html_file(hk_mo_tw_file, rewrite_asset_prefix(hk_mo_tw_html, depth))
    print(f"已生成: {province_name} 首页")
    
    # 处理每个市/县
    for city_county_name, city_county_path, districts in cities_counties_with_districts:
        city_dir = province_dir / city_county_path
        
        # 生成三级页面 HTML（市/县页）：本市/县 + 仅 dd 下级区/乡镇列表
        city_html = generate_hk_mo_tw_level3_html(
            province_name=province_name,
            node_name=city_county_name,
            children=districts,
        )
        city_file = city_dir / "index.html"
        depth = len(city_file.relative_to(OUTPUT_DIR).parts) - 1
        write_html_file(city_file, rewrite_asset_prefix(city_html, depth))
        print(f"  已生成: {city_county_name} 首页")
        
        # 处理每个区/乡镇（没有街道层级）
        for district_name, district_path in districts:
            district_dir = city_dir / district_path
            
            # 生成区级别 HTML（没有街道）
            district_html = generate_district_only_html(
                district_name,
                city_county_name,
                province_name,
                "../",  # back_path
                False  # is_region (台湾是城市，不是区域)
            )
            district_file = district_dir / "index.html"
            depth = len(district_file.relative_to(OUTPUT_DIR).parts) - 1
            write_html_file(district_file, rewrite_asset_prefix(district_html, depth))
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
    
    # 加载名称映射
    print("正在加载名称映射文件...")
    name_mapping = load_name_mapping()
    
    # 处理每个特别行政区/省
    print("\n开始生成 HTML 文件...")
    total_provinces = len(data)
    current = 0
    
    for province_name, province_data in data.items():
        current += 1
        print(f"\n[{current}/{total_provinces}] 处理: {province_name}")
        
        if province_name == HONG_KONG or province_name == MACAO:
            # 处理香港/澳门特别行政区
            process_hong_kong_macao(province_name, province_data, name_mapping)
        elif province_name == TAIWAN:
            # 处理台湾省
            process_taiwan(province_name, province_data, name_mapping)
        else:
            print(f"警告: 未知的省份类型: {province_name}")
    
    print(f"\n完成! 所有 HTML 文件已生成到: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()

