
import React, { useState, useMemo } from 'react';
import { CustomerDetails, ViewType, CompanyDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CustomerListPageProps {
  customers: CustomerDetails[];
  companies: CompanyDetails[];
  onEdit: (customer: CustomerDetails) => void;
  onView: (customer: CustomerDetails) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onNavigate: (view: ViewType) => void;
}

export const CustomerListPage: React.FC<CustomerListPageProps> = ({ 
  customers, companies, onEdit, onView, onAdd, onDelete, onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const processedCustomers = useMemo(() => {
    return customers.filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || 
             c.accountNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
             c.mobile?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [customers, searchTerm]);

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="customers" onNavigate={onNavigate} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl font-black leading-tight">Customer Management</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-normal">Browse and manage customer profiles, installations, and account status.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border border-[#dbe0e6] dark:border-[#3e4c5a] rounded-lg bg-white dark:bg-[#25323e] text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                placeholder="Search account or name..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={onAdd}
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 shadow-sm transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Create Profile
            </button>
          </div>
        </div>

        <div className="mx-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#dbe0e6] dark:border-[#2e3b4b] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#25323e] border-b border-[#dbe0e6] dark:border-[#2e3b4b]">
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white">Account Info</th>
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white">Customer Name</th>
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white">Type/Connection</th>
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white">Status</th>
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white text-right w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbe0e6] dark:divide-[#2e3b4b]">
                {processedCustomers.map((c) => {
                  const company = companies.find(comp => comp.id === c.companyId);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-[#25323e]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-primary">{c.accountNo}</span>
                          <span className="text-xs text-gray-500">Installed: {c.installationDate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#111418] dark:text-white">{c.salutation} {c.firstName} {c.lastName}</span>
                          <span className="text-xs text-gray-500">{company?.fullName || 'Individual'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-[#111418] dark:text-gray-300">{c.subscriberType}</span>
                          <span className="text-xs text-[#617589]">{c.connectionType}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          c.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200' 
                          : c.status === 'Suspended'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 border-gray-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => onView(c)} className="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all">
                            <span className="material-symbols-outlined text-[20px]">visibility</span>
                          </button>
                          <button onClick={() => onEdit(c)} className="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                          </button>
                          <button onClick={() => onDelete(c.id)} className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {processedCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500 italic">No customers found.</td>
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
