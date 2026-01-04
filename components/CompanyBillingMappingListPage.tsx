
import React, { useState, useMemo } from 'react';
import { CompanyBillingMapping, ViewType, CompanyDetails, BillingType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface MappingListPageProps {
  mappings: CompanyBillingMapping[];
  companies: CompanyDetails[];
  billingTypes: BillingType[];
  onEdit: (mapping: CompanyBillingMapping) => void;
  onView: (mapping: CompanyBillingMapping) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onNavigate: (view: ViewType) => void;
}

export const CompanyBillingMappingListPage: React.FC<MappingListPageProps> = ({ 
  mappings, companies, billingTypes, onEdit, onView, onAdd, onDelete, onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const processedMappings = useMemo(() => {
    return mappings.filter(m => {
      const company = companies.find(c => c.id === m.companyId);
      const companyName = company ? company.fullName.toLowerCase() : '';
      return companyName.includes(searchTerm.toLowerCase());
    });
  }, [mappings, companies, searchTerm]);

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="billing-mapping" onNavigate={onNavigate} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white tracking-light text-[32px] font-bold leading-tight">Company Billing Type Mapping</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-normal">Manage which billing types are enabled for specific entities.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border border-[#dbe0e6] dark:border-[#3e4c5a] rounded-lg bg-white dark:bg-[#25323e] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                placeholder="Search by company name..." 
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
              Add Mapping
            </button>
          </div>
        </div>

        <div className="mx-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#dbe0e6] dark:border-[#2e3b4b] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#25323e] border-b border-[#dbe0e6] dark:border-[#2e3b4b]">
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white">Business Entity</th>
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white">Assigned Types</th>
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white">Status</th>
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white text-right w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbe0e6] dark:divide-[#2e3b4b]">
                {processedMappings.map((mapping) => {
                  const company = companies.find(c => c.id === mapping.companyId);
                  const assignedCount = mapping.billingTypeIds.length;
                  return (
                    <tr key={mapping.id} className="hover:bg-gray-50 dark:hover:bg-[#25323e]/50 transition-colors">
                      <td className="p-4 text-sm font-medium text-[#111418] dark:text-white">{company?.fullName || 'Unknown Company'}</td>
                      <td className="p-4 text-sm text-[#617589] dark:text-gray-300">
                        {assignedCount} types assigned
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          mapping.isActive && !mapping.isDeleted 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${mapping.isActive && !mapping.isDeleted ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {mapping.isDeleted ? 'Deleted' : mapping.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => onView(mapping)} className="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button onClick={() => onEdit(mapping)} className="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => onDelete(mapping.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {processedMappings.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-500 italic">No mappings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
