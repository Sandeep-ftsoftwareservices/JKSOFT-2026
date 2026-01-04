
import React, { useState } from 'react';
import { CompanyLevel, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CompanyLevelEditPageProps {
  data: CompanyLevel;
  onSave: (data: CompanyLevel) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
}

export const CompanyLevelEditPage: React.FC<CompanyLevelEditPageProps> = ({ 
  data, onSave, onCancel, onNavigate 
}) => {
  const [formData, setFormData] = useState<CompanyLevel>(data);
  const [errors, setErrors] = useState<{name?: string; description?: string}>({});

  const validate = (): boolean => {
    const newErrors: {name?: string; description?: string} = {};
    if (!formData.name.trim()) newErrors.name = 'Level name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: undefined }));
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
        <Breadcrumbs currentView="edit-company-level" onNavigate={onNavigate} />
        
        <div className="flex flex-col gap-2 px-4 pb-2">
          <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl font-black leading-tight">
            {isNew ? 'Add Company Level' : 'Edit Company Level'}
          </h1>
          <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">
            {isNew ? 'Define a new organizational level.' : 'Update the configuration for this company level.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-4 space-y-8 mb-12">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="flex flex-col gap-2">
                    <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold">Level Name *</span>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleInputChange} 
                      className={`form-input w-full rounded-lg h-12 px-4 bg-white dark:bg-gray-900 border ${errors.name ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} focus:ring-primary focus:border-primary text-[#111418] dark:text-white`}
                      placeholder="e.g. Strategic Unit" 
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
                      placeholder="Describe what this level represents..."
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
