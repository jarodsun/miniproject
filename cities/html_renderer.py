#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML 模板渲染模块

功能：
1. 使用 Jinja2 模板引擎渲染 HTML
2. 组合 head、body、foot 三个模板生成完整 HTML
"""

from pathlib import Path
from typing import Dict, Any, Optional

try:
    from jinja2 import Environment, FileSystemLoader, TemplateNotFound
except ImportError:
    print("错误: jinja2 未安装，请运行: pip install jinja2")
    exit(1)

from config import TEMPLATE_DIR, DEFAULT_TITLE, DEFAULT_KEYWORDS, DEFAULT_DESCRIPTION


class HTMLRenderer:
    """
    HTML 模板渲染器
    
    使用 Jinja2 模板引擎，组合 head、body、foot 三个模板生成完整 HTML
    """
    
    def __init__(self, template_dir: Optional[Path] = None):
        """
        初始化模板渲染器
        
        Args:
            template_dir: 模板文件目录，默认为配置中的 TEMPLATE_DIR
        """
        if template_dir is None:
            template_dir = TEMPLATE_DIR
        
        self.template_dir = Path(template_dir)
        if not self.template_dir.exists():
            raise FileNotFoundError(f"模板目录不存在: {self.template_dir}")
        
        # 创建 Jinja2 环境
        self.env = Environment(
            loader=FileSystemLoader(str(self.template_dir)),
            autoescape=True,  # 自动转义 HTML 特殊字符
            trim_blocks=True,  # 去除块前后的空白
            lstrip_blocks=True  # 去除行首的空白
        )
        
        # 将默认SEO信息添加到全局模板变量中
        self.env.globals['DEFAULT_TITLE'] = DEFAULT_TITLE
        self.env.globals['DEFAULT_KEYWORDS'] = DEFAULT_KEYWORDS
        self.env.globals['DEFAULT_DESCRIPTION'] = DEFAULT_DESCRIPTION
    
    def render_html(
        self,
        head_template: str = "head_template.html",
        body_template: str = "body_province_template.html",
        foot_template: str = "foot_template.html",
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        组合三个模板生成完整 HTML
        
        Args:
            head_template: head 模板文件名
            body_template: body 模板文件名
            foot_template: foot 模板文件名
            context: 模板变量字典
            
        Returns:
            完整的 HTML 字符串
        """
        if context is None:
            context = {}
        
        try:
            # 渲染 head 模板
            head_content = self.env.get_template(head_template).render(**context)
            
            # 渲染 body 模板
            body_content = self.env.get_template(body_template).render(**context)
            
            # 渲染 foot 模板
            foot_content = self.env.get_template(foot_template).render(**context)
            
            # 组合三个部分
            # head_template.html 包含了从 <!DOCTYPE> 到 header 结束的所有内容，包括 </body></html>
            # body_template.html 包含主要内容（在 <body> 标签内）
            # foot_template.html 包含 footer 和 </body></html>
            # 
            # 组合策略：
            # 1. 从 head 中提取 </body> 之前的部分
            # 2. 插入 body 内容
            # 3. 使用 foot 的 </body></html> 部分（如果 foot 包含的话）
            if "</body>" in head_content:
                # 在 head 的 </body> 之前插入 body 内容
                head_parts = head_content.split("</body>", 1)
                if len(head_parts) == 2:
                    # 如果 foot 包含 </body>，使用 foot 的结束标签
                    if "</body>" in foot_content:
                        foot_parts = foot_content.split("</body>", 1)
                        # head 前半部分 + body 内容 + foot 的 </body></html>
                        html = head_parts[0] + body_content + "</body>" + (foot_parts[1] if len(foot_parts) > 1 else "")
                    else:
                        # foot 不包含 </body>，使用 head 的 </body></html>，然后添加 foot
                        html = head_parts[0] + body_content + "</body>" + head_parts[1] + foot_content
                else:
                    # 如果没有正确分割，直接拼接
                    html = head_content + body_content + foot_content
            else:
                # 如果 head 不包含 </body>，直接拼接（这种情况不应该发生）
                html = head_content + body_content + foot_content
            
            return html
            
        except TemplateNotFound as e:
            raise FileNotFoundError(f"模板文件未找到: {e}")
        except Exception as e:
            raise RuntimeError(f"模板渲染失败: {e}")


# 创建全局单例实例
_renderer: Optional[HTMLRenderer] = None


def get_renderer() -> HTMLRenderer:
    """
    获取全局模板渲染器实例（单例模式）
    
    Returns:
        HTMLRenderer 实例
    """
    global _renderer
    if _renderer is None:
        _renderer = HTMLRenderer()
    return _renderer

