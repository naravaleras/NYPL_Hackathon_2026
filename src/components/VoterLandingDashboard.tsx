import React, { useState } from 'react';
import {
  UserVoterProfile,
  ChecklistItem,
  PollingSite,
  SupportedLanguage
} from '../types';
import {
  generateAutoPopulatedChecklist,
  NYC_SUBWAY_COLORS
} from '../data/nycData';
import {
  CheckSquare,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Vote,
  Calendar,
  Sparkles,
  Award,
  Navigation,
  Accessibility,
  ArrowRight,
  RotateCcw,
  FileCheck,
  ShieldCheck,
  UserPlus,
  Share2,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VoterLandingDashboardProps {
  profile: UserVoterProfile;
  onNavigateToTab: (tab: 'polls' | 'register' | 'checklists' | 'deadlines' | 'booth') => void;
  onSelectSiteForNav: (site: PollingSite) => void;
  onOpenVotingPlanModal: () => void;
  onRestartOnboarding: () => void;
}

export const VoterLandingDashboard: React.FC<VoterLandingDashboardProps> = ({
  profile,
  onNavigateToTab,
  onSelectSiteForNav,
  onOpenVotingPlanModal,
  onRestartOnboarding,
}) => {
  // State for user's auto-populated checklist items
  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const storedKey = `nyc_voter_checklist_${profile.vsn || profile.fullName}`;
      const saved = localStorage.getItem(storedKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return generateAutoPopulatedChecklist(profile);
  });

  const [activeFilter, setActiveFilter] = useState<
    'all' | 'essential' | 'inactive_recovery' | 'accessibility' | 'voting_day'
  >('all');

  const toggleItem = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });

      try {
        const storedKey = `nyc_voter_checklist_${profile.vsn || profile.fullName}`;
        localStorage.setItem(storedKey, JSON.stringify(updated));
      } catch {}

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
    if (confirm('Reset your personalized checklist tasks?')) {
      const reset = generateAutoPopulatedChecklist(profile);
      setChecklist(reset);
      try {
        const storedKey = `nyc_voter_checklist_${profile.vsn || profile.fullName}`;
        localStorage.removeItem(storedKey);
      } catch {}
    }
  };

  const pollSite = profile.assignedPollSite;
  const earlySite = profile.earlyVotingSite || pollSite;

  const totalCount = checklist.length;
  const completedCount = checklist.filter((i) => i.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const essentialCount = checklist.filter((i) => i.essential).length;
  const essentialDoneCount = checklist.filter((i) => i.essential && i.completed).length;
  const isAllEssentialComplete = essentialCount > 0 && essentialDoneCount === essentialCount;

  const filteredItems = checklist.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'essential') return item.essential;
    if (activeFilter === 'inactive_recovery') return item.category === 'inactive_recovery';
    if (activeFilter === 'accessibility') return item.category === 'accessibility';
    if (activeFilter === 'voting_day') return item.category === 'early_voting' || item.category === 'election_day';
    return true;
  });

  const hasInactiveItems = checklist.some((i) => i.category === 'inactive_recovery');
  const hasAccessibilityItems = checklist.some((i) => i.category === 'accessibility');

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Top Welcome & Status Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Personalized Voter Hub
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                NYC BOE Verified
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Welcome, {profile.fullName}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {profile.streetAddress}, {profile.borough} (ZIP {profile.zip}) • {profile.party}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRestartOnboarding}
              className="text-xs font-bold text-slate-600 hover:text-blue-900 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Switch / Re-check VSN</span>
            </button>
          </div>
        </div>

        {/* Status Card based on Profile Status */}
        {profile.status === 'active' && (
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Registration Status: ACTIVE
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">
                    {profile.vsn}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  You are active on the official NYC voter roll. FastPass electronic poll book check-in ready.
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">
                No Photo ID Required
              </span>
            </div>
          </div>
        )}

        {profile.status === 'inactive' && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-950">
                    Registration Status: INACTIVE (Recovery Action Required)
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                    {profile.vsn}
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {profile.inactiveReason ||
                    'Your registration is inactive due to address verification mailer return. Your checklist below contains required reactivation steps.'}
                </p>
              </div>
            </div>
            <div className="pl-11 text-xs text-amber-950 bg-amber-100/60 p-2.5 rounded-lg border border-amber-200/80">
              <strong>Your Legal Right:</strong> Under New York State Election Law, you can still cast an <strong>Affidavit Ballot</strong> on voting day which will be counted upon address verification.
            </div>
          </div>
        )}

        {profile.status === 'unregistered' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <UserPlus className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    New Voter Track: Online Registration Generated
                  </span>
                  <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded">
                    10-Day Cutoff
                  </span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Your registration information has been formatted for the NYC Board of Elections. Ensure final submission at least 10 days before Election Day.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToTab('register')}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <span>View DMV Portal</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Accessibility Needs Summary Badge (If user indicated requirements) */}
        {profile.accessibility && Object.values(profile.accessibility).some(Boolean) && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mr-1">
              <Accessibility className="w-3.5 h-3.5 text-blue-600" />
              <span>Registered Accommodations:</span>
            </span>
            {profile.accessibility.ballotMarkingDevice && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                ♿ Ballot Marking Device (BMD)
              </span>
            )}
            {profile.accessibility.wheelchairRamp && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                🚪 Step-Free Ramp Entrance
              </span>
            )}
            {(profile.accessibility.largePrintBallot || profile.accessibility.audioScreenReader) && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                🔍 Large Print / Audio Reader
              </span>
            )}
            {profile.accessibility.languageAssistance && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                🗣️ Language Interpreter ({profile.accessibility.selectedLanguage?.toUpperCase() || 'ES'})
              </span>
            )}
            {profile.accessibility.curbsideSeating && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                🪑 Line Seating / Priority
              </span>
            )}
            {profile.accessibility.serviceAnimal && (
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                🐕 Service Animal Accommodated
              </span>
            )}
          </div>
        )}
      </div>

      {/* Quick Assigned Polling Site Card */}
      {pollSite && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Assigned Polling Place & Transit</span>
            </span>
            <span className="text-xs text-slate-300 font-mono">
              ED {pollSite.districtInfo.ed} • AD {pollSite.districtInfo.ad}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {pollSite.name}
              </h2>
              <p className="text-xs text-slate-300">
                {pollSite.address}, {pollSite.borough}, NY {pollSite.zip}
              </p>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <span>Accessible Entrance:</span> {pollSite.accessibleEntrance}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectSiteForNav(pollSite)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate via MTA Subway</span>
              </button>
            </div>
          </div>

          {/* Transit Lines Row */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Subways:</span>
            {pollSite.transit.subwayLines.map((line) => {
              const style = NYC_SUBWAY_COLORS[line] || { bg: '#00264d', text: '#fff' };
              return (
                <span
                  key={line}
                  style={{ backgroundColor: style.bg, color: style.text }}
                  className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shadow-xs"
                >
                  {line}
                </span>
              );
            })}
            <span className="text-slate-400 ml-2 font-medium">Nearest Station:</span>
            <span className="text-white font-semibold">{pollSite.transit.nearestStation}</span>
            <span className="text-slate-400">({pollSite.transit.walkMinutes} min walk)</span>
          </div>
        </div>
      )}

      {/* AUTO-POPULATED VOTER CHECKLIST SECTION */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Auto-Populated Voter Checklist
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Personalized roadmap automatically configured for your{' '}
              <strong className="text-slate-800">
                {profile.status === 'active'
                  ? 'Active Registration'
                  : profile.status === 'inactive'
                  ? 'Inactive Status Reactivation'
                  : 'New Voter Registration'}
              </strong>{' '}
              and accessibility preferences.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChecklist}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded transition cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={onOpenVotingPlanModal}
              className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Export Plan</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Readiness Badge */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>Overall Readiness Progress</span>
            <span className="text-blue-700 font-mono">
              {progressPercent}% ({completedCount}/{totalCount} Completed)
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isAllEssentialComplete ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Essential Tasks: {essentialDoneCount} of {essentialCount} completed</span>
            {isAllEssentialComplete && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                <span>Certified Ready Voter!</span>
              </span>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Tasks ({checklist.length})
          </button>

          <button
            onClick={() => setActiveFilter('essential')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFilter === 'essential'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Essential Only ({essentialCount})
          </button>

          {hasInactiveItems && (
            <button
              onClick={() => setActiveFilter('inactive_recovery')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'inactive_recovery'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Status Reactivation Tasks</span>
            </button>
          )}

          {hasAccessibilityItems && (
            <button
              onClick={() => setActiveFilter('accessibility')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'accessibility'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
              }`}
            >
              <Accessibility className="w-3 h-3" />
              <span>Accessibility Accommodations</span>
            </button>
          )}

          <button
            onClick={() => setActiveFilter('voting_day')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeFilter === 'voting_day'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Voting Day & Transit
          </button>
        </div>

        {/* Checklist Item Cards List */}
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

      {/* Quick Launch Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateToTab('polls')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-xs transition text-left space-y-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Poll Sites & Map</h3>
            <p className="text-[11px] text-slate-500">Live directions, hours, wait times.</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateToTab('booth')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-xs transition text-left space-y-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Vote className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">DS200 Demo Booth</h3>
            <p className="text-[11px] text-slate-500">Practice Ranked Choice Voting.</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateToTab('deadlines')}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-xs transition text-left space-y-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Election Deadlines</h3>
            <p className="text-[11px] text-slate-500">Registration & Early Voting dates.</p>
          </div>
        </button>
      </div>
    </div>
  );
};
