import React, { useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Accessibility,
  HeartHandshake,
  Vote,
  Compass,
  FileCheck,
  Calendar,
  MapPin,
  Info,
  ChevronRight,
  Eye,
  CheckSquare,
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import {
  Borough,
  UserVoterProfile,
  AccessibilityNeeds,
  VoterRecord,
  SupportedLanguage,
  PollingSite
} from '../types';
import {
  SAMPLE_POLL_SITES,
  MOCK_VSN_RECORDS,
  lookupVsnRecord,
  NYC_LANGUAGES
} from '../data/nycData';

interface VoterOnboardingProps {
  onCompleteOnboarding: (profile: UserVoterProfile) => void;
  initialProfile?: UserVoterProfile | null;
  onCancel?: () => void;
}

export const VoterOnboarding: React.FC<VoterOnboardingProps> = ({
  onCompleteOnboarding,
  initialProfile,
  onCancel,
}) => {
  // Wizard steps: 'choose_track' | 'vsn_lookup' | 'new_voter_form' | 'accessibility_form' | 'vsn_result_review'
  const [step, setStep] = useState<
    'choose_track' | 'vsn_lookup' | 'new_voter_form' | 'accessibility_form' | 'vsn_result_review'
  >('choose_track');

  const [selectedTrack, setSelectedTrack] = useState<'new_voter' | 'existing_voter'>('new_voter');

  // VSN Lookup Form State
  const [vsnInput, setVsnInput] = useState<string>('');
  const [vsnError, setVsnError] = useState<string | null>(null);
  const [validatedRecord, setValidatedRecord] = useState<VoterRecord | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // New Voter Registration Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '2004-06-15',
    borough: 'Manhattan' as Borough,
    streetAddress: '',
    apt: '',
    zip: '10003',
    party: 'Democratic Party',
    isUsCitizen: true,
    is18OrOlderByElection: true,
    email: '',
    phone: '',
  });

  // Accessibility Requirements Form State
  const [accessibility, setAccessibility] = useState<AccessibilityNeeds>({
    ballotMarkingDevice: false,
    wheelchairRamp: false,
    audioScreenReader: false,
    largePrintBallot: false,
    languageAssistance: false,
    selectedLanguage: 'en',
    curbsideSeating: false,
    serviceAnimal: false,
    notes: '',
  });

  // Handle choosing track
  const handleSelectTrack = (track: 'new_voter' | 'existing_voter') => {
    setSelectedTrack(track);
    if (track === 'existing_voter') {
      setStep('vsn_lookup');
    } else {
      setStep('new_voter_form');
    }
  };

  // Quick fill sample for New Voter Registration
  const handlePrefillNewVoter = () => {
    setFormData({
      fullName: 'Maya Lin',
      dob: '2005-09-18',
      borough: 'Manhattan',
      streetAddress: '319 East 19th Street',
      apt: '4B',
      zip: '10003',
      party: 'Democratic Party',
      isUsCitizen: true,
      is18OrOlderByElection: true,
      email: 'maya.lin@example.com',
      phone: '(212) 555-0199',
    });
  };

  // Perform VSN Lookup
  const handlePerformVsnLookup = (queryOverride?: string) => {
    const q = queryOverride !== undefined ? queryOverride : vsnInput;
    if (!q.trim()) {
      setVsnError('Please enter a Voter Serial Number (VSN) or voter name.');
      return;
    }

    setIsSearching(true);
    setVsnError(null);

    setTimeout(() => {
      setIsSearching(false);
      const record = lookupVsnRecord(q);

      if (record) {
        setValidatedRecord(record);
        setStep('vsn_result_review');
      } else {
        setVsnError(
          `No voter record matching "${q}" was found on the official NYC voter rolls. Would you like to register as a new voter?`
        );
      }
    }, 350);
  };

  // Select a preset VSN demo card
  const handleSelectPresetVsn = (record: VoterRecord) => {
    setVsnInput(record.vsn);
    setValidatedRecord(record);
    setVsnError(null);
    setStep('vsn_result_review');
  };

  // Helper to get matching poll site
  const getAssignedPollSite = (borough: Borough, pollSiteId?: string): PollingSite => {
    if (pollSiteId) {
      const found = SAMPLE_POLL_SITES.find((s) => s.id === pollSiteId);
      if (found) return found;
    }
    const boroughSite = SAMPLE_POLL_SITES.find((s) => s.borough === borough);
    return boroughSite || SAMPLE_POLL_SITES[0];
  };

  // Continue to Accessibility step
  const handleProceedToAccessibility = () => {
    setStep('accessibility_form');
  };

  // Finalize Onboarding & Generate User Profile
  const handleFinalizeProfile = () => {
    let finalProfile: UserVoterProfile;

    if (selectedTrack === 'existing_voter' && validatedRecord) {
      const assignedPoll = getAssignedPollSite(validatedRecord.borough, validatedRecord.assignedPollSiteId);
      const earlyPoll = getAssignedPollSite(validatedRecord.borough, validatedRecord.earlyVotingSiteId);

      finalProfile = {
        track: 'existing_voter',
        vsn: validatedRecord.vsn,
        isRegistered: true,
        status: validatedRecord.status,
        inactiveReason: validatedRecord.inactiveReason,
        fullName: validatedRecord.fullName,
        dob: validatedRecord.dob,
        borough: validatedRecord.borough,
        streetAddress: validatedRecord.streetAddress,
        zip: validatedRecord.zip,
        party: validatedRecord.party,
        isUsCitizen: true,
        is18OrOlderByElection: true,
        accessibility: accessibility,
        assignedPollSite: assignedPoll,
        earlyVotingSite: earlyPoll,
      };
    } else {
      // New Voter Track
      const assignedPoll = getAssignedPollSite(formData.borough);
      finalProfile = {
        track: 'new_voter',
        vsn: `VSN-PENDING-${Math.floor(100000 + Math.random() * 900000)}`,
        isRegistered: false,
        status: 'unregistered',
        fullName: formData.fullName || 'New NYC Voter',
        dob: formData.dob,
        borough: formData.borough,
        streetAddress: formData.streetAddress || '123 Broadway',
        apt: formData.apt,
        zip: formData.zip || '10003',
        email: formData.email,
        phone: formData.phone,
        party: formData.party,
        isUsCitizen: formData.isUsCitizen,
        is18OrOlderByElection: formData.is18OrOlderByElection,
        accessibility: accessibility,
        assignedPollSite: assignedPoll,
        earlyVotingSite: assignedPoll,
        registrationCompletedAt: new Date().toISOString(),
      };
    }

    onCompleteOnboarding(finalProfile);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Step Indicator Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold uppercase tracking-wider">
          <Vote className="w-3.5 h-3.5 text-blue-600" />
          <span>NYC Voter Onboarding & Verification Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to NYC Voter Navigator
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Verify your registration status or complete your online registration in under 2 minutes.
        </p>
      </div>

      {/* STEP 1: CHOOSE TRACK (New Voter vs. Existing Voter) */}
      {step === 'choose_track' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 text-center">
              Are you registering for the first time, or checking an existing NYC registration?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: New Voter Track */}
              <button
                id="btn-track-new-voter"
                onClick={() => handleSelectTrack('new_voter')}
                className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 text-left transition-all flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
                    <UserPlus className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-1">
                      Track 1
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900">
                      I am a New Voter
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      First-time voter in NYC, just moved to New York, or never registered before.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>Register & Setup Checklist</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Existing Voter Track (VSN Validation) */}
              <button
                id="btn-track-existing-voter"
                onClick={() => handleSelectTrack('existing_voter')}
                className="group p-5 rounded-2xl border-2 border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/50 text-left transition-all flex flex-col justify-between space-y-4 cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
                    <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-1">
                      Track 2
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-900">
                      I am an Existing Voter
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Validate registration using your Voter Serial Number (VSN) or name lookup.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Validate VSN Status</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            {/* Reassuring NYC Guarantee Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  Official New York City Board of Elections Guidelines
                </p>
                <p>
                  New York voters must register at least <strong>10 days before an election</strong>. Existing active voters do not need photo ID at the polls.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2A: VSN LOOKUP FOR EXISTING VOTERS */}
      {step === 'vsn_lookup' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('choose_track')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                ← Back to Options
              </button>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Track 2: VSN Verification
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Validate Your Voter Serial Number (VSN)
              </h2>
              <p className="text-xs text-slate-500">
                Enter your 9-digit NYC Voter Serial Number found on your BOE mailer, or search by your legal name.
              </p>
            </div>

            {/* VSN Input Bar */}
            <div className="space-y-2">
              <label htmlFor="vsn-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Voter Serial Number (VSN) or Full Name
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="vsn-input"
                    type="text"
                    value={vsnInput}
                    onChange={(e) => setVsnInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePerformVsnLookup()}
                    placeholder="e.g. VSN-847291-NYC or Taylor Rivera"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                  />
                </div>
                <button
                  id="btn-submit-vsn-lookup"
                  onClick={() => handlePerformVsnLookup()}
                  disabled={isSearching}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSearching ? (
                    <span>Validating...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Status</span>
                    </>
                  )}
                </button>
              </div>

              {vsnError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start justify-between gap-2 mt-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>{vsnError}</span>
                  </div>
                  <button
                    onClick={() => handleSelectTrack('new_voter')}
                    className="text-xs font-bold underline text-red-900 shrink-0 hover:text-red-700 cursor-pointer"
                  >
                    Register as New Voter →
                  </button>
                </div>
              )}
            </div>

            {/* Quick Demo Testing Records */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick Test with Sample Voter Records:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MOCK_VSN_RECORDS.slice(0, 4).map((rec) => (
                  <button
                    key={rec.vsn}
                    onClick={() => handleSelectPresetVsn(rec)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/40 text-left transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{rec.fullName}</span>
                        {rec.status === 'active' ? (
                          <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                            INACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {rec.vsn} • {rec.borough}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2B: VSN RESULT REVIEW (Active or Inactive Confirmation) */}
      {step === 'vsn_result_review' && validatedRecord && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('vsn_lookup')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                ← Test Another VSN
              </button>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                {validatedRecord.vsn}
              </span>
            </div>

            {/* Status Banner */}
            {validatedRecord.status === 'active' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-emerald-900">
                      Registration Status: ACTIVE
                    </h3>
                    <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                      FastPass Ready
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    You are confirmed on the official active NYC voter rolls. You are ready to vote at your assigned poll site during Early Voting or Election Day.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-amber-950">
                      Registration Status: INACTIVE
                    </h3>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                      Action Required
                    </span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    {validatedRecord.inactiveReason ||
                      'Your registration is inactive due to an address confirmation or non-voting period.'}
                  </p>
                  <p className="text-xs text-amber-950 font-semibold pt-1">
                    Good news: Your customized checklist will guide you through simple reactivation steps and your guaranteed legal right to cast an Affidavit Ballot.
                  </p>
                </div>
              </div>
            )}

            {/* Voter Details Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Voter Record Details
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Legal Name</span>
                  <span className="font-bold text-slate-900">{validatedRecord.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Registered Address</span>
                  <span className="font-semibold text-slate-800">{validatedRecord.streetAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Borough & ZIP</span>
                  <span className="font-semibold text-slate-800">{validatedRecord.borough}, {validatedRecord.zip}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Party Affiliation</span>
                  <span className="font-semibold text-slate-800">{validatedRecord.party}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Election District (ED/AD)</span>
                  <span className="font-mono font-semibold text-slate-800">ED {validatedRecord.ed} / AD {validatedRecord.ad}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Voter Serial No. (VSN)</span>
                  <span className="font-mono font-bold text-blue-700">{validatedRecord.vsn}</span>
                </div>
              </div>
            </div>

            {/* Continue Button to Accessibility */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="btn-vsn-proceed-acc"
                onClick={handleProceedToAccessibility}
                className="flex-1 py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Accessibility & Needs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: TRACK 1 - ONLINE VOTER REGISTRATION FORM */}
      {step === 'new_voter_form' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('choose_track')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                ← Back to Options
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrefillNewVoter}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 transition cursor-pointer"
                >
                  ⚡ Auto-fill Sample Resident
                </button>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  Track 1: Online BOE Form
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                NYC Board of Elections Voter Registration Form
              </h2>
              <p className="text-xs text-slate-500">
                Complete your details below to generate your official online registration and customized checklist.
              </p>
            </div>

            {/* Registration Input Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reg-fullname" className="block text-xs font-bold text-slate-700">
                    Full Legal Name *
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-dob" className="block text-xs font-bold text-slate-700">
                    Date of Birth (16+ to Pre-register) *
                  </label>
                  <input
                    id="reg-dob"
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label htmlFor="reg-address" className="block text-xs font-bold text-slate-700">
                    NYC Street Address *
                  </label>
                  <input
                    id="reg-address"
                    type="text"
                    required
                    value={formData.streetAddress}
                    onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                    placeholder="e.g. 319 East 19th Street"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-apt" className="block text-xs font-bold text-slate-700">
                    Apt / Suite
                  </label>
                  <input
                    id="reg-apt"
                    type="text"
                    value={formData.apt}
                    onChange={(e) => setFormData({ ...formData, apt: e.target.value })}
                    placeholder="Apt 4B"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="reg-borough" className="block text-xs font-bold text-slate-700">
                    Borough *
                  </label>
                  <select
                    id="reg-borough"
                    value={formData.borough}
                    onChange={(e) => setFormData({ ...formData, borough: e.target.value as Borough })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Manhattan">Manhattan</option>
                    <option value="Brooklyn">Brooklyn</option>
                    <option value="Queens">Queens</option>
                    <option value="Bronx">Bronx</option>
                    <option value="Staten Island">Staten Island</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-zip" className="block text-xs font-bold text-slate-700">
                    NYC ZIP Code *
                  </label>
                  <input
                    id="reg-zip"
                    type="text"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    placeholder="10003"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="reg-party" className="block text-xs font-bold text-slate-700">
                  Party Enrollment (Required to vote in NY Closed Primary Elections)
                </label>
                <select
                  id="reg-party"
                  value={formData.party}
                  onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Democratic Party">Democratic Party</option>
                  <option value="Republican Party">Republican Party</option>
                  <option value="Working Families Party">Working Families Party</option>
                  <option value="Conservative Party">Conservative Party</option>
                  <option value="No Party Affiliation (Independent)">No Party Affiliation (Independent / General Elections Only)</option>
                </select>
              </div>

              {/* Eligibility Checkboxes */}
              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isUsCitizen}
                    onChange={(e) => setFormData({ ...formData, isUsCitizen: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>I certify that I am a United States citizen and NYC resident.</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is18OrOlderByElection}
                    onChange={(e) => setFormData({ ...formData, is18OrOlderByElection: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>I am at least 18 years old (or 16–17 for NY youth pre-registration).</span>
                </label>
              </div>
            </div>

            {/* Next Step Button */}
            <div className="pt-2">
              <button
                id="btn-reg-proceed-acc"
                onClick={handleProceedToAccessibility}
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Save & Continue to Accessibility Needs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: ACCESSIBILITY REQUIREMENTS & ACCOMMODATIONS QUESTIONNAIRE */}
      {step === 'accessibility_form' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (selectedTrack === 'existing_voter') {
                    setStep('vsn_result_review');
                  } else {
                    setStep('new_voter_form');
                  }
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                ← Back to Profile
              </button>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Accessibility className="w-3 h-3" />
                <span>Accessibility & Assistance</span>
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Accessibility Requirements & Accommodations
              </h2>
              <p className="text-xs text-slate-500">
                Tell us any accommodations you need. Your auto-populated checklist will highlight verified entrances, ballot devices, and language options for your assigned site.
              </p>
            </div>

            {/* Accessibility Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* BMD */}
              <label
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  accessibility.ballotMarkingDevice
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessibility.ballotMarkingDevice}
                  onChange={(e) =>
                    setAccessibility({ ...accessibility, ballotMarkingDevice: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Ballot Marking Device (BMD)
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Audio tactile controller, sip-and-puff, rocker paddle, and touch screen marking.
                  </span>
                </div>
              </label>

              {/* Wheelchair Ramp */}
              <label
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  accessibility.wheelchairRamp
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessibility.wheelchairRamp}
                  onChange={(e) =>
                    setAccessibility({ ...accessibility, wheelchairRamp: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Wheelchair / Step-Free Ramp Entrance
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Highlight zero-threshold entrances and elevator pathways at your assigned poll site.
                  </span>
                </div>
              </label>

              {/* Large Print & Audio Screen Reader */}
              <label
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  accessibility.largePrintBallot || accessibility.audioScreenReader
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessibility.largePrintBallot || accessibility.audioScreenReader}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setAccessibility({
                      ...accessibility,
                      largePrintBallot: checked,
                      audioScreenReader: checked,
                    });
                  }}
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Large Print & Audio Screen Reader
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Magnified ballot text, high-contrast display, or headphone audio readouts.
                  </span>
                </div>
              </label>

              {/* Language Assistance */}
              <label
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  accessibility.languageAssistance
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessibility.languageAssistance}
                  onChange={(e) =>
                    setAccessibility({ ...accessibility, languageAssistance: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Language Interpreter or Multi-Lingual Ballot
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Ballots & interpreters in Spanish, Chinese, Bengali, Korean, Hindi, or ASL.
                  </span>
                </div>
              </label>

              {/* Line Seating */}
              <label
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  accessibility.curbsideSeating
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessibility.curbsideSeating}
                  onChange={(e) =>
                    setAccessibility({ ...accessibility, curbsideSeating: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Line Seating & Priority Queueing
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Chair accommodations while waiting in line or expedited check-in assistance.
                  </span>
                </div>
              </label>

              {/* Service Animal */}
              <label
                className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 ${
                  accessibility.serviceAnimal
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={accessibility.serviceAnimal}
                  onChange={(e) =>
                    setAccessibility({ ...accessibility, serviceAnimal: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 block">
                    Service Animal Accommodation
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Guide dogs and service animals are legally permitted in all NYC polling areas.
                  </span>
                </div>
              </label>
            </div>

            {/* Language Selection if Language Assistance is checked */}
            {accessibility.languageAssistance && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <label htmlFor="select-acc-lang" className="block text-xs font-bold text-blue-900">
                  Select Primary Language for Assistance:
                </label>
                <select
                  id="select-acc-lang"
                  value={accessibility.selectedLanguage || 'en'}
                  onChange={(e) =>
                    setAccessibility({
                      ...accessibility,
                      selectedLanguage: e.target.value as SupportedLanguage,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="es">Spanish (Español)</option>
                  <option value="zh">Chinese (中文 - 繁體 / 简体)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="ko">Korean (한국어)</option>
                  <option value="hindi">Hindi (हिन्दी)</option>
                  <option value="asl">ASL (American Sign Language Video Remote)</option>
                </select>
              </div>
            )}

            {/* Redirect to Auto-Populated Dashboard */}
            <div className="pt-3">
              <button
                id="btn-finalize-onboarding"
                onClick={handleFinalizeProfile}
                className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Redirect to Auto-Populated Voter Checklist →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
