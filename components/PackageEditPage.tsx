
import React, { useState, useEffect } from 'react';
import { PackageDetails, PackageChannel, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface PackageEditPageProps {
  data: PackageDetails;
  onSave: (data: PackageDetails) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
}

export const PackageEditPage: React.FC<PackageEditPageProps> = ({ 
  data, onSave, onCancel, onNavigate 
}) => {
  const [formData, setFormData] = useState<PackageDetails>(data);

  useEffect(() => {
    // Recalculate total amount when rate or tax changes
    let total = formData.baseRate;
    if (!formData.isTaxInclusive) {
      total = formData.baseRate * (1 + formData.taxPercentage / 100);
    }
    if (total !== formData.totalAmount) {
      setFormData(prev => ({ ...prev, totalAmount: total }));
    }
  }, [formData.baseRate, formData.taxPercentage, formData.isTaxInclusive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeChannel = (channelId: string) => {
    setFormData(prev => ({
      ...prev,
      channels: prev.channels.filter(c => c.id !== channelId)
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark py-8 px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <Breadcrumbs currentView="edit-package" onNavigate={onNavigate} />
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white mt-2">Package Details</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">View and edit package configuration details</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-white border border-slate-300 hover:bg-slate-50 transition-colors text-slate-700 text-sm font-bold shadow-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(formData)}
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold shadow-sm shadow-blue-200"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Package Name</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Package Short Name</label>
                  <input name="shortName" value={formData.shortName} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5 font-mono" type="text" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Package Grade</label>
                  <input name="grade" value={formData.grade} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5" type="text" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Category Type</label>
                  <select name="serviceCategory" value={formData.serviceCategory} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5">
                    <option value="Cable TV">Cable TV</option>
                    <option value="Broadband Internet">Broadband Internet</option>
                    <option value="IPTV">IPTV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">MSO Or Broadcaster</label>
                  <select name="msoBroadcaster" value={formData.msoBroadcaster} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5">
                    <option value="Global Networks Ltd.">Global Networks Ltd.</option>
                    <option value="City Cable Services">City Cable Services</option>
                    <option value="Star Broadcasters">Star Broadcasters</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Package Creation Date</label>
                  <input name="creationDate" value={formData.creationDate} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5" type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Package Inactive From</label>
                  <input name="inactiveFrom" value={formData.inactiveFrom || ''} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5" type="date" />
                </div>
              </div>
            </div>

            {/* Pricing & Tax */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  Pricing & Tax
                </h3>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5">
                  <input 
                    id="with_tax" 
                    name="isTaxInclusive" 
                    checked={formData.isTaxInclusive} 
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary" 
                    type="checkbox" 
                  />
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none cursor-pointer" htmlFor="with_tax">Tax Inclusive</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Base Rate ($)</label>
                  <input name="baseRate" value={formData.baseRate} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5 font-medium" step="0.01" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tax (%)</label>
                  <input name="taxPercentage" value={formData.taxPercentage} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Total Amount ($)</label>
                  <input value={formData.totalAmount.toFixed(2)} readOnly className="w-full rounded-lg border-slate-300 bg-slate-100 text-slate-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400 focus:ring-0 text-sm p-2.5 font-bold cursor-not-allowed" type="text" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">DRP (Distributor Retail Price)</label>
                  <input name="drp" value={formData.drp} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5" type="number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">MRP (Maximum Retail Price)</label>
                  <input name="mrp" value={formData.mrp} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-white focus:ring-primary focus:border-primary text-sm p-2.5" type="number" />
                </div>
              </div>
            </div>

            {/* Mapped Channels */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">connected_tv</span>
                  Mapped Channels
                </h3>
                <button className="text-sm font-medium text-primary hover:text-blue-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Add Channel
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Channel Name</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Language</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {formData.channels.map(channel => (
                      <tr key={channel.id}>
                        <td className="px-6 py-3 text-sm text-slate-900 dark:text-white">{channel.name}</td>
                        <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">{channel.category}</td>
                        <td className="px-6 py-3 text-sm text-slate-600 dark:text-slate-400">{channel.language}</td>
                        <td className="px-6 py-3 text-right">
                          <button 
                            onClick={() => removeChannel(channel.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Package Status */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Package Status</h3>
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Is Active</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    name="isActive" 
                    checked={formData.isActive} 
                    onChange={handleInputChange} 
                    className="sr-only peer" 
                    type="checkbox" 
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Associations Summary</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Active Customers</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.associations.activeCustomers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Pending Enquiries</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.associations.pendingEnquiries.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">history</span>
                Audit Trail
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Created By</label>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                      {formData.audit.createdBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-slate-900 dark:text-white">{formData.audit.createdBy}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Created Date</label>
                  <span className="text-sm text-slate-900 dark:text-white font-mono">{formData.audit.createdDate}</span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Last Updated By</label>
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
                      {formData.audit.updatedBy.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-slate-900 dark:text-white">{formData.audit.updatedBy}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Updated Date</label>
                  <span className="text-sm text-slate-900 dark:text-white font-mono">{formData.audit.updatedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
