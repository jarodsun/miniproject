#!/usr/bin/env python3
"""
测试CRM应用的简化版本
"""
import sys
import warnings
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QLabel, QPushButton
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

# 忽略CSS警告
warnings.filterwarnings("ignore")

class TestWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
    def init_ui(self):
        self.setWindowTitle("CRM 测试应用")
        self.setGeometry(100, 100, 800, 600)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # 标题
        title = QLabel("CRM 系统测试")
        title.setFont(QFont("Microsoft YaHei", 18, QFont.Bold))
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)
        
        # 测试按钮
        test_btn = QPushButton("测试按钮")
        test_btn.setMinimumHeight(50)
        test_btn.clicked.connect(self.test_clicked)
        layout.addWidget(test_btn)
        
        layout.addStretch()

    def test_clicked(self):
        print("测试按钮被点击！")

def main():
    app = QApplication(sys.argv)
    app.setStyle('Fusion')
    
    window = TestWindow()
    window.show()
    
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
