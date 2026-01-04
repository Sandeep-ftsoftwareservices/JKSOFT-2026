
import React, { useState, useMemo } from 'react';
import { PackageDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface PackageListPageProps {
  packages: PackageDetails[];
  onEdit: (pkg: PackageDetails) => void;
  onView: (pkg: PackageDetails) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onNavigate: (view: ViewType) => void;
}

export const PackageListPage: React.FC<PackageListPageProps> = ({ 
  packages, onEdit, onView, onAdd, onDelete, onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPackages = useMemo(() => {
    return packages.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [packages, searchTerm]);

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <div className="max-w-[1200px] mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="packages" onNavigate={onNavigate} />
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">Package List</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and configure service packages</p>
          </div>
          <button 
            onClick={onAdd}
            className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="truncate">Add New Package</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input 
              className="block w-full p-2.5 pl-10 text-sm text-slate-900 border border-slate-300 rounded-lg bg-slate-50 focus:ring-primary focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
              placeholder="Search by Package Name or Code..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Package Info</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Rate</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Channels</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{pkg.name}</span>
                        <span className="text-xs text-primary font-mono">{pkg.shortName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pkg.serviceCategory}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">${pkg.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400">{pkg.channels.length}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pkg.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {pkg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onView(pkg)} className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">visibility</span></button>
                        <button onClick={() => onEdit(pkg)} className="p-1.5 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                        <button onClick={() => onDelete(pkg.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"><span className="material-symbols-outlined text-[20px]">delete</span></button>
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
