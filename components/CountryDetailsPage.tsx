
import React from 'react';
import { CountryDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CountryDetailsPageProps {
  country: CountryDetails;
  onNavigate: (view: ViewType) => void;
  onEdit: (country: CountryDetails) => void;
}

export const CountryDetailsPage: React.FC<CountryDetailsPageProps> = ({ country, onNavigate, onEdit }) => {
  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="view-country" onNavigate={onNavigate} />
        
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 pb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#111418] dark:text-white text-3xl font-black tracking-tight">{country.fullName}</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm">Comprehensive view of country settings and compliance data.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => onNavigate('countries')}
              className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium border border-[#dbe0e6] dark:border-[#3e4c5a] text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-[#25323e] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Back to List
            </button>
            <button 
              onClick={() => onEdit(country)}
              className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Country
            </button>
          </div>
        </div>

        <div className="mx-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-[#2e3b4b] flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">public</span>
                <h3 className="font-bold text-[#111418] dark:text-white">General Information</h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#617589] uppercase tracking-wider">Full Country Name</span>
                  <span className="text-sm font-medium text-[#111418] dark:text-gray-200">{country.fullName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#617589] uppercase tracking-wider">Short Name</span>
                  <span className="text-sm font-medium text-[#111418] dark:text-gray-200">{country.shortName}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#617589] uppercase tracking-wider">ISO numeric Code</span>
                  <span className="text-sm font-mono font-medium text-[#111418] dark:text-gray-200 tracking-widest">{country.code}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#617589] uppercase tracking-wider">System Reference ID</span>
                  <span className="text-sm font-mono text-[#617589] dark:text-gray-400">{country.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${country.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="material-symbols-outlined">{country.isActive ? 'active_surprised' : 'block'}</span>
                </div>
                <div>
                  <h4 className="font-bold dark:text-white">Active Status</h4>
                  <p className="text-xs text-[#617589]">This record is currently {country.isActive ? 'live' : 'disabled'} in the system.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
               <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-[#2e3b4b] flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  <h3 className="font-bold text-[#111418] dark:text-white">Audit Tracking</h3>
                </div>
                <div className="p-6 space-y-5">
                   {[
                    { label: 'Created By', value: country.audit.createdBy, icon: 'person_add' },
                    { label: 'Created Date', value: country.audit.createdDate, icon: 'calendar_today' },
                    { label: 'Updated By', value: country.audit.updatedBy, icon: 'edit_note' },
                    { label: 'Updated Date', value: country.audit.updatedDate, icon: 'update' }
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
