#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
主题功能测试脚本
"""

import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QPushButton, QLabel
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont

from modules.theme_manager import ThemeManager


class ThemeTestWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.theme_manager = ThemeManager()
        self.theme_manager.theme_changed.connect(self.on_theme_changed)
        self.init_ui()
        self.apply_theme()
    
    def init_ui(self):
        self.setWindowTitle("主题测试窗口")
        self.setGeometry(200, 200, 600, 400)
        
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # 标题
        title = QLabel("主题切换测试")
        title.setFont(QFont("Microsoft YaHei", 18, QFont.Bold))
        title.setAlignment(Qt.AlignCenter)
        layout.addWidget(title)
        
        # 当前主题显示
        self.theme_label = QLabel(f"当前主题: {self.theme_manager.get_current_theme()}")
        self.theme_label.setFont(QFont("Microsoft YaHei", 12))
        self.theme_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.theme_label)
        
        # 主题切换按钮
        self.theme_button = QPushButton("☀️ 切换到浅色模式")
        self.theme_button.setFont(QFont("Microsoft YaHei", 12))
        self.theme_button.clicked.connect(self.toggle_theme)
        layout.addWidget(self.theme_button)
        
        # 测试按钮
        test_btn = QPushButton("测试按钮")
        test_btn.setFont(QFont("Microsoft YaHei", 11))
        layout.addWidget(test_btn)
        
        # 测试输入框
        from PyQt5.QtWidgets import QLineEdit
        test_input = QLineEdit()
        test_input.setPlaceholderText("测试输入框")
        layout.addWidget(test_input)
        
        layout.addStretch()
    
    def toggle_theme(self):
        self.theme_manager.toggle_theme()
    
    def on_theme_changed(self, theme_name):
        if theme_name == "dark":
            self.theme_button.setText("☀️ 切换到浅色模式")
        else:
            self.theme_button.setText("🌙 切换到深色模式")
        
        self.theme_label.setText(f"当前主题: {theme_name}")
        self.apply_theme()
    
    def apply_theme(self):
        styles = self.theme_manager.get_theme_styles()
        self.setStyleSheet(styles["main_window"])
        self.centralWidget().setStyleSheet(styles["content"])
        self.theme_button.setStyleSheet(self.theme_manager.get_theme_button_style())


def main():
    app = QApplication(sys.argv)
    app.setStyle('Fusion')
    
    window = ThemeTestWindow()
    window.show()
    
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
