from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QPushButton, 
                             QLabel, QComboBox, QGroupBox, QFormLayout, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont, QPainter, QPen, QColor, QBrush
from datetime import datetime, timedelta
import random

# 暂时禁用matplotlib的Qt组件，避免启动时冲突
MATPLOTLIB_AVAILABLE = False
print("警告: 暂时禁用matplotlib图表功能，使用PyQt5原生折线图")


class LineChartWidget(QWidget):
    """自定义折线图组件"""
    
    def __init__(self, parent=None):
        super().__init__(parent)
        self.data = {}
        self.title = ""
        self.setMinimumSize(800, 400)
        self.setStyleSheet("""
            QWidget {
                background-color: #2d2d2d;
                border: 1px solid #404040;
                border-radius: 8px;
            }
        """)
    
    def set_data(self, title, data):
        """设置图表数据"""
        self.title = title
        self.data = data
        self.update()
    
    def paintEvent(self, event):
        """绘制折线图"""
        painter = QPainter(self)
        painter.setRenderHint(QPainter.Antialiasing)
        
        # 设置背景
        painter.fillRect(self.rect(), QColor("#2d2d2d"))
        
        if not self.data:
            return
        
        # 获取数据
        months = list(self.data.keys())
        values = list(self.data.values())
        
        if not values:
            return
        
        # 计算绘图区域
        margin = 60
        chart_rect = self.rect().adjusted(margin, margin, -margin, -margin)
        
        # 绘制标题
        painter.setPen(QColor("#ffffff"))
        painter.setFont(QFont("Microsoft YaHei", 14, QFont.Bold))
        painter.drawText(self.rect().adjusted(0, 10, 0, 0), Qt.AlignCenter, self.title)
        
        # 计算坐标轴
        max_value = max(values)
        min_value = min(values)
        value_range = max_value - min_value if max_value != min_value else 1
        
        # 绘制网格线
        painter.setPen(QPen(QColor("#404040"), 1, Qt.DashLine))
        for i in range(6):
            y = int(chart_rect.top() + (chart_rect.height() * i / 5))
            painter.drawLine(chart_rect.left(), y, chart_rect.right(), y)
        
        # 绘制Y轴标签
        painter.setPen(QColor("#ffffff"))
        painter.setFont(QFont("Microsoft YaHei", 10))
        for i in range(6):
            value = max_value - (value_range * i / 5)
            y = int(chart_rect.top() + (chart_rect.height() * i / 5))
            painter.drawText(chart_rect.left() - 50, y + 5, f"{int(value)}")
        
        # 绘制X轴标签
        for i, month in enumerate(months):
            x = int(chart_rect.left() + (chart_rect.width() * i / (len(months) - 1)))
            painter.drawText(x - 15, chart_rect.bottom() + 20, month)
        
        # 绘制折线
        if len(values) > 1:
            painter.setPen(QPen(QColor("#007bff"), 3))
            points = []
            for i, value in enumerate(values):
                x = int(chart_rect.left() + (chart_rect.width() * i / (len(values) - 1)))
                y = int(chart_rect.bottom() - ((value - min_value) / value_range * chart_rect.height()))
                points.append((x, y))
            
            # 绘制线条
            for i in range(len(points) - 1):
                painter.drawLine(points[i][0], points[i][1], points[i+1][0], points[i+1][1])
            
            # 绘制数据点
            painter.setBrush(QBrush(QColor("#007bff")))
            painter.setPen(QPen(QColor("#ffffff"), 2))
            for x, y in points:
                painter.drawEllipse(x - 4, y - 4, 8, 8)
            
            # 高亮最高点
            max_index = values.index(max_value)
            max_x, max_y = points[max_index]
            painter.setBrush(QBrush(QColor("#ff4444")))
            painter.setPen(QPen(QColor("#ffffff"), 3))
            painter.drawEllipse(max_x - 6, max_y - 6, 12, 12)
            
            # 标注最高点
            painter.setPen(QColor("#ff4444"))
            painter.setFont(QFont("Microsoft YaHei", 10, QFont.Bold))
            painter.drawText(max_x + 10, max_y - 10, f"最高: {max_value}箱")


class AnalysisModule(QWidget):
    def __init__(self):
        try:
            print("AnalysisModule: 开始初始化...")
            super().__init__()
            print("AnalysisModule: 父类初始化完成")
            
            print("AnalysisModule: 开始初始化UI...")
            self.init_ui()
            print("AnalysisModule: UI初始化完成")
            
            # 延迟应用主题，确保所有组件都已创建
            print("AnalysisModule: 设置延迟主题应用...")
            from PyQt5.QtCore import QTimer
            QTimer.singleShot(0, self.apply_initial_theme)
            print("AnalysisModule: 延迟主题应用设置完成")
            
        except Exception as e:
            print(f"AnalysisModule初始化失败: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def init_ui(self):
        layout = QVBoxLayout()
        self.setLayout(layout)
        
        # 标题
        title = QLabel("销售分析")
        title.setFont(QFont("Microsoft YaHei", 16, QFont.Bold))
        layout.addWidget(title)
        
        # 分析条件
        condition_group = QGroupBox("分析条件")
        condition_layout = QFormLayout()
        
        # 商家选择
        self.merchant_combo = QComboBox()
        self.merchant_combo.addItems(["选择商家...", "超市A", "超市B", "超市C", "便利店D", "商场E"])
        condition_layout.addRow("选择商家:", self.merchant_combo)
        
        # 年份选择
        self.year_combo = QComboBox()
        self.year_combo.addItems(["2024", "2023", "2022"])
        condition_layout.addRow("分析年份:", self.year_combo)
        
        condition_group.setLayout(condition_layout)
        layout.addWidget(condition_group)
        
        # 分析按钮
        analyze_btn = QPushButton("生成分析报告")
        # 按钮样式将在主题中设置
        analyze_btn.clicked.connect(self.generate_analysis)
        layout.addWidget(analyze_btn)
        
        # 图表区域
        self.create_chart_area(layout)
        
        # 统计信息区域
        self.create_statistics_area(layout)
    
    def create_chart_area(self, parent_layout):
        """创建图表区域"""
        try:
            print("create_chart_area: 开始创建图表区域...")
            
            # 创建自定义折线图组件
            print("create_chart_area: 创建PyQt5原生折线图...")
            self.line_chart = LineChartWidget()
            print("create_chart_area: 折线图组件创建完成")
            
            # 添加到布局
            print("create_chart_area: 添加折线图到布局...")
            parent_layout.addWidget(self.line_chart)
            print("create_chart_area: 折线图添加到布局完成")
            
            # 初始显示空图表
            self.show_empty_chart()
            print("create_chart_area: 图表区域创建完成")
            
        except Exception as e:
            print(f"create_chart_area失败: {e}")
            import traceback
            traceback.print_exc()
            raise
    
    def _create_text_chart_area(self, parent_layout):
        """创建文本图表区域"""
        self.chart_label = QLabel("📈 图表区域\n\n这里将显示12个月采购趋势折线图\n\n• 横轴：12个月份\n• 纵轴：采购数量\n• 显示趋势线和数据点")
        self.chart_label.setAlignment(Qt.AlignCenter)
        self.chart_label.setStyleSheet("""
            QLabel {
                background-color: #f8f9fa;
                border: 2px dashed #dee2e6;
                border-radius: 8px;
                padding: 40px;
                color: #6c757d;
            }
        """)
        parent_layout.addWidget(self.chart_label)
        
        # 初始显示空图表
        self.show_empty_chart()
    
    def show_empty_chart(self):
        """显示空图表"""
        if hasattr(self, 'line_chart'):
            # 显示空数据提示
            self.line_chart.set_data("点击'生成分析报告'按钮生成12个月采购趋势图表", {})
    
    def create_statistics_area(self, parent_layout):
        """创建统计信息区域"""
        stats_group = QGroupBox("统计信息")
        stats_layout = QVBoxLayout()
        stats_group.setLayout(stats_layout)
        
        # 统计卡片
        cards_layout = QHBoxLayout()
        
        # 总采购量卡片
        total_card = self.create_stat_card("总采购量", "1,250", "箱", "#28a745")
        cards_layout.addWidget(total_card)
        
        # 平均月采购卡片
        avg_card = self.create_stat_card("平均月采购", "104", "箱", "#007acc")
        cards_layout.addWidget(avg_card)
        
        # 最高月采购卡片
        max_card = self.create_stat_card("最高月采购", "180", "箱", "#ffc107")
        cards_layout.addWidget(max_card)
        
        # 采购高峰月卡片
        peak_card = self.create_stat_card("采购高峰月", "3月", "", "#dc3545")
        cards_layout.addWidget(peak_card)
        
        stats_layout.addLayout(cards_layout)
        parent_layout.addWidget(stats_group)
    
    def create_stat_card(self, title, value, unit, color):
        """创建统计卡片"""
        card = QWidget()
        card.setObjectName("stat_card")  # 设置对象名称用于样式选择
        # 卡片样式将在主题中设置，这里只设置基本样式
        card.setStyleSheet("""
            QWidget {
                border-radius: 8px;
                padding: 15px;
            }
        """)
        
        layout = QVBoxLayout()
        card.setLayout(layout)
        
        # 标题
        title_label = QLabel(title)
        title_label.setFont(QFont("Microsoft YaHei", 10))
        # 标题颜色将在主题中设置
        title_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(title_label)
        
        # 数值
        value_label = QLabel(f"{value} {unit}")
        value_label.setFont(QFont("Microsoft YaHei", 16, QFont.Bold))
        value_label.setStyleSheet(f"color: {color};")
        value_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(value_label)
        
        return card
    
    def generate_analysis(self):
        """生成分析报告"""
        merchant = self.merchant_combo.currentText()
        year = self.year_combo.currentText()
        
        if merchant == "选择商家...":
            QMessageBox.warning(self, "警告", "请选择商家！")
            return
        
        # 生成12个月的采购数据
        monthly_data = self.generate_monthly_data(merchant, year)
        
        # 计算统计数据
        total_purchases = sum(monthly_data.values())
        avg_monthly = total_purchases / 12
        max_monthly = max(monthly_data.values())
        peak_month = max(monthly_data, key=monthly_data.get)
        
        # 更新统计卡片
        self.update_statistics_cards(total_purchases, avg_monthly, max_monthly, peak_month)
        
        # 生成折线图
        self.create_line_chart(merchant, year, monthly_data)
        
        QMessageBox.information(self, "分析完成", 
            f"商家：{merchant}\n年份：{year}\n\n"
            f"总采购量：{total_purchases} 箱\n"
            f"平均月采购：{avg_monthly:.1f} 箱\n"
            f"最高月采购：{max_monthly} 箱\n"
            f"采购高峰月：{peak_month}\n\n"
            f"12个月趋势图表已生成！")
    
    def generate_monthly_data(self, merchant, year):
        """生成12个月的采购数据"""
        # 获取当前日期
        current_date = datetime.now()
        
        # 生成过去12个月的数据
        monthly_data = {}
        month_names = ['1月', '2月', '3月', '4月', '5月', '6月', 
                      '7月', '8月', '9月', '10月', '11月', '12月']
        
        # 根据商家和年份生成不同的数据模式
        base_values = {
            "超市A": [120, 95, 180, 160, 140, 110, 130, 150, 125, 135, 145, 100],
            "超市B": [80, 70, 140, 120, 100, 90, 110, 130, 105, 115, 125, 85],
            "超市C": [100, 85, 160, 140, 120, 100, 120, 140, 115, 125, 135, 95],
            "便利店D": [60, 50, 100, 80, 70, 60, 80, 90, 75, 85, 95, 65],
            "商场E": [150, 120, 200, 180, 160, 130, 150, 170, 145, 155, 165, 125]
        }
        
        # 获取基础数据
        if merchant in base_values:
            base_data = base_values[merchant]
        else:
            # 默认数据
            base_data = [100, 80, 150, 130, 110, 90, 110, 130, 105, 115, 125, 85]
        
        # 添加一些随机变化
        for i, month in enumerate(month_names):
            variation = random.randint(-20, 20)
            monthly_data[month] = max(0, base_data[i] + variation)
        
        return monthly_data
    
    def create_line_chart(self, merchant, year, monthly_data):
        """创建12个月折线图"""
        try:
            print("create_line_chart: 开始创建折线图...")
            if hasattr(self, 'line_chart'):
                # 使用自定义折线图组件
                title = f"{merchant} - {year}年12个月采购趋势"
                self.line_chart.set_data(title, monthly_data)
                print("create_line_chart: PyQt5折线图创建成功")
            else:
                print("create_line_chart: 折线图组件不存在，降级到文本模式")
                self.show_text_chart(merchant, year, monthly_data)
                
        except Exception as e:
            print(f"create_line_chart失败: {e}")
            import traceback
            traceback.print_exc()
            # 降级到文本模式
            self.show_text_chart(merchant, year, monthly_data)
    
    def show_text_chart(self, merchant, year, monthly_data):
        """显示文本格式的图表数据（备选方案）"""
        chart_text = f"""
📊 {merchant} - {year}年12个月采购趋势

📈 月度采购数据：
"""
        for month, value in monthly_data.items():
            # 创建简单的条形图表示
            bar = "█" * (value // 10)  # 每10箱用一个方块表示
            chart_text += f"{month:>3}: {value:>3}箱 {bar}\n"
        
        chart_text += f"""
📊 数据统计：
• 总采购量: {sum(monthly_data.values())} 箱
• 平均月采购: {sum(monthly_data.values()) / 12:.1f} 箱
• 最高月采购: {max(monthly_data.values())} 箱
• 采购高峰月: {max(monthly_data, key=monthly_data.get)}

💡 趋势分析：
• 显示12个月的采购变化趋势
• 识别采购高峰和低谷月份
• 分析季节性采购模式
        """
        
        self.chart_label.setText(chart_text)
        self.chart_label.setStyleSheet("""
            QLabel {
                background-color: #f8f9fa;
                border: 2px solid #007acc;
                border-radius: 8px;
                padding: 20px;
                color: #333;
                font-family: 'Courier New', monospace;
                font-size: 11px;
                line-height: 1.4;
            }
        """)
    
    def update_statistics_cards(self, total, avg, max_val, peak_month):
        """更新统计卡片数据"""
        # 查找统计卡片并更新数据
        stat_cards = self.findChildren(QWidget, "stat_card")
        if len(stat_cards) >= 4:
            # 更新总采购量卡片
            total_labels = stat_cards[0].findChildren(QLabel)
            if len(total_labels) >= 2:
                total_labels[1].setText(f"{total} 箱")
            
            # 更新平均月采购卡片
            avg_labels = stat_cards[1].findChildren(QLabel)
            if len(avg_labels) >= 2:
                avg_labels[1].setText(f"{avg:.1f} 箱")
            
            # 更新最高月采购卡片
            max_labels = stat_cards[2].findChildren(QLabel)
            if len(max_labels) >= 2:
                max_labels[1].setText(f"{max_val} 箱")
            
            # 更新采购高峰月卡片
            peak_labels = stat_cards[3].findChildren(QLabel)
            if len(peak_labels) >= 2:
                peak_labels[1].setText(f"{peak_month}")
    
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
            QComboBox {
                border: 1px solid #404040;
                padding: 8px;
                background-color: #2d2d2d;
                color: #ffffff;
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
            /* 统计卡片样式 */
            QWidget[objectName="stat_card"] {
                background-color: #2d2d2d;
                border: 1px solid #404040;
                border-radius: 8px;
                padding: 15px;
            }
            QWidget[objectName="stat_card"]:hover {
                border-color: #007bff;
                background-color: #404040;
            }
        """)
        
        # 为统计卡片应用特殊样式
        self.apply_stat_cards_theme()
        
        # 为图表区域应用主题
        self.apply_chart_theme()
    
    def apply_stat_cards_theme(self):
        """为统计卡片应用主题样式"""
        # 查找所有统计卡片并应用样式
        stat_cards = self.findChildren(QWidget, "stat_card")
        
        # 获取当前主题
        try:
            from modules.theme_manager import ThemeManager
            theme_manager = ThemeManager()
            current_theme = theme_manager.get_current_theme()
        except:
            current_theme = "dark"  # 默认深色主题
        
        for card in stat_cards:
            if current_theme == "dark":
                # 深色主题样式
                card.setStyleSheet("""
                    QWidget {
                        background-color: #2d2d2d;
                        border: 1px solid #404040;
                        border-radius: 8px;
                        padding: 15px;
                    }
                    QWidget:hover {
                        border-color: #007bff;
                        background-color: #404040;
                    }
                    QLabel {
                        color: #ffffff;
                    }
                """)
            else:
                # 浅色主题样式
                card.setStyleSheet("""
                    QWidget {
                        background-color: white;
                        border: 1px solid #dee2e6;
                        border-radius: 8px;
                        padding: 15px;
                    }
                    QWidget:hover {
                        border-color: #007bff;
                        background-color: #f8f9fa;
                    }
                    QLabel {
                        color: #333333;
                    }
                """)
    
    def apply_chart_theme(self):
        """为图表区域应用主题样式"""
        if not MATPLOTLIB_AVAILABLE and hasattr(self, 'chart_label'):
            # 获取当前主题
            try:
                from modules.theme_manager import ThemeManager
                theme_manager = ThemeManager()
                current_theme = theme_manager.get_current_theme()
            except:
                current_theme = "dark"  # 默认深色主题
            
            if current_theme == "dark":
                # 深色主题样式
                self.chart_label.setStyleSheet("""
                    QLabel {
                        background-color: #2d2d2d;
                        border: 2px solid #404040;
                        border-radius: 8px;
                        padding: 20px;
                        color: #ffffff;
                        font-family: 'Courier New', monospace;
                        font-size: 11px;
                        line-height: 1.4;
                    }
                """)
            else:
                # 浅色主题样式
                self.chart_label.setStyleSheet("""
                    QLabel {
                        background-color: #f8f9fa;
                        border: 2px solid #dee2e6;
                        border-radius: 8px;
                        padding: 20px;
                        color: #333333;
                        font-family: 'Courier New', monospace;
                        font-size: 11px;
                        line-height: 1.4;
                    }
                """)
