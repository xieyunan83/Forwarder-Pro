
export enum ModuleType {
  DISCOVERY = 'discovery',
  BACKGROUND = 'background',
  PRODUCTS = 'products',
  DECISION_MAKERS = 'decision_makers',
  STRATEGY = 'strategy',
  SIMILAR = 'similar',
  PROMO_GENERATOR = 'promo_generator',
  CLIENT_CRM = 'client_crm',
  EMAIL_CAMPAIGN = 'email_campaign',
  IMAGE_GEN = 'image_gen',
}

export interface User {
  username: string;
  password?: string;
  role: 'admin' | 'user';
  isFirstLogin: boolean;
  createdAt: number;
}

// NEW: Global Configuration stored in GitHub
export interface GlobalConfig {
  lastUpdated: number;
  dailyLimits: {
    search: number;   // Max searches per day
    analysis: number; // Max deep analysis per day
  };
  systemNotice: string; // Admin message to users
  sharedApiKeys?: {
    google?: string;
    hunter?: string;
  }
}

// NEW: User Usage Tracking (Local)
export interface DailyUsage {
  date: string; // YYYY-MM-DD
  searchCount: number;
  analysisCount: number;
}

export interface HistoryItem {
  id: string;
  type: ModuleType;
  data: AnalysisResult;
  timestamp: number;
  domain: string;
}

export interface MailGroup {
  analysis: string;
  email1: string;
  email2: string;
  email3: string;
}

export interface AutomationResult {
  id: string;
  clientName: string;
  website: string;
  country: string;
  status: 'pending' | 'analyzing' | 'generating_email' | 'completed' | 'failed';
  analysis?: AnalysisResult;
  mailGroup?: MailGroup;
  productContext?: string; 
  productImages?: string[]; 
  mode?: 'detailed' | 'economy'; 
}

export interface DecisionMaker {
  name: string;
  firstName?: string;
  lastName?: string;
  title: string;
  yearsActive?: string;
  emailGuess?: string;
  linkedin?: string;
  type: 'CEO' | 'Board' | 'Logistics' | 'Other';
  source: 'AI' | 'AI (Pattern Guess)' | 'Hunter.io' | 'Findymail' | 'AnymailFinder' | 'Manual';
  isVerified: boolean;
  confidence?: number;
}

export interface Client {
  id: string;
  name: string;
  website?: string; 
  country: string;
  type: '进口商' | '零售商' | '批发商' | '分销商';
  status: '新建/潜在' | '已寄样' | '谈判中' | '已成交' | '流失/搁置';
  productType: string;
  industry: string; // Added industry field
  priceRange: string;
  isSampleNeeded: boolean;
  hasAnalyzed?: boolean; 
  hasBackgroundCheck?: boolean; // Added field
  lastOrderDate: string;
  lastContactSent: string;
  lastContactReceived: string;
  nextFollowUpDate: string;
  activityLog: string;
  contacts?: DecisionMaker[]; // Added contacts list
}

// ... existing interfaces ...

export interface SwotAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface TrafficData {
  category: string;
  trafficType: 'Organic (SEO)' | 'Paid (SEM)' | 'Direct' | 'Social';
  topKeywords: string;
  volumeEst: 'High' | 'Medium' | 'Low';
}

export interface YearTrend {
  year: string;
  revenue: number;
  procurement: number;
}

export interface ProductAnalysis {
  name: string;
  retailPrice: string;
  retailPriceCNY: number;
  estimatedFOBPriceCNY: number;
  marginSpace?: 'High' | 'Medium' | 'Low';
  ratio?: string;
  pricingStrategy?: string;
  pitchPoint?: string;
  techSpecs?: string;
  features?: string;
  colors?: string;
  packaging?: string;
  imageUrl?: string;
  competitorLink?: string;
}

export interface WebsiteCategory {
  categoryName: string;
  items: string[];
}

export interface FreightIntel {
  /** 客户在供应链中的角色：进口商/品牌方/分销商/零售商等 */
  clientRole: string;
  /** 主体合法性与注册信息（Know Your Shipper） */
  legalIdentity: string;
  /** 制裁名单、合规与负面舆情风险 */
  riskCompliance: string;
  /** 运费结算信誉与账期风险 */
  creditRisk: string;
  /** 主要贸易航线，如 China → US West Coast */
  tradeLanes: string[];
  /** 主要起运国 / 采购来源国 */
  originCountries: string[];
  /** 常用起运港 / 目的港 */
  preferredPorts: string[];
  /** 年进口量级估算（TEU / 票数 / 货值） */
  shipmentVolume: string;
  /** 出货/补货频次与节奏 */
  shipmentFrequency: string;
  /** 运输方式：海运整柜、拼箱、空运、快递等 */
  transportModes: string[];
  /** 主要货类 / 品类 */
  mainCommodities: string[];
  /** HS 编码或海关品类线索 */
  hsCodesHint: string;
  /** 货型特征：泡货、重货、危险品、温控、超尺寸等 */
  cargoCharacteristics: string;
  /** 特殊操作与合规要求（FDA、危品申报、木包装等） */
  specialHandling: string;
  /** 现有货代 / 船东 / 承运商线索 */
  incumbentForwarders: string;
  /** 常见贸易术语偏好：FOB / CIF / DDP 等 */
  incotermsPreference: string;
  /** 海外仓 / DC / 内陆派送布局 */
  warehouseNetwork: string;
  /** 清关能力与进口资质特点 */
  customsProfile: string;
  /** 旺季与季节性出货规律 */
  peakSeasons: string;
  /** 物流痛点（时效、成本、滞港、合规） */
  logisticsPainPoints: string;
  /** 货代可切入的服务机会 */
  serviceOpportunities: string;
  /** 开发话术 / 切入角度 */
  outreachAngles: string[];
}

export interface AnalysisResult {
  companyInfo: {
    name: string;
    headquarters: string;
    foundedYear: string;
    nature: string;
    scale: string;
    website: string;
    description: string;
  };
  swot: SwotAnalysis;
  financialTrends: YearTrend[];
  trafficAnalysis: TrafficData[];
  websiteCategories: WebsiteCategory[];
  businessScope: {
    coreProducts: string[];
    relevantProducts: string[];
    brandPositioning: string;
    consumerGroup: string;
    productVariety: 'High' | 'Medium' | 'Low';
    priceSensitivity: string;
    websiteStructure: string;
  };
  businessModel: {
    channels: string[];
    hasDistributors: boolean;
    exhibitionHistory: string[];
    ecommercePresence: string[];
    procurementInfo: string;
  };
  supplyChain: {
    role: string;
    serviceType: string;
  };
  /** 货代视角客户情报（航线、货量、合规、现有物流等） */
  freightIntel?: FreightIntel;
  targetAudience: string[];
  financials: {
    revenueEstimate: string;
    paymentTerms: string;
    ipInfo: string;
  };
  productSummary?: {
    marketPreference: string;
    recommendedProducts: string;
    packagingAnalysis: string;
    colorPreference: string;
    featureAnalysis: string;
  };
  socials: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    similarWebTraffic?: string;
  };
  products: ProductAnalysis[];
  marketTrends: string;
  decisionMakers: DecisionMaker[];
  strategy: {
    buyingOfficeLocation: string;
    actionPlan: string[];
  };
  similarCompanies: SimilarCompany[];
  generatedEmails?: MailGroup; 
}

export interface SimilarCompany {
  name: string;
  website: string;
  country: string;
  mainProducts: string;
}

export interface ClientSearchResult {
  name: string;
  website: string;
  description: string;
  country: string;
}

export interface EmailTemplateRequest {
  style: 'YIBING' | 'LIAOSHEN' | 'WANGSHENG';
  ourProducts: string;
  existingClients: string;
  advantages: string;
  extraInfo: string;
  sourceContext: string;
  painPoint: string;
  personalHook: string;
}

export interface DiscoveryState {
  product: string;
  country: string;
  industry: string;
  clientType: string;
  results: ClientSearchResult[];
  hasSearched: boolean;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: string;
  data: string;
  size: number;
  mimeType?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  attachments?: KnowledgeFile[];
  timestamp: number;
}

export interface KeywordExtractionResult {
  industryTerms: string[];
  tier1Keywords: string[];
  tier2Keywords: string[];
}

export type TaskType = 'default' | 'analysis' | 'search' | 'email' | 'keywords' | 'chat';

export interface ApiConfig {
    id: string;
    apiKey: string;
    baseUrl: string;
    modelId?: string;
    taskAssignment?: TaskType;
    priority?: number; // 1 = Highest, 2 = Backup, etc.
}

// --- NEW TYPES FOR EMAIL MODULE ---

export interface AliyunConfig {
    accessKeyId: string;
    accessKeySecret: string;
    accountName: string; // e.g. offer@service.babyworld.com
    fromAlias: string;   // e.g. Kevin from BabyWorld
    replyToAddress: boolean;
    addressType: 1 | 0; // 1: Random, 0: Fixed
    tagName: string; // Tag for tracking
    regionId: string; // cn-hangzhou, ap-southeast-1
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    senderName?: string; // New field for Sender Alias override
    body: string; // HTML content
    attachments?: string[]; // List of file names (visual only for now)
    lastUpdated: number;
}

export interface EmailTask {
    id: string;
    recipientEmail: string;
    recipientName: string;
    companyName: string;
    status: 'pending' | 'sending' | 'success' | 'failed';
    error?: string;
    sentAt?: number;
}
