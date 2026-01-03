
import React from 'react';
import { ViewType } from '../types';

interface BreadcrumbsProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentView, onNavigate }) => {
  const items = [
    { label: 'Home', view: 'dashboard' as ViewType },
  ];

  if (currentView === 'states' || currentView === 'edit-state' || currentView === 'view-state') {
    items.push({ label: 'States', view: 'states' as ViewType });
    if (currentView === 'edit-state') items.push({ label: 'Edit State', view: 'edit-state' as ViewType });
    if (currentView === 'view-state') items.push({ label: 'View State', view: 'view-state' as ViewType });
  } else if (currentView === 'countries' || currentView === 'edit-country' || currentView === 'view-country') {
    items.push({ label: 'Countries', view: 'countries' as ViewType });
    if (currentView === 'edit-country') items.push({ label: 'Edit Country', view: 'edit-country' as ViewType });
    if (currentView === 'view-country') items.push({ label: 'View Country', view: 'view-country' as ViewType });
  } else if (currentView === 'cities' || currentView === 'edit-city' || currentView === 'view-city') {
    items.push({ label: 'Cities', view: 'cities' as ViewType });
    if (currentView === 'edit-city') items.push({ label: 'Edit City', view: 'edit-city' as ViewType });
    if (currentView === 'view-city') items.push({ label: 'View City', view: 'view-city' as ViewType });
  } else if (currentView === 'districts' || currentView === 'edit-district' || currentView === 'view-district') {
    items.push({ label: 'Districts', view: 'districts' as ViewType });
    if (currentView === 'edit-district') items.push({ label: 'Edit District', view: 'edit-district' as ViewType });
    if (currentView === 'view-district') items.push({ label: 'View District', view: 'view-district' as ViewType });
  } else if (currentView === 'areas' || currentView === 'edit-area' || currentView === 'view-area') {
    items.push({ label: 'Areas', view: 'areas' as ViewType });
    if (currentView === 'edit-area') items.push({ label: 'Edit Area', view: 'edit-area' as ViewType });
    if (currentView === 'view-area') items.push({ label: 'Area Details', view: 'view-area' as ViewType });
  } else if (currentView === 'view-colony' || currentView === 'edit-colony' || currentView === 'view-colony-details') {
    items.push({ label: 'Colonies', view: 'view-colony' as ViewType });
    if (currentView === 'edit-colony') items.push({ label: 'Edit Colony', view: 'edit-colony' as ViewType });
    if (currentView === 'view-colony-details') items.push({ label: 'Colony Details', view: 'view-colony-details' as ViewType });
  } else if (currentView === 'settings') {
    items.push({ label: 'Settings', view: 'settings' as ViewType });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-[#617589] dark:text-gray-400 py-2">
      {items.map((item, index) => (
        <React.Fragment key={item.view + index}>
          {index > 0 && (
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          )}
          {index === items.length - 1 ? (
            <span className="text-[#111418] dark:text-white font-medium">
              {item.label}
            </span>
          ) : (
            <button
              onClick={() => onNavigate(item.view)}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
