from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QPushButton, 
                             QLabel, QTableWidget, QTableWidgetItem, QHeaderView,
                             QLineEdit, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

from dialogs.product_dialog import ProductDialog


class ProductsModule(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
        # 延迟应用主题，确保所有组件都已创建
        from PyQt5.QtCore import QTimer
        QTimer.singleShot(0, self.apply_initial_theme)
    
    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        # 标题栏
        title_layout = QHBoxLayout()
        title = QLabel("货品管理")
        title.setFont(QFont("Microsoft YaHei", 16, QFont.Bold))
        title_layout.addWidget(title)
        title_layout.addStretch()
        
        # 添加货品按钮
        add_btn = QPushButton("添加货品")
        # 按钮样式将在主题中设置
        add_btn.clicked.connect(self.show_add_product_dialog)
        title_layout.addWidget(add_btn)
        
        layout.addLayout(title_layout)
        
        # 搜索栏
        search_layout = QHBoxLayout()
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("搜索货品...")
        # 输入框样式将在主题中设置
        self.search_input.textChanged.connect(self.filter_products)
        search_layout.addWidget(self.search_input)
        search_layout.addStretch()
        layout.addLayout(search_layout)
        
        # 货品列表表格
        self.products_table = QTableWidget()
        self.products_table.setColumnCount(6)
        self.products_table.setHorizontalHeaderLabels(["ID", "货品名称", "SKU", "当前库存", "单位", "操作"])
        
        # 设置表格样式
        self.products_table.setAlternatingRowColors(True)
        self.products_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.products_table.horizontalHeader().setStretchLastSection(True)
        self.products_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        
        # 添加示例数据
        self.populate_products_table()
        
        layout.addWidget(self.products_table)
    
    def populate_products_table(self):
        """填充货品表格示例数据"""
        sample_data = [
            ["1", "苹果", "APP001", "100", "箱", "编辑 | 删除"],
            ["2", "香蕉", "BAN001", "50", "箱", "编辑 | 删除"],
            ["3", "橙子", "ORA001", "80", "箱", "编辑 | 删除"],
            ["4", "葡萄", "GRA001", "30", "箱", "编辑 | 删除"],
            ["5", "草莓", "STR001", "20", "盒", "编辑 | 删除"],
        ]
        
        self.products_table.setRowCount(len(sample_data))
        for i, row_data in enumerate(sample_data):
            for j, cell_data in enumerate(row_data):
                item = QTableWidgetItem(str(cell_data))
                self.products_table.setItem(i, j, item)
    
    def filter_products(self):
        """根据搜索条件过滤货品"""
        search_text = self.search_input.text().lower()
        for row in range(self.products_table.rowCount()):
            should_show = False
            for col in range(self.products_table.columnCount()):
                item = self.products_table.item(row, col)
                if item and search_text in item.text().lower():
                    should_show = True
                    break
            self.products_table.setRowHidden(row, not should_show)
    
    def show_add_product_dialog(self):
        """显示添加货品对话框"""
        dialog = ProductDialog(self)
        if dialog.exec_() == ProductDialog.Accepted:
            # 这里可以添加保存逻辑
            QMessageBox.information(self, "成功", "货品添加成功！")
            self.populate_products_table()  # 刷新表格
    
    def apply_initial_theme(self):
        """应用初始主题"""
        # 获取主题管理器（如果存在）
        try:
            from modules.theme_manager import ThemeManager
            theme_manager = ThemeManager()
            styles = theme_manager.get_theme_styles()
            self.setStyleSheet(styles["content"])
        except:
            # 如果无法获取主题管理器，使用默认深色主题
            self.setStyleSheet("""
                QWidget {
                    background-color: #1a1a1a;
                    color: #ffffff;
                }
                QLabel {
                    color: #ffffff;
                }
                QPushButton {
                    background-color: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                }
                QPushButton:hover {
                    background-color: #0056b3;
                }
                QLineEdit {
                    border: 1px solid #404040;
                    padding: 8px;
                    background-color: #2d2d2d;
                    color: #ffffff;
                }
                QTableWidget {
                    background-color: #2d2d2d;
                    alternate-background-color: #404040;
                    gridline-color: #404040;
                    color: #ffffff;
                }
                QTableWidget::item {
                    padding: 8px;
                }
                QTableWidget::item:selected {
                    background-color: #007bff;
                    color: white;
                }
                QHeaderView::section {
                    background-color: #404040;
                    color: #ffffff;
                    padding: 8px;
                    border: none;
                }
            """)
