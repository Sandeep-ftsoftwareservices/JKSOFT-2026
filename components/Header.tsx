
import React from 'react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onViewChange, 
  isDarkMode, 
  onToggleTheme,
  onToggleSidebar
}) => {
  return (
    <header className="flex flex-shrink-0 items-center justify-between whitespace-nowrap border-b border-solid border-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-surface-dark px-4 md:px-10 py-3 z-50">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden text-[#617589]"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-3 text-[#111418] dark:text-white cursor-pointer" onClick={() => onViewChange('dashboard')}>
          <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined text-2xl">public</span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">GeoAdmin</h2>
        </div>
      </div>

      <div className="flex flex-1 justify-end gap-3 md:gap-8 items-center">
        <div className="flex items-center gap-1 md:gap-4">
          <button className="p-2 rounded-full text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full text-[#617589] dark:text-gray-400 hover:text-primary transition-colors"
            title="Toggle Theme"
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button className="p-2 rounded-full text-[#617589] dark:text-gray-400 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        
        <div 
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-white dark:border-gray-700 shadow-sm ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer"
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQGlwSS3Y7FQTTItB2Bn9DbxtI66wmtpVgPHDZbGq25GP8J51033oFNuJsueMEH-1DgGit6E5EncXp1sKP7AjsSwkqwoKVVoXojR9MHpg1W007YvZ8BKE9aPEtsXrgSowfr6oxenlPp7U9Fco974QC9VYHXjUbOHziqj-jd8PYf2svlfFce-CrXA-ET8vawT7zq9rGgjIbQJ4z4kko9d05DCSPGEBPe5x7O3oDUoe4O69OowMnLaH51JlqSMVVJhOD3MPDsOr4y6rG")' }}
        />
      </div>
    </header>
  );
};
