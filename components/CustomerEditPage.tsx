
import React, { useState } from 'react';
import { CustomerDetails, ViewType, CompanyDetails, AddressInfo, ContactInfo } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CustomerEditPageProps {
  data: CustomerDetails;
  companies: CompanyDetails[];
  employees: { id: string, name: string, role: string }[];
  onSave: (data: CustomerDetails) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
}

export const CustomerEditPage: React.FC<CustomerEditPageProps> = ({ 
  data, companies, employees, onSave, onCancel, onNavigate 
}) => {
  const [formData, setFormData] = useState<CustomerDetails>(data);
  const [activeTab, setActiveTab] = useState<'address' | 'contact'>('address');
  const [installationBillingSame, setInstallationBillingSame] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstallationBillingSame(e.target.checked);
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <main className="px-6 lg:px-12 py-8 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Breadcrumbs currentView="edit-customer" onNavigate={onNavigate} />
            <h1 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white mt-2">Customer Details</h1>
            <p className="text-[#617589] dark:text-gray-400 mt-1">Manage personal details, addresses, and contacts.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-sm font-bold text-[#617589] bg-white border border-[#dbe0e6] dark:bg-[#1a2632] dark:border-[#2a3441] dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#23303e] transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            {/* Customer Profile Section */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a3441] flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">badge</span>
                  Customer Profile
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Account No</label>
                  <input 
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-400 text-sm" 
                    placeholder="Auto-generated or Enter ID" 
                    type="text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Date of Installation</label>
                  <input 
                    name="installationDate"
                    value={formData.installationDate}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" 
                    type="date"
                  />
                </div>
                
                <div className="space-y-1.5 md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Salutation</label>
                    <select name="salutation" value={formData.salutation} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm">
                      <option>Mr.</option>
                      <option>Mrs.</option>
                      <option>Ms.</option>
                      <option>Dr.</option>
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">First Name</label>
                    <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="John" type="text"/>
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Middle Name</label>
                    <input name="middleName" value={formData.middleName} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="" type="text"/>
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Last Name</label>
                    <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="Doe" type="text"/>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Subscriber Type</label>
                  <select name="subscriberType" value={formData.subscriberType} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm">
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Corporate</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Company</label>
                  <select name="companyId" value={formData.companyId} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm">
                    <option value="">None / Individual</option>
                    {companies.map(comp => <option key={comp.id} value={comp.id}>{comp.fullName}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Connection Type</label>
                  <select name="connectionType" value={formData.connectionType} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm">
                    <option>Fiber Optic</option>
                    <option>Cable</option>
                    <option>Wireless</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">GST Mode</label>
                  <select name="gstMode" value={formData.gstMode} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm">
                    <option>Included</option>
                    <option>Excluded</option>
                  </select>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Remark</label>
                  <textarea name="remark" value={formData.remark} onChange={handleInputChange} className="w-full p-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none" placeholder="Add any additional notes about the customer..." rows={3}></textarea>
                </div>
              </div>
            </div>

            {/* Unique Identifiers Section */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#e5e7eb] dark:border-[#2a3441]">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">fingerprint</span>
                  Unique Identifiers
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">GST No</label>
                  <input name="gstNo" value={formData.gstNo} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm uppercase" placeholder="22AAAAA0000A1Z5" type="text"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">PAN No</label>
                  <input name="panNo" value={formData.panNo} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm uppercase" placeholder="ABCDE1234F" type="text"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Aadhaar No</label>
                  <input name="aadhaarNo" value={formData.aadhaarNo} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="0000 0000 0000" type="text"/>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">MSO No</label>
                  <input name="msoNo" value={formData.msoNo} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" placeholder="MSO-123-456" type="text"/>
                </div>
              </div>
            </div>

            {/* Tabs for Address and Contacts */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] overflow-hidden min-h-[400px]">
              <div className="border-b border-[#e5e7eb] dark:border-[#2a3441] px-6">
                <div className="flex gap-8">
                  <button 
                    onClick={() => setActiveTab('address')}
                    className={`py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'address' ? 'text-primary border-primary' : 'text-[#617589] border-transparent hover:text-[#111418]'}`}
                  >
                    Address Information
                  </button>
                  <button 
                    onClick={() => setActiveTab('contact')}
                    className={`py-4 text-sm font-bold transition-colors border-b-2 ${activeTab === 'contact' ? 'text-primary border-primary' : 'text-[#617589] border-transparent hover:text-[#111418]'}`}
                  >
                    Contact Information
                  </button>
                </div>
              </div>
              <div className="p-6">
                {activeTab === 'address' ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={installationBillingSame} onChange={handleAddressToggle} />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-[#111418] dark:text-gray-300">Installation & Billing Same</span>
                      </label>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Address
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.addresses.map(addr => (
                        <div key={addr.id} className="border border-[#e5e7eb] dark:border-[#2a3441] rounded-lg p-4 bg-gray-50 dark:bg-[#111418] relative group">
                          <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-gray-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                            <button className="p-1 text-gray-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                            <div className="md:col-span-8">
                              <div className="flex items-center gap-2 mb-2">
                                {addr.isPrimary && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">Primary</span>}
                                <h4 className="text-sm font-bold text-[#111418] dark:text-white">{addr.type} Address</h4>
                              </div>
                              <p className="text-sm text-[#617589] dark:text-gray-400 leading-relaxed">
                                {addr.addressLine}<br/>
                                {addr.city}, {addr.state}, {addr.country} - {addr.pinCode}
                              </p>
                            </div>
                            <div className="md:col-span-4 flex flex-col justify-center gap-2 text-xs text-[#617589] dark:text-gray-500">
                              <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span>District:</span> <span className="font-medium text-[#111418] dark:text-gray-300">{addr.district}</span></div>
                              <div className="flex justify-between border-b border-dashed border-gray-200 pb-1"><span>Area:</span> <span className="font-medium text-[#111418] dark:text-gray-300">{addr.area}</span></div>
                              <div className="flex justify-between"><span>Status:</span> <span className={`font-medium ${addr.status === 'Active' ? 'text-green-600' : 'text-gray-500'}`}>{addr.status}</span></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-sm">add_call</span>
                        Add Contact
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.contacts.map(contact => (
                        <div key={contact.id} className="p-4 rounded-lg border border-[#e5e7eb] dark:border-[#2a3441] bg-gray-50 dark:bg-[#111418] flex items-center gap-4 group">
                          <div className="size-10 rounded-full bg-white dark:bg-[#1a2632] flex items-center justify-center text-primary shadow-sm border border-[#f0f2f4] dark:border-[#2a3441]">
                            <span className="material-symbols-outlined">{contact.type === 'Mobile' ? 'call' : contact.type === 'Email' ? 'mail' : 'forum'}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-[#617589] uppercase tracking-wider">{contact.label} {contact.isPrimary && '(Primary)'}</p>
                            <p className="text-sm font-semibold truncate dark:text-white">{contact.value}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-lg">edit</span></button>
                            <button className="p-1.5 text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-lg">delete</span></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column Sidebar Info */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            {/* Status Card */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#617589] mb-4">Account Status</h3>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium">Is Active Profile</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input name="isActiveProfile" type="checkbox" checked={formData.isActiveProfile} onChange={handleInputChange} className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Customer Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full h-10 px-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm">
                    <option>Active</option>
                    <option>Suspended</option>
                    <option>Terminated</option>
                    <option>New Lead</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Charge Details Card */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">payments</span>
                Charge Details
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Technical In Charge</label>
                  <div className="relative">
                    <select name="technicalInChargeId" value={formData.technicalInChargeId} onChange={handleInputChange} className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm appearance-none">
                      <option value="">Select Employee...</option>
                      {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[18px]">engineering</span>
                    <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-gray-400 text-[18px] pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#111418] dark:text-gray-200">Collection In Charge</label>
                  <div className="relative">
                    <select name="collectionInChargeId" value={formData.collectionInChargeId} onChange={handleInputChange} className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#111418] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm appearance-none">
                      <option value="">Select Employee...</option>
                      {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[18px]">account_balance_wallet</span>
                    <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-gray-400 text-[18px] pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Log (Short version) */}
            <div className="p-4 rounded-lg bg-transparent border border-dashed border-[#dbe0e6] dark:border-[#3e4c5a]">
              <h4 className="text-xs font-bold text-[#617589] uppercase mb-3 tracking-widest">Audit Information</h4>
              <ul className="space-y-2 text-xs text-[#617589] dark:text-gray-500">
                <li className="flex justify-between">
                  <span>Created By:</span>
                  <span className="font-medium text-[#111418] dark:text-gray-300">{formData.audit.createdBy}</span>
                </li>
                <li className="flex justify-between">
                  <span>Created Date:</span>
                  <span className="font-medium text-[#111418] dark:text-gray-300">{formData.audit.createdDate}</span>
                </li>
                <li className="flex justify-between">
                  <span>Updated By:</span>
                  <span className="font-medium text-[#111418] dark:text-gray-300">{formData.audit.updatedBy}</span>
                </li>
                <li className="flex justify-between">
                  <span>Updated Date:</span>
                  <span className="font-medium text-[#111418] dark:text-gray-300">{formData.audit.updatedDate}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
