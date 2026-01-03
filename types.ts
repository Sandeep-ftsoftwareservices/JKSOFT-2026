
export interface AuditInfo {
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

export interface AuditHistoryEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface StateDetails {
  id: string;
  fullName: string;
  shortName: string;
  stateCode: string;
  country: string;
  gstCode: string;
  stdCode: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface CountryDetails {
  id: string;
  fullName: string;
  shortName: string;
  code: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface CityDetails {
  id: string;
  fullName: string;
  shortName: string;
  cityCode: string;
  state: string; // state shortName
  country: string; // country shortName
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface DistrictDetails {
  id: string;
  fullName: string;
  shortName: string;
  city: string; // city shortName or ID
  state: string; // state shortName
  country: string; // country shortName
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface AreaDetails {
  id: string;
  fullName: string;
  shortName: string;
  pinCode: string;
  district: string; // district shortName or ID
  city: string; // city shortName or ID
  state: string; // state shortName
  country: string; // country shortName
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface ColonyDetails {
  id: string;
  fullName: string;
  shortName: string;
  area: string; // area shortName
  district: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export type ViewType = 
  | 'dashboard' 
  | 'states' 
  | 'countries' 
  | 'cities' 
  | 'districts' 
  | 'areas' 
  | 'settings' 
  | 'edit-state' | 'view-state'
  | 'edit-country' | 'view-country'
  | 'edit-city' | 'view-city'
  | 'edit-district' | 'view-district'
  | 'edit-area' | 'view-area'
  | 'view-colony' | 'edit-colony' | 'view-colony-details';
