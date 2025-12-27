#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
配置管理模块

统一管理所有配置项，包括：
- 路径配置
- 地区分类配置
- 页面标题配置
- 产品信息配置
- Banner配置
- 模板配置
- 资源复制配置
- 名称简化规则
"""

from pathlib import Path
from typing import List, Dict, Any

# ==================== 路径配置 ====================
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
DATA_DIR = BASE_DIR / "data"
TEMPLATE_DIR = BASE_DIR / "templates"

# 数据文件路径
DATA_FILE = DATA_DIR / "pcas.json"
HK_MO_TW_FILE = DATA_DIR / "HK-MO-TW.json"

# ==================== 地区分类配置 ====================
# 四个直辖市
MUNICIPALITIES = ["北京市", "天津市", "上海市", "重庆市"]

# 港澳台
HONG_KONG = "香港特别行政区"
MACAO = "澳门特别行政区"
TAIWAN = "台湾省"

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

# ==================== 页面标题配置 ====================
# 根页面标题
ROOT_PAGE_TITLE = "IDC服务器托管,BGP带宽,云服务器,海外云,Deepseek,云WAF,CDN | 亿人互联"

# 页面标题格式模板
TITLE_TEMPLATES = {
    "province": "{province_name}",
    "municipality": "{municipality_name}",
    "city": "{city_name} - {province_name}",
    "district": "{district_name} - {city_name}",
    "street": "{street_name} - {district_name} - {city_name}",
    "region": "{region_name} - {province_name}",
    "taiwan_city": "{city_name} - {province_name}",
    "taiwan_district": "{district_name} - {region_name} - {province_name}",
}

# 默认标题（当模板未找到时使用）
DEFAULT_TITLE = "IDC服务器托管,BGP带宽,云服务器,海外云,Deepseek,云WAF,CDN | 亿人互联"

# ==================== 产品信息配置 ====================
# 根页面产品信息（用于根目录首页）
ROOT_PAGE_PRODUCTS = {
    "产品1": {
        "产品名称": "入门型优惠套餐",
        "地区信息": "香港二区",
        "规格": "1核 4G",
        "带宽": "2M",
        "独享IP": "1个",
        "优惠价": "145",
        "原价": "145",
        "购买链接": "#",
    },
    "产品2": {
        "产品名称": "独立体验套餐",
        "地区信息": "香港二区",
        "规格": "4核 12G",
        "带宽": "5M",
        "独享IP": "1个",
        "优惠价": "520",
        "原价": "520",
        "购买链接": "#",
    },
    "产品3": {
        "产品名称": "畅销独立套餐",
        "地区信息": "华中一区",
        "规格": "4核 8G",
        "带宽": "10M",
        "独享IP": "1个",
        "优惠价": "398",
        "原价": "553",
        "购买链接": "#",
    },
}

# 空产品信息（用于非根页面，不显示产品信息）
EMPTY_PRODUCTS = {
    "产品名称1": "",
    "地区信息1": "",
    "规格1": "",
    "带宽1": "",
    "独享IP1": "",
    "优惠价1": "",
    "原价1": "",
    "购买链接1": "",
    "产品名称2": "",
    "地区信息2": "",
    "规格2": "",
    "带宽2": "",
    "独享IP2": "",
    "优惠价2": "",
    "原价2": "",
    "购买链接2": "",
    "产品名称3": "",
    "地区信息3": "",
    "规格3": "",
    "带宽3": "",
    "独享IP3": "",
    "优惠价3": "",
    "原价3": "",
    "购买链接3": "",
}


def get_product_context(include_products: bool = False) -> Dict[str, str]:
    """
    获取产品信息的上下文字典（用于模板渲染）
    
    Args:
        include_products: 是否包含产品信息（True=包含，False=空产品信息）
        
    Returns:
        产品信息的上下文字典
    """
    if include_products:
        context = {}
        for i, (key, product) in enumerate(ROOT_PAGE_PRODUCTS.items(), 1):
            context[f"产品名称{i}"] = product["产品名称"]
            context[f"地区信息{i}"] = product["地区信息"]
            context[f"规格{i}"] = product["规格"]
            context[f"带宽{i}"] = product["带宽"]
            context[f"独享IP{i}"] = product["独享IP"]
            context[f"优惠价{i}"] = product["优惠价"]
            context[f"原价{i}"] = product["原价"]
            context[f"购买链接{i}"] = product["购买链接"]
        return context
    else:
        return EMPTY_PRODUCTS.copy()


# ==================== Banner配置 ====================
# Banner图片路径（相对于output目录）
BANNER_IMAGE_PATH = "./assets/img/banner1.jpg"
BANNER_ALT_TEXT = "活动横幅"
BANNER_LINK = "#"

# Banner数量（用于轮播）
BANNER_COUNT = 3


def generate_banner_html() -> str:
    """
    生成Banner HTML（使用同一张图片进行轮播）
    
    Returns:
        Banner HTML字符串
    """
    banner_items = []
    indicators = []
    
    for i in range(BANNER_COUNT):
        active_class = "active" if i == 0 else ""
        banner_items.append(
            f'            <div class="banner-item {active_class}">\n'
            f'                <a href="{BANNER_LINK}"><img src="{BANNER_IMAGE_PATH}" alt="{BANNER_ALT_TEXT}"></a>\n'
            f'            </div>'
        )
        indicators.append(
            f'                <span class="indicator {active_class}" data-slide="{i}"></span>'
        )
    
    return f"""
        <div class="banner-carousel">
{chr(10).join(banner_items)}
            <div class="banner-indicators">
{chr(10).join(indicators)}
            </div>
        </div>
    """


# ==================== 模板配置 ====================
# 默认模板文件名
DEFAULT_TEMPLATES = {
    "head": "head_template.html",
    "foot": "foot_template.html",
    "body_root": "body_root_template.html",
    "body_province": "body_province_template.html",
    "body_municipality": "body_municipality_template.html",
    "body_city": "body_city_template.html",
    "body_district": "body_district_template.html",
    "body_street": "body_street_template.html",
}

# ==================== 资源复制配置 ====================
# 需要从templates目录复制到output目录的文件夹
FOLDERS_TO_COPY = ["assets", "common", "css", "js", "vender"]

# 需要从templates目录复制到output目录的文件
FILES_TO_COPY = ["favicon.ico"]

# ==================== 名称简化规则配置 ====================
# 城市名称简化规则（用于显示，移除后缀）
CITY_NAME_SUFFIXES_TO_REMOVE = ["市", "地区", "自治州", "盟", "县"]

# 省份名称简化规则（用于显示，移除后缀）
PROVINCE_NAME_SUFFIXES_TO_REMOVE = [
    "省",
    "自治区",
    "壮族自治区",
    "维吾尔自治区",
    "回族自治区",
]

# 区县名称简化规则（用于显示，移除后缀）
DISTRICT_NAME_SUFFIXES_TO_REMOVE = ["区", "县"]

# 特别行政区名称简化规则（用于显示，移除后缀）
SPECIAL_REGION_SUFFIXES_TO_REMOVE = ["特别行政区"]


def simplify_city_name(city_name: str) -> str:
    """
    简化城市名称（移除后缀）
    
    Args:
        city_name: 城市名称
        
    Returns:
        简化后的城市名称
    """
    result = city_name
    for suffix in CITY_NAME_SUFFIXES_TO_REMOVE:
        result = result.replace(suffix, "")
    return result


def simplify_province_name(province_name: str) -> str:
    """
    简化省份名称（移除后缀）
    
    Args:
        province_name: 省份名称
        
    Returns:
        简化后的省份名称
    """
    result = province_name
    for suffix in PROVINCE_NAME_SUFFIXES_TO_REMOVE:
        result = result.replace(suffix, "")
    return result


def simplify_district_name(district_name: str) -> str:
    """
    简化区县名称（移除后缀）
    
    Args:
        district_name: 区县名称
        
    Returns:
        简化后的区县名称
    """
    result = district_name
    for suffix in DISTRICT_NAME_SUFFIXES_TO_REMOVE:
        result = result.replace(suffix, "")
    return result


def simplify_special_region_name(region_name: str) -> str:
    """
    简化特别行政区名称（移除后缀）
    
    Args:
        region_name: 特别行政区名称
        
    Returns:
        简化后的特别行政区名称
    """
    result = region_name
    for suffix in SPECIAL_REGION_SUFFIXES_TO_REMOVE:
        result = result.replace(suffix, "")
    return result


# ==================== 生成脚本配置 ====================
# 生成脚本执行顺序（在generate_all.py中使用）
GENERATION_SCRIPTS = [
    "generate_root_index.py",
    "generate_municipalities.py",
    # "generate_provinces.py",
    # "generate_hk_mo_tw.py",
]

# ==================== 其他配置 ====================
# 默认页面URL地址
DEFAULT_PAGE_URL = ""

# 默认footer内容
DEFAULT_FOOTER = ""

# 直辖市数据中的"市辖区"键名
MUNICIPALITY_DISTRICTS_KEY = "市辖区"

