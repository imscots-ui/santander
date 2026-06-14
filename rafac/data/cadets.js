export const CADETS = [
  { id:'c01', ini:'SM', rank:'Cpl',  sn:'Mitchell', fn:'Sarah',   svc:'2408773', age:16, att:92, badges:3, pts:'Leading',    swim:true,  issue:'Consent pending' },
  { id:'c02', ini:'TM', rank:'Sgt',  sn:'Thomas',   fn:'Megan',   svc:'2308221', age:17, att:96, badges:5, pts:'Senior',     swim:true,  issue:null },
  { id:'c03', ini:'RA', rank:'LCpl', sn:'Ahmed',    fn:'Rafi',    svc:'2309441', age:16, att:88, badges:2, pts:'First Class',swim:true,  issue:null },
  { id:'c04', ini:'JH', rank:'Cdt',  sn:'Harper',   fn:'James',   svc:'2411002', age:15, att:74, badges:1, pts:'First Class',swim:false, issue:'Profile incomplete' },
  { id:'c05', ini:'AK', rank:'Cdt',  sn:'Khan',     fn:'Aliya',   svc:'2411099', age:14, att:81, badges:1, pts:'First Class',swim:true,  issue:'Medical missing' },
  { id:'c06', ini:'DM', rank:'Cdt',  sn:'Mason',    fn:'Daniel',  svc:'2411111', age:15, att:70, badges:0, pts:'Recruit',    swim:false, issue:'NOK unverified' },
  { id:'c07', ini:'LW', rank:'Cdt',  sn:'Wright',   fn:'Lily',    svc:'2410088', age:14, att:85, badges:1, pts:'First Class',swim:true,  issue:'No GP details' },
  { id:'c08', ini:'EP', rank:'Cdt',  sn:'Patel',    fn:'Eshaan',  svc:'2410065', age:15, att:77, badges:1, pts:'First Class',swim:false, issue:'Photo missing' },
  { id:'c09', ini:'OC', rank:'Cdt',  sn:'Cooper',   fn:'Oliver',  svc:'2410033', age:14, att:63, badges:0, pts:'Recruit',    swim:false, issue:'School outdated' },
];

export const STAFF = [
  { ini:'JH', rank:'Sqn Ldr', sn:'Harris',  fn:'Jane',    role:'OC',              svc:'0001' },
  { ini:'DR', rank:'Flt Lt',  sn:'Reid',    fn:'David',   role:'Trg Officer',     svc:'0002' },
  { ini:'KA', rank:'Fg Off',  sn:'Ahmad',   fn:'Khalid',  role:'Adj / Admin',     svc:'0003' },
  { ini:'SP', rank:'WO',      sn:'Pryce',   fn:'Sarah',   role:'Discipline / AT', svc:'0004' },
];

export const RANK_ORDER = ['Cdt','LCdt','Cpl','Sgt','FS','WO'];

export const RANK_COLOR = {
  Cdt: '#5A7090', LCdt: '#3B7DD8', Cpl: '#00264D',
  Sgt: '#1B6B3A', FS: '#C8A032', WO: '#8B1A1A',
};
