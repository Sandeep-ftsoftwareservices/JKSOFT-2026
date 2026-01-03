
import React, { useState, useMemo, useEffect } from 'react';
import { AreaDetails, ViewType } from '../types';
import { Breadcrumbs } from './Breadcrumbs';

interface AreaListPageProps {
  areas: AreaDetails[];
  onEdit: (area: AreaDetails) => void;
  onView: (area: AreaDetails) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onNavigate: (view: ViewType) => void;
}

type SortConfig = {
  key: keyof AreaDetails;
  direction: 'asc' | 'desc';
} | null;

export const AreaListPage: React.FC<AreaListPageProps> = ({ 
  areas, 
  onEdit, 
  onView,
  onAdd, 
  onDelete,
  onNavigate 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleSort = (key: keyof AreaDetails) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const processedAreas = useMemo(() => {
    let result = areas.filter(a => 
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.pinCode.includes(searchTerm) ||
      a.district.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === undefined || valB === undefined) return 0;
        if (valA === valB) return 0;
        const comparison = valA < valB ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [areas, searchTerm, sortConfig]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(processedAreas.length / pageSize);
  const paginatedAreas = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedAreas.slice(start, start + pageSize);
  }, [processedAreas, currentPage]);

  const HeaderCell = ({ label, columnKey }: { label: string, columnKey: keyof AreaDetails }) => (
    <th 
      className="p-4 text-sm font-semibold text-[#111418] dark:text-white cursor-pointer select-none group hover:bg-gray-100 dark:hover:bg-[#2e3b4b] transition-colors whitespace-nowrap"
      onClick={() => handleSort(columnKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortConfig?.key === columnKey ? (
          <span className="material-symbols-outlined text-[16px] text-primary">
            {sortConfig.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'}
          </span>
        ) : (
          <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-50 transition-opacity">unfold_more</span>
        )}
      </div>
    </th>
  );

  return (
    <div className="px-4 md:p-8 lg:px-12 flex flex-col flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto flex flex-col flex-1 w-full gap-6">
        <Breadcrumbs currentView="areas" onNavigate={onNavigate} />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 px-4">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-[#111418] dark:text-white tracking-light text-[32px] font-bold leading-tight">Areas</h1>
            <p className="text-[#617589] dark:text-gray-400 text-sm font-normal leading-normal">Manage geographic areas and pin codes.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border border-[#dbe0e6] dark:border-[#3e4c5a] rounded-lg leading-5 bg-white dark:bg-[#25323e] text-[#111418] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm transition-all" 
                placeholder="Search areas..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={onAdd}
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-bold bg-primary text-white hover:bg-blue-600 shadow-sm transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add Area
            </button>
          </div>
        </div>

        <div className="mx-4 bg-white dark:bg-[#1a2632] rounded-xl shadow-sm border border-[#dbe0e6] dark:border-[#2e3b4b] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#25323e] border-b border-[#dbe0e6] dark:border-[#2e3b4b]">
                  <HeaderCell label="Full Name" columnKey="fullName" />
                  <HeaderCell label="Short Name" columnKey="shortName" />
                  <HeaderCell label="Pin Code" columnKey="pinCode" />
                  <HeaderCell label="District" columnKey="district" />
                  <HeaderCell label="Status" columnKey="isActive" />
                  <th className="p-4 text-sm font-semibold text-[#111418] dark:text-white text-right whitespace-nowrap w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dbe0e6] dark:divide-[#2e3b4b]">
                {paginatedAreas.map((area) => (
                  <tr key={area.id} className="hover:bg-gray-50 dark:hover:bg-[#25323e]/50 transition-colors group">
                    <td className="p-4 text-sm font-medium text-[#111418] dark:text-white">{area.fullName}</td>
                    <td className="p-4 text-sm text-[#617589] dark:text-gray-300">{area.shortName}</td>
                    <td className="p-4 text-sm text-[#617589] dark:text-gray-300 font-mono">{area.pinCode}</td>
                    <td className="p-4 text-sm text-[#617589] dark:text-gray-300">{area.district}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        area.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${area.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        {area.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onView(area)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" 
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                        <button 
                          onClick={() => onEdit(area)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" 
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button 
                          onClick={() => onDelete(area.id)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" 
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {processedAreas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No areas found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {processedAreas.length > 0 && (
            <div className="flex items-center justify-between border-t border-[#dbe0e6] dark:border-[#2e3b4b] bg-gray-50 dark:bg-[#25323e] px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-[#15202b] dark:border-gray-600 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-[#15202b] dark:border-gray-600 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-400">
                    Showing <span className="font-medium text-[#111418] dark:text-white">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-[#111418] dark:text-white">{Math.min(currentPage * pageSize, processedAreas.length)}</span> of <span className="font-medium text-[#111418] dark:text-white">{processedAreas.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-[#15202b] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                          currentPage === pageNum
                            ? 'z-10 bg-primary text-white focus-visible:outline-primary'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-[#15202b]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-[#15202b] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
