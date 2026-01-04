
import React, { useState, useMemo } from 'react';
import { CompanyLevel, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CompanyLevelListPageProps {
  levels: CompanyLevel[];
  onEdit: (level: CompanyLevel) => void;
  onView: (level: CompanyLevel) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onNavigate: (view: ViewType) => void;
}

type SortConfig = {
  key: keyof CompanyLevel;
  direction: 'asc' | 'desc';
} | null;

export const CompanyLevelListPage: React.FC<CompanyLevelListPageProps> = ({ 
  levels, onEdit, onView, onAdd, onDelete, onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const handleSort = (key: keyof CompanyLevel) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedLevels = useMemo(() => {
    let result = levels.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === valB) return 0;
        const comparison = (valA as any) < (valB as any) ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [levels, searchTerm, sortConfig]);

  const HeaderCell = ({ label, columnKey }: { label: string, columnKey: keyof CompanyLevel }) => (
    <th 
      className="p-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-gray-400 cursor-pointer select-none group hover:bg-gray-100 dark:hover:bg-[#2e3b4b] transition-colors"
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortConfig?.key === columnKey ? (
          <span className="material-symbols-outlined text-[16px] text-primary">
            {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </span>
        ) : (
          <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-50 transition-opacity">unfold_more</span>
        )}
      </div>
    </th>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark py-8 px-4 sm:px-8">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
        <Breadcrumbs currentView="company-levels" onNavigate={onNavigate} />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-[#111418] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              Company Levels
            </h2>
            <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">
              Manage organizational hierarchy levels definitions.
            </p>
          </div>
          <div>
            <button 
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add Level
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#334155] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#e5e7eb] dark:border-[#334155] flex items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#1e293b]">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#617589]">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </span>
              <input 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#dbe0e6] dark:border-[#475569] bg-white dark:bg-[#0f172a] text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white placeholder:text-gray-400 transition-all" 
                placeholder="Search levels..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0f172a]/60 border-b border-[#e5e7eb] dark:border-[#334155]">
                  <HeaderCell label="Level Name" columnKey="name" />
                  <HeaderCell label="Description" columnKey="description" />
                  <HeaderCell label="Status" columnKey="isActive" />
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-[#617589] dark:text-gray-400 text-right w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#334155]">
                {processedLevels.map((level) => (
                  <tr key={level.id} className="group hover:bg-gray-50 dark:hover:bg-[#334155]/30 transition-colors">
                    <td className="p-4">
                      <span className="text-sm font-semibold text-[#111418] dark:text-white">{level.name}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-[#617589] dark:text-gray-300">{level.description}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        level.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${level.isActive ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-500'}`}></span>
                        {level.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onView(level)} className="p-1.5 rounded-md text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors" title="View Details">
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button onClick={() => onEdit(level)} className="p-1.5 rounded-md text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => onDelete(level.id)} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {processedLevels.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-500 italic">No company levels found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#e5e7eb] dark:border-[#334155] flex items-center justify-between bg-gray-50/50 dark:bg-[#1e293b]">
            <span className="text-xs text-[#617589] dark:text-gray-400">
              Showing <span className="font-medium text-[#111418] dark:text-white">1</span> to <span className="font-medium text-[#111418] dark:text-white">{processedLevels.length}</span> of <span className="font-medium text-[#111418] dark:text-white">{levels.length}</span> results
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
