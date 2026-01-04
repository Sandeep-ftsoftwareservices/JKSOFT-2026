
import React from 'react';
import { CustomerDetails, ViewType, CompanyDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CustomerDetailsPageProps {
  customer: CustomerDetails;
  companies: CompanyDetails[];
  employees: { id: string, name: string, role: string }[];
  onNavigate: (view: ViewType) => void;
  onEdit: (customer: CustomerDetails) => void;
}

export const CustomerDetailsPage: React.FC<CustomerDetailsPageProps> = ({ 
  customer, companies, employees, onNavigate, onEdit 
}) => {
  const company = companies.find(c => c.id === customer.companyId);
  const techInCharge = employees.find(e => e.id === customer.technicalInChargeId);
  const collInCharge = employees.find(e => e.id === customer.collectionInChargeId);

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
      <main className="px-6 lg:px-12 py-8 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Breadcrumbs currentView="view-customer" onNavigate={onNavigate} />
            <h1 className="text-3xl font-black tracking-tight text-[#111418] dark:text-white mt-2">
              {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-[#617589] dark:text-gray-400 mt-1">Profile View • {customer.accountNo}</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => onNavigate('customers')}
              className="px-4 py-2 text-sm font-bold text-[#617589] bg-white border border-[#dbe0e6] dark:bg-[#1a2632] dark:border-[#2a3441] dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to List
            </button>
            <button 
              onClick={() => onEdit(customer)}
              className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg shadow-sm hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            {/* Core Info Grid */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] p-8">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-[#617589] uppercase tracking-widest mb-1">Subscriber Type</p>
                    <p className="font-semibold dark:text-white">{customer.subscriberType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#617589] uppercase tracking-widest mb-1">Connection</p>
                    <p className="font-semibold dark:text-white">{customer.connectionType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#617589] uppercase tracking-widest mb-1">GST Mode</p>
                    <p className="font-semibold dark:text-white">{customer.gstMode}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#617589] uppercase tracking-widest mb-1">Account No</p>
                    <p className="font-semibold dark:text-white">{customer.accountNo}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#617589] uppercase tracking-widest mb-1">Installation Date</p>
                    <p className="font-semibold dark:text-white">{customer.installationDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#617589] uppercase tracking-widest mb-1">Associated Company</p>
                    <p className="font-semibold dark:text-white">{company?.fullName || 'Individual'}</p>
                  </div>
               </div>
               {customer.remark && (
                 <div className="mt-8 pt-8 border-t border-dashed border-[#f0f2f4] dark:border-[#2a3441]">
                   <p className="text-[10px] font-bold text-[#617589] uppercase tracking-widest mb-2">Remark</p>
                   <p className="text-sm text-[#111418] dark:text-gray-300 italic">"{customer.remark}"</p>
                 </div>
               )}
            </div>

            {/* Address Management Details */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441]">
              <div className="px-6 py-4 border-b dark:border-[#2a3441] bg-gray-50/50 dark:bg-slate-800/30">
                <h3 className="font-bold flex items-center gap-2"><span className="material-symbols-outlined text-primary">location_on</span> Addresses</h3>
              </div>
              <div className="p-6 space-y-4">
                {customer.addresses.map(addr => (
                  <div key={addr.id} className="p-4 rounded-lg bg-gray-50 dark:bg-[#111418] border border-[#f0f2f4] dark:border-[#2a3441]">
                    <div className="flex items-center gap-2 mb-3">
                       <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">{addr.type}</span>
                       {addr.isPrimary && <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 uppercase">Primary</span>}
                    </div>
                    <p className="text-sm dark:text-gray-300 leading-relaxed mb-4">{addr.addressLine}<br/>{addr.city}, {addr.state} - {addr.pinCode}</p>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed border-gray-200 dark:border-[#2a3441]">
                       <div><span className="text-[10px] text-gray-500 uppercase">District</span><p className="text-xs font-semibold dark:text-white">{addr.district}</p></div>
                       <div><span className="text-[10px] text-gray-500 uppercase">Area</span><p className="text-xs font-semibold dark:text-white">{addr.area}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] p-6 text-center">
               <div className={`size-16 mx-auto rounded-full flex items-center justify-center mb-4 ${customer.isActiveProfile ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                 <span className="material-symbols-outlined text-3xl">{customer.isActiveProfile ? 'verified' : 'block'}</span>
               </div>
               <h4 className="font-bold text-lg dark:text-white">{customer.status}</h4>
               <p className="text-xs text-[#617589] mt-1">Profile is {customer.isActiveProfile ? 'Active & Visible' : 'Inactive / Restricted'}</p>
            </div>

            {/* Staff Card */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#617589] mb-6">Staff in Charge</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined">engineering</span></div>
                    <div><p className="text-[10px] text-gray-500 uppercase">Technical</p><p className="text-sm font-semibold dark:text-white">{techInCharge?.name || 'Unassigned'}</p></div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined">payments</span></div>
                    <div><p className="text-[10px] text-gray-500 uppercase">Collection</p><p className="text-sm font-semibold dark:text-white">{collInCharge?.name || 'Unassigned'}</p></div>
                 </div>
              </div>
            </div>

            {/* Contacts Card */}
            <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2a3441] p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#617589] mb-6">Contacts</h3>
              <div className="space-y-4">
                {customer.contacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-gray-400 text-xl">{contact.type === 'Email' ? 'mail' : 'call'}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold dark:text-white truncate">{contact.value}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{contact.label}</p>
                      </div>
                    </div>
                    {contact.isPrimary && <span className="material-symbols-outlined text-green-500 text-sm">verified</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
