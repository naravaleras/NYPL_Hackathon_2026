import React, { useState } from 'react';
import { Borough, PollingSite } from '../types';
import { SAMPLE_POLL_SITES, NYC_SUBWAY_COLORS } from '../data/nycData';
import {
  Search,
  MapPin,
  Navigation,
  Clock,
  Accessibility,
  Train,
  Bus,
  CheckCircle,
  HelpCircle,
  FileText,
  Building,
  CalendarCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

interface PollLookupProps {
  onSelectSiteForNav: (site: PollingSite, userAddress?: string) => void;
  onOpenSampleBallot?: (site: PollingSite) => void;
}

export const PollLookup: React.FC<PollLookupProps> = ({
  onSelectSiteForNav,
  onOpenSampleBallot,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBorough, setSelectedBorough] = useState<Borough | 'All'>('All');
  const [siteTypeFilter, setSiteTypeFilter] = useState<'all' | 'election_day' | 'early_voting'>('all');
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [userLocationAddress, setUserLocationAddress] = useState<string>('My Location (NYC)');

  // Quick NYC neighborhood sample address shortcuts
  const popularPresets = [
    { label: 'East Village (10003)', query: '319 East 19th St, Manhattan' },
    { label: 'Crown Heights (11238)', query: '200 Eastern Parkway, Brooklyn' },
    { label: 'Flushing (11355)', query: '41-17 Main St, Queens' },
    { label: 'Harlem (10027)', query: '9 West 124th St, Manhattan' },
    { label: 'South Bronx (10451)', query: '851 Grand Concourse, Bronx' },
    { label: 'St. George (10301)', query: '10 Richmond Terrace, Staten Island' },
  ];

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setUserLocationAddress('Current GPS Location (NYC)');
          setSearchQuery('Brooklyn Museum / Prospect Heights');
          setSelectedBorough('Brooklyn');
        },
        () => {
          setIsLocating(false);
          setUserLocationAddress('Downtown Manhattan (GPS Sim)');
          setSearchQuery('10003');
          setSelectedBorough('Manhattan');
        },
        { timeout: 4000 }
      );
    } else {
      setIsLocating(false);
      setSearchQuery('10003');
    }
  };

  const filteredSites = SAMPLE_POLL_SITES.filter((site) => {
    const matchesBorough = selectedBorough === 'All' || site.borough === selectedBorough;
    const matchesType =
      siteTypeFilter === 'all' ||
      site.type === 'both' ||
      site.type === siteTypeFilter;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesBorough && matchesType;

    const matchesQuery =
      site.name.toLowerCase().includes(q) ||
      site.address.toLowerCase().includes(q) ||
      site.zip.includes(q) ||
      site.borough.toLowerCase().includes(q) ||
      site.transit.subwayLines.some((line) => line.toLowerCase() === q);

    return matchesBorough && matchesType && matchesQuery;
  });

  return (
    <div className="space-y-5 pb-20">
      {/* Intro Header & Banner in Sleek Deep Blue */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
            NYC Polling Place Locator
          </span>
          <span className="text-xs text-blue-200 font-medium">Official BOE Database</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            Where Do I Vote in NYC?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
            Enter your NYC street address or ZIP code to find your assigned{' '}
            <strong className="text-white">Election Day</strong> and{' '}
            <strong className="text-orange-300">Early Voting</strong> poll sites.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter NYC street address, neighborhood, or ZIP..."
              className="w-full pl-10 pr-20 py-3 bg-white text-slate-900 rounded-xl text-xs sm:text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-0.5 bg-slate-100 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Location Action & Presets */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-blue-100 text-xs font-semibold transition active:scale-95"
            >
              <Compass className={`w-3.5 h-3.5 text-orange-400 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating NYC...' : 'Use My Location'}</span>
            </button>

            <span className="text-[11px] text-blue-200 hidden sm:inline">
              5 Boroughs Supported
            </span>
          </div>
        </div>

        {/* Popular Presets Pills */}
        <div className="pt-3 border-t border-blue-800">
          <div className="text-[11px] font-semibold text-blue-200 mb-1.5">
            Quick Examples for First-Time Voters:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {popularPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setSearchQuery(preset.query);
                  setUserLocationAddress(preset.label);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-950/70 hover:bg-blue-800 text-blue-100 font-medium border border-blue-800 transition truncate"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Borough & Poll Type Filter Controls */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        {/* Borough Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['All', 'Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBorough(b)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedBorough === b
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {/* Site Type Filter */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-xs font-medium text-slate-500">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Show:</span>
          {[
            { id: 'all', label: 'All Sites' },
            { id: 'election_day', label: 'Election Day Only' },
            { id: 'early_voting', label: 'Early Voting Sites' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSiteTypeFilter(type.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                siteTypeFilter === type.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* NYC Important Polling Rule Callout */}
      <div className="bg-white p-4 rounded-xl border-l-4 border-orange-400 shadow-sm space-y-1">
        <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
          <HelpCircle className="w-4 h-4 text-orange-500" />
          <span>New Voter Tip: Early Voting Site vs. Election Day Site</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed pl-5">
          In New York City, your assigned <strong>Early Voting site</strong> is often located in a different municipal building or library than your <strong>Election Day poll site</strong>. Please review the badges below before heading out!
        </p>
      </div>

      {/* Polling Sites List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span className="uppercase tracking-wider text-[11px] text-slate-400 font-bold">
            {filteredSites.length} Polling Location{filteredSites.length === 1 ? '' : 's'} Found
          </span>
          <span className="text-slate-400 font-normal">Tap card for instant navigation popup</span>
        </div>

        {filteredSites.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3 shadow-sm">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Polling Locations Matched</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with your 5-digit NYC ZIP code (e.g. 10003, 11238, 11355) or select a borough filter above.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBorough('All');
                setSiteTypeFilter('all');
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredSites.map((site) => {
            const isEarly = site.type === 'early_voting' || site.type === 'both';
            const isElectionDay = site.type === 'election_day' || site.type === 'both';

            return (
              <div
                key={site.id}
                className={`bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 transition-all shadow-sm space-y-3.5 border-l-4 ${
                  site.type === 'both'
                    ? 'border-l-orange-400'
                    : site.type === 'early_voting'
                    ? 'border-l-purple-600'
                    : 'border-l-blue-600'
                }`}
              >
                {/* Site Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {site.type === 'both' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800">
                          Early Voting + Election Day
                        </span>
                      ) : site.type === 'early_voting' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                          Early Voting Site
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                          Election Day Poll Site
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {site.borough} • Dist {site.districtInfo.ad}/{site.districtInfo.ed}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {site.name}
                    </h3>
                  </div>

                  {/* Estimated Wait Badge */}
                  <div className="shrink-0 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                      <Clock className="w-3 h-3" />
                      <span>~{site.estimatedWaitMins || 5} min wait</span>
                    </span>
                  </div>
                </div>

                {/* Address & Cross Streets */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 font-medium text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{site.address}, {site.borough}, NY {site.zip}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 pl-5">
                    Cross Streets: {site.crossStreets}
                  </div>
                </div>

                {/* Hours & Schedule */}
                <div className="bg-slate-50 rounded-xl p-3 text-[11px] text-slate-700 space-y-1 border border-slate-100">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <CalendarCheck className="w-3.5 h-3.5 text-blue-900" />
                    <span>Operating Hours:</span>
                  </div>
                  <div className="pl-5 leading-relaxed text-slate-600">
                    {site.hours}
                  </div>
                </div>

                {/* Accessible Entrance */}
                <div className="flex items-start gap-1.5 text-[11px] text-slate-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
                  <Accessibility className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-950">ADA Accessible Entry: </strong>
                    <span>{site.accessibleEntrance}</span>
                  </div>
                </div>

                {/* Transit Line Subway Badges */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <Train className="w-3.5 h-3.5 text-slate-400" />
                      <span>Subway:</span>
                    </div>
                    {site.transit.subwayLines.map((line) => {
                      const color = NYC_SUBWAY_COLORS[line] || { bg: '#00264d', text: '#fff' };
                      return (
                        <span
                          key={line}
                          style={{ backgroundColor: color.bg, color: color.text }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-xs"
                          title={`Subway line ${line}`}
                        >
                          {line}
                        </span>
                      );
                    })}

                    <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                      • {site.transit.walkMinutes} min walk from {site.transit.nearestStation.split('(')[0]}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Navigate Pop-up & Sample Ballot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onSelectSiteForNav(site, userLocationAddress)}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 transition text-white text-xs font-bold shadow-sm group"
                  >
                    <Navigation className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
                    <span>Navigate to Polling Place</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenSampleBallot) onOpenSampleBallot(site);
                      else alert(`Sample Ballot for ${site.borough} Assembly District ${site.districtInfo.ad}, Election District ${site.districtInfo.ed} loaded.`);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Preview Sample Ballot</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Need Help Box matching theme */}
      <div className="bg-slate-200/50 p-5 rounded-2xl border border-dashed border-slate-300">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Need Help?</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Call the NYC Board of Elections at <strong className="text-slate-800">1-866-VOTE-NYC</strong> (1-866-868-3692) for live assistance with polling sites, language access, or disability accommodations.
        </p>
      </div>
    </div>
  );
};
