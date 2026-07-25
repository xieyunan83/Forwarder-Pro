/** 五大洲 → 国家（中英对照，供客户搜索多选） */
export interface ContinentGroup {
  id: string;
  name: string;
  nameEn: string;
  countries: { code: string; name: string; nameEn: string }[];
}

export const CONTINENTS: ContinentGroup[] = [
  {
    id: 'asia',
    name: '亚洲',
    nameEn: 'Asia',
    countries: [
      { code: 'CN', name: '中国', nameEn: 'China' },
      { code: 'JP', name: '日本', nameEn: 'Japan' },
      { code: 'KR', name: '韩国', nameEn: 'South Korea' },
      { code: 'IN', name: '印度', nameEn: 'India' },
      { code: 'ID', name: '印度尼西亚', nameEn: 'Indonesia' },
      { code: 'TH', name: '泰国', nameEn: 'Thailand' },
      { code: 'VN', name: '越南', nameEn: 'Vietnam' },
      { code: 'MY', name: '马来西亚', nameEn: 'Malaysia' },
      { code: 'SG', name: '新加坡', nameEn: 'Singapore' },
      { code: 'PH', name: '菲律宾', nameEn: 'Philippines' },
      { code: 'TW', name: '中国台湾', nameEn: 'Taiwan' },
      { code: 'HK', name: '中国香港', nameEn: 'Hong Kong' },
      { code: 'MO', name: '中国澳门', nameEn: 'Macau' },
      { code: 'BD', name: '孟加拉国', nameEn: 'Bangladesh' },
      { code: 'PK', name: '巴基斯坦', nameEn: 'Pakistan' },
      { code: 'AE', name: '阿联酋', nameEn: 'United Arab Emirates' },
      { code: 'SA', name: '沙特阿拉伯', nameEn: 'Saudi Arabia' },
      { code: 'TR', name: '土耳其', nameEn: 'Turkey' },
      { code: 'IL', name: '以色列', nameEn: 'Israel' },
      { code: 'QA', name: '卡塔尔', nameEn: 'Qatar' },
      { code: 'KW', name: '科威特', nameEn: 'Kuwait' },
      { code: 'OM', name: '阿曼', nameEn: 'Oman' },
      { code: 'BH', name: '巴林', nameEn: 'Bahrain' },
      { code: 'JO', name: '约旦', nameEn: 'Jordan' },
      { code: 'LB', name: '黎巴嫩', nameEn: 'Lebanon' },
      { code: 'IQ', name: '伊拉克', nameEn: 'Iraq' },
      { code: 'IR', name: '伊朗', nameEn: 'Iran' },
      { code: 'KZ', name: '哈萨克斯坦', nameEn: 'Kazakhstan' },
      { code: 'UZ', name: '乌兹别克斯坦', nameEn: 'Uzbekistan' },
      { code: 'LK', name: '斯里兰卡', nameEn: 'Sri Lanka' },
      { code: 'MM', name: '缅甸', nameEn: 'Myanmar' },
      { code: 'KH', name: '柬埔寨', nameEn: 'Cambodia' },
      { code: 'LA', name: '老挝', nameEn: 'Laos' },
      { code: 'NP', name: '尼泊尔', nameEn: 'Nepal' },
      { code: 'MN', name: '蒙古', nameEn: 'Mongolia' },
      { code: 'BN', name: '文莱', nameEn: 'Brunei' },
    ],
  },
  {
    id: 'europe',
    name: '欧洲',
    nameEn: 'Europe',
    countries: [
      { code: 'DE', name: '德国', nameEn: 'Germany' },
      { code: 'GB', name: '英国', nameEn: 'United Kingdom' },
      { code: 'FR', name: '法国', nameEn: 'France' },
      { code: 'IT', name: '意大利', nameEn: 'Italy' },
      { code: 'ES', name: '西班牙', nameEn: 'Spain' },
      { code: 'NL', name: '荷兰', nameEn: 'Netherlands' },
      { code: 'BE', name: '比利时', nameEn: 'Belgium' },
      { code: 'CH', name: '瑞士', nameEn: 'Switzerland' },
      { code: 'AT', name: '奥地利', nameEn: 'Austria' },
      { code: 'SE', name: '瑞典', nameEn: 'Sweden' },
      { code: 'NO', name: '挪威', nameEn: 'Norway' },
      { code: 'DK', name: '丹麦', nameEn: 'Denmark' },
      { code: 'FI', name: '芬兰', nameEn: 'Finland' },
      { code: 'PL', name: '波兰', nameEn: 'Poland' },
      { code: 'PT', name: '葡萄牙', nameEn: 'Portugal' },
      { code: 'IE', name: '爱尔兰', nameEn: 'Ireland' },
      { code: 'GR', name: '希腊', nameEn: 'Greece' },
      { code: 'CZ', name: '捷克', nameEn: 'Czech Republic' },
      { code: 'HU', name: '匈牙利', nameEn: 'Hungary' },
      { code: 'RO', name: '罗马尼亚', nameEn: 'Romania' },
      { code: 'BG', name: '保加利亚', nameEn: 'Bulgaria' },
      { code: 'SK', name: '斯洛伐克', nameEn: 'Slovakia' },
      { code: 'SI', name: '斯洛文尼亚', nameEn: 'Slovenia' },
      { code: 'HR', name: '克罗地亚', nameEn: 'Croatia' },
      { code: 'RS', name: '塞尔维亚', nameEn: 'Serbia' },
      { code: 'UA', name: '乌克兰', nameEn: 'Ukraine' },
      { code: 'RU', name: '俄罗斯', nameEn: 'Russia' },
      { code: 'LT', name: '立陶宛', nameEn: 'Lithuania' },
      { code: 'LV', name: '拉脱维亚', nameEn: 'Latvia' },
      { code: 'EE', name: '爱沙尼亚', nameEn: 'Estonia' },
      { code: 'LU', name: '卢森堡', nameEn: 'Luxembourg' },
      { code: 'IS', name: '冰岛', nameEn: 'Iceland' },
      { code: 'MT', name: '马耳他', nameEn: 'Malta' },
      { code: 'CY', name: '塞浦路斯', nameEn: 'Cyprus' },
    ],
  },
  {
    id: 'north_america',
    name: '北美洲',
    nameEn: 'North America',
    countries: [
      { code: 'US', name: '美国', nameEn: 'United States' },
      { code: 'CA', name: '加拿大', nameEn: 'Canada' },
      { code: 'MX', name: '墨西哥', nameEn: 'Mexico' },
      { code: 'PA', name: '巴拿马', nameEn: 'Panama' },
      { code: 'CR', name: '哥斯达黎加', nameEn: 'Costa Rica' },
      { code: 'GT', name: '危地马拉', nameEn: 'Guatemala' },
      { code: 'HN', name: '洪都拉斯', nameEn: 'Honduras' },
      { code: 'SV', name: '萨尔瓦多', nameEn: 'El Salvador' },
      { code: 'NI', name: '尼加拉瓜', nameEn: 'Nicaragua' },
      { code: 'BZ', name: '伯利兹', nameEn: 'Belize' },
      { code: 'CU', name: '古巴', nameEn: 'Cuba' },
      { code: 'DO', name: '多米尼加', nameEn: 'Dominican Republic' },
      { code: 'JM', name: '牙买加', nameEn: 'Jamaica' },
      { code: 'TT', name: '特立尼达和多巴哥', nameEn: 'Trinidad and Tobago' },
      { code: 'PR', name: '波多黎各', nameEn: 'Puerto Rico' },
    ],
  },
  {
    id: 'south_america',
    name: '南美洲',
    nameEn: 'South America',
    countries: [
      { code: 'BR', name: '巴西', nameEn: 'Brazil' },
      { code: 'AR', name: '阿根廷', nameEn: 'Argentina' },
      { code: 'CL', name: '智利', nameEn: 'Chile' },
      { code: 'CO', name: '哥伦比亚', nameEn: 'Colombia' },
      { code: 'PE', name: '秘鲁', nameEn: 'Peru' },
      { code: 'EC', name: '厄瓜多尔', nameEn: 'Ecuador' },
      { code: 'VE', name: '委内瑞拉', nameEn: 'Venezuela' },
      { code: 'UY', name: '乌拉圭', nameEn: 'Uruguay' },
      { code: 'PY', name: '巴拉圭', nameEn: 'Paraguay' },
      { code: 'BO', name: '玻利维亚', nameEn: 'Bolivia' },
      { code: 'GY', name: '圭亚那', nameEn: 'Guyana' },
      { code: 'SR', name: '苏里南', nameEn: 'Suriname' },
    ],
  },
  {
    id: 'africa_oceania',
    name: '非洲与大洋洲',
    nameEn: 'Africa & Oceania',
    countries: [
      { code: 'ZA', name: '南非', nameEn: 'South Africa' },
      { code: 'EG', name: '埃及', nameEn: 'Egypt' },
      { code: 'NG', name: '尼日利亚', nameEn: 'Nigeria' },
      { code: 'KE', name: '肯尼亚', nameEn: 'Kenya' },
      { code: 'MA', name: '摩洛哥', nameEn: 'Morocco' },
      { code: 'GH', name: '加纳', nameEn: 'Ghana' },
      { code: 'ET', name: '埃塞俄比亚', nameEn: 'Ethiopia' },
      { code: 'TZ', name: '坦桑尼亚', nameEn: 'Tanzania' },
      { code: 'DZ', name: '阿尔及利亚', nameEn: 'Algeria' },
      { code: 'TN', name: '突尼斯', nameEn: 'Tunisia' },
      { code: 'AO', name: '安哥拉', nameEn: 'Angola' },
      { code: 'CI', name: '科特迪瓦', nameEn: "Côte d'Ivoire" },
      { code: 'SN', name: '塞内加尔', nameEn: 'Senegal' },
      { code: 'AU', name: '澳大利亚', nameEn: 'Australia' },
      { code: 'NZ', name: '新西兰', nameEn: 'New Zealand' },
      { code: 'FJ', name: '斐济', nameEn: 'Fiji' },
      { code: 'PG', name: '巴布亚新几内亚', nameEn: 'Papua New Guinea' },
    ],
  },
];

export function parseSelectedCountries(raw: string): string[] {
  if (!raw?.trim()) return [];
  return raw.split(/[,，;/|]+/).map(s => s.trim()).filter(Boolean);
}

export function formatSelectedCountries(codesOrNames: string[]): string {
  return codesOrNames.join(', ');
}

/** 将已选值解析为英文国名列表（供 AI 搜索） */
export function toSearchCountryQuery(raw: string): string {
  const selected = parseSelectedCountries(raw);
  if (selected.length === 0) return 'Global';

  const all = CONTINENTS.flatMap(c => c.countries);
  return selected
    .map(s => {
      const hit = all.find(
        c => c.nameEn.toLowerCase() === s.toLowerCase()
          || c.name === s
          || c.code.toLowerCase() === s.toLowerCase()
      );
      return hit ? hit.nameEn : s;
    })
    .join(', ');
}
