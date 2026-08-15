import React, { useState } from 'react';
import {
  Vote,
  CheckCircle,
  AlertCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  Scan,
  Download,
  Share2,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MachineSimulator: React.FC = () => {
  const [stage, setStage] = useState<'marking' | 'ranked_choice' | 'scanning' | 'voted'>('marking');

  // Standard ballot marks
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);

  // Ranked choice marks (NYC municipal elections)
  const [rankings, setRankings] = useState<{ [candidate: string]: number }>({});

  // Scanner status
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const candidatesList = [
    { id: 'c1', name: 'Elena Rostova', party: 'Independent Civic', slogan: 'Affordable Housing & Transit' },
    { id: 'c2', name: 'Marcus Chen', party: 'Community Forward', slogan: 'Public Schools & Green Parks' },
    { id: 'c3', name: 'Zainab Al-Hassan', party: 'Neighborhood First', slogan: 'Small Business Support' },
  ];

  const handleSelectRank = (candidateId: string, rank: number) => {
    setRankings((prev) => {
      const next = { ...prev };
      // Clear if someone else has this rank
      Object.keys(next).forEach((k) => {
        if (next[k] === rank) delete next[k];
      });
      next[candidateId] = rank;
      return next;
    });
  };

  const handleFeedScanner = () => {
    setStage('scanning');
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStage('voted');
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });
    }, 2800);
  };

  const handleReset = () => {
    setStage('marking');
    setSelectedCandidate(null);
    setRankings({});
    setIsScanning(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Banner */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
            Interactive Booth Simulator
          </span>
          <span className="text-xs text-blue-200 font-medium">Practice Experience</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            Demystify the NYC Voting Machine
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
            In New York City, all votes are cast on official paper ballots and scanned using optical scanners. Practice filling in your ballot and feeding the machine below!
          </p>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-800/80">
          <div className={`p-2 rounded-xl text-center text-xs font-bold transition ${stage === 'marking' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-950/60 text-blue-300'}`}>
            1. Fill Oval
          </div>
          <div className={`p-2 rounded-xl text-center text-xs font-bold transition ${stage === 'ranked_choice' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-950/60 text-blue-300'}`}>
            2. Ranked Choice
          </div>
          <div className={`p-2 rounded-xl text-center text-xs font-bold transition ${stage === 'scanning' || stage === 'voted' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-blue-950/60 text-blue-300'}`}>
            3. Optical Scanner
          </div>
        </div>
      </div>

      {/* Stage 1: Standard Ballot Marking */}
      {stage === 'marking' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 1: Mark Your Paper Ballot
              </h3>
              <p className="text-xs text-slate-500">
                Use the provided black pen to completely fill in the oval next to your choice.
              </p>
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-lg">
              General Election Style
            </span>
          </div>

          {/* Sample Ballot Card Box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3 font-sans">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">OFFICIAL BALLOT • GENERAL ELECTION</div>
                <div className="text-xs font-extrabold text-slate-800">OFFICE: MAYOR / BOROUGH PRESIDENT (Vote for One)</div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">SHEET 1 OF 1</span>
            </div>

            <div className="space-y-2 pt-1">
              {candidatesList.map((cand) => {
                const isSelected = selectedCandidate === cand.id;
                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-1 ring-blue-600/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Simulated Paper Oval */}
                      <div
                        className={`w-6 h-4 rounded-full border-2 border-slate-800 transition-all flex items-center justify-center ${
                          isSelected ? 'bg-slate-900' : 'bg-white'
                        }`}
                        title="Ballot Oval"
                      >
                        {isSelected && <span className="w-4 h-2 bg-slate-900 rounded-full" />}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900">{cand.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{cand.party} • {cand.slogan}</div>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      {isSelected ? 'OVAL FILLED' : 'TAP TO FILL'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Golden Rules Box */}
          <div className="bg-white border-l-4 border-orange-400 rounded-xl p-3.5 text-xs text-slate-700 space-y-1 shadow-xs">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <HelpCircle className="w-4 h-4 text-orange-500" />
              <span>Important BOE Rule on Marking Ballots:</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pl-5">
              Always fill the oval completely. Do <strong>NOT</strong> mark with an &quot;X&quot; or checkmark. If you make a mistake, <strong>do not cross it out</strong>; ask a poll worker for a new ballot immediately (you are legally entitled to up to 3 replacement ballots!).
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setStage('ranked_choice')}
              disabled={!selectedCandidate}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2 ${
                selectedCandidate
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Next: Try Ranked Choice Voting (NYC Primaries)</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage 2: Ranked Choice Voting Simulation */}
      {stage === 'ranked_choice' && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Step 2: Ranked Choice Voting Practice
              </h3>
              <p className="text-xs text-slate-500">
                In NYC Primary & Special municipal elections, you can rank up to 5 candidates!
              </p>
            </div>
            <span className="text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-lg">
              NYC Primary Rule
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
            <div className="text-xs font-bold text-slate-700">
              Rank your choices (1st, 2nd, 3rd Choice):
            </div>

            <div className="space-y-2">
              {candidatesList.map((cand) => {
                const currentRank = rankings[cand.id];
                return (
                  <div
                    key={cand.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{cand.name}</div>
                      <div className="text-[11px] text-slate-500">{cand.party}</div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => handleSelectRank(cand.id, r)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                            currentRank === r
                              ? 'bg-blue-900 text-white shadow-xs ring-2 ring-blue-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              onClick={() => setStage('marking')}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
            >
              Back
            </button>

            <button
              onClick={handleFeedScanner}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold shadow-sm flex items-center justify-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span>Proceed to Optical Scanner (DS200)</span>
            </button>
          </div>
        </div>
      )}

      {/* Stage 3: Scanning in Progress */}
      {stage === 'scanning' && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 border-4 border-slate-700 shadow-2xl text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 mx-auto flex items-center justify-center border-2 border-blue-400 animate-pulse">
            <Scan className="w-8 h-8 text-blue-400" />
          </div>

          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
              DS200 SCANNER FEEDER ACTIVE
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Scanning Paper Ballot...
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Please wait while the optical scanner verifies your marks.
            </p>
          </div>

          {/* Scanner LCD Display screen mockup */}
          <div className="bg-[#0f3818] border-2 border-[#1e6f31] rounded-2xl p-4 max-w-xs mx-auto text-emerald-300 font-mono text-xs shadow-inner">
            <div className="animate-pulse">▶ READING BALLOT MARKS...</div>
            <div className="text-[10px] text-emerald-400/80 mt-1">NYC BOE DS200 SECURE TABULATOR</div>
          </div>
        </div>
      )}

      {/* Stage 4: Voted Celebratory Screen */}
      {stage === 'voted' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-400 shadow-xl text-center space-y-4 animate-in zoom-in-95">
          {/* LCD Confirmation Box */}
          <div className="bg-[#0f3818] text-emerald-300 font-mono rounded-2xl p-4 border-2 border-[#1e6f31] shadow-inner space-y-1">
            <div className="text-sm font-black tracking-wider text-emerald-200">
              ✓ YOUR VOTE HAS BEEN RECORDED
            </div>
            <div className="text-xs text-emerald-400">
              THANK YOU FOR VOTING IN NEW YORK CITY!
            </div>
            <div className="text-[10px] text-emerald-500 font-mono pt-1">
              PUBLIC COUNT: +1 | TIME: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Official Digital NYC "I VOTED" Sticker */}
          <div className="py-2">
            <div className="w-36 h-36 mx-auto rounded-full bg-gradient-to-br from-[#00264d] via-[#003870] to-[#001730] text-white p-3 shadow-2xl flex flex-col items-center justify-center border-4 border-[#FF6319] transform hover:rotate-3 transition-transform cursor-pointer">
              <span className="text-[10px] font-black text-[#FF9E1B] tracking-widest uppercase">I VOTED</span>
              <span className="text-xl font-black text-white leading-none my-0.5">NYC</span>
              <span className="text-[9px] font-bold text-blue-200 uppercase">YO VOTÉ</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 mt-1" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900">
              Congratulations on Practicing Your Vote!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              You now know exactly what to expect inside the voting booth. Don&apos;t forget to bring your plan on election day!
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={handleReset}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
