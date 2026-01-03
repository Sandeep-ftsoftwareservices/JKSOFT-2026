
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { StateDetails, ViewType, CountryDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface StateEditPageProps {
  data: StateDetails;
  onSave: (data: StateDetails) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
  countries: CountryDetails[];
  allStates: StateDetails[];
  onViewChild: (view: ViewType, data: any) => void;
}

interface ValidationErrors {
  fullName?: string;
  shortName?: string;
  stateCode?: string;
  country?: string;
  gstCode?: string;
  stdCode?: string;
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
      <p className="text-[#111418] dark:text-gray-200 text-sm font-semibold flex items-center">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <span className="material-symbols-outlined text-[18px] text-[#617589] dark:text-gray-400 flex items-center cursor-help">info</span>
      <FieldTooltip text={tooltip} />
    </div>
    {extra}
  </div>
);

export const StateEditPage: React.FC<StateEditPageProps> = ({ data, onSave, onCancel, onNavigate, countries, allStates, onViewChild }) => {
  const [formData, setFormData] = useState<StateDetails>(data);
  const [localAllStates, setLocalAllStates] = useState<StateDetails[]>(allStates);
  const [linkSearch, setLinkSearch] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Filter sibling states in the same country (excluding self)
  const associatedStates = useMemo(() => {
    return localAllStates.filter(s => s.country === formData.country && s.id !== formData.id);
  }, [localAllStates, formData.country, formData.id]);

  // States from other countries available to link to this country
  const availableToLink = useMemo(() => {
    if (!linkSearch.trim()) return [];
    const query = linkSearch.toLowerCase();
    return localAllStates.filter(s => 
      s.country !== formData.country && 
      (s.fullName.toLowerCase().includes(query) || s.shortName.toLowerCase().includes(query))
    );
  }, [localAllStates, formData.country, linkSearch]);

  const handleLink = (stateId: string) => {
    const stateToLink = localAllStates.find(s => s.id === stateId);
    if (stateToLink && formData.country) {
      setLocalAllStates(prev => prev.map(s => 
        s.id === stateId ? { ...s, country: formData.country } : s
      ));
      const countryName = countries.find(c => c.shortName === formData.country)?.fullName || formData.country;
      setFeedbackMessage(`Linked "${stateToLink.fullName}" to ${countryName}`);
      setLinkSearch('');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleUnlink = (id: string) => {
    setLocalAllStates(prev => prev.map(s => 
      s.id === id ? { ...s, country: '' } : s
    ));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full state name is required';
    if (!formData.shortName.trim()) newErrors.shortName = 'Short name is required';
    if (!formData.stateCode.trim()) {
      newErrors.stateCode = 'State code is required';
    } else if (!/^\d+$/.test(formData.stateCode) || formData.stateCode.length < 2) {
      newErrors.stateCode = 'State code must be numeric and at least 2 digits';
    }
    if (!formData.country) newErrors.country = 'Please select a country';
    if (!formData.gstCode.trim()) {
      newErrors.gstCode = 'GST code is required';
    } else if (!/^\d+$/.test(formData.gstCode) || formData.gstCode.length < 2) {
      newErrors.gstCode = 'GST code must be numeric and at least 2 digits';
    }
    if (!formData.stdCode.trim()) {
      newErrors.stdCode = 'STD code is required';
    } else if (!/^\d+$/.test(formData.stdCode) || formData.stdCode.length < 2) {
      newErrors.stdCode = 'STD code must be numeric and at least 2 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ['stateCode', 'gstCode', 'stdCode'];
    const newValue = numericFields.includes(name) ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof ValidationErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleCountrySelect = (countryShortName: string) => {
    setFormData(prev => ({ ...prev, country: countryShortName }));
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
    if (errors.country) setErrors(prev => ({ ...prev, country: undefined }));
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

  const getInputClasses = (error?: string, isValid?: boolean) => {
    const base = "form-input flex w-full min-w-0 flex-1 rounded-lg text-[#111418] dark:text-white focus:outline-0 focus:ring-1 h-12 placeholder:text-gray-400 p-[15px] text-sm font-normal transition-all bg-white dark:bg-gray-900";
    if (error) return `${base} border-red-500 focus:ring-red-500 focus:border-red-500 ring-1 ring-red-500/10`;
    if (isValid) return `${base} border-green-500 focus:ring-green-500 focus:border-green-500 ring-1 ring-green-500/10`;
    return `${base} border-[#dbe0e6] dark:border-gray-700 focus:ring-primary focus:border-primary`;
  };

  const isStateCodeValid = formData.stateCode.length >= 2 && /^\d+$/.test(formData.stateCode);
  const isGstCodeValid = formData.gstCode.length >= 2 && /^\d+$/.test(formData.gstCode);
  const isStdCodeValid = formData.stdCode.length >= 2 && /^\d+$/.test(formData.stdCode);

  const parentCountryName = countries.find(c => c.shortName === formData.country)?.fullName || formData.country || 'selected country';

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="edit-state" onNavigate={onNavigate} />
        
        <div className="flex flex-wrap justify-between gap-3 px-4 pb-2">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white tracking-tight text-3xl font-black leading-tight">Edit State</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">Update the configuration and associations for this state.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-4 space-y-8 mb-12">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <LabelWithInfo label="Full State Name" required tooltip="Enter the full official name of the state. Required." />
                  <input name="fullName" value={formData.fullName} onChange={handleInputChange} className={getInputClasses(errors.fullName)} placeholder="e.g. California" type="text" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
                </div>

                <div>
                  <LabelWithInfo label="Short Name" required tooltip="Common abbreviation (e.g. CA). Required." />
                  <input name="shortName" value={formData.shortName} onChange={handleInputChange} className={getInputClasses(errors.shortName)} placeholder="e.g. CA" type="text" />
                  {errors.shortName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.shortName}</p>}
                </div>
                
                <div className="relative group">
                  <LabelWithInfo 
                    label="State Code" 
                    required 
                    tooltip="Numeric value, minimum 2 digits required." 
                    extra={
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${isStateCodeValid ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'}`}>
                        {formData.stateCode.length}/2+
                      </span>
                    }
                  />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none text-[#617589] dark:text-gray-500 group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">numbers</span>
                    </div>
                    <input 
                      name="stateCode" value={formData.stateCode} onChange={handleInputChange}
                      className={`${getInputClasses(errors.stateCode, isStateCodeValid)} pl-11 font-mono tracking-widest`}
                      placeholder="Enter numeric code" type="text" inputMode="numeric"
                    />
                    {isStateCodeValid && <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-[20px]">check_circle</span>}
                  </div>
                  {errors.stateCode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.stateCode}</p>}
                </div>

                <div ref={countryDropdownRef}>
                  <LabelWithInfo label="Country" required tooltip="Select the parent country. Required." />
                  <div className="relative">
                    <div 
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)} 
                      className={`flex w-full items-center justify-between rounded-lg cursor-pointer h-12 px-4 text-sm transition-all bg-white dark:bg-gray-900 border ${errors.country ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} hover:border-primary`}
                    >
                      <span className={formData.country ? 'text-[#111418] dark:text-white' : 'text-[#617589] dark:text-gray-500'}>
                        {countries.find(c => c.shortName === formData.country)?.fullName || 'Select Country'}
                      </span>
                      <span className={`material-symbols-outlined text-[#617589] transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-gray-700 rounded-lg shadow-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-1">
                        <div className="p-2 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-[#1a2632]">
                          <input autoFocus type="text" placeholder="Search..." className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-[#dbe0e6] dark:border-gray-700 rounded-md focus:ring-1 focus:ring-primary dark:text-white outline-none" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} />
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {countries.filter(c => c.fullName.toLowerCase().includes(countrySearch.toLowerCase())).map((country) => (
                            <div key={country.id} onClick={() => handleCountrySelect(country.shortName)} className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${formData.country === country.shortName ? 'bg-primary/10 text-primary font-semibold' : 'text-[#111418] dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#25323e]'}`}>
                              <span>{country.fullName}</span>
                              {formData.country === country.shortName && <span className="material-symbols-outlined text-[18px]">check</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.country && <p className="text-red-500 text-xs mt-1 font-medium">{errors.country}</p>}
                </div>

                <div>
                  <LabelWithInfo label="GST Code" required tooltip="Numeric GST code, minimum 2 digits required." />
                  <div className="relative">
                    <input name="gstCode" value={formData.gstCode} onChange={handleInputChange} className={getInputClasses(errors.gstCode, isGstCodeValid)} placeholder="Numeric GST Code" type="text" inputMode="numeric" />
                    {isGstCodeValid && <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-[20px]">check_circle</span>}
                  </div>
                  {errors.gstCode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gstCode}</p>}
                </div>

                <div>
                  <LabelWithInfo label="STD Code" required tooltip="Numeric STD code, minimum 2 digits required." />
                  <div className="relative">
                    <input name="stdCode" value={formData.stdCode} onChange={handleInputChange} className={getInputClasses(errors.stdCode, isStdCodeValid)} placeholder="Numeric STD Code" type="text" inputMode="numeric" />
                    {isStdCodeValid && <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-[20px]">check_circle</span>}
                  </div>
                  {errors.stdCode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.stdCode}</p>}
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

              {/* State Cities Management Section */}
              <div className="mt-4 pt-6 border-t border-dashed border-[#dbe0e6] dark:border-gray-800 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold">State Cities Management</h3>
                    <p className="text-xs text-[#617589]">Managing states for {parentCountryName}</p>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                    <input 
                      type="text" 
                      placeholder="Link existing state..." 
                      value={linkSearch} 
                      onChange={(e) => setLinkSearch(e.target.value)}
                      className="pl-9 pr-3 h-10 w-full md:w-56 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                    />
                    {linkSearch && (
                      <div className="absolute top-full right-0 w-full md:w-64 mt-1 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto">
                          {availableToLink.length > 0 ? (
                            availableToLink.map(s => (
                              <div 
                                key={s.id} 
                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between group/link"
                                onClick={() => handleLink(s.id)}
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium dark:text-white">{s.fullName}</span>
                                  <span className="text-[10px] text-gray-500 uppercase">{s.country || 'No Country'}</span>
                                </div>
                                <span className="material-symbols-outlined text-primary text-[18px] opacity-0 group-hover/link:opacity-100 transition-opacity">add_link</span>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-center text-xs text-gray-500 italic">No states found to link</div>
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

                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-[#f0f2f4] dark:border-gray-700 overflow-hidden">
                  {associatedStates.length > 0 ? (
                    <div className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                      {associatedStates.map((state) => (
                        <div key={state.id} className="flex items-center justify-between p-4 border-l-4 border-primary hover:bg-white dark:hover:bg-[#1a2632] transition-colors group/associated">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#111418] dark:text-white">{state.fullName}</span>
                            <span className="text-xs text-[#617589] dark:text-gray-400">{state.shortName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <button 
                              type="button"
                              onClick={() => onViewChild('view-state', state)}
                              className="text-gray-400 hover:text-primary transition-all p-1.5 rounded-md hover:bg-primary/10"
                              title="View details"
                            >
                              <span className="material-symbols-outlined">visibility</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleUnlink(state.id)} 
                              className="text-gray-400 hover:text-red-600 transition-all p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Unlink from this country"
                            >
                              <span className="material-symbols-outlined">link_off</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <div className="p-8 text-center text-[#617589] dark:text-gray-400 text-sm italic">No other states currently linked to this country.</div>}
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
            
            <div className="p-6 md:p-8">
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
                      className="pl-9 pr-4 h-9 w-48 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-primary focus:border-primary outline-none"
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
                            <div className="bg-white dark:bg-[#1a2632] rounded-lg p-4 border border-[#dbe0e6] dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`${styles.color} text-xs font-bold uppercase tracking-wider`}>{entry.action}</span>
                                <span className="text-[#617589] dark:text-gray-400 text-xs font-mono">{entry.timestamp}</span>
                              </div>
                              <div className="text-sm font-semibold dark:text-white mb-1">{entry.user}</div>
                              {entry.details && <p className="text-xs text-[#617589] dark:text-gray-400 italic">"{entry.details}"</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-gray-500 italic bg-gray-50 dark:bg-[#25323e] rounded-lg border border-dashed border-gray-300 dark:border-gray-700">No logs matching your search.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-[#dbe0e6] dark:border-gray-700 flex items-center justify-end gap-3">
            <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </button>
          </div>
        </form>
        
        <div className="text-center text-[#617589] dark:text-gray-500 text-sm py-10">
          <p>Need help? View the <a className="text-primary hover:underline" href="#">documentation</a> for state management guidelines.</p>
        </div>
      </div>
    </div>
  );
};
