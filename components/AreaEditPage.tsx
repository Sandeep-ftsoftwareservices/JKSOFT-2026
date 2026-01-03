
import React, { useState, useMemo } from 'react';
import { AreaDetails, DistrictDetails, CityDetails, StateDetails, CountryDetails, ViewType, ColonyDetails } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface AreaEditPageProps {
  data: AreaDetails;
  districts: DistrictDetails[];
  cities: CityDetails[];
  states: StateDetails[];
  countries: CountryDetails[];
  allAreas: AreaDetails[];
  allColonies: ColonyDetails[];
  onSave: (data: AreaDetails) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
  onViewChild: (view: ViewType, data: any) => void;
}

interface ValidationErrors {
  fullName?: string;
  shortName?: string;
  pinCode?: string;
  country?: string;
  state?: string;
  city?: string;
  district?: string;
}

export const AreaEditPage: React.FC<AreaEditPageProps> = ({ 
  data, districts, cities, states, countries, allAreas, allColonies, onSave, onCancel, onNavigate, onViewChild
}) => {
  const [formData, setFormData] = useState<AreaDetails>(data);
  const [localAllAreas, setLocalAllAreas] = useState<AreaDetails[]>(allAreas);
  const [localAllColonies, setLocalAllColonies] = useState<ColonyDetails[]>(allColonies);
  const [colonyLinkSearch, setColonyLinkSearch] = useState('');
  const [areaLinkSearch, setAreaLinkSearch] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.shortName.trim()) newErrors.shortName = 'Short name (code) is required';
    if (!formData.pinCode.trim()) newErrors.pinCode = 'Pin code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.district) newErrors.district = 'District is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleToggleChange = () => setFormData(prev => ({ ...prev, isActive: !prev.isActive }));

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  // Children: colonies mapped to the current area
  const associatedColonies = useMemo(() => {
    return localAllColonies.filter(c => c.area === formData.shortName);
  }, [localAllColonies, formData.shortName]);

  // Siblings: areas in the same district (excluding self)
  const associatedAreas = useMemo(() => {
    return localAllAreas.filter(a => a.district === formData.district && a.id !== formData.id);
  }, [localAllAreas, formData.district, formData.id]);

  // Colonies available to link (not already in this area)
  const availableColoniesToLink = useMemo(() => {
    if (!colonyLinkSearch.trim()) return [];
    const query = colonyLinkSearch.toLowerCase();
    return localAllColonies.filter(c => 
      c.area !== formData.shortName && 
      (c.fullName.toLowerCase().includes(query) || c.shortName.toLowerCase().includes(query))
    );
  }, [localAllColonies, formData.shortName, colonyLinkSearch]);

  // Sibling Areas available to link (same district)
  const availableAreasToLink = useMemo(() => {
    if (!areaLinkSearch.trim()) return [];
    const query = areaLinkSearch.toLowerCase();
    return localAllAreas.filter(a => 
      a.district !== formData.district && 
      (a.fullName.toLowerCase().includes(query) || a.shortName.toLowerCase().includes(query) || a.pinCode.includes(query))
    );
  }, [localAllAreas, formData.district, areaLinkSearch]);

  const handleLinkColony = (colonyId: string) => {
    const colonyToLink = localAllColonies.find(c => c.id === colonyId);
    if (colonyToLink) {
      setLocalAllColonies(prev => prev.map(c => 
        c.id === colonyId ? { 
          ...c, 
          area: formData.shortName,
          district: formData.district,
          city: formData.city,
          state: formData.state,
          country: formData.country 
        } : c
      ));
      setFeedbackMessage(`Linked colony "${colonyToLink.fullName}" to ${formData.fullName}`);
      setColonyLinkSearch('');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleLinkArea = (areaId: string) => {
    const areaToLink = localAllAreas.find(a => a.id === areaId);
    if (areaToLink && formData.district) {
      setLocalAllAreas(prev => prev.map(a => 
        a.id === areaId ? { ...a, district: formData.district, city: formData.city, state: formData.state, country: formData.country } : a
      ));
      setFeedbackMessage(`Linked area "${areaToLink.fullName}" to the current district`);
      setAreaLinkSearch('');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleUnlinkColony = (id: string) => {
    setLocalAllColonies(prev => prev.map(c => 
      c.id === id ? { ...c, area: '' } : c
    ));
  };

  const handleUnlinkArea = (id: string) => {
    setLocalAllAreas(prev => prev.map(a => 
      a.id === id ? { ...a, district: '' } : a
    ));
  };

  const getActionStyles = (action: string) => {
    const lowAction = action.toLowerCase();
    if (lowAction.includes('created')) return { icon: 'add_circle', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (lowAction.includes('updated') || lowAction.includes('modified')) return { icon: 'edit', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    if (lowAction.includes('status') || lowAction.includes('active')) return { icon: 'published_with_changes', color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' };
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

  const getInputClasses = (error?: string) => {
    const base = "w-full rounded-lg border bg-white dark:bg-[#1a2632] px-4 py-3 text-base text-[#111418] dark:text-white focus:outline-none focus:ring-1 transition-shadow";
    if (error) return `${base} border-red-500 focus:border-red-500 focus:ring-red-500/20`;
    return `${base} border-[#dbe0e6] dark:border-gray-700 focus:border-primary focus:ring-primary`;
  };

  const parentDistrictName = districts.find(d => d.shortName === formData.district)?.fullName || formData.district || 'selected district';

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-12">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 pb-12">
        <Breadcrumbs currentView="edit-area" onNavigate={onNavigate} />
        
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <h1 className="text-[#111418] dark:text-white text-3xl font-bold tracking-tight">Edit Area</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm mt-1">View and edit area configuration</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-8">
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-[#111418] dark:text-gray-200 mb-2">Country <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={getInputClasses(errors.country)}
                  >
                    <option disabled value="">Select Country</option>
                    {countries.map(c => <option key={c.id} value={c.shortName}>{c.fullName}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#617589]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-[#111418] dark:text-gray-200 mb-2">State <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={getInputClasses(errors.state)}
                  >
                    <option disabled value="">Select State</option>
                    {states.filter(s => !formData.country || s.country === formData.country).map(s => (
                      <option key={s.id} value={s.shortName}>{s.fullName}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#617589]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-[#111418] dark:text-gray-200 mb-2">City <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={getInputClasses(errors.city)}
                  >
                    <option disabled value="">Select City</option>
                    {cities.filter(c => !formData.state || c.state === formData.state).map(c => (
                      <option key={c.id} value={c.shortName}>{c.fullName}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#617589]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-[#111418] dark:text-gray-200 mb-2">District <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={getInputClasses(errors.district)}
                  >
                    <option disabled value="">Select District</option>
                    {districts.filter(d => !formData.city || d.city === formData.city).map(d => (
                      <option key={d.id} value={d.shortName}>{d.fullName}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#617589]">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-[#111418] dark:text-gray-200 mb-2">Full Name <span className="text-red-500">*</span></label>
                <input 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={getInputClasses(errors.fullName)} 
                  placeholder="e.g. Downtown Area" 
                  type="text" 
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-[#111418] dark:text-gray-200 mb-2">Short Name <span className="text-red-500">*</span></label>
                <input 
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleInputChange}
                  className={getInputClasses(errors.shortName)} 
                  placeholder="e.g. DT" 
                  type="text" 
                />
                {errors.shortName && <p className="text-red-500 text-xs mt-1">{errors.shortName}</p>}
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-[#111418] dark:text-gray-200 mb-2">Pin Code <span className="text-red-500">*</span></label>
                <input 
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  className={getInputClasses(errors.pinCode)} 
                  placeholder="e.g. 10001" 
                  type="text" 
                />
                {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode}</p>}
              </div>

              <div className="col-span-1 flex items-center h-full pt-6">
                <div className="flex items-center w-full">
                  <label className="inline-flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" checked={formData.isActive} onChange={handleToggleChange} />
                    <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    <span className="ms-3 text-sm font-medium text-[#111418] dark:text-white">Is Active</span>
                  </label>
                </div>
              </div>
            </div>

            {feedbackMessage && (
              <div className="mx-6 md:mx-8 mb-4 p-2 bg-primary/10 text-primary border border-primary/20 rounded text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <span className="material-symbols-outlined text-[16px]">info</span>
                {feedbackMessage}
              </div>
            )}

            {/* Area Colonies Management Section (Child Mapping) */}
            <div className="mt-4 pt-8 border-t border-dashed border-[#f0f2f4] dark:border-gray-800 px-6 md:px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <div>
                  <h3 className="text-[#111418] dark:text-white text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">holiday_village</span>
                    Area Colonies Management
                  </h3>
                  <p className="text-xs text-[#617589]">Managing colonies for {formData.fullName}</p>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                  <input 
                    type="text" 
                    placeholder="Link existing colony..." 
                    value={colonyLinkSearch} 
                    onChange={(e) => setColonyLinkSearch(e.target.value)}
                    className="pl-9 pr-3 h-10 w-full md:w-56 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632] text-xs focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                  />
                  {colonyLinkSearch && (
                    <div className="absolute top-full right-0 w-full md:w-64 mt-1 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="max-h-48 overflow-y-auto">
                        {availableColoniesToLink.length > 0 ? (
                          availableColoniesToLink.map(c => (
                            <div 
                              key={c.id} 
                              className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between group/link"
                              onClick={() => handleLinkColony(c.id)}
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium dark:text-white">{c.fullName}</span>
                                <span className="text-[10px] text-gray-500 uppercase">{c.area || 'No Area'}</span>
                              </div>
                              <span className="material-symbols-outlined text-primary text-[18px] opacity-0 group-hover/link:opacity-100 transition-opacity">add_link</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-center text-xs text-gray-500 italic">No colonies found</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-black/20 rounded-lg border border-[#f0f2f4] dark:border-gray-800 overflow-hidden">
                {associatedColonies.length > 0 ? (
                  <div className="divide-y divide-[#f0f2f4] dark:divide-gray-800">
                    {associatedColonies.map((colony) => (
                      <div key={colony.id} className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-[#1a2632] transition-colors group/child">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">home</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#111418] dark:text-white">{colony.fullName}</span>
                            <span className="text-xs text-[#617589] dark:text-gray-400">{colony.shortName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                            type="button"
                            className="text-gray-400 hover:text-primary transition-all p-1.5 rounded-md hover:bg-primary/10"
                            title="View details"
                          >
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleUnlinkColony(colony.id)} 
                            className="text-gray-400 hover:text-red-600 transition-all opacity-0 group-hover/child:opacity-100 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Unlink from this area"
                          >
                            <span className="material-symbols-outlined">link_off</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-200 dark:text-gray-800 mb-2">holiday_village</span>
                    <p className="text-gray-400 text-sm italic">No colonies currently mapped to this area.</p>
                  </div>
                )}
              </div>
            </div>

            {/* District Areas Management Section (Sibling Mapping) */}
            <div className="mt-4 pt-8 border-t border-dashed border-[#f0f2f4] dark:border-gray-800 px-6 md:px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <div>
                  <h3 className="text-[#111418] dark:text-white text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">link</span>
                    District Areas Management
                  </h3>
                  <p className="text-xs text-[#617589]">Managing areas for {parentDistrictName}</p>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                  <input 
                    type="text" 
                    placeholder="Link existing area..." 
                    value={areaLinkSearch} 
                    onChange={(e) => setAreaLinkSearch(e.target.value)}
                    className="pl-9 pr-3 h-10 w-full md:w-56 rounded-lg border border-[#dbe0e6] dark:border-gray-700 bg-white dark:bg-[#1a2632] text-xs focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                  />
                  {areaLinkSearch && (
                    <div className="absolute top-full right-0 w-full md:w-64 mt-1 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                      <div className="max-h-48 overflow-y-auto">
                        {availableAreasToLink.length > 0 ? (
                          availableAreasToLink.map(a => (
                            <div 
                              key={a.id} 
                              className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between group/link"
                              onClick={() => handleLinkArea(a.id)}
                            >
                              <div className="flex flex-col">
                                <span className="text-sm font-medium dark:text-white">{a.fullName}</span>
                                <span className="text-[10px] text-gray-500 uppercase">{a.district || 'No District'} | {a.pinCode}</span>
                              </div>
                              <span className="material-symbols-outlined text-primary text-[18px] opacity-0 group-hover/link:opacity-100 transition-opacity">add_link</span>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-center text-xs text-gray-500 italic">No areas found to link</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-black/20 rounded-lg border border-[#f0f2f4] dark:border-gray-800 overflow-hidden">
                {associatedAreas.length > 0 ? (
                  <div className="divide-y divide-[#f0f2f4] dark:divide-gray-800">
                    {associatedAreas.map((area) => (
                      <div key={area.id} className="flex items-center justify-between p-4 hover:bg-white dark:hover:bg-[#1a2632] transition-colors group/associated">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded bg-primary/10 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">apartment</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#111418] dark:text-white">{area.fullName}</span>
                            <span className="text-xs text-[#617589] dark:text-gray-400">{area.shortName} | Pin: {area.pinCode}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                            type="button"
                            onClick={() => onViewChild('view-area', area)}
                            className="text-gray-400 hover:text-primary transition-all p-1.5 rounded-md hover:bg-primary/10"
                            title="View details"
                          >
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleUnlinkArea(area.id)} 
                            className="text-gray-400 hover:text-red-600 transition-all opacity-0 group-hover/associated:opacity-100 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Unlink from this district"
                          >
                            <span className="material-symbols-outlined">link_off</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-200 dark:text-gray-800 mb-2">domain_disabled</span>
                    <p className="text-gray-400 text-sm italic">No other areas currently mapped to this district.</p>
                  </div>
                )}
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
                            <div className={`absolute -left-[31px] top-1.5 size-6 rounded-full flex items-center justify-center border-2 border-white dark:border-surface-dark shadow-sm z-10 ${styles.bg}`}>
                              <span className={`material-symbols-outlined text-[16px] ${styles.color}`}>{styles.icon}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-black/20 rounded-lg p-4 border border-[#f0f2f4] dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group/card">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`${styles.color} text-xs font-bold uppercase tracking-wider`}>{entry.action}</span>
                                <span className="text-[#617589] dark:text-gray-500 text-[10px] font-mono">{entry.timestamp}</span>
                              </div>
                              <div className="text-sm font-semibold dark:text-white mb-1 flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-gray-400">person</span>
                                {entry.user}
                              </div>
                              {entry.details && <p className="text-xs text-[#617589] dark:text-gray-400 italic bg-white dark:bg-background-dark p-2 rounded border border-transparent group-hover/card:border-primary/20 transition-colors mt-2">"{entry.details}"</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-sm text-gray-500 italic bg-gray-50 dark:bg-black/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                      No logs matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 md:px-8 border-t border-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-surface-dark flex flex-wrap items-center justify-end gap-3">
            <button 
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border border-[#dbe0e6] dark:border-gray-700 text-[#111418] dark:text-white bg-white dark:bg-transparent font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors outline-none"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-blue-600 transition-colors shadow-sm outline-none flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
