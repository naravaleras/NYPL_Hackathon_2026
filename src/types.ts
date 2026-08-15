export type Borough = 'Manhattan' | 'Brooklyn' | 'Queens' | 'Bronx' | 'Staten Island';

export type VoterRegistrationStatus = 'unregistered' | 'active' | 'inactive';

export interface AccessibilityNeeds {
  ballotMarkingDevice: boolean; // BMD
  wheelchairRamp: boolean;
  audioScreenReader: boolean;
  largePrintBallot: boolean;
  languageAssistance: boolean;
  selectedLanguage?: SupportedLanguage | 'hindi' | 'asl';
  curbsideSeating: boolean;
  serviceAnimal: boolean;
  notes?: string;
}

export interface VoterRecord {
  vsn: string; // Voter Serial Number
  fullName: string;
  dob: string;
  borough: Borough;
  streetAddress: string;
  zip: string;
  party: string;
  status: VoterRegistrationStatus;
  inactiveReason?: string;
  ed: string;
  ad: string;
  assignedPollSiteId: string;
  earlyVotingSiteId: string;
}

export interface UserVoterProfile {
  track: 'new_voter' | 'existing_voter';
  vsn?: string;
  isRegistered: boolean;
  status: VoterRegistrationStatus;
  inactiveReason?: string;
  fullName: string;
  dob: string;
  borough: Borough;
  streetAddress: string;
  apt?: string;
  zip: string;
  email?: string;
  phone?: string;
  party: string;
  isUsCitizen: boolean;
  is18OrOlderByElection: boolean;
  accessibility: AccessibilityNeeds;
  assignedPollSite?: PollingSite;
  earlyVotingSite?: PollingSite;
  registrationCompletedAt?: string;
}

export interface TransitInfo {
  subwayLines: string[];
  busLines: string[];
  nearestStation: string;
  walkMinutes: number;
}

export interface PollingSite {
  id: string;
  name: string;
  type: 'election_day' | 'early_voting' | 'both';
  address: string;
  borough: Borough;
  zip: string;
  crossStreets: string;
  accessibleEntrance: string;
  accessibleRamp: boolean;
  hours: string;
  earlyVotingDates?: string;
  lat: number;
  lng: number;
  transit: TransitInfo;
  districtInfo: {
    ed: string; // Election District
    ad: string; // Assembly District
    cd: string; // Congressional District
    sd: string; // State Senate District
    ccd: string; // City Council District
  };
  sampleBallotUrl?: string;
  waitStatus?: 'Light' | 'Moderate' | 'Busy';
  estimatedWaitMins?: number;
}

export interface NavigationStep {
  instruction: string;
  distance: string;
  duration: string;
  type: 'walk' | 'subway' | 'bus' | 'arrive';
  line?: string;
  stationOrStreet?: string;
}

export interface NavigationRoute {
  destinationName: string;
  destinationAddress: string;
  mode: 'transit' | 'walking' | 'biking' | 'driving';
  totalDuration: string;
  totalDistance: string;
  steps: NavigationStep[];
  googleMapsUrl: string;
  appleMapsUrl: string;
  mtaTripUrl: string;
}

export interface ElectionDeadline {
  id: string;
  title: string;
  category: 'registration' | 'early_voting' | 'absentee' | 'election_day' | 'poll_worker';
  date: string; // ISO or YYYY-MM-DD
  time?: string;
  daysRemaining: number;
  description: string;
  actionLabel: string;
  actionUrl?: string;
  importance: 'critical' | 'high' | 'standard';
}

export interface ChecklistItem {
  id: string;
  category: 'first_time' | 'early_voting' | 'election_day' | 'rights' | 'inactive_recovery' | 'accessibility';
  title: string;
  description: string;
  tip?: string;
  completed: boolean;
  essential: boolean;
  docRequirement?: string;
  badge?: string;
  actionUrl?: string;
}

export interface VoterReminder {
  id: string;
  title: string;
  targetDate: string;
  triggerDaysBefore: number;
  enabled: boolean;
  channel: 'browser' | 'calendar' | 'sms_email';
  notificationTime: string;
}

export interface VoterRegistrationFormData {
  fullName: string;
  dateOfBirth: string;
  borough: Borough;
  streetAddress: string;
  apt?: string;
  zip: string;
  email: string;
  phone: string;
  partyAffiliation: string;
  isUsCitizen: boolean;
  is18OrOlderByElection: boolean;
  hasNysDmvId: boolean;
  dmvIdNumber?: string;
  lastFourSsn?: string;
}

export type SupportedLanguage = 'en' | 'es' | 'zh' | 'bn' | 'ko';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  localLabel: string;
}
