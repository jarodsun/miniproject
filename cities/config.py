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
TEMPLATE_DIR = BASE_DIR / "templates_index"

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
# 注意：根页面标题现在在SEO配置中定义（使用"全国"前缀）

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

# ==================== SEO配置 ====================
# 基础服务关键词列表（用于自动生成SEO信息）
BASE_SERVICE_KEYWORDS = [
    "IDC服务器托管",
    "BGP带宽",
    "云服务器",
    "海外云",
    "Deepseek",
    "云WAF",
    "CDN"
]

# 公司名称
COMPANY_NAME = "亿人互联"

# 根页面SEO信息（使用"全国"前缀）
ROOT_PAGE_TITLE = f"全国{',全国'.join(BASE_SERVICE_KEYWORDS)} - {COMPANY_NAME}"
ROOT_PAGE_KEYWORDS = f"全国{',全国'.join(BASE_SERVICE_KEYWORDS)},{COMPANY_NAME}"
ROOT_PAGE_DESCRIPTION = f"{COMPANY_NAME}全国客户服务中心，提供全国{'、全国'.join(BASE_SERVICE_KEYWORDS)}等服务，为企业提供稳定可靠的云计算解决方案。"

# 默认SEO信息（用于其他页面，当无法生成时使用）
DEFAULT_KEYWORDS = f"{','.join(BASE_SERVICE_KEYWORDS)},{COMPANY_NAME}"
DEFAULT_DESCRIPTION = f"{COMPANY_NAME}提供专业的{'、'.join(BASE_SERVICE_KEYWORDS)}等服务。"


def generate_seo_keywords(region_prefix: str) -> str:
    """
    根据地区前缀生成SEO关键词
    
    Args:
        region_prefix: 地区前缀（如"全国"、"北京市"、"北京市朝阳区"等）
        
    Returns:
        格式化的关键词字符串
    """
    keywords = [f"{region_prefix}{keyword}" for keyword in BASE_SERVICE_KEYWORDS]
    keywords.append(COMPANY_NAME)
    return ",".join(keywords)


def generate_seo_description(region_prefix: str, region_type: str = "客户服务中心") -> str:
    """
    根据地区前缀生成SEO描述
    
    Args:
        region_prefix: 地区前缀（如"全国"、"北京市"、"北京市朝阳区"等）
        region_type: 地区类型描述（如"客户服务中心"、"地区"等）
        
    Returns:
        格式化的描述字符串
    """
    services = "、".join([f"{region_prefix}{keyword}" for keyword in BASE_SERVICE_KEYWORDS])
    return f"{COMPANY_NAME}{region_prefix}{region_type}，提供{services}等服务，为企业提供稳定可靠的云计算解决方案。"


def generate_seo_title(region_prefix: str) -> str:
    """
    根据地区前缀生成SEO标题
    
    Args:
        region_prefix: 地区前缀（如"全国"、"北京市"、"北京市朝阳区"等）
        
    Returns:
        格式化的标题字符串，格式：{地区前缀}{服务1},{地区前缀}{服务2},... - {公司名}
    """
    title_parts = [f"{region_prefix}{keyword}" for keyword in BASE_SERVICE_KEYWORDS]
    return f"{','.join(title_parts)} - {COMPANY_NAME}"


def get_seo_context(page_type: str = None, **kwargs) -> Dict[str, str]:
    """
    获取SEO信息的上下文字典（用于模板渲染）
    包括页面标题、关键词和描述
    
    Args:
        page_type: 页面类型（如 "root", "province", "city", "district" 等）
        **kwargs: 页面相关的变量（如 province_name, city_name 等）
        
    Returns:
        SEO信息的上下文字典，包含 "页面标题"、"页面关键词" 和 "页面描述"
    """
    if page_type == "root":
        # 根页面使用"全国"前缀
        title = ROOT_PAGE_TITLE
        keywords = ROOT_PAGE_KEYWORDS
        description = ROOT_PAGE_DESCRIPTION
    elif page_type == "province" and "province_name" in kwargs:
        # 省份页面：使用省份名称作为前缀
        region_prefix = kwargs["province_name"]
        title = generate_seo_title(region_prefix)
        keywords = generate_seo_keywords(region_prefix)
        description = generate_seo_description(region_prefix, "地区")
    elif page_type == "municipality" and "municipality_name" in kwargs:
        # 直辖市页面：使用直辖市名称作为前缀
        region_prefix = kwargs["municipality_name"]
        title = generate_seo_title(region_prefix)
        keywords = generate_seo_keywords(region_prefix)
        description = generate_seo_description(region_prefix, "地区")
    elif page_type == "city" and "city_name" in kwargs:
        # 城市页面：使用城市名称作为前缀
        region_prefix = kwargs["city_name"]
        title = generate_seo_title(region_prefix)
        keywords = generate_seo_keywords(region_prefix)
        description = generate_seo_description(region_prefix, "地区")
    elif page_type == "district" and "district_name" in kwargs:
        # 区县页面：使用区县名称作为前缀
        region_prefix = kwargs["district_name"]
        title = generate_seo_title(region_prefix)
        keywords = generate_seo_keywords(region_prefix)
        description = generate_seo_description(region_prefix, "地区")
    elif page_type == "street" and "street_name" in kwargs:
        # 街道页面：使用街道名称作为前缀
        region_prefix = kwargs["street_name"]
        title = generate_seo_title(region_prefix)
        keywords = generate_seo_keywords(region_prefix)
        description = generate_seo_description(region_prefix, "地区")
    elif page_type == "region" and "region_name" in kwargs:
        # 区域页面（港澳台）：使用区域名称作为前缀
        region_prefix = kwargs["region_name"]
        title = generate_seo_title(region_prefix)
        keywords = generate_seo_keywords(region_prefix)
        description = generate_seo_description(region_prefix, "地区")
    elif page_type == "taiwan_city" and "city_name" in kwargs:
        # 台湾城市页面：使用城市名称作为前缀
        region_prefix = kwargs["city_name"]
        title = generate_seo_title(region_prefix)
        keywords = generate_seo_keywords(region_prefix)
        description = generate_seo_description(region_prefix, "地区")
    elif page_type == "taiwan_district" and "district_name" in kwargs:
        # 台湾区县页面：使用区县名称作为前缀
        region_prefix = kwargs["district_name"]
        title = generate_seo_title(region_prefix)
        keywords = generate_seo_keywords(region_prefix)
        description = generate_seo_description(region_prefix, "地区")
    else:
        # 使用默认SEO信息
        title = DEFAULT_TITLE
        keywords = DEFAULT_KEYWORDS
        description = DEFAULT_DESCRIPTION
    
    return {
        "页面标题": title,
        "页面关键词": keywords,
        "页面描述": description,
    }


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
# Banner 使用 Swiper 结构，与 templates_index 新样式一致
# 图片路径、alt、链接（相对于 output 目录）
BANNER_SLIDES = [
    {"path": "./images/page/banner1.jpg", "alt": "新人红包免费领", "link": "https://www.yisu.com/coupon/?f=city"},
    {"path": "./images/page/banner2.jpg", "alt": "免费试用云服务器、云数据库、CDN、短信", "link": "https://www.yisu.com/huodong/enterpriseTrial.html?f=city"},
    {"path": "./images/page/banner3.jpg", "alt": "亿速云CDN，全国加速没死角", "link": "https://www.yisu.com/cdn/huodong.html?f=city"},
]
BANNER_COUNT = len(BANNER_SLIDES)


def generate_banner_html() -> str:
    """
    生成 Banner HTML（Swiper 轮播结构，与 templates_index 新样式一致）
    
    Returns:
        Banner HTML 字符串
    """
    slides = []
    for slide in BANNER_SLIDES:
        slides.append(
            f'                    <div class="swiper-slide">\n'
            f'                        <a href="{slide["link"]}"><img src="{slide["path"]}" alt="{slide["alt"]}"></a>\n'
            f'                    </div>'
        )
    return '''            <div class="swiper-container" id="swiper-banner">
                <div class="swiper-wrapper">
''' + '\n'.join(slides) + '''
                </div>
                <div class="swiper-pagination"></div>
            </div>
'''


# ==================== 模板配置 ====================
# 默认模板文件名
DEFAULT_TEMPLATES = {
    "head": "head_template.html",
    "foot": "foot_template.html",
    "body_root": "body_root_template.html",
    "body_province": "body_province_template.html",
    "body_municipality": "body_municipality_template.html",
    "body_municipality_district": "body_municipality_district_template.html",
    "body_city": "body_city_template.html",
    "body_district": "body_district_template.html",
    "body_street": "body_street_template.html",
}

# ==================== 资源复制配置 ====================
# 需要从templates目录复制到output目录的文件夹（templates_index 使用 css, images, js）
FOLDERS_TO_COPY = ["css", "images", "js"]

# 需要从templates目录复制到output目录的文件（favicon 在 images/ 下，随文件夹复制）
FILES_TO_COPY = []

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

# 获取当前年份（用于版权信息）
def get_current_year() -> int:
    """
    获取当前年份
    
    Returns:
        当前年份（整数）
    """
    from datetime import datetime
    return datetime.now().year

CURRENT_YEAR = get_current_year()

# 直辖市数据中的"市辖区"键名
MUNICIPALITY_DISTRICTS_KEY = "市辖区"

# 首页/直辖市页右侧侧栏产品列表（与 requirements_v2 地区导航规则一致）
# (data-for, 显示名, 产品页文件名)
SIDEBAR_PRODUCTS = [
    ("cloud", "云服务器", "cloud.html"),
    ("ddos", "高防服务器", "ddos.html"),
    ("csr", "服务器托管", "csr.html"),
    ("idc", "IDC", "idc.html"),
    ("trusteeship", "机柜", "trusteeship.html"),
]

