
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
import { EnquiryListPage } from './components/EnquiryListPage';
import { EnquiryEditPage } from './components/EnquiryEditPage';
import { EnquiryDetailsPage } from './components/EnquiryDetailsPage';
import { PackageListPage } from './components/PackageListPage';
import { PackageEditPage } from './components/PackageEditPage';
import { PackageDetailsPage } from './components/PackageDetailsPage';
import { ViewType, StateDetails, CountryDetails, CityDetails, DistrictDetails, AreaDetails, ColonyDetails, CompanyDetails, BillingType, CompanyLevel, CompanyBillingMapping, CompanyBusinessEntityMapping, CustomerDetails, EnquiryDetails, PackageDetails } from './types';

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

const SAMPLE_COUNTRIES: CountryDetails[] = [
  { id: 'us-01', fullName: 'United States', shortName: 'US', code: '01', isActive: true, audit: SAMPLE_AUDIT, history: [] },
  { id: 'ca-02', fullName: 'Canada', shortName: 'CA', code: '02', isActive: true, audit: SAMPLE_AUDIT, history: [] }
];

const SAMPLE_STATES: StateDetails[] = [
  { id: 'ca-123', fullName: 'California', shortName: 'CA', stateCode: '06', country: 'US', gstCode: '99', stdCode: '213', isActive: true, audit: SAMPLE_AUDIT, history: [] },
  { id: 'ny-456', fullName: 'New York', shortName: 'NY', stateCode: '36', country: 'US', gstCode: '36', stdCode: '212', isActive: true, audit: SAMPLE_AUDIT, history: [] }
];

const SAMPLE_CITIES: CityDetails[] = [
  { id: 'sf-01', fullName: 'San Francisco', shortName: 'SF', cityCode: 'SF001', state: 'CA', country: 'US', isActive: true, audit: SAMPLE_AUDIT, history: [] },
  { id: 'nyc-01', fullName: 'New York City', shortName: 'NYC', cityCode: 'NYC001', state: 'NY', country: 'US', isActive: true, audit: SAMPLE_AUDIT, history: [] }
];

const SAMPLE_DISTRICTS: DistrictDetails[] = [
  { id: 'cbd-01', fullName: 'Central Business District', shortName: 'CBD', city: 'SF', state: 'CA', country: 'US', isActive: true, audit: SAMPLE_AUDIT, history: [] }
];

const SAMPLE_AREAS: AreaDetails[] = [
  { id: 'gwh-01', fullName: 'Greenwood Heights', shortName: 'GWH', pinCode: '560001', district: 'CBD', city: 'SF', state: 'CA', country: 'US', isActive: true, audit: SAMPLE_AUDIT, history: [] }
];

const SAMPLE_COLONIES: ColonyDetails[] = [
  { id: 'col-01', fullName: 'Sunrise Apartments', shortName: 'SAP', area: 'GWH', district: 'CBD', city: 'SF', state: 'CA', country: 'US', isActive: true, audit: SAMPLE_AUDIT, history: [] }
];

const SAMPLE_PACKAGES: PackageDetails[] = [
  {
    id: 'pkg-1',
    name: 'Super Saver Family Pack',
    shortName: 'SSF_PACK_01',
    grade: 'Premium',
    description: 'Includes top entertainment channels and regional news.',
    serviceCategory: 'Broadband Internet',
    msoBroadcaster: 'Global Networks Ltd.',
    creationDate: '2023-01-15',
    isTaxInclusive: false,
    baseRate: 45.00,
    taxPercentage: 18,
    totalAmount: 53.10,
    drp: 48.00,
    mrp: 60.00,
    isActive: true,
    channels: [
      { id: 'ch-1', name: 'Discovery Channel', category: 'Infotainment', language: 'English' },
      { id: 'ch-2', name: 'Star Sports 1', category: 'Sports', language: 'Hindi' },
      { id: 'ch-3', name: 'HBO HD', category: 'Movies', language: 'English' }
    ],
    associations: { activeCustomers: 1245, pendingEnquiries: 34 },
    audit: SAMPLE_AUDIT
  }
];

const SAMPLE_ENQUIRIES: EnquiryDetails[] = [
  {
    id: 'enq-1',
    enquiryNo: 'ENQ-001',
    customerName: 'John Michael Doe',
    mobileNo: '+1 555-0101',
    email: 'john.doe@email.com',
    date: 'Oct 27, 2023',
    status: 'New',
    subject: 'Interested in Fiber Optic plan',
    message: 'I would like to know more about high-speed residential plans.',
    audit: SAMPLE_AUDIT
  }
];

const SAMPLE_CUSTOMERS: CustomerDetails[] = [
  {
    id: 'cust-1', accountNo: 'ACC-100456', installationDate: '2023-10-24', salutation: 'Mr.', firstName: 'John', middleName: '', lastName: 'Doe',
    subscriberType: 'Residential', companyId: 'comp-01', connectionType: 'Fiber Optic', gstMode: 'Included',
    remark: 'VIP customer', gstNo: '22AAAAA0000A1Z5', panNo: 'ABCDE1234F', aadhaarNo: '4567 8901 2345', msoNo: 'MSO-789-012',
    status: 'Active', isActiveProfile: true, technicalInChargeId: 'emp-1', collectionInChargeId: 'emp-3', addresses: [], contacts: [], audit: SAMPLE_AUDIT
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

  // States
  const [allCountries, setAllCountries] = useState<CountryDetails[]>(SAMPLE_COUNTRIES);
  const [allStates, setAllStates] = useState<StateDetails[]>(SAMPLE_STATES);
  const [allCities, setAllCities] = useState<CityDetails[]>(SAMPLE_CITIES);
  const [allDistricts, setAllDistricts] = useState<DistrictDetails[]>(SAMPLE_DISTRICTS);
  const [allAreas, setAllAreas] = useState<AreaDetails[]>(SAMPLE_AREAS);
  const [allColonies, setAllColonies] = useState<ColonyDetails[]>(SAMPLE_COLONIES);
  const [allCompanies, setAllCompanies] = useState<CompanyDetails[]>(SAMPLE_COMPANIES);
  const [allCustomers, setAllCustomers] = useState<CustomerDetails[]>(SAMPLE_CUSTOMERS);
  const [allEnquiries, setAllEnquiries] = useState<EnquiryDetails[]>(SAMPLE_ENQUIRIES);
  const [allPackages, setAllPackages] = useState<PackageDetails[]>(SAMPLE_PACKAGES);
  
  const [allBillingTypes] = useState<BillingType[]>([]);
  const [allMappings, setAllMappings] = useState<CompanyBillingMapping[]>([]);
  const [allEntityMappings, setAllEntityMappings] = useState<CompanyBusinessEntityMapping[]>([]);
  const [allCompanyLevels] = useState<CompanyLevel[]>([]);

  // Selection state
  const [editingCountry, setEditingCountry] = useState<CountryDetails | null>(null);
  const [viewingCountry, setViewingCountry] = useState<CountryDetails | null>(null);
  const [editingState, setEditingState] = useState<StateDetails | null>(null);
  const [viewingState, setViewingState] = useState<StateDetails | null>(null);
  const [editingCity, setEditingCity] = useState<CityDetails | null>(null);
  const [viewingCity, setViewingCity] = useState<CityDetails | null>(null);
  const [editingDistrict, setEditingDistrict] = useState<DistrictDetails | null>(null);
  const [viewingDistrict, setViewingDistrict] = useState<DistrictDetails | null>(null);
  const [editingArea, setEditingArea] = useState<AreaDetails | null>(null);
  const [viewingArea, setViewingArea] = useState<AreaDetails | null>(null);
  const [editingColony, setEditingColony] = useState<ColonyDetails | null>(null);
  const [viewingColony, setViewingColony] = useState<ColonyDetails | null>(null);
  const [editingCompany, setEditingCompany] = useState<CompanyDetails | null>(null);
  const [viewingCompany, setViewingCompany] = useState<CompanyDetails | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerDetails | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<CustomerDetails | null>(null);
  const [editingEnquiry, setEditingEnquiry] = useState<EnquiryDetails | null>(null);
  const [viewingEnquiry, setViewingEnquiry] = useState<EnquiryDetails | null>(null);
  const [editingPackage, setEditingPackage] = useState<PackageDetails | null>(null);
  const [viewingPackage, setViewingPackage] = useState<PackageDetails | null>(null);
  const [editingMapping, setEditingMapping] = useState<CompanyBillingMapping | null>(null);
  const [viewingMapping, setViewingMapping] = useState<CompanyBillingMapping | null>(null);
  const [editingEntityMapping, setEditingEntityMapping] = useState<CompanyBusinessEntityMapping | null>(null);
  const [viewingEntityMapping, setViewingEntityMapping] = useState<CompanyBusinessEntityMapping | null>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleViewChild = (view: ViewType, data: any) => {
    if (view === 'view-country') setViewingCountry(data);
    if (view === 'view-state') setViewingState(data);
    if (view === 'view-city') setViewingCity(data);
    if (view === 'view-district') setViewingDistrict(data);
    if (view === 'view-area') setViewingArea(data);
    if (view === 'view-colony-details') setViewingColony(data);
    setCurrentView(view);
  };

  // Save Handlers
  const handleSavePackage = (u: PackageDetails) => { setAllPackages(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('packages'); };
  const handleSaveEnquiry = (u: EnquiryDetails) => { setAllEnquiries(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('enquiries'); };
  const handleSaveCustomer = (u: CustomerDetails) => { setAllCustomers(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('customers'); };
  const handleSaveCompany = (u: CompanyDetails) => { setAllCompanies(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('companies'); };
  const handleSaveCountry = (u: CountryDetails) => { setAllCountries(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('countries'); };
  const handleSaveState = (u: StateDetails) => { setAllStates(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('states'); };
  const handleSaveCity = (u: CityDetails) => { setAllCities(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('cities'); };
  const handleSaveDistrict = (u: DistrictDetails) => { setAllDistricts(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('districts'); };
  const handleSaveArea = (u: AreaDetails) => { setAllAreas(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('areas'); };
  const handleSaveColony = (u: ColonyDetails) => { setAllColonies(p => p.map(x => x.id === u.id ? u : x)); setCurrentView('view-colony'); };

  return (
    <div className="flex h-screen w-full flex-col">
      <Header currentView={currentView} onViewChange={setCurrentView} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark relative">
          
          {/* Packages */}
          {currentView === 'packages' && <PackageListPage packages={allPackages} onEdit={p => { setEditingPackage(p); setCurrentView('edit-package'); }} onView={p => { setViewingPackage(p); setCurrentView('view-package'); }} onAdd={() => { setEditingPackage({} as any); setCurrentView('edit-package'); }} onDelete={id => setAllPackages(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-package' && editingPackage && <PackageEditPage data={editingPackage} onSave={handleSavePackage} onCancel={() => setCurrentView('packages')} onNavigate={setCurrentView} />}
          {currentView === 'view-package' && viewingPackage && <PackageDetailsPage packageData={viewingPackage} onEdit={p => { setEditingPackage(p); setCurrentView('edit-package'); }} onNavigate={setCurrentView} />}

          {/* Enquiries */}
          {currentView === 'enquiries' && <EnquiryListPage enquiries={allEnquiries} onEdit={e => { setEditingEnquiry(e); setCurrentView('edit-enquiry'); }} onView={e => { setViewingEnquiry(e); setCurrentView('view-enquiry'); }} onAdd={() => { setEditingEnquiry({} as any); setCurrentView('edit-enquiry'); }} onDelete={id => setAllEnquiries(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-enquiry' && editingEnquiry && <EnquiryEditPage data={editingEnquiry} employees={SAMPLE_EMPLOYEES} onSave={handleSaveEnquiry} onCancel={() => setCurrentView('enquiries')} onNavigate={setCurrentView} />}
          {currentView === 'view-enquiry' && viewingEnquiry && <EnquiryDetailsPage enquiry={viewingEnquiry} employees={SAMPLE_EMPLOYEES} onEdit={e => { setEditingEnquiry(e); setCurrentView('edit-enquiry'); }} onNavigate={setCurrentView} />}

          {/* Customers */}
          {currentView === 'customers' && <CustomerListPage customers={allCustomers} companies={allCompanies} onEdit={c => { setEditingCustomer(c); setCurrentView('edit-customer'); }} onView={c => { setViewingCustomer(c); setCurrentView('view-customer'); }} onAdd={() => { setEditingCustomer({} as any); setCurrentView('edit-customer'); }} onDelete={id => setAllCustomers(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-customer' && editingCustomer && <CustomerEditPage data={editingCustomer} companies={allCompanies} employees={SAMPLE_EMPLOYEES} onSave={handleSaveCustomer} onCancel={() => setCurrentView('customers')} onNavigate={setCurrentView} />}
          {currentView === 'view-customer' && viewingCustomer && <CustomerDetailsPage customer={viewingCustomer} companies={allCompanies} employees={SAMPLE_EMPLOYEES} onEdit={c => { setEditingCustomer(c); setCurrentView('edit-customer'); }} onNavigate={setCurrentView} />}

          {/* Companies */}
          {currentView === 'companies' && <CompanyListPage companies={allCompanies} onEdit={c => { setEditingCompany(c); setCurrentView('edit-company'); }} onView={c => { setViewingCompany(c); setCurrentView('view-company'); }} onAdd={() => { setEditingCompany({} as any); setCurrentView('edit-company'); }} onDelete={id => setAllCompanies(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-company' && editingCompany && <CompanyEditPage data={editingCompany} countries={allCountries} states={allStates} cities={allCities} companies={allCompanies} onSave={handleSaveCompany} onCancel={() => setCurrentView('companies')} onNavigate={setCurrentView} />}

          {/* Geolocation: Countries */}
          {currentView === 'countries' && <CountryListPage countries={allCountries} onEdit={c => { setEditingCountry(c); setCurrentView('edit-country'); }} onView={c => { setViewingCountry(c); setCurrentView('view-country'); }} onAdd={() => { setEditingCountry({} as any); setCurrentView('edit-country'); }} onDelete={id => setAllCountries(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-country' && editingCountry && <CountryEditPage data={editingCountry} allStates={allStates} onSave={handleSaveCountry} onCancel={() => setCurrentView('countries')} onNavigate={setCurrentView} onViewChild={handleViewChild} />}
          {currentView === 'view-country' && viewingCountry && <CountryDetailsPage country={viewingCountry} onEdit={c => { setEditingCountry(c); setCurrentView('edit-country'); }} onNavigate={setCurrentView} />}

          {/* Geolocation: States */}
          {currentView === 'states' && <StateListPage states={allStates} onEdit={s => { setEditingState(s); setCurrentView('edit-state'); }} onView={s => { setViewingState(s); setCurrentView('view-state'); }} onAdd={() => { setEditingState({} as any); setCurrentView('edit-state'); }} onDelete={id => setAllStates(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-state' && editingState && <StateEditPage data={editingState} countries={allCountries} allStates={allStates} onSave={handleSaveState} onCancel={() => setCurrentView('states')} onNavigate={setCurrentView} onViewChild={handleViewChild} />}
          {currentView === 'view-state' && viewingState && <StateDetailsPage state={viewingState} onEdit={s => { setEditingState(s); setCurrentView('edit-state'); }} onNavigate={setCurrentView} />}

          {/* Geolocation: Cities */}
          {currentView === 'cities' && <CityListPage cities={allCities} onEdit={c => { setEditingCity(c); setCurrentView('edit-city'); }} onView={c => { setViewingCity(c); setCurrentView('view-city'); }} onAdd={() => { setEditingCity({} as any); setCurrentView('edit-city'); }} onDelete={id => setAllCities(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-city' && editingCity && <CityEditPage data={editingCity} states={allStates} countries={allCountries} allDistricts={allDistricts} allCities={allCities} onSave={handleSaveCity} onCancel={() => setCurrentView('cities')} onNavigate={setCurrentView} onViewChild={handleViewChild} />}
          {currentView === 'view-city' && viewingCity && <CityDetailsPage city={viewingCity} onEdit={c => { setEditingCity(c); setCurrentView('edit-city'); }} onNavigate={setCurrentView} />}

          {/* Geolocation: Districts */}
          {currentView === 'districts' && <DistrictListPage districts={allDistricts} onEdit={d => { setEditingDistrict(d); setCurrentView('edit-district'); }} onView={d => { setViewingDistrict(d); setCurrentView('view-district'); }} onAdd={() => { setEditingDistrict({} as any); setCurrentView('edit-district'); }} onDelete={id => setAllDistricts(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-district' && editingDistrict && <DistrictEditPage data={editingDistrict} cities={allCities} states={allStates} countries={allCountries} allAreas={allAreas} allDistricts={allDistricts} onSave={handleSaveDistrict} onCancel={() => setCurrentView('districts')} onNavigate={setCurrentView} onViewChild={handleViewChild} />}
          {currentView === 'view-district' && viewingDistrict && <DistrictDetailsPage district={viewingDistrict} onEdit={d => { setEditingDistrict(d); setCurrentView('edit-district'); }} onNavigate={setCurrentView} />}

          {/* Geolocation: Areas */}
          {currentView === 'areas' && <AreaListPage areas={allAreas} onEdit={a => { setEditingArea(a); setCurrentView('edit-area'); }} onView={a => { setViewingArea(a); setCurrentView('view-area'); }} onAdd={() => { setEditingArea({} as any); setCurrentView('edit-area'); }} onDelete={id => setAllAreas(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-area' && editingArea && <AreaEditPage data={editingArea} districts={allDistricts} cities={allCities} states={allStates} countries={allCountries} allAreas={allAreas} allColonies={allColonies} onSave={handleSaveArea} onCancel={() => setCurrentView('areas')} onNavigate={setCurrentView} onViewChild={handleViewChild} />}
          {currentView === 'view-area' && viewingArea && <AreaDetailsPage area={viewingArea} onEdit={a => { setEditingArea(a); setCurrentView('edit-area'); }} onNavigate={setCurrentView} />}

          {/* Geolocation: Colonies */}
          {currentView === 'view-colony' && <ColonyListPage colonies={allColonies} onEdit={c => { setEditingColony(c); setCurrentView('edit-colony'); }} onView={c => { setViewingColony(c); setCurrentView('view-colony-details'); }} onAdd={() => { setEditingColony({} as any); setCurrentView('edit-colony'); }} onDelete={id => setAllColonies(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-colony' && editingColony && <ColonyEditPage data={editingColony} areas={allAreas} districts={allDistricts} cities={allCities} states={allStates} countries={allCountries} onSave={handleSaveColony} onCancel={() => setCurrentView('view-colony')} onNavigate={setCurrentView} />}
          {currentView === 'view-colony-details' && viewingColony && <ColonyDetailsPage colony={viewingColony} onEdit={c => { setEditingColony(c); setCurrentView('edit-colony'); }} onNavigate={setCurrentView} />}

          {/* Configuration */}
          {currentView === 'entity-mapping' && <CompanyBusinessEntityMappingListPage mappings={allEntityMappings} companies={allCompanies} onEdit={m => { setEditingEntityMapping(m); setCurrentView('edit-entity-mapping'); }} onView={m => { setViewingEntityMapping(m); setCurrentView('view-entity-mapping'); }} onAdd={() => { setEditingEntityMapping({} as any); setCurrentView('edit-entity-mapping'); }} onDelete={id => setAllEntityMappings(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-entity-mapping' && editingEntityMapping && <CompanyBusinessEntityMappingEditPage data={editingEntityMapping} companies={allCompanies} onSave={m => { setAllEntityMappings(p => [...p, m]); setCurrentView('entity-mapping'); }} onCancel={() => setCurrentView('entity-mapping')} onNavigate={setCurrentView} />}
          
          {currentView === 'billing-mapping' && <CompanyBillingMappingListPage mappings={allMappings} companies={allCompanies} billingTypes={allBillingTypes} onEdit={m => { setEditingMapping(m); setCurrentView('edit-billing-mapping'); }} onView={m => { setViewingMapping(m); setCurrentView('view-billing-mapping'); }} onAdd={() => { setEditingMapping({} as any); setCurrentView('edit-billing-mapping'); }} onDelete={id => setAllMappings(p => p.filter(x => x.id !== id))} onNavigate={setCurrentView} />}
          {currentView === 'edit-billing-mapping' && editingMapping && <CompanyBillingMappingEditPage data={editingMapping} companies={allCompanies} billingTypes={allBillingTypes} onSave={m => { setAllMappings(p => [...p, m]); setCurrentView('billing-mapping'); }} onCancel={() => setCurrentView('billing-mapping')} onNavigate={setCurrentView} />}
          
          {currentView === 'company-level-mapping' && <CompanyLevelMappingPage companies={allCompanies} levels={allCompanyLevels} onNavigate={setCurrentView} />}
          {currentView === 'billing-types' && <BillingTypeListPage billingTypes={allBillingTypes} onEdit={() => {}} onView={() => {}} onAdd={() => {}} onDelete={() => {}} onNavigate={setCurrentView} />}
          {currentView === 'company-levels' && <CompanyLevelListPage levels={allCompanyLevels} onEdit={() => {}} onView={() => {}} onAdd={() => {}} onDelete={() => {}} onNavigate={setCurrentView} />}

          {/* Dashboard / Settings Fallback */}
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
