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
    BASE_DIR, OUTPUT_DIR, MUNICIPALITIES, HONG_KONG, MACAO, TAIWAN,
    to_pinyin, write_html_file
)
from html_renderer import get_renderer


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
                shixiaqu_data = province_data.get("市辖区", {})
                if shixiaqu_data:
                    districts = list(shixiaqu_data.keys())
                    district_links = " | ".join([
                        f'<a href="{province_pinyin}/{to_pinyin(district)}/index.html">{district.replace("区", "").replace("县", "")}</a>'
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
                province_display = province_name.replace("特别行政区", "")
                region_dl_items.append(f'<dt><a href="{province_pinyin}/index.html">{province_display}</a></dt><dd>{region_links}</dd>')
            
            elif province_name == TAIWAN:
                # 台湾：列出城市/县
                cities = list(province_data.keys())
                city_links = " | ".join([
                    f'<a href="{province_pinyin}/{to_pinyin(city)}/index.html">{city}</a>'
                    for city in cities
                ])
                province_display = province_name.replace("省", "")
                region_dl_items.append(f'<dt><a href="{province_pinyin}/index.html">{province_display}</a></dt><dd>{city_links}</dd>')
            
            else:
                # 普通省份：列出城市
                cities = list(province_data.keys())
                # 简化城市名称显示（移除常见的后缀）
                city_links = " | ".join([
                    f'<a href="{province_pinyin}/{to_pinyin(city)}/index.html">{city.replace("市", "").replace("地区", "").replace("自治州", "").replace("盟", "").replace("县", "")}</a>'
                    for city in cities
                ])
                # 简化省份名称显示
                province_display = province_name.replace("省", "").replace("自治区", "").replace("壮族自治区", "").replace("维吾尔自治区", "").replace("回族自治区", "")
                region_dl_items.append(f'<dt><a href="{province_pinyin}/index.html">{province_display}</a></dt><dd>{city_links}</dd>')
        
        # 组合该地区的导航（使用 <ul><li> 结构，参考页面格式）
        if region_dl_items:
            region_nav = f'<li><strong>{region_name}：</strong><dl>{"".join(region_dl_items)}</dl></li>'
            nav_items.append(region_nav)
    
    # 返回完整的导航列表，使用 <ul> 包裹
    return f'<ul class="region-nav-list">{"".join(nav_items)}</ul>'


def generate_root_html(all_data: Dict[str, Any], classified_provinces: dict) -> str:
    """
    生成根目录 index.html（所有省份/直辖市的总入口，按地区分类）
    
    Args:
        all_data: 完整的数据字典
        classified_provinces: {地区名称: [(省份名称, 省份拼音), ...], ...}
    """
    # 生成地区导航列表
    region_nav_list = generate_region_nav_list(all_data, classified_provinces)
    
    # 生成 Banner HTML（使用同一张图片进行轮播）
    banner_html = """
        <div class="banner-carousel">
            <div class="banner-item active">
                <a href="#"><img src="./assets/img/banner1.jpg" alt="活动横幅"></a>
            </div>
            <div class="banner-item">
                <a href="#"><img src="./assets/img/banner1.jpg" alt="活动横幅"></a>
            </div>
            <div class="banner-item">
                <a href="#"><img src="./assets/img/banner1.jpg" alt="活动横幅"></a>
            </div>
            <div class="banner-indicators">
                <span class="indicator active" data-slide="0"></span>
                <span class="indicator" data-slide="1"></span>
                <span class="indicator" data-slide="2"></span>
            </div>
        </div>
    """
    
    renderer = get_renderer()
    context = {
        "页面标题": "中国行政区划 - 总入口",
        "当前页面URL地址": "",
        "main_site_footer": "",
        "banner": banner_html,
        "地区导航列表": region_nav_list,
        # 产品区块变量（使用默认值）
        "产品名称1": "入门型优惠套餐",
        "地区信息1": "香港二区",
        "规格1": "1核 4G",
        "带宽1": "2M",
        "独享IP1": "1个",
        "优惠价1": "145",
        "原价1": "145",
        "购买链接1": "#",
        "产品名称2": "独立体验套餐",
        "地区信息2": "香港二区",
        "规格2": "4核 12G",
        "带宽2": "5M",
        "独享IP2": "1个",
        "优惠价2": "520",
        "原价2": "520",
        "购买链接2": "#",
        "产品名称3": "畅销独立套餐",
        "地区信息3": "华中一区",
        "规格3": "4核 8G",
        "带宽3": "10M",
        "独享IP3": "1个",
        "优惠价3": "398",
        "原价3": "553",
        "购买链接3": "#",
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

