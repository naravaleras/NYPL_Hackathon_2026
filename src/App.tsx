import React, { useState, useEffect } from 'react';
import { PollingSite, SupportedLanguage, UserVoterProfile } from './types';
import { SAMPLE_POLL_SITES, UPCOMING_DEADLINES } from './data/nycData';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { VoterOnboarding } from './components/VoterOnboarding';
import { VoterLandingDashboard } from './components/VoterLandingDashboard';
import { PollLookup } from './components/PollLookup';
import { NavigationModal } from './components/NavigationModal';
import { VotingChecklist } from './components/VotingChecklist';
import { DeadlinesCalendar } from './components/DeadlinesCalendar';
import { MachineSimulator } from './components/MachineSimulator';
import { BoeAiAssistant } from './components/BoeAiAssistant';
import { VoterPlanModal } from './components/VoterPlanModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Voter Profile State
  const [userProfile, setUserProfile] = useState<UserVoterProfile | null>(() => {
    try {
      const saved = localStorage.getItem('nyc_active_voter_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return null;
  });

  // Track if Onboarding Wizard Start Page is actively displayed
  const [isOnboardingActive, setIsOnboardingActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('nyc_active_voter_profile');
      return !saved; // If no profile saved, show start page wizard
    } catch {
      return true;
    }
  });

  // Navigation Modal State
  const [navSite, setNavSite] = useState<PollingSite | null>(null);
  const [userNavOrigin, setUserNavOrigin] = useState<string>('My Current Location');

  // Assistant Modal State
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // Voting Plan Modal State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);

  // Save profile to local storage whenever it updates
  useEffect(() => {
    try {
      if (userProfile) {
        localStorage.setItem('nyc_active_voter_profile', JSON.stringify(userProfile));
      }
    } catch {}
  }, [userProfile]);

  const handleCompleteOnboarding = (profile: UserVoterProfile) => {
    setUserProfile(profile);
    setIsOnboardingActive(false);
    setActiveTab('home');
  };

  const handleSkipToExplore = () => {
    setIsOnboardingActive(false);
    setActiveTab('polls');
  };

  const handleOpenStartPage = () => {
    setIsOnboardingActive(true);
  };

  const handleOpenNav = (site: PollingSite, userAddress?: string) => {
    setNavSite(site);
    if (userAddress) setUserNavOrigin(userAddress);
  };

  const handleCloseNav = () => {
    setNavSite(null);
  };

  // Calculate days away for next deadline
  const electionDay = UPCOMING_DEADLINES.find((d) => d.category === 'election_day');
  const daysAway = electionDay ? electionDay.daysRemaining : 80;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white bg-[radial-gradient(circle_at_top_right,_#e2e8f0,_transparent)]">
      {/* Official Sleek Header */}
      <Header
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        activeElectionDaysAway={daysAway}
        userProfile={userProfile}
        onOpenStartPage={handleOpenStartPage}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-3 sm:p-5 pb-28">
        {/* If Onboarding Start Page is active, display the 4-step wizard */}
        {isOnboardingActive ? (
          <VoterOnboarding
            onComplete={handleCompleteOnboarding}
            onSkipToExplore={handleSkipToExplore}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              userProfile ? (
                <VoterLandingDashboard
                  profile={userProfile}
                  onNavigateToTab={(tab) => setActiveTab(tab as TabType)}
                  onSelectSiteForNav={handleOpenNav}
                  onOpenVotingPlanModal={() => setIsPlanModalOpen(true)}
                  onRestartOnboarding={handleOpenStartPage}
                />
              ) : (
                <VoterOnboarding
                  onComplete={handleCompleteOnboarding}
                  onSkipToExplore={handleSkipToExplore}
                />
              )
            )}

            {activeTab === 'polls' && (
              <PollLookup
                onSelectSiteForNav={handleOpenNav}
                onOpenSampleBallot={(site) => {
                  handleOpenNav(site);
                }}
              />
            )}

            {activeTab === 'checklists' && (
              <VotingChecklist
                onOpenVotingPlanModal={() => setIsPlanModalOpen(true)}
                userProfile={userProfile}
              />
            )}

            {activeTab === 'deadlines' && <DeadlinesCalendar />}

            {activeTab === 'booth' && <MachineSimulator />}
          </>
        )}
      </main>

      {/* Native-style Bottom Navigation Dock */}
      <BottomNav
        activeTab={isOnboardingActive ? 'home' : activeTab}
        onSelectTab={(tab) => {
          setIsOnboardingActive(false);
          setActiveTab(tab);
        }}
        pendingChecklistCount={2}
        criticalDeadlineDays={daysAway}
        hasProfile={!!userProfile}
      />

      {/* Polling Place Navigation Pop-up Modal */}
      {navSite && (
        <NavigationModal
          site={navSite}
          userAddress={userNavOrigin}
          onClose={handleCloseNav}
        />
      )}

      {/* AI Assistant Modal */}
      {isAssistantOpen && (
        <BoeAiAssistant onClose={() => setIsAssistantOpen(false)} />
      )}

      {/* Voting Plan Summary Modal */}
      {isPlanModalOpen && (
        <VoterPlanModal
          selectedSite={navSite || userProfile?.assignedPollSite || SAMPLE_POLL_SITES[0]}
          onClose={() => setIsPlanModalOpen(false)}
        />
      )}
    </div>
  );
}

