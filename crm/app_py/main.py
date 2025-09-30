import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QVBoxLayout, QWidget, QLabel, QMessageBox
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
    def init_ui(self):
        # 设置窗口标题和大小
        self.setWindowTitle("Mini CRM - 首页")
        self.setGeometry(100, 100, 400, 300)
        
        # 创建中央widget
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # 创建布局
        layout = QVBoxLayout()
        central_widget.setLayout(layout)
        
        # 创建标题标签
        title_label = QLabel("欢迎使用 Mini CRM")
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setFont(QFont("Microsoft YaHei", 16, QFont.Bold))
        layout.addWidget(title_label)
        
        # 添加一些间距
        layout.addSpacing(50)
        
        # 创建按钮
        self.hello_button = QPushButton("点击显示 Hello World")
        self.hello_button.setFont(QFont("Microsoft YaHei", 12))
        self.hello_button.setMinimumHeight(50)
        self.hello_button.clicked.connect(self.show_hello_world)
        layout.addWidget(self.hello_button)
        
        # 添加弹性空间
        layout.addStretch()
    
    def show_hello_world(self):
        """显示Hello World消息框"""
        QMessageBox.information(self, "Hello World", "Hello World!")


def main():
    app = QApplication(sys.argv)
    
    # 设置应用样式
    app.setStyle('Fusion')
    
    # 创建主窗口
    window = MainWindow()
    window.show()
    
    # 运行应用
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()
