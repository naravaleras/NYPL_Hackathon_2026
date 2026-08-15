import React, { useState } from 'react';
import { PollingSite } from '../types';
import { SAMPLE_POLL_SITES } from '../data/nycData';
import {
  X,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Train,
  ShieldCheck,
  Share2,
  Download,
  Copy,
  Printer,
  Sparkles
} from 'lucide-react';

interface VoterPlanModalProps {
  onClose: () => void;
  selectedSite?: PollingSite | null;
}

export const VoterPlanModal: React.FC<VoterPlanModalProps> = ({
  onClose,
  selectedSite = SAMPLE_POLL_SITES[0],
}) => {
  const [preferredMethod, setPreferredMethod] = useState<'early' | 'election_day'>('early');
  const [preferredTime, setPreferredTime] = useState<string>('10:00 AM (Morning)');
  const [copied, setCopied] = useState<boolean>(false);

  const site = selectedSite || SAMPLE_POLL_SITES[0];

  const handleCopySummary = () => {
    const text = `🗽 My Official NYC Voting Plan:
📍 Site: ${site.name} (${site.address}, ${site.borough})
📅 Method: ${preferredMethod === 'early' ? 'Early Voting (Oct 24 - Nov 1)' : 'Election Day (Nov 3)'}
⏰ Planned Time: ${preferredTime}
🚇 Transit: Take ${site.transit.subwayLines.join('/')} to ${site.transit.nearestStation}
✅ Checklist: 100% Prepared! (No photo ID required for registered NY voters).
Official Portal: vote.nyc`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My NYC Voting Plan',
          text: `I made my official NYC Voting Plan! I am voting at ${site.name} in ${site.borough}. Make yours at vote.nyc!`,
          url: window.location.href,
        });
      } catch {
        handleCopySummary();
      }
    } else {
      handleCopySummary();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in"
    >
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 animate-in slide-in-from-bottom duration-300">
        {/* Mobile handle */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 mb-1 sm:hidden"></div>

        {/* Modal Header */}
        <div className="bg-blue-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-blue-800/80 hover:bg-blue-700 text-white transition"
            aria-label="Close Plan"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Official NYC Board of Elections</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
            My Certified NYC Voting Plan
          </h3>
          <p className="text-xs text-blue-200 mt-1">
            Save this digital pass to your phone or share with fellow New Yorkers
          </p>
        </div>

        {/* Scrollable Plan Customization & Pass */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Customization Options */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div className="font-bold text-slate-800">Customize My Voting Plan:</div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPreferredMethod('early')}
                className={`p-2.5 rounded-xl font-bold transition text-center ${
                  preferredMethod === 'early'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Early Voting (9 Days)
              </button>

              <button
                onClick={() => setPreferredMethod('election_day')}
                className={`p-2.5 rounded-xl font-bold transition text-center ${
                  preferredMethod === 'election_day'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Election Day (6am-9pm)
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Target Time of Day:
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-600"
              >
                <option value="7:30 AM (Early Morning before work)">7:30 AM (Early Morning)</option>
                <option value="10:30 AM (Mid-Morning - Low Lines)">10:30 AM (Mid-Morning - Fast!)</option>
                <option value="1:00 PM (Lunch Break)">1:00 PM (Lunch Break)</option>
                <option value="5:30 PM (Evening after work)">5:30 PM (Evening)</option>
                <option value="Weekend 11:00 AM (Early Voting Weekend)">Weekend 11:00 AM (Early Voting)</option>
              </select>
            </div>
          </div>

          {/* Digital Voting Pass Card (Ticket style) */}
          <div className="bg-blue-900 text-white rounded-2xl p-5 shadow-lg border border-blue-800 space-y-4 relative overflow-hidden">
            {/* Top Seal & Heading */}
            <div className="flex items-center justify-between border-b border-blue-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white p-0.5 text-center flex flex-col justify-center shadow-xs">
                  <span className="text-[6px] text-orange-500 font-black leading-none">NYC</span>
                  <span className="text-[8px] text-blue-900 font-black leading-none">VOTE</span>
                </div>
                <div>
                  <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                    NEW YORK CITY BOARD OF ELECTIONS
                  </div>
                  <div className="text-xs font-bold text-white">VOTER COMMITMENT PASS</div>
                </div>
              </div>

              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Polling Place Section */}
            <div className="space-y-1">
              <div className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Assigned Poll Location:</div>
              <div className="text-sm sm:text-base font-bold text-white leading-tight">
                {site.name}
              </div>
              <div className="text-xs text-blue-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>{site.address}, {site.borough}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 bg-blue-950/70 p-3 rounded-xl border border-blue-800 text-xs">
              <div>
                <div className="text-[10px] text-blue-300 font-bold uppercase">VOTING METHOD:</div>
                <div className="font-bold text-white mt-0.5">
                  {preferredMethod === 'early' ? 'Early Voting' : 'Election Day'}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-blue-300 font-bold uppercase">PLANNED TIME:</div>
                <div className="font-bold text-white mt-0.5 truncate">
                  {preferredTime.split('(')[0]}
                </div>
              </div>

              <div className="col-span-2 pt-1.5 border-t border-blue-800/80 flex items-center justify-between">
                <span className="text-[10px] text-blue-300 font-bold uppercase">SUBWAY LINES:</span>
                <div className="flex items-center gap-1">
                  {site.transit.subwayLines.map((line) => (
                    <span
                      key={line}
                      className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black"
                    >
                      {line}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal Guarantee Badge */}
            <div className="text-[11px] text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 p-2.5 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Registered NY voters do NOT need a photo ID to cast a ballot.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-orange-300" />
              <span>Share My Voting Plan Card</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopySummary}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{copied ? 'Plan Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Plan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
