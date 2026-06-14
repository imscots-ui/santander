export const EVENTS = [
  {
    id: 'e1',
    name: 'Summer Camp 2026',
    date: '19–26 Jul 2026',
    location: 'RAF Woodvale, Merseyside',
    type: 'Activity',
    forms: ['TG21','TG23'],
    cadets: [
      { cadetId:'c01', ini:'SM', name:'Mitchell, S', status:'signed',  sentAt:'10 Jun', signedAt:'12 Jun' },
      { cadetId:'c03', ini:'RA', name:'Ahmed, R',    status:'sent',    sentAt:'10 Jun', signedAt:null },
      { cadetId:'c02', ini:'TM', name:'Thomas, M',   status:'signed',  sentAt:'10 Jun', signedAt:'11 Jun' },
      { cadetId:'c05', ini:'AK', name:'Khan, A',     status:'unsent',  sentAt:null,     signedAt:null },
    ],
  },
  {
    id: 'e5',
    name: 'Silver Fieldcraft (WSW)',
    date: '27–28 Jun 2026',
    location: 'Tinto Hill, Lanarkshire',
    type: 'AT',
    forms: ['TG21','TG23'],
    cadets: [
      { cadetId:'c02', ini:'TM', name:'Thomas, M',  status:'signed',  sentAt:'5 Jun',  signedAt:'6 Jun' },
      { cadetId:'c04', ini:'JH', name:'Harper, J',  status:'sent',    sentAt:'5 Jun',  signedAt:null },
      { cadetId:'c07', ini:'LW', name:'Wright, L',  status:'unsent',  sentAt:null,     signedAt:null },
    ],
  },
  {
    id: 'e6',
    name: 'Gliding Scholarship',
    date: '3–7 Aug 2026',
    location: 'Dalton Airfield, Yorkshire',
    type: 'AT',
    forms: ['TG21','TG23'],
    cadets: [
      { cadetId:'c01', ini:'SM', name:'Mitchell, S', status:'unsent', sentAt:null, signedAt:null },
      { cadetId:'c08', ini:'EP', name:'Patel, E',    status:'unsent', sentAt:null, signedAt:null },
      { cadetId:'c09', ini:'OC', name:'Cooper, O',   status:'unsent', sentAt:null, signedAt:null },
    ],
  },
];

export const PARADE_NIGHTS = [
  { date:'12 Jun 2026', label:'Parade Night',         cadets:['c01','c02','c03','c05','c07','c08'], guests:0 },
  { date:'5 Jun 2026',  label:'Navigation Exercise',  cadets:['c01','c02','c04','c06'],             guests:0 },
  { date:'29 May 2026', label:'Parade Night',         cadets:['c01','c02','c03','c07','c09'],       guests:1 },
];
