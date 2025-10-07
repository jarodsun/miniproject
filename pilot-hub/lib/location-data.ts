// 中国地区数据 - 简化版本
export interface LocationItem {
  code: string;
  name: string;
  children?: LocationItem[];
}

export const locationData: LocationItem[] = [
  {
    code: '110000',
    name: '北京市',
    children: [
      {
        code: '110100',
        name: '北京市',
        children: [
          { code: '110101', name: '东城区' },
          { code: '110102', name: '西城区' },
          { code: '110105', name: '朝阳区' },
          { code: '110106', name: '丰台区' },
          { code: '110107', name: '石景山区' },
          { code: '110108', name: '海淀区' },
          { code: '110109', name: '门头沟区' },
          { code: '110111', name: '房山区' },
          { code: '110112', name: '通州区' },
          { code: '110113', name: '顺义区' },
          { code: '110114', name: '昌平区' },
          { code: '110115', name: '大兴区' },
          { code: '110116', name: '怀柔区' },
          { code: '110117', name: '平谷区' },
          { code: '110118', name: '密云区' },
          { code: '110119', name: '延庆区' }
        ]
      }
    ]
  },
  {
    code: '120000',
    name: '天津市',
    children: [
      {
        code: '120100',
        name: '天津市',
        children: [
          { code: '120101', name: '和平区' },
          { code: '120102', name: '河东区' },
          { code: '120103', name: '河西区' },
          { code: '120104', name: '南开区' },
          { code: '120105', name: '河北区' },
          { code: '120106', name: '红桥区' },
          { code: '120110', name: '东丽区' },
          { code: '120111', name: '西青区' },
          { code: '120112', name: '津南区' },
          { code: '120113', name: '北辰区' },
          { code: '120114', name: '武清区' },
          { code: '120115', name: '宝坻区' },
          { code: '120116', name: '滨海新区' },
          { code: '120117', name: '宁河区' },
          { code: '120118', name: '静海区' },
          { code: '120119', name: '蓟州区' }
        ]
      }
    ]
  },
  {
    code: '130000',
    name: '河北省',
    children: [
      {
        code: '130100',
        name: '石家庄市',
        children: [
          { code: '130102', name: '长安区' },
          { code: '130104', name: '桥西区' },
          { code: '130105', name: '新华区' },
          { code: '130107', name: '井陉矿区' },
          { code: '130108', name: '裕华区' },
          { code: '130109', name: '藁城区' },
          { code: '130110', name: '鹿泉区' },
          { code: '130111', name: '栾城区' },
          { code: '130121', name: '井陉县' },
          { code: '130123', name: '正定县' },
          { code: '130125', name: '行唐县' },
          { code: '130126', name: '灵寿县' },
          { code: '130127', name: '高邑县' },
          { code: '130128', name: '深泽县' },
          { code: '130129', name: '赞皇县' },
          { code: '130130', name: '无极县' },
          { code: '130131', name: '平山县' },
          { code: '130132', name: '元氏县' },
          { code: '130133', name: '赵县' },
          { code: '130183', name: '晋州市' },
          { code: '130184', name: '新乐市' }
        ]
      },
      {
        code: '130200',
        name: '唐山市',
        children: [
          { code: '130202', name: '路南区' },
          { code: '130203', name: '路北区' },
          { code: '130204', name: '古冶区' },
          { code: '130205', name: '开平区' },
          { code: '130207', name: '丰南区' },
          { code: '130208', name: '丰润区' },
          { code: '130209', name: '曹妃甸区' },
          { code: '130223', name: '滦县' },
          { code: '130224', name: '滦南县' },
          { code: '130225', name: '乐亭县' },
          { code: '130227', name: '迁西县' },
          { code: '130229', name: '玉田县' },
          { code: '130281', name: '遵化市' },
          { code: '130283', name: '迁安市' }
        ]
      }
    ]
  },
  {
    code: '310000',
    name: '上海市',
    children: [
      {
        code: '310100',
        name: '上海市',
        children: [
          { code: '310101', name: '黄浦区' },
          { code: '310104', name: '徐汇区' },
          { code: '310105', name: '长宁区' },
          { code: '310106', name: '静安区' },
          { code: '310107', name: '普陀区' },
          { code: '310109', name: '虹口区' },
          { code: '310110', name: '杨浦区' },
          { code: '310112', name: '闵行区' },
          { code: '310113', name: '宝山区' },
          { code: '310114', name: '嘉定区' },
          { code: '310115', name: '浦东新区' },
          { code: '310116', name: '金山区' },
          { code: '310117', name: '松江区' },
          { code: '310118', name: '青浦区' },
          { code: '310120', name: '奉贤区' },
          { code: '310151', name: '崇明区' }
        ]
      }
    ]
  },
  {
    code: '320000',
    name: '江苏省',
    children: [
      {
        code: '320100',
        name: '南京市',
        children: [
          { code: '320102', name: '玄武区' },
          { code: '320104', name: '秦淮区' },
          { code: '320105', name: '建邺区' },
          { code: '320106', name: '鼓楼区' },
          { code: '320111', name: '浦口区' },
          { code: '320113', name: '栖霞区' },
          { code: '320114', name: '雨花台区' },
          { code: '320115', name: '江宁区' },
          { code: '320116', name: '六合区' },
          { code: '320117', name: '溧水区' },
          { code: '320118', name: '高淳区' }
        ]
      },
      {
        code: '320200',
        name: '无锡市',
        children: [
          { code: '320205', name: '锡山区' },
          { code: '320206', name: '惠山区' },
          { code: '320211', name: '滨湖区' },
          { code: '320213', name: '梁溪区' },
          { code: '320214', name: '新吴区' },
          { code: '320281', name: '江阴市' },
          { code: '320282', name: '宜兴市' }
        ]
      }
    ]
  },
  {
    code: '330000',
    name: '浙江省',
    children: [
      {
        code: '330100',
        name: '杭州市',
        children: [
          { code: '330102', name: '上城区' },
          { code: '330105', name: '拱墅区' },
          { code: '330106', name: '西湖区' },
          { code: '330108', name: '滨江区' },
          { code: '330109', name: '萧山区' },
          { code: '330110', name: '余杭区' },
          { code: '330111', name: '富阳区' },
          { code: '330112', name: '临安区' },
          { code: '330113', name: '临平区' },
          { code: '330114', name: '钱塘区' },
          { code: '330122', name: '桐庐县' },
          { code: '330127', name: '淳安县' },
          { code: '330182', name: '建德市' }
        ]
      }
    ]
  },
  {
    code: '440000',
    name: '广东省',
    children: [
      {
        code: '440100',
        name: '广州市',
        children: [
          { code: '440103', name: '荔湾区' },
          { code: '440104', name: '越秀区' },
          { code: '440105', name: '海珠区' },
          { code: '440106', name: '天河区' },
          { code: '440111', name: '白云区' },
          { code: '440112', name: '黄埔区' },
          { code: '440113', name: '番禺区' },
          { code: '440114', name: '花都区' },
          { code: '440115', name: '南沙区' },
          { code: '440117', name: '从化区' },
          { code: '440118', name: '增城区' }
        ]
      },
      {
        code: '440300',
        name: '深圳市',
        children: [
          { code: '440303', name: '罗湖区' },
          { code: '440304', name: '福田区' },
          { code: '440305', name: '南山区' },
          { code: '440306', name: '宝安区' },
          { code: '440307', name: '龙岗区' },
          { code: '440308', name: '盐田区' },
          { code: '440309', name: '龙华区' },
          { code: '440310', name: '坪山区' },
          { code: '440311', name: '光明区' }
        ]
      }
    ]
  }
];

// 获取省份列表
export const getProvinces = () => {
  return locationData.map(province => ({
    code: province.code,
    name: province.name
  }));
};

// 根据省份代码获取城市列表
export const getCitiesByProvince = (provinceCode: string) => {
  const province = locationData.find(p => p.code === provinceCode);
  if (!province || !province.children) return [];
  
  return province.children.map(city => ({
    code: city.code,
    name: city.name
  }));
};

// 根据城市代码获取区县列表
export const getDistrictsByCity = (provinceCode: string, cityCode: string) => {
  const province = locationData.find(p => p.code === provinceCode);
  if (!province || !province.children) return [];
  
  const city = province.children.find(c => c.code === cityCode);
  if (!city || !city.children) return [];
  
  return city.children.map(district => ({
    code: district.code,
    name: district.name
  }));
};
