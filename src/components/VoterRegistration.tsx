import React, { useState } from 'react';
import { Borough } from '../types';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Download,
  AlertCircle,
  Sparkles,
  HelpCircle,
  FileCheck,
  Building,
  ShieldCheck,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VoterRegistration: React.FC = () => {
  // Eligibility states
  const [isCitizen, setIsCitizen] = useState<boolean | null>(null);
  const [ageCategory, setAgeCategory] = useState<'18plus' | '16-17' | 'under16' | null>(null);
  const [isNycResident30Days, setIsNycResident30Days] = useState<boolean | null>(null);
  const [notInPrison, setNotInPrison] = useState<boolean | null>(null);

  // Active registration tab
  const [regMode, setRegMode] = useState<'online_dmv' | 'online_ny' | 'paper_form' | 'pre_reg'>('online_dmv');

  // Interactive Form State for voter readiness
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    borough: 'Brooklyn' as Borough,
    street: '',
    zip: '',
    party: 'No Party / Blank (Independent)',
    hasDmvId: true,
  });

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // Check eligibility logic
  const isFullyEligible =
    isCitizen === true &&
    ageCategory === '18plus' &&
    isNycResident30Days === true &&
    notInPrison === true;

  const isPreRegEligible =
    isCitizen === true &&
    ageCategory === '16-17' &&
    isNycResident30Days === true &&
    notInPrison === true;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
            NYC Board of Elections
          </span>
          <span className="text-xs text-blue-200 font-medium">First-Time Voter Guide</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            Register to Vote in New York City
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
            Voting in NYC is easy! In New York State, you must be registered at least{' '}
            <strong className="text-orange-300 font-bold">10 days before an election</strong> to vote.
          </p>
        </div>
      </div>

      {/* Interactive Eligibility Checker */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Step 1: Check Your NYC Voter Eligibility
            </h3>
            <p className="text-xs text-slate-500">Answer 4 quick questions below</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Question 1: Citizenship */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>1. Are you a United States Citizen?</span>
              {isCitizen === true && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isCitizen === false && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCitizen(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  isCitizen === true
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Yes, U.S. Citizen
              </button>
              <button
                type="button"
                onClick={() => setIsCitizen(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  isCitizen === false
                    ? 'bg-rose-700 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Question 2: Age */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>2. What is your age?</span>
              {ageCategory === '18plus' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {ageCategory === '16-17' && <Sparkles className="w-4 h-4 text-orange-500" />}
              {ageCategory === 'under16' && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setAgeCategory('18plus')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold transition text-center ${
                  ageCategory === '18plus'
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                18 or older
              </button>
              <button
                type="button"
                onClick={() => setAgeCategory('16-17')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold transition text-center ${
                  ageCategory === '16-17'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                16–17 (Pre-Reg)
              </button>
              <button
                type="button"
                onClick={() => setAgeCategory('under16')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold transition text-center ${
                  ageCategory === 'under16'
                    ? 'bg-rose-700 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Under 16
              </button>
            </div>
          </div>

          {/* Question 3: NYC 30-Day Residency */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>3. Lived at your NYC address for at least 30 days prior to election?</span>
              {isNycResident30Days === true && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isNycResident30Days === false && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsNycResident30Days(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  isNycResident30Days === true
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Yes (30+ Days)
              </button>
              <button
                type="button"
                onClick={() => setIsNycResident30Days(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  isNycResident30Days === false
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Just Moved In
              </button>
            </div>
          </div>

          {/* Question 4: Criminal Justice Status */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>4. Are you NOT currently in prison for a felony conviction?</span>
              {notInPrison === true && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {notInPrison === false && <XCircle className="w-4 h-4 text-rose-500" />}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setNotInPrison(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  notInPrison === true
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Not In Prison (Eligible)
              </button>
              <button
                type="button"
                onClick={() => setNotInPrison(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition ${
                  notInPrison === false
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Currently Incarcerated
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              *Under NY Law, your voting rights are fully restored the moment you leave prison, even while on parole or probation!
            </p>
          </div>
        </div>

        {/* Eligibility Result Banner */}
        {isFullyEligible && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-start gap-3 text-emerald-900 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                You Are 100% Eligible to Register & Vote in NYC!
              </div>
              <p className="text-xs text-emerald-900/90 mt-0.5">
                Choose one of the 3 fast registration options below to submit your official registration today.
              </p>
            </div>
          </div>
        )}

        {isPreRegEligible && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5 flex items-start gap-3 text-orange-950 animate-in fade-in">
            <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-orange-900">
                You Are Eligible for NYC Pre-Registration!
              </div>
              <p className="text-xs text-orange-900/90 mt-0.5">
                New York allows 16- and 17-year-olds to pre-register now. The BOE will automatically activate your voter registration on your 18th birthday!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Ways to Register */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Step 2: Choose How to Submit Your Registration
            </h3>
            <p className="text-xs text-slate-500">Official NYC Board of Elections Portals</p>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
            Takes ~3 Mins
          </span>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-xl">
          {[
            { id: 'online_dmv', label: 'NYS DMV (Fastest)' },
            { id: 'online_ny', label: 'NYS Portal' },
            { id: 'paper_form', label: 'Mail/Paper Form' },
            { id: 'pre_reg', label: '16/17 Pre-Reg' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRegMode(tab.id as any)}
              className={`py-2 px-2 rounded-lg text-xs font-bold transition text-center ${
                regMode === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Option 1: NYS DMV Portal */}
        {regMode === 'online_dmv' && (
          <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-blue-900">
                  NYS DMV Electronic Voter Registration Portal
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  If you have a New York State Driver License, Permit, or Non-Driver ID, you can register or update your NYC address online instantly.
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md">
                Recommended
              </span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-blue-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-800">What you will need:</div>
              <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
                <li>NYS Driver License, Permit, or Non-Driver ID Number</li>
                <li>Document Number from the bottom right or back of your card</li>
                <li>Last 4 digits of your Social Security Number</li>
                <li>Your current NYC residence address & ZIP code</li>
              </ul>
            </div>

            <a
              href="https://voterreg.dmv.ny.gov/MotorVoter/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-xs font-bold shadow-sm"
            >
              <span>Launch NYS DMV Online Voter Registration</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Option 2: NYS Board of Elections Online Portal */}
        {regMode === 'online_ny' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                NYS Board of Elections Direct Online Portal
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Submit an online application directly to the NYS BOE using your NY.gov ID or digital signature.
              </p>
            </div>

            <a
              href="https://elections.ny.gov/online-voter-registration-entry"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-xs font-bold shadow-sm"
            >
              <span>Open NYS Board of Elections Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Option 3: Download Paper PDF Form */}
        {regMode === 'paper_form' && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Download Official NYC BOE Voter Registration Forms
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Print, fill out, and mail with postage-paid address directly to your Borough Board of Elections office.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {[
                { lang: 'English Form', code: 'EN', url: 'https://vote.nyc/sites/default/files/pdf/forms/voter_reg/english.pdf' },
                { lang: 'Spanish (Español)', code: 'ES', url: 'https://vote.nyc/sites/default/files/pdf/forms/voter_reg/spanish.pdf' },
                { lang: 'Chinese (中文)', code: 'ZH', url: 'https://vote.nyc/sites/default/files/pdf/forms/voter_reg/chinese.pdf' },
                { lang: 'Bengali (বাংলা)', code: 'BN', url: 'https://vote.nyc/sites/default/files/pdf/forms/voter_reg/bengali.pdf' },
                { lang: 'Korean (한국어)', code: 'KO', url: 'https://vote.nyc/sites/default/files/pdf/forms/voter_reg/korean.pdf' },
              ].map((item) => (
                <a
                  key={item.code}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 hover:border-blue-600 text-xs font-bold text-slate-800 transition shadow-2xs"
                >
                  <span>{item.lang}</span>
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                </a>
              ))}
            </div>

            <div className="text-xs text-slate-700 bg-white border-l-4 border-orange-400 p-3.5 rounded-xl shadow-2xs">
              <strong>Mailing Instructions:</strong> Fold form, seal with tape, and drop in any USPS mailbox (postage is pre-paid within NYC). Must be postmarked 10+ days before the election.
            </div>
          </div>
        )}

        {/* Option 4: 16/17 Youth Pre-Registration */}
        {regMode === 'pre_reg' && (
          <div className="space-y-3 bg-orange-50/60 p-4 rounded-xl border border-orange-200 text-orange-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h4 className="text-xs font-bold uppercase text-orange-900">
                NYC Youth Voter Pre-Registration Program
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-orange-900/90">
              Are you 16 or 17 years old attending high school or college in NYC? You don&apos;t have to wait until you turn 18 to fill out your form! Pre-registering ensures you are ready to vote on day one of turning 18.
            </p>
            <div className="bg-white p-3 rounded-xl border border-orange-300 text-xs space-y-1 text-slate-700">
              <div className="font-bold text-slate-900">Benefits:</div>
              <ul className="list-disc pl-4 space-y-0.5">
                <li>Automatic registration on your 18th birthday</li>
                <li>Receive official NYC voter guide before your first election</li>
                <li>Eligible to work as a student poll worker earning $250+/day</li>
              </ul>
            </div>
            <a
              href="https://voterreg.dmv.ny.gov/MotorVoter/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 transition text-white text-xs font-bold shadow-sm"
            >
              <span>Pre-Register Now via NYS DMV</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Step 3: Interactive Registration Readiness Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Step 3: Registration Data Readiness Check
            </h3>
            <p className="text-xs text-slate-500">
              Test your information format before submitting to NY State
            </p>
          </div>
        </div>

        {formSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <PartyPopper className="w-5 h-5 text-emerald-600" />
              <span>Ready for Submission!</span>
            </div>
            <p className="text-xs text-emerald-900">
              Your details for <strong>{formData.fullName || 'New NYC Voter'}</strong> in{' '}
              <strong>{formData.borough} ({formData.zip || '10003'})</strong> are properly formatted for NYC Board of Elections records.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://voterreg.dmv.ny.gov/MotorVoter/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-2.5 px-3 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm"
              >
                Complete on NYS DMV Portal
              </a>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="py-2.5 px-3 rounded-xl bg-white border border-emerald-300 text-xs font-semibold text-emerald-800"
              >
                Edit Info
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Alex Rivera"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NYC Borough *
                </label>
                <select
                  value={formData.borough}
                  onChange={(e) => setFormData({ ...formData, borough: e.target.value as Borough })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                >
                  <option value="Manhattan">Manhattan (New York County)</option>
                  <option value="Brooklyn">Brooklyn (Kings County)</option>
                  <option value="Queens">Queens (Queens County)</option>
                  <option value="Bronx">Bronx (Bronx County)</option>
                  <option value="Staten Island">Staten Island (Richmond County)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NYC Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 350 5th Ave, Apt 4B"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  5-Digit NYC ZIP Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="e.g. 10001"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Political Party Enrollment (Optional for General Elections)
              </label>
              <select
                value={formData.party}
                onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              >
                <option value="No Party / Blank (Independent)">No Party / Blank (Independent)</option>
                <option value="Democratic Party">Democratic Party (Can vote in Democratic Primaries)</option>
                <option value="Republican Party">Republican Party (Can vote in Republican Primaries)</option>
                <option value="Conservative Party">Conservative Party</option>
                <option value="Working Families Party">Working Families Party</option>
              </select>
              <span className="text-[11px] text-slate-500 mt-1 block">
                *Note: New York has closed primaries. To vote in a primary election, you must enroll in that specific party. In the General Election, all voters vote on the full ballot!
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 transition text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-orange-300" />
              <span>Validate My Information & Verify Readiness</span>
            </button>
          </form>
        )}
      </div>

      {/* Borough BOE Contact Offices */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2 text-slate-600">
        <div className="font-bold text-slate-900 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-blue-900" />
          <span>NYC Borough Board of Elections Executive Offices:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>• <strong>Manhattan:</strong> 200 Varick St, 10th Fl (212-886-2100)</div>
          <div>• <strong>Brooklyn:</strong> 345 Adams St, 4th Fl (718-797-8800)</div>
          <div>• <strong>Queens:</strong> 118-35 Queens Blvd, 11th Fl (718-730-6730)</div>
          <div>• <strong>Bronx:</strong> 1780 Grand Concourse, 5th Fl (718-299-9017)</div>
          <div>• <strong>Staten Island:</strong> 1 Edgewater Plaza, 4th Fl (718-876-0079)</div>
        </div>
      </div>
    </div>
  );
};
