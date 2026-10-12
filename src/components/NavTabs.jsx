import React from 'react';
import { Users, Settings, Award, Compass, BarChart3, Database } from 'lucide-react';

export default function NavTabs({ activeTab, onSelectTab }) {
  const mainTabs = [
    { id: 'presentation', label: 'Presentación', icon: Compass },
    { id: 'seasons', label: 'Temporadas', icon: BarChart3 },
    { id: 'mycareer', label: 'Mi carrera', icon: Award },
    { id: 'database', label: 'Base de Datos', icon: Database }
  ];

  const rightTabs = [
    { id: 'community', label: 'Comunidad', icon: Users },
    { id: 'settings', label: 'Ajustes', icon: Settings }
  ];

  return (
    <div className="bg-[#0c111a] border-b border-[#1b2537] px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Main navigation tabs */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          {mainTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`py-3.5 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 ${
                  isActive 
                    ? 'text-white font-bold' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00ff87] rounded-t-full shadow-[0_-2px_8px_#00ff87]"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right side utility tabs */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
          {rightTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:text-white transition-colors ${
                  isActive ? 'text-[#00ff87] bg-[#00ff87]/10' : ''
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
