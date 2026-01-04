
import React, { useState, useMemo } from 'react';
import { CompanyBillingMapping, ViewType, CompanyDetails, BillingType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface MappingEditPageProps {
  data: CompanyBillingMapping;
  companies: CompanyDetails[];
  billingTypes: BillingType[];
  onSave: (data: CompanyBillingMapping) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
}

export const CompanyBillingMappingEditPage: React.FC<MappingEditPageProps> = ({ 
  data, companies, billingTypes, onSave, onCancel, onNavigate 
}) => {
  const [formData, setFormData] = useState<CompanyBillingMapping>(data);
  const [billingSearch, setBillingSearch] = useState('');

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, companyId: e.target.value }));
  };

  const toggleBillingType = (typeId: string) => {
    setFormData(prev => {
      const exists = prev.billingTypeIds.includes(typeId);
      if (exists) {
        return { ...prev, billingTypeIds: prev.billingTypeIds.filter(id => id !== typeId) };
      } else {
        return { ...prev, billingTypeIds: [...prev.billingTypeIds, typeId] };
      }
    });
  };

  const selectAll = () => {
    setFormData(prev => ({ ...prev, billingTypeIds: billingTypes.map(t => t.id) }));
  };

  const availableTypes = useMemo(() => {
    return billingTypes.filter(t => 
      !formData.billingTypeIds.includes(t.id) &&
      t.name.toLowerCase().includes(billingSearch.toLowerCase())
    );
  }, [billingTypes, formData.billingTypeIds, billingSearch]);

  const selectedTypes = useMemo(() => {
    return billingTypes.filter(t => formData.billingTypeIds.includes(t.id));
  }, [billingTypes, formData.billingTypeIds]);

  const handleSave = () => {
    if (!formData.companyId) return alert('Please select a company.');
    onSave(formData);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1024px] mx-auto flex flex-col gap-6">
        <Breadcrumbs currentView="edit-billing-mapping" onNavigate={onNavigate} />

        <div className="flex flex-col gap-2 border-b border-[#e5e7eb] dark:border-[#2d3748] pb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Company Billing Type Mapping</h1>
          <p className="text-[#617589] dark:text-[#9ca3af]">Associate specific companies with valid billing methods and configure their status.</p>
        </div>

        <div className="bg-white dark:bg-[#1c2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {/* Company Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold leading-6 dark:text-white">Company Selection</label>
              <div className="relative">
                <select 
                  value={formData.companyId}
                  onChange={handleCompanyChange}
                  className="block w-full rounded-lg border-0 py-3 pl-4 pr-10 text-[#111418] dark:text-[#f9fafb] bg-background-light dark:bg-[#101922] shadow-sm ring-1 ring-inset ring-[#e5e7eb] dark:ring-[#2d3748] focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                >
                  <option disabled value="">Select a Company...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-[#617589]">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
              <p className="text-xs text-[#617589] mt-1">Choose the business entity you want to configure billing for.</p>
            </div>

            <hr className="border-[#e5e7eb] dark:border-[#2d3748]"/>

            {/* Billing Types Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold leading-6 dark:text-white">Assigned Billing Types</label>
                <button onClick={selectAll} className="text-xs font-medium text-primary hover:underline">Select All</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Items */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-[#617589] uppercase tracking-wider">Available Types</span>
                  <div className="border border-[#e5e7eb] dark:border-[#2d3748] rounded-lg bg-background-light dark:bg-[#101922] h-64 overflow-y-auto p-2 space-y-1">
                    <div className="px-2 pb-2">
                       <input 
                        type="text" 
                        placeholder="Search types..." 
                        value={billingSearch} 
                        onChange={e => setBillingSearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border-none rounded text-xs px-2 py-1.5 focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    {availableTypes.map(type => (
                      <div 
                        key={type.id}
                        onClick={() => toggleBillingType(type.id)}
                        className="group flex items-center gap-3 p-2 rounded hover:bg-white dark:hover:bg-slate-800 cursor-pointer border border-transparent hover:border-[#e5e7eb] dark:hover:border-[#2d3748] transition-all"
                      >
                        <div className="flex items-center justify-center size-5 border border-gray-400 rounded bg-white dark:bg-black/20">
                          <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-50">add</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium dark:text-white">{type.name}</span>
                          <span className="text-xs text-[#617589]">{type.description.substring(0, 40)}...</span>
                        </div>
                      </div>
                    ))}
                    {availableTypes.length === 0 && <p className="text-center py-8 text-xs text-gray-500 italic">No types available</p>}
                  </div>
                </div>

                {/* Selected Items */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-[#617589] uppercase tracking-wider">Selected & Active</span>
                  <div className="border border-primary/30 rounded-lg bg-primary/5 h-64 overflow-y-auto p-2 space-y-1">
                    {selectedTypes.map(type => (
                      <div key={type.id} className="flex items-center justify-between gap-3 p-2 rounded bg-white dark:bg-slate-800 border border-primary/20 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-primary">{type.name}</span>
                          <span className="text-xs text-[#617589]">{type.description.substring(0, 40)}...</span>
                        </div>
                        <button onClick={() => toggleBillingType(type.id)} className="text-[#617589] hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    ))}
                    {selectedTypes.length === 0 && <p className="text-center py-8 text-xs text-gray-500 italic">None selected</p>}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#e5e7eb] dark:border-[#2d3748]"/>

            {/* Status Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold leading-6 dark:text-white mb-4">Mapping Status</label>
                <div className="flex flex-col gap-4">
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={formData.isActive}
                      onChange={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    <span className="ml-3 text-sm font-medium dark:text-[#f9fafb]">Is Active</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={formData.isDeleted}
                      onChange={() => setFormData(prev => ({ ...prev, isDeleted: !prev.isDeleted }))}
                      className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600" 
                    />
                    <span className="text-sm font-medium dark:text-[#f9fafb] group-hover:text-red-600 transition-colors">Is Deleted (Soft Delete)</span>
                  </label>
                </div>
              </div>

              {/* Audit Info (static in edit) */}
              <div>
                <label className="block text-sm font-semibold leading-6 dark:text-white mb-4">Audit Log</label>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-background-light dark:bg-[#101922] p-3 rounded-lg border border-[#e5e7eb] dark:border-[#2d3748]">
                    <span className="block text-xs font-medium text-[#617589] uppercase mb-1">Created By</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#617589]">person</span>
                      <span className="font-medium dark:text-white">{formData.audit.createdBy}</span>
                    </div>
                  </div>
                  <div className="bg-background-light dark:bg-[#101922] p-3 rounded-lg border border-[#e5e7eb] dark:border-[#2d3748]">
                    <span className="block text-xs font-medium text-[#617589] uppercase mb-1">Created Date</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#617589]">calendar_today</span>
                      <span className="font-medium dark:text-white">{formData.audit.createdDate}</span>
                    </div>
                  </div>
                  <div className="bg-background-light dark:bg-[#101922] p-3 rounded-lg border border-[#e5e7eb] dark:border-[#2d3748]">
                    <span className="block text-xs font-medium text-[#617589] uppercase mb-1">Updated By</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#617589]">manage_accounts</span>
                      <span className="font-medium dark:text-white">{formData.audit.updatedBy}</span>
                    </div>
                  </div>
                  <div className="bg-background-light dark:bg-[#101922] p-3 rounded-lg border border-[#e5e7eb] dark:border-[#2d3748]">
                    <span className="block text-xs font-medium text-[#617589] uppercase mb-1">Updated Date</span>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#617589]">update</span>
                      <span className="font-medium dark:text-white">{formData.audit.updatedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#e5e7eb] dark:border-[#2d3748] bg-background-light dark:bg-[#101922] px-6 py-4">
            <button onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-[#617589] hover:text-[#111418] hover:bg-black/5 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 transition-colors">
              <span className="material-symbols-outlined text-sm">save</span>
              Save Mapping
            </button>
          </div>
        </div>

        <div className="flex justify-center py-4">
          <p className="text-xs text-[#617589]">© 2023 Company Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
