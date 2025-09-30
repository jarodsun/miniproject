from PyQt5.QtWidgets import (QWidget, QVBoxLayout, QHBoxLayout, QPushButton, 
                             QLabel, QComboBox, QGroupBox, QFormLayout, QMessageBox)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont


class AnalysisModule(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()
    
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
        analyze_btn.setStyleSheet("""
            QPushButton {
                background-color: #007acc;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
            }
            QPushButton:hover {
                background-color: #005a9e;
            }
        """)
        analyze_btn.clicked.connect(self.generate_analysis)
        layout.addWidget(analyze_btn)
        
        # 图表区域（占位符）
        self.chart_label = QLabel("📈 图表区域\n\n这里将显示商家年度采购趋势图表\n\n• 柱状图显示每月采购量\n• 折线图显示采购趋势\n• 突出显示采购高峰月份")
        self.chart_label.setFont(QFont("Microsoft YaHei", 12))
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
        layout.addWidget(self.chart_label)
        
        # 统计信息区域
        self.create_statistics_area(layout)
    
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
        card.setStyleSheet(f"""
            QWidget {{
                background-color: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 15px;
            }}
        """)
        
        layout = QVBoxLayout()
        card.setLayout(layout)
        
        # 标题
        title_label = QLabel(title)
        title_label.setFont(QFont("Microsoft YaHei", 10))
        title_label.setStyleSheet("color: #666;")
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
        
        # 模拟分析数据
        analysis_data = {
            "超市A": {
                "2024": {"total": 1250, "avg": 104, "max": 180, "peak_month": "3月"},
                "2023": {"total": 1180, "avg": 98, "max": 165, "peak_month": "5月"},
                "2022": {"total": 1100, "avg": 92, "max": 150, "peak_month": "4月"}
            },
            "超市B": {
                "2024": {"total": 980, "avg": 82, "max": 140, "peak_month": "6月"},
                "2023": {"total": 920, "avg": 77, "max": 130, "peak_month": "7月"},
                "2022": {"total": 850, "avg": 71, "max": 120, "peak_month": "8月"}
            }
        }
        
        if merchant in analysis_data and year in analysis_data[merchant]:
            data = analysis_data[merchant][year]
            QMessageBox.information(self, "分析完成", 
                f"商家：{merchant}\n年份：{year}\n\n"
                f"总采购量：{data['total']} 箱\n"
                f"平均月采购：{data['avg']} 箱\n"
                f"最高月采购：{data['max']} 箱\n"
                f"采购高峰月：{data['peak_month']}\n\n"
                f"图表已更新！")
            
            # 更新图表显示
            self.update_chart_display(merchant, year, data)
        else:
            QMessageBox.information(self, "分析完成", 
                f"商家：{merchant}\n年份：{year}\n\n"
                f"分析报告已生成！\n\n"
                f"• 显示每月采购量趋势\n"
                f"• 识别采购高峰月份\n"
                f"• 提供采购建议")
    
    def update_chart_display(self, merchant, year, data):
        """更新图表显示"""
        chart_text = f"""
📈 {merchant} - {year}年采购分析

📊 月度采购趋势图
• 1月: 85箱    • 7月: 120箱
• 2月: 95箱    • 8月: 110箱  
• 3月: 180箱   • 9月: 105箱
• 4月: 160箱   • 10月: 90箱
• 5月: 140箱   • 11月: 95箱
• 6月: 125箱   • 12月: 100箱

📈 关键指标
• 总采购量: {data['total']}箱
• 平均月采购: {data['avg']}箱
• 最高月采购: {data['max']}箱
• 采购高峰: {data['peak_month']}

💡 分析建议
• 3月为采购高峰，建议提前备货
• 夏季采购量相对稳定
• 建议优化库存管理策略
        """
        
        self.chart_label.setText(chart_text)
        self.chart_label.setStyleSheet("""
            QLabel {
                background-color: #f8f9fa;
                border: 2px solid #007acc;
                border-radius: 8px;
                padding: 20px;
                color: #333;
            }
        """)
