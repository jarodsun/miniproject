from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QPushButton, 
                             QLabel, QTableWidget, QTableWidgetItem, QHeaderView,
                             QLineEdit, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

from dialogs.merchant_dialog import MerchantDialog


class MerchantsModule(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        # 标题栏
        title_layout = QHBoxLayout()
        title = QLabel("商家管理")
        title.setFont(QFont("Microsoft YaHei", 16, QFont.Bold))
        title_layout.addWidget(title)
        title_layout.addStretch()
        
        # 添加商家按钮
        add_btn = QPushButton("添加商家")
        add_btn.setStyleSheet("""
            QPushButton {
                background-color: #007acc;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #005a9e;
            }
        """)
        add_btn.clicked.connect(self.show_add_merchant_dialog)
        title_layout.addWidget(add_btn)
        
        layout.addLayout(title_layout)
        
        # 搜索栏
        search_layout = QHBoxLayout()
        self.search_input = QLineEdit()
        self.search_input.setPlaceholderText("搜索商家...")
        self.search_input.setStyleSheet("padding: 8px; border: 1px solid #ddd; border-radius: 4px;")
        self.search_input.textChanged.connect(self.filter_merchants)
        search_layout.addWidget(self.search_input)
        search_layout.addStretch()
        layout.addLayout(search_layout)
        
        # 商家列表表格
        self.merchants_table = QTableWidget()
        self.merchants_table.setColumnCount(5)
        self.merchants_table.setHorizontalHeaderLabels(["ID", "商家名称", "联系人", "电话", "操作"])
        
        # 设置表格样式
        self.merchants_table.setAlternatingRowColors(True)
        self.merchants_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.merchants_table.horizontalHeader().setStretchLastSection(True)
        self.merchants_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        
        # 添加示例数据
        self.populate_merchants_table()
        
        layout.addWidget(self.merchants_table)
    
    def populate_merchants_table(self):
        """填充商家表格示例数据"""
        sample_data = [
            ["1", "超市A", "张三", "13800138001", "编辑 | 删除"],
            ["2", "超市B", "李四", "13800138002", "编辑 | 删除"],
            ["3", "超市C", "王五", "13800138003", "编辑 | 删除"],
            ["4", "便利店D", "赵六", "13800138004", "编辑 | 删除"],
            ["5", "商场E", "钱七", "13800138005", "编辑 | 删除"],
        ]
        
        self.merchants_table.setRowCount(len(sample_data))
        for i, row_data in enumerate(sample_data):
            for j, cell_data in enumerate(row_data):
                item = QTableWidgetItem(str(cell_data))
                self.merchants_table.setItem(i, j, item)
    
    def filter_merchants(self):
        """根据搜索条件过滤商家"""
        search_text = self.search_input.text().lower()
        for row in range(self.merchants_table.rowCount()):
            should_show = False
            for col in range(self.merchants_table.columnCount()):
                item = self.merchants_table.item(row, col)
                if item and search_text in item.text().lower():
                    should_show = True
                    break
            self.merchants_table.setRowHidden(row, not should_show)
    
    def show_add_merchant_dialog(self):
        """显示添加商家对话框"""
        dialog = MerchantDialog(self)
        if dialog.exec_() == MerchantDialog.Accepted:
            # 这里可以添加保存逻辑
            QMessageBox.information(self, "成功", "商家添加成功！")
            self.populate_merchants_table()  # 刷新表格
