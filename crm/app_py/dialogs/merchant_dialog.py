from PyQt5.QtWidgets import (QDialog, QVBoxLayout, QHBoxLayout, QFormLayout,
                             QLineEdit, QTextEdit, QPushButton, QLabel, 
                             QGroupBox, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont


class MerchantDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("添加商家")
        self.setModal(True)
        self.resize(400, 250)
        self.init_ui()
    
    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        # 表单组
        form_group = QGroupBox("商家信息")
        form_layout = QFormLayout()
        
        # 商家名称
        self.name_input = QLineEdit()
        self.name_input.setPlaceholderText("请输入商家名称")
        form_layout.addRow("商家名称*:", self.name_input)
        
        # 联系人
        self.contact_input = QLineEdit()
        self.contact_input.setPlaceholderText("请输入联系人姓名")
        form_layout.addRow("联系人:", self.contact_input)
        
        # 电话
        self.phone_input = QLineEdit()
        self.phone_input.setPlaceholderText("请输入联系电话")
        form_layout.addRow("电话:", self.phone_input)
        
        # 地址
        self.address_input = QTextEdit()
        self.address_input.setMaximumHeight(60)
        self.address_input.setPlaceholderText("请输入商家地址")
        form_layout.addRow("地址:", self.address_input)
        
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
        save_btn.clicked.connect(self.save_merchant)
        
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
    
    def save_merchant(self):
        """保存商家信息"""
        # 验证必填字段
        if not self.name_input.text().strip():
            QMessageBox.warning(self, "警告", "请输入商家名称！")
            self.name_input.setFocus()
            return
        
        # 这里可以添加保存逻辑
        merchant_data = {
            "name": self.name_input.text().strip(),
            "contact": self.contact_input.text().strip(),
            "phone": self.phone_input.text().strip(),
            "address": self.address_input.toPlainText().strip()
        }
        
        # 模拟保存成功
        QMessageBox.information(self, "成功", "商家添加成功！")
        self.accept()
