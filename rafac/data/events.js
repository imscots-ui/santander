export const EVENTS = [
  {
    id: 'e1',
    name: 'Shooting (L98 & .22)',
    date: '14–16 Nov 2026',
    location: 'Bisley, Surrey',
    type: 'AT',
    forms: ['TG21','TG23'],
    cadets: [
      { cadetId:'c01', ini:'SM', name:'Mitchell, S', status:'signed',  sentAt:'10 Nov', signedAt:'11 Nov' },
      { cadetId:'c03', ini:'RA', name:'Ahmed, R',    status:'sent',    sentAt:'10 Nov', signedAt:null },
    ],
  },
  {
    id: 'e5',
    name: 'Music Camp',
    date: '21–23 Nov 2026',
    location: 'RAF Cranwell',
    type: 'Activity',
    forms: ['TG21'],
    cadets: [
      { cadetId:'c02', ini:'TM', name:'Thomas, M',  status:'signed',  sentAt:'5 Nov',  signedAt:'6 Nov' },
      { cadetId:'c04', ini:'JH', name:'Harper, J',  status:'sent',    sentAt:'5 Nov',  signedAt:null },
      { cadetId:'c05', ini:'AK', name:'Khan, A',    status:'unsent',  sentAt:null,     signedAt:null },
    ],
  },
  {
    id: 'e6',
    name: 'Hill Walking (Bronze)',
    date: '5–6 Dec 2026',
    location: 'Trossachs, Scotland',
    type: 'AT',
    forms: ['TG21','TG23'],
    cadets: [
      { cadetId:'c02', ini:'TM', name:'Thomas, M',  status:'unsent', sentAt:null, signedAt:null },
      { cadetId:'c07', ini:'LW', name:'Wright, L',  status:'unsent', sentAt:null, signedAt:null },
      { cadetId:'c08', ini:'EP', name:'Patel, E',   status:'unsent', sentAt:null, signedAt:null },
    ],
  },
];

export const PARADE_NIGHTS = [
  { date:'7 Nov 2026',  label:'Parade Night',       cadets:['c01','c02','c03','c05','c07','c08'], guests:0 },
  { date:'31 Oct 2026', label:'Halloween Drill Night', cadets:['c01','c02','c04','c06'],          guests:2 },
  { date:'24 Oct 2026', label:'Parade Night',        cadets:['c01','c02','c03','c07'],             guests:0 },
];
