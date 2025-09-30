import sys
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                             QHBoxLayout, QPushButton, QLabel, QStackedWidget,
                             QFrame)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

from modules.products_module import ProductsModule
from modules.merchants_module import MerchantsModule
from modules.inventory_module import InventoryModule
from modules.analysis_module import AnalysisModule
from components.dashboard import DashboardWidget


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
    def init_ui(self):
        # 设置窗口标题和大小
        self.setWindowTitle("Mini CRM - 客户关系管理系统")
        self.setGeometry(100, 100, 1200, 800)
        
        # 创建中央widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # 创建主布局
        main_layout = QHBoxLayout()
        central_widget.setLayout(main_layout)
        
        # 创建左侧导航栏
        self.create_navigation_panel(main_layout)
        
        # 创建右侧内容区域
        self.create_content_area(main_layout)
    
    def create_navigation_panel(self, parent_layout):
        """创建左侧导航面板"""
        nav_frame = QFrame()
        nav_frame.setFrameStyle(QFrame.StyledPanel)
        nav_frame.setFixedWidth(200)
        nav_frame.setStyleSheet("""
            QFrame {
                background-color: #f0f0f0;
                border-right: 1px solid #ccc;
            }
        """)
        
        nav_layout = QVBoxLayout()
        nav_frame.setLayout(nav_layout)
        
        # 标题
        title_label = QLabel("CRM 系统")
        title_label.setFont(QFont("Microsoft YaHei", 14, QFont.Bold))
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("padding: 20px; color: #333;")
        nav_layout.addWidget(title_label)
        
        # 导航按钮
        nav_buttons = [
            ("首页", self.show_dashboard),
            ("货品管理", self.show_products),
            ("商家管理", self.show_merchants),
            ("出入库管理", self.show_inventory),
            ("销售分析", self.show_analysis)
        ]
        
        for text, handler in nav_buttons:
            btn = QPushButton(text)
            btn.setFont(QFont("Microsoft YaHei", 11))
            btn.setMinimumHeight(50)
            btn.setStyleSheet("""
                QPushButton {
                    padding: 10px 20px;
                    border: none;
                    background-color: transparent;
                }
                QPushButton:hover {
                    background-color: #e0e0e0;
                }
                QPushButton:pressed {
                    background-color: #d0d0d0;
                }
            """)
            btn.clicked.connect(handler)
            nav_layout.addWidget(btn)
        
        nav_layout.addStretch()
        parent_layout.addWidget(nav_frame)
    
    def create_content_area(self, parent_layout):
        """创建右侧内容区域"""
        self.content_stack = QStackedWidget()
        parent_layout.addWidget(self.content_stack)
        
        # 创建各个页面
        self.dashboard = DashboardWidget()
        self.products_module = ProductsModule()
        self.merchants_module = MerchantsModule()
        self.inventory_module = InventoryModule()
        self.analysis_module = AnalysisModule()
        
        # 添加到堆栈
        self.content_stack.addWidget(self.dashboard)
        self.content_stack.addWidget(self.products_module)
        self.content_stack.addWidget(self.merchants_module)
        self.content_stack.addWidget(self.inventory_module)
        self.content_stack.addWidget(self.analysis_module)
        
        # 默认显示首页
        self.show_dashboard()
    
    # 导航方法
    def show_dashboard(self):
        self.content_stack.setCurrentIndex(0)
    
    def show_products(self):
        self.content_stack.setCurrentIndex(1)
    
    def show_merchants(self):
        self.content_stack.setCurrentIndex(2)
    
    def show_inventory(self):
        self.content_stack.setCurrentIndex(3)
    
    def show_analysis(self):
        self.content_stack.setCurrentIndex(4)
