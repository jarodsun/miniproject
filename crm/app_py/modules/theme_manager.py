from PyQt5.QtCore import QObject, pyqtSignal
from PyQt5.QtWidgets import QApplication


class ThemeManager(QObject):
    """主题管理器"""
    
    # 主题切换信号
    theme_changed = pyqtSignal(str)
    
    def __init__(self):
        super().__init__()
        self.current_theme = "dark"  # 默认深色主题
        self.themes = {
            "light": self.get_light_theme(),
            "dark": self.get_dark_theme()
        }
    
    def get_light_theme(self):
        """获取浅色主题样式"""
        return {
            "main_window": """
                QMainWindow {
                    background-color: #ffffff;
                    color: #333333;
                }
            """,
            "navigation": """
                QFrame {
                    background-color: #f8f9fa;
                    border-right: 1px solid #e9ecef;
                }
                QLabel {
                    color: #495057;
                }
                QPushButton {
                    background-color: transparent;
                    color: #495057;
                    border: none;
                    padding: 10px 20px;
                    text-align: left;
                }
                QPushButton:hover {
                    background-color: #e9ecef;
                }
                QPushButton:pressed {
                    background-color: #dee2e6;
                }
            """,
            "content": """
                QWidget {
                    background-color: #ffffff;
                    color: #333333;
                }
                QLabel {
                    color: #333333;
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
                    border: 1px solid #ced4da;
                    padding: 8px;
                    background-color: white;
                    color: #333333;
                }
                QTableWidget {
                    background-color: white;
                    alternate-background-color: #f8f9fa;
                    gridline-color: #dee2e6;
                    color: #333333;
                }
                QTableWidget::item {
                    padding: 8px;
                }
                QTableWidget::item:selected {
                    background-color: #007bff;
                    color: white;
                }
                QHeaderView::section {
                    background-color: #e9ecef;
                    color: #495057;
                    padding: 8px;
                    border: none;
                }
                QFrame {
                    background-color: white;
                    border: 1px solid #dee2e6;
                }
            """,
            "cards": """
                QFrame {
                    background-color: white;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                }
                QFrame:hover {
                    border-color: #007bff;
                    background-color: #f8f9fa;
                }
                QLabel {
                    color: #333333;
                }
            """
        }
    
    def get_dark_theme(self):
        """获取深色主题样式"""
        return {
            "main_window": """
                QMainWindow {
                    background-color: #1a1a1a;
                    color: #ffffff;
                }
            """,
            "navigation": """
                QFrame {
                    background-color: #2d2d2d;
                    border-right: 1px solid #404040;
                }
                QLabel {
                    color: #ffffff;
                }
                QPushButton {
                    background-color: transparent;
                    color: #ffffff;
                    border: none;
                    padding: 10px 20px;
                    text-align: left;
                }
                QPushButton:hover {
                    background-color: #404040;
                }
                QPushButton:pressed {
                    background-color: #4a4a4a;
                }
            """,
            "content": """
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
                QFrame {
                    background-color: #2d2d2d;
                    border: 1px solid #404040;
                }
            """,
            "cards": """
                QFrame {
                    background-color: #2d2d2d;
                    border: 1px solid #404040;
                    border-radius: 4px;
                }
                QFrame:hover {
                    border-color: #007bff;
                    background-color: #404040;
                }
                QLabel {
                    color: #ffffff;
                }
            """
        }
    
    def get_current_theme(self):
        """获取当前主题"""
        return self.current_theme
    
    def set_theme(self, theme_name):
        """设置主题"""
        if theme_name in self.themes:
            self.current_theme = theme_name
            self.theme_changed.emit(theme_name)
            return True
        return False
    
    def get_theme_styles(self):
        """获取当前主题的所有样式"""
        return self.themes[self.current_theme]
    
    def toggle_theme(self):
        """切换主题"""
        new_theme = "dark" if self.current_theme == "light" else "light"
        return self.set_theme(new_theme)
    
    def apply_theme_to_app(self, app):
        """将主题应用到整个应用"""
        styles = self.get_theme_styles()
        app.setStyleSheet(styles["main_window"])
    
    def get_theme_button_style(self):
        """获取主题切换按钮的样式"""
        if self.current_theme == "light":
            return """
                QPushButton {
                    background-color: #343a40;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                }
                QPushButton:hover {
                    background-color: #495057;
                }
            """
        else:
            return """
                QPushButton {
                    background-color: #f8f9fa;
                    color: #343a40;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                }
                QPushButton:hover {
                    background-color: #e9ecef;
                }
            """
