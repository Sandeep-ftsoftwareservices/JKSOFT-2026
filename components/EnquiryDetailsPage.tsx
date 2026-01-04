
import React from 'react';
import { EnquiryDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface EnquiryDetailsPageProps {
  enquiry: EnquiryDetails;
  onEdit: (enquiry: EnquiryDetails) => void;
  onNavigate: (view: ViewType) => void;
  employees: { id: string; name: string }[];
}

export const EnquiryDetailsPage: React.FC<EnquiryDetailsPageProps> = ({ 
  enquiry, onEdit, onNavigate, employees 
}) => {
  const assignedEmployee = employees.find(e => e.id === enquiry.assignedTo);

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-[1000px] mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="view-enquiry" onNavigate={onNavigate} />
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">{enquiry.customerName}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                enquiry.status === 'New' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : enquiry.status === 'In Progress'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {enquiry.status}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400">Request Ref: <span className="font-bold text-primary">{enquiry.enquiryNo}</span> • Received on {enquiry.date}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => onNavigate('enquiries')}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 border border-slate-300 dark:border-slate-700 text-sm font-bold hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to List
            </button>
            <button 
              onClick={() => onEdit(enquiry)}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Edit Enquiry
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-bold mb-6 border-b border-slate-100 dark:border-slate-800 pb-2">Enquiry Content</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Subject</label>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{enquiry.subject}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Requirement / Message</label>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg italic">
                    "{enquiry.message || 'No additional message provided.'}"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">call</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Mobile No</label>
                  <p className="font-semibold text-slate-900 dark:text-white">{enquiry.mobileNo}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Email Address</label>
                  <p className="font-semibold text-slate-900 dark:text-white">{enquiry.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Staff & Status</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">assignment_ind</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Assigned To</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{assignedEmployee?.name || 'Unassigned'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">event</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Received On</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{enquiry.date}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Audit info</h3>
              <div className="space-y-4">
                {[
                  { label: 'Created By', value: enquiry.audit.createdBy },
                  { label: 'Created Date', value: enquiry.audit.createdDate },
                  { label: 'Updated By', value: enquiry.audit.updatedBy },
                  { label: 'Updated Date', value: enquiry.audit.updatedDate }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.value}</span>
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
