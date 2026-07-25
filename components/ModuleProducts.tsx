
import React from 'react';
import { AnalysisResult } from '../types';
import { PackageSearch, Tag, Info, ShoppingCart, BarChart3, PieChart, Trophy } from 'lucide-react';

interface ModuleProductsProps {
  data: AnalysisResult;
}

export const ModuleProducts: React.FC<ModuleProductsProps> = ({ data }) => {
  const topCategories = (data.products || []).slice(0, 8);
  const fallbackCategories = (data.websiteCategories || []).slice(0, 8);
  const hasProductCards = topCategories.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {data.productSummary && (
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <PieChart className="text-blue-600" /> 品类结构与货代切入点
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <div className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2 flex items-center gap-1"><ShoppingCart size={12}/> 代表性品类与货源结构</div>
                <p className="text-sm font-bold text-blue-900 leading-relaxed">{data.productSummary.marketPreference}</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-1"><Tag size={12}/> 货代服务建议</div>
                <p className="text-sm font-bold text-emerald-900 leading-relaxed">{data.productSummary.recommendedProducts}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="bg-white p-3 rounded-xl text-blue-600 shadow-sm"><PackageSearch size={20}/></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">包装 / 装箱特点</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">{data.productSummary.packagingAnalysis}</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="bg-white p-3 rounded-xl text-amber-600 shadow-sm"><Tag size={20}/></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">出货节奏 / 季节性</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">{data.productSummary.colorPreference}</div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="bg-white p-3 rounded-xl text-green-600 shadow-sm"><BarChart3 size={20}/></div>
                <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">货运特征（泡货/重货等）</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">{data.productSummary.featureAnalysis}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-2">
          <Trophy className="text-blue-600" /> 代表性产品类别 TOP 8
        </h3>
        <p className="text-sm text-slate-400 font-bold mb-6">按该公司业务代表性排序，展示前 8 大产品类别（非单品 SKU）</p>

        {hasProductCards ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {topCategories.map((p, i) => (
              <div key={i} className="bg-slate-50 p-5 sm:p-6 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all group relative overflow-hidden">
                <div className="absolute top-4 right-4 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-black shadow-md">
                  {i + 1}
                </div>
                <h4 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors pr-12 mb-3">{p.name}</h4>

                {p.pricingStrategy && (
                  <div className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-3">
                    {p.pricingStrategy}
                  </div>
                )}

                <div className="space-y-3">
                  {p.features && p.features !== 'N/A' && (
                    <div className="flex items-start gap-2">
                      <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs font-bold text-slate-600"><span className="text-slate-400 uppercase tracking-tighter mr-1">品类简述:</span> {p.features}</div>
                    </div>
                  )}
                  {p.techSpecs && (
                    <div className="flex items-start gap-2">
                      <BarChart3 size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs font-bold text-slate-600"><span className="text-slate-400 uppercase tracking-tighter mr-1">货型:</span> {p.techSpecs}</div>
                    </div>
                  )}
                  {p.packaging && p.packaging !== 'N/A' && (
                    <div className="flex items-start gap-2">
                      <PackageSearch size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs font-bold text-slate-600"><span className="text-slate-400 uppercase tracking-tighter mr-1">包装装箱:</span> {p.packaging}</div>
                    </div>
                  )}
                  {p.pitchPoint && (
                    <div className="flex items-start gap-2">
                      <Tag size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs font-bold text-slate-600"><span className="text-slate-400 uppercase tracking-tighter mr-1">货代切入:</span> {p.pitchPoint}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : fallbackCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fallbackCategories.map((cat, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</div>
                <div>
                  <div className="font-black text-slate-800">{cat.categoryName}</div>
                  {cat.items?.length > 0 && (
                    <div className="text-xs text-slate-500 font-medium mt-1">{cat.items.slice(0, 4).join(' · ')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 font-bold">暂无产品类别数据，请先完成深度调查</div>
        )}
      </div>
    </div>
  );
};
