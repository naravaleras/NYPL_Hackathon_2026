import React, { useState, useEffect } from 'react';
import { ElectionDeadline, VoterReminder } from '../types';
import { UPCOMING_DEADLINES } from '../data/nycData';
import {
  Calendar,
  Clock,
  Bell,
  Check,
  AlertTriangle,
  ExternalLink,
  Download,
  CalendarPlus,
  Send,
  Sparkles,
  Smartphone,
  Mail,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const DeadlinesCalendar: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'registration' | 'early_voting' | 'election_day' | 'absentee'>('all');
  const [selectedDeadline, setSelectedDeadline] = useState<ElectionDeadline | null>(null);

  // Reminders state
  const [reminders, setReminders] = useState<{ [id: string]: boolean }>({
    'dl-reg-gen': true,
    'dl-early-start': true,
    'dl-election-day': true,
  });

  const [reminderEmail, setReminderEmail] = useState<string>('');
  const [reminderPhone, setReminderPhone] = useState<string>('');
  const [reminderSavedNotice, setReminderSavedNotice] = useState<string | null>(null);
  const [testAlertShowing, setTestAlertShowing] = useState<boolean>(false);

  // Live countdown state
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredDeadlines = UPCOMING_DEADLINES.filter((dl) => {
    if (filter === 'all') return true;
    return dl.category === filter;
  });

  const toggleReminder = (id: string) => {
    setReminders((prev) => {
      const current = !!prev[id];
      const updated = { ...prev, [id]: !current };
      if (!current) {
        setReminderSavedNotice(`Reminder set for: ${UPCOMING_DEADLINES.find((d) => d.id === id)?.title}`);
        setTimeout(() => setReminderSavedNotice(null), 3000);
      }
      return updated;
    });
  };

  // Helper to create and download an .ics iCalendar file
  const downloadIcsFile = (dl: ElectionDeadline) => {
    const startStr = dl.date.replace(/-/g, '') + 'T090000Z';
    const endStr = dl.date.replace(/-/g, '') + 'T170000Z';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//NYC Board of Elections//Vote NYC Portal//EN',
      'BEGIN:VEVENT',
      `UID:${dl.id}@vote.nyc`,
      `DTSTAMP:${startStr}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:NYC BOE: ${dl.title}`,
      `DESCRIPTION:${dl.description} - Visit vote.nyc for polling details.`,
      'LOCATION:New York City, NY',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${dl.id}-nyc-election.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to open Google Calendar event
  const getGoogleCalendarUrl = (dl: ElectionDeadline) => {
    const title = encodeURIComponent(`NYC BOE: ${dl.title}`);
    const details = encodeURIComponent(`${dl.description}\n\nOfficial Portal: vote.nyc`);
    const dateFormatted = dl.date.replace(/-/g, '');
    const dates = `${dateFormatted}T090000Z/${dateFormatted}T180000Z`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=New+York+City,+NY&dates=${dates}`;
  };

  const handleSaveContactReminders = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderEmail && !reminderPhone) return;
    setReminderSavedNotice('Success! Smart SMS & Email election reminder alerts scheduled.');
    setTimeout(() => setReminderSavedNotice(null), 4000);
  };

  const triggerTestNotification = () => {
    setTestAlertShowing(true);
    setTimeout(() => setTestAlertShowing(false), 5000);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Test Simulated Mobile Banner Alert */}
      {testAlertShowing && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto bg-[#00264d] text-white p-4 rounded-2xl shadow-2xl border-2 border-[#FF6319] animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#FF6319] text-white rounded-xl shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-black uppercase text-[#FF9E1B] flex items-center justify-between">
                <span>NYC BOE Alert Preview</span>
                <span className="text-[10px] text-slate-300">Now</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                NYC Polls are Open Today!
              </h4>
              <p className="text-xs text-blue-100 mt-1">
                Polls in all 5 NYC boroughs are open until 9:00 PM. Tap to view your assigned polling location.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">
            NYC Election Calendar
          </span>
          <span className="text-xs text-blue-200 font-medium">2026 Cycle</span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
            Key Deadlines & Reminder Alerts
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 leading-relaxed">
            Never miss an NYC election date. Sync critical deadlines to your Apple or Google Calendar with one click.
          </p>
        </div>

        {/* Primary Deadline Highlight Box */}
        <div className="bg-blue-950/70 p-4 rounded-xl border border-blue-800/80 backdrop-blur-xs flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase text-orange-400 tracking-wider">
              Next Critical Deadline:
            </div>
            <div className="text-sm sm:text-base font-bold text-white leading-snug">
              Voter Registration Cutoff (General Election)
            </div>
            <div className="text-xs text-blue-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>Saturday, October 24, 2026 • 11:59 PM</span>
            </div>
          </div>

          <div className="text-center bg-blue-900/90 px-3.5 py-2 rounded-xl border border-blue-700 shrink-0">
            <div className="text-xl font-black text-orange-400 leading-none">70</div>
            <div className="text-[10px] text-blue-200 font-bold uppercase mt-0.5">Days Left</div>
          </div>
        </div>
      </div>

      {/* Confirmation Toast */}
      {reminderSavedNotice && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reminderSavedNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'all', label: 'All Deadlines' },
          { id: 'registration', label: 'Registration' },
          { id: 'early_voting', label: 'Early Voting' },
          { id: 'election_day', label: 'Election Day' },
          { id: 'absentee', label: 'Mail / Absentee' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === tab.id
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Deadlines List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span className="uppercase tracking-wider text-[11px] text-slate-400 font-bold">
            {filteredDeadlines.length} Key Dates Listed
          </span>
          <span className="text-[11px] text-blue-700 font-bold">Click card to export</span>
        </div>

        {filteredDeadlines.map((dl) => {
          const isRemindActive = !!reminders[dl.id];
          return (
            <div
              key={dl.id}
              className={`bg-white p-4 sm:p-5 rounded-xl border-y border-r border-slate-200/80 transition-all shadow-sm space-y-3 ${
                dl.importance === 'critical'
                  ? 'border-l-4 border-l-orange-400'
                  : dl.importance === 'high'
                  ? 'border-l-4 border-l-blue-600'
                  : 'border-l-4 border-l-slate-300'
              }`}
            >
              {/* Deadline Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {dl.importance === 'critical' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-700">
                        Critical Date
                      </span>
                    ) : dl.importance === 'high' ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                        High Priority
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                        Notice
                      </span>
                    )}

                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-900" />
                      <span>{dl.date}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {dl.title}
                  </h3>
                </div>

                {/* Days remaining badge */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 text-xs font-bold font-mono border border-blue-100">
                    {dl.daysRemaining} days away
                  </span>
                </div>
              </div>

              {/* Time & Description */}
              <div className="text-xs text-slate-500 space-y-1">
                {dl.time && (
                  <div className="font-semibold text-slate-700 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Time: {dl.time}</span>
                  </div>
                )}
                <p className="leading-relaxed text-slate-500">{dl.description}</p>
              </div>

              {/* Action Buttons: Calendar Sync, Reminder Toggle, Direct Link */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                {/* Add to Google Calendar */}
                <a
                  href={getGoogleCalendarUrl(dl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition border border-blue-200"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-blue-700" />
                  <span>Google Calendar</span>
                </a>

                {/* Download .ICS Apple/Outlook File */}
                <button
                  onClick={() => downloadIcsFile(dl)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition border border-slate-200"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Apple / iCal File</span>
                </button>

                {/* In-App Reminder Toggle */}
                <button
                  onClick={() => toggleReminder(dl.id)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                    isRemindActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{isRemindActive ? 'Reminder Active' : 'Set Alert'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Automated SMS & Email Reminders Setup */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-900 rounded-xl">
            <Smartphone className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              NYC Smart Election Reminders
            </h3>
            <p className="text-xs text-slate-500">
              Receive automated reminders 7 days before, 1 day before, and on Election Day morning.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveContactReminders} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="voter@example.com"
                  value={reminderEmail}
                  onChange={(e) => setReminderEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number (SMS Alerts)
              </label>
              <div className="relative">
                <Smartphone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="(212) 555-0199"
                  value={reminderPhone}
                  onChange={(e) => setReminderPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
            <div className="font-bold text-slate-800">You will automatically receive:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                📅 <strong>7-Day Alert:</strong> Registration & Early Voting info
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                📍 <strong>24-Hour Alert:</strong> Your assigned poll site address
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                🗳️ <strong>Election Day 7AM:</strong> Poll opening & rights reminder
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Schedule Smart Election Reminders</span>
            </button>

            <button
              type="button"
              onClick={triggerTestNotification}
              className="py-3 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200"
              title="Test notification appearance"
            >
              Test Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
