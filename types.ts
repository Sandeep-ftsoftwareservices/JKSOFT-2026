
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

export interface AddressInfo {
  id: string;
  type: 'Installation' | 'Billing' | 'Shipping';
  isPrimary: boolean;
  addressLine: string;
  district: string;
  area: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  status: 'Active' | 'Inactive';
}

export interface ContactInfo {
  id: string;
  label: string;
  value: string;
  type: 'Mobile' | 'Email' | 'Telephone' | 'WhatsApp';
  isPrimary: boolean;
}

export interface CustomerDetails {
  id: string;
  accountNo: string;
  installationDate: string;
  salutation: string;
  firstName: string;
  middleName: string;
  lastName: string;
  subscriberType: 'Residential' | 'Commercial' | 'Corporate';
  companyId: string;
  connectionType: 'Fiber Optic' | 'Cable' | 'Wireless';
  gstMode: 'Included' | 'Excluded';
  remark: string;
  gstNo: string;
  panNo: string;
  aadhaarNo: string;
  msoNo: string;
  status: 'Active' | 'Suspended' | 'Terminated' | 'New Lead';
  isActiveProfile: boolean;
  technicalInChargeId: string;
  collectionInChargeId: string;
  addresses: AddressInfo[];
  contacts: ContactInfo[];
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface EnquiryDetails {
  id: string;
  enquiryNo: string;
  customerName: string;
  mobileNo: string;
  email: string;
  date: string;
  status: 'New' | 'In Progress' | 'Closed';
  subject: string;
  message: string;
  assignedTo?: string;
  audit: AuditInfo;
}

export interface PackageChannel {
  id: string;
  name: string;
  category: string;
  language: string;
}

export interface PackageDetails {
  id: string;
  name: string;
  shortName: string;
  grade: string;
  description: string;
  serviceCategory: 'Cable TV' | 'Broadband Internet' | 'IPTV';
  msoBroadcaster: string;
  creationDate: string;
  inactiveFrom?: string;
  isTaxInclusive: boolean;
  baseRate: number;
  taxPercentage: number;
  totalAmount: number;
  drp: number;
  mrp: number;
  isActive: boolean;
  channels: PackageChannel[];
  associations: {
    activeCustomers: number;
    pendingEnquiries: number;
  };
  audit: AuditInfo;
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
  state: string; 
  country: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface DistrictDetails {
  id: string;
  fullName: string;
  shortName: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface AreaDetails {
  id: string;
  fullName: string;
  shortName: string;
  pinCode: string;
  district: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface ColonyDetails {
  id: string;
  fullName: string;
  shortName: string;
  area: string;
  district: string;
  city: string;
  state: string;
  country: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface CompanyDetails {
  id: string;
  fullName: string;
  shortName: string;
  level: 'Parent' | 'Subsidiary' | 'Branch';
  parentCompanyId?: string;
  status: 'Active' | 'Inactive' | 'Pending Dissolution';
  cinNo: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  pinCode: string;
  country: string;
  state: string;
  city: string;
  email: string;
  mobile: string;
  telephone: string;
  whatsapp: string;
  ownerName: string;
  ownerContact: string;
  ownerEmail: string;
  currency: string;
  fyStart: string;
  gstMode: 'Regular' | 'Composition';
  gstNo: string;
  gstRegDate: string;
  panNo: string;
  tinNo: string;
  licenceNo: string;
  licenceExpiryFrom: string;
  licenceExpiryTo: string;
  primaryBank: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface BillingType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  audit: AuditInfo;
}

export interface CompanyBillingMapping {
  id: string;
  companyId: string;
  billingTypeIds: string[];
  isActive: boolean;
  isDeleted: boolean;
  audit: AuditInfo;
}

export interface CompanyBusinessEntityMapping {
  id: string;
  companyId: string;
  businessEntityIds: string[];
  isActive: boolean;
  isDeleted: boolean;
  audit: AuditInfo;
}

export interface CompanyLevel {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  audit: AuditInfo;
  history?: AuditHistoryEntry[];
}

export interface CompanyLevelMapping {
  entityId: string;
  levelIds: string[];
  isActive: boolean;
  isDeleted: boolean;
  audit: AuditInfo;
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
  | 'view-colony' | 'edit-colony' | 'view-colony-details'
  | 'companies' | 'edit-company' | 'view-company'
  | 'billing-mapping' | 'edit-billing-mapping' | 'view-billing-mapping'
  | 'billing-types' | 'edit-billing-type' | 'view-billing-type'
  | 'company-levels' | 'edit-company-level' | 'view-company-level' | 'company-level-mapping'
  | 'entity-mapping' | 'edit-entity-mapping' | 'view-entity-mapping'
  | 'customers' | 'edit-customer' | 'view-customer'
  | 'enquiries' | 'edit-enquiry' | 'view-enquiry'
  | 'packages' | 'edit-package' | 'view-package';
