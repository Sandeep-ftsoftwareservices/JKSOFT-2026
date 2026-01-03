
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
import { ViewType, StateDetails, CountryDetails, CityDetails, DistrictDetails, AreaDetails, ColonyDetails } from './types';

const SAMPLE_AUDIT = {
  createdBy: 'Admin User',
  createdDate: 'Oct 24, 2023 10:30 AM',
  updatedBy: 'System Admin',
  updatedDate: 'Nov 01, 2023 04:15 PM'
};

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
  { id: 'col-01', fullName: 'Sunrise Apartments', shortName: 'SAP', area: 'GWH', district: 'CBD', city: 'SF', state: 'CA', country: 'US', isActive: true, audit: SAMPLE_AUDIT, history: [] },
  { id: 'col-02', fullName: 'Ocean View Residency', shortName: 'OVR', area: 'GWH', district: 'CBD', city: 'SF', state: 'CA', country: 'US', isActive: true, audit: SAMPLE_AUDIT, history: [] }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('areas');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lists
  const [allCountries] = useState<CountryDetails[]>(SAMPLE_COUNTRIES);
  const [allStates, setAllStates] = useState<StateDetails[]>(SAMPLE_STATES);
  const [allCities, setAllCities] = useState<CityDetails[]>(SAMPLE_CITIES);
  const [allDistricts, setAllDistricts] = useState<DistrictDetails[]>(SAMPLE_DISTRICTS);
  const [allAreas, setAllAreas] = useState<AreaDetails[]>(SAMPLE_AREAS);
  const [allColonies, setAllColonies] = useState<ColonyDetails[]>(SAMPLE_COLONIES);

  // Selected for edit/view
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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSaveColony = (updatedData: ColonyDetails) => {
    setAllColonies(prev => {
      const exists = prev.find(c => c.id === updatedData.id);
      if (exists) return prev.map(c => c.id === updatedData.id ? updatedData : c);
      return [...prev, { ...updatedData, id: Math.random().toString(36).substr(2, 9) }];
    });
    alert('Colony saved successfully!');
    setCurrentView('view-colony');
  };

  const handleEditColony = (colony: ColonyDetails) => {
    setEditingColony(colony);
    setCurrentView('edit-colony');
  };

  // Fix: handleViewColony now correctly sets currentView to 'view-colony-details'
  const handleViewColony = (colony: ColonyDetails) => {
    setViewingColony(colony);
    setCurrentView('view-colony-details');
  };

  const handleAddColony = () => {
    setEditingColony({
      id: '', fullName: '', shortName: '', area: '', district: '', city: '', state: '', country: '', isActive: true,
      audit: { createdBy: 'Admin User', createdDate: new Date().toLocaleString(), updatedBy: 'Admin User', updatedDate: new Date().toLocaleString() },
      history: []
    });
    setCurrentView('edit-colony');
  };

  const handleDeleteColony = (id: string) => { if (confirm('Delete colony?')) setAllColonies(prev => prev.filter(c => c.id !== id)); };

  const handleSaveArea = (updatedData: AreaDetails) => {
    setAllAreas(prev => {
      const exists = prev.find(a => a.id === updatedData.id);
      if (exists) return prev.map(a => a.id === updatedData.id ? updatedData : a);
      return [...prev, { ...updatedData, id: Math.random().toString(36).substr(2, 9) }];
    });
    alert('Area saved successfully!');
    setCurrentView('areas');
  };

  const handleEditArea = (area: AreaDetails) => {
    setEditingArea(area);
    setCurrentView('edit-area');
  };

  const handleViewArea = (area: AreaDetails) => {
    setViewingArea(area);
    setCurrentView('view-area');
  };

  const handleAddArea = () => {
    setEditingArea({
      id: '', fullName: '', shortName: '', pinCode: '', district: '', city: '', state: '', country: '', isActive: true,
      audit: { createdBy: 'Admin User', createdDate: new Date().toLocaleString(), updatedBy: 'Admin User', updatedDate: new Date().toLocaleString() },
      history: []
    });
    setCurrentView('edit-area');
  };

  const handleDeleteArea = (id: string) => { if (confirm('Delete area?')) setAllAreas(prev => prev.filter(a => a.id !== id)); };

  // Fix: handleViewChild now handles 'view-colony-details' to update colony details state
  const handleViewChild = (view: ViewType, data: any) => {
    if (view === 'view-state') setViewingState(data);
    if (view === 'view-city') setViewingCity(data);
    if (view === 'view-district') setViewingDistrict(data);
    if (view === 'view-area') setViewingArea(data);
    if (view === 'view-colony-details') setViewingColony(data);
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark relative">
          {currentView === 'areas' && (
            <AreaListPage areas={allAreas} onEdit={handleEditArea} onView={handleViewArea} onAdd={handleAddArea} onDelete={handleDeleteArea} onNavigate={setCurrentView} />
          )}
          {currentView === 'edit-area' && editingArea && (
            <AreaEditPage 
              data={editingArea} 
              districts={allDistricts} 
              cities={allCities} 
              states={allStates} 
              countries={allCountries} 
              allAreas={allAreas}
              allColonies={allColonies}
              onSave={handleSaveArea} 
              onCancel={() => setCurrentView('areas')} 
              onNavigate={setCurrentView} 
              onViewChild={handleViewChild}
            />
          )}
          {currentView === 'view-area' && viewingArea && (
            <AreaDetailsPage area={viewingArea} onNavigate={setCurrentView} onEdit={handleEditArea} />
          )}

          {currentView === 'view-colony' && (
            <ColonyListPage colonies={allColonies} onEdit={handleEditColony} onView={handleViewColony} onAdd={handleAddColony} onDelete={handleDeleteColony} onNavigate={setCurrentView} />
          )}
          {currentView === 'edit-colony' && editingColony && (
            <ColonyEditPage 
              data={editingColony} 
              areas={allAreas}
              districts={allDistricts}
              cities={allCities}
              states={allStates}
              countries={allCountries}
              onSave={handleSaveColony}
              onCancel={() => setCurrentView('view-colony')}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === 'view-colony-details' && viewingColony && (
            <ColonyDetailsPage colony={viewingColony} onNavigate={setCurrentView} onEdit={handleEditColony} />
          )}

          {currentView === 'countries' && (
            <CountryListPage countries={allCountries} onEdit={(c) => { setEditingCountry(c); setCurrentView('edit-country'); }} onView={(c) => { setViewingCountry(c); setCurrentView('view-country'); }} onAdd={() => setCurrentView('edit-country')} onDelete={() => {}} onNavigate={setCurrentView} />
          )}
          {currentView === 'view-country' && viewingCountry && (
            <CountryDetailsPage country={viewingCountry} onNavigate={setCurrentView} onEdit={(c) => { setEditingCountry(c); setCurrentView('edit-country'); }} />
          )}
          {currentView === 'edit-country' && editingCountry && (
            <CountryEditPage 
              data={editingCountry} 
              allStates={allStates}
              onSave={(c) => setCurrentView('countries')} 
              onCancel={() => setCurrentView('countries')} 
              onNavigate={setCurrentView} 
              onViewChild={handleViewChild}
            />
          )}

          {currentView === 'states' && (
            <StateListPage states={allStates} onEdit={(s) => { setEditingState(s); setCurrentView('edit-state'); }} onView={(s) => { setViewingState(s); setCurrentView('view-state'); }} onAdd={() => setCurrentView('edit-state')} onDelete={() => {}} onNavigate={setCurrentView} />
          )}
          {currentView === 'view-state' && viewingState && (
            <StateDetailsPage state={viewingState} onNavigate={setCurrentView} onEdit={(s) => { setEditingState(s); setCurrentView('edit-state'); }} />
          )}
          {currentView === 'edit-state' && editingState && (
            <StateEditPage 
              data={editingState} 
              onSave={(s) => { setAllStates(prev => prev.map(old => old.id === s.id ? s : old)); setCurrentView('states'); }} 
              onCancel={() => setCurrentView('states')} 
              onNavigate={setCurrentView} 
              countries={allCountries} 
              allStates={allStates} 
              onViewChild={handleViewChild}
            />
          )}

          {currentView === 'cities' && (
            <CityListPage cities={allCities} onEdit={(c) => { setEditingCity(c); setCurrentView('edit-city'); }} onView={(c) => { setViewingCity(c); setCurrentView('view-city'); }} onAdd={() => setCurrentView('edit-city')} onDelete={() => {}} onNavigate={setCurrentView} />
          )}
          {currentView === 'view-city' && viewingCity && (
            <CityDetailsPage city={viewingCity} onNavigate={setCurrentView} onEdit={(c) => { setEditingCity(c); setCurrentView('edit-city'); }} />
          )}
          {currentView === 'edit-city' && editingCity && (
            <CityEditPage 
              data={editingCity} 
              states={allStates} 
              countries={allCountries} 
              allDistricts={allDistricts}
              allCities={allCities} 
              onSave={(c) => { setAllCities(prev => prev.map(old => old.id === c.id ? c : old)); setCurrentView('cities'); }} 
              onCancel={() => setCurrentView('cities')} 
              onNavigate={setCurrentView} 
              onViewChild={handleViewChild}
            />
          )}

          {currentView === 'districts' && (
            <DistrictListPage districts={allDistricts} onEdit={(d) => { setEditingDistrict(d); setCurrentView('edit-district'); }} onView={(d) => { setViewingDistrict(d); setCurrentView('view-district'); }} onAdd={() => setCurrentView('edit-district')} onDelete={() => {}} onNavigate={setCurrentView} />
          )}
          {currentView === 'view-district' && viewingDistrict && (
            <DistrictDetailsPage district={viewingDistrict} onNavigate={setCurrentView} onEdit={(d) => { setEditingDistrict(d); setCurrentView('edit-district'); }} />
          )}
          {currentView === 'edit-district' && editingDistrict && (
            <DistrictEditPage 
              data={editingDistrict} 
              cities={allCities} 
              states={allStates} 
              countries={allCountries} 
              allAreas={allAreas}
              allDistricts={allDistricts} 
              onSave={(d) => { setAllDistricts(prev => prev.map(old => old.id === d.id ? d : old)); setCurrentView('districts'); }} 
              onCancel={() => setCurrentView('districts')} 
              onNavigate={setCurrentView} 
              onViewChild={handleViewChild}
            />
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
