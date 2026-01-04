
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

  if (currentView === 'billing-mapping' || currentView === 'edit-billing-mapping' || currentView === 'view-billing-mapping' || currentView === 'billing-types' || currentView === 'edit-billing-type' || currentView === 'view-billing-type' || currentView === 'company-levels' || currentView === 'edit-company-level' || currentView === 'view-company-level' || currentView === 'company-level-mapping' || currentView === 'entity-mapping' || currentView === 'edit-entity-mapping' || currentView === 'view-entity-mapping') {
    items.push({ label: 'Configuration', view: 'dashboard' as ViewType });
    // ... sub items
  }

  // Handle Customers
  if (currentView === 'customers' || currentView === 'edit-customer' || currentView === 'view-customer') {
    items.push({ label: 'Entities', view: 'dashboard' as ViewType });
    items.push({ label: 'Customers', view: 'customers' as ViewType });
    if (currentView === 'edit-customer') items.push({ label: 'Edit Profile', view: 'edit-customer' as ViewType });
    if (currentView === 'view-customer') items.push({ label: 'View Profile', view: 'view-customer' as ViewType });
  } else if (currentView === 'billing-mapping' || currentView === 'edit-billing-mapping' || currentView === 'view-billing-mapping' || currentView === 'billing-types' || currentView === 'edit-billing-type' || currentView === 'view-billing-type' || currentView === 'company-levels' || currentView === 'edit-company-level' || currentView === 'view-company-level' || currentView === 'company-level-mapping' || currentView === 'entity-mapping' || currentView === 'edit-entity-mapping' || currentView === 'view-entity-mapping') {
    items.push({ label: 'Configuration', view: 'dashboard' as ViewType });
    
    if (currentView === 'billing-mapping' || currentView === 'edit-billing-mapping' || currentView === 'view-billing-mapping') {
      items.push({ label: 'Company Billing Configuration', view: 'billing-mapping' as ViewType });
      if (currentView === 'edit-billing-mapping') items.push({ label: 'Edit Mapping', view: 'edit-billing-mapping' as ViewType });
      if (currentView === 'view-billing-mapping') items.push({ label: 'View Mapping', view: 'view-billing-mapping' as ViewType });
    }

    if (currentView === 'entity-mapping' || currentView === 'edit-entity-mapping' || currentView === 'view-entity-mapping') {
      items.push({ label: 'Entity Mapping', view: 'entity-mapping' as ViewType });
      if (currentView === 'edit-entity-mapping') items.push({ label: 'Edit Mapping', view: 'edit-entity-mapping' as ViewType });
      if (currentView === 'view-entity-mapping') items.push({ label: 'View Mapping', view: 'view-entity-mapping' as ViewType });
    }
    
    if (currentView === 'billing-types' || currentView === 'edit-billing-type' || currentView === 'view-billing-type') {
      items.push({ label: 'Billing Types', view: 'billing-types' as ViewType });
      if (currentView === 'edit-billing-type') items.push({ label: 'Edit Type', view: 'edit-billing-type' as ViewType });
      if (currentView === 'view-billing-type') items.push({ label: 'View Type', view: 'view-billing-type' as ViewType });
    }

    if (currentView === 'company-levels' || currentView === 'edit-company-level' || currentView === 'view-company-level') {
      items.push({ label: 'Company Levels', view: 'company-levels' as ViewType });
      if (currentView === 'edit-company-level') items.push({ label: 'Edit Level', view: 'edit-company-level' as ViewType });
      if (currentView === 'view-company-level') items.push({ label: 'View Level', view: 'view-company-level' as ViewType });
    }

    if (currentView === 'company-level-mapping') {
      items.push({ label: 'Company Business Entity mapping', view: 'company-level-mapping' as ViewType });
    }
    
  } else if (currentView === 'states' || currentView === 'edit-state' || currentView === 'view-state') {
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
  } else if (currentView === 'companies' || currentView === 'edit-company' || currentView === 'view-company') {
    items.push({ label: 'Entities', view: 'dashboard' as ViewType });
    items.push({ label: 'Companies', view: 'companies' as ViewType });
    if (currentView === 'edit-company') items.push({ label: 'Edit Company', view: 'edit-company' as ViewType });
    if (currentView === 'view-company') items.push({ label: 'View Company', view: 'view-company' as ViewType });
  } else if (currentView === 'settings') {
    items.push({ label: 'Settings', view: 'settings' as ViewType });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-[#617589] dark:text-gray-400 py-2">
      {items.map((item, index) => (
        <React.Fragment key={item.label + index}>
          {index > 0 && (
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          )}
          {index === items.length - 1 ? (
            <span className="text-primary font-medium">
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
