
import React, { useState, useMemo } from 'react';
import { ViewType, CompanyDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface BillingMappingPageProps {
  companies: CompanyDetails[];
  onNavigate: (view: ViewType) => void;
}

interface BillingType {
  id: string;
  label: string;
  description: string;
}

const BILLING_TYPES: BillingType[] = [
  { id: 'prepaid', label: 'Pre-paid', description: 'Standard upfront billing' },
  { id: 'postpaid', label: 'Post-paid (Net 30)', description: 'Monthly invoicing' },
  { id: 'retainer', label: 'Retainer', description: 'Monthly fixed fee' },
  { id: 'onetime', label: 'One-time Charge', description: 'Ad-hoc services' },
  { id: 'consulting', label: 'Consulting Hourly', description: 'Time & materials' },
  { id: 'saas', label: 'SaaS Subscription', description: 'Recurring yearly' },
];

export const BillingMappingPage: React.FC<BillingMappingPageProps> = ({ companies, onNavigate }) => {
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set(['prepaid', 'retainer']));
  const [isActive, setIsActive] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const filteredTypes = useMemo(() => {
    return BILLING_TYPES.filter(type => 
      type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleType = (id: string) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    console.log('Saving billing mapping...', {
      selectedEntity,
      selectedTypes: Array.from(selectedTypes),
      isActive,
      isDeleted
    });
    // In a real app, perform API call here
    alert('Billing mapping saved successfully!');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark py-8 px-4 sm:px-8">
      <div className="w-full max-w-[960px] mx-auto flex flex-col gap-6">
        <Breadcrumbs currentView="billing-mapping" onNavigate={onNavigate} />

        <div className="flex flex-col gap-2">
          <h2 className="text-[#111418] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
            Business Entity Billing Type mapping
          </h2>
          <p className="text-[#617589] dark:text-gray-400 text-base font-normal leading-normal">
            Associate billing types with specific business entities to control invoicing logic.
          </p>
        </div>

        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#334155] overflow-hidden">
          {/* Section: Entity Selection */}
          <div className="p-6 sm:p-8 border-b border-[#e5e7eb] dark:border-[#334155]">
            <div className="flex flex-col gap-4 max-w-lg">
              <label className="flex flex-col gap-2">
                <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold uppercase tracking-wide">Select Business Entity</span>
                <div className="relative">
                  <select 
                    className="w-full rounded-lg border border-[#dbe0e6] dark:border-[#475569] bg-white dark:bg-[#0f172a] text-[#111418] dark:text-white h-12 pl-4 pr-10 focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer outline-none"
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                  >
                    <option disabled value="">Choose an entity...</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>{company.fullName}</option>
                    ))}
                    <option value="global_tech">Global Tech Solutions</option>
                    <option value="star_logistics">Star Logistics LLC</option>
                    <option value="apex_partners">Apex Partners</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#617589]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <p className="text-xs text-[#617589] dark:text-gray-500">Select the legal entity for which you want to configure billing rules.</p>
              </label>
            </div>
          </div>

          {/* Section: Billing Types */}
          <div className="p-6 sm:p-8 border-b border-[#e5e7eb] dark:border-[#334155]">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-[#111418] dark:text-gray-200 text-sm font-semibold uppercase tracking-wide">Assigned Billing Types</h3>
                <div className="relative max-w-xs w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#617589]">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                  </span>
                  <input 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#dbe0e6] dark:border-[#475569] bg-background-light dark:bg-[#0f172a] text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary dark:text-white transition-all" 
                    placeholder="Filter types..." 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-background-light dark:bg-[#0f172a] rounded-lg border border-[#dbe0e6] dark:border-[#475569] max-h-[300px] overflow-y-auto custom-scrollbar">
                {filteredTypes.map(type => (
                  <label 
                    key={type.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-[#1e293b] rounded border border-transparent hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <input 
                      type="checkbox"
                      checked={selectedTypes.has(type.id)}
                      onChange={() => toggleType(type.id)}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#111418] dark:text-white group-hover:text-primary transition-colors">{type.label}</span>
                      <span className="text-xs text-[#617589] dark:text-gray-400">{type.description}</span>
                    </div>
                  </label>
                ))}
                {filteredTypes.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500 italic text-sm">
                    No billing types matching your filter.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section: Configuration & Audit */}
          <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8">
            {/* Configuration Switches */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-[#111418] dark:text-gray-200 text-sm font-semibold uppercase tracking-wide">Status Settings</h3>
              <div className="flex flex-col gap-3">
                <label className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb] dark:border-[#475569] bg-white dark:bg-[#1e293b] hover:bg-gray-50 dark:hover:bg-[#334155] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                      <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl">check_circle</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#111418] dark:text-white">Is Active</span>
                      <span className="text-xs text-[#617589] dark:text-gray-400">Enable this mapping</span>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between p-3 rounded-lg border border-[#e5e7eb] dark:border-[#475569] bg-white dark:bg-[#1e293b] hover:bg-gray-50 dark:hover:bg-[#334155] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                      <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">delete</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#111418] dark:text-white">Is Deleted</span>
                      <span className="text-xs text-[#617589] dark:text-gray-400">Soft delete record</span>
                    </div>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={isDeleted}
                      onChange={() => setIsDeleted(!isDeleted)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-400/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                  </div>
                </label>
              </div>
            </div>
            {/* Audit Info */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-[#111418] dark:text-gray-200 text-sm font-semibold uppercase tracking-wide">Audit Information</h3>
              <div className="rounded-lg bg-background-light dark:bg-[#0f172a] border border-[#e5e7eb] dark:border-[#475569] p-4 text-sm">
                <div className="grid grid-cols-[100px_1fr] gap-y-3">
                  <span className="text-[#617589] dark:text-gray-500 font-medium">Created By:</span>
                  <span className="text-[#111418] dark:text-white font-medium">Jane Doe</span>
                  <span className="text-[#617589] dark:text-gray-500 font-medium">Created On:</span>
                  <span className="text-[#111418] dark:text-white">Oct 24, 2023 09:30 AM</span>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 col-span-2 my-1"></div>
                  <span className="text-[#617589] dark:text-gray-500 font-medium">Updated By:</span>
                  <span className="text-[#111418] dark:text-white font-medium">System Admin</span>
                  <span className="text-[#617589] dark:text-gray-500 font-medium">Updated On:</span>
                  <span className="text-[#111418] dark:text-white">Oct 25, 2023 02:15 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-6 sm:px-8 py-4 bg-gray-50 dark:bg-[#0f172a]/50 border-t border-[#e5e7eb] dark:border-[#334155] flex justify-end gap-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-lg border border-[#dbe0e6] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#111418] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#334155] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Save Changes
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#617589] dark:text-gray-500 pb-4">
          © 2023 Entity Admin System. All rights reserved.
        </div>
      </div>
    </div>
  );
};
