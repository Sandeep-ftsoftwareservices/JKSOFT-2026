
import React, { useState } from 'react';
import { EnquiryDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface EnquiryEditPageProps {
  data: EnquiryDetails;
  onSave: (data: EnquiryDetails) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
  employees: { id: string; name: string }[];
}

export const EnquiryEditPage: React.FC<EnquiryEditPageProps> = ({ 
  data, onSave, onCancel, onNavigate, employees 
}) => {
  const [formData, setFormData] = useState<EnquiryDetails>(data);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryDetails, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof EnquiryDetails]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EnquiryDetails, string>> = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.mobileNo.trim()) newErrors.mobileNo = 'Mobile number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-[1000px] mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="edit-enquiry" onNavigate={onNavigate} />
        
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            {data.id ? 'Edit Enquiry' : 'Add New Enquiry'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Capture details for the customer request.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col mb-12">
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
              <h3 className="font-bold text-lg text-primary">Customer Information</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold dark:text-slate-200">Customer Name *</label>
              <input 
                name="customerName" 
                value={formData.customerName} 
                onChange={handleInputChange} 
                className={`rounded-lg border h-10 px-3 bg-slate-50 dark:bg-slate-800 ${errors.customerName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                placeholder="e.g. John Doe"
              />
              {errors.customerName && <p className="text-red-500 text-xs">{errors.customerName}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold dark:text-slate-200">Enquiry No</label>
              <input 
                name="enquiryNo" 
                value={formData.enquiryNo} 
                className="rounded-lg border h-10 px-3 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-not-allowed opacity-75"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold dark:text-slate-200">Mobile No *</label>
              <input 
                name="mobileNo" 
                value={formData.mobileNo} 
                onChange={handleInputChange} 
                className={`rounded-lg border h-10 px-3 bg-slate-50 dark:bg-slate-800 ${errors.mobileNo ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                placeholder="+1 555-0101"
              />
              {errors.mobileNo && <p className="text-red-500 text-xs">{errors.mobileNo}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold dark:text-slate-200">Email Address *</label>
              <input 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                className={`rounded-lg border h-10 px-3 bg-slate-50 dark:bg-slate-800 ${errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                placeholder="john.doe@email.com"
                type="email"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>

            <div className="col-span-full border-b border-slate-100 dark:border-slate-800 pb-2 mt-4 mb-2">
              <h3 className="font-bold text-lg text-primary">Enquiry Details</h3>
            </div>

            <div className="col-span-full flex flex-col gap-2">
              <label className="text-sm font-semibold dark:text-slate-200">Subject *</label>
              <input 
                name="subject" 
                value={formData.subject} 
                onChange={handleInputChange} 
                className={`rounded-lg border h-10 px-3 bg-slate-50 dark:bg-slate-800 ${errors.subject ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                placeholder="Brief summary of enquiry"
              />
              {errors.subject && <p className="text-red-500 text-xs">{errors.subject}</p>}
            </div>

            <div className="col-span-full flex flex-col gap-2">
              <label className="text-sm font-semibold dark:text-slate-200">Message / Requirement</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleInputChange} 
                rows={4}
                className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                placeholder="Detailed description..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold dark:text-slate-200">Status</label>
              <select 
                name="status" 
                value={formData.status} 
                onChange={handleInputChange} 
                className="rounded-lg border h-10 px-3 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold dark:text-slate-200">Assigned To</label>
              <select 
                name="assignedTo" 
                value={formData.assignedTo} 
                onChange={handleInputChange} 
                className="rounded-lg border h-10 px-3 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
              >
                <option value="">Unassigned</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/30 px-6 md:px-8 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-5 h-10 rounded-lg text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 h-10 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 shadow-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              Save Enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
