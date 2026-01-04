
import React, { useState, useMemo } from 'react';
import { CompanyDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CompanyListPageProps {
  companies: CompanyDetails[];
  onEdit: (company: CompanyDetails) => void;
  onView: (company: CompanyDetails) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onNavigate: (view: ViewType) => void;
}

type SortConfig = {
  key: keyof CompanyDetails;
  direction: 'asc' | 'desc';
} | null;

export const CompanyListPage: React.FC<CompanyListPageProps> = ({ 
  companies, onEdit, onView, onAdd, onDelete, onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const handleSort = (key: keyof CompanyDetails) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedCompanies = useMemo(() => {
    let result = companies.filter(c => 
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cinNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === undefined || valB === undefined) return 0;
        if (valA === valB) return 0;
        const comparison = valA < valB ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [companies, searchTerm, sortConfig]);

  const HeaderCell = ({ label, columnKey }: { label: string, columnKey: keyof CompanyDetails }) => (
    <th 
      className="p-4 text-sm font-semibold text-[#111418] dark:text-white cursor-pointer select-none group hover:bg-gray-100 dark:hover:bg-[#2e3b4b] transition-colors whitespace-nowrap"
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
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="companies" onNavigate={onNavigate} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-4">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white tracking-light text-[32px] font-bold leading-tight">Companies</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">Manage the list of registered companies.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border border-[#dbe0e6] dark:border-[#3e4c5a] rounded-lg leading-5 bg-white dark:bg-[#25323e] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all" 
                placeholder="Search companies..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={onAdd}
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 shadow-sm transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add Company
            </button>
          </div>
        </div>

        <div className="mx-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#dbe0e6] dark:border-[#2e3b4b] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#25323e] border-b border-[#dbe0e6] dark:border-[#2e3b4b]">
                  <HeaderCell label="Company Name" columnKey="fullName" />
                  <HeaderCell label="Short Name" columnKey="shortName" />
                  <HeaderCell label="CIN No" columnKey="cinNo" />
                  <HeaderCell label="Level" columnKey="level" />
                  <HeaderCell label="Status" columnKey="status" />
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white text-right whitespace-nowrap w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbe0e6] dark:divide-[#2e3b4b]">
                {processedCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-[#25323e]/50 transition-colors group">
                    <td className="p-4 text-sm font-medium text-[#111418] dark:text-white">{company.fullName}</td>
                    <td className="p-4 text-sm text-[#617589] dark:text-gray-300">{company.shortName}</td>
                    <td className="p-4 text-sm text-[#617589] dark:text-gray-300 font-mono">{company.cinNo}</td>
                    <td className="p-4 text-sm text-[#617589] dark:text-gray-300">{company.level}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        company.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${company.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {company.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onView(company)} className="p-1.5 rounded-md text-gray-500 hover:text-primary transition-all"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                        <button onClick={() => onEdit(company)} className="p-1.5 rounded-md text-gray-500 hover:text-primary transition-all"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                        <button onClick={() => onDelete(company.id)} className="p-1.5 rounded-md text-gray-500 hover:text-red-600 transition-all"><span className="material-symbols-outlined text-[20px]">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
