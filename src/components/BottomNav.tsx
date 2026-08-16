import React from 'react';
import { Home, MapPin, CheckSquare, Calendar, Vote } from 'lucide-react';

export type TabType = 'home' | 'polls' | 'checklists' | 'deadlines' | 'booth';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingChecklistCount: number;
  criticalDeadlineDays: number;
  hasProfile?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  pendingChecklistCount,
  criticalDeadlineDays,
  hasProfile,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'My Hub',
      sublabel: 'Profile & Status',
      icon: Home,
      badge: hasProfile ? undefined : 'Start',
    },
    {
      id: 'polls' as TabType,
      label: 'Polls',
      sublabel: 'Find & Navigate',
      icon: MapPin,
    },
    {
      id: 'checklists' as TabType,
      label: 'Checklist',
      sublabel: 'Voting Plan',
      icon: CheckSquare,
      badge: pendingChecklistCount > 0 ? pendingChecklistCount : undefined,
    },
    {
      id: 'deadlines' as TabType,
      label: 'Dates',
      sublabel: 'Deadlines',
      icon: Calendar,
      badge: criticalDeadlineDays <= 70 ? 'Soon' : undefined,
    },
    {
      id: 'booth' as TabType,
      label: 'Booth',
      sublabel: 'Practice',
      icon: Vote,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Dock"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-lg mx-auto grid grid-cols-5 px-1 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-blue-900 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              {/* Active Indicator Pip */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-blue-600" />
              )}

              <div className="relative">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-900' : 'bg-transparent text-slate-500'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5] text-blue-700' : 'stroke-[1.75]'}`} />
                </div>

                {tab.badge !== undefined && (
                  <span
                    className={`absolute -top-1 -right-2 px-1 min-w-[15px] h-3.5 rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs ${
                      typeof tab.badge === 'string'
                        ? 'bg-orange-500 text-white px-1'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] leading-tight mt-0.5 tracking-tight line-clamp-1 ${isActive ? 'text-blue-900 font-bold' : 'text-slate-500 font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

