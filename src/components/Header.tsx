import React from 'react';
import { SupportedLanguage, UserVoterProfile } from '../types';
import { NYC_LANGUAGES } from '../data/nycData';
import { Phone, ShieldCheck, Languages, AlertCircle, Sparkles, AlertTriangle, UserPlus, RotateCcw } from 'lucide-react';

interface HeaderProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenAssistant: () => void;
  activeElectionDaysAway: number;
  userProfile?: UserVoterProfile | null;
  onOpenStartPage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onLanguageChange,
  onOpenAssistant,
  activeElectionDaysAway,
  userProfile,
  onOpenStartPage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-blue-900 border-b border-blue-200 shadow-xs">


      {/* Main Sleek Header Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand & Seal */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-10 rounded-xl overflow-hidden flex flex-col shadow-sm shrink-0 border border-slate-700">
            <div className="h-1/2 bg-red-600 flex items-center justify-center">
              <span className="text-white font-black text-[9px] tracking-tight">VOTE</span>
            </div>
            <div className="h-1/2 bg-white flex items-center justify-center">
              <span className="text-red-600 font-black text-[9px] tracking-tight">NYC</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base sm:text-lg leading-tight uppercase tracking-tight text-white">
                Board of Elections
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-blue-800 text-blue-100 border border-blue-700 rounded-md">
                <ShieldCheck className="w-3 h-3 text-blue-300" />
                Verified Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Official Voter Gateway & Polling Navigator
            </p>
          </div>
        </div>

        {/* Right Stats & Action Controls */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Next Election Date Badge */}
          <div className="hidden sm:block text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest leading-none">Next Election</p>
            <p className="font-bold text-xs sm:text-sm text-blue-900 mt-0.5">General: Nov 3, 2026</p>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100 transition rounded-xl border border-slate-200 px-2.5 py-1.5">
            <Languages className="w-3.5 h-3.5 text-blue-700 mr-1.5 shrink-0" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
              className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer pr-1"
              aria-label="Select Language"
            >
              {NYC_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-slate-900">
                  {lang.localLabel}
                </option>
              ))}
            </select>
          </div>

          {/* Quick AI Help Button */}
          <button
            onClick={onOpenAssistant}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 transition text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm shrink-0"
            title="Ask AI Voting Assistant"
          >
            <span>Ask BOE AI</span>
          </button>
        </div>
      </div>

    </header>
  );
};
