
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DistrictDetails, AreaDetails, CityDetails, StateDetails, CountryDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface DistrictEditPageProps {
  data: DistrictDetails;
  cities: CityDetails[];
  states: StateDetails[];
  countries: CountryDetails[];
  allAreas: AreaDetails[];
  allDistricts: DistrictDetails[];
  onSave: (data: DistrictDetails) => void;
  onCancel: () => void;
  onNavigate: (view: ViewType) => void;
  onViewChild: (view: ViewType, data: any) => void;
}

interface ValidationErrors {
  fullName?: string;
  shortName?: string;
  country?: string;
  state?: string;
  city?: string;
}

export const DistrictEditPage: React.FC<DistrictEditPageProps> = ({ 
  data, 
  cities, 
  states, 
  countries, 
  allAreas,
  allDistricts,
  onSave, 
  onCancel, 
  onNavigate,
  onViewChild
}) => {
  const [formData, setFormData] = useState<DistrictDetails>(data);
  const [localAllAreas, setLocalAllAreas] = useState<AreaDetails[]>(allAreas);
  const [linkSearch, setLinkSearch] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.shortName.trim()) newErrors.shortName = 'Short name is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'Associated city is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ValidationErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleToggleChange = () => setFormData(prev => ({ ...prev, isActive: !prev.isActive }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  // Children: areas mapped to the current district
  const associatedAreas = useMemo(() => {
    return localAllAreas.filter(a => a.district === formData.shortName);
  }, [localAllAreas, formData.shortName]);

  // Areas available to link (not already in this district)
  const availableToLink = useMemo(() => {
    if (!linkSearch.trim()) return [];
    const query = linkSearch.toLowerCase();
    return localAllAreas.filter(a => 
      a.district !== formData.shortName && 
      (a.fullName.toLowerCase().includes(query) || a.shortName.toLowerCase().includes(query) || a.pinCode.includes(query))
    );
  }, [localAllAreas, formData.shortName, linkSearch]);

  const handleLink = (areaId: string) => {
    const areaToLink = localAllAreas.find(a => a.id === areaId);
    if (areaToLink) {
      setLocalAllAreas(prev => prev.map(a => 
        a.id === areaId ? { 
          ...a, 
          district: formData.shortName,
          city: formData.city,
          state: formData.state,
          country: formData.country
        } : a
      ));
      setFeedbackMessage(`Linked area "${areaToLink.fullName}" to ${formData.fullName}`);
      setLinkSearch('');
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleUnlink = (id: string) => {
    setLocalAllAreas(prev => prev.map(a => 
      a.id === id ? { ...a, district: '' } : a
    ));
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

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="edit-district" onNavigate={onNavigate} />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 pb-2">
          <div>
            <h1 className="text-[#111418] dark:text-white text-3xl font-black tracking-tight">
              {data.id ? 'Edit District' : 'Add District'}
            </h1>
            <p className="text-[#617589] dark:text-gray-400 mt-1">View and edit district configuration and association.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-4 space-y-8 mb-12">
          <div className="bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-gray-800 overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold">Full Name</span>
                  <input 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${errors.fullName ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} bg-white dark:bg-gray-900 px-4 py-3 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400`}
                    placeholder="e.g. Downtown District" 
                    type="text" 
                  />
                  {errors.fullName && <p className="text-red-500 text-xs font-medium">{errors.fullName}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold">Short Name</span>
                  <input 
                    name="shortName"
                    value={formData.shortName}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${errors.shortName ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} bg-white dark:bg-gray-900 px-4 py-3 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400`}
                    placeholder="e.g. CBD" 
                    type="text" 
                  />
                  {errors.shortName && <p className="text-red-500 text-xs font-medium">{errors.shortName}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold">Country</span>
                  <div className="relative">
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`w-full appearance-none rounded-lg border ${errors.country ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} bg-white dark:bg-gray-900 px-4 py-3 pr-10 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary`}
                    >
                      <option value="">Select a country</option>
                      {countries.map(c => <option key={c.id} value={c.shortName}>{c.fullName}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#617589]">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                  {errors.country && <p className="text-red-500 text-xs mt-1 font-medium">{errors.country}</p>}
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold">State / Province</span>
                  <div className="relative">
                    <select 
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={`w-full appearance-none rounded-lg border ${errors.state ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} bg-white dark:bg-gray-900 px-4 py-3 pr-10 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary`}
                    >
                      <option value="">Select a state</option>
                      {states.filter(s => !formData.country || s.country === formData.country).map(s => (
                        <option key={s.id} value={s.shortName}>{s.fullName}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#617589]">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                  {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state}</p>}
                </label>

                <label className="flex flex-col gap-2 md:col-span-2">
                  <span className="text-[#111418] dark:text-gray-200 text-sm font-semibold">Associated City</span>
                  <div className="relative">
                    <select 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full appearance-none rounded-lg border ${errors.city ? 'border-red-500 ring-1 ring-red-500/10' : 'border-[#dbe0e6] dark:border-gray-700'} bg-white dark:bg-gray-900 px-4 py-3 pr-10 text-[#111418] dark:text-white focus:border-primary focus:ring-1 focus:ring-primary`}
                    >
                      <option value="">Select a city</option>
                      {cities.filter(c => !formData.state || c.state === formData.state).map(c => (
                        <option key={c.id} value={c.shortName}>{c.fullName}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#617589]">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                  {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city}</p>}
                  <p className="text-xs text-[#617589] dark:text-gray-500 mt-1">This district belongs to the selected city jurisdiction.</p>
                </label>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <span className="text-[#111418] dark:text-slate-200 text-sm font-medium">Status</span>
                <label className="inline-flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.isActive}
                    onChange={handleToggleChange}
                  />
                  <div className="relative w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Is Active</span>
                </label>
              </div>

              {/* District Areas Management Section (Correctly showing mapped areas) */}
              <div className="mt-4 pt-6 border-t border-dashed border-[#dbe0e6] dark:border-[#2e3b4b] relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-[#111418] dark:text-white text-lg font-bold">District Areas Management</h3>
                    <p className="text-xs text-[#617589]">Managing areas for {formData.fullName}</p>
                  </div>
                  <div className="relative">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Link existing area..." 
                        value={linkSearch} 
                        onChange={(e) => setLinkSearch(e.target.value)}
                        className="pl-9 pr-3 h-10 w-full md:w-56 rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] bg-white dark:bg-[#25323e] text-xs focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
                      />
                    </div>
                    {linkSearch && (
                      <div className="absolute top-full right-0 w-full md:w-64 mt-1 bg-white dark:bg-[#1a2632] border border-[#dbe0e6] dark:border-[#2e3b4b] rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="max-h-48 overflow-y-auto">
                          {availableToLink.length > 0 ? (
                            availableToLink.map(a => (
                              <div 
                                key={a.id} 
                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center justify-between group/link"
                                onClick={() => handleLink(a.id)}
                              >
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium dark:text-white">{a.fullName}</span>
                                  <span className="text-[10px] text-gray-500 uppercase">{a.pinCode} | {a.shortName}</span>
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

                {feedbackMessage && (
                  <div className="mb-4 p-2 bg-primary/10 text-primary border border-primary/20 rounded text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    {feedbackMessage}
                  </div>
                )}

                <div className="bg-background-light dark:bg-[#15202b] rounded-lg border border-[#dbe0e6] dark:border-[#3e4c5a] overflow-hidden">
                  {associatedAreas.length > 0 ? (
                    <div className="divide-y divide-[#dbe0e6] dark:divide-[#2e3b4b]">
                      {associatedAreas.map((area) => (
                        <div key={area.id} className="flex items-center justify-between p-4 border-l-4 border-primary hover:bg-white dark:hover:bg-[#1a2632] transition-colors group/associated">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#111418] dark:text-white">{area.fullName}</span>
                            <span className="text-xs text-[#617589] dark:text-gray-400">{area.pinCode} | {area.shortName}</span>
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
                              onClick={() => handleUnlink(area.id)} 
                              className="text-gray-400 hover:text-red-600 transition-all p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Unlink from this district"
                            >
                              <span className="material-symbols-outlined">link_off</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-[#617589] dark:text-gray-400 text-sm italic">
                      No areas currently mapped to this district.
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
                            <div className={`absolute -left-[31px] top-1.5 size-6 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1a2632] shadow-sm z-10 ${styles.bg}`}>
                              <span className={`material-symbols-outlined text-[16px] ${styles.color}`}>{styles.icon}</span>
                            </div>
                            <div className="bg-white dark:bg-[#1a2632] rounded-lg p-4 border border-[#dbe0e6] dark:border-[#2e3b4b] shadow-sm hover:shadow-md transition-shadow group/card">
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

          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex items-center justify-end gap-3 border-t border-[#f0f2f4] dark:border-gray-800">
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-[#111418] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </button>
          </div>
        </form>

        <div className="text-center text-[#617589] dark:text-gray-500 text-sm py-10">
          <p>Need help? View the <a className="text-primary hover:underline" href="#">documentation</a> for district management guidelines.</p>
        </div>
      </div>
    </div>
  );
};
