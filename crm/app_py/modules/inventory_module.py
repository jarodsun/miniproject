from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QPushButton, 
                             QLabel, QTableWidget, QTableWidgetItem, QHeaderView,
                             QTabWidget, QGroupBox, QFormLayout, QComboBox, 
                             QSpinBox, QDateEdit, QTextEdit, QMessageBox)
from PyQt5.QtCore import Qt, QDate
from PyQt5.QtGui import QFont


class InventoryModule(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
        # 延迟应用主题，确保所有组件都已创建
        from PyQt5.QtCore import QTimer
        QTimer.singleShot(0, self.apply_initial_theme)
    
    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        # 标题
        title = QLabel("出入库管理")
        title.setFont(QFont("Microsoft YaHei", 16, QFont.Bold))
        layout.addWidget(title)
        
        # 创建标签页
        tab_widget = QTabWidget()
        
        # 出入库操作标签页
        operation_tab = self.create_operation_tab()
        tab_widget.addTab(operation_tab, "出入库操作")
        
        # 记录查询标签页
        records_tab = self.create_records_tab()
        tab_widget.addTab(records_tab, "记录查询")
        
        layout.addWidget(tab_widget)
    
    def create_operation_tab(self):
        """创建出入库操作标签页"""
        operation_tab = QWidget()
        operation_layout = QVBoxLayout()
        operation_tab.setLayout(operation_layout)
        
        # 操作表单
        form_group = QGroupBox("出入库操作")
        form_layout = QFormLayout()
        
        # 操作类型
        self.operation_type = QComboBox()
        self.operation_type.addItems(["入库", "出库"])
        form_layout.addRow("操作类型:", self.operation_type)
        
        # 货品选择
        self.product_combo = QComboBox()
        self.product_combo.addItems(["选择货品...", "苹果", "香蕉", "橙子", "葡萄", "草莓"])
        form_layout.addRow("选择货品:", self.product_combo)
        
        # 数量
        self.quantity_spin = QSpinBox()
        self.quantity_spin.setRange(1, 9999)
        form_layout.addRow("数量:", self.quantity_spin)
        
        # 商家选择（出库时）
        self.merchant_combo = QComboBox()
        self.merchant_combo.addItems(["选择商家...", "超市A", "超市B", "超市C", "便利店D", "商场E"])
        form_layout.addRow("商家:", self.merchant_combo)
        
        # 日期
        self.date_edit = QDateEdit()
        self.date_edit.setDate(QDate.currentDate())
        form_layout.addRow("日期:", self.date_edit)
        
        # 备注
        self.notes_edit = QTextEdit()
        self.notes_edit.setMaximumHeight(60)
        form_layout.addRow("备注:", self.notes_edit)
        
        form_group.setLayout(form_layout)
        operation_layout.addWidget(form_group)
        
        # 操作按钮
        button_layout = QHBoxLayout()
        submit_btn = QPushButton("提交操作")
        submit_btn.setStyleSheet("""
            QPushButton {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #218838;
            }
        """)
        submit_btn.clicked.connect(self.submit_operation)
        button_layout.addWidget(submit_btn)
        button_layout.addStretch()
        operation_layout.addLayout(button_layout)
        
        operation_layout.addStretch()
        return operation_tab
    
    def create_records_tab(self):
        """创建记录查询标签页"""
        records_tab = QWidget()
        records_layout = QVBoxLayout()
        records_tab.setLayout(records_layout)
        
        # 查询条件
        query_group = QGroupBox("查询条件")
        query_layout = QFormLayout()
        
        self.start_date = QDateEdit()
        self.start_date.setDate(QDate.currentDate().addDays(-30))
        query_layout.addRow("开始日期:", self.start_date)
        
        self.end_date = QDateEdit()
        self.end_date.setDate(QDate.currentDate())
        query_layout.addRow("结束日期:", self.end_date)
        
        query_group.setLayout(query_layout)
        records_layout.addWidget(query_group)
        
        # 查询按钮
        query_btn = QPushButton("查询记录")
        query_btn.setStyleSheet("""
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
        query_btn.clicked.connect(self.query_records)
        records_layout.addWidget(query_btn)
        
        # 记录表格
        self.records_table = QTableWidget()
        self.records_table.setColumnCount(6)
        self.records_table.setHorizontalHeaderLabels(["日期", "货品", "类型", "数量", "商家", "备注"])
        
        self.records_table.setAlternatingRowColors(True)
        self.records_table.setSelectionBehavior(QTableWidget.SelectRows)
        self.records_table.horizontalHeader().setStretchLastSection(True)
        self.records_table.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
        
        # 添加示例数据
        self.populate_records_table()
        
        records_layout.addWidget(self.records_table)
        
        return records_tab
    
    def populate_records_table(self):
        """填充记录表格示例数据"""
        sample_data = [
            ["2024-01-15", "苹果", "出库", "10", "超市A", "正常销售"],
            ["2024-01-14", "香蕉", "入库", "20", "", "新到货"],
            ["2024-01-13", "橙子", "出库", "5", "超市B", "促销活动"],
            ["2024-01-12", "葡萄", "入库", "15", "", "补货"],
            ["2024-01-11", "草莓", "出库", "3", "便利店D", "日常销售"],
        ]
        
        self.records_table.setRowCount(len(sample_data))
        for i, row_data in enumerate(sample_data):
            for j, cell_data in enumerate(row_data):
                item = QTableWidgetItem(str(cell_data))
                self.records_table.setItem(i, j, item)
    
    def submit_operation(self):
        """提交出入库操作"""
        # 验证输入
        if self.product_combo.currentIndex() == 0:
            QMessageBox.warning(self, "警告", "请选择货品！")
            return
        
        if self.quantity_spin.value() <= 0:
            QMessageBox.warning(self, "警告", "请输入有效数量！")
            return
        
        # 如果是出库操作，需要选择商家
        if self.operation_type.currentText() == "出库" and self.merchant_combo.currentIndex() == 0:
            QMessageBox.warning(self, "警告", "出库操作需要选择商家！")
            return
        
        # 这里可以添加保存逻辑
        operation_type = self.operation_type.currentText()
        product = self.product_combo.currentText()
        quantity = self.quantity_spin.value()
        merchant = self.merchant_combo.currentText() if self.operation_type.currentText() == "出库" else ""
        
        QMessageBox.information(self, "成功", f"{operation_type}操作提交成功！\n货品：{product}\n数量：{quantity}")
        
        # 重置表单
        self.quantity_spin.setValue(1)
        self.notes_edit.clear()
    
    def query_records(self):
        """查询记录"""
        start_date = self.start_date.date().toString("yyyy-MM-dd")
        end_date = self.end_date.date().toString("yyyy-MM-dd")
        
        QMessageBox.information(self, "查询", f"查询日期范围：{start_date} 到 {end_date}\n\n这里将显示查询结果")
    
    def apply_initial_theme(self):
        """应用初始主题"""
        # 使用默认深色主题
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
            QLineEdit, QSpinBox, QDateEdit, QTextEdit {
                border: 1px solid #404040;
                padding: 8px;
                background-color: #2d2d2d;
                color: #ffffff;
            }
            QComboBox {
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
            QGroupBox {
                color: #ffffff;
                border: 1px solid #404040;
                border-radius: 4px;
                margin-top: 10px;
                padding-top: 10px;
            }
            QGroupBox::title {
                subcontrol-origin: margin;
                left: 10px;
                padding: 0 5px 0 5px;
            }
            QTabWidget::pane {
                border: 1px solid #404040;
                background-color: #2d2d2d;
            }
            QTabBar::tab {
                background-color: #404040;
                color: #ffffff;
                padding: 8px 16px;
                margin-right: 2px;
            }
            QTabBar::tab:selected {
                background-color: #007bff;
            }
        """)
        self.populate_records_table()  # 刷新表格
