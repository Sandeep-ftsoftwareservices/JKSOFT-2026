
import React from 'react';
import { PackageDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface PackageDetailsPageProps {
  packageData: PackageDetails;
  onNavigate: (view: ViewType) => void;
  onEdit: (pkg: PackageDetails) => void;
}

export const PackageDetailsPage: React.FC<PackageDetailsPageProps> = ({ 
  packageData, onNavigate, onEdit 
}) => {
  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark py-8 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <Breadcrumbs currentView="view-package" onNavigate={onNavigate} />
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mt-2">{packageData.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Package configuration overview</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={() => onNavigate('packages')}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-white border border-slate-300 hover:bg-slate-50 transition-colors text-slate-700 text-sm font-bold shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              Back to List
            </button>
            <button 
              onClick={() => onEdit(packageData)}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-sm shadow-blue-200"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              <span>Edit Package</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Package Code</p>
                  <p className="font-mono text-primary font-bold">{packageData.shortName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Package Grade</p>
                  <p className="font-semibold dark:text-white">{packageData.grade}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Service Category</p>
                  <p className="font-semibold dark:text-white">{packageData.serviceCategory}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">MSO Or Broadcaster</p>
                  <p className="font-semibold dark:text-white">{packageData.msoBroadcaster}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Description</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">"{packageData.description}"</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                Pricing Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Base Rate</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">${packageData.baseRate.toFixed(2)}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{packageData.isTaxInclusive ? 'Tax Included' : 'Tax Exclusive'}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tax (%)</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{packageData.taxPercentage}%</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Total Payable</p>
                  <p className="text-xl font-black text-primary">${packageData.totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Mapped Channels ({packageData.channels.length})</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {packageData.channels.map(channel => (
                    <div key={channel.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 flex flex-col">
                      <span className="text-sm font-bold dark:text-white">{channel.name}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{channel.category} • {channel.language}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 text-center">
               <div className={`size-16 mx-auto rounded-full flex items-center justify-center mb-4 ${packageData.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                 <span className="material-symbols-outlined text-3xl">{packageData.isActive ? 'verified' : 'block'}</span>
               </div>
               <h4 className="font-bold text-lg dark:text-white">{packageData.isActive ? 'Active Package' : 'Inactive Package'}</h4>
               <p className="text-xs text-slate-500 mt-1">Status managed by system administrators</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Market Metrics</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Retail Price (MRP)</span>
                    <span className="font-bold text-slate-900 dark:text-white">${packageData.mrp.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Distributor Price (DRP)</span>
                    <span className="font-bold text-slate-900 dark:text-white">${packageData.drp.toFixed(2)}</span>
                  </div>
               </div>
            </div>

             <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Audit Log</h3>
              <div className="space-y-5">
                {[
                  { label: 'Created By', value: packageData.audit.createdBy, date: packageData.audit.createdDate },
                  { label: 'Updated By', value: packageData.audit.updatedBy, date: packageData.audit.updatedDate }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">{item.label}</p>
                    <p className="text-sm font-semibold dark:text-gray-200">{item.value}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{item.date}</p>
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
