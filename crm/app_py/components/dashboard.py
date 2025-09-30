from PyQt5.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QLabel, QFrame
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont


class DashboardWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        # 标题
        title = QLabel("系统首页")
        title.setFont(QFont("Microsoft YaHei", 18, QFont.Bold))
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)
        
        # 欢迎信息
        welcome_label = QLabel("欢迎使用 Mini CRM 客户关系管理系统")
        welcome_label.setFont(QFont("Microsoft YaHei", 12))
        welcome_label.setAlignment(Qt.AlignCenter)
        welcome_label.setStyleSheet("padding: 20px;")
        layout.addWidget(welcome_label)
        
        # 功能卡片
        cards_layout = QHBoxLayout()
        
        # 货品管理卡片
        products_card = self.create_info_card("货品管理", "管理商品信息", "📦")
        cards_layout.addWidget(products_card)
        
        # 商家管理卡片
        merchants_card = self.create_info_card("商家管理", "管理客户信息", "🏪")
        cards_layout.addWidget(merchants_card)
        
        # 出入库卡片
        inventory_card = self.create_info_card("出入库管理", "管理库存操作", "📊")
        cards_layout.addWidget(inventory_card)
        
        # 销售分析卡片
        analysis_card = self.create_info_card("销售分析", "数据分析报表", "📈")
        cards_layout.addWidget(analysis_card)
        
        layout.addLayout(cards_layout)
        layout.addStretch()
    
    def create_info_card(self, title, description, icon):
        """创建信息卡片"""
        card = QFrame()
        card.setFrameStyle(QFrame.StyledPanel)
        # 卡片样式将在主题中设置
        card.setCursor(Qt.PointingHandCursor)
        
        layout = QVBoxLayout()
        card.setLayout(layout)
        
        # 图标
        icon_label = QLabel(icon)
        icon_label.setFont(QFont("Arial", 24))
        icon_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(icon_label)
        
        # 标题
        title_label = QLabel(title)
        title_label.setFont(QFont("Microsoft YaHei", 14, QFont.Bold))
        title_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(title_label)
        
        # 描述
        desc_label = QLabel(description)
        desc_label.setFont(QFont("Microsoft YaHei", 10))
        desc_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(desc_label)
        
        return card
