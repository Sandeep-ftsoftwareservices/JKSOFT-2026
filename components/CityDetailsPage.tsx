
import React from 'react';
import { CityDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CityDetailsPageProps {
  city: CityDetails;
  onNavigate: (view: ViewType) => void;
  onEdit: (city: CityDetails) => void;
}

export const CityDetailsPage: React.FC<CityDetailsPageProps> = ({ city, onNavigate, onEdit }) => {
  const infoGroups = [
    {
      title: 'General Information',
      icon: 'info',
      items: [
        { label: 'Full City Name', value: city.fullName },
        { label: 'Short Name', value: city.shortName },
        { label: 'City Code', value: city.cityCode, mono: true }
      ]
    },
    {
      title: 'Location Context',
      icon: 'map',
      items: [
        { label: 'Parent Country', value: city.country },
        { label: 'Parent State', value: city.state }
      ]
    }
  ];

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="view-city" onNavigate={onNavigate} />
        
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 pb-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#111418] dark:text-white text-3xl font-black tracking-tight">{city.fullName}</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm">Detailed configuration overview for this city record.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => onNavigate('cities')}
              className="flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium border border-[#dbe0e6] dark:border-[#3e4c5a] text-[#111418] dark:text-white hover:bg-gray-100 dark:hover:bg-[#25323e] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Back to List
            </button>
            <button 
              onClick={() => onEdit(city)}
              className="flex items-center gap-2 h-10 px-5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit City
            </button>
          </div>
        </div>

        <div className="mx-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 space-y-6">
            {infoGroups.map((group, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-[#2e3b4b] flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">{group.icon}</span>
                  <h3 className="font-bold text-[#111418] dark:text-white">{group.title}</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-[#617589] uppercase tracking-wider">{item.label}</span>
                      <span className={`text-sm font-medium text-[#111418] dark:text-gray-200 ${item.mono ? 'font-mono uppercase tracking-[0.2em]' : ''}`}>
                        {item.value || <em className="text-gray-400">Not assigned</em>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 p-6 flex flex-col items-center text-center gap-4">
              <span className="text-[10px] font-bold text-[#617589] uppercase tracking-wider w-full text-left">Current Status</span>
              <div className={`size-16 rounded-full flex items-center justify-center ${city.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <span className="material-symbols-outlined text-[32px]">{city.isActive ? 'check_circle' : 'cancel'}</span>
              </div>
              <div>
                <h4 className="font-bold text-lg dark:text-white">{city.isActive ? 'Active' : 'Inactive'}</h4>
                <p className="text-xs text-gray-500 max-w-[160px]">This city is currently {city.isActive ? 'active' : 'hidden'} in the system registry.</p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
               <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-[#2e3b4b] flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  <h3 className="font-bold text-[#111418] dark:text-white">Audit Tracking</h3>
                </div>
                <div className="p-6 space-y-4">
                   {[
                    { label: 'Created By', value: city.audit.createdBy },
                    { label: 'Created Date', value: city.audit.createdDate },
                    { label: 'Updated By', value: city.audit.updatedBy },
                    { label: 'Updated Date', value: city.audit.updatedDate }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-[#617589] uppercase tracking-wider">{item.label}</span>
                      <span className="text-xs font-medium text-[#111418] dark:text-gray-300">{item.value}</span>
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
