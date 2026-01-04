
import React from 'react';
import { CompanyBusinessEntityMapping, ViewType, CompanyDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface MappingDetailsPageProps {
  mapping: CompanyBusinessEntityMapping;
  companies: CompanyDetails[];
  onNavigate: (view: ViewType) => void;
  onEdit: (mapping: CompanyBusinessEntityMapping) => void;
}

export const CompanyBusinessEntityMappingDetailsPage: React.FC<MappingDetailsPageProps> = ({ 
  mapping, companies, onNavigate, onEdit 
}) => {
  const company = companies.find(c => c.id === mapping.companyId);
  const entities = companies.filter(c => mapping.businessEntityIds.includes(c.id));

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="view-entity-mapping" onNavigate={onNavigate} />
        
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 pb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#111418] dark:text-white text-3xl font-black tracking-tight">{company?.fullName} Entity Mapping</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm">Review parent company and child entity relationships.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => onNavigate('entity-mapping')}
              className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium border border-[#dbe0e6] dark:border-[#3e4c5a] text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-[#25323e] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Back to List
            </button>
            <button 
              onClick={() => onEdit(mapping)}
              className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Mapping
            </button>
          </div>
        </div>

        <div className="mx-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-[#2e3b4b] flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="material-symbols-outlined text-primary">hub</span>
                <h3 className="font-bold text-[#111418] dark:text-white">Mapped Entities</h3>
              </div>
              <div className="p-6">
                 {entities.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {entities.map(e => (
                       <div key={e.id} className="p-4 rounded-lg border border-[#f0f2f4] dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 flex flex-col gap-1">
                         <h4 className="font-bold text-sm dark:text-white">{e.fullName}</h4>
                         <span className="text-xs text-[#617589] font-mono">{e.shortName}</span>
                         <div className="mt-2 text-[10px] uppercase font-bold text-primary">{e.level}</div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-gray-500 italic text-sm text-center py-8">No business entities mapped.</p>
                 )}
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-6 flex items-center gap-4">
              <div className={`size-12 rounded-full flex items-center justify-center ${mapping.isActive && !mapping.isDeleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <span className="material-symbols-outlined text-[24px]">{mapping.isActive && !mapping.isDeleted ? 'check_circle' : 'cancel'}</span>
              </div>
              <div>
                <h4 className="font-bold dark:text-white">Status: {mapping.isDeleted ? 'Marked as Deleted' : mapping.isActive ? 'Active' : 'Inactive'}</h4>
                <p className="text-xs text-gray-500">This mapping configuration is {mapping.isActive && !mapping.isDeleted ? 'currently operational' : 'currently restricted'}.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
               <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-[#2e3b4b] flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/30">
                  <span className="material-symbols-outlined text-primary">history</span>
                  <h3 className="font-bold text-[#111418] dark:text-white">Audit</h3>
                </div>
                <div className="p-6 space-y-5">
                   {[
                    { label: 'Created By', value: mapping.audit.createdBy, icon: 'person' },
                    { label: 'Created Date', value: mapping.audit.createdDate, icon: 'calendar_today' },
                    { label: 'Updated By', value: mapping.audit.updatedBy, icon: 'manage_accounts' },
                    { label: 'Updated Date', value: mapping.audit.updatedDate, icon: 'update' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="material-symbols-outlined text-[20px] text-[#617589] mt-0.5">{item.icon}</span>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-[#617589] uppercase tracking-wider">{item.label}</span>
                        <span className="text-xs font-medium text-[#111418] dark:text-gray-300">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
