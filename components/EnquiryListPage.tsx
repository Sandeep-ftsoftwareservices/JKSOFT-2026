
import React, { useState, useMemo } from 'react';
import { EnquiryDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface EnquiryListPageProps {
  enquiries: EnquiryDetails[];
  onEdit: (enquiry: EnquiryDetails) => void;
  onView: (enquiry: EnquiryDetails) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onNavigate: (view: ViewType) => void;
}

export const EnquiryListPage: React.FC<EnquiryListPageProps> = ({ 
  enquiries, onEdit, onView, onAdd, onDelete, onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => {
      const matchesSearch = e.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.enquiryNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enquiries, searchTerm, statusFilter]);

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <div className="max-w-[1200px] mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="enquiries" onNavigate={onNavigate} />
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white font-display">Enquiry List</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage all customer enquiries and requests</p>
          </div>
          <button 
            onClick={onAdd}
            className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="truncate">Add New Enquiry</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                className="block w-full p-2.5 pl-10 text-sm text-slate-900 border border-slate-300 rounded-lg bg-slate-50 focus:ring-primary focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white" 
                placeholder="Search by Name, ID, or Email..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select 
                className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full md:w-40 p-2.5 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[120px]">Enquiry #</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Customer Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[150px]">Mobile No</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[200px]">Email Address</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[150px]">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[140px]">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[140px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-primary">{enquiry.enquiryNo}</td>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{enquiry.customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{enquiry.mobileNo}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{enquiry.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{enquiry.date}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        enquiry.status === 'New' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : enquiry.status === 'In Progress'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onView(enquiry)}
                          className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button 
                          onClick={() => onEdit(enquiry)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => onDelete(enquiry.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEnquiries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 italic">No enquiries found.</td>
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
