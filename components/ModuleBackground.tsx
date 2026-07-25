
import React from 'react';
import { AnalysisResult, FreightIntel } from '../types';
import {
  LayoutDashboard, Globe, MapPin, Calendar, Users, Briefcase, TrendingUp,
  ShieldCheck, Lightbulb, Target, Ship, Anchor, Package, AlertTriangle,
  Warehouse, FileCheck, Route, CreditCard, Zap
} from 'lucide-react';

interface ModuleBackgroundProps {
  data: AnalysisResult;
  onAddToCRM: () => void;
}

const ChipList: React.FC<{ items?: string[]; empty?: string; tone?: 'slate' | 'blue' | 'emerald' | 'amber' }> = ({
  items, empty = '暂无', tone = 'slate'
}) => {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-800',
  };
  if (!items?.length) return <span className="text-sm font-bold text-slate-400">{empty}</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((c, i) => (
        <span key={i} className={`${tones[tone]} px-2.5 py-1 rounded-lg text-[11px] font-bold`}>{c}</span>
      ))}
    </div>
  );
};

const InfoBlock: React.FC<{ label: string; value?: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400 flex-shrink-0 mt-0.5">{icon}</div>}
    <div className="min-w-0">
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">{value || '公开信息未找到'}</div>
    </div>
  </div>
);

const emptyFreight = (): FreightIntel => ({
  clientRole: 'N/A',
  legalIdentity: '公开信息未找到',
  riskCompliance: '公开信息未找到',
  creditRisk: '公开信息未找到',
  tradeLanes: [],
  originCountries: [],
  preferredPorts: [],
  shipmentVolume: '公开信息未找到',
  shipmentFrequency: '公开信息未找到',
  transportModes: [],
  mainCommodities: [],
  hsCodesHint: '公开信息未找到',
  cargoCharacteristics: '公开信息未找到',
  specialHandling: '公开信息未找到',
  incumbentForwarders: '公开信息未找到',
  incotermsPreference: '公开信息未找到',
  warehouseNetwork: '公开信息未找到',
  customsProfile: '公开信息未找到',
  peakSeasons: '公开信息未找到',
  logisticsPainPoints: '公开信息未找到',
  serviceOpportunities: '公开信息未找到',
  outreachAngles: [],
});

export const ModuleBackground: React.FC<ModuleBackgroundProps> = ({ data, onAddToCRM }) => {
  const fi = data.freightIntel || emptyFreight();
  const isLegacy = !data.freightIntel;

  return (
    <div className="space-y-8 animate-fade-in">
      {isLegacy && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-sm font-bold text-amber-800 flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          当前报告为旧版背调结果，缺少货代专属情报字段。请重新执行「深度调查」以生成航线、货量、合规与物流机会分析。
        </div>
      )}

      {/* 公司基本面 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
              <LayoutDashboard className="text-blue-600" /> 公司基本面
            </h3>
            <button onClick={onAddToCRM} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 touch-manipulation w-full sm:w-auto">
              <ShieldCheck size={14} /> 导入 CRM
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400"><Globe size={20} /></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">总部地点</div>
                  <div className="text-sm font-bold text-slate-800">{data.companyInfo.headquarters}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400"><Calendar size={20} /></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">成立年份</div>
                  <div className="text-sm font-bold text-slate-800">{data.companyInfo.foundedYear}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400"><Ship size={20} /></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">客户角色（货代视角）</div>
                  <div className="text-sm font-bold text-slate-800">{fi.clientRole}</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400"><Users size={20} /></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">公司规模</div>
                  <div className="text-sm font-bold text-slate-800">{data.companyInfo.scale}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400"><Briefcase size={20} /></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">企业性质</div>
                  <div className="text-sm font-bold text-slate-800">{data.companyInfo.nature}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-400"><MapPin size={20} /></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">物流/收货地线索</div>
                  <div className="text-sm font-bold text-slate-800">{data.strategy?.buyingOfficeLocation || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">公司简介</div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">{data.companyInfo.description}</p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-2xl text-white">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <TrendingUp className="text-green-400" /> 财务与结算
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">年营收估算</div>
              <div className="text-2xl font-black text-green-400">{data.financials.revenueEstimate}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">结算 / 账期偏好</div>
              <div className="text-sm font-bold text-slate-300">{data.financials.paymentTerms}</div>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">运费信用风险</div>
              <div className="text-sm font-bold text-slate-300">{fi.creditRisk}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Know Your Shipper / 风险 */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <FileCheck className="text-blue-600" /> Know Your Shipper · 主体与合规
        </h3>
        <p className="text-xs text-slate-400 font-bold mb-6">货代开户前需核实的合法性、制裁与信用维度</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoBlock label="主体合法性" value={fi.legalIdentity} icon={<ShieldCheck size={18} />} />
          <InfoBlock label="制裁 / 合规 / 负面舆情" value={fi.riskCompliance} icon={<AlertTriangle size={18} />} />
          <InfoBlock label="清关资质与进口画像" value={fi.customsProfile} icon={<FileCheck size={18} />} />
        </div>
      </div>

      {/* 航线货量 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Route className="text-blue-600" /> 贸易航线与货量
          </h3>
          <div className="space-y-5">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">主要贸易航线</div>
              <ChipList items={fi.tradeLanes} tone="blue" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">起运国 / 采购来源</div>
              <ChipList items={fi.originCountries} tone="emerald" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">常用港口 (POL / POD)</div>
              <ChipList items={fi.preferredPorts} tone="amber" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <InfoBlock label="年进口量级" value={fi.shipmentVolume} icon={<Ship size={18} />} />
              <InfoBlock label="出货频次" value={fi.shipmentFrequency} icon={<Calendar size={18} />} />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">运输方式</div>
              <ChipList items={fi.transportModes} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Package className="text-blue-600" /> 货类与操作特征
          </h3>
          <div className="space-y-5">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">主要货类</div>
              <ChipList items={fi.mainCommodities.length ? fi.mainCommodities : data.businessScope.coreProducts} tone="blue" />
            </div>
            <InfoBlock label="HS / 海关品类线索" value={fi.hsCodesHint} icon={<FileCheck size={18} />} />
            <InfoBlock label="货型特征" value={fi.cargoCharacteristics} icon={<Package size={18} />} />
            <InfoBlock label="特殊操作与合规要求" value={fi.specialHandling} icon={<AlertTriangle size={18} />} />
            <InfoBlock label="旺季 / 季节性" value={fi.peakSeasons} icon={<Calendar size={18} />} />
          </div>
        </div>
      </div>

      {/* 现有物流与机会 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Anchor className="text-blue-600" /> 现有物流与仓储
          </h3>
          <div className="space-y-5">
            <InfoBlock label="现有货代 / 承运商线索" value={fi.incumbentForwarders} icon={<Ship size={18} />} />
            <InfoBlock label="贸易术语偏好" value={fi.incotermsPreference} icon={<CreditCard size={18} />} />
            <InfoBlock label="海外仓 / DC / 内陆派送" value={fi.warehouseNetwork} icon={<Warehouse size={18} />} />
            <InfoBlock label="供应链角色" value={`${data.supplyChain.role} · ${data.supplyChain.serviceType}`} icon={<Briefcase size={18} />} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Zap className="text-blue-600" /> 痛点与货代切入机会
          </h3>
          <div className="space-y-5">
            <InfoBlock label="物流痛点" value={fi.logisticsPainPoints} icon={<AlertTriangle size={18} />} />
            <InfoBlock label="可切入服务" value={fi.serviceOpportunities} icon={<Lightbulb size={18} />} />
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">开发切入角度</div>
              {fi.outreachAngles.length > 0 ? (
                <ul className="space-y-2">
                  {fi.outreachAngles.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-slate-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                      <span className="bg-emerald-600 text-white w-5 h-5 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">{i + 1}</span>
                      {a}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm font-bold text-slate-400">暂无</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SWOT + 业务模式 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-blue-600" /> SWOT（物流合作视角）
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <div className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-2">优势</div>
              <ul className="text-xs font-bold text-green-800 space-y-1">
                {data.swot.strengths.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <div className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-2">劣势</div>
              <ul className="text-xs font-bold text-red-800 space-y-1">
                {data.swot.weaknesses.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">机会</div>
              <ul className="text-xs font-bold text-blue-800 space-y-1">
                {data.swot.opportunities.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
              <div className="text-[10px] font-black text-yellow-700 uppercase tracking-widest mb-2">威胁</div>
              <ul className="text-xs font-bold text-yellow-800 space-y-1">
                {data.swot.threats.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Target className="text-blue-600" /> 业务模式与渠道
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 mt-1"><Briefcase size={18} /></div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">销售渠道</div>
                <div className="mt-1"><ChipList items={data.businessModel.channels} /></div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 mt-1"><Users size={18} /></div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">目标市场</div>
                <div className="mt-1"><ChipList items={data.targetAudience} tone="blue" /></div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 mt-1"><Lightbulb size={18} /></div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">品牌定位</div>
                <div className="text-sm font-bold text-slate-800 mt-1">{data.businessScope.brandPositioning}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 mt-1"><Globe size={18} /></div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">进口货源结构</div>
                <div className="text-sm font-bold text-slate-800 mt-1">{data.businessModel.procurementInfo}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
