from PyQt5.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
                             QLineEdit, QTextEdit, QSpinBox, QPushButton, 
                             QLabel, QGroupBox, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont


class ProductDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("添加货品")
        self.setModal(True)
        self.resize(400, 300)
        self.init_ui()
    
    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        # 表单组
        form_group = QGroupBox("货品信息")
        form_layout = QFormLayout()
        
        # 货品名称
        self.name_input = QLineEdit()
        self.name_input.setPlaceholderText("请输入货品名称")
        form_layout.addRow("货品名称*:", self.name_input)
        
        # SKU
        self.sku_input = QLineEdit()
        self.sku_input.setPlaceholderText("请输入SKU编码")
        form_layout.addRow("SKU编码:", self.sku_input)
        
        # 描述
        self.description_input = QTextEdit()
        self.description_input.setMaximumHeight(60)
        self.description_input.setPlaceholderText("请输入货品描述")
        form_layout.addRow("描述:", self.description_input)
        
        # 当前库存
        self.stock_input = QSpinBox()
        self.stock_input.setRange(0, 9999)
        self.stock_input.setValue(0)
        form_layout.addRow("当前库存:", self.stock_input)
        
        # 单位
        self.unit_input = QLineEdit()
        self.unit_input.setPlaceholderText("如：箱、盒、个")
        form_layout.addRow("单位:", self.unit_input)
        
        form_group.setLayout(form_layout)
        layout.addWidget(form_group)
        
        # 按钮
        button_layout = QHBoxLayout()
        
        save_btn = QPushButton("保存")
        save_btn.setStyleSheet("""
            QPushButton {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #218838;
            }
        """)
        save_btn.clicked.connect(self.save_product)
        
        cancel_btn = QPushButton("取消")
        cancel_btn.setStyleSheet("""
            QPushButton {
                background-color: #6c757d;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #5a6268;
            }
        """)
        cancel_btn.clicked.connect(self.reject)
        
        button_layout.addWidget(save_btn)
        button_layout.addWidget(cancel_btn)
        button_layout.addStretch()
        
        layout.addLayout(button_layout)
    
    def save_product(self):
        """保存货品信息"""
        # 验证必填字段
        if not self.name_input.text().strip():
            QMessageBox.warning(self, "警告", "请输入货品名称！")
            self.name_input.setFocus()
            return
        
        # 这里可以添加保存逻辑
        product_data = {
            "name": self.name_input.text().strip(),
            "sku": self.sku_input.text().strip(),
            "description": self.description_input.toPlainText().strip(),
            "stock": self.stock_input.value(),
            "unit": self.unit_input.text().strip()
        }
        
        # 模拟保存成功
        QMessageBox.information(self, "成功", "货品添加成功！")
        self.accept()
