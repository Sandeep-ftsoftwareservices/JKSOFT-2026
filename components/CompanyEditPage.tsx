
import React, { useState } from 'react';
import { CompanyDetails, ViewType, CountryDetails, StateDetails, CityDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CompanyEditPageProps {
  data: CompanyDetails;
  countries: CountryDetails[];
  states: StateDetails[];
  cities: CityDetails[];
  companies: CompanyDetails[];
  onSave: (data: CompanyDetails) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
}

export const CompanyEditPage: React.FC<CompanyEditPageProps> = ({ 
  data, countries, states, cities, companies, onSave, onCancel, onNavigate 
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CompanyDetails>(data);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = () => setFormData(prev => ({ ...prev, isActive: !prev.isActive }));

  const nextStep = () => setStep(s => Math.min(5, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const steps = [
    { id: 1, label: 'Identification' },
    { id: 2, label: 'Contact' },
    { id: 3, label: 'Owner' },
    { id: 4, label: 'Financial' },
    { id: 5, label: 'Banking' },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-1 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2 col-span-full">
              <h2 className="text-[#111418] dark:text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">domain</span>
                Step 1: Company Identification
              </h2>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Company Name *</span>
              <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" placeholder="e.g. Acme Corp" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Short Name</span>
              <input name="shortName" value={formData.shortName} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" placeholder="e.g. ACME" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Company Level</span>
              <select name="level" value={formData.level} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                <option>Parent</option>
                <option>Subsidiary</option>
                <option>Branch</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Parent Company</span>
              <select name="parentCompanyId" value={formData.parentCompanyId} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                <option value="">None</option>
                {companies.filter(c => c.id !== formData.id).map(c => <option key={c.id} value={c.id}>{c.fullName}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Status</span>
              <select name="status" value={formData.status} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending Dissolution</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">CIN No</span>
              <input name="cinNo" value={formData.cinNo} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" placeholder="Corporate Identity Number" />
            </label>
          </div>
        );
      case 2:
        return (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-1 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2 col-span-full">
              <h2 className="text-[#111418] dark:text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Step 2: Contact Information
              </h2>
            </div>
            <label className="flex flex-col gap-2 md:col-span-3">
              <span className="text-sm font-medium dark:text-gray-300">Address Line 1</span>
              <input name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Country</span>
              <select name="country" value={formData.country} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                <option value="">Select Country</option>
                {countries.map(c => <option key={c.id} value={c.shortName}>{c.fullName}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">State</span>
              <select name="state" value={formData.state} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                <option value="">Select State</option>
                {states.filter(s => s.country === formData.country).map(s => <option key={s.id} value={s.shortName}>{s.fullName}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">City</span>
              <select name="city" value={formData.city} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                <option value="">Select City</option>
                {cities.filter(c => c.state === formData.state).map(c => <option key={c.id} value={c.shortName}>{c.fullName}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Email</span>
              <input name="email" value={formData.email} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" type="email" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Mobile</span>
              <input name="mobile" value={formData.mobile} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">WhatsApp</span>
              <input name="whatsapp" value={formData.whatsapp} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" />
            </label>
          </div>
        );
      case 3:
        return (
          <div className="p-8 space-y-6 max-w-2xl">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
              <h2 className="text-[#111418] dark:text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Step 3: Owner Information
              </h2>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Owner Name</span>
              <input name="ownerName" value={formData.ownerName} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Owner Contact No</span>
              <input name="ownerContact" value={formData.ownerContact} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Owner Email ID</span>
              <input name="ownerEmail" value={formData.ownerEmail} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" type="email" />
            </label>
          </div>
        );
      case 4:
        return (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-1 border-b border-gray-100 dark:border-gray-800 pb-4 mb-2 col-span-full">
              <h2 className="text-[#111418] dark:text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                Step 4: Financial & Legal Details
              </h2>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Currency</span>
              <select name="currency" value={formData.currency} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                <option>USD ($)</option>
                <option>INR (₹)</option>
                <option>EUR (€)</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Fin. Year Start From</span>
              <input name="fyStart" value={formData.fyStart} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" type="date" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">GST Mode</span>
              <select name="gstMode" value={formData.gstMode} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                <option>Regular</option>
                <option>Composition</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">GST No</span>
              <input name="gstNo" value={formData.gstNo} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">PAN No</span>
              <input name="panNo" value={formData.panNo} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Licence No</span>
              <input name="licenceNo" value={formData.licenceNo} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4" />
            </label>
          </div>
        );
      case 5:
        return (
          <div className="p-8 space-y-8">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-2">
              <h2 className="text-[#111418] dark:text-white text-lg font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                Step 5: Banking & Audit Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium dark:text-gray-300">Primary Bank</span>
                <select name="primaryBank" value={formData.primaryBank} onChange={handleInputChange} className="rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 h-12 px-4">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Chase</option>
                </select>
              </label>
              <div className="flex flex-col gap-3 pt-6">
                <span className="text-sm font-medium dark:text-gray-300">Is Record Active?</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={handleToggleChange} />
                  <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl pt-8 border-t border-gray-100 dark:border-gray-800">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-[#617589] dark:text-gray-400 text-xs uppercase font-bold">Created By</p>
                <p className="text-sm font-semibold dark:text-white mt-1">{formData.audit.createdBy}</p>
                <p className="text-xs text-[#617589] mt-0.5">{formData.audit.createdDate}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-[#617589] dark:text-gray-400 text-xs uppercase font-bold">Last Updated</p>
                <p className="text-sm font-semibold dark:text-white mt-1">{formData.audit.updatedBy}</p>
                <p className="text-xs text-[#617589] mt-0.5">{formData.audit.updatedDate}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <div className="max-w-[1200px] mx-auto p-6 md:p-8 space-y-8">
        <Breadcrumbs currentView="edit-company" onNavigate={onNavigate} />
        
        <div className="flex flex-col gap-1">
          <h1 className="text-[#111418] dark:text-white text-3xl font-black leading-tight tracking-tight">Company Details</h1>
          <p className="text-[#617589] dark:text-gray-400 text-base">Complete the 5-step process to update company information.</p>
        </div>

        {/* Stepper */}
        <div className="relative mb-10 px-4">
          <div className="absolute left-10 right-10 top-5 h-1 bg-gray-200 dark:bg-gray-700 -z-0"></div>
          <div className="relative z-10 flex justify-between">
            {steps.map((s) => (
              <div key={s.id} className={`flex flex-col items-center gap-2 ${step >= s.id ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-white dark:border-background-dark shadow-sm transition-all ${step === s.id ? 'bg-primary text-white scale-110 ring-4 ring-primary/20' : step > s.id ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                  {step > s.id ? <span className="material-symbols-outlined text-[18px]">check</span> : s.id}
                </div>
                <span className={`text-xs font-bold hidden md:block ${step === s.id ? 'text-primary' : 'text-gray-500'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-xl border border-[#dbe0e6] dark:border-gray-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex-1">
            {renderStep()}
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/30 px-6 py-4 border-t border-[#dbe0e6] dark:border-gray-800 flex justify-between items-center">
            <button 
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center justify-center rounded-lg h-10 px-6 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold transition-all ${step === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              Previous
            </button>
            <div className="flex gap-3">
              <button onClick={onCancel} className="flex items-center justify-center rounded-lg h-10 px-6 border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold hover:bg-gray-50 transition-all">Cancel</button>
              {step < 5 ? (
                <button onClick={nextStep} className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-blue-600 shadow-sm transition-all">
                  Next Step
                  <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
                </button>
              ) : (
                <button onClick={() => onSave(formData)} className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-blue-600 shadow-sm transition-all">
                  Finish & Save
                  <span className="material-symbols-outlined ml-2 text-[18px]">check</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
