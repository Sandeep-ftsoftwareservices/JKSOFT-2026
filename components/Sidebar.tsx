
import React, { useState } from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const [isGeolocationExpanded, setIsGeolocationExpanded] = useState(true);
  const [isEntityExpanded, setIsEntityExpanded] = useState(false);

  const topNavItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: 'dashboard' },
  ];

  const entityItems: { id: ViewType; label: string; icon: string }[] = [
    // Future entity modules will be listed here
  ];

  const geolocationItems = [
    { id: 'countries' as ViewType, label: 'Countries', icon: 'flag' },
    { id: 'states' as ViewType, label: 'States', icon: 'map' },
    { id: 'cities' as ViewType, label: 'Cities', icon: 'location_city' },
    { id: 'districts' as ViewType, label: 'Districts', icon: 'explore' },
    { id: 'areas' as ViewType, label: 'Areas', icon: 'apartment' },
    { id: 'view-colony' as ViewType, label: 'Colonies', icon: 'holiday_village' },
  ];

  const isActive = (itemId: ViewType) => {
    if (currentView === itemId) return true;
    if (itemId === 'states' && (currentView === 'edit-state' || currentView === 'view-state')) return true;
    if (itemId === 'countries' && (currentView === 'edit-country' || currentView === 'view-country')) return true;
    if (itemId === 'cities' && (currentView === 'edit-city' || currentView === 'view-city')) return true;
    if (itemId === 'districts' && (currentView === 'edit-district' || currentView === 'view-district')) return true;
    if (itemId === 'areas' && (currentView === 'edit-area' || currentView === 'view-area')) return true;
    if (itemId === 'view-colony' && (currentView === 'edit-colony' || currentView === 'view-colony-details')) return true;
    return false;
  };

  const handleNavClick = (view: ViewType) => {
    onViewChange(view);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const NavButton = ({ item }: { item: { id: ViewType; label: string; icon: string } }) => {
    const active = isActive(item.id);
    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item.id)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group w-full text-left ${
          active
            ? 'bg-primary/10 text-primary font-bold shadow-sm'
            : 'text-[#617589] dark:text-gray-400 hover:bg-background-light dark:hover:bg-gray-800/50 hover:text-[#111418] dark:hover:text-white'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] transition-colors ${active ? 'text-primary' : 'group-hover:text-primary'}`}>
          {item.icon}
        </span>
        <span className="text-sm tracking-tight">{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-surface-dark border-r border-[#f0f2f4] dark:border-gray-800 
        transform transition-all duration-300 ease-in-out flex flex-col justify-between overflow-y-auto
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col p-4 gap-6">
          <div className="flex flex-col px-3">
            <h1 className="text-base font-bold leading-normal text-primary uppercase tracking-wider">Master Data</h1>
            <p className="text-[#617589] dark:text-gray-400 text-[10px] font-medium leading-normal mt-1 uppercase tracking-tighter">Geographic Management System</p>
          </div>
          
          <nav className="flex flex-col gap-6">
            {/* Top Level Items */}
            <div className="flex flex-col gap-1.5">
              {topNavItems.map((item) => (
                <NavButton key={item.id} item={item} />
              ))}
            </div>

            {/* Entity Group */}
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => setIsEntityExpanded(!isEntityExpanded)}
                className="flex items-center justify-between px-3 mb-1 w-full text-left group/entity transition-colors outline-none"
              >
                <span className="text-[11px] font-bold text-[#617589] dark:text-gray-500 uppercase tracking-[0.1em] group-hover/entity:text-primary">Entity</span>
                <span className={`material-symbols-outlined text-[18px] text-[#617589] transition-transform duration-300 ${isEntityExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              
              <div className={`flex flex-col gap-1 transition-all duration-300 overflow-hidden ${isEntityExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {entityItems.map((item) => (
                  <NavButton key={item.id} item={item} />
                ))}
                {entityItems.length === 0 && (
                  <div className="px-3 py-2 text-[10px] text-gray-400 italic">No modules assigned</div>
                )}
              </div>
            </div>

            {/* Geolocation Group */}
            <div className="flex flex-col gap-1.5">
              <button 
                onClick={() => setIsGeolocationExpanded(!isGeolocationExpanded)}
                className="flex items-center justify-between px-3 mb-1 w-full text-left group/geo transition-colors outline-none"
              >
                <span className="text-[11px] font-bold text-[#617589] dark:text-gray-500 uppercase tracking-[0.1em] group-hover/geo:text-primary">Geolocation</span>
                <span className={`material-symbols-outlined text-[18px] text-[#617589] transition-transform duration-300 ${isGeolocationExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              
              <div className={`flex flex-col gap-1 transition-all duration-300 overflow-hidden ${isGeolocationExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {geolocationItems.map((item) => (
                  <NavButton key={item.id} item={item} />
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-[#f0f2f4] dark:border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-[#617589] dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all group">
            <span className="material-symbols-outlined text-[22px] group-hover:rotate-12 transition-transform">logout</span>
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
