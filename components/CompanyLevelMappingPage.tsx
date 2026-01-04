
import React, { useState, useMemo } from 'react';
import { CompanyLevel, ViewType, CompanyDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CompanyLevelMappingPageProps {
  companies: CompanyDetails[];
  levels: CompanyLevel[];
  onNavigate: (view: ViewType) => void;
}

export const CompanyLevelMappingPage: React.FC<CompanyLevelMappingPageProps> = ({ 
  companies, levels, onNavigate 
}) => {
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set());
  const [isActive, setIsActive] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const filteredLevels = useMemo(() => {
    return levels.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, levels]);

  const toggleLevel = (id: string) => {
    setSelectedLevels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    alert('Company Level mapping saved successfully!');
    onNavigate('dashboard');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 md:p-8">
      <div className="max-w-[960px] mx-auto flex flex-col gap-6">
        <Breadcrumbs currentView="company-level-mapping" onNavigate={onNavigate} />

        <div className="flex flex-col gap-2">
          <h1 className="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">Business Entity Company Level Mapping</h1>
          <p className="text-[#617589] dark:text-gray-400 text-base">Associate company levels with specific business entities to define organizational hierarchy.</p>
        </div>

        <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {/* Entity Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[#111418] dark:text-gray-200 text-sm font-semibold" htmlFor="entity-select">
                  Business Entity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select 
                    id="entity-select"
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                    className="form-select w-full rounded-lg border-[#d1d5db] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white h-12 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow cursor-pointer appearance-none outline-none"
                  >
                    <option disabled value="">Select a Business Entity...</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#617589]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                <p className="text-xs text-[#617589] dark:text-gray-400 mt-1">Select the primary entity you wish to configure.</p>
              </div>

              {/* Levels Multi-select */}
              <div className="flex flex-col gap-2">
                <label className="text-[#111418] dark:text-gray-200 text-sm font-semibold">
                  Company Levels <span className="text-red-500">*</span>
                </label>
                <div className="border border-[#d1d5db] dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-shadow">
                  <div className="flex items-center border-b border-[#f0f2f4] dark:border-gray-700 px-3 py-2">
                    <span className="material-symbols-outlined text-[#617589] text-xl">search</span>
                    <input 
                      type="text" 
                      placeholder="Search company levels..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full border-none focus:ring-0 text-sm bg-transparent text-[#111418] dark:text-white placeholder:text-[#617589]" 
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-1">
                    {filteredLevels.map((level) => (
                      <label 
                        key={level.id}
                        className={`flex items-center gap-3 p-2 rounded-md hover:bg-[#f0f2f4] dark:hover:bg-gray-700 cursor-pointer transition-colors ${selectedLevels.has(level.id) ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedLevels.has(level.id)}
                          onChange={() => toggleLevel(level.id)}
                          className="form-checkbox size-4 rounded border-gray-300 text-primary focus:ring-primary" 
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#111418] dark:text-gray-200">{level.name}</span>
                          <span className="text-xs text-[#617589]">{level.description}</span>
                        </div>
                      </label>
                    ))}
                    {filteredLevels.length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-500 italic">No levels matching your search.</div>
                    )}
                  </div>
                  <div className="px-3 py-2 bg-[#f9fafb] dark:bg-gray-900 border-t border-[#f0f2f4] dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xs font-medium text-[#617589]">{selectedLevels.size} levels selected</span>
                    <button 
                      onClick={() => setSelectedLevels(new Set())}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[#f0f2f4] dark:border-gray-700" />

            {/* Status & Audit */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-4 lg:col-span-1">
                <h3 className="text-sm font-semibold text-[#111418] dark:text-gray-200">Status & Visibility</h3>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-[#111418] dark:text-white">Is Active</span>
                    <span className="text-xs text-[#617589]">Enable this mapping for use</span>
                  </span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isActive} onChange={() => setIsActive(!isActive)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="flex-grow flex flex-col">
                    <span className="text-sm font-medium text-[#111418] dark:text-white">Is Deleted</span>
                    <span className="text-xs text-[#617589]">Soft delete this record</span>
                  </span>
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={isDeleted} onChange={() => setIsDeleted(!isDeleted)} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-400/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                  </div>
                </label>
              </div>

              <div className="lg:col-span-2 bg-[#f8fafc] dark:bg-gray-900 rounded-lg p-4 border border-[#f0f2f4] dark:border-gray-800">
                <h3 className="text-sm font-semibold text-[#111418] dark:text-gray-200 mb-3">Audit Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#617589]">Created By</span>
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[14px]">person</span>
                      </div>
                      <span className="text-sm font-medium text-[#111418] dark:text-gray-300">System Admin</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#617589]">Created Date</span>
                    <span className="text-sm font-medium text-[#111418] dark:text-gray-300 font-mono">2023-10-15 09:30 AM</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#617589]">Updated By</span>
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                      </div>
                      <span className="text-sm font-medium text-[#111418] dark:text-gray-300">Jane Doe</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#617589]">Updated Date</span>
                    <span className="text-sm font-medium text-[#111418] dark:text-gray-300 font-mono">2023-10-22 02:15 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f8fafc] dark:bg-gray-800/50 px-6 py-4 border-t border-[#f0f2f4] dark:border-gray-700 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-2.5 rounded-lg border border-[#d1d5db] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111418] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 shadow-sm transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Mapping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
