
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CompanyBusinessEntityMapping, ViewType, CompanyDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface MappingEditPageProps {
  data: CompanyBusinessEntityMapping;
  companies: CompanyDetails[];
  onSave: (data: CompanyBusinessEntityMapping) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
}

export const CompanyBusinessEntityMappingEditPage: React.FC<MappingEditPageProps> = ({ 
  data, companies, onSave, onCancel, onNavigate 
}) => {
  const [formData, setFormData] = useState<CompanyBusinessEntityMapping>(data);
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, companyId: e.target.value }));
  };

  const addEntity = (id: string) => {
    if (!formData.businessEntityIds.includes(id)) {
      setFormData(prev => ({ ...prev, businessEntityIds: [...prev.businessEntityIds, id] }));
    }
    setSearch('');
    setIsDropdownOpen(false);
  };

  const removeEntity = (id: string) => {
    setFormData(prev => ({ ...prev, businessEntityIds: prev.businessEntityIds.filter(eid => eid !== id) }));
  };

  const availableOptions = useMemo(() => {
    return companies.filter(c => 
      !formData.businessEntityIds.includes(c.id) && 
      c.id !== formData.companyId && // Don't allow mapping to self
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, formData.businessEntityIds, formData.companyId, search]);

  const selectedEntities = useMemo(() => {
    return companies.filter(c => formData.businessEntityIds.includes(c.id));
  }, [companies, formData.businessEntityIds]);

  const handleSave = () => {
    if (!formData.companyId) return alert('Please select a company.');
    onSave(formData);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1024px] mx-auto flex flex-col gap-6">
        <Breadcrumbs currentView="edit-entity-mapping" onNavigate={onNavigate} />

        <div className="flex flex-col gap-2">
          <h1 className="text-[#111418] dark:text-white text-3xl font-black tracking-tight leading-tight">Company Business Entity Mapping</h1>
          <p className="text-[#617589] dark:text-[#9ca3af] text-base leading-normal font-normal">Manage and configure the relationships between parent companies and their business entities.</p>
        </div>

        <div className="bg-white dark:bg-[#1a2027] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Mapping Configuration</h2>
            <span className="material-symbols-outlined text-slate-400">tune</span>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6">
              {/* Parent Company Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-slate-900 dark:text-white text-sm font-semibold">Company <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    value={formData.companyId}
                    onChange={handleCompanyChange}
                    className="w-full appearance-none rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white h-12 px-4 pr-10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow cursor-pointer"
                  >
                    <option disabled value="">Select a company...</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Select the parent company to map entities against.</p>
              </div>

              {/* Multi-select Entities */}
              <div className="flex flex-col gap-2" ref={dropdownRef}>
                <label className="text-slate-900 dark:text-white text-sm font-semibold">Business Entities <span className="text-red-500">*</span></label>
                <div 
                  onClick={() => setIsDropdownOpen(true)}
                  className="w-full min-h-[56px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 flex flex-wrap gap-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow cursor-text relative group"
                >
                  {selectedEntities.map(entity => (
                    <div key={entity.id} className="bg-primary/10 border border-primary/20 text-primary dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <span>{entity.fullName}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeEntity(entity.id); }}
                        className="hover:text-red-500 transition-colors flex items-center"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                  
                  <input 
                    className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-slate-900 dark:text-white placeholder:text-slate-400 min-w-[150px] text-sm h-8 self-center" 
                    placeholder={selectedEntities.length === 0 ? "Search and add entities..." : ""} 
                    type="text"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setIsDropdownOpen(true); }}
                  />

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-primary">
                    <span className="material-symbols-outlined">search</span>
                  </div>

                  {isDropdownOpen && availableOptions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1a2632] border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-[100] max-h-60 overflow-y-auto">
                      {availableOptions.map(opt => (
                        <div 
                          key={opt.id}
                          onClick={(e) => { e.stopPropagation(); addEntity(opt.id); }}
                          className="px-4 py-2.5 text-sm cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 text-slate-700 dark:text-slate-200 transition-colors"
                        >
                          {opt.fullName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">You can select multiple entities. Start typing to search.</p>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100 dark:bg-slate-700"></div>

            {/* Status Switches */}
            <div className="flex flex-wrap gap-8">
              <label className="inline-flex items-center cursor-pointer gap-3 group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isActive}
                    onChange={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary transition-colors">Is Active</span>
              </label>

              <label className="inline-flex items-center cursor-pointer gap-3 group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isDeleted}
                    onChange={() => setFormData(prev => ({ ...prev, isDeleted: !prev.isDeleted }))}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">Mark as Deleted</span>
              </label>
            </div>

            {/* Audit Log Panel */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Audit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Created By</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{formData.audit.createdBy}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Created Date</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{formData.audit.createdDate}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Updated By</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{formData.audit.updatedBy}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Updated Date</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{formData.audit.updatedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button 
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Mapping
            </button>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">© 2023 Company Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
