import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, X, Check } from 'lucide-react';
import { CONTINENTS, parseSelectedCountries, formatSelectedCountries } from '../data/continents';

interface CountryMultiSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const CountryMultiSelect: React.FC<CountryMultiSelectProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ asia: true });
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => parseSelectedCountries(value), [value]);
  const selectedSet = useMemo(() => new Set(selected.map(s => s.toLowerCase())), [selected]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const isSelected = (nameEn: string, name: string) =>
    selectedSet.has(nameEn.toLowerCase()) || selectedSet.has(name.toLowerCase());

  const toggleCountry = (nameEn: string) => {
    const key = nameEn.toLowerCase();
    const next = selected.filter(s => s.toLowerCase() !== key && s !== nameEn);
    const already = selected.some(s => s.toLowerCase() === key);
    if (!already) next.push(nameEn);
    onChange(formatSelectedCountries(next));
  };

  const toggleContinent = (continentId: string, selectAll: boolean) => {
    const continent = CONTINENTS.find(c => c.id === continentId);
    if (!continent) return;
    const names = continent.countries.map(c => c.nameEn);
    let next = [...selected];
    if (selectAll) {
      for (const n of names) {
        if (!next.some(s => s.toLowerCase() === n.toLowerCase())) next.push(n);
      }
    } else {
      const drop = new Set(names.map(n => n.toLowerCase()));
      next = next.filter(s => !drop.has(s.toLowerCase()));
    }
    onChange(formatSelectedCountries(next));
  };

  const continentStats = (continentId: string) => {
    const continent = CONTINENTS.find(c => c.id === continentId)!;
    const count = continent.countries.filter(c => isSelected(c.nameEn, c.name)).length;
    return { total: continent.countries.length, count, all: count === continent.countries.length && count > 0 };
  };

  const removeChip = (name: string) => {
    onChange(formatSelectedCountries(selected.filter(s => s.toLowerCase() !== name.toLowerCase())));
  };

  const labelFor = (nameEn: string) => {
    const hit = CONTINENTS.flatMap(c => c.countries).find(c => c.nameEn.toLowerCase() === nameEn.toLowerCase());
    return hit ? `${hit.name}` : nameEn;
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="relative w-full min-h-[48px] pl-12 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold text-left bg-white touch-manipulation"
      >
        <MapPin className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
        {selected.length === 0 ? (
          <span className="text-slate-400 font-bold">选择大洲 / 国家（可多选）</span>
        ) : (
          <span className="text-slate-800">已选 {selected.length} 个国家</span>
        )}
        <ChevronDown className={`absolute right-3 top-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} size={18} />
      </button>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map(s => (
            <span key={s} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[11px] font-black px-2 py-1 rounded-lg border border-blue-100">
              {labelFor(s)}
              <button type="button" onClick={() => removeChip(s)} className="hover:text-red-500 touch-manipulation" aria-label="移除">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-40 mt-2 w-full min-w-[280px] max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl custom-scrollbar">
          <div className="sticky top-0 bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">五大洲 · 多选国家</span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-[10px] font-black text-red-500 hover:underline touch-manipulation"
              >
                清空
              </button>
            )}
          </div>

          {CONTINENTS.map(continent => {
            const stats = continentStats(continent.id);
            const isOpen = !!expanded[continent.id];
            return (
              <div key={continent.id} className="border-b border-slate-50 last:border-none">
                <div className="flex items-center gap-1 px-2 py-2 hover:bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setExpanded(prev => ({ ...prev, [continent.id]: !prev[continent.id] }))}
                    className="p-1.5 text-slate-400 touch-manipulation"
                    aria-label={isOpen ? '收起' : '展开'}
                  >
                    {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleContinent(continent.id, !stats.all)}
                    className="flex-1 flex items-center justify-between text-left touch-manipulation py-1"
                  >
                    <span className="text-sm font-black text-slate-800">
                      {continent.name}
                      <span className="text-slate-400 font-bold ml-1 text-xs">({continent.nameEn})</span>
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${stats.count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
                      {stats.count}/{stats.total}
                    </span>
                  </button>
                </div>

                {isOpen && (
                  <div className="pb-2 px-2 grid grid-cols-1 gap-0.5">
                    {continent.countries.map(country => {
                      const checked = isSelected(country.nameEn, country.name);
                      return (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => toggleCountry(country.nameEn)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left touch-manipulation ${checked ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
                        >
                          <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                            {checked && <Check size={10} strokeWidth={3} />}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{country.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium ml-auto">{country.nameEn}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
