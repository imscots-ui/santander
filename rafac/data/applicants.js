export const INITIAL_APPLICANTS = [
  { id:'ap1', fn:'Sophie',  sn:'Campbell', dob:'2011-03-14', age:15, status:'applicant', unit:'1701 (Johnstone)', wing:'West Scotland', src:'Walk-in / parade night', contact:'07700 900201', notes:'Met at open night — very keen, parents supportive', rejected:false },
  { id:'ap2', fn:'Ryan',    sn:'Donnelly', dob:'2013-01-22', age:13, status:'enquiry',   unit:'1701 (Johnstone)', wing:'West Scotland', src:'RAFAC website',           contact:'07700 900202', notes:'Website form — follow up by phone', rejected:false },
  { id:'ap3', fn:'Emma',    sn:'Johnston', dob:'2012-07-09', age:13, status:'invitee',   unit:'1701 (Johnstone)', wing:'West Scotland', src:'Friend / word of mouth',  contact:'07700 900203', notes:'Friend of Cdt Mitchell — invited to join night', rejected:false },
  { id:'ap4', fn:'Callum',  sn:'Fraser',   dob:'2014-02-28', age:12, status:'invitee',   unit:'1701 (Johnstone)', wing:'West Scotland', src:'Recruitment stand',       contact:'07700 900204', notes:'Met at Johnstone Gala — parents came in together', rejected:false },
  { id:'ap5', fn:'Niamh',   sn:'MacLeod',  dob:'2013-11-05', age:12, status:'enquiry',   unit:'1701 (Johnstone)', wing:'West Scotland', src:'Parent enquiry',          contact:'07700 900205', notes:'Mum called after seeing Facebook post', rejected:false },
  { id:'ap6', fn:'Dean',    sn:'Haggerty', dob:'2010-08-17', age:15, status:'enquiry',   unit:'1701 (Johnstone)', wing:'West Scotland', src:'School referral',         contact:'07700 900206', notes:'PE teacher referred — interest in aviation', rejected:true },
];

export const STATUS_META = {
  enquiry:   { label:'Enquiry',   bg:'#FFF0CC', color:'#7A4A00' },
  invitee:   { label:'Invitee',   bg:'#D6E8F7', color:'#003D80' },
  applicant: { label:'Applicant', bg:'#D4EDDA', color:'#0F4020' },
  rejected:  { label:'Rejected',  bg:'#F8D7DA', color:'#8B1A1A' },
};

export const STAGE_NEXT = { enquiry:'invitee', invitee:'applicant' };
