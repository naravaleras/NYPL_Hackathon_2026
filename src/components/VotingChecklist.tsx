import React, { useState, useEffect } from 'react';
import { ChecklistItem, UserVoterProfile } from '../types';
import { VOTING_CHECKLIST_ITEMS, generateAutoPopulatedChecklist } from '../data/nycData';
import {
  CheckSquare,
  CheckCircle2,
  Circle,
  Sparkles,
  HelpCircle,
  Award,
  Share2,
  RotateCcw,
  ShieldAlert,
  Info,
  ChevronDown,
  ChevronUp,
  FileCheck,
  AlertTriangle,
  Accessibility,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VotingChecklistProps {
  onOpenVotingPlanModal: () => void;
  userProfile?: UserVoterProfile | null;
}

export const VotingChecklist: React.FC<VotingChecklistProps> = ({
  onOpenVotingPlanModal,
  userProfile,
}) => {
  // Load saved checklist state or use generated profile checklist or default
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    if (userProfile) {
      try {
        const key = `nyc_voter_checklist_${userProfile.vsn || userProfile.fullName}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {}
      return generateAutoPopulatedChecklist(userProfile);
    }

    try {
      const saved = localStorage.getItem('nyc_voting_checklist');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return VOTING_CHECKLIST_ITEMS;
  });

  const [activeCategory, setActiveCategory] = useState<
    'all' | 'inactive_recovery' | 'accessibility' | 'early_voting' | 'rights'
  >('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Sync when userProfile changes
  useEffect(() => {
    if (userProfile) {
      try {
        const key = `nyc_voter_checklist_${userProfile.vsn || userProfile.fullName}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          setItems(JSON.parse(saved));
          return;
        }
      } catch {}
      setItems(generateAutoPopulatedChecklist(userProfile));
    }
  }, [userProfile]);

  // Save to local storage on change
  useEffect(() => {
    try {
      const key = userProfile
        ? `nyc_voter_checklist_${userProfile.vsn || userProfile.fullName}`
        : 'nyc_voting_checklist';
      localStorage.setItem(key, JSON.stringify(items));
    } catch {}
  }, [items, userProfile]);

  const toggleItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });

      // Check if all essential items are now completed
      const allEssentialDone = updated
        .filter((item) => item.essential)
        .every((item) => item.completed);

      const wasAlreadyDone = prev
        .filter((item) => item.essential)
        .every((item) => item.completed);

      if (allEssentialDone && !wasAlreadyDone) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
        });
      }

      return updated;
    });
  };

  const handleResetChecklist = () => {
    if (confirm('Reset all checklist items to default state?')) {
      const reset = userProfile
        ? generateAutoPopulatedChecklist(userProfile)
        : VOTING_CHECKLIST_ITEMS.map((item) => ({ ...item, completed: false }));
      setItems(reset);
    }
  };

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const essentialCount = items.filter((i) => i.essential).length;
  const essentialDoneCount = items.filter((i) => i.essential && i.completed).length;
  const isAllEssentialComplete = essentialCount > 0 && essentialDoneCount === essentialCount;

  const hasInactiveCategory = items.some((i) => i.category === 'inactive_recovery');
  const hasAccessibilityCategory = items.some((i) => i.category === 'accessibility');

  return (
    <div className="space-y-5 pb-20">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
            {userProfile ? `Checklist for ${userProfile.fullName}` : 'Voting Day & Early Voting Checklist'}
          </span>
          <span className="text-xs text-blue-200 font-medium">Interactive Readiness</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            Auto-Populated Voting Checklist
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
            Tailored step-by-step guidance based on your verified voter record and accommodations.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-blue-950/70 p-4 rounded-xl border border-blue-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-orange-400" />
              <span>Overall Readiness Progress</span>
            </span>
            <span className="text-orange-400 font-mono">{progressPercent}% ({completedCount}/{totalCount} Completed)</span>
          </div>

          <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-blue-200 pt-0.5">
            <span>Essential Tasks: {essentialDoneCount} of {essentialCount}</span>
            {isAllEssentialComplete && (
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" />
                <span>Certified NYC Ready Voter!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Celebratory Badge Card when All Essential Done */}
      {isAllEssentialComplete && (
        <div className="bg-white border-l-4 border-emerald-500 rounded-2xl p-5 shadow-sm border-y border-r border-slate-200 flex items-center justify-between gap-3 animate-in zoom-in-95">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[10px] uppercase tracking-wider">
              <Award className="w-4 h-4 fill-current" />
              <span>Official Ready Voter Certified</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              You Are Fully Prepared to Cast Your Vote!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Export your custom Voting Plan summary or share your checklist with friends and family across NYC.
            </p>
          </div>

          <button
            onClick={onOpenVotingPlanModal}
            className="shrink-0 py-2.5 px-3.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>My Voting Plan</span>
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Items ({items.length})
        </button>

        {hasInactiveCategory && (
          <button
            onClick={() => setActiveCategory('inactive_recovery')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeCategory === 'inactive_recovery'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Reactivation Tasks</span>
          </button>
        )}

        {hasAccessibilityCategory && (
          <button
            onClick={() => setActiveCategory('accessibility')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              activeCategory === 'accessibility'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-800 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <Accessibility className="w-3 h-3" />
            <span>Accessibility</span>
          </button>
        )}

        <button
          onClick={() => setActiveCategory('early_voting')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeCategory === 'early_voting'
              ? 'bg-blue-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Early Voting
        </button>


      </div>

      {/* NY Voter ID Mythbusting Alert */}
      <div className="bg-white p-4 rounded-xl border-l-4 border-blue-600 shadow-sm space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-slate-900 text-xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>New York State Voter ID Law (Crucial Fact):</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed pl-5">
          In New York State, you do <strong>NOT need a photo ID</strong> to vote if you are already registered and provided your SSN or NYS DMV ID when signing up. You simply state your name and sign the electronic poll pad. Only first-time voters who didn't provide ID during registration need a basic utility bill or student/state ID.
        </p>
      </div>

      {/* Checklist Items List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span className="uppercase tracking-wider text-[11px] text-slate-400 font-bold">
            {filteredItems.length} Checklist Tasks
          </span>
          <button
            onClick={handleResetChecklist}
            className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset List</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 select-none ${
                item.completed
                  ? 'bg-slate-50 border-slate-200 opacity-80'
                  : item.category === 'inactive_recovery'
                  ? 'bg-amber-50/70 border-amber-300 hover:border-amber-400'
                  : item.category === 'accessibility'
                  ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                  : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-xs'
              }`}
            >
              {/* Checkbox Trigger */}
              <div className="mt-0.5 shrink-0">
                {item.completed ? (
                  <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div
                    className={`w-5 h-5 rounded-md border-2 ${
                      item.category === 'inactive_recovery'
                        ? 'border-amber-500 bg-white'
                        : 'border-slate-300 hover:border-blue-600 bg-white'
                    }`}
                  />
                )}
              </div>

              {/* Item Content */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={`text-sm font-bold leading-tight ${
                      item.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider ${
                        item.category === 'inactive_recovery'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.essential && (
                    <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                      Essential
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs leading-relaxed ${
                    item.completed ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {item.description}
                </p>

                {item.tip && (
                  <div className="text-[11px] text-blue-900 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100 mt-1 inline-block">
                    💡 <strong>NYC BOE Tip:</strong> {item.tip}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action to View or Export Plan */}
      <div className="pt-2">
        <button
          onClick={onOpenVotingPlanModal}
          className="w-full py-3 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 transition text-white text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4 text-orange-300" />
          <span>View & Export My NYC Voting Plan</span>
        </button>
      </div>

      {/* Need Help Box */}
      <div className="bg-slate-100 p-5 rounded-2xl border border-dashed border-slate-300">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Need Help?</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Call the NYC Board of Elections helpline at <strong className="text-slate-800">1-866-VOTE-NYC</strong> (1-866-868-3692) for assistance with voter records, language interpreters, or accessibility accommodations.
        </p>
      </div>
    </div>
  );
};

