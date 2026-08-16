import { PollingSite, ElectionDeadline, ChecklistItem, LanguageOption, VoterRecord, UserVoterProfile } from '../types';

export const NYC_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', localLabel: 'English' },
  { code: 'es', label: 'Spanish', localLabel: 'Español' },
  { code: 'zh', label: 'Chinese', localLabel: '繁體中文' },
  { code: 'bn', label: 'Bengali', localLabel: 'বাংলা' },
  { code: 'ko', label: 'Korean', localLabel: '한국어' },
];

export const NYC_SUBWAY_COLORS: Record<string, { bg: string; text: string }> = {
  '1': { bg: '#EE352E', text: '#FFFFFF' },
  '2': { bg: '#EE352E', text: '#FFFFFF' },
  '3': { bg: '#EE352E', text: '#FFFFFF' },
  '4': { bg: '#00933C', text: '#FFFFFF' },
  '5': { bg: '#00933C', text: '#FFFFFF' },
  '6': { bg: '#00933C', text: '#FFFFFF' },
  '7': { bg: '#B933AD', text: '#FFFFFF' },
  'A': { bg: '#0039A6', text: '#FFFFFF' },
  'C': { bg: '#0039A6', text: '#FFFFFF' },
  'E': { bg: '#0039A6', text: '#FFFFFF' },
  'B': { bg: '#FF6319', text: '#FFFFFF' },
  'D': { bg: '#FF6319', text: '#FFFFFF' },
  'F': { bg: '#FF6319', text: '#FFFFFF' },
  'M': { bg: '#FF6319', text: '#FFFFFF' },
  'G': { bg: '#6CBE45', text: '#FFFFFF' },
  'J': { bg: '#996633', text: '#FFFFFF' },
  'Z': { bg: '#996633', text: '#FFFFFF' },
  'L': { bg: '#A7A9AC', text: '#000000' },
  'N': { bg: '#FCCC0A', text: '#000000' },
  'Q': { bg: '#FCCC0A', text: '#000000' },
  'R': { bg: '#FCCC0A', text: '#000000' },
  'W': { bg: '#FCCC0A', text: '#000000' },
  'S': { bg: '#808183', text: '#FFFFFF' },
  'SIR': { bg: '#0039A6', text: '#FFFFFF' },
};

export const SAMPLE_POLL_SITES: PollingSite[] = [
  // Manhattan
  {
    id: 'mn-01',
    name: 'P.S. 40 Augustus Saint-Gaudens',
    type: 'both',
    address: '319 East 19th Street',
    borough: 'Manhattan',
    zip: '10003',
    crossStreets: 'Between 1st & 2nd Avenues',
    accessibleEntrance: 'Main ground level auditorium doors on 19th St with ADA automatic push button',
    accessibleRamp: true,
    hours: 'Election Day: 6:00 AM – 9:00 PM | Early Voting: 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1 (9 Consecutive Days)',
    lat: 40.7351,
    lng: -73.9818,
    transit: {
      subwayLines: ['L', '4', '5', '6', 'N', 'Q', 'R'],
      busLines: ['M15-SBS', 'M14A-SBS', 'M9'],
      nearestStation: '1st Ave (L) or 14 St-Union Sq (4/5/6/L/N/Q/R)',
      walkMinutes: 4,
    },
    districtInfo: {
      ed: '034',
      ad: '74',
      cd: '12',
      sd: '28',
      ccd: '02',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 5,
  },
  {
    id: 'mn-02',
    name: 'NYPL Harlem Branch Library',
    type: 'early_voting',
    address: '9 West 124th Street',
    borough: 'Manhattan',
    zip: '10027',
    crossStreets: 'Corner of 5th Ave & W 124th St',
    accessibleEntrance: 'West entrance ramp with automatic power doors directly into Community Room',
    accessibleRamp: true,
    hours: 'Early Voting: Weekdays 8:00 AM – 8:00 PM, Weekends 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1',
    lat: 40.8062,
    lng: -73.9442,
    transit: {
      subwayLines: ['2', '3', '4', '5', '6'],
      busLines: ['M1', 'M2', 'M7', 'M102', 'Bx15'],
      nearestStation: '125 St (2/3) or 125 St (4/5/6)',
      walkMinutes: 3,
    },
    districtInfo: {
      ed: '018',
      ad: '70',
      cd: '13',
      sd: '30',
      ccd: '09',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 8,
  },
  {
    id: 'mn-03',
    name: 'High School of Fashion Industries',
    type: 'election_day',
    address: '225 West 24th Street',
    borough: 'Manhattan',
    zip: '10011',
    crossStreets: 'Between 7th & 8th Avenues',
    accessibleEntrance: 'West 24th Street main lobby zero-threshold ramp',
    accessibleRamp: true,
    hours: 'Election Day: 6:00 AM – 9:00 PM',
    lat: 40.7456,
    lng: -73.9967,
    transit: {
      subwayLines: ['1', 'C', 'E', 'F', 'M'],
      busLines: ['M23-SBS', 'M7', 'M20'],
      nearestStation: '23 St (1) or 23 St (C/E)',
      walkMinutes: 2,
    },
    districtInfo: {
      ed: '042',
      ad: '75',
      cd: '10',
      sd: '47',
      ccd: '03',
    },
    waitStatus: 'Moderate',
    estimatedWaitMins: 12,
  },

  // Brooklyn
  {
    id: 'bk-01',
    name: 'Brooklyn Museum (Beaux-Arts Court)',
    type: 'both',
    address: '200 Eastern Parkway',
    borough: 'Brooklyn',
    zip: '11238',
    crossStreets: 'Corner of Washington Ave & Eastern Pkwy',
    accessibleEntrance: 'Main glass entrance pavilion, street level ramp, elevator to Beaux-Arts Court',
    accessibleRamp: true,
    hours: 'Election Day: 6:00 AM – 9:00 PM | Early Voting: 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1',
    lat: 40.6712,
    lng: -73.9636,
    transit: {
      subwayLines: ['2', '3', '4', 'S'],
      busLines: ['B41', 'B69', 'B48'],
      nearestStation: 'Eastern Pkwy-Brooklyn Museum (2/3)',
      walkMinutes: 1,
    },
    districtInfo: {
      ed: '056',
      ad: '57',
      cd: '09',
      sd: '20',
      ccd: '35',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 5,
  },
  {
    id: 'bk-02',
    name: 'Williamsburg Community Center / P.S. 19',
    type: 'election_day',
    address: '325 South 3rd Street',
    borough: 'Brooklyn',
    zip: '11211',
    crossStreets: 'Between Keap & Rodney Streets',
    accessibleEntrance: 'South 3rd St cafeteria entrance ramp',
    accessibleRamp: true,
    hours: 'Election Day: 6:00 AM – 9:00 PM',
    lat: 40.7107,
    lng: -73.9532,
    transit: {
      subwayLines: ['J', 'M', 'Z', 'G', 'L'],
      busLines: ['B24', 'B44-SBS', 'B60'],
      nearestStation: 'Marcy Ave (J/M/Z) or Lorimer St (L/G)',
      walkMinutes: 5,
    },
    districtInfo: {
      ed: '022',
      ad: '53',
      cd: '07',
      sd: '18',
      ccd: '34',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 6,
  },
  {
    id: 'bk-03',
    name: 'Barclays Center (Geico Atrium)',
    type: 'early_voting',
    address: '620 Atlantic Avenue',
    borough: 'Brooklyn',
    zip: '11217',
    crossStreets: 'Atlantic Ave & Flatbush Ave',
    accessibleEntrance: 'Main entrance atrium plaza zero-step entrance with wide turnstiles',
    accessibleRamp: true,
    hours: 'Early Voting: Weekdays 8:00 AM – 8:00 PM, Weekends 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1',
    lat: 40.6826,
    lng: -73.9754,
    transit: {
      subwayLines: ['2', '3', '4', '5', 'B', 'D', 'N', 'Q', 'R'],
      busLines: ['B41', 'B45', 'B67', 'B103'],
      nearestStation: 'Atlantic Av-Barclays Ctr (2/3/4/5/B/D/N/Q/R/LIRR)',
      walkMinutes: 1,
    },
    districtInfo: {
      ed: '009',
      ad: '52',
      cd: '10',
      sd: '25',
      ccd: '33',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 7,
  },

  // Queens
  {
    id: 'qn-01',
    name: 'Queens Public Library at Flushing',
    type: 'both',
    address: '41-17 Main Street',
    borough: 'Queens',
    zip: '11355',
    crossStreets: 'Main St & 41st Ave',
    accessibleEntrance: 'Main glass entrance on Main Street with ADA ramp and elevator access to lower level auditorium',
    accessibleRamp: true,
    hours: 'Election Day: 6:00 AM – 9:00 PM | Early Voting: 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1',
    lat: 40.7558,
    lng: -73.8291,
    transit: {
      subwayLines: ['7'],
      busLines: ['Q12', 'Q13', 'Q17', 'Q25', 'Q27', 'Q44-SBS', 'Q65'],
      nearestStation: 'Flushing-Main St (7 / LIRR)',
      walkMinutes: 2,
    },
    districtInfo: {
      ed: '041',
      ad: '40',
      cd: '06',
      sd: '16',
      ccd: '20',
    },
    waitStatus: 'Moderate',
    estimatedWaitMins: 10,
  },
  {
    id: 'qn-02',
    name: 'Museum of the Moving Image',
    type: 'early_voting',
    address: '36-01 35th Avenue',
    borough: 'Queens',
    zip: '11106',
    crossStreets: 'Corner of 36th St & 35th Ave, Astoria',
    accessibleEntrance: 'Main lobby courtyard entrance on 35th Ave with ground level ramp',
    accessibleRamp: true,
    hours: 'Early Voting: Weekdays 8:00 AM – 8:00 PM, Weekends 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1',
    lat: 40.7563,
    lng: -73.9239,
    transit: {
      subwayLines: ['E', 'M', 'R', 'N', 'W'],
      busLines: ['Q101', 'Q66', 'Q104'],
      nearestStation: 'Steinway St (M/R) or 36 Av (N/W)',
      walkMinutes: 4,
    },
    districtInfo: {
      ed: '015',
      ad: '36',
      cd: '14',
      sd: '12',
      ccd: '26',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 4,
  },

  // Bronx
  {
    id: 'bx-01',
    name: 'Bronx County Courthouse (Rotunda)',
    type: 'both',
    address: '851 Grand Concourse',
    borough: 'Bronx',
    zip: '10451',
    crossStreets: 'Grand Concourse & East 161st Street',
    accessibleEntrance: 'East 161st St ADA ramp and accessible elevator to 1st floor rotunda',
    accessibleRamp: true,
    hours: 'Election Day: 6:00 AM – 9:00 PM | Early Voting: 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1',
    lat: 40.8268,
    lng: -73.9228,
    transit: {
      subwayLines: ['4', 'B', 'D'],
      busLines: ['Bx1', 'Bx2', 'Bx6-SBS', 'Bx13'],
      nearestStation: '161 St-Yankee Stadium (4/B/D)',
      walkMinutes: 2,
    },
    districtInfo: {
      ed: '007',
      ad: '84',
      cd: '15',
      sd: '29',
      ccd: '17',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 5,
  },
  {
    id: 'bx-02',
    name: 'P.S. 83 Donald Hertz School',
    type: 'election_day',
    address: '950 Rhinelander Avenue',
    borough: 'Bronx',
    zip: '10462',
    crossStreets: 'Between Bogart & Paulding Avenues',
    accessibleEntrance: 'Rhinelander Ave side gymnasium entrance with push paddle door',
    accessibleRamp: true,
    hours: 'Election Day: 6:00 AM – 9:00 PM',
    lat: 40.8524,
    lng: -73.8617,
    transit: {
      subwayLines: ['2', '5'],
      busLines: ['Bx21', 'Bx31', 'BxM10'],
      nearestStation: 'Morris Park (5) or Pelham Pkwy (2/5)',
      walkMinutes: 6,
    },
    districtInfo: {
      ed: '031',
      ad: '80',
      cd: '14',
      sd: '34',
      ccd: '13',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 3,
  },

  // Staten Island
  {
    id: 'si-01',
    name: 'St. George Ferry Terminal / Borough Hall',
    type: 'both',
    address: '10 Richmond Terrace',
    borough: 'Staten Island',
    zip: '10301',
    crossStreets: 'Richmond Terrace & Hyatt St',
    accessibleEntrance: 'Richmond Terrace main street entrance with automatic sliding doors',
    accessibleRamp: true,
    hours: 'Election Day: 6:00 AM – 9:00 PM | Early Voting: 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1',
    lat: 40.6429,
    lng: -74.0761,
    transit: {
      subwayLines: ['SIR'],
      busLines: ['S40', 'S42', 'S44', 'S46', 'S48', 'S51', 'S61', 'S74', 'S76'],
      nearestStation: 'St. George Terminal (SIR & Ferry)',
      walkMinutes: 1,
    },
    districtInfo: {
      ed: '012',
      ad: '61',
      cd: '11',
      sd: '23',
      ccd: '49',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 4,
  },
  {
    id: 'si-02',
    name: 'College of Staten Island (Building 1R)',
    type: 'early_voting',
    address: '2800 Victory Boulevard',
    borough: 'Staten Island',
    zip: '10314',
    crossStreets: 'Victory Blvd & Loop Rd',
    accessibleEntrance: 'Building 1R West Atrium entrance with flat sidewalk entry',
    accessibleRamp: true,
    hours: 'Early Voting: Weekdays 8:00 AM – 8:00 PM, Weekends 9:00 AM – 5:00 PM',
    earlyVotingDates: 'Oct 24 – Nov 1',
    lat: 40.6019,
    lng: -74.1484,
    transit: {
      subwayLines: ['SIR'],
      busLines: ['S62', 'S92', 'S93', 'SIM33'],
      nearestStation: 'CSI Campus Transit Loop',
      walkMinutes: 3,
    },
    districtInfo: {
      ed: '045',
      ad: '63',
      cd: '11',
      sd: '24',
      ccd: '50',
    },
    waitStatus: 'Light',
    estimatedWaitMins: 5,
  },
];

export const UPCOMING_DEADLINES: ElectionDeadline[] = [
  {
    id: 'dl-reg-gen',
    title: 'Voter Registration Deadline (General Election)',
    category: 'registration',
    date: '2026-10-24',
    time: '11:59 PM',
    daysRemaining: 70,
    description: 'Last day your voter registration form must be postmarked or submitted online to vote in the upcoming General Election (10 days before Election Day in NYS).',
    actionLabel: 'Register Online Now',
    actionUrl: 'https://elections.ny.gov/voter-registration-process',
    importance: 'critical',
  },
  {
    id: 'dl-early-start',
    title: 'Early Voting Period Begins',
    category: 'early_voting',
    date: '2026-10-24',
    time: '8:00 AM',
    daysRemaining: 70,
    description: 'First day to cast your ballot in person before Election Day at your assigned Early Voting poll site. Open for 9 consecutive days including two weekends!',
    actionLabel: 'Find Early Voting Site',
    importance: 'critical',
  },
  {
    id: 'dl-abs-app',
    title: 'Absentee / Early Mail Ballot Online Request Deadline',
    category: 'absentee',
    date: '2026-10-26',
    time: '11:59 PM',
    daysRemaining: 72,
    description: 'Last day to apply online or by mail for an Absentee Ballot or NY No-Excuse Early Mail Ballot.',
    actionLabel: 'Request Mail Ballot',
    actionUrl: 'https://vote.nyc/page/absentee-voting',
    importance: 'high',
  },
  {
    id: 'dl-early-end',
    title: 'Early Voting Period Ends',
    category: 'early_voting',
    date: '2026-11-01',
    time: '5:00 PM',
    daysRemaining: 78,
    description: 'Final afternoon to vote early at your Early Voting poll site. Polls close at 5:00 PM on Sunday.',
    actionLabel: 'View Weekend Hours',
    importance: 'high',
  },
  {
    id: 'dl-election-day',
    title: 'GENERAL ELECTION DAY 2026',
    category: 'election_day',
    date: '2026-11-03',
    time: '6:00 AM – 9:00 PM',
    daysRemaining: 80,
    description: 'Polls across all five NYC boroughs are open from 6:00 AM to 9:00 PM. Remember: If you are in line by 9:00 PM, you MUST be permitted to vote!',
    actionLabel: 'Check My Poll Site',
    importance: 'critical',
  },
  {
    id: 'dl-abs-return',
    title: 'Mail Ballot Return / Postmark Cutoff',
    category: 'absentee',
    date: '2026-11-03',
    time: '9:00 PM',
    daysRemaining: 80,
    description: 'Mail ballots must be postmarked by Nov 3 and received by the BOE no later than 7 days after the election, or dropped off at any poll site by 9:00 PM.',
    actionLabel: 'Drop-off Locations',
    importance: 'high',
  },
  {
    id: 'dl-pollworker',
    title: 'NYC Student & Community Poll Worker Application',
    category: 'poll_worker',
    date: '2026-10-10',
    time: '5:00 PM',
    daysRemaining: 56,
    description: 'Get paid $250+ per day assisting fellow New Yorkers at the polls! NYC needs bilingual interpreters and machine inspectors.',
    actionLabel: 'Apply as Poll Worker ($250+/day)',
    actionUrl: 'https://vote.nyc/page/work-polls',
    importance: 'standard',
  },
];

export const VOTING_CHECKLIST_ITEMS: ChecklistItem[] = [
  // First-Time Voter Essentials
  {
    id: 'chk-know-id',
    category: 'first_time',
    title: '2. Understand NY Voter ID Rules',
    description: 'In New York State, already registered voters do NOT need to present a photo ID. Only first-time voters who registered by mail without SSN/DMV info may need proof of address.',
    tip: 'Acceptable backup ID: NYS Driver License, IDNYC, student ID, bank statement, or utility bill with your name & address.',
    completed: false,
    essential: true,
    docRequirement: 'No ID needed for 98% of voters; keep IDNYC or utility bill in bag just in case.',
  },
  {
    id: 'chk-find-poll',
    category: 'first_time',
    title: '3. Look Up Your Polling Place & Save Route',
    description: 'Note that your Early Voting site may be in a different building than your Election Day site.',
    tip: 'Use our interactive Lookup tab to view accessible entrances, subway lines, and live navigation.',
    completed: false,
    essential: true,
  },
  {
    id: 'chk-sample-ballot',
    category: 'first_time',
    title: '4. Preview Your Sample Ballot',
    description: 'Check the candidates and ballot proposals for your specific Election and Assembly District.',
    tip: 'You can bring notes or our digital voting plan into the booth with you!',
    completed: false,
    essential: false,
  },

  // Early Voting Checklist
  {
    id: 'chk-ev-site',
    category: 'early_voting',
    title: '2. Go to Your Assigned Early Voting Site Only',
    description: 'Unlike some other states, in NYC you must vote at your specifically designated Early Voting site for your address.',
    tip: 'Our lookup tool shows your exact Early Voting site in bold.',
    completed: false,
    essential: true,
  },

  // Election Day Checklist
  {
    id: 'chk-ed-time',
    category: 'election_day',
    title: '1. Plan Your Voting Time (6:00 AM – 9:00 PM)',
    description: 'NYC polls are open continuously for 15 hours. If you are in line at 8:59 PM, the poll workers MUST let you vote.',
    tip: 'Peak rush hours are 7:30–9:00 AM and 5:30–7:30 PM. Midday is fastest!',
    completed: false,
    essential: true,
  },

  // Know Your Rights
  {
    id: 'chk-rights-lang',
    category: 'rights',
    title: '2. Language & Interpreter Assistance Rights',
    description: 'Under the federal Voting Rights Act and NYC mandates, you are entitled to ballots and interpreters in Spanish, Chinese, Bengali, Korean, and Hindi at designated sites.',
    tip: 'You may also bring any friend, child, or assistant into the booth (except your employer or union boss).',
    completed: false,
    essential: false,
  },
];

// Mock NYC Board of Elections Database with Voter Serial Numbers (VSNs)
export const MOCK_VSN_RECORDS: VoterRecord[] = [
  {
    vsn: 'VSN-847291-NYC',
    fullName: 'Taylor M. Rivera',
    dob: '1992-04-14',
    borough: 'Manhattan',
    streetAddress: '310 East 20th Street',
    zip: '10003',
    party: 'Democratic Party',
    status: 'active',
    ed: '034',
    ad: '74',
    assignedPollSiteId: 'mn-01',
    earlyVotingSiteId: 'mn-01',
  },
  {
    vsn: 'VSN-512093-NYC',
    fullName: 'Elena Rostova',
    dob: '1988-11-23',
    borough: 'Brooklyn',
    streetAddress: '185 Eastern Parkway',
    zip: '11238',
    party: 'Working Families Party',
    status: 'active',
    ed: '056',
    ad: '57',
    assignedPollSiteId: 'bk-01',
    earlyVotingSiteId: 'bk-01',
  },
  {
    vsn: 'VSN-301928-NYC',
    fullName: 'Jordan K. Chen',
    dob: '1995-08-09',
    borough: 'Brooklyn',
    streetAddress: '340 South 3rd Street',
    zip: '11211',
    party: 'No Party Affiliation (Independent)',
    status: 'inactive',
    inactiveReason: 'Address confirmation notice returned undeliverable after recent relocation. Voter record moved to Inactive status pending confirmation.',
    ed: '012',
    ad: '50',
    assignedPollSiteId: 'bk-02',
    earlyVotingSiteId: 'bk-01',
  },
  {
    vsn: 'VSN-920144-NYC',
    fullName: 'Marcus D. Washington',
    dob: '1984-02-18',
    borough: 'Queens',
    streetAddress: '35-15 36th Avenue',
    zip: '11106',
    party: 'Democratic Party',
    status: 'inactive',
    inactiveReason: 'Inactive due to non-response to biennial NCOA (National Change of Address) mailer.',
    ed: '028',
    ad: '36',
    assignedPollSiteId: 'qn-01',
    earlyVotingSiteId: 'qn-01',
  },
  {
    vsn: 'VSN-773419-NYC',
    fullName: 'Priya Sharma',
    dob: '1990-06-30',
    borough: 'Queens',
    streetAddress: '34-20 74th Street',
    zip: '11372',
    party: 'Democratic Party',
    status: 'active',
    ed: '045',
    ad: '39',
    assignedPollSiteId: 'qn-02',
    earlyVotingSiteId: 'qn-02',
  },
  {
    vsn: 'VSN-664102-NYC',
    fullName: 'Carlos E. Mendez',
    dob: '1997-12-05',
    borough: 'Bronx',
    streetAddress: '330 Grand Concourse',
    zip: '10451',
    party: 'Democratic Party',
    status: 'active',
    ed: '015',
    ad: '84',
    assignedPollSiteId: 'bx-01',
    earlyVotingSiteId: 'bx-01',
  },
];

export function lookupVsnRecord(query: string): VoterRecord | null {
  const clean = query.trim().toUpperCase();
  if (!clean) return null;

  // Direct VSN match
  const found = MOCK_VSN_RECORDS.find(
    (r) => r.vsn.toUpperCase() === clean || r.vsn.replace(/-/g, '').toUpperCase() === clean.replace(/-/g, '')
  );
  if (found) return found;

  // Search by name
  return (
    MOCK_VSN_RECORDS.find((r) =>
      r.fullName.toLowerCase().includes(query.trim().toLowerCase())
    ) || null
  );
}

/**
 * Dynamically generates a tailored voter checklist based on the user's validated profile,
 * registration track (New vs. Existing), active/inactive status, and accessibility needs.
 */
export function generateAutoPopulatedChecklist(profile: UserVoterProfile): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // ==========================================
  // TRACK 1 & INACTIVE SPECIAL RECOVERY ITEMS
  // ==========================================
  if (profile.status === 'unregistered' || profile.track === 'new_voter') {
    items.push({
      id: 'chk-reg-submit',
      category: 'first_time',
      title: '1. Online Voter Registration Submission',
      description: `Your NYC Board of Elections voter registration application has been generated for ${profile.fullName || 'you'} (${profile.borough}, ZIP ${profile.zip}).`,
      tip: 'Verify that your confirmation is submitted before the 10-day pre-election cutoff.',
      completed: true,
      essential: true,
      badge: 'New Voter Track',
    });

    items.push({
      id: 'chk-reg-10day',
      category: 'first_time',
      title: '2. Track Registration Cutoff & Processing',
      description: 'NYS Board of Elections requires applications to be received at least 10 days before Election Day to be active on the electronic poll book.',
      tip: 'Once processed, you will receive an official BOE Voter Card in your mail with your VSN and FastPass tag.',
      completed: false,
      essential: true,
      badge: '10-Day Cutoff',
    });

    items.push({
      id: 'chk-first-id-rule',
      category: 'first_time',
      title: '3. First-Time Voter ID Exemption & Backup',
      description: 'Already registered NY voters do not need photo ID. If you registered online without DMV ID or SSN, carry any utility bill, bank statement, or IDNYC on your first visit.',
      tip: 'Signature comparison is the primary verification method at all NYC poll sites.',
      completed: false,
      essential: true,
    });
  }

  // ==========================================
  // INACTIVE VOTER SPECIAL RECOVERY ITEMS
  // ==========================================
  if (profile.status === 'inactive') {
    items.push({
      id: 'chk-inactive-recover-address',
      category: 'inactive_recovery',
      title: '⚠️ 1. Reactivate Status: Submit Address Confirmation / NCOA Update',
      description: `Your voter registration is currently INACTIVE. ${profile.inactiveReason || 'Address notice returned undeliverable.'} Submit an electronic or paper address update to reactivate your record to Active status.`,
      tip: 'You can update your address via the NYS DMV portal or with your Borough BOE office.',
      completed: false,
      essential: true,
      badge: 'Action Required',
    });

    items.push({
      id: 'chk-inactive-affidavit-right',
      category: 'inactive_recovery',
      title: '📜 2. Exercise Your Right to Cast an Affidavit Ballot',
      description: 'Under New York Election Law, if your status is inactive on the poll pad, poll workers MUST provide you an Affidavit Ballot. Once BOE verifies your signature and address, your vote is fully counted.',
      tip: 'Never walk away without voting. Poll workers cannot turn you away.',
      completed: false,
      essential: true,
      badge: 'Legal Right',
    });

    items.push({
      id: 'chk-inactive-contact-boe',
      category: 'inactive_recovery',
      title: '📞 3. Contact Borough Board of Elections Office',
      description: `Contact your local ${profile.borough} BOE Borough office (or 1-866-VOTE-NYC) to confirm your signature card on file.`,
      tip: 'BOE clerks can confirm if an address update has already been processed.',
      completed: false,
      essential: false,
    });
  }

  // ==========================================
  // ACTIVE EXISTING VOTER SPECIFIC ITEMS
  // ==========================================
  if (profile.status === 'active') {
    items.push({
      id: 'chk-active-fastpass',
      category: 'first_time',
      title: '1. FastPass Check-In Ready',
      description: `Your registration is ACTIVE on the official NYC voter roll (VSN: ${profile.vsn || 'VSN-847291-NYC'}). You are eligible for 10-second FastPass check-in.`,
      tip: 'State your name to the poll clerk or show your digital voter barcode.',
      completed: true,
      essential: true,
      badge: 'Active Verified',
    });
  }

  // ==========================================
  // ACCESSIBILITY NEEDS (IF SELECTED)
  // ==========================================
  if (profile.accessibility) {
    if (profile.accessibility.ballotMarkingDevice) {
      items.push({
        id: 'chk-acc-bmd',
        category: 'accessibility',
        title: '♿ 1. Request Ballot Marking Device (BMD) at Check-In',
        description: 'Every NYC poll site is equipped with an accessible Ballot Marking Device with audio tactile controller, headphones, and rocker paddle.',
        tip: 'Ask the check-in table worker for the BMD privacy booth. It prints an official standard paper ballot.',
        completed: false,
        essential: true,
        badge: 'Accessibility Need',
      });
    }

    if (profile.accessibility.wheelchairRamp) {
      items.push({
        id: 'chk-acc-ramp',
        category: 'accessibility',
        title: '🚪 2. Verify Zero-Threshold Ramp Entrance',
        description: profile.assignedPollSite?.accessibleEntrance
          ? `Accessible Entrance: ${profile.assignedPollSite.accessibleEntrance}`
          : 'Confirm accessible ramp entrance and automatic door openers at your designated site.',
        tip: 'All NYC poll sites are mandated ADA compliant with zero-barrier path of travel.',
        completed: false,
        essential: true,
        badge: 'Mobility Access',
      });
    }

    if (profile.accessibility.languageAssistance) {
      items.push({
        id: 'chk-acc-lang',
        category: 'accessibility',
        title: '🗣️ 3. Request Multi-Lingual Ballot & On-Site Interpreter',
        description: `NYC BOE provides certified ballots and language assistance interpreters in Spanish, Chinese, Bengali, Korean, and Hindi at designated districts.`,
        tip: 'You can also bring any trusted assistant or family member into the booth with you.',
        completed: false,
        essential: false,
        badge: 'Language Support',
      });
    }

    if (profile.accessibility.largePrintBallot || profile.accessibility.audioScreenReader) {
      items.push({
        id: 'chk-acc-vision',
        category: 'accessibility',
        title: '🔍 4. Vision Accommodations: Large Print & Audio Screen Reader',
        description: 'Use the high-contrast magnification mode or audio tactile headphones on the BMD terminal for independent ballot marking.',
        tip: 'Poll workers can provide large print magnifying sheets upon request.',
        completed: false,
        essential: false,
        badge: 'Vision Access',
      });
    }

    if (profile.accessibility.curbsideSeating) {
      items.push({
        id: 'chk-acc-seating',
        category: 'accessibility',
        title: '🪑 5. Line Seating & Priority Queue Accommodation',
        description: 'Poll coordinators can provide seating chairs while in line or offer expedited line assistance if standing for long periods is difficult.',
        tip: 'Inform the line monitor / Information Table greeter immediately upon arrival.',
        completed: false,
        essential: false,
        badge: 'Queue Support',
      });
    }
  }

  // ==========================================
  // EARLY VOTING & ELECTION DAY PLANNING
  // ==========================================
  const pollSite = profile.assignedPollSite || SAMPLE_POLL_SITES[0];
  const earlySite = profile.earlyVotingSite || SAMPLE_POLL_SITES[0];

  items.push({
    id: 'chk-poll-lookup',
    category: 'early_voting',
    title: '📅 1. Choose Early Voting (9 Consecutive Days) vs Election Day',
    description: `Early Voting Site: ${earlySite.name} (${earlySite.address}). Election Day Site: ${pollSite.name} (${pollSite.address}).`,
    tip: `Transit: Subway lines ${pollSite.transit.subwayLines.join(', ')} • ${pollSite.transit.walkMinutes} min walk from ${pollSite.transit.nearestStation}.`,
    completed: false,
    essential: true,
  });

  items.push({
    id: 'chk-ballot-practice',
    category: 'election_day',
    title: '🗳️ 3. Practice Ranked Choice Voting (RCV) & Scanner',
    description: 'Rank up to 5 candidates in order of preference for municipal primary and special elections, then feed ballot into the DS200 scanner.',
    tip: 'Use our Demo Booth tab to practice filling and submitting a digital test ballot.',
    completed: false,
    essential: true,
  });

  return items;
}

