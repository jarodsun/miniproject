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
from modules.theme_manager import ThemeManager
from components.dashboard import DashboardWidget


class MainWindow(QMainWindow):
    def __init__(self):
        try:
            print("MainWindow: 开始初始化...")
            super().__init__()
            print("MainWindow: 父类初始化完成")
            
            # 初始化主题管理器
            print("MainWindow: 创建主题管理器...")
            self.theme_manager = ThemeManager()
            print("MainWindow: 主题管理器创建完成")
            
            self.theme_manager.theme_changed.connect(self.on_theme_changed)
            print("MainWindow: 主题信号连接完成")
            
            print("MainWindow: 开始初始化UI...")
            self.init_ui()
            print("MainWindow: UI初始化完成")
            
        except Exception as e:
            print(f"MainWindow初始化失败: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def init_ui(self):
        try:
            print("init_ui: 开始设置窗口属性...")
            # 设置窗口标题和大小
            self.setWindowTitle("Mini CRM - 客户关系管理系统")
            self.setGeometry(100, 100, 1200, 800)
            print("init_ui: 窗口属性设置完成")
            
            # 创建中央widget
            print("init_ui: 创建中央widget...")
            central_widget = QWidget()
            self.setCentralWidget(central_widget)
            print("init_ui: 中央widget创建完成")
            
            # 创建主布局
            print("init_ui: 创建主布局...")
            main_layout = QHBoxLayout()
            central_widget.setLayout(main_layout)
            print("init_ui: 主布局创建完成")
            
            # 创建左侧导航栏
            print("init_ui: 创建导航面板...")
            self.create_navigation_panel(main_layout)
            print("init_ui: 导航面板创建完成")
            
            # 创建右侧内容区域
            print("init_ui: 创建内容区域...")
            self.create_content_area(main_layout)
            print("init_ui: 内容区域创建完成")
            
            # 应用初始主题
            print("init_ui: 应用初始主题...")
            self.apply_theme()
            print("init_ui: 初始主题应用完成")
            
        except Exception as e:
            print(f"init_ui失败: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def create_navigation_panel(self, parent_layout):
        """创建左侧导航面板"""
        nav_frame = QFrame()
        nav_frame.setFrameStyle(QFrame.StyledPanel)
        nav_frame.setFixedWidth(200)
        # 导航面板样式将在主题中设置
        
        nav_layout = QVBoxLayout()
        nav_frame.setLayout(nav_layout)
        
        # 标题
        title_label = QLabel("CRM 系统")
        title_label.setFont(QFont("Microsoft YaHei", 14, QFont.Bold))
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setStyleSheet("padding: 20px;")
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
            # 按钮样式将在主题中设置
            btn.clicked.connect(handler)
            nav_layout.addWidget(btn)
        
        nav_layout.addStretch()
        
        # 主题切换按钮
        self.theme_button = QPushButton("☀️ 浅色模式" if self.theme_manager.get_current_theme() == "dark" else "🌙 深色模式")
        self.theme_button.setFont(QFont("Microsoft YaHei", 10))
        self.theme_button.setMinimumHeight(40)
        self.theme_button.clicked.connect(self.toggle_theme)
        nav_layout.addWidget(self.theme_button)
        
        parent_layout.addWidget(nav_frame)
    
    def create_content_area(self, parent_layout):
        """创建右侧内容区域"""
        try:
            print("create_content_area: 创建内容堆栈...")
            self.content_stack = QStackedWidget()
            parent_layout.addWidget(self.content_stack)
            print("create_content_area: 内容堆栈创建完成")
            
            # 创建各个页面
            print("create_content_area: 创建Dashboard...")
            self.dashboard = DashboardWidget()
            print("create_content_area: Dashboard创建完成")
            
            print("create_content_area: 创建产品模块...")
            self.products_module = ProductsModule()
            print("create_content_area: 产品模块创建完成")
            
            print("create_content_area: 创建商家模块...")
            self.merchants_module = MerchantsModule()
            print("create_content_area: 商家模块创建完成")
            
            print("create_content_area: 创建库存模块...")
            self.inventory_module = InventoryModule()
            print("create_content_area: 库存模块创建完成")
            
            print("create_content_area: 创建分析模块...")
            self.analysis_module = AnalysisModule()
            print("create_content_area: 分析模块创建完成")
            
            # 添加到堆栈
            print("create_content_area: 添加模块到堆栈...")
            self.content_stack.addWidget(self.dashboard)
            self.content_stack.addWidget(self.products_module)
            self.content_stack.addWidget(self.merchants_module)
            self.content_stack.addWidget(self.inventory_module)
            self.content_stack.addWidget(self.analysis_module)
            print("create_content_area: 模块添加到堆栈完成")
            
            # 默认显示首页
            print("create_content_area: 显示首页...")
            self.show_dashboard()
            print("create_content_area: 首页显示完成")
            
        except Exception as e:
            print(f"create_content_area失败: {e}")
            import traceback
            traceback.print_exc()
            raise
    
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
    
    def toggle_theme(self):
        """切换主题"""
        self.theme_manager.toggle_theme()
    
    def on_theme_changed(self, theme_name):
        """主题改变时的回调"""
        # 更新主题切换按钮文本
        if theme_name == "dark":
            self.theme_button.setText("☀️ 浅色模式")
        else:
            self.theme_button.setText("🌙 深色模式")
        
        # 应用新主题
        self.apply_theme()
    
    def apply_theme(self):
        """应用当前主题"""
        styles = self.theme_manager.get_theme_styles()
        
        # 应用主窗口样式
        self.setStyleSheet(styles["main_window"])
        
        # 应用导航面板样式
        # 查找导航面板（第一个QFrame）
        frames = self.findChildren(QFrame)
        if frames:
            frames[0].setStyleSheet(styles["navigation"])
        
        # 应用内容区域样式
        self.content_stack.setStyleSheet(styles["content"])
        
        # 应用主题切换按钮样式
        self.theme_button.setStyleSheet(self.theme_manager.get_theme_button_style())
        
        # 通知所有模块更新主题
        self.update_modules_theme()
    
    def update_modules_theme(self):
        """更新所有模块的主题"""
        styles = self.theme_manager.get_theme_styles()
        
        # 更新各个模块
        if hasattr(self, 'dashboard'):
            self.dashboard.setStyleSheet(styles["content"] + styles["cards"])
        if hasattr(self, 'products_module'):
            self.products_module.setStyleSheet(styles["content"])
        if hasattr(self, 'merchants_module'):
            self.merchants_module.setStyleSheet(styles["content"])
        if hasattr(self, 'inventory_module'):
            self.inventory_module.setStyleSheet(styles["content"])
        if hasattr(self, 'analysis_module'):
            self.analysis_module.setStyleSheet(styles["content"])
            # 为分析模块的统计卡片应用主题
            if hasattr(self.analysis_module, 'apply_stat_cards_theme'):
                self.analysis_module.apply_stat_cards_theme()
        
        # 强制刷新所有子组件
        self.force_refresh_components()
    
    def force_refresh_components(self):
        """强制刷新所有子组件的样式"""
        # 强制更新所有子组件
        for widget in self.findChildren(QWidget):
            if widget != self:
                widget.update()
                widget.repaint()
