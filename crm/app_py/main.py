import sys
from PyQt5.QtWidgets import QApplication
from PyQt5.QtCore import Qt

from main_window import MainWindow


def main():
    try:
        print("开始初始化应用程序...")
        
        # 在创建QApplication之前设置Qt属性
        QApplication.setAttribute(Qt.AA_EnableHighDpiScaling, True)
        QApplication.setAttribute(Qt.AA_UseHighDpiPixmaps, True)
        print("Qt属性设置完成")
        
        app = QApplication(sys.argv)
        print("QApplication创建完成")
        
        # 设置应用样式
        app.setStyle('Fusion')
        print("应用样式设置完成")
        
        # 创建主窗口
        print("开始创建主窗口...")
        window = MainWindow()
        print("主窗口创建完成")
        
        print("显示主窗口...")
        window.show()
        print("主窗口显示完成")
        
        print("开始运行应用程序...")
        # 运行应用
        sys.exit(app.exec_())
        
    except Exception as e:
        print(f"程序启动失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
