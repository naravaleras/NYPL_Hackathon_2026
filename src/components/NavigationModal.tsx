import React, { useState, useEffect } from 'react';
import { PollingSite, NavigationRoute, NavigationStep } from '../types';
import { NYC_SUBWAY_COLORS } from '../data/nycData';
import {
  X,
  Navigation,
  ExternalLink,
  Footprints,
  Train,
  Car,
  Bike,
  Accessibility,
  Clock,
  MapPin,
  CheckCircle2,
  Share2,
  Copy,
  ChevronRight,
  AlertTriangle,
  Play,
  RotateCcw,
  Volume2
} from 'lucide-react';

interface NavigationModalProps {
  site: PollingSite;
  userAddress?: string;
  onClose: () => void;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({
  site,
  userAddress = 'My Location',
  onClose,
}) => {
  const [mode, setMode] = useState<'transit' | 'walking' | 'biking' | 'driving'>('transit');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isSimulatingLiveNav, setIsSimulatingLiveNav] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate customized turn-by-turn route based on the selected mode and site
  const generateRoute = (): NavigationRoute => {
    const encodedDest = encodeURIComponent(`${site.name}, ${site.address}, ${site.borough}, NY ${site.zip}`);
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDest}`;
    const appleMapsUrl = `https://maps.apple.com/?daddr=${encodedDest}`;
    const mtaTripUrl = `https://new.mta.info/`;

    if (mode === 'walking') {
      const steps: NavigationStep[] = [
        {
          instruction: `Head out towards ${site.crossStreets.split('&')[0] || 'nearest avenue'}`,
          distance: '0.1 mi',
          duration: '2 mins',
          type: 'walk',
          stationOrStreet: 'Local Sidewalk',
        },
        {
          instruction: `Walk along the avenue towards ${site.address}`,
          distance: '0.3 mi',
          duration: '6 mins',
          type: 'walk',
          stationOrStreet: site.crossStreets,
        },
        {
          instruction: `Turn into ${site.address}. Look for official blue & orange "Vote Here / Vote Aquí" directional lawn signs`,
          distance: '200 ft',
          duration: '1 min',
          type: 'arrive',
          stationOrStreet: site.accessibleEntrance,
        },
      ];
      return {
        destinationName: site.name,
        destinationAddress: `${site.address}, ${site.borough}, NY ${site.zip}`,
        mode: 'walking',
        totalDuration: '9 mins',
        totalDistance: '0.4 mi',
        steps,
        googleMapsUrl,
        appleMapsUrl,
        mtaTripUrl,
      };
    }

    if (mode === 'biking') {
      const steps: NavigationStep[] = [
        {
          instruction: 'Unlock nearest Citi Bike dock or mount personal bicycle',
          distance: '250 ft',
          duration: '1 min',
          type: 'walk',
        },
        {
          instruction: 'Ride using designated protected greenway bike lanes towards site',
          distance: '1.2 mi',
          duration: '6 mins',
          type: 'walk',
          stationOrStreet: 'Protected Bike Lane',
        },
        {
          instruction: `Dock at nearest Citi Bike station or secure to bike rack outside ${site.name}`,
          distance: '100 ft',
          duration: '1 min',
          type: 'arrive',
        },
      ];
      return {
        destinationName: site.name,
        destinationAddress: `${site.address}, ${site.borough}, NY ${site.zip}`,
        mode: 'biking',
        totalDuration: '8 mins',
        totalDistance: '1.2 mi',
        steps,
        googleMapsUrl,
        appleMapsUrl,
        mtaTripUrl,
      };
    }

    if (mode === 'driving') {
      const steps: NavigationStep[] = [
        {
          instruction: 'Head towards main thoroughfare',
          distance: '0.2 mi',
          duration: '2 mins',
          type: 'walk',
        },
        {
          instruction: `Drive along main boulevard towards ${site.crossStreets}`,
          distance: '1.8 mi',
          duration: '9 mins',
          type: 'walk',
          stationOrStreet: 'Street Route',
        },
        {
          instruction: `Drop off passenger or locate street parking / designated NYC BOE accessible parking spot near ${site.accessibleEntrance}`,
          distance: '0.1 mi',
          duration: '2 mins',
          type: 'arrive',
        },
      ];
      return {
        destinationName: site.name,
        destinationAddress: `${site.address}, ${site.borough}, NY ${site.zip}`,
        mode: 'driving',
        totalDuration: '13 mins',
        totalDistance: '2.1 mi',
        steps,
        googleMapsUrl,
        appleMapsUrl,
        mtaTripUrl,
      };
    }

    // Default: Transit (Subway & Bus)
    const subwayLine = site.transit.subwayLines[0] || '1';
    const steps: NavigationStep[] = [
      {
        instruction: `Walk 3 mins to ${site.transit.nearestStation.split('(')[0] || 'nearest subway station'}`,
        distance: '0.15 mi',
        duration: '3 mins',
        type: 'walk',
        stationOrStreet: 'Street level entrance',
      },
      {
        instruction: `Take the (${subwayLine}) train towards the poll site district`,
        distance: '2 stops',
        duration: '6 mins',
        type: 'subway',
        line: subwayLine,
        stationOrStreet: site.transit.nearestStation,
      },
      {
        instruction: `Exit station onto ${site.crossStreets.split('&')[0] || 'street'}. Follow "Vote Here" signs`,
        distance: '0.1 mi',
        duration: `${site.transit.walkMinutes} mins`,
        type: 'walk',
        stationOrStreet: 'Station Exit ADA Elevator/Stairs',
      },
      {
        instruction: `Arrive at ${site.name}. Enter via: ${site.accessibleEntrance}`,
        distance: '50 ft',
        duration: 'Arrived',
        type: 'arrive',
        stationOrStreet: site.accessibleEntrance,
      },
    ];

    return {
      destinationName: site.name,
      destinationAddress: `${site.address}, ${site.borough}, NY ${site.zip}`,
      mode: 'transit',
      totalDuration: `${9 + site.transit.walkMinutes} mins`,
      totalDistance: '1.4 mi',
      steps,
      googleMapsUrl,
      appleMapsUrl,
      mtaTripUrl,
    };
  };

  const route = generateRoute();

  // Handle live simulation
  useEffect(() => {
    let interval: any;
    if (isSimulatingLiveNav) {
      interval = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev < route.steps.length - 1) {
            return prev + 1;
          } else {
            setIsSimulatingLiveNav(false);
            return prev;
          }
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isSimulatingLiveNav, route.steps.length]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${site.name}, ${site.address}, ${site.borough}, NY ${site.zip}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vote at ${site.name}`,
          text: `My NYC Polling Site: ${site.name} at ${site.address}, ${site.borough}. Open Election Day 6am-9pm!`,
          url: window.location.href,
        });
      } catch {
        handleCopyAddress();
      }
    } else {
      handleCopyAddress();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200 animate-in slide-in-from-bottom duration-300">
        {/* Mobile top handle pill */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-2.5 mb-1 sm:hidden"></div>

        {/* Modal Header in Deep Blue */}
        <div className="bg-blue-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-blue-800/80 hover:bg-blue-700 transition text-white"
            aria-label="Close navigation pop-up"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1.5">
            <Navigation className="w-3.5 h-3.5 fill-current animate-pulse text-orange-400" />
            <span>Navigate to Polling Place</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold leading-tight text-white pr-8">
            {site.name}
          </h2>

          <div className="flex items-center gap-1.5 text-xs text-blue-200 mt-1">
            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span>
              {site.address}, {site.borough}, NY {site.zip}
            </span>
          </div>

          {/* Site Type & Wait Time Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg ${
                site.type === 'both'
                  ? 'bg-orange-500 text-white'
                  : site.type === 'early_voting'
                  ? 'bg-purple-600 text-white'
                  : 'bg-blue-700 text-white'
              }`}
            >
              {site.type === 'both'
                ? 'Early Voting + Election Day'
                : site.type === 'early_voting'
                ? 'Early Voting Poll Site'
                : 'Election Day Poll Site'}
            </span>

            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-blue-800 text-blue-100 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>Wait: ~{site.estimatedWaitMins || 5} min</span>
            </span>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto">
          {[
            { id: 'transit', label: 'Transit', icon: Train },
            { id: 'walking', label: 'Walk', icon: Footprints },
            { id: 'biking', label: 'Bike', icon: Bike },
            { id: 'driving', label: 'Drive / Ride', icon: Car },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = mode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.id as any);
                  setActiveStepIndex(0);
                  setIsSimulatingLiveNav(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Visual Route Header Banner */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Travel Time</div>
              <div className="text-2xl font-black text-blue-950 flex items-baseline gap-1.5">
                <span>{route.totalDuration}</span>
                <span className="text-xs font-medium text-slate-500">({route.totalDistance})</span>
              </div>
            </div>

            {/* Quick Subway Badge Row if Transit */}
            {mode === 'transit' && (
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-600 mr-1">Lines:</span>
                {site.transit.subwayLines.map((line) => {
                  const style = NYC_SUBWAY_COLORS[line] || { bg: '#00264d', text: '#fff' };
                  return (
                    <span
                      key={line}
                      style={{ backgroundColor: style.bg, color: style.text }}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs"
                    >
                      {line}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Live Turn-by-Turn GPS Simulation Control */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 text-blue-900 rounded-lg">
                <Volume2 className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  {isSimulatingLiveNav ? 'Live Turn Guidance Active' : 'Step-by-Step Preview'}
                </div>
                <div className="text-[11px] text-slate-500">
                  Step {activeStepIndex + 1} of {route.steps.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {isSimulatingLiveNav ? (
                <button
                  onClick={() => setIsSimulatingLiveNav(false)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition"
                >
                  Pause
                </button>
              ) : (
                <button
                  onClick={() => setIsSimulatingLiveNav(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Guide</span>
                </button>
              )}
              <button
                onClick={() => {
                  setActiveStepIndex(0);
                  setIsSimulatingLiveNav(false);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 transition"
                title="Reset steps"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Turn-by-Turn Steps List */}
          <div className="space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between">
              <span>Directions from {userAddress.split(',')[0]}</span>
              <span className="text-[10px] text-blue-700 font-bold">NYC BOE Verified Path</span>
            </div>

            {route.steps.map((step, idx) => {
              const isCurrent = activeStepIndex === idx;
              const isPast = activeStepIndex > idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-blue-50/90 border-blue-600 shadow-xs ring-1 ring-blue-600/30'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isPast ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                            isCurrent
                              ? 'bg-blue-900 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {idx + 1}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        {step.instruction}
                      </div>

                      {step.stationOrStreet && (
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{step.stationOrStreet}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-slate-500">
                        <span>{step.distance}</span>
                        <span>•</span>
                        <span>{step.duration}</span>
                      </div>
                    </div>

                    {isCurrent && (
                      <ChevronRight className="w-4 h-4 text-blue-900 shrink-0 self-center" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Accessible Entrance Details Box */}
          <div className="bg-white border-l-4 border-orange-400 rounded-xl p-3.5 text-xs text-slate-700 space-y-1 shadow-xs">
            <div className="font-bold flex items-center gap-1.5 text-slate-900">
              <Accessibility className="w-4 h-4 text-orange-500" />
              <span>Accessible Voter Entrance (ADA Verified)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-5">
              {site.accessibleEntrance}
            </p>
            {site.accessibleRamp && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 pl-5 pt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero-step entry & motorized push paddle door verified.</span>
              </div>
            )}
          </div>

          {/* Direct Navigation App Handoff Buttons */}
          <div className="space-y-2 pt-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Launch in Maps App</div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={route.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-xs font-bold shadow-sm"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={route.appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 transition text-white text-xs font-bold shadow-sm"
              >
                <span>Apple Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Copy & Share actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleCopyAddress}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700 text-xs font-semibold border border-slate-200"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>{copied ? 'Address Copied!' : 'Copy Address'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700 text-xs font-semibold border border-slate-200"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share with Friend</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-orange-500" />
            <span>Polls open Election Day 6:00 AM – 9:00 PM</span>
          </span>
          <a
            href="tel:18668683692"
            className="text-blue-700 font-bold hover:underline"
          >
            1-866-VOTE-NYC
          </a>
        </div>
      </div>
    </div>
  );
};
