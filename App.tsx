
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StateEditPage } from './components/StateEditPage';
import { StateListPage } from './components/StateListPage';
import { StateDetailsPage } from './components/StateDetailsPage';
import { CountryEditPage } from './components/CountryEditPage';
import { CountryListPage } from './components/CountryListPage';
import { CountryDetailsPage } from './components/CountryDetailsPage';
import { CityListPage } from './components/CityListPage';
import { CityEditPage } from './components/CityEditPage';
import { CityDetailsPage } from './components/CityDetailsPage';
import { DistrictListPage } from './components/DistrictListPage';
import { DistrictEditPage } from './components/DistrictEditPage';
import { DistrictDetailsPage } from './components/DistrictDetailsPage';
import { AreaListPage } from './components/AreaListPage';
import { AreaEditPage } from './components/AreaEditPage';
import { AreaDetailsPage } from './components/AreaDetailsPage';
import { ColonyListPage } from './components/ColonyListPage';
import { ColonyEditPage } from './components/ColonyEditPage';
import { ColonyDetailsPage } from './components/ColonyDetailsPage';
import { CompanyListPage } from './components/CompanyListPage';
import { CompanyEditPage } from './components/CompanyEditPage';
import { CompanyBillingMappingListPage } from './components/CompanyBillingMappingListPage';
import { CompanyBillingMappingEditPage } from './components/CompanyBillingMappingEditPage';
import { CompanyBillingMappingDetailsPage } from './components/CompanyBillingMappingDetailsPage';
import { BillingTypeListPage } from './components/BillingTypeListPage';
import { BillingTypeEditPage } from './components/BillingTypeEditPage';
import { BillingTypeDetailsPage } from './components/BillingTypeDetailsPage';
import { CompanyLevelListPage } from './components/CompanyLevelListPage';
import { CompanyLevelEditPage } from './components/CompanyLevelEditPage';
import { CompanyLevelDetailsPage } from './components/CompanyLevelDetailsPage';
import { CompanyLevelMappingPage } from './components/CompanyLevelMappingPage';
import { CompanyBusinessEntityMappingListPage } from './components/CompanyBusinessEntityMappingListPage';
import { CompanyBusinessEntityMappingEditPage } from './components/CompanyBusinessEntityMappingEditPage';
import { CompanyBusinessEntityMappingDetailsPage } from './components/CompanyBusinessEntityMappingDetailsPage';
import { CustomerListPage } from './components/CustomerListPage';
import { CustomerEditPage } from './components/CustomerEditPage';
import { CustomerDetailsPage } from './components/CustomerDetailsPage';
import { ViewType, StateDetails, CountryDetails, CityDetails, DistrictDetails, AreaDetails, ColonyDetails, CompanyDetails, BillingType, CompanyLevel, CompanyBillingMapping, CompanyBusinessEntityMapping, CustomerDetails } from './types';

const SAMPLE_AUDIT = {
  createdBy: 'System Admin',
  createdDate: 'Oct 24, 2023 09:41 AM',
  updatedBy: 'Jane Smith',
  updatedDate: 'Nov 02, 2023 02:15 PM'
};

const SAMPLE_EMPLOYEES = [
  { id: 'emp-1', name: 'Alex Johnson', role: 'Tech Lead' },
  { id: 'emp-2', name: 'Sarah Connor', role: 'Field Ops' },
  { id: 'emp-3', name: 'Michael Scott', role: 'Sales Manager' },
  { id: 'emp-4', name: 'Pam Beesly', role: 'Admin' },
];

const SAMPLE_CUSTOMERS: CustomerDetails[] = [
  {
    id: 'cust-1',
    accountNo: 'ACC-100456',
    installationDate: '2023-10-24',
    salutation: 'Mr.',
    firstName: 'John',
    middleName: '',
    lastName: 'Doe',
    subscriberType: 'Residential',
    companyId: 'comp-01',
    connectionType: 'Fiber Optic',
    gstMode: 'Included',
    remark: 'VIP customer, prioritize installation updates.',
    gstNo: '22AAAAA0000A1Z5',
    panNo: 'ABCDE1234F',
    aadhaarNo: '4567 8901 2345',
    msoNo: 'MSO-789-012',
    status: 'Active',
    isActiveProfile: true,
    technicalInChargeId: 'emp-1',
    collectionInChargeId: 'emp-3',
    addresses: [
      {
        id: 'addr-1',
        type: 'Installation',
        isPrimary: true,
        addressLine: 'Flat 402, Sunshine Apartments, 12th Main Road',
        district: 'Bangalore Urban',
        area: 'Indiranagar Stage 2',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pinCode: '560038',
        status: 'Active'
      },
      {
        id: 'addr-2',
        type: 'Billing',
        isPrimary: false,
        addressLine: 'PO Box 8921, Industrial Layout',
        district: 'Bangalore Urban',
        area: 'EPIP Zone',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        pinCode: '560066',
        status: 'Active'
      }
    ],
    contacts: [
      { id: 'cont-1', label: 'Personal Mobile', value: '+91 98765 43210', type: 'Mobile', isPrimary: true },
      { id: 'cont-2', label: 'Work Email', value: 'john.doe@example.com', type: 'Email', isPrimary: true }
    ],
    audit: SAMPLE_AUDIT
  }
];

const SAMPLE_COMPANIES: CompanyDetails[] = [
  {
    id: 'comp-01', fullName: 'Acme International', shortName: 'ACME', level: 'Parent', status: 'Active', cinNo: 'L12345MH2023PLC123456',
    addressLine1: '123 Tech Park', addressLine2: 'Silicon Valley', addressLine3: 'CA', pinCode: '94043', country: 'US', state: 'CA', city: 'SF',
    email: 'contact@acme.com', mobile: '+1 555 000 1111', telephone: '+1 555 000 2222', whatsapp: '+1 555 000 1111',
    ownerName: 'John Doe', ownerContact: '+1 555 999 0000', ownerEmail: 'john@acme.com',
    currency: 'USD ($)', fyStart: '2023-01-01', gstMode: 'Regular', gstNo: 'GST12345678', gstRegDate: '2023-01-01',
    panNo: 'PAN12345', tinNo: 'TIN12345', licenceNo: 'LIC-001', licenceExpiryFrom: '2023-01-01', licenceExpiryTo: '2025-01-01',
    primaryBank: 'Chase', isActive: true, audit: SAMPLE_AUDIT, history: []
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [allCompanies] = useState<CompanyDetails[]>(SAMPLE_COMPANIES);
  const [allCustomers, setAllCustomers] = useState<CustomerDetails[]>(SAMPLE_CUSTOMERS);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDetails | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerDetails | null>(null);

  // Other state placeholders...
  const [allBillingTypes] = useState<BillingType[]>([]);
  const [allMappings] = useState<CompanyBillingMapping[]>([]);
  const [allEntityMappings] = useState<CompanyBusinessEntityMapping[]>([]);
  const [allCompanyLevels] = useState<CompanyLevel[]>([]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSaveCustomer = (updatedData: CustomerDetails) => {
    setAllCustomers(prev => {
      const exists = prev.find(c => c.id === updatedData.id);
      if (exists) return prev.map(c => c.id === updatedData.id ? updatedData : c);
      return [...prev, { ...updatedData, id: 'cust-' + Math.random().toString(36).substr(2, 5) }];
    });
    setCurrentView('customers');
  };

  const emptyCustomer: CustomerDetails = {
    id: '', accountNo: '', installationDate: '', salutation: 'Mr.', firstName: '', middleName: '', lastName: '',
    subscriberType: 'Residential', companyId: '', connectionType: 'Fiber Optic', gstMode: 'Included',
    remark: '', gstNo: '', panNo: '', aadhaarNo: '', msoNo: '', status: 'Active', isActiveProfile: true,
    technicalInChargeId: '', collectionInChargeId: '', addresses: [], contacts: [],
    audit: { createdBy: 'Admin User', createdDate: new Date().toLocaleDateString(), updatedBy: 'Admin User', updatedDate: new Date().toLocaleDateString() }
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <Header currentView={currentView} onViewChange={setCurrentView} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark relative">
          {currentView === 'customers' && (
            <CustomerListPage 
              customers={allCustomers} 
              companies={allCompanies} 
              onEdit={(c) => { setEditingCustomer(c); setCurrentView('edit-customer'); }}
              onView={(c) => { setViewingCustomer(c); setCurrentView('view-customer'); }}
              onAdd={() => { setEditingCustomer(emptyCustomer); setCurrentView('edit-customer'); }}
              onDelete={(id) => setAllCustomers(prev => prev.filter(c => c.id !== id))}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === 'edit-customer' && editingCustomer && (
            <CustomerEditPage 
              data={editingCustomer}
              companies={allCompanies}
              employees={SAMPLE_EMPLOYEES}
              onSave={handleSaveCustomer}
              onCancel={() => setCurrentView('customers')}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === 'view-customer' && viewingCustomer && (
            <CustomerDetailsPage 
              customer={viewingCustomer}
              companies={allCompanies}
              employees={SAMPLE_EMPLOYEES}
              onNavigate={setCurrentView}
              onEdit={(c) => { setEditingCustomer(c); setCurrentView('edit-customer'); }}
            />
          )}

          {/* Existing routes logic here (omitted for brevity, keep existing logic in actual implementation) */}
          {currentView === 'companies' && (
             <CompanyListPage companies={allCompanies} onEdit={()=>{}} onView={()=>{}} onAdd={()=>{}} onDelete={()=>{}} onNavigate={setCurrentView} />
          )}

          {(currentView === 'dashboard' || currentView === 'settings') && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8 bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="material-symbols-outlined text-7xl text-primary/20 mb-4 block">{currentView === 'dashboard' ? 'dashboard' : 'settings'}</span>
                <h2 className="text-2xl font-bold text-gray-500 capitalize">{currentView} Content</h2>
                <p className="text-sm text-gray-400 mt-2">Module is under development.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
