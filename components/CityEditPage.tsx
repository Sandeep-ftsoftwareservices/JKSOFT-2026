
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CityDetails, DistrictDetails, StateDetails, CountryDetails, ViewType, AuditHistoryEntry } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface CityEditPageProps {
  data: CityDetails;
  states: StateDetails[];
  countries: CountryDetails[];
  allDistricts: DistrictDetails[];
  allCities: CityDetails[];
  onSave: (data: CityDetails) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
  onViewChild: (view: ViewType, data: any) => void;
}

interface ValidationErrors {
  fullName?: string;
  shortName?: string;
  cityCode?: string;
  state?: string;
  country?: string;
}

const FieldTooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-50 pointer-events-none">
    <div className="bg-[#111418]/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-[#111418] text-[11px] font-semibold px-3 py-2 rounded-lg shadow-xl whitespace-nowrap border border-white/10 dark:border-black/5 animate-in fade-in zoom-in duration-200">
      {text}
      <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-[#111418]/90 dark:border-t-white/90"></div>
    </div>
  </div>
);

const LabelWithInfo: React.FC<{ label: string; required?: boolean; tooltip: string; extra?: React.ReactNode }> = ({ label, required, tooltip, extra }) => (
  <div className="flex items-center justify-between min-h-[28px] mb-2">
    <div className="flex items-center gap-1.5 group relative">
      <p className="text-[#111418] dark:text-gray-200 text-sm font-medium flex items-center">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <span className="material-symbols-outlined text-[18px] text-[#617589] dark:text-gray-400 flex items-center cursor-help">info</span>
      <FieldTooltip text={tooltip} />
    </div>
    {extra}
  </div>
);

export const CityEditPage: React.FC<CityEditPageProps> = ({ data, states, countries, allDistricts, allCities, onSave, onCancel, onNavigate, onViewChild }) => {
  const [formData, setFormData] = useState<CityDetails>(data);
  const [localAllDistricts, setLocalAllDistricts] = useState<DistrictDetails[]>(allDistricts);
  const [linkSearch, setLinkSearch] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const stateDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target as Node)) {
        setIsStateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Children: Districts mapped to this City
  const associatedDistricts = useMemo(() => {
    return localAllDistricts.filter(d => d.city === formData.shortName);
  }, [localAllDistricts, formData.shortName]);

  // Districts available to link (not already in this city)
  const availableToLink = useMemo(() => {
    if (!linkSearch.trim()) return [];
    const query = linkSearch.toLowerCase();
    return localAllDistricts.filter(d => 
      d.city !== formData.shortName && 
      (d.fullName.toLowerCase().includes(query) || d.shortName.toLowerCase().includes(query))
    );
  }, [localAllDistricts, formData.shortName, linkSearch]);

  const handleLink = (districtId: string) => {
    const districtToLink = localAllDistricts.find(d => d.id === districtId);
    if (districtToLink) {
      setLocalAllDistricts(prev => prev.map(d => 
        d.id === districtId ? { ...d, city: formData.shortName, state: formData.state, country: formData.country } : d
      ));
      setFeedbackMessage(`Linked district "${districtToLink.fullName}" to ${formData.fullName}`);
      setLinkSearch('');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleUnlink = (id: string) => {
    setLocalAllDistricts(prev => prev.map(d => 
      d.id === id ? { ...d, city: '' } : d
    ));
  };

  const isAlphanumeric = (val: string) => /^[a-zA-Z0-9]*$/.test(val);
  const isCityCodeValid = formData.cityCode.length >= 2 && isAlphanumeric(formData.cityCode);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full city name is required';
    if (!formData.shortName.trim()) newErrors.shortName = 'Short name is required';
    if (!formData.cityCode.trim()) {
      newErrors.cityCode = 'City code is required';
    } else if (!isAlphanumeric(formData.cityCode)) {
      newErrors.cityCode = 'City code must be alphanumeric (letters and numbers only)';
    }
    if (!formData.country) newErrors.country = 'Please select a country';
    if (!formData.state) newErrors.state = 'Please select a state';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'cityCode') {
      newValue = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof ValidationErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCountrySelect = (countryShortName: string) => {
    setFormData(prev => ({ 
      ...prev, 
      country: countryShortName,
      state: '' 
    }));
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
    if (errors.country) setErrors(prev => ({ ...prev, country: undefined }));
  };

  const handleStateSelect = (stateShortName: string) => {
    setFormData(prev => ({ ...prev, state: stateShortName }));
    setIsStateDropdownOpen(false);
    setStateSearch('');
    if (errors.state) setErrors(prev => ({ ...prev, state: undefined }));
  };

  const getActionStyles = (action: string) => {
    const lowAction = action.toLowerCase();
    if (lowAction.includes('created')) return { icon: 'add_circle', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (lowAction.includes('updated') || lowAction.includes('modified')) return { icon: 'edit', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    if (lowAction.includes('status') || lowAction.includes('active') || lowAction.includes('deactivated')) return { icon: 'published_with_changes', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    return { icon: 'event_note', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' };
  };

  const filteredHistory = useMemo(() => {
    if (!formData.history) return [];
    if (!historySearch.trim()) return formData.history;
    const query = historySearch.toLowerCase();
    return formData.history.filter(entry => 
      entry.action.toLowerCase().includes(query) ||
      entry.user.toLowerCase().includes(query) ||
      (entry.details && entry.details.toLowerCase().includes(query))
    );
  }, [formData.history, historySearch]);

  const handleToggleChange = () => setFormData(prev => ({ ...prev, isActive: !prev.isActive }));
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (validate()) onSave(formData); };

  const filteredCountries = useMemo(() => countries.filter(c => 
    c.fullName.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.shortName.toLowerCase().includes(countrySearch.toLowerCase())
  ), [countries, countrySearch]);

  const filteredStates = useMemo(() => states.filter(s => 
    (!formData.country || s.country === formData.country) &&
    (s.fullName.toLowerCase().includes(stateSearch.toLowerCase()) || 
     s.shortName.toLowerCase().includes(stateSearch.toLowerCase()))
  ), [states, stateSearch, formData.country]);

  const getInputClasses = (error?: string, isValid?: boolean) => {
    const base = "form-input flex w-full min-w-0 flex-1 rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-2 h-14 placeholder:text-[#617589] dark:placeholder:text-gray-500 p-[15px] text-base font-normal transition-all bg-white dark:bg-[#25323e]";
    if (error) return `${base} border-red-500 focus:ring-red-500/20 focus:border-red-500 ring-1 ring-red-500/10`;
    if (isValid) return `${base} border-green-500 focus:ring-green-500/20 focus:border-green-500 ring-1 ring-green-500/10`;
    return `${base} border-[#dbe0e6] dark:border-[#3e4c5a] focus:ring-primary/20 focus:border-primary`;
  };

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="edit-city" onNavigate={onNavigate} />
        <div className="flex flex-wrap justify-between gap-3 px-4 pb-2 border-b border-[#f0f2f4] dark:border-slate-800 mb-6">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white tracking-light text-[32px] font-bold leading-tight">Edit City</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">View and manage city information and status.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-4 space-y-8 mb-12">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#dbe0e6] dark:border-[#2e3b4b] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/20">
              <h3 className="text-base font-semibold text-[#111418] dark:text-white">General Information</h3>
            </div>
            <div className="p-6 md:p-8 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <LabelWithInfo label="Full Name" required tooltip="The official full name of the city. Required." />
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} className={getInputClasses(errors.fullName)} placeholder="e.g. San Francisco" />
                  <div className="flex justify-between items-center mt-1">
                    {errors.fullName && <p className="text-red-500 text-xs font-medium">{errors.fullName}</p>}
                    <span className="text-xs text-[#617589] ml-auto">{formData.fullName.length}/100</span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <LabelWithInfo label="Short Name" required tooltip="Common city abbreviation. Required." />
                  <input name="shortName" value={formData.shortName} onChange={handleInputChange} className={getInputClasses(errors.shortName)} placeholder="e.g. SF" />
                  <div className="flex justify-between items-center mt-1">
                    {errors.shortName && <p className="text-red-500 text-xs font-medium">{errors.shortName}</p>}
                    <span className="text-xs text-[#617589] ml-auto">{formData.shortName.length}/20</span>
                  </div>
                </div>

                <div className="flex flex-col group relative">
                  <LabelWithInfo 
                    label="City Code" 
                    required 
                    tooltip="Unique alphanumeric code (letters and numbers only)." 
                    extra={
                      <div className="flex items-center gap-1">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all border ${/[A-Z]/i.test(formData.cityCode) ? 'bg-primary/10 text-primary border-primary/20' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 border-transparent'}`}>ABC</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all border ${/[0-9]/.test(formData.cityCode) ? 'bg-primary/10 text-primary border-primary/20' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 border-transparent'}`}>123</span>
                      </div>
                    }
                  />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1.5 text-[#617589] group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[20px]">qr_code</span>
                    </div>
                    <input 
                      name="cityCode" 
                      value={formData.cityCode} 
                      onChange={handleInputChange} 
                      className={`${getInputClasses(errors.cityCode, isCityCodeValid)} pl-12 font-mono uppercase tracking-[0.2em] placeholder:tracking-normal`}
                      placeholder="[ALPHA-NUMERIC]" 
                    />
                    {isCityCodeValid && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 animate-in zoom-in duration-300">
                        <span className="material-symbols-outlined text-[20px]">verified</span>
                      </div>
                    )}
                  </div>
                  {errors.cityCode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.cityCode}</p>}
                </div>

                <div className="flex flex-col" ref={countryDropdownRef}>
                  <LabelWithInfo label="Country" required tooltip="Select the country. Searchable. Required." />
                  <div className="relative">
                    <div onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} className={`flex items-center justify-between rounded-lg cursor-pointer h-14 p-[15px] bg-white dark:bg-[#25323e] border ${errors.country ? 'border-red-500 ring-1' : 'border-[#dbe0e6] dark:border-[#3e4c5a]'}`}>
                      <span className={formData.country ? 'text-[#111418] dark:text-white' : 'text-[#617589]'}>
                        {countries.find(c => c.shortName === formData.country)?.fullName || 'Select a country...'}
                      </span>
                      <span className={`material-symbols-outlined transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-[#2e3b4b] rounded-lg shadow-xl z-[60] overflow-hidden">
                        <div className="p-2 border-b dark:border-[#2e3b4b] sticky top-0 bg-white dark:bg-[#1a2632]">
                          <input autoFocus type="text" placeholder="Search..." className="w-full pl-3 pr-3 py-2 text-sm bg-gray-50 dark:bg-[#25323e] border border-[#dbe0e6] dark:border-[#3e4c5a] rounded-md dark:text-white" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCountries.map((country) => (
                            <div key={country.id} onClick={() => handleCountrySelect(country.shortName)} className="px-4 py-2.5 text-sm cursor-pointer hover:bg-primary/10 dark:text-white transition-colors">{country.fullName}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.country && <p className="text-red-500 text-xs mt-1 font-medium">{errors.country}</p>}
                </div>

                <div className="flex flex-col" ref={stateDropdownRef}>
                  <LabelWithInfo label="State" required tooltip="Select the parent state. Searchable. Required." />
                  <div className="relative">
                    <div onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)} className={`flex items-center justify-between rounded-lg cursor-pointer h-14 p-[15px] bg-white dark:bg-[#25323e] border ${errors.state ? 'border-red-500 ring-1' : 'border-[#dbe0e6] dark:border-[#3e4c5a]'}`}>
                      <span className={formData.state ? 'text-[#111418] dark:text-white' : 'text-[#617589]'}>
                        {states.find(s => s.shortName === formData.state)?.fullName || 'Select a state...'}
                      </span>
                      <span className={`material-symbols-outlined transition-transform ${isStateDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    {isStateDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-[#2e3b4b] rounded-lg shadow-xl z-[60] overflow-hidden">
                        <div className="p-2 border-b dark:border-[#2e3b4b] sticky top-0 bg-white dark:bg-[#1a2632]">
                          <input autoFocus type="text" placeholder="Search..." className="w-full pl-3 pr-3 py-2 text-sm bg-gray-50 dark:bg-[#25323e] border border-[#dbe0e6] dark:border-[#3e4c5a] rounded-md dark:text-white" value={stateSearch} onChange={(e) => setStateSearch(e.target.value)} />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredStates.map((state) => (
                            <div key={state.id} onClick={() => handleStateSelect(state.shortName)} className="px-4 py-2.5 text-sm cursor-pointer hover:bg-primary/10 dark:text-white transition-colors">{state.fullName}</div>
                          ))}
                          {filteredStates.length === 0 && (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center italic">No states found</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <span className="text-[#111418] dark:text-slate-200 text-sm font-medium">Status</span>
                <label className="inline-flex items-center cursor-pointer group">
                  <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={handleToggleChange} />
                  <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Is Active</span>
                </label>
              </div>

              {/* City Districts Management Section (Correctly showing mapped districts) */}
              <div className="mt-4 pt-6 border-t border-dashed border-[#dbe0e6] dark:border-[#2e3b4b] relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold">City Districts Management</h3>
                    <p className="text-xs text-[#617589]">Managing districts for {formData.fullName}</p>
                  </div>
                  <div className="relative">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Link existing district..." 
                        value={linkSearch} 
                        onChange={(e) => setLinkSearch(e.target.value)}
                        className="pl-9 pr-3 h-10 w-full md:w-56 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#25323e] text-xs focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    {linkSearch && (
                      <div className="absolute top-full right-0 w-full md:w-64 mt-1 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-[#2e3b4b] rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto">
                          {availableToLink.length > 0 ? (
                            availableToLink.map(d => (
                              <div 
                                key={d.id} 
                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between group/link"
                                onClick={() => handleLink(d.id)}
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium dark:text-white">{d.fullName}</span>
                                  <span className="text-[10px] text-gray-500 uppercase">{d.city || 'No City'}</span>
                                </div>
                                <span className="material-symbols-outlined text-primary text-[18px] opacity-0 group-hover/link:opacity-100 transition-opacity">add_link</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-center text-xs text-gray-500 italic">No districts found to link</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {feedbackMessage && (
                  <div className="mb-4 p-2 bg-primary/10 text-primary border border-primary/20 rounded text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    {feedbackMessage}
                  </div>
                )}

                <div className="bg-background-light dark:bg-[#15202b] rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] overflow-hidden">
                  {associatedDistricts.length > 0 ? (
                    <div className="divide-y divide-[#dbe0e6] dark:divide-[#2e3b4b]">
                      {associatedDistricts.map((district) => (
                        <div key={district.id} className="flex items-center justify-between p-4 border-l-4 border-primary hover:bg-white dark:hover:bg-[#1a2632] transition-colors group/associated">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#111418] dark:text-white">{district.fullName}</span>
                            <span className="text-xs text-[#617589] dark:text-gray-400">{district.shortName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <button 
                              type="button"
                              onClick={() => onViewChild('view-district', district)}
                              className="text-gray-400 hover:text-primary transition-all p-1.5 rounded-md hover:bg-primary/10"
                              title="View details"
                            >
                              <span className="material-symbols-outlined">visibility</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleUnlink(district.id)} 
                              className="text-gray-400 hover:text-red-600 transition-all p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Unlink from this city"
                            >
                              <span className="material-symbols-outlined">link_off</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-[#617589] dark:text-gray-400 text-sm italic">
                      No districts currently mapped to this city.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#dbe0e6] dark:border-[#2e3b4b] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f0f2f4] dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-[#111418] dark:text-white text-lg font-bold">Audit Information</h3>
              <button type="button" onClick={() => setIsHistoryExpanded(!isHistoryExpanded)} className="text-xs font-bold text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">{isHistoryExpanded ? 'visibility_off' : 'history'}</span>
                {isHistoryExpanded ? 'Hide' : 'Show'} Full History
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
                {[
                  { label: 'Created By', value: formData.audit.createdBy, icon: 'person_add' },
                  { label: 'Created Date', value: formData.audit.createdDate, icon: 'calendar_today' },
                  { label: 'Updated By', value: formData.audit.updatedBy, icon: 'edit_note' },
                  { label: 'Updated Date', value: formData.audit.updatedDate, icon: 'update' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <span className="text-[#617589] dark:text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                      {item.label}
                    </span>
                    <div className="flex items-center h-11 px-4 rounded-lg bg-gray-50 dark:bg-[#15202b] border border-[#dbe0e6] dark:border-[#3e4c5a] text-[#111418] dark:text-gray-200 text-sm font-medium truncate" title={item.value}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isHistoryExpanded ? 'max-h-[800px] opacity-100 mt-8 pt-8 border-t border-dashed border-[#dbe0e6] dark:border-[#2e3b4b]' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-6 gap-4">
                  <h4 className="text-[#111418] dark:text-white font-bold text-sm flex items-center gap-2 uppercase tracking-tight">
                    <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
                    Action Timeline
                  </h4>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                    <input 
                      type="text" placeholder="Filter timeline..." value={historySearch} onChange={(e) => setHistorySearch(e.target.value)}
                      className="pl-9 pr-4 h-9 w-48 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#25323e] text-xs focus:ring-primary focus:border-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="relative pl-10 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-primary/50 before:to-transparent">
                  {filteredHistory.length > 0 ? (
                    <div className="flex flex-col gap-6">
                      {[...filteredHistory].reverse().map((entry) => {
                        const styles = getActionStyles(entry.action);
                        return (
                          <div key={entry.id} className="relative animate-in slide-in-from-left-4 duration-300">
                            <div className={`absolute -left-[31px] top-1.5 size-6 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1a2632] shadow-sm z-10 ${styles.bg}`}>
                              <span className={`material-symbols-outlined text-[16px] ${styles.color}`}>{styles.icon}</span>
                            </div>
                            <div className="bg-white dark:bg-[#1a2632] rounded-lg p-4 border border-[#dbe0e6] dark:border-[#2e3b4b] shadow-sm hover:shadow-md transition-shadow group/card">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 text-[10px] font-bold uppercase">
                                <span className={`${styles.color}`}>{entry.action}</span>
                                <span className="text-[#617589] dark:text-gray-400 font-mono tracking-tighter">{entry.timestamp}</span>
                              </div>
                              <div className="text-sm font-bold dark:text-white flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-gray-400">account_circle</span>
                                {entry.user}
                              </div>
                              {entry.details && <p className="text-xs text-[#617589] dark:text-gray-400 italic mt-2 p-2 bg-gray-50/50 dark:bg-[#25323e]/50 rounded border border-transparent group-hover/card:border-primary/20 transition-colors">"{entry.details}"</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 italic text-sm py-6">No matching history found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 py-4">
            <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg border dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-blue-600 shadow-sm transition-colors">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};
