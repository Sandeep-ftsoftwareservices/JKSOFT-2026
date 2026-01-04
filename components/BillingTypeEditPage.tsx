
import React, { useState } from 'react';
import { BillingType, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface BillingTypeEditPageProps {
  data: BillingType;
  onSave: (data: BillingType) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
}

interface ValidationErrors {
  name?: string;
  description?: string;
}

export const BillingTypeEditPage: React.FC<BillingTypeEditPageProps> = ({ 
  data, onSave, onCancel, onNavigate 
}) => {
  const [formData, setFormData] = useState<BillingType>(data);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Billing type name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleToggleChange = () => setFormData(prev => ({ ...prev, isActive: !prev.isActive }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  const isNew = !data.id;

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="edit-billing-type" onNavigate={onNavigate} />
        
        <div className="flex flex-col gap-2 px-4 pb-2">
          <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl font-black leading-tight">
            {isNew ? 'Add Billing Type' : 'Edit Billing Type'}
          </h1>
          <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">
            {isNew ? 'Define a new billing logic for use across the system.' : 'Update the configuration for this billing type.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-4 space-y-8 mb-12">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="flex flex-col gap-2">
                    <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold">Billing Type Name *</span>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className={`form-input w-full rounded-lg h-12 px-4 bg-white dark:bg-gray-900 border ${errors.name ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} focus:ring-primary focus:border-primary text-[#111418] dark:text-white`}
                      placeholder="e.g. Pre-paid" 
                    />
                  </label>
                  {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                </div>

                <div>
                  <label className="flex flex-col gap-2">
                    <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold">Description *</span>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      rows={4}
                      className={`form-textarea w-full rounded-lg p-4 bg-white dark:bg-gray-900 border ${errors.description ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} focus:ring-primary focus:border-primary text-[#111418] dark:text-white`}
                      placeholder="Explain how this billing type works..."
                    />
                  </label>
                  {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description}</p>}
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <span className="text-[#111418] dark:text-slate-200 text-sm font-medium">Status</span>
                  <label className="inline-flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={handleToggleChange} />
                    <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Is Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {!isNew && (
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#dbe0e6] dark:border-[#2e3b4b] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-slate-800">
                <h3 className="text-[#111418] dark:text-white text-lg font-bold">Audit Information</h3>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { label: 'Created By', value: formData.audit.createdBy, icon: 'person_add' },
                    { label: 'Created Date', value: formData.audit.createdDate, icon: 'calendar_today' },
                    { label: 'Updated By', value: formData.audit.updatedBy, icon: 'edit_note' },
                    { label: 'Updated Date', value: formData.audit.updatedDate, icon: 'update' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <span className="text-[#617589] dark:text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                        {item.label}
                      </span>
                      <div className="flex items-center h-11 px-4 rounded-lg bg-gray-50 dark:bg-[#15202b] border border-[#dbe0e6] dark:border-[#3e4c5a] text-[#111418] dark:text-gray-200 text-sm font-medium truncate">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-[#dbe0e6] dark:border-gray-700 flex items-center justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
