/**
 * Santander Business Banking — Concept Prototype
 *
 * Created by Alan Davidson · Alan.Davidson@santander.co.uk · May 2026
 *
 * A self-initiated concept piece exploring paperless workflows for
 * Santander Business Banking. Prototype only — no backend, no real
 * data, no live system connections. Provided for internal discussion.
 */

import { useState, useEffect, useMemo } from 'react';
import {
  Home, ArrowLeft, ArrowRight, Check, Clock, Users, FileText,
  Upload, ShieldCheck, AlertCircle, ChevronRight, X, PenLine,
  UserCheck, Banknote, Archive, FileSignature, Bell, Lock,
  CircleCheck, UserPlus, Building2, Scale, Info, Pause, RefreshCw,
  Calendar, ShieldAlert, MapPin, Mail, Phone, CreditCard,
  Globe, Briefcase, Camera, MailX, ChevronDown, Heart, Headphones,
  Video, Flag, Building, AlertTriangle, ScrollText, BookOpen, Zap,
  Receipt, TrendingUp, PoundSterling, Calculator, Send, Tag, Link2,
  CalendarDays, BarChart3, Sparkles, Award, Search,
  Eye, EyeOff, Fingerprint, Snowflake
} from 'lucide-react';

export default function App() {
  // === ALL HOOKS AT TOP LEVEL ===
  const [tab, setTab] = useState('home');
  const [workflow, setWorkflow] = useState(null);
  const [step, setStep] = useState(0);
  const [viewMode, setViewMode] = useState('mobile');
  const [showCompliance, setShowCompliance] = useState(false);
  const [showSavings, setShowSavings] = useState(false);
  const [showRMSheet, setShowRMSheet] = useState(false);
  const [showEntitySwitcher, setShowEntitySwitcher] = useState(false);
  const [rmReason, setRMReason] = useState(null);
  const [approvalState, setApprovalState] = useState({});
  const [toast, setToast] = useState(null);
  const [cooling, setCooling] = useState([]);
  const [stalled, setStalled] = useState([]);
  const [pendingCancelId, setPendingCancelId] = useState(null);
  const [tick, setTick] = useState(0); // forces re-render every 30s for live timers

  // Entity (the customer's organisation)
  const [entityType, setEntityType] = useState('limited');

  // Workflow state — ALL at top level so it persists across renders
  const [closureSel, setClosureSel] = useState([]);
  const [closureDest, setClosureDest] = useState('');
  const [closureConfirm, setClosureConfirm] = useState(false);
  const [closureUnreachable, setClosureUnreachable] = useState(null); // null | 'pending' | 'health' | 'contact' | 'deceased' | 'dispute'
  const [closureContactLog, setClosureContactLog] = useState('');
  const [closureEvidenceUp, setClosureEvidenceUp] = useState(false);
  const [closureVulnDecl, setClosureVulnDecl] = useState(false);

  const [personalLinked, setPersonalLinked] = useState(true);
  const [unlinkConfirm, setUnlinkConfirm] = useState(false);
  const [unlinkAllChannels, setUnlinkAllChannels] = useState(false);
  const [unlinkPostal, setUnlinkPostal] = useState(false);

  // Open banking / PSD2 consent state
  const [showOBSheet, setShowOBSheet] = useState(false);
  const [obFCRevoked, setObFCRevoked] = useState(false);

  // Credit decisioning ring-fence state
  const [creditRingfenced, setCreditRingfenced] = useState(false);
  const [ringfenceConfirm, setRingfenceConfirm] = useState(false);

  // Card management / PIN state
  const [showPinSheet, setShowPinSheet] = useState(false);
  const [pinCardKey, setPinCardKey] = useState(0);
  const [pinAuthDone, setPinAuthDone] = useState(false);
  const [pinRevealed, setPinRevealed] = useState(false);
  const [pinCountdown, setPinCountdown] = useState(30);
  const [frozenCards, setFrozenCards] = useState(new Set());

  const [bizChanges, setBizChanges] = useState({});
  const [bizName, setBizName] = useState('');
  const [bizAddr, setBizAddr] = useState('');
  const [bizPhone, setBizPhone] = useState('');
  const [bizEmail, setBizEmail] = useState('');
  const [bizProofUp, setBizProofUp] = useState(false);

  const [mandateAction, setMandateAction] = useState(null);
  const [mandateSig, setMandateSig] = useState(null);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonSurname, setNewPersonSurname] = useState('');
  const [newPersonDob, setNewPersonDob] = useState('');
  const [newPersonEmail, setNewPersonEmail] = useState('');
  const [newPersonAddr, setNewPersonAddr] = useState('');
  const [newPersonResidence, setNewPersonResidence] = useState('United Kingdom');
  const [newPersonVisa, setNewPersonVisa] = useState(null);
  const [newPersonPEP, setNewPersonPEP] = useState(false);
  const [tradingMatchesRes, setTradingMatchesRes] = useState(true);
  const [list1Up, setList1Up] = useState(false);
  const [list2Up, setList2Up] = useState(false);
  const [list3Up, setList3Up] = useState(false);
  const [boardMinutesUp, setBoardMinutesUp] = useState(false);
  const [newRule, setNewRule] = useState(null);

  const [wagesSource, setWagesSource] = useState(null);
  const [wagesFile, setWagesFile] = useState(null);
  const [wagesSchedule, setWagesSchedule] = useState('now');

  // Persistent payee list — replaces CSV-only workflow.
  // In production this lives in the customer's payee book per account.
  const [payees, setPayees] = useState([
    { id: 'p1', name: 'Aisha Khan', sortCode: '20-32-71', acct: '··2284', amount: 3200, role: 'Senior Engineer', selected: true, copStatus: 'verified' },
    { id: 'p2', name: 'Ben Carter', sortCode: '04-00-04', acct: '··6691', amount: 2850, role: 'Operations Lead', selected: true, copStatus: 'verified' },
    { id: 'p3', name: 'Carmen Diaz', sortCode: '20-32-71', acct: '··3340', amount: 4100, role: 'Finance Manager', selected: true, copStatus: 'verified' },
    { id: 'p4', name: 'David Olu', sortCode: '40-05-51', acct: '··8127', amount: 3950, role: 'Designer', selected: true, copStatus: 'verified' },
    { id: 'p5', name: 'Elena Petrov', sortCode: '23-69-72', acct: '··0445', amount: 5200, role: 'Product Lead', selected: true, copStatus: 'verified' },
    { id: 'p6', name: 'Faisal Ahmed', sortCode: '09-01-29', acct: '··7733', amount: 3650, role: 'Senior Engineer', selected: true, copStatus: 'verified' },
    { id: 'p7', name: 'Grace Walker', sortCode: '20-32-71', acct: '··2891', amount: 2900, role: 'Marketing', selected: true, copStatus: 'verified' },
    { id: 'p8', name: 'Hassan Iqbal', sortCode: '04-00-04', acct: '··5582', amount: 4400, role: 'Engineering Lead', selected: true, copStatus: 'verified' },
    { id: 'p9', name: 'Isla Murray', sortCode: '40-05-51', acct: '··9163', amount: 3100, role: 'Designer', selected: true, copStatus: 'verified' },
    { id: 'p10', name: 'Jamal Brooks', sortCode: '23-69-72', acct: '··4456', amount: 3800, role: 'Account Manager', selected: false, copStatus: 'verified' },
  ]);
  const [payeeSearch, setPayeeSearch] = useState('');
  const [showAddPayee, setShowAddPayee] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeSort, setNewPayeeSort] = useState('');
  const [newPayeeAcct, setNewPayeeAcct] = useState('');
  const [newPayeeAmount, setNewPayeeAmount] = useState('');
  const [newPayeeRole, setNewPayeeRole] = useState('');

  // MTD (Making Tax Digital) state
  const [mtdConnected, setMtdConnected] = useState(true); // HMRC OAuth status
  const [mtdQuarterStep, setMtdQuarterStep] = useState(0); // step in quarterly submission flow
  const [mtdReviewedTransactions, setMtdReviewedTransactions] = useState({}); // { txId: 'business' | 'personal' | category }
  const [mtdConfirmDeclaration, setMtdConfirmDeclaration] = useState(false);

  // Statements / counterparty search state
  const [moneyView, setMoneyView] = useState('overview'); // 'overview' | 'tax' | 'statements'
  const [statementMonth, setStatementMonth] = useState('2026-09'); // YYYY-MM
  const [statementView, setStatementView] = useState('chronological'); // 'chronological' | 'category'
  const [counterpartyQuery, setCounterpartyQuery] = useState('');
  const [openCounterparty, setOpenCounterparty] = useState(null); // counterparty name being viewed
  const [methodFilter, setMethodFilter] = useState('all'); // 'all' | 'card' | 'dd' | 'so' | 'fp' | 'bacs'
  const [paymentPending, setPaymentPending] = useState(null); // null | { kind, label, total, count, countdown }

  // Load fonts
  useEffect(() => {
    if (document.querySelector('link[data-fonts]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.fonts = '1';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Live timer — re-renders every 30 seconds so cooling-off countdowns stay current.
  // Cheap (one state update per 30s) and only matters when a cooling-off is active.
  useEffect(() => {
    if (cooling.length === 0) return;
    const interval = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(interval);
  }, [cooling.length]);

  // Payment / HMRC cool-off countdown — 1s ticks, executes at zero
  useEffect(() => {
    if (!paymentPending) return;
    if (paymentPending.countdown <= 0) {
      if (paymentPending.kind === 'hmrc') {
        fireToast('Submitted to HMRC. Receipt #VAT2026Q3-9482 in your audit log.');
        setMtdQuarterStep(0);
        setMtdReviewedTransactions({});
        setMtdConfirmDeclaration(false);
      } else {
        fireToast(`Payment sent — ${paymentPending.label}`);
      }
      setPaymentPending(null);
      closeWorkflow();
      return;
    }
    const t = setTimeout(() => setPaymentPending(p => p ? { ...p, countdown: p.countdown - 1 } : null), 1000);
    return () => clearTimeout(t);
  }, [paymentPending]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!pinRevealed) return;
    if (pinCountdown <= 0) { setPinRevealed(false); setPinCountdown(30); return; }
    const t = setTimeout(() => setPinCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [pinRevealed, pinCountdown]);

  const fireToast = (msg) => setToast(msg);

  // === STATIC DATA ===
  const ENTITY_INFO = {
    'sole-trader': { label: 'Sole trader', name: 'James Whitfield', principal: 'sole trader', authorities: 'authorised signatories', isTreasurer: false, isLimited: false, requiresCH: false, requiresCC: false, requiresPartnership: false, requiresMinutes: false },
    'partnership': { label: 'Partnership', name: 'Whitfield & Co Partnership', principal: 'partner', authorities: 'partners', isTreasurer: false, isLimited: false, requiresCH: false, requiresCC: false, requiresPartnership: true, requiresMinutes: false },
    'limited': { label: 'Limited company', name: 'Whitfield Holdings Ltd', principal: 'director', authorities: 'directors', isTreasurer: false, isLimited: true, requiresCH: true, requiresCC: false, requiresPartnership: false, requiresMinutes: false, chNumber: '07429183' },
    'llp': { label: 'Limited liability partnership', name: 'Whitfield Partners LLP', principal: 'member', authorities: 'members', isTreasurer: false, isLimited: true, requiresCH: true, requiresCC: false, requiresPartnership: false, requiresMinutes: false, chNumber: 'OC428192' },
    'charity': { label: 'Registered charity', name: 'Whitfield Education Trust', principal: 'trustee', authorities: 'trustees', isTreasurer: true, isLimited: false, requiresCH: false, requiresCC: true, requiresPartnership: false, requiresMinutes: true, ccNumber: '1192847' },
    'club': { label: 'Club', name: 'Whitfield Bowls Club', principal: 'committee member', authorities: 'committee members', isTreasurer: true, isLimited: false, requiresCH: false, requiresCC: false, requiresPartnership: false, requiresMinutes: true },
    'society': { label: 'Society', name: 'Whitfield Historical Society', principal: 'committee member', authorities: 'committee members', isTreasurer: true, isLimited: false, requiresCH: false, requiresCC: false, requiresPartnership: false, requiresMinutes: true },
  };
  const entity = ENTITY_INFO[entityType];

  const PERSONAL_ACCOUNTS = [
    { name: 'Personal Current Account', no: '····7291', balance: 4250.80, sortCode: '09-01-29' },
    { name: 'Santander 1|2|3 Lite', no: '····3847', balance: 12400.00, sortCode: '09-01-29' },
  ];

  const OB_CONSENTS = [
    { id: 'xero', app: 'Xero', purpose: 'Accounting software', scope: 'Business accounts · read-only', expires: '14 Dec 2026', exposesPersonal: false },
    { id: 'dext', app: 'Dext', purpose: 'Receipt capture', scope: 'Business transactions · read-only', expires: '3 Sep 2026', exposesPersonal: false },
    { id: 'fc', app: 'Funding Circle', purpose: 'Business loan application', scope: 'Business + personal accounts · full read', expires: '18 Jun 2026', exposesPersonal: true },
  ];

  // Demo card data — PINs are prototype placeholder values only, not real
  const BUSINESS_CARDS = [
    { key: 0, name: 'Business Debit', last4: '····4821', acctNo: '····2841', expiry: '09/28', network: 'Visa Debit', pin: '2847' },
    { key: 1, name: 'Payroll Card', last4: '····3927', acctNo: '····6633', expiry: '03/27', network: 'Visa Debit', pin: '6103' },
  ];

  const signatories = [
    { name: 'James Whitfield', role: 'Director', list1: 'Passport · Mar 2026', list2: 'Council tax · Mar 2026', list3: 'N/A · matches residential', status: 'verified', initials: 'JW' },
    { name: 'Sarah Chen', role: 'Finance Director', list1: 'UK photocard · Jan 2026', list2: 'Bank statement · Jan 2026', list3: 'Lease · 2024–2027', status: 'verified', initials: 'SC' },
    { name: 'Tom Bridges', role: 'Operations Lead', list1: 'Passport · Aug 2024 ⚠', list2: 'Utility bill · Aug 2024 ⚠', list3: 'Same as residential', status: 'review', initials: 'TB' },
    { name: 'Anita Roy', role: 'Director', list1: 'Passport · Feb 2026', list2: 'HMRC letter · Feb 2026', list3: 'Utility bill · Apr 2026', status: 'verified', initials: 'AR' },
  ];

  // Per-account mandates — different per entity
  const accounts = useMemo(() => {
    if (entityType === 'sole-trader') return [
      { name: 'Trading', no: '····2841', balance: 48750.32, sortCode: '09-01-29', rule: 'any-1', required: 1, status: 'active' },
      { name: 'Tax Reserve', no: '····9012', balance: 12500.00, sortCode: '09-01-29', rule: 'any-1', required: 1, status: 'active' },
    ];
    if (entityType === 'partnership') return [
      { name: 'Operating', no: '····2841', balance: 284750.32, sortCode: '09-01-29', rule: 'all', required: 4, status: 'active' },
      { name: 'Reserve', no: '····9012', balance: 540500.00, sortCode: '09-01-29', rule: 'all', required: 4, status: 'active' },
      { name: 'Drawing', no: '····6633', balance: 95830.50, sortCode: '09-01-29', rule: 'any-2', required: 2, status: 'active' },
    ];
    return [
      { name: 'Operating', no: '····2841', balance: 284750.32, sortCode: '09-01-29', rule: 'any-1', required: 1, status: 'active' },
      { name: 'Reserve', no: '····9012', balance: 1240500.00, sortCode: '09-01-29', rule: 'any-2', required: 2, status: 'active' },
      { name: 'Payroll', no: '····6633', balance: 195830.50, sortCode: '09-01-29', rule: 'any-2', required: 2, status: 'active' },
      { name: 'Legacy Trading', no: '····4422', balance: 0.00, sortCode: '09-01-29', rule: 'all', required: 4, status: 'dormant' },
    ];
  }, [entityType]);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const formatMandate = (rule, required) => {
    const total = signatories.filter(s => s.status === 'verified').length;
    return {
      rule, required,
      isSingle: required === 1,
      label: rule === 'any-1' ? 'Any 1 signature' : rule === 'any-2' ? `Any 2 of ${total}` : `All ${total}`,
      shortLabel: rule === 'any-1' ? '1 sig' : rule === 'any-2' ? '2 sigs' : 'All',
    };
  };

  const closePin = () => {
    setShowPinSheet(false);
    setPinAuthDone(false);
    setPinRevealed(false);
    setPinCountdown(30);
  };

  const getMandateFor = (accountNos) => {
    if (!accountNos || accountNos.length === 0) {
      const strict = accounts.reduce((m, a) => a.required > m.required ? a : m, accounts[0]);
      return formatMandate(strict.rule, strict.required);
    }
    const sel = accounts.filter(a => accountNos.includes(a.no));
    const strict = sel.reduce((m, a) => a.required > m.required ? a : m, sel[0]);
    return formatMandate(strict.rule, strict.required);
  };

  const fmt = (n) => '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Pending approvals (demo data)
  const pendingApprovals = [
    { id: 1, type: 'Bulk Payment', desc: 'October Wages · 47 employees', amount: '£183,450.00', initiator: 'Sarah Chen', expires: '46h', icon: Banknote },
    { id: 2, type: 'Mandate Change', desc: 'Add Mark Patel as signatory', initiator: 'Sarah Chen', expires: '4d', icon: UserPlus },
    { id: 3, type: 'Account Closure', desc: 'Legacy Trading · ····4422', initiator: 'James Whitfield', expires: '11d', icon: Archive },
  ];

  // === MTD (Making Tax Digital) ===
  // VAT mandatory since April 2022 for all VAT-registered. ITSA from 6 April 2026 for sole traders/landlords > £50k.
  // Standard quarter deadlines: 7 Aug, 7 Nov, 7 Feb, 7 May.
  const mtdData = {
    vrn: 'GB 287 4513 92',
    utr: '4823 9182 73',
    softwareName: 'Santander Business · MTD recognised',
    apiVersion: 'HMRC MTD VAT API v1.0',
    obligations: [
      { kind: 'VAT', period: 'Q3 · Jul–Sep 2026', deadline: new Date('2026-11-07'), status: 'open', vatDue: 18472.40, salesNet: 392450, purchasesNet: 184380, salesVat: 78490, purchasesVat: 36876, transactionCount: 247, urgent: true },
      { kind: 'ITSA', period: 'Q1 · Apr–Jul 2026', deadline: new Date('2026-08-07'), status: 'submitted', submittedAt: new Date('2026-08-02'), incomeNet: 28450, expensesNet: 9820, transactionCount: 84 },
      { kind: 'VAT', period: 'Q2 · Apr–Jun 2026', deadline: new Date('2026-08-07'), status: 'submitted', submittedAt: new Date('2026-08-04'), vatDue: 14820.60, transactionCount: 218 },
    ],
    currentQuarter: {
      transactions: [
        { id: 't1', date: '12 Sep 2026', desc: 'Office Tech Solutions Ltd', amount: -2400.00, vat: -400.00, vatRate: 20, category: 'Equipment', confidence: 'high', businessUse: true },
        { id: 't2', date: '11 Sep 2026', desc: 'BT Business Broadband', amount: -89.99, vat: -15.00, vatRate: 20, category: 'Utilities', confidence: 'high', businessUse: true },
        { id: 't3', date: '11 Sep 2026', desc: 'Whitfield invoice #4827', amount: 12500.00, vat: 2083.33, vatRate: 20, category: 'Sales', confidence: 'high', businessUse: true },
        { id: 't4', date: '09 Sep 2026', desc: 'M&S · groceries', amount: -67.42, vat: 0, vatRate: 0, category: 'Personal', confidence: 'medium', businessUse: false },
        { id: 't5', date: '08 Sep 2026', desc: 'Premier Inn · client meeting', amount: -154.00, vat: -25.67, vatRate: 20, category: 'Travel', confidence: 'low', businessUse: null },
        { id: 't6', date: '06 Sep 2026', desc: 'Whitfield invoice #4826', amount: 8400.00, vat: 1400.00, vatRate: 20, category: 'Sales', confidence: 'high', businessUse: true },
        { id: 't7', date: '05 Sep 2026', desc: 'Adobe Creative Cloud', amount: -52.99, vat: -8.83, vatRate: 20, category: 'Software', confidence: 'high', businessUse: true },
        { id: 't8', date: '04 Sep 2026', desc: 'Train · Manchester return', amount: -180.00, vat: 0, vatRate: 0, category: 'Travel', confidence: 'high', businessUse: true },
      ],
    },
    yearToDate: {
      sales: 392450,
      purchases: 184380,
      profit: 208070,
      vatPaid: 32475,
      taxLiabilityEstimate: 41614,
    },
    insights: [
      { id: 'i1', kind: 'opportunity', text: 'Your VAT-recoverable spend is up 18% this quarter — you could claim back £6,200 more than last quarter.', icon: TrendingUp },
      { id: 'i2', kind: 'warning', text: '5 transactions need categorising before you submit. We\'ve flagged the ones we\'re unsure about.', icon: AlertCircle },
      { id: 'i3', kind: 'tip', text: 'Set aside £4,118 from this month\'s income for Income Tax — keeping you on track for January.', icon: PoundSterling },
    ],
  };

  const currentVATObligation = mtdData.obligations.find(o => o.kind === 'VAT' && o.status === 'open');
  const daysUntilDeadline = currentVATObligation ? Math.ceil((currentVATObligation.deadline - new Date()) / (24 * 60 * 60 * 1000)) : null;
  const transactionsToReview = mtdData.currentQuarter.transactions.filter(t => t.confidence === 'low' || t.businessUse === null).length;

  // === STATEMENTS DATA ===
  // Year-to-date transactions across multiple months for statement views and counterparty search.
  // Same counterparties repeat across months so search and trend analysis is meaningful.
  const statementsData = useMemo(() => {
    const txns = [];
    let id = 1;
    // method: 'card' | 'dd' (direct debit) | 'so' (standing order) | 'fp' (faster payments) | 'bacs' | 'chaps' | 'transfer' | 'cheque'
    const make = (date, desc, amount, category, counterparty, method = 'fp', vatOverride) => {
      // VAT logic per category — only apply where it's accurate
      // - Wages: NEVER VATable (PAYE/NI handled separately, not bank's concern)
      // - Personal: not business, no VAT relevant
      // - Tax (HMRC settlements): not VATable themselves
      // - Travel: train tickets zero-rated; hotels 20% — can't auto-determine
      // - Sales (income): customer's own VAT charged to their customer
      // - All others (B2B services/goods from VAT-registered suppliers): typically 20%
      let vat = 0;
      if (vatOverride !== undefined) {
        vat = vatOverride;
      } else if (category === 'Wages' || category === 'Personal' || category === 'Tax') {
        vat = 0; // explicitly no VAT
      } else if (category === 'Travel') {
        vat = null; // ambiguous — needs review (train zero-rated, hotel 20%)
      } else if (category === 'Sales') {
        // Outbound: customer charged VAT to their client. Assume standard-rated.
        vat = Math.round(amount * (20/120) * 100) / 100; // VAT extracted from gross
      } else {
        // Inbound B2B: VAT-registered supplier charging 20%
        vat = Math.round(amount * (20/120) * 100) / 100;
      }
      txns.push({ id: 'tx' + id++, date, desc, amount, vat, category, counterparty, method });
    };

    // SEPTEMBER 2026 (current month)
    make('2026-09-12', 'Office Tech Solutions Ltd', -2400.00, 'Equipment', 'Office Tech Solutions', 'fp');
    make('2026-09-11', 'BT Business Broadband', -89.99, 'Utilities', 'BT Business', 'dd');
    make('2026-09-11', 'Whitfield invoice #4827', 12500.00, 'Sales', 'Whitfield Holdings', 'fp');
    make('2026-09-09', 'M&S · groceries', -67.42, 'Personal', 'M&S', 'card');
    make('2026-09-08', 'Premier Inn · Manchester', -154.00, 'Travel', 'Premier Inn', 'card');
    make('2026-09-06', 'Whitfield invoice #4826', 8400.00, 'Sales', 'Whitfield Holdings', 'fp');
    make('2026-09-05', 'Adobe Creative Cloud', -52.99, 'Software', 'Adobe', 'dd');
    make('2026-09-04', 'Train · Manchester return', -180.00, 'Travel', 'LNER', 'card');
    make('2026-09-02', 'Smith Printers · marketing', -845.00, 'Marketing', 'Smith Printers', 'fp');
    make('2026-09-01', 'Aisha Khan · September wages', -3200.00, 'Wages', 'Aisha Khan', 'bacs');
    make('2026-09-01', 'Ben Carter · September wages', -2850.00, 'Wages', 'Ben Carter', 'bacs');
    make('2026-09-01', 'Carmen Diaz · September wages', -4100.00, 'Wages', 'Carmen Diaz', 'bacs');

    // AUGUST 2026
    make('2026-08-28', 'Whitfield invoice #4820', 9200.00, 'Sales', 'Whitfield Holdings', 'fp');
    make('2026-08-22', 'BT Business Broadband', -89.99, 'Utilities', 'BT Business', 'dd');
    make('2026-08-20', 'British Gas · electricity', -218.45, 'Utilities', 'British Gas', 'dd');
    make('2026-08-18', 'Smith Printers · brochures', -1240.00, 'Marketing', 'Smith Printers', 'fp');
    make('2026-08-15', 'HMRC · VAT Q2 settlement', -14820.60, 'Tax', 'HMRC', 'dd');
    make('2026-08-12', 'Adobe Creative Cloud', -52.99, 'Software', 'Adobe', 'dd');
    make('2026-08-10', 'Premier Inn · Birmingham', -212.00, 'Travel', 'Premier Inn', 'card');
    make('2026-08-05', 'Train · London return', -147.00, 'Travel', 'LNER', 'card');
    make('2026-08-03', 'Mason & Co invoice', 6800.00, 'Sales', 'Mason & Co', 'fp');
    make('2026-08-01', 'Aisha Khan · August wages', -3200.00, 'Wages', 'Aisha Khan', 'bacs');
    make('2026-08-01', 'Ben Carter · August wages', -2850.00, 'Wages', 'Ben Carter', 'bacs');
    make('2026-08-01', 'Carmen Diaz · August wages', -4100.00, 'Wages', 'Carmen Diaz', 'bacs');

    // JULY 2026
    make('2026-07-30', 'Whitfield invoice #4810', 11200.00, 'Sales', 'Whitfield Holdings', 'fp');
    make('2026-07-25', 'BT Business Broadband', -89.99, 'Utilities', 'BT Business', 'dd');
    make('2026-07-20', 'British Gas · electricity', -198.20, 'Utilities', 'British Gas', 'dd');
    make('2026-07-15', 'Smith Printers · trade show', -2450.00, 'Marketing', 'Smith Printers', 'fp');
    make('2026-07-10', 'Adobe Creative Cloud', -52.99, 'Software', 'Adobe', 'dd');
    make('2026-07-08', 'Mason & Co invoice', 4200.00, 'Sales', 'Mason & Co', 'fp');
    make('2026-07-05', 'Premier Inn · Edinburgh', -284.00, 'Travel', 'Premier Inn', 'card');
    make('2026-07-01', 'Aisha Khan · July wages', -3200.00, 'Wages', 'Aisha Khan', 'bacs');
    make('2026-07-01', 'Ben Carter · July wages', -2850.00, 'Wages', 'Ben Carter', 'bacs');
    make('2026-07-01', 'Carmen Diaz · July wages', -4100.00, 'Wages', 'Carmen Diaz', 'bacs');

    // JUNE 2026 (lighter data — to make search look stretchy across months)
    make('2026-06-28', 'Whitfield invoice #4795', 7800.00, 'Sales', 'Whitfield Holdings', 'fp');
    make('2026-06-22', 'BT Business Broadband', -89.99, 'Utilities', 'BT Business', 'dd');
    make('2026-06-15', 'Smith Printers · banners', -640.00, 'Marketing', 'Smith Printers', 'fp');
    make('2026-06-10', 'Adobe Creative Cloud', -52.99, 'Software', 'Adobe', 'dd');
    make('2026-06-01', 'Aisha Khan · June wages', -3200.00, 'Wages', 'Aisha Khan', 'bacs');
    make('2026-06-01', 'Ben Carter · June wages', -2850.00, 'Wages', 'Ben Carter', 'bacs');

    // MAY 2026
    make('2026-05-28', 'Whitfield invoice #4780', 8900.00, 'Sales', 'Whitfield Holdings', 'fp');
    make('2026-05-22', 'BT Business Broadband', -89.99, 'Utilities', 'BT Business', 'dd');
    make('2026-05-18', 'HMRC · VAT Q1 settlement', -11240.50, 'Tax', 'HMRC', 'dd');
    make('2026-05-15', 'Smith Printers · stationery', -380.00, 'Marketing', 'Smith Printers', 'fp');
    make('2026-05-10', 'Mason & Co invoice', 5400.00, 'Sales', 'Mason & Co', 'fp');
    make('2026-05-01', 'Aisha Khan · May wages', -3200.00, 'Wages', 'Aisha Khan', 'bacs');
    make('2026-05-01', 'Ben Carter · May wages', -2850.00, 'Wages', 'Ben Carter', 'bacs');

    return txns;
  }, []);

  // Group by month for statement views
  const transactionsByMonth = useMemo(() => {
    const grouped = {};
    statementsData.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!grouped[m]) grouped[m] = [];
      grouped[m].push(t);
    });
    return grouped;
  }, [statementsData]);

  const monthLabel = (ym) => {
    const [y, m] = ym.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[parseInt(m, 10) - 1]} ${y}`;
  };

  // Counterparty aggregations — for search results and per-payee history
  const counterpartyStats = useMemo(() => {
    const stats = {};
    statementsData.forEach(t => {
      const cp = t.counterparty;
      if (!stats[cp]) {
        stats[cp] = { name: cp, count: 0, totalIn: 0, totalOut: 0, transactions: [], lastDate: null, category: t.category };
      }
      stats[cp].count++;
      if (t.amount > 0) stats[cp].totalIn += t.amount;
      else stats[cp].totalOut += Math.abs(t.amount);
      stats[cp].transactions.push(t);
      if (!stats[cp].lastDate || t.date > stats[cp].lastDate) stats[cp].lastDate = t.date;
    });
    return Object.values(stats).sort((a, b) => (b.totalIn + b.totalOut) - (a.totalIn + a.totalOut));
  }, [statementsData]);

  // Search results across counterparties + transaction descriptions
  const searchResults = useMemo(() => {
    if (!counterpartyQuery.trim()) return [];
    const q = counterpartyQuery.toLowerCase();
    return counterpartyStats.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.transactions.some(t => t.desc.toLowerCase().includes(q))
    );
  }, [counterpartyQuery, counterpartyStats]);

  // Category totals for current month
  const currentMonthCategories = useMemo(() => {
    const txns = transactionsByMonth[statementMonth] || [];
    const cats = {};
    txns.forEach(t => {
      if (!cats[t.category]) cats[t.category] = { name: t.category, in: 0, out: 0, count: 0 };
      cats[t.category].count++;
      if (t.amount > 0) cats[t.category].in += t.amount;
      else cats[t.category].out += Math.abs(t.amount);
    });
    return Object.values(cats).sort((a, b) => (b.in + b.out) - (a.in + a.out));
  }, [transactionsByMonth, statementMonth]);

  const currentMonthSummary = useMemo(() => {
    const txns = transactionsByMonth[statementMonth] || [];
    const inflows = txns.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const outflows = Math.abs(txns.filter(t => t.amount < 0).reduce((s, t) => s + t.amount, 0));
    return { inflows, outflows, net: inflows - outflows, count: txns.length };
  }, [transactionsByMonth, statementMonth]);


  // === COOLING-OFF (working-day aware) ===
  const bankHolidays = ['2026-01-01','2026-04-03','2026-04-06','2026-05-04','2026-05-25','2026-08-31','2026-12-25','2026-12-28'];
  const addWorkingHours = (start, hours) => {
    const r = new Date(start);
    let remaining = hours;
    while (remaining > 0) {
      r.setHours(r.getHours() + 1);
      const day = r.getDay();
      const iso = r.toISOString().split('T')[0];
      if (day !== 0 && day !== 6 && !bankHolidays.includes(iso)) remaining -= 1;
    }
    return r;
  };

  const startCooling = (req) => {
    const id = Date.now();
    setCooling(prev => [...prev, { id, ...req, executesAt: addWorkingHours(new Date(), 24) }]);
  };
  const requestCancel = (id) => setPendingCancelId(id);
  const confirmCancel = () => {
    setCooling(prev => prev.filter(c => c.id !== pendingCancelId));
    setPendingCancelId(null);
    fireToast("Cancelled. Your account is back to normal — no money has moved.");
  };
  const stallRequest = (req) => {
    const id = Date.now();
    setStalled(prev => [...prev, { id, ...req }]);
    fireToast("A signature didn't arrive in time — Priya's been told and will reach out.");
  };
  const triggerRM = (reason) => { setRMReason(reason); setShowRMSheet(true); };

  const formatExecuteTime = (executesAt) => {
    const diffMs = executesAt - new Date();
    const diffH = Math.floor(diffMs / 3600000);
    const diffM = Math.floor((diffMs % 3600000) / 60000);
    if (diffMs <= 0) return 'Executing now';
    if (diffH < 1) return `In ${diffM} min`;
    if (diffH < 24) return `In ${diffH}h ${diffM}m`;
    return executesAt.toLocaleString('en-GB', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  };

  // === WORKFLOW HELPERS ===
  const closeWorkflow = () => {
    setPaymentPending(null);
    setWorkflow(null); setStep(0);
    // Reset all workflow-specific state
    setClosureSel([]); setClosureDest(''); setClosureConfirm(false);
    setClosureUnreachable(null); setClosureContactLog(''); setClosureEvidenceUp(false); setClosureVulnDecl(false);
    setUnlinkConfirm(false); setUnlinkAllChannels(false); setUnlinkPostal(false);
    setRingfenceConfirm(false);
    setBizChanges({}); setBizName(''); setBizAddr(''); setBizPhone(''); setBizEmail(''); setBizProofUp(false);
    setMandateAction(null); setMandateSig(null);
    setNewPersonName(''); setNewPersonSurname(''); setNewPersonDob(''); setNewPersonEmail(''); setNewPersonAddr('');
    setNewPersonVisa(null); setNewPersonPEP(false); setTradingMatchesRes(true);
    setList1Up(false); setList2Up(false); setList3Up(false); setBoardMinutesUp(false); setNewRule(null);
    setWagesSource(null); setWagesFile(null); setWagesSchedule('now');
    setPayeeSearch(''); setShowAddPayee(false);
    setNewPayeeName(''); setNewPayeeSort(''); setNewPayeeAcct(''); setNewPayeeAmount(''); setNewPayeeRole('');
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  // === STYLES ===
  const css = `
    .font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; font-variation-settings: 'opsz' 144; letter-spacing: -0.025em; }
    .font-display-tight { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; font-variation-settings: 'opsz' 144; letter-spacing: -0.04em; }
    .font-body { font-family: 'Geist', system-ui, sans-serif; }
    .font-mono { font-family: 'Geist Mono', ui-monospace, monospace; font-feature-settings: 'tnum'; }
    .num-tab { font-feature-settings: 'tnum', 'lnum'; }

    .red-bar { background: linear-gradient(90deg, #c8102e 0%, #ec0000 50%, #c8102e 100%); }

    /* Page background — layered cream with subtle radial warmth */
    .page-bg {
      background-color: #faf6ef;
      background-image:
        radial-gradient(ellipse 1200px 600px at 100% 0%, rgba(200, 16, 46, 0.04), transparent 60%),
        radial-gradient(ellipse 800px 600px at 0% 100%, rgba(200, 16, 46, 0.025), transparent 60%);
    }

    /* Subtle paper grain */
    .grain::before {
      content: '';
      position: absolute; inset: 0; pointer-events: none; opacity: 0.4;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    /* Card lifts — soft, warm shadows */
    .lift-1 { box-shadow: 0 1px 2px rgba(60, 40, 20, 0.04), 0 1px 3px rgba(60, 40, 20, 0.05); }
    .lift-2 { box-shadow: 0 4px 12px -2px rgba(60, 40, 20, 0.08), 0 2px 6px rgba(60, 40, 20, 0.04); }
    .lift-hero { box-shadow: 0 24px 48px -16px rgba(15, 15, 15, 0.4), 0 8px 24px -8px rgba(200, 16, 46, 0.15); }

    /* Hero balance card */
    .hero-card {
      background: radial-gradient(ellipse 800px 400px at 80% 20%, rgba(200, 16, 46, 0.25), transparent 60%),
                  linear-gradient(155deg, #1c1917 0%, #0a0a0a 60%, #1a0606 100%);
    }

    /* Highlight action tile */
    .tile-hero {
      background: linear-gradient(155deg, #1c1917 0%, #0a0a0a 100%);
      box-shadow: 0 4px 16px -4px rgba(15, 15, 15, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }

    /* Santander red surfaces — proper brand identity */
    .santander-red {
      background: linear-gradient(155deg, #ec0000 0%, #c8102e 60%, #a30c25 100%);
    }
    .santander-red-dark {
      background:
        radial-gradient(ellipse 600px 300px at 80% 20%, rgba(255, 255, 255, 0.08), transparent 60%),
        linear-gradient(155deg, #c8102e 0%, #9a0c22 60%, #6e0918 100%);
    }
    .red-accent-bar {
      background: linear-gradient(180deg, #ec0000, #c8102e);
    }

    /* Fluid number sizing — never overflows */
    .num-hero { font-size: clamp(2rem, 5vw, 3rem); line-height: 1; letter-spacing: -0.04em; }
    .num-display { font-size: clamp(1.25rem, 3vw, 1.75rem); line-height: 1.1; letter-spacing: -0.03em; }
    .num-compact { font-size: clamp(1rem, 2vw, 1.375rem); line-height: 1.1; letter-spacing: -0.02em; }

    /* Cooling-off warm gradient */
    .cool-card {
      background: linear-gradient(155deg, #fffbf2 0%, #fef6e7 100%);
      border: 1px solid rgba(217, 119, 6, 0.25);
    }
    .cool-orb {
      background: radial-gradient(circle, rgba(245, 158, 11, 0.18), transparent 70%);
    }

    /* Stalled/RM blue */
    .rm-card {
      background: linear-gradient(155deg, #f0f7ff 0%, #e6f0fb 100%);
      border: 1px solid rgba(37, 99, 235, 0.2);
    }

    /* Priya card warm gradient */
    .priya-card {
      background: linear-gradient(155deg, rgba(200, 16, 46, 0.05) 0%, #faf6ef 50%, rgba(200, 16, 46, 0.03) 100%);
    }

    /* Account card hover */
    .acct-row { transition: background-color 0.15s ease; }
    .acct-row:hover { background-color: rgba(245, 245, 244, 0.5); }

    /* Mandate badges */
    .mandate-single { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); color: #065f46; }
    .mandate-dual { background: #f5f5f4; color: #44403c; border: 1px solid #e7e5e4; }
    .mandate-all { background: linear-gradient(135deg, #1c1917 0%, #0a0a0a 100%); color: #fafaf9; }

    /* Toast */
    .toast-card {
      background: linear-gradient(155deg, #1c1917 0%, #0a0a0a 100%);
      box-shadow: 0 16px 40px -12px rgba(15, 15, 15, 0.5);
    }

    /* Button micro-interactions */
    .btn-primary { transition: all 0.15s cubic-bezier(0.2, 0.9, 0.3, 1); }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 16px -4px rgba(15, 15, 15, 0.25); }
    .btn-primary:active { transform: translateY(0); }

    /* Animations */
    @keyframes slideUp { from { transform: translateY(100%); opacity: 0.8; } to { transform: translateY(0); opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); } 50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); } }
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-2px); } }

    .anim-slide { animation: slideUp 0.42s cubic-bezier(0.2, 0.9, 0.3, 1); }
    .anim-fade { animation: fadeIn 0.5s cubic-bezier(0.2, 0.9, 0.3, 1) both; }
    .anim-pulse-glow { animation: pulseGlow 2.5s ease-in-out infinite; }
    .anim-float { animation: float 3s ease-in-out infinite; }
    .stagger-1 { animation-delay: 0.05s; } .stagger-2 { animation-delay: 0.1s; }
    .stagger-3 { animation-delay: 0.15s; } .stagger-4 { animation-delay: 0.2s; }
    .stagger-5 { animation-delay: 0.25s; } .stagger-6 { animation-delay: 0.3s; }
    .stagger-7 { animation-delay: 0.35s; }

    /* Shimmer for synced indicator */
    .synced-pulse {
      background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent);
      background-size: 200% 100%;
      animation: shimmer 2s ease-in-out infinite;
    }

    /* Skeleton loading state */
    .skeleton {
      background: linear-gradient(90deg, #e7e5e4 25%, #d6d3d1 50%, #e7e5e4 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 0.5rem;
    }

    /* Focus-visible ring — keyboard navigation only */
    .focus-ring:focus { outline: none; }
    .focus-ring:focus-visible { outline: 2px solid #c8102e; outline-offset: 2px; }

    /* Text on coloured backgrounds (Grey-on-Colour Law) */
    .on-dark   { color: rgba(255,255,255,0.65); }
    .on-dark-2 { color: #d6d3d1; } /* stone-300 */
    .on-red    { color: #fecaca; } /* red-200 */
  `;

  // === PRIMITIVES (functional components — no state inside) ===
  const ProgressDots = ({ total, current }) => (
    <div className="flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-[#c8102e]' : i < current ? 'w-4 bg-stone-800' : 'w-4 bg-stone-300'}`} />
      ))}
    </div>
  );

  const StepFrame = ({ title, sub, total, current, onBack, onNext, nextLabel = 'Continue', nextDisabled, replaces, children }) => (
    <div className="fixed inset-0 bg-white z-40 flex flex-col anim-slide">
      <div className="flex-shrink-0 border-b border-stone-200 bg-white">
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <button onClick={onBack} className="w-9 h-9 -ml-2 rounded-full hover:bg-stone-100 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"><ArrowLeft className="w-5 h-5" /></button>
          <ProgressDots total={total} current={current} />
          <button onClick={closeWorkflow} className="w-9 h-9 -mr-2 rounded-full hover:bg-stone-100 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-5 pb-4">
          <h1 className="font-display text-3xl text-stone-900 leading-tight">{title}</h1>
          {sub && <p className="text-sm text-stone-500 mt-1">{sub}</p>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-32">
        {replaces && current === 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-white p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0"><MailX className="w-4 h-4" /></div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-400">Replaces</div>
                <div className="text-sm font-medium">{replaces.form}</div>
                <div className="text-xs text-stone-300 mt-1">{replaces.savings}</div>
              </div>
            </div>
          </div>
        )}
        {children}
      </div>
      <div className="flex-shrink-0 border-t border-stone-200 px-5 py-4 bg-white">
        <button onClick={onNext} disabled={nextDisabled}
          className="w-full bg-stone-900 text-white py-4 rounded-2xl font-medium disabled:bg-stone-300 disabled:text-stone-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          {nextLabel} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const Input = ({ value, onChange, placeholder, type = 'text' }) => (
    <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus-visible:border-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900/20 text-sm transition-colors" />
  );

  const Field = ({ label, hint, children }) => (
    <div className="mb-3">
      <label className="block text-xs font-medium text-stone-700 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
      {hint && <div className="text-[11px] text-stone-500 mt-1">{hint}</div>}
    </div>
  );

  const Toggle = ({ label, value, onChange, sub }) => (
    <button onClick={() => onChange(!value)} className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-200 mb-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900">
      <div>
        <div className="text-sm">{label}</div>
        {sub && <div className="text-[11px] text-stone-500">{sub}</div>}
      </div>
      <div className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-[#c8102e]' : 'bg-stone-300'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? 'left-[18px]' : 'left-0.5'}`} />
      </div>
    </button>
  );

  // === WORKFLOW RENDERERS (just JSX — no hooks!) ===
  const renderClosure = () => {
    const m = getMandateFor(closureSel);
    const allInCredit = closureSel.every(no => accounts.find(a => a.no === no)?.balance >= 0);
    const isEsc = closureUnreachable !== null;
    const isPartnership = entityType === 'partnership';

    const next = () => {
      if (isEsc) {
        if (step === 3) {
          fireToast('Case raised · ref. SVC-2026-4471 · Specialist Vulnerable Customer Team notified · Priya calling today');
          closeWorkflow();
        } else setStep(step + 1);
      } else {
        if (step === 3) {
          if (m.isSingle) {
            startCooling({ type: 'Account closure', desc: `${closureSel.length} account${closureSel.length > 1 ? 's' : ''}`, kind: 'closure' });
            fireToast("All set. We'll do this tomorrow afternoon — cancel anytime before then.");
          } else if (m.rule === 'all') {
            fireToast(`Submitted. ${m.required - 1} more ${entity.principal}${m.required - 1 > 1 ? 's' : ''} need to sign.`);
          } else {
            fireToast(`Submitted. ${m.required - 1} more signature${m.required - 1 > 1 ? 's' : ''} needed.`);
          }
          closeWorkflow();
        } else setStep(step + 1);
      }
    };
    const back = () => {
      if (step === 0) { closeWorkflow(); return; }
      if (step === 1 && isEsc) setClosureUnreachable(null);
      setStep(step - 1);
    };

    const escReasons = [
      { key: 'health', label: 'Health or disability', sub: 'Partner has a health condition, disability, or mental capacity concern', icon: Heart, badge: 'FCA Consumer Duty PS22/9' },
      { key: 'contact', label: 'Unable to contact', sub: 'Multiple attempts made — no response over 5+ working days', icon: MailX, badge: 'BCOBS due diligence' },
      { key: 'deceased', label: 'Partner has died', sub: 'Death certificate or grant of probate will be required', icon: ScrollText, badge: 'Legal — probate & dissolution' },
      { key: 'dispute', label: 'Partnership dispute', sub: 'Active disagreement is preventing joint authorisation', icon: Scale, badge: 'RM escalation + legal' },
    ];

    const normalTitles = ['Which accounts?', 'Where should funds go?', 'In-credit check', 'Sign per mandate'];
    const normalSubs = [
      'Tap one or more accounts to close',
      'Single destination',
      'Accounts must be in credit',
      m.isSingle ? 'Single signature — your signature alone' : `${m.label} — others get notified`,
    ];
    const escTitles = ['Which account?', 'Reason for escalation', 'Contact attempts & evidence', 'Restrict & refer'];
    const escSubs = [
      'Select the account to close',
      'Determines the correct regulatory and specialist path',
      'Required under FCA Consumer Duty PS22/9 and BCOBS',
      'Account restricted while Specialist Vulnerable Customer Team reviews',
    ];

    const titles = isEsc ? escTitles : normalTitles;
    const subs = isEsc ? escSubs : normalSubs;
    const nextLabel = isEsc
      ? (step === 3 ? 'Restrict account & raise case' : 'Continue')
      : (step === 3 ? (m.isSingle ? 'Sign & start' : 'Sign & send') : 'Continue');
    const nextDisabled = isEsc ? (
      (step === 0 && closureSel.length === 0) ||
      (step === 1 && (!closureUnreachable || closureUnreachable === 'pending')) ||
      (step === 2 && closureContactLog.trim().length < 10) ||
      (step === 3 && !closureVulnDecl)
    ) : (
      (step === 0 && closureSel.length === 0) ||
      (step === 1 && !closureDest) ||
      (step === 2 && !allInCredit) ||
      (step === 3 && !closureConfirm)
    );

    return (
      <StepFrame
        title={titles[step]} sub={subs[step]} total={4} current={step}
        onBack={back} onNext={next}
        nextLabel={nextLabel}
        replaces={{
          form: isEsc ? 'Internal referral · Specialist Vulnerable Customer Team' : 'Form ANB9 0370 · Close an account',
          savings: isEsc ? 'No phone trees or branch visits — full digital audit trail' : 'No more posting to Sunderland · 5 days → minutes',
        }}
        nextDisabled={nextDisabled}
      >
        {/* ── Step 0 — account selection (shared by both paths) ─────────── */}
        {step === 0 && (
          <div className="space-y-2">
            {accounts.map(a => {
              const am = formatMandate(a.rule, a.required);
              const sel = closureSel.includes(a.no);
              return (
                <button key={a.no} onClick={() => setClosureSel(sel ? closureSel.filter(x => x !== a.no) : [...closureSel, a.no])}
                  className={`w-full text-left p-4 rounded-2xl border ${sel ? 'border-[#c8102e] bg-red-50/40' : 'border-stone-200'}`}>
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-5 h-5 rounded border-2 mt-0.5 flex-shrink-0 flex items-center justify-center ${sel ? 'border-[#c8102e] bg-[#c8102e]' : 'border-stone-300'}`}>
                        {sel && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">{a.name}</div>
                        <div className="font-mono text-xs text-stone-500 mt-0.5">{a.sortCode} · {a.no}</div>
                        <span className={`inline-block mt-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${am.isSingle ? 'bg-emerald-50 text-emerald-700' : am.rule === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}>{am.label}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-display text-lg">{fmt(a.balance)}</div>
                      {a.status === 'dormant' && <span className="text-[10px] uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Dormant</span>}
                    </div>
                  </div>
                </button>
              );
            })}
            {isPartnership && (
              <button
                onClick={() => setClosureUnreachable(closureUnreachable === null ? 'pending' : null)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${closureUnreachable !== null ? 'border-amber-500 bg-amber-50' : 'border-dashed border-amber-300/70 hover:border-amber-400'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${closureUnreachable !== null ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600'}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${closureUnreachable !== null ? 'text-amber-900' : 'text-amber-800'}`}>A partner is unreachable</div>
                    <div className="text-[11px] text-amber-700">Vulnerable customer · partner cannot be contacted · dispute</div>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${closureUnreachable !== null ? 'bg-amber-500 border-amber-500' : 'border-amber-400'}`}>
                    {closureUnreachable !== null && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </button>
            )}
          </div>
        )}

        {/* ── Escalation step 1 — reason ────────────────────────────────── */}
        {isEsc && step === 1 && (
          <div className="space-y-2">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-3 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Regulatory escalation.</strong> Selecting this path bypasses dual-authorisation. Your reason determines which specialist team handles the case and what evidence is required.
              </div>
            </div>
            {escReasons.map(r => {
              const I = r.icon;
              const sel = closureUnreachable === r.key;
              return (
                <button key={r.key} onClick={() => setClosureUnreachable(r.key)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${sel ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-300'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sel ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'}`}>
                      <I className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{r.label}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{r.sub}</div>
                      <span className="inline-block mt-1.5 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">{r.badge}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${sel ? 'bg-stone-900 border-stone-900' : 'border-stone-300'}`}>
                      {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Escalation step 2 — contact log + evidence ────────────────── */}
        {isEsc && step === 2 && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
              <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong>FCA Consumer Duty PS22/9.</strong> Document at least 3 contact attempts across different channels over a minimum of 5 working days before the Specialist Team will accept the referral.
              </div>
            </div>
            <Field label="Contact attempts log" hint="Date · method · outcome — one attempt per line">
              <textarea
                value={closureContactLog}
                onChange={e => setClosureContactLog(e.target.value)}
                rows={5}
                placeholder={"12 Jun — Phone call to mobile — no answer\n13 Jun — Email to partner address — no reply\n15 Jun — Recorded letter to home address — awaiting\n17 Jun — Branch visit requested — no attendance"}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus-visible:border-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900/20 text-sm transition-colors resize-none leading-relaxed"
              />
            </Field>
            <button onClick={() => setClosureEvidenceUp(true)}
              className={`w-full p-4 rounded-2xl border-2 border-dashed flex items-center gap-3 transition-all ${closureEvidenceUp ? 'border-emerald-400 bg-emerald-50/50' : 'border-stone-300 hover:border-stone-400'}`}>
              {closureEvidenceUp
                ? <CircleCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                : <Upload className="w-5 h-5 text-stone-500 flex-shrink-0" />}
              <div className="text-left">
                <div className={`text-sm font-medium ${closureEvidenceUp ? 'text-emerald-700' : 'text-stone-700'}`}>
                  {closureEvidenceUp ? 'Evidence uploaded' : 'Upload supporting evidence'}
                </div>
                <div className="text-[11px] text-stone-500">Emails, call logs, return receipts, medical letters</div>
              </div>
            </button>
          </div>
        )}

        {/* ── Escalation step 3 — declaration + restrict ────────────────── */}
        {isEsc && step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">Account restriction</span>
              </div>
              <div className="text-xs text-amber-900 leading-relaxed">
                On submission, <strong>no new payment instructions</strong> will be accepted. Incoming credits are still received. The restriction lifts when the specialist team resolves the case.
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">What happens next</div>
              {[
                'Specialist Vulnerable Customer Team contacted within 2 hours',
                'Priya Desai (RM) will call you today to confirm next steps',
                'Case reference generated for all future correspondence',
                'Account restriction confirmed by letter within 1 working day',
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <div className="text-xs text-stone-700 leading-relaxed">{item}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-100 border border-stone-200">
              <span className="text-xs text-stone-500">Case reference</span>
              <span className="font-mono text-sm font-medium tracking-wider">SVC-2026-4471</span>
            </div>
            <label className="flex gap-3 p-4 rounded-2xl border border-stone-200 cursor-pointer">
              <input type="checkbox" checked={closureVulnDecl} onChange={e => setClosureVulnDecl(e.target.checked)} className="mt-0.5 accent-[#c8102e]" />
              <span className="text-xs text-stone-700 leading-relaxed">
                I confirm the above information is accurate to the best of my knowledge. I understand the account will be restricted pending specialist review, and I consent to the bank contacting the partner directly as part of this process.
              </span>
            </label>
          </div>
        )}

        {/* ── Normal path step 1 — destination ─────────────────────────── */}
        {!isEsc && step === 1 && (
          <div className="space-y-2">
            {accounts.filter(a => !closureSel.includes(a.no) && a.status === 'active').map(a => (
              <button key={a.no} onClick={() => setClosureDest(a.no)}
                className={`w-full text-left p-4 rounded-2xl border ${closureDest === a.no ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}>
                <div className="font-medium">{a.name}</div>
                <div className="font-mono text-xs text-stone-500">{a.sortCode} · {a.no}</div>
              </button>
            ))}
            <button onClick={() => setClosureDest('external')}
              className={`w-full text-left p-4 rounded-2xl border-2 border-dashed ${closureDest === 'external' ? 'border-stone-900' : 'border-stone-300'}`}>
              <div className="font-medium">External account</div>
              <div className="text-xs text-stone-500">Confirmation of Payee runs first</div>
            </button>
          </div>
        )}

        {/* ── Normal path step 2 — credit check ────────────────────────── */}
        {!isEsc && step === 2 && (
          <div className="space-y-3">
            {closureSel.map(no => {
              const a = accounts.find(acc => acc.no === no);
              const ok = a.balance >= 0;
              return (
                <div key={no} className={`p-4 rounded-2xl border ${ok ? 'border-emerald-200 bg-emerald-50/40' : 'border-red-200 bg-red-50/40'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{a.name}</div>
                    {ok ? <CircleCheck className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><div className="text-stone-500">Balance</div><div className="font-mono font-medium">{fmt(a.balance)}</div></div>
                    <div><div className="text-stone-500">Pending DDs</div><div className="font-medium">{a.no === '····2841' ? '3 active' : 'None'}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Normal path step 3 — sign ─────────────────────────────────── */}
        {!isEsc && step === 3 && (
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 border border-stone-200">
              <div className="flex justify-between text-sm"><span className="text-stone-500">Closing</span><span>{closureSel.length} account{closureSel.length > 1 ? 's' : ''}</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">Funds to</span><span className="font-mono">{closureDest}</span></div>
              <div className="flex justify-between text-sm pt-2 border-t border-stone-200"><span className="text-stone-500">Mandate</span><span className="font-medium">{m.label}</span></div>
            </div>
            {m.isSingle && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-3">
                <Clock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>24-hour cooling-off.</strong> Your signature alone authorises this, but we hold the action for 24 working hours so you can cancel with no penalty. Pauses on weekends and bank holidays.
                </div>
              </div>
            )}
            <div className="p-4 rounded-2xl bg-stone-900 text-white">
              <div className="flex items-center gap-2 mb-3"><FileSignature className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Section 3 · Authorisation</span></div>
              <div className="text-sm leading-relaxed">"I authorise the closure of the accounts in section 1 and the movement of credit balances in section 2."</div>
            </div>
            <label className="flex gap-3 p-4 rounded-2xl border border-stone-200 cursor-pointer">
              <input type="checkbox" checked={closureConfirm} onChange={e => setClosureConfirm(e.target.checked)} className="mt-0.5 accent-[#c8102e]" />
              <span className="text-xs text-stone-700 leading-relaxed">
                {m.isSingle ? `I'm the ${entity.principal} on this account and authorise its closure.`
                  : m.rule === 'all' ? `I'm an authorised ${entity.principal}. After my signature, all other ${entity.principal}s will be notified.`
                    : `I'm an authorised ${entity.principal}. After my signature, ${m.required - 1} other ${entity.principal}${m.required - 1 > 1 ? 's' : ''} will be notified.`}
              </span>
            </label>
          </div>
        )}
      </StepFrame>
    );
  };

  const renderBiz = () => {
    const wantsAddr = bizChanges.tradingAddress || bizChanges.registeredAddress;
    const needsRMRename = bizChanges.businessName && entityType === 'partnership';
    const hasChanges = Object.values(bizChanges).some(v => v);
    const next = () => {
      if (step === 0 && needsRMRename) { triggerRM('partnership-rename'); return; }
      if (step === 3) {
        fireToast("Done — we've let your signatories know they need to co-sign.");
        closeWorkflow();
      } else setStep(step + 1);
    };
    const back = () => step === 0 ? closeWorkflow() : setStep(step - 1);
    const titles = ['What needs updating?', 'Enter new details', wantsAddr ? 'Upload proof' : 'Confirm', 'Sign'];
    const opts = [
      { key: 'businessName', label: 'Business name', icon: Briefcase, sub: entity.requiresCH ? "We'll sync with Companies House" : entityType === 'partnership' ? 'RM review needed' : 'Updated everywhere' },
      { key: 'tradingName', label: 'Trading name', icon: FileText },
      { key: 'tradingAddress', label: 'Trading address', icon: MapPin },
      entity.requiresCH && { key: 'registeredAddress', label: 'Registered address', icon: Building2, sub: 'Must match Companies House' },
      { key: 'correspondence', label: 'Correspondence address', icon: Mail },
      { key: 'phone', label: 'Phone number', icon: Phone },
      { key: 'email', label: 'Email address', icon: Mail },
    ].filter(Boolean);

    return (
      <StepFrame title={titles[step]} sub={['Tick everything', 'New values', 'Local authority bill or utility < 3 months', `Any 2 ${entity.authorities}`][step]}
        total={4} current={step} onBack={back} onNext={next}
        nextLabel={step === 3 ? 'Sign update' : 'Continue'}
        replaces={{ form: 'Form ANB9 0042 · Change of business details', savings: 'No black-ink block-capitals · no Sunderland post' }}
        nextDisabled={(step === 0 && !hasChanges) || (step === 2 && wantsAddr && !bizProofUp)}
      >
        {step === 0 && (
          <div className="space-y-2">
            {opts.map(o => {
              const I = o.icon; const on = bizChanges[o.key];
              return (
                <button key={o.key} onClick={() => setBizChanges({ ...bizChanges, [o.key]: !on })}
                  className={`w-full text-left p-3.5 rounded-2xl border flex gap-3 items-center ${on ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${on ? 'bg-stone-900 text-white' : 'bg-stone-100'}`}><I className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{o.label}</div>
                    {o.sub && <div className="text-[11px] text-stone-500">{o.sub}</div>}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${on ? 'bg-[#c8102e] border-[#c8102e]' : 'border-stone-300'}`}>
                    {on && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            {entity.requiresCH && bizChanges.registeredAddress && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                <Building2 className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed"><strong>Companies House sync.</strong> #{entity.chNumber} last updated 14 April 2026 ✓</div>
              </div>
            )}
            {bizChanges.businessName && <Field label="New business name"><Input value={bizName} onChange={setBizName} placeholder="New name" /></Field>}
            {bizChanges.tradingAddress && <Field label="New trading address"><Input value={bizAddr} onChange={setBizAddr} placeholder="14 Foundry Lane, London EC2A 4PQ" /></Field>}
            {bizChanges.phone && <Field label="New phone"><Input value={bizPhone} onChange={setBizPhone} placeholder="020 7946 0832" /></Field>}
            {bizChanges.email && <Field label="New email"><Input value={bizEmail} onChange={setBizEmail} placeholder="finance@whitfield.co" type="email" /></Field>}
          </div>
        )}
        {step === 2 && wantsAddr && (
          <div className="space-y-3">
            <button onClick={() => setBizProofUp(true)}
              className={`w-full p-6 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 ${bizProofUp ? 'border-emerald-500 bg-emerald-50/40' : 'border-stone-300'}`}>
              {bizProofUp ? <CircleCheck className="w-8 h-8 text-emerald-600" /> : <Camera className="w-8 h-8 text-stone-400" />}
              <div className="font-medium text-sm">{bizProofUp ? 'business-rates-2026.pdf · validated ✓' : 'Photograph or upload proof'}</div>
              <div className="text-[11px] text-stone-500">Local authority bill or utility &lt; 3 months</div>
            </button>
          </div>
        )}
        {step === 2 && !wantsAddr && (
          <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50">
            <div className="text-xs uppercase tracking-wider text-stone-500 mb-3">Summary</div>
            <div className="space-y-2 text-sm">
              {bizChanges.businessName && <div className="flex justify-between"><span className="text-stone-500">Name</span><span>{bizName || '—'}</span></div>}
              {bizChanges.phone && <div className="flex justify-between"><span className="text-stone-500">Phone</span><span>{bizPhone || '—'}</span></div>}
              {bizChanges.email && <div className="flex justify-between"><span className="text-stone-500">Email</span><span>{bizEmail || '—'}</span></div>}
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-900 text-white">
              <div className="flex items-center gap-2 mb-2"><FileSignature className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Section 6 · Declaration</span></div>
              <div className="text-sm leading-relaxed">"I, the existing authorised person, agree to the changes outlined."</div>
            </div>
          </div>
        )}
      </StepFrame>
    );
  };

  const renderMandate = () => {
    const isAdd = mandateAction === 'add';
    const isRule = mandateAction === 'change-rule';
    const isRemove = mandateAction === 'remove';
    const needsList3 = isAdd && !tradingMatchesRes;
    const needsMinutes = entity.requiresMinutes && (isAdd || isRemove || isRule);

    const stepDefs = [{ id: 'action', t: 'What change?', s: 'All changes follow your signing rule' }];
    if (isAdd) {
      stepDefs.push({ id: 'personal', t: 'Personal details', s: 'Required by FATCA / CRS' });
      stepDefs.push({ id: 'address', t: 'Address & visa', s: 'List 3 needed if trading address differs' });
      stepDefs.push({ id: 'id', t: 'ID & address proof', s: needsList3 ? 'Lists 1, 2 & 3' : 'Lists 1 & 2' });
    } else if (isRule) {
      stepDefs.push({ id: 'rule', t: 'New signing rule', s: 'Read the impact below' });
    } else if (isRemove || mandateAction === 'update') {
      stepDefs.push({ id: 'choose', t: 'Choose person', s: `From your ${entity.authorities}` });
    }
    if (needsMinutes) stepDefs.push({ id: 'minutes', t: 'Board minutes', s: 'Signed by 2 trustees' });
    stepDefs.push({ id: 'sign', t: 'Sign', s: 'Existing signatures collected per rule' });
    const total = stepDefs.length;
    const sd = stepDefs[step];

    const checkPre = () => {
      if (isAdd && step === 1 && newPersonResidence === 'Russia') { triggerRM('sanctioned-country'); return false; }
      if (isAdd && step === 2 && newPersonVisa === 'visitor') { triggerRM('visitor-visa'); return false; }
      if (isAdd && step === 2 && newPersonPEP) { triggerRM('pep'); return false; }
      return true;
    };

    const next = () => {
      if (!checkPre()) return;
      if (step === total - 1) {
        fireToast("Submitted. We'll let your signatories know.");
        closeWorkflow();
      } else setStep(step + 1);
    };
    const back = () => step === 0 ? closeWorkflow() : setStep(step - 1);

    const canProceed = () => {
      if (sd.id === 'action') return !!mandateAction;
      if (sd.id === 'personal') return newPersonName && newPersonSurname && newPersonDob;
      if (sd.id === 'address') return newPersonAddr && newPersonVisa;
      if (sd.id === 'rule') return !!newRule;
      if (sd.id === 'choose') return !!mandateSig;
      if (sd.id === 'id') return list1Up && list2Up && (!needsList3 || list3Up);
      if (sd.id === 'minutes') return boardMinutesUp;
      return true;
    };

    return (
      <StepFrame title={sd.t} sub={sd.s} total={total} current={step}
        onBack={back} onNext={next}
        nextLabel={step === total - 1 ? 'Sign' : 'Continue'}
        replaces={{ form: entity.isTreasurer ? 'Form ANBMC0800 · 8-page treasurer mandate' : 'Mandate change form + ID copies', savings: 'Board minutes uploaded · ID via GOV.UK One Login' }}
        nextDisabled={!canProceed()}
      >
        {sd.id === 'action' && (
          <div className="space-y-2">
            {[
              { id: 'add', label: `Add ${entity.isTreasurer ? 'a member or signatory' : 'a signatory'}`, desc: 'Grant signing authority', icon: UserPlus },
              { id: 'remove', label: `Remove ${entity.isTreasurer ? 'a member' : 'a signatory'}`, desc: 'Revoke authority', icon: X },
              { id: 'change-rule', label: 'Change signing rule', desc: 'Any 1 / Any 2 / All', icon: PenLine },
              { id: 'update', label: "Update someone's details", desc: 'Name, address, role', icon: RefreshCw },
            ].map(o => {
              const I = o.icon;
              return (
                <button key={o.id} onClick={() => setMandateAction(o.id)}
                  className={`w-full text-left p-4 rounded-2xl border flex gap-3 items-start ${mandateAction === o.id ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}>
                  <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center flex-shrink-0"><I className="w-4 h-4" /></div>
                  <div><div className="font-medium text-sm">{o.label}</div><div className="text-xs text-stone-500 mt-0.5">{o.desc}</div></div>
                </button>
              );
            })}
          </div>
        )}
        {sd.id === 'personal' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label="First name"><Input value={newPersonName} onChange={setNewPersonName} placeholder="Mark" /></Field>
              <Field label="Surname"><Input value={newPersonSurname} onChange={setNewPersonSurname} placeholder="Patel" /></Field>
            </div>
            <Field label="Date of birth"><Input value={newPersonDob} onChange={setNewPersonDob} placeholder="DD/MM/YYYY" /></Field>
            <Field label="Email"><Input value={newPersonEmail} onChange={setNewPersonEmail} placeholder="mark@whitfield.co" type="email" /></Field>
            <Field label="Country of residence"><Input value={newPersonResidence} onChange={setNewPersonResidence} placeholder="United Kingdom" /></Field>
          </div>
        )}
        {sd.id === 'address' && (
          <div className="space-y-3">
            <Field label="Permanent address"><Input value={newPersonAddr} onChange={setNewPersonAddr} placeholder="Address line 1, postcode" /></Field>
            <div>
              <div className="text-xs font-medium text-stone-700 mb-2 uppercase tracking-wider">Right to remain</div>
              {[
                { id: 'uk-irish', label: 'UK / Irish citizen' },
                { id: 'settled', label: 'Settled status' },
                { id: 'pre-settled', label: 'Pre-settled status' },
                { id: 'work', label: 'Work / family visa' },
                { id: 'visitor', label: 'Visitor visa', warn: 'Not accepted' },
              ].map(o => (
                <button key={o.id} onClick={() => setNewPersonVisa(o.id)}
                  className={`w-full text-left p-3 rounded-xl border mb-2 ${newPersonVisa === o.id ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}>
                  <div className="text-sm font-medium">{o.label}</div>
                  {o.warn && <div className="text-xs text-red-700">{o.warn}</div>}
                </button>
              ))}
            </div>
            <Toggle label="Trading address same as residential?" sub="Affects whether List 3 is required" value={tradingMatchesRes} onChange={setTradingMatchesRes} />
            <Toggle label="Politically Exposed Person (PEP)?" sub="Government, judiciary, military" value={newPersonPEP} onChange={setNewPersonPEP} />
            {!tradingMatchesRes && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/50 text-xs text-amber-900 leading-relaxed">
                <strong>List 3 will be required.</strong> Since the trading address differs, we'll ask for a business statement, signed lease, or trading licence next.
              </div>
            )}
          </div>
        )}
        {sd.id === 'id' && (
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-wider text-stone-500">List 1 · Proof of ID</div>
            <button onClick={() => setList1Up(true)}
              className={`w-full p-4 rounded-2xl border-2 border-dashed flex items-center gap-3 ${list1Up ? 'border-emerald-500 bg-emerald-50/40' : 'border-stone-300'}`}>
              {list1Up ? <CircleCheck className="w-6 h-6 text-emerald-600" /> : <Camera className="w-6 h-6 text-stone-400" />}
              <div className="text-left flex-1"><div className="text-sm font-medium">{list1Up ? 'Passport · UK · in date ✓' : 'Capture passport / driving licence'}</div><div className="text-[11px] text-stone-500">Verified via GOV.UK One Login</div></div>
            </button>
            <div className="text-xs uppercase tracking-wider text-stone-500 mt-3">List 2 · Proof of address</div>
            <button onClick={() => setList2Up(true)}
              className={`w-full p-4 rounded-2xl border-2 border-dashed flex items-center gap-3 ${list2Up ? 'border-emerald-500 bg-emerald-50/40' : 'border-stone-300'}`}>
              {list2Up ? <CircleCheck className="w-6 h-6 text-emerald-600" /> : <Upload className="w-6 h-6 text-stone-400" />}
              <div className="text-left flex-1"><div className="text-sm font-medium">{list2Up ? 'Council tax · Mar 2026 ✓' : 'Upload bank statement / council tax / utility'}</div><div className="text-[11px] text-stone-500">Most recent · &lt; 3 months</div></div>
            </button>
            {needsList3 && (
              <>
                <div className="text-xs uppercase tracking-wider text-stone-500 mt-3">List 3 · Trading address</div>
                <button onClick={() => setList3Up(true)}
                  className={`w-full p-4 rounded-2xl border-2 border-dashed flex items-center gap-3 ${list3Up ? 'border-emerald-500 bg-emerald-50/40' : 'border-stone-300'}`}>
                  {list3Up ? <CircleCheck className="w-6 h-6 text-emerald-600" /> : <Upload className="w-6 h-6 text-stone-400" />}
                  <div className="text-left flex-1"><div className="text-sm font-medium">{list3Up ? 'Lease · 2024–2027 ✓' : 'Upload trading-address proof'}</div><div className="text-[11px] text-stone-500">Lease, business statement, FCA registration</div></div>
                </button>
              </>
            )}
          </div>
        )}
        {sd.id === 'rule' && (
          <div className="space-y-3">
            {[
              { id: 'any-1', label: 'Any 1 signature', desc: 'Full Online Banking access' },
              { id: 'any-2', label: 'Any 2 signatures', desc: 'Higher control' },
              { id: 'all', label: 'All signatures', desc: 'Maximum control' },
            ].map(o => (
              <button key={o.id} onClick={() => setNewRule(o.id)}
                className={`w-full text-left p-4 rounded-2xl border ${newRule === o.id ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200'}`}>
                <div className="font-medium">{o.label}</div>
                <div className={`text-xs mt-0.5 ${newRule === o.id ? 'text-stone-300' : 'text-stone-500'}`}>{o.desc}</div>
              </button>
            ))}
            {(newRule === 'any-2' || newRule === 'all') && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-3">
                <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 leading-relaxed">
                  <strong>Heads-up.</strong> On legacy Online Banking, "Any 2" and "All" rules restrict you to view-only. <strong>This app's in-app dual signature replaces that.</strong>
                </div>
              </div>
            )}
          </div>
        )}
        {sd.id === 'choose' && (
          <div className="space-y-2">
            {signatories.map(s => (
              <button key={s.name} onClick={() => setMandateSig(s.name)}
                className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3 ${mandateSig === s.name ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}>
                <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center font-medium text-sm">{s.initials}</div>
                <div className="flex-1"><div className="font-medium text-sm">{s.name}</div><div className="text-xs text-stone-500">{s.role}</div></div>
              </button>
            ))}
          </div>
        )}
        {sd.id === 'minutes' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 leading-relaxed flex gap-2">
              <Heart className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div><strong>Treasurer's account.</strong> {entity.label}s require board minutes signed by 2 members.</div>
            </div>
            <button onClick={() => setBoardMinutesUp(true)}
              className={`w-full p-5 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 ${boardMinutesUp ? 'border-emerald-500 bg-emerald-50/40' : 'border-stone-300'}`}>
              {boardMinutesUp ? <CircleCheck className="w-7 h-7 text-emerald-600" /> : <FileText className="w-7 h-7 text-stone-400" />}
              <div className="text-sm font-medium">{boardMinutesUp ? 'minutes-12-apr-2026.pdf · 2 sigs ✓' : 'Upload board minutes'}</div>
              <div className="text-[11px] text-stone-500 text-center">PDF or photograph</div>
            </button>
          </div>
        )}
        {sd.id === 'sign' && (
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 border border-stone-200">
              {isAdd && <div className="flex justify-between text-sm"><span className="text-stone-500">Adding</span><span>{newPersonName} {newPersonSurname}</span></div>}
              {!isAdd && mandateSig && <div className="flex justify-between text-sm"><span className="text-stone-500">{isRemove ? 'Removing' : 'Updating'}</span><span>{mandateSig}</span></div>}
              {isRule && <div className="flex justify-between text-sm"><span className="text-stone-500">New rule</span><span>{newRule === 'any-1' ? 'Any 1' : newRule === 'all' ? 'All' : 'Any 2'}</span></div>}
              <div className="flex justify-between text-sm pt-2 border-t border-stone-200"><span className="text-stone-500">Required sigs</span><span>2 {entity.principal}s</span></div>
            </div>
          </div>
        )}
      </StepFrame>
    );
  };

  const renderWages = () => {
    // Compute live totals from selected payees
    const selectedPayees = payees.filter(p => p.selected);
    const total = selectedPayees.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const selectedCount = selectedPayees.length;

    // Filtered list for search
    const filteredPayees = payees.filter(p =>
      p.name.toLowerCase().includes(payeeSearch.toLowerCase()) ||
      p.role.toLowerCase().includes(payeeSearch.toLowerCase())
    );

    const togglePayee = (id) => {
      setPayees(payees.map(p => p.id === id ? { ...p, selected: !p.selected } : p));
    };
    const updateAmount = (id, amount) => {
      setPayees(payees.map(p => p.id === id ? { ...p, amount: amount === '' ? '' : Number(amount) } : p));
    };
    const removePayee = (id) => {
      setPayees(payees.filter(p => p.id !== id));
      fireToast('Payee removed.');
    };
    const selectAll = () => setPayees(payees.map(p => ({ ...p, selected: true })));
    const deselectAll = () => setPayees(payees.map(p => ({ ...p, selected: false })));

    const addNewPayee = () => {
      if (!newPayeeName || !newPayeeSort || !newPayeeAcct) return;
      const newP = {
        id: 'p' + Date.now(),
        name: newPayeeName,
        sortCode: newPayeeSort,
        acct: newPayeeAcct,
        amount: Number(newPayeeAmount) || 0,
        role: newPayeeRole || '—',
        selected: true,
        copStatus: 'pending',
      };
      setPayees([...payees, newP]);
      setShowAddPayee(false);
      setNewPayeeName(''); setNewPayeeSort(''); setNewPayeeAcct(''); setNewPayeeAmount(''); setNewPayeeRole('');
      fireToast('Payee added · Confirmation of Payee running…');
      // Simulate CoP completing
      setTimeout(() => {
        setPayees(prev => prev.map(p => p.id === newP.id ? { ...p, copStatus: 'verified' } : p));
        fireToast(`${newPayeeName} verified by Confirmation of Payee.`);
      }, 1800);
    };

    const next = () => {
      if (step === 3) {
        setPaymentPending({
          kind: 'payment',
          label: `${selectedCount} ${selectedCount === 1 ? 'payee' : 'payees'} · from ${wagesSource}`,
          total,
          count: selectedCount,
          countdown: 10,
        });
      } else setStep(step + 1);
    };
    const back = () => step === 0 ? closeWorkflow() : setStep(step - 1);
    const titles = ['Source account', 'Who gets paid?', 'Review batch', 'Sign & schedule'];
    const subs = [
      'Where funds will leave from',
      `${selectedCount} of ${payees.length} selected · ${fmt(total)}`,
      `${selectedCount} payments · ${fmt(total)}`,
      'Dual signature',
    ];

    return (
      <StepFrame title={titles[step]} sub={subs[step]} total={4} current={step}
        onBack={back} onNext={next}
        nextDisabled={(step === 0 && !wagesSource) || (step === 1 && selectedCount === 0)}
        nextLabel={step === 3 ? 'Sign & send' : 'Continue'}
        replaces={{ form: 'BACS paper schedule + branch lodgement', savings: 'In-app payee book · Confirmation of Payee built-in · no spreadsheets' }}
      >
        {/* STEP 0: Source account (unchanged) */}
        {step === 0 && (
          <div className="space-y-2">
            {accounts.filter(a => a.status === 'active').map(a => {
              const am = formatMandate(a.rule, a.required);
              return (
                <button key={a.no} onClick={() => setWagesSource(a.no)}
                  className={`w-full text-left p-4 rounded-2xl border ${wagesSource === a.no ? 'border-[#c8102e] bg-red-50/40' : 'border-stone-200'}`}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="font-medium">{a.name}</div>
                      <div className="font-mono text-xs text-stone-500">{a.no}</div>
                      <span className="text-[10px] uppercase tracking-wider text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded mt-1.5 inline-block">{am.label}</span>
                    </div>
                    <div className="font-display text-lg flex-shrink-0">{fmt(a.balance)}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 1: Built-in payee management */}
        {step === 1 && (
          <div className="space-y-3">
            {/* Live total banner */}
            <div className="rounded-2xl santander-red-dark text-white p-4 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.15em] text-white/70 font-medium">Selected to pay</div>
                  <div className="font-display-tight num-display num-tab font-medium mt-0.5">{fmt(total)}</div>
                  <div className="text-[11px] text-white/70 mt-0.5">{selectedCount} {selectedCount === 1 ? 'payee' : 'payees'} · {wagesSource}</div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={selectAll} className="text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20">All</button>
                  <button onClick={deselectAll} className="text-[10px] uppercase tracking-wider px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20">None</button>
                </div>
              </div>
            </div>

            {/* Search + add row */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text" value={payeeSearch} onChange={e => setPayeeSearch(e.target.value)}
                  placeholder="Search payees…"
                  className="w-full px-4 py-2.5 pl-9 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus-visible:border-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900/20 text-sm transition-colors"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
              <button onClick={() => setShowAddPayee(!showAddPayee)} className="btn-primary px-4 rounded-xl bg-stone-900 text-white text-sm font-medium flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" /> Add
              </button>
            </div>

            {/* Inline add-payee form */}
            {showAddPayee && (
              <div className="rounded-2xl border border-stone-900 bg-stone-50 p-4 space-y-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <UserPlus className="w-4 h-4 text-[#c8102e]" />
                  <div className="text-[10px] uppercase tracking-[0.15em] text-[#c8102e] font-medium">New payee</div>
                </div>
                <Input value={newPayeeName} onChange={setNewPayeeName} placeholder="Full name" />
                <Input value={newPayeeRole} onChange={setNewPayeeRole} placeholder="Role (optional)" />
                <div className="grid grid-cols-2 gap-2">
                  <Input value={newPayeeSort} onChange={setNewPayeeSort} placeholder="Sort code · 09-01-29" />
                  <Input value={newPayeeAcct} onChange={setNewPayeeAcct} placeholder="Account no." />
                </div>
                <Input value={newPayeeAmount} onChange={setNewPayeeAmount} placeholder="Amount £" type="number" />
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-2.5 text-[11px] text-blue-900 leading-relaxed flex gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <div>We'll run a Confirmation of Payee check — usually under 5 seconds — to make sure the name matches before any money moves.</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button onClick={() => setShowAddPayee(false)} className="py-2.5 rounded-xl border border-stone-200 text-sm font-medium">Cancel</button>
                  <button
                    onClick={addNewPayee}
                    disabled={!newPayeeName || !newPayeeSort || !newPayeeAcct}
                    className="py-2.5 rounded-xl bg-[#c8102e] text-white text-sm font-medium disabled:bg-stone-300 disabled:text-stone-500">
                    Add & verify
                  </button>
                </div>
              </div>
            )}

            {/* Payee list */}
            <div className="space-y-1.5">
              {filteredPayees.map(p => {
                const isCop = p.copStatus === 'verified';
                return (
                  <div key={p.id} className={`rounded-2xl border p-3 transition-colors ${p.selected ? 'border-[#c8102e]/40 bg-red-50/20' : 'border-stone-200 bg-white'}`}>
                    <div className="flex items-start gap-3">
                      <button onClick={() => togglePayee(p.id)}
                        className={`w-5 h-5 rounded mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors ${p.selected ? 'bg-[#c8102e] border-2 border-[#c8102e]' : 'border-2 border-stone-300 bg-white'}`}>
                        {p.selected && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-sm">{p.name}</span>
                            {isCop ? (
                              <span className="text-[9px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                                <CircleCheck className="w-2.5 h-2.5" />CoP ✓
                              </span>
                            ) : (
                              <span className="text-[9px] uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Verifying…</span>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button onClick={() => setOpenCounterparty(p.name)} className="text-[10px] uppercase tracking-wider text-stone-500 hover:text-[#c8102e]">History</button>
                            <button onClick={() => removePayee(p.id)} className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-red-600">Remove</button>
                          </div>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">{p.role} · {p.sortCode} · {p.acct}</div>
                        {p.selected && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-stone-500 text-sm">£</span>
                            <input
                              type="number"
                              value={p.amount}
                              onChange={e => updateAmount(p.id, e.target.value)}
                              className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-sm font-mono num-tab focus:outline-none focus-visible:border-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900/20 transition-colors"
                              placeholder="0.00"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredPayees.length === 0 && (
                <div className="text-center py-8 text-sm text-stone-500">No matches for "{payeeSearch}"</div>
              )}
            </div>

            {/* CSV import — optional, secondary path */}
            <div className="rounded-2xl border border-dashed border-stone-300 p-4 mt-3">
              <div className="flex items-center gap-3">
                <Upload className="w-4 h-4 text-stone-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-stone-700">Migrating from another bank?</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">Import CSV from Sage, Xero, or your old bank.</div>
                </div>
                <button onClick={() => { setWagesFile('payroll.csv'); fireToast('CSV import would parse here.'); }} className="text-[11px] uppercase tracking-wider text-stone-700 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 font-medium">
                  Import
                </button>
              </div>
            </div>

            {/* Payment rails */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {['BACS', 'Faster Payments', 'CHAPS'].map(t => (
                <div key={t} className="text-center p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[11px] font-medium text-stone-600">{t}</div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Review batch */}
        {step === 2 && (
          <div className="space-y-3">
            <div className="rounded-2xl santander-red-dark text-white p-5 relative overflow-hidden lift-hero">
              <div className="absolute inset-0 grain pointer-events-none opacity-50" />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-medium">Total batch</div>
                <div className="font-display-tight num-hero num-tab font-medium mt-1 text-white">{fmt(total)}</div>
                <div className="text-xs text-white/70 mt-2">{selectedCount} payees · all CoP cleared · from {wagesSource}</div>
              </div>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden">
              {selectedPayees.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3">
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{p.name}</div>
                    <div className="text-[11px] text-stone-500 font-mono">{p.sortCode} · {p.acct}</div>
                  </div>
                  <div className="font-mono text-sm num-tab font-medium">{fmt(p.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Sign & schedule */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 border border-stone-200">
              <div className="flex justify-between text-sm"><span className="text-stone-500">From</span><span className="font-mono">{wagesSource}</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">Amount</span><span className="font-mono num-tab">{fmt(total)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">Payees</span><span>{selectedCount}</span></div>
              <div className="flex justify-between text-sm pt-2 border-t border-stone-200"><span className="text-stone-500">Schedule</span><span>{wagesSchedule === 'now' ? 'One-off' : 'Monthly recurring'}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setWagesSchedule('now')} className={`p-3 rounded-xl border text-sm ${wagesSchedule === 'now' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200'}`}>One-off</button>
              <button onClick={() => setWagesSchedule('monthly')} className={`p-3 rounded-xl border text-sm ${wagesSchedule === 'monthly' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200'}`}>Monthly</button>
            </div>
          </div>
        )}
      </StepFrame>
    );
  };

  const renderDormancy = () => (
    <StepFrame title="Dormant accounts" sub="Reactivate or close accounts inactive 12+ months"
      total={1} current={0} onBack={closeWorkflow}
      onNext={() => { fireToast("Reactivation underway — you'll see it on the home screen."); closeWorkflow(); }}
      nextLabel="Request reactivation"
      replaces={{ form: 'Branch visit + signed letter', savings: 'In-app · no branch needed' }}>
      {accounts.filter(a => a.status === 'dormant').length === 0 ? <div className="text-center py-12 text-stone-400">No dormant accounts</div> : (
        <>
          {accounts.filter(a => a.status === 'dormant').map(a => (
            <div key={a.no} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 mb-3">
              <div className="flex justify-between items-start mb-3">
                <div><div className="font-display text-xl">{a.name}</div><div className="font-mono text-xs text-stone-500">{a.no}</div></div>
                <Pause className="w-5 h-5 text-amber-700" />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-stone-500">Last activity</div><div className="font-medium">14 months ago</div></div>
                <div><div className="text-stone-500">Balance</div><div className="font-medium font-mono">{fmt(a.balance)}</div></div>
              </div>
            </div>
          ))}
          <div className="bg-stone-50 rounded-2xl p-4 mt-4 text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-900">Why dormant?</strong> No customer-initiated activity for 12+ months. Money is safe, FSCS-protected up to £85,000.
          </div>
        </>
      )}
    </StepFrame>
  );

  const renderUnlink = () => {
    const back = () => step === 0 ? closeWorkflow() : setStep(step - 1);
    const next = () => {
      if (step === 2) {
        setPersonalLinked(false);
        const parts = ['App unlinked'];
        if (unlinkAllChannels) parts.push('call centre separation raised · ref. REL-2026-0291');
        if (unlinkPostal) parts.push('statements separated');
        if (!unlinkAllChannels) parts.push('Note: call centre agents can still see both');
        fireToast(parts.join(' · '));
        closeWorkflow();
      } else setStep(step + 1);
    };
    return (
      <StepFrame
        title={['Personal accounts', 'What changes', 'Confirm & unlink'][step]}
        sub={[
          'Currently visible to all users on this business banking profile',
          'Permanent until you re-link via your personal banking app',
          'Authenticate to complete the separation',
        ][step]}
        total={3} current={step}
        onBack={back} onNext={next}
        nextLabel={step === 2 ? 'Unlink permanently' : 'Continue'}
        replaces={{ form: 'Branch visit or phone call', savings: 'In-app · immediate · full audit trail' }}
        nextDisabled={step === 2 && !unlinkConfirm}
      >
        {step === 0 && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Two separate exposures.</strong> These balances are visible in the app to every co-signatory — and visible to our call centre agents whenever you call from your registered mobile. The app unlink and the call centre separation are different instructions.
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100/80 overflow-hidden">
              {PERSONAL_ACCOUNTS.map(a => (
                <div key={a.no} className="p-4 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[15px] text-stone-900">{a.name}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-mono text-[11px] text-stone-500">{a.sortCode} · {a.no}</span>
                      <span className="text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full font-medium bg-stone-100 text-stone-600">Personal</span>
                    </div>
                  </div>
                  <div className="font-display-tight text-xl num-tab font-medium text-stone-900">{fmt(a.balance)}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200/50 text-center">
                <div className="font-semibold text-red-800 mb-0.5">App</div>
                <div className="text-red-700">All co-signatories</div>
              </div>
              <div className="p-3 rounded-xl bg-red-50 border border-red-200/50 text-center">
                <div className="font-semibold text-red-800 mb-0.5">Call centre</div>
                <div className="text-red-700">Any inbound call</div>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">After unlinking</div>
              {[
                { icon: ShieldCheck, text: 'Personal account balances and sort codes removed from this business view entirely — not hidden, removed', good: true },
                { icon: Users, text: 'No co-signatory on this profile can see your personal account details through business banking', good: true },
                { icon: Phone, text: 'When you call us from your registered mobile, agents will still see both accounts — this unlink does not change that. Request full separation in step 3.', good: false },
                { icon: Lock, text: 'Transfers between personal and business accounts must be made from your personal banking app', good: false },
                { icon: RefreshCw, text: 'Re-linking requires authentication from your personal Santander app or a call to us — cannot be done here', good: false },
              ].map((item, i) => {
                const I = item.icon;
                return (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.good ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                      <I className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs text-stone-700 leading-relaxed mt-0.5">{item.text}</div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
              <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong>GDPR Article 5(1)(c) — data minimisation.</strong> Personal financial data should not be accessible beyond its original purpose. Unlinking brings your business profile into compliance with this principle.
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 border border-stone-200">
              <div className="flex justify-between text-sm"><span className="text-stone-500">Unlinking</span><span>2 personal accounts</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">Account holder</span><span>James Whitfield</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">App separation</span><span className="text-emerald-700 font-medium">Immediate</span></div>
              <div className="flex justify-between text-sm pt-2 border-t border-stone-200"><span className="text-stone-500">Logged to</span><span className="font-medium">Audit trail · FCA SYSC 9</span></div>
            </div>
            <Toggle
              label="Also separate from call centre view"
              sub="When you call us, agents won't see personal accounts · back-office CRM instruction · up to 2 working days · confirmed by letter"
              value={unlinkAllChannels}
              onChange={setUnlinkAllChannels}
            />
            {unlinkAllChannels && (
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <span className="text-xs text-stone-500">Call centre case ref.</span>
                <span className="font-mono text-sm font-medium tracking-wider">REL-2026-0291</span>
              </div>
            )}
            <Toggle
              label="Also separate from combined statements"
              sub="Personal transactions removed from business statements and correspondence · immediate"
              value={unlinkPostal}
              onChange={setUnlinkPostal}
            />
            <div className="p-4 rounded-2xl bg-stone-900 text-white">
              <div className="flex items-center gap-2 mb-3"><ShieldCheck className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Separation declaration</span></div>
              <div className="text-sm leading-relaxed">"I instruct Santander to remove personal account access from my business banking profile{unlinkAllChannels ? ' and from our call centre view' : ''}{unlinkPostal ? ' and separate personal from combined statements' : ''}. I understand this cannot be reversed via the app."</div>
            </div>
            <label className="flex gap-3 p-4 rounded-2xl border border-stone-200 cursor-pointer">
              <input type="checkbox" checked={unlinkConfirm} onChange={e => setUnlinkConfirm(e.target.checked)} className="mt-0.5 accent-[#c8102e]" />
              <span className="text-xs text-stone-700 leading-relaxed">
                I confirm I want to permanently remove personal account access from this business banking view{unlinkAllChannels ? ' and request call centre separation' : ''}{unlinkPostal ? ' and separate personal from combined statements' : ''}. I understand re-linking requires authentication from my personal banking app.
              </span>
            </label>
          </div>
        )}
      </StepFrame>
    );
  };

  const renderRingfence = () => {
    const back = () => step === 0 ? closeWorkflow() : setStep(step - 1);
    const next = () => {
      if (step === 1) {
        setCreditRingfenced(true);
        fireToast('Credit ring-fence applied — personal accounts excluded from all business credit assessments');
        closeWorkflow();
      } else setStep(step + 1);
    };
    return (
      <StepFrame
        title={['Credit decisioning', 'Confirm ring-fence'][step]}
        sub={[
          'Personal account data currently visible to our credit team',
          'Review and confirm your ring-fence instruction',
        ][step]}
        total={2} current={step}
        onBack={back} onNext={next}
        nextLabel={step === 1 ? 'Apply ring-fence' : 'Continue'}
        replaces={{ form: 'Phone request to credit team', savings: 'In-app · immediate · logged to FCA SYSC 9' }}
        nextDisabled={step === 1 && !ringfenceConfirm}
      >
        {step === 0 && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Not ring-fenced.</strong> When your business applies for credit — overdraft renewal, loan, business card — our credit team can see personal account data. A personal financial difficulty could influence a business credit decision.
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              {[
                { icon: ShieldCheck, text: 'Personal account balances, transactions, and credit history excluded from all business credit assessments', good: true },
                { icon: Building2, text: 'Business credit assessed on business accounts only — trading history, turnover, business cash flow', good: true },
                { icon: Award, text: 'Logged to your customer record as a GDPR Article 5(1)(c) data minimisation instruction', good: true },
                { icon: AlertCircle, text: 'If you apply for a joint personal-business product, you may need to consent to a combined view for that application only', good: false },
              ].map((item, i) => {
                const I = item.icon;
                return (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${item.good ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
                      <I className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs text-stone-700 leading-relaxed mt-0.5">{item.text}</div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
              <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong>GDPR Article 5(1)(c) · ICO guidance · FCA PS22/9</strong> — purpose limitation means personal data collected for personal banking cannot be used for business credit decisions without a separate lawful basis.
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5 border border-stone-200">
              <div className="flex justify-between text-sm"><span className="text-stone-500">Unlinking</span><span>Business credit assessments</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">Excluded data</span><span>Personal accounts · history</span></div>
              <div className="flex justify-between text-sm"><span className="text-stone-500">Takes effect</span><span className="text-emerald-700 font-medium">Immediately</span></div>
              <div className="flex justify-between text-sm pt-2 border-t border-stone-200"><span className="text-stone-500">Logged to</span><span className="font-medium">Audit trail · FCA SYSC 9</span></div>
            </div>
            <div className="p-4 rounded-2xl bg-stone-900 text-white">
              <div className="flex items-center gap-2 mb-3"><ShieldCheck className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">Ring-fence declaration</span></div>
              <div className="text-sm leading-relaxed">"I instruct Santander to exclude my personal account data from all business credit assessments. I understand individual product applications may require separate consent."</div>
            </div>
            <label className="flex gap-3 p-4 rounded-2xl border border-stone-200 cursor-pointer">
              <input type="checkbox" checked={ringfenceConfirm} onChange={e => setRingfenceConfirm(e.target.checked)} className="mt-0.5 accent-[#c8102e]" />
              <span className="text-xs text-stone-700 leading-relaxed">
                I confirm I want to ring-fence my personal account data from all business credit assessments. I understand individual product applications may require separate consent.
              </span>
            </label>
          </div>
        )}
      </StepFrame>
    );
  };

  const renderIdCheck = () => (
    <StepFrame title="Signatory ID register" sub="Lists 1, 2 & 3 — tracked per signatory"
      total={1} current={0} onBack={closeWorkflow} onNext={closeWorkflow} nextLabel="Done"
      replaces={{ form: 'Annual letters with photocopies', savings: 'Continuous re-verification via GOV.UK One Login' }}>
      <div className="space-y-2">
        {signatories.map(s => (
          <div key={s.name} className={`p-4 rounded-2xl border ${s.status === 'verified' ? 'border-stone-200' : 'border-amber-300 bg-amber-50/30'}`}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-medium text-sm">{s.initials}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0"><div className="font-medium text-sm">{s.name}</div><div className="text-xs text-stone-500">{s.role}</div></div>
                  {s.status === 'verified' ? <span className="text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full flex-shrink-0">Current</span> : <span className="text-[10px] uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-1 rounded-full flex-shrink-0">Re-verify</span>}
                </div>
                <div className="mt-2 space-y-0.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-stone-500">List 1 · ID</span><span>{s.list1}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">List 2 · Address</span><span>{s.list2}</span></div>
                  <div className="flex justify-between"><span className="text-stone-500">List 3 · Trading</span><span className="text-right">{s.list3}</span></div>
                </div>
              </div>
            </div>
            {s.status === 'review' && <button className="mt-3 w-full text-sm bg-stone-900 text-white py-2.5 rounded-xl">Send re-verification link</button>}
          </div>
        ))}
      </div>
    </StepFrame>
  );

  // === SHEETS ===
  const ComplianceSheet = () => (
    <div className="fixed inset-0 z-50 bg-black/40 anim-fade flex items-end" onClick={() => setShowCompliance(false)}>
      <div onClick={e => e.stopPropagation()} className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto anim-slide">
        <div className="px-5 pt-3 pb-2 sticky top-0 bg-white border-b border-stone-100">
          <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Your rights</h2>
            <button onClick={() => setShowCompliance(false)} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="px-5 py-5 space-y-5">
          <section>
            <div className="flex items-center gap-2 mb-2"><Scale className="w-4 h-4 text-[#c8102e]" /><h3 className="font-display text-lg">Regulation</h3></div>
            <p className="text-sm text-stone-600 leading-relaxed">Santander UK plc. 2 Triton Square, Regent's Place, London NW1 3AN. Authorised by the PRA, regulated by the FCA and PRA. <span className="font-mono text-xs">FRN 106054</span></p>
          </section>
          <section>
            <div className="flex items-center gap-2 mb-2"><Heart className="w-4 h-4 text-[#c8102e]" /><h3 className="font-display text-lg">Our Consumer Duty</h3></div>
            <p className="text-sm text-stone-600 leading-relaxed">Under the FCA's Consumer Duty (July 2023), we're required to deliver good outcomes for you. Clear communication, products that meet your needs, fair value, accessible support. If we're not meeting that bar, tell us — it's how we improve.</p>
          </section>
          <section>
            <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-4 h-4 text-[#c8102e]" /><h3 className="font-display text-lg">FSCS protection</h3></div>
            <p className="text-sm text-stone-600 leading-relaxed">Eligible deposits protected up to £85,000 per depositor.</p>
          </section>
          <section>
            <div className="flex items-center gap-2 mb-2"><FileSignature className="w-4 h-4 text-[#c8102e]" /><h3 className="font-display text-lg">If something goes wrong</h3></div>
            <p className="text-sm text-stone-600 leading-relaxed mb-3">Tell us first — most issues we fix within 3 working days. If we can't, we'll keep you updated and aim to resolve within 8 weeks. We won't make you feel like you're chasing us.</p>
            <p className="text-sm text-stone-600 leading-relaxed">Unresolved? You can refer your complaint to the <strong>Financial Ombudsman Service</strong> free of charge within 6 months of our final response. They're independent, and their decision is binding on us.</p>
            <p className="text-sm text-stone-600 leading-relaxed mt-2">Financial Ombudsman · <strong>0800 023 4567</strong></p>
          </section>
          <section>
            <div className="flex items-center gap-2 mb-2"><Phone className="w-4 h-4 text-[#c8102e]" /><h3 className="font-display text-lg">Talk to us</h3></div>
            <p className="text-sm text-stone-600 leading-relaxed">Business Banking · <strong>0330 123 9860</strong> · Mon–Fri 8am–6pm. Relay UK and BSL video relay available. We'll never make this harder than it needs to be.</p>
          </section>
        </div>
      </div>
    </div>
  );

  const SavingsSheet = () => (
    <div className="fixed inset-0 z-50 bg-black/40 anim-fade flex items-end" onClick={() => setShowSavings(false)}>
      <div onClick={e => e.stopPropagation()} className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto anim-slide">
        <div className="px-5 pt-3 pb-2 sticky top-0 bg-white border-b border-stone-100">
          <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Less paperwork, more business</h2>
            <button onClick={() => setShowSavings(false)} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-xs text-stone-500 mt-1 mb-2">Three forms we used to ask you to fill in, post, and wait for. Now they live here.</p>
        </div>
        <div className="px-5 py-5 space-y-3">
          {[
            { form: 'ANBMC0800', name: "Treasurer's mandate", pages: '8 pages' },
            { form: 'ANB9 0042', name: 'Change of business details', pages: '3 pages' },
            { form: 'ANB9 0370', name: 'Close an account', pages: '2 pages' },
          ].map(f => (
            <div key={f.form} className="p-4 rounded-2xl border border-stone-200">
              <div className="flex items-start justify-between">
                <div><div className="font-display text-base">{f.name}</div><div className="text-[11px] text-stone-500 font-mono mt-0.5">{f.form} · {f.pages}</div></div>
                <div className="text-right text-[11px]"><div className="text-stone-500 line-through">5 working days</div><div className="text-emerald-700 font-medium">Now: minutes</div></div>
              </div>
            </div>
          ))}
          <div className="p-4 rounded-2xl bg-stone-900 text-white">
            <div className="text-xs uppercase tracking-wider text-stone-400">The big unlock</div>
            <div className="text-sm mt-2 leading-relaxed">In legacy Online Banking, "Any 2" and "All" mandates restrict you to view-only. Biometric in-app dual signature replaces that.</div>
          </div>
        </div>
      </div>
    </div>
  );

  const RMSheet = () => {
    const reasons = {
      'sanctioned-country': { icon: Flag, title: 'Enhanced due diligence needed', body: "The country listed needs an extra check under UK sanctions rules. Priya can complete this with you." },
      'visitor-visa': { icon: AlertCircle, title: "Visitor visa not accepted", body: "We can't accept a visitor visa. The signatory needs settled, pre-settled, or work-visa status with a share code." },
      'pep': { icon: ShieldAlert, title: 'PEP check needed', body: "PEPs need extra checks under MLR 2017. Priya will arrange a quick call." },
      'partnership-rename': { icon: ScrollText, title: 'Partnership rename', body: "Partnerships need to provide the partnership agreement or a tax return in the new name." },
      'signatory-dispute': { icon: AlertTriangle, title: "Disputed removal", body: "Removing a signatory who hasn't consented needs written agreement from all others." },
    };
    const r = reasons[rmReason] || reasons['sanctioned-country'];
    const I = r.icon;
    return (
      <div className="fixed inset-0 z-50 bg-black/40 anim-fade flex items-end" onClick={() => setShowRMSheet(false)}>
        <div onClick={e => e.stopPropagation()} className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto anim-slide">
          <div className="px-5 pt-3 pb-2 sticky top-0 bg-white border-b border-stone-100">
            <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Talk to Priya</h2>
              <button onClick={() => setShowRMSheet(false)} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="px-5 py-5 space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center flex-shrink-0"><I className="w-5 h-5" /></div>
                <div><div className="font-display text-lg leading-tight">{r.title}</div><div className="text-sm text-stone-600 mt-1.5 leading-relaxed">{r.body}</div></div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-900 to-stone-700 text-white flex items-center justify-center font-medium">PD</div>
                <div><div className="font-medium text-sm">Priya Desai</div><div className="text-xs text-stone-500">Your relationship manager</div></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className="py-3 rounded-xl bg-stone-900 text-white text-xs font-medium flex flex-col items-center gap-1"><Phone className="w-4 h-4" />Call</button>
                <button className="py-3 rounded-xl bg-stone-100 text-xs font-medium flex flex-col items-center gap-1"><Calendar className="w-4 h-4" />Book</button>
                <button className="py-3 rounded-xl bg-stone-100 text-xs font-medium flex flex-col items-center gap-1"><Video className="w-4 h-4" />Video</button>
              </div>
            </div>
            <button onClick={() => { fireToast("All saved. Priya will be in touch within 2 working hours."); setShowRMSheet(false); closeWorkflow(); }}
              className="w-full bg-[#c8102e] text-white py-4 rounded-2xl font-medium">
              Open case & save my progress
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EntitySheet = () => (
    <div className="fixed inset-0 z-50 bg-black/40 anim-fade flex items-end" onClick={() => setShowEntitySwitcher(false)}>
      <div onClick={e => e.stopPropagation()} className="w-full bg-white rounded-t-3xl anim-slide">
        <div className="px-5 pt-3 pb-2 border-b border-stone-100">
          <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl">Demo · entity type</h2>
            <button onClick={() => setShowEntitySwitcher(false)} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-xs text-stone-500 mt-2 mb-2">In production, detected from your account record. The app adapts.</p>
        </div>
        <div className="px-5 py-4 space-y-2 max-h-96 overflow-y-auto">
          {Object.keys(ENTITY_INFO).map(t => {
            const e = ENTITY_INFO[t];
            const I = e.isTreasurer ? Heart : t === 'limited' || t === 'llp' ? Building2 : t === 'partnership' ? Briefcase : t === 'sole-trader' ? UserCheck : t === 'club' ? Users : BookOpen;
            return (
              <button key={t} onClick={() => { setEntityType(t); setShowEntitySwitcher(false); fireToast(`Switched to ${e.name}`); }}
                className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3 ${entityType === t ? 'border-stone-900 bg-stone-50' : 'border-stone-200'}`}>
                <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center"><I className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0"><div className="font-medium text-sm">{e.name}</div><div className="text-xs text-stone-500 capitalize">{t.replace('-', ' ')}</div></div>
                {entityType === t && <Check className="w-4 h-4 text-stone-900" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const CancelSheet = () => {
    const c = cooling.find(x => x.id === pendingCancelId);
    if (!c) return null;
    return (
      <div className="fixed inset-0 z-[60] bg-black/50 anim-fade flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 anim-fade">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4"><AlertCircle className="w-6 h-6" /></div>
          <h2 className="font-display text-2xl leading-tight mb-2">Cancel this request?</h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-1">We'll undo the signature you gave for <strong>{c.desc}</strong>. Your account stays exactly as it is. No money moves. No charges.</p>
          <p className="text-sm text-stone-600 leading-relaxed mb-5">You can start the request again later if you change your mind.</p>
          <div className="space-y-2">
            <button onClick={confirmCancel} className="w-full py-3.5 rounded-2xl bg-stone-900 text-white text-sm font-medium">Yes, cancel it</button>
            <button onClick={() => setPendingCancelId(null)} className="w-full py-3.5 rounded-2xl border border-stone-200 text-sm font-medium">No, keep it going</button>
          </div>
        </div>
      </div>
    );
  };

  // === ACTION TILES & SCREENS ===
  const ActionTile = ({ icon: I, title, desc, onClick, highlight, badge }) => (
    <button onClick={onClick} className={`text-left p-4 rounded-2xl transition-all duration-200 active:scale-[0.97] btn-primary ${highlight ? 'tile-hero text-white' : 'bg-white border border-stone-200/80 hover:border-stone-300 lift-1 hover:lift-2'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${highlight ? 'bg-white/[0.08] backdrop-blur-sm border border-white/[0.08]' : 'bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-100'}`}>
          <I className={`w-5 h-5 ${highlight ? 'text-white' : 'text-stone-700'}`} />
        </div>
        {badge && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#c8102e] text-white font-medium">{badge}</span>}
      </div>
      <div className={`font-medium text-[14px] ${highlight ? 'text-white' : 'text-stone-900'}`}>{title}</div>
      <div className={`text-[11px] mt-0.5 leading-snug ${highlight ? 'text-stone-300' : 'text-stone-500'}`}>{desc}</div>
    </button>
  );

  const HomeScreen = () => (
    <div className="pb-24">
      <div className="px-5 pt-4 pb-7 anim-fade">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-8 bg-stone-300" />
          <div className="text-[10px] text-stone-500 uppercase tracking-[0.2em] font-medium">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </div>
        <h1 className="font-display-tight text-[44px] leading-[0.95] text-stone-900">
          {greeting},<br />
          <span className="italic font-light text-stone-800">{entity.isTreasurer ? 'Treasurer' : 'James'}.</span>
        </h1>
        <p className="text-sm text-stone-600 mt-4 leading-relaxed max-w-md">Everything's running normally today.{pendingApprovals.length > 0 && ` ${pendingApprovals.length} thing${pendingApprovals.length > 1 ? 's' : ''} need your signature — they're below.`}</p>
      </div>

      {/* Total balance — editorial hero */}
      <div className="mx-5 mb-6 anim-fade stagger-1">
        <div className="relative overflow-hidden rounded-[28px] hero-card text-white lift-hero">
          <div className="absolute inset-0 grain pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#c8102e]/30 blur-3xl anim-float" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-[#c8102e]/10 blur-3xl" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-medium">Total balance</div>
                <div className="text-xs text-stone-500 mt-0.5">{entity.name}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-stone-400">{accounts.length} accounts</div>
                <div className="text-xs text-stone-500 mt-0.5">Sort code 09-01-29</div>
              </div>
            </div>
            <div className="font-display-tight num-hero num-tab font-medium">{fmt(totalBalance)}</div>
            <div className="mt-5 flex flex-wrap gap-1.5">
              <span className="text-[10px] uppercase tracking-wider bg-white/[0.08] backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/[0.06]">{entity.label}</span>
              <span className="text-[10px] uppercase tracking-wider bg-white/[0.08] backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/[0.06]">{accounts.every(a => a.rule === accounts[0].rule) ? formatMandate(accounts[0].rule, accounts[0].required).label : 'Mixed mandates'}</span>
              <span className="text-[10px] uppercase tracking-wider bg-white/[0.08] backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/[0.06]">FSCS protected</span>
              {creditRingfenced && <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-400/30 text-emerald-200">Credit ring-fenced</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Demo controls */}
      <div className="px-5 mb-4 flex flex-wrap gap-1.5">
        <button onClick={() => setShowEntitySwitcher(true)} className="text-[10px] uppercase tracking-wider text-stone-500 px-3 py-1.5 rounded-full bg-stone-100 inline-flex items-center gap-1">
          {entity.label} <ChevronRight className="w-3 h-3" />
        </button>
        <button onClick={() => startCooling({ type: 'Account closure', desc: 'Trading account ····2841', kind: 'closure' })} className="text-[10px] uppercase tracking-wider text-stone-500 px-3 py-1.5 rounded-full bg-stone-100">
          Demo cooling-off
        </button>
        <button onClick={() => stallRequest({ type: 'Mandate change', desc: 'Add Mark Patel · partner missed window' })} className="text-[10px] uppercase tracking-wider text-stone-500 px-3 py-1.5 rounded-full bg-stone-100">
          Simulate timeout
        </button>
      </div>

      {/* Cooling-off */}
      {cooling.length > 0 && (
        <div className="px-5 mb-7 anim-fade">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-amber-700/80 font-medium mb-0.5">Cooling off</div>
              <h2 className="font-display-tight text-2xl text-stone-900">Just a moment to think</h2>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">Cancel anytime</span>
          </div>
          <div className="space-y-2.5">
            {cooling.map(c => {
              const total = 24 * 3600 * 1000;
              const elapsed = Date.now() - (c.executesAt - total);
              const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
              return (
                <div key={c.id} className="cool-card rounded-2xl p-5 lift-1 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full cool-orb pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-200/60 flex items-center justify-center flex-shrink-0 lift-1">
                        <Clock className="w-5 h-5 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-amber-700/80 font-medium">{c.type}</div>
                        <div className="font-medium text-[15px] text-stone-900 mt-0.5">{c.desc}</div>
                        <div className="text-[11px] text-stone-600 mt-1.5 leading-relaxed">We'll do this {formatExecuteTime(c.executesAt)}. <span className="text-stone-500">Pauses on weekends and bank holidays.</span></div>
                      </div>
                    </div>
                    <div className="mt-4 h-1 bg-amber-100/60 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button onClick={() => requestCancel(c.id)} className="btn-primary py-2.5 rounded-xl bg-white border border-stone-200 text-sm font-medium hover:bg-stone-50">Cancel</button>
                      <button onClick={() => { setCooling(prev => prev.filter(x => x.id !== c.id)); fireToast('Released — your request is on the way.'); }} className="btn-primary py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium">Do it now</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stalled */}
      {stalled.length > 0 && (
        <div className="px-5 mb-7 anim-fade">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-blue-700/80 font-medium mb-0.5">Escalated</div>
              <h2 className="font-display-tight text-2xl text-stone-900">Priya's on it</h2>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">We've got you</span>
          </div>
          <div className="space-y-2.5">
            {stalled.map(s => (
              <div key={s.id} className="rm-card rounded-2xl p-5 lift-1 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />
                <div className="relative">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center flex-shrink-0 lift-2">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-blue-700/80 font-medium">{s.type}</div>
                      <div className="font-medium text-[15px] text-blue-900 mt-0.5">{s.desc}</div>
                      <div className="text-[11px] text-blue-900/75 mt-1.5 leading-relaxed">A signature didn't arrive in time. Priya saw this within 2 minutes and will reach out today. Nothing's been lost — just paused.</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={() => setStalled(stalled.filter(x => x.id !== s.id))} className="btn-primary py-2.5 rounded-xl bg-white border border-blue-200 text-sm font-medium text-blue-900">Got it</button>
                    <button onClick={() => triggerRM('signatory-dispute')} className="btn-primary py-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-medium">Call Priya</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MTD teaser */}
      {currentVATObligation && (
        <div className="px-5 mb-6 anim-fade">
          <button onClick={() => setTab('mtd')} className="btn-primary w-full text-left rounded-2xl overflow-hidden border border-stone-200/80 lift-1 hover:lift-2 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c8102e]/[0.06] via-stone-50 to-[#c8102e]/[0.03]" />
            <div className="absolute top-0 left-0 w-1 h-full red-accent-bar" />
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#c8102e]/10 blur-3xl pointer-events-none" />
            <div className="relative p-4 pl-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl santander-red text-white flex items-center justify-center flex-shrink-0 lift-2">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.15em] text-[#c8102e] font-medium">VAT due in {daysUntilDeadline} days · MTD</div>
                <div className="font-display-tight text-[17px] text-stone-900 mt-0.5 truncate">{fmt(currentVATObligation.vatDue)} owed to HMRC</div>
                <div className="text-[11px] text-stone-600 mt-0.5 truncate">{transactionsToReview} transactions to review · {currentVATObligation.period}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#c8102e] flex-shrink-0" />
            </div>
          </button>
        </div>
      )}

      {/* Paperless banner */}
      <div className="px-5 mb-6 anim-fade">
        <button onClick={() => setShowSavings(true)} className="btn-primary w-full bg-gradient-to-br from-emerald-50/80 via-stone-50 to-emerald-50/40 border border-emerald-200/40 rounded-2xl p-4 flex items-center gap-3 text-left lift-1 hover:lift-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center flex-shrink-0 lift-2">
            <MailX className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-display-tight text-[17px] text-stone-900">3 paper forms retired</div>
            <div className="text-[11px] text-stone-600 mt-0.5">No more posting to Sunderland · 5 days → minutes</div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Pending approvals */}
      {pendingApprovals.length > 0 && (
        <div className="px-5 mb-7 anim-fade">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#c8102e]/80 font-medium mb-0.5">Action required</div>
              <h2 className="font-display-tight text-2xl text-stone-900">Awaiting your signature</h2>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#c8102e] text-white font-medium">{pendingApprovals.length}</span>
          </div>
          <div className="space-y-2.5">
            {pendingApprovals.slice(0, 2).map(p => {
              const I = p.icon;
              return (
                <button key={p.id} onClick={() => setTab('approve')} className="btn-primary w-full text-left bg-white border border-stone-200/80 rounded-2xl p-4 flex items-center gap-3 lift-1 hover:border-stone-300">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-stone-50 to-stone-100/50 border border-stone-100 flex items-center justify-center flex-shrink-0">
                    <I className="w-5 h-5 text-stone-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium">{p.type}</div>
                    <div className="font-medium text-sm truncate text-stone-900">{p.desc}</div>
                    {p.amount && <div className="font-mono text-[11px] text-stone-500 mt-0.5 num-tab">{p.amount}</div>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-amber-700 font-medium">Expires {p.expires}</div>
                    <ChevronRight className="w-4 h-4 ml-auto mt-1 text-stone-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 mb-7 anim-fade">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-0.5">No more posting to Sunderland</div>
            <h2 className="font-display-tight text-2xl text-stone-900">Paperless actions</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <ActionTile icon={Banknote} title="Bulk payments" desc="CSV · BACS, FP, CHAPS" onClick={() => { setWorkflow('wages'); setStep(0); }} highlight />
          <ActionTile icon={Users} title={entity.isTreasurer ? "Mandate & members" : "Change mandate"} desc="Add, remove, signing rule" onClick={() => { setWorkflow('mandate'); setStep(0); }} />
          <ActionTile icon={Briefcase} title={entity.isTreasurer ? "Org details" : "Business details"} desc="Name, address, contact" onClick={() => { setWorkflow('biz'); setStep(0); }} />
          <ActionTile icon={UserCheck} title="ID register" desc="Lists 1, 2 & 3" onClick={() => setWorkflow('idcheck')} />
          <ActionTile icon={Pause} title="Dormant accounts" desc="Reactivate or close" onClick={() => setWorkflow('dormancy')} badge="1" />
          <ActionTile icon={Archive} title="Close account" desc="Form ANB9 0370" onClick={() => { setWorkflow('closure'); setStep(0); }} />
        </div>
      </div>

      {/* Accounts */}
      <div className="px-5 mb-7 anim-fade">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-0.5">Your money</div>
            <h2 className="font-display-tight text-2xl text-stone-900">Accounts</h2>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">{accounts.length} total</span>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100/80 lift-1 overflow-hidden">
          {accounts.map(a => {
            const am = formatMandate(a.rule, a.required);
            return (
              <div key={a.no} className="acct-row p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[15px] text-stone-900">{a.name}</div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="font-mono text-[11px] text-stone-500">{a.sortCode} · {a.no}</span>
                    <span className={`text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full font-medium ${am.isSingle ? 'mandate-single' : am.rule === 'all' ? 'mandate-all' : 'mandate-dual'}`}>{am.label}</span>
                    {a.status === 'dormant' && <span className="text-[9px] uppercase tracking-[0.1em] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">Dormant</span>}
                  </div>
                </div>
                <div className="font-display-tight text-xl num-tab font-medium text-stone-900">{fmt(a.balance)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cards */}
      <div className="px-5 mb-7 anim-fade">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-0.5">Business debit</div>
            <h2 className="font-display-tight text-2xl text-stone-900">Cards</h2>
          </div>
        </div>
        <div className="space-y-2.5">
          {BUSINESS_CARDS.map((card) => {
            const isFrozen = frozenCards.has(card.key);
            return (
              <div key={card.key} className={`p-4 rounded-2xl border lift-1 ${isFrozen ? 'border-blue-200 bg-blue-50/30' : 'border-stone-200 bg-white'}`}>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isFrozen ? 'bg-blue-100 text-blue-600' : 'bg-stone-900 text-white'}`}>
                      {isFrozen ? <Snowflake className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-medium text-[15px] text-stone-900">{card.name}</div>
                      <div className="font-mono text-[11px] text-stone-500">{card.last4} · {card.network} · Exp {card.expiry}</div>
                    </div>
                  </div>
                  {isFrozen && <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-medium flex-shrink-0">Frozen</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setPinCardKey(card.key); setPinAuthDone(false); setPinRevealed(false); setPinCountdown(30); setShowPinSheet(true); }}
                    className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 flex items-center justify-center gap-1.5 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View PIN
                  </button>
                  <button
                    onClick={() => {
                      setFrozenCards(prev => { const n = new Set(prev); isFrozen ? n.delete(card.key) : n.add(card.key); return n; });
                      fireToast(isFrozen ? `${card.name} unfrozen — ready to use` : `${card.name} frozen — all transactions blocked`);
                    }}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${isFrozen ? 'border-blue-200 text-blue-700 hover:bg-blue-50' : 'border-stone-200 text-stone-700 hover:bg-stone-50'}`}
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    {isFrozen ? 'Unfreeze' : 'Freeze'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privacy controls */}
      <div className="px-5 mb-7 anim-fade">
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-0.5">GDPR · PSD2 · Consumer Duty</div>
          <h2 className="font-display-tight text-2xl text-stone-900">Privacy controls</h2>
        </div>
        <div className="space-y-2">
          {/* Personal accounts status */}
          {personalLinked ? (
            <button onClick={() => { setWorkflow('unlink'); setStep(0); }}
              className="w-full text-left p-4 rounded-2xl border border-amber-300 bg-amber-50/40 flex items-center gap-3 btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">Personal accounts linked</div>
                <div className="text-[11px] text-amber-800">Visible to co-signatories, call centre, and credit team</div>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-700 flex-shrink-0" />
            </button>
          ) : (
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-emerald-900">Personal accounts separated</div>
                <div className="text-[11px] text-emerald-700">Removed from app{unlinkAllChannels ? ', call centre' : ''}{unlinkPostal ? ', statements' : ''}</div>
              </div>
            </div>
          )}
          {/* Open banking consents */}
          <button onClick={() => setShowOBSheet(true)}
            className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3 btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${!obFCRevoked ? 'border-amber-300 bg-amber-50/40' : 'border-stone-200 bg-white'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!obFCRevoked ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600'}`}>
              <Link2 className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Open banking consents</div>
              <div className={`text-[11px] ${!obFCRevoked ? 'text-amber-800' : 'text-stone-500'}`}>
                {!obFCRevoked ? 'Funding Circle has access to personal data' : '3 consents · business data only'}
              </div>
            </div>
            {!obFCRevoked && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#c8102e] text-white font-medium flex-shrink-0">!</span>}
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ${!obFCRevoked ? 'text-amber-700' : 'text-stone-400'}`} />
          </button>
          {/* Credit decisioning ring-fence */}
          <button
            onClick={() => { if (!creditRingfenced) { setWorkflow('ringfence'); setStep(0); } }}
            className={`w-full text-left p-4 rounded-2xl border flex items-center gap-3 btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 ${creditRingfenced ? 'border-emerald-200 bg-emerald-50/40' : 'border-stone-200 bg-white'}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${creditRingfenced ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Credit decisioning</div>
              <div className={`text-[11px] ${creditRingfenced ? 'text-emerald-700' : 'text-stone-500'}`}>
                {creditRingfenced ? 'Ring-fenced — personal data excluded from business credit assessments' : 'Personal finances visible to credit team · not ring-fenced'}
              </div>
            </div>
            {creditRingfenced
              ? <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              : <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />}
          </button>
        </div>
      </div>

      {/* Priya card */}
      <div className="px-5 mb-7 anim-fade">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-[#c8102e]/80 font-medium mb-0.5">The personal touch</div>
            <h2 className="font-display-tight text-2xl text-stone-900">Your relationship manager</h2>
          </div>
        </div>
        <div className="rounded-2xl priya-card border border-stone-200/80 overflow-hidden lift-1">
          <div className="p-5 flex items-center gap-4 border-b border-stone-100/80">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-stone-900 to-stone-700 text-white flex items-center justify-center font-display text-base font-medium lift-2">PD</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white anim-pulse-glow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-[15px] text-stone-900">Priya Desai</div>
              <div className="text-[11px] text-stone-600 mt-0.5">Business Banking · South East</div>
              <div className="text-[10px] text-emerald-700 mt-1 font-medium uppercase tracking-wider">Available now · usually replies in 2h</div>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-stone-100/80">
            <button onClick={() => triggerRM('sanctioned-country')} className="py-3.5 flex flex-col items-center gap-1.5 hover:bg-white/40 transition-colors">
              <Phone className="w-4 h-4 text-stone-700" />
              <span className="text-[10px] uppercase tracking-[0.1em] text-stone-700 font-medium">Call</span>
            </button>
            <button onClick={() => triggerRM('sanctioned-country')} className="py-3.5 flex flex-col items-center gap-1.5 hover:bg-white/40 transition-colors">
              <Calendar className="w-4 h-4 text-stone-700" />
              <span className="text-[10px] uppercase tracking-[0.1em] text-stone-700 font-medium">Book</span>
            </button>
            <button onClick={() => triggerRM('sanctioned-country')} className="py-3.5 flex flex-col items-center gap-1.5 hover:bg-white/40 transition-colors">
              <Video className="w-4 h-4 text-stone-700" />
              <span className="text-[10px] uppercase tracking-[0.1em] text-stone-700 font-medium">Video</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="px-5 mb-3">
        <div className="p-3 rounded-2xl bg-stone-50 text-[11px] text-stone-600 leading-relaxed flex gap-2">
          <Heart className="w-4 h-4 text-[#c8102e] flex-shrink-0 mt-0.5" />
          <div><strong className="text-stone-900">Need something different?</strong> Large print, braille, audio, BSL video relay, Relay UK — we offer them all.</div>
        </div>
      </div>

      {/* Compliance */}
      <div className="px-5">
        <button onClick={() => setShowCompliance(true)} className="w-full p-4 rounded-2xl bg-stone-100 text-left flex items-center gap-3">
          <Scale className="w-4 h-4 text-stone-600" />
          <div className="flex-1"><div className="text-xs font-medium text-stone-900">Your rights & how to complain</div><div className="text-[11px] text-stone-500">FCA · FRN 106054 · FSCS · Financial Ombudsman</div></div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Motto */}
      <div className="px-5 pt-6 pb-3 text-center">
        <p className="text-[11px] text-stone-400 italic font-display">A digital bank with a personal touch</p>
      </div>

      {/* Attribution */}
      <div className="px-5 pb-3 text-center space-y-0.5">
        <p className="text-[9px] text-stone-400 leading-relaxed">
          Concept &amp; prototype by <span className="font-medium text-stone-500">Alan Davidson</span>
        </p>
        <p className="text-[9px] text-stone-300 leading-relaxed">
          Alan.Davidson@santander.co.uk
        </p>
      </div>
    </div>
  );

  const ApproveScreen = () => {
    const sign = (id) => { setApprovalState({ ...approvalState, [id]: 'signed' }); fireToast('Signed. Releasing now.'); };
    const reject = (id) => { setApprovalState({ ...approvalState, [id]: 'rejected' }); fireToast("Rejected. We've let them know."); };
    return (
      <div className="pb-24">
        <div className="px-5 pt-3 pb-5">
          <div className="text-xs text-stone-500 uppercase tracking-wider">Pending</div>
          <h1 className="font-display text-4xl mt-1 leading-tight">Awaiting<br /><span className="italic font-light">your signature</span></h1>
        </div>
        <div className="px-5 space-y-3">
          {pendingApprovals.map(p => {
            const I = p.icon;
            const s = approvalState[p.id];
            return (
              <div key={p.id} className={`bg-white border rounded-2xl p-4 ${s === 'signed' ? 'border-emerald-300' : s === 'rejected' ? 'border-red-300 opacity-50' : 'border-stone-200'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center flex-shrink-0"><I className="w-5 h-5" /></div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-stone-500">{p.type}</div>
                    <div className="font-medium text-sm">{p.desc}</div>
                    {p.amount && <div className="font-display text-xl mt-1">{p.amount}</div>}
                  </div>
                </div>
                <div className="bg-stone-50 rounded-xl p-3 mb-3">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2">Signatures (2 required)</div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></div><span className="text-xs">{p.initiator}</span></div>
                    <div className="flex-1 h-px bg-stone-200" />
                    <div className="flex items-center gap-2"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${s === 'signed' ? 'bg-emerald-500 text-white' : 'border-2 border-dashed border-stone-300 text-stone-400'}`}>{s === 'signed' ? <Check className="w-3.5 h-3.5" /> : 'JW'}</div><span className="text-xs">You</span></div>
                  </div>
                </div>
                {!s && (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => reject(p.id)} className="py-3 rounded-xl border border-stone-200 text-sm font-medium">Reject</button>
                    <button onClick={() => sign(p.id)} className="py-3 rounded-xl bg-stone-900 text-white text-sm font-medium">Sign with Face ID</button>
                  </div>
                )}
                {s === 'signed' && <div className="text-center py-2 text-xs text-emerald-700 font-medium flex items-center justify-center gap-1"><CircleCheck className="w-4 h-4" /> Signed</div>}
                {s === 'rejected' && <div className="text-center py-2 text-xs text-red-700 font-medium">Rejected</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AuditScreen = () => {
    const events = [
      { time: '14:22', date: 'Today', who: 'James Whitfield', what: 'Signed · Bulk Payment £183,450', kind: 'sign' },
      { time: '12:14', date: 'Today', who: 'Sarah Chen', what: 'Initiated · Bulk Payment Oct Wages', kind: 'create' },
      { time: '09:08', date: 'Yesterday', who: 'Sarah Chen', what: 'Initiated · Mandate change', kind: 'create' },
      { time: '17:42', date: '29 Apr', who: 'Anita Roy', what: 'Signed · Mandate change', kind: 'sign' },
      { time: '11:30', date: '28 Apr', who: 'James Whitfield', what: 'Initiated · Account closure', kind: 'create' },
    ];
    return (
      <div className="pb-24">
        <div className="px-5 pt-3 pb-5">
          <div className="text-xs text-stone-500 uppercase tracking-wider">Immutable · 7 years</div>
          <h1 className="font-display text-4xl mt-1 leading-tight">Audit<br /><span className="italic font-light">trail</span></h1>
        </div>
        <div className="px-5">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
            {events.map((e, i) => (
              <div key={i} className={`p-4 flex gap-3 ${i !== events.length - 1 ? 'border-b border-stone-100' : ''}`}>
                <div className="text-right flex-shrink-0 w-16"><div className="font-mono text-xs">{e.time}</div><div className="text-[10px] text-stone-500 uppercase tracking-wider">{e.date}</div></div>
                <div className="w-2 flex-shrink-0"><div className={`w-2 h-2 rounded-full mt-1.5 ${e.kind === 'sign' ? 'bg-emerald-500' : 'bg-stone-900'}`} /></div>
                <div className="flex-1"><div className="text-sm">{e.what}</div><div className="text-xs text-stone-500 mt-0.5">{e.who}</div></div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-stone-500 leading-relaxed">Records retained 7 years per FCA SYSC 9.</div>
        </div>
      </div>
    );
  };

  // === STATEMENTS SCREEN — monthly view, categories, counterparty search ===
  // Payment method metadata — single source of truth for icon, label, colour
  const METHOD_META = {
    card: { label: 'Card', short: 'Card', icon: CreditCard, dot: 'bg-violet-500', tint: 'bg-violet-50 text-violet-700' },
    dd: { label: 'Direct Debit', short: 'DD', icon: RefreshCw, dot: 'bg-blue-500', tint: 'bg-blue-50 text-blue-700' },
    so: { label: 'Standing Order', short: 'SO', icon: Calendar, dot: 'bg-indigo-500', tint: 'bg-indigo-50 text-indigo-700' },
    fp: { label: 'Faster Payment', short: 'FP', icon: Zap, dot: 'bg-emerald-500', tint: 'bg-emerald-50 text-emerald-700' },
    bacs: { label: 'BACS', short: 'BACS', icon: Banknote, dot: 'bg-amber-500', tint: 'bg-amber-50 text-amber-700' },
    chaps: { label: 'CHAPS', short: 'CHAPS', icon: Building, dot: 'bg-stone-500', tint: 'bg-stone-100 text-stone-700' },
    transfer: { label: 'Transfer', short: 'Tx', icon: ArrowRight, dot: 'bg-stone-500', tint: 'bg-stone-100 text-stone-700' },
    cheque: { label: 'Cheque', short: 'Chq', icon: FileText, dot: 'bg-stone-500', tint: 'bg-stone-100 text-stone-700' },
  };
  const methodFor = (m) => METHOD_META[m] || METHOD_META.transfer;

  const StatementsScreen = () => {
    const monthsAvailable = Object.keys(transactionsByMonth).sort().reverse();
    const txns = transactionsByMonth[statementMonth] || [];

    // Sort chronologically within month (newest first)
    // Apply method filter when set
    const filteredTxns = methodFilter === 'all' ? txns : txns.filter(t => t.method === methodFilter);
    const sortedTxns = [...filteredTxns].sort((a, b) => b.date.localeCompare(a.date));

    return (
      <div className="pb-24">
        {/* Editorial header */}
        <div className="px-5 pt-4 pb-7 anim-fade">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-8 bg-[#c8102e]" />
            <div className="text-[10px] text-[#c8102e] uppercase tracking-[0.2em] font-medium">Statements & insights</div>
          </div>
          <h1 className="font-display-tight text-[44px] leading-[0.95] text-stone-900">
            Where the<br />
            <span className="italic font-light text-stone-800">money goes.</span>
          </h1>
          <p className="text-sm text-stone-600 mt-4 leading-relaxed max-w-md">Search by supplier, customer, or amount. See every payment, ever. Download for your accountant in one tap.</p>
        </div>

        {/* Search + Summary — side-by-side on desktop, stacked on mobile */}
        <div className="px-5 mb-5 anim-fade stagger-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Counterparty search */}
          <div className="rounded-2xl bg-white border border-stone-200 shadow-sm p-4 lift-1 lg:order-1">
            <div className="text-[10px] uppercase tracking-[0.15em] text-[#c8102e] font-medium mb-2">Search</div>
            <div className="relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={counterpartyQuery}
                onChange={e => setCounterpartyQuery(e.target.value)}
                placeholder="Try 'Adobe', 'BT', 'rates'…"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus-visible:border-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900/20 text-sm transition-colors"
              />
            </div>
            {counterpartyQuery.trim() && (
              <div className="mt-3 space-y-1.5">
                {searchResults.length === 0 && (
                  <div className="text-center py-4 text-sm text-stone-500">No matches for "{counterpartyQuery}"</div>
                )}
                {searchResults.slice(0, 5).map(r => {
                  // Compute primary payment method for this counterparty
                  const mb = r.transactions.reduce((acc, t) => { acc[t.method] = (acc[t.method] || 0) + 1; return acc; }, {});
                  const primary = Object.entries(mb).sort((a, b) => b[1] - a[1])[0]?.[0];
                  const meta = methodFor(primary);
                  const MIcon = meta.icon;
                  return (
                    <button key={r.name} onClick={() => setOpenCounterparty(r.name)}
                      className="w-full text-left p-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.tint}`}>
                        <MIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm text-stone-900">{r.name}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {r.count} {r.count === 1 ? 'payment' : 'payments'} · mostly {meta.label} · last {r.lastDate.slice(8, 10)}/{r.lastDate.slice(5, 7)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {r.totalOut > 0 && <div className="font-mono text-sm num-tab text-stone-900">{fmt(r.totalOut)}</div>}
                        {r.totalIn > 0 && <div className="font-mono text-sm num-tab text-emerald-700">+{fmt(r.totalIn)}</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Month summary — Santander red */}
          <div className="rounded-2xl santander-red-dark text-white p-5 relative overflow-hidden lift-1 lg:order-2">
            <div className="absolute inset-0 grain pointer-events-none opacity-50" />
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-baseline justify-between mb-3 gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.14em] text-white/70 font-medium">{currentMonthSummary.count} transactions</div>
                  <div className="font-display-tight text-xl text-white truncate">{monthLabel(statementMonth)}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="min-w-0 border-r border-white/15 pr-3">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-white/70 font-medium">In</div>
                  <div className="font-display-tight num-compact num-tab font-medium mt-1 text-white">{fmt(currentMonthSummary.inflows)}</div>
                </div>
                <div className="min-w-0 border-r border-white/15 pr-3">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-white/70 font-medium">Out</div>
                  <div className="font-display-tight num-compact num-tab font-medium mt-1 text-white">{fmt(currentMonthSummary.outflows)}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-white/70 font-medium">Net</div>
                  <div className={`font-display-tight num-compact num-tab font-medium mt-1 ${currentMonthSummary.net >= 0 ? 'text-white' : 'text-amber-200'}`}>
                    {currentMonthSummary.net >= 0 ? '+' : ''}{fmt(currentMonthSummary.net)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Month picker — single horizontal strip */}
        <div className="px-5 mb-4 anim-fade stagger-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-5 px-5">
            {monthsAvailable.map(m => (
              <button key={m} onClick={() => setStatementMonth(m)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors ${statementMonth === m ? 'bg-[#c8102e] text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>
                {monthLabel(m)}
              </button>
            ))}
          </div>
        </div>

        {/* List header — view toggle lives here for both chronological + category views */}
        <div className="px-5 mb-3 anim-fade stagger-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              <h2 className="font-display-tight text-xl text-stone-900">{monthLabel(statementMonth)}</h2>
              <span className="text-[11px] text-stone-500">· {currentMonthSummary.count} transactions</span>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setStatementView('chronological')}
                className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${statementView === 'chronological' ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>
                List
              </button>
              <button onClick={() => setStatementView('category')}
                className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full transition-colors ${statementView === 'category' ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>
                Categories
              </button>
            </div>
          </div>
        </div>

        {/* Chronological view */}
        {statementView === 'chronological' && (
          <div className="px-5 mb-6 anim-fade stagger-4">
            {/* Method filter row */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2 -mx-5 px-5">
              {[
                { id: 'all', label: 'All' },
                { id: 'card', label: 'Card' },
                { id: 'dd', label: 'Direct Debit' },
                { id: 'so', label: 'Standing Order' },
                { id: 'fp', label: 'Faster Payment' },
                { id: 'bacs', label: 'BACS' },
              ].map(f => {
                const active = methodFilter === f.id;
                return (
                  <button key={f.id} onClick={() => setMethodFilter(f.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap ${active ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden lift-1">
              {sortedTxns.length === 0 && (
                <div className="text-center py-8 text-sm text-stone-500">No {methodFor(methodFilter).label.toLowerCase()} payments this month</div>
              )}
              {sortedTxns.map(t => {
                const isOut = t.amount < 0;
                const method = methodFor(t.method);
                const MIcon = method.icon;
                return (
                  <button key={t.id} onClick={() => setOpenCounterparty(t.counterparty)}
                    className="w-full text-left p-3.5 flex items-center gap-3 hover:bg-stone-50 transition-colors">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${method.tint}`}>
                      <MIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-stone-900 truncate">{t.desc}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5 flex-wrap">
                        <span>{t.date.slice(8, 10)}/{t.date.slice(5, 7)}</span>
                        <span className="text-stone-300">·</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-medium ${method.tint}`}>{method.short}</span>
                        <span className="text-stone-300">·</span>
                        <span className="bg-stone-100 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider">{t.category}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`font-mono text-sm num-tab font-medium ${isOut ? 'text-stone-900' : 'text-emerald-700'}`}>
                        {isOut ? '' : '+'}{fmt(t.amount)}
                      </div>
                      {t.vat === null && <div className="text-[10px] text-amber-700 mt-0.5">VAT · review</div>}
                      {t.vat !== null && t.vat !== 0 && <div className="text-[10px] text-stone-400 mt-0.5">VAT {fmt(Math.abs(t.vat))}</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Category view */}
        {statementView === 'category' && (
          <div className="px-5 mb-6 anim-fade stagger-4">
            <div className="space-y-2">
              {currentMonthCategories.map(c => {
                const total = c.in + c.out;
                const isInflow = c.in > c.out;
                return (
                  <div key={c.name} className="bg-white border border-stone-200 rounded-2xl p-4 lift-1 relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-1 h-full ${isInflow ? 'bg-emerald-500' : 'red-accent-bar'}`} />
                    <div className="pl-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm text-stone-900">{c.name}</div>
                        <div className={`font-mono num-display num-tab font-medium ${isInflow ? 'text-emerald-700' : 'text-stone-900'}`}>
                          {isInflow ? '+' : ''}{fmt(isInflow ? c.in : c.out)}
                        </div>
                      </div>
                      <div className="text-[11px] text-stone-500">{c.count} {c.count === 1 ? 'transaction' : 'transactions'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top counterparties — appears below month view */}
        <div className="px-5 mb-6 anim-fade stagger-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-0.5">Year to date</div>
              <h2 className="font-display-tight text-2xl text-stone-900">Top counterparties</h2>
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden lift-1">
            {counterpartyStats.slice(0, 6).map(c => (
              <button key={c.name} onClick={() => setOpenCounterparty(c.name)}
                className="w-full text-left p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm text-stone-900">{c.name}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {c.count} {c.count === 1 ? 'payment' : 'payments'} · {c.category}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {c.totalOut > 0 && <div className="font-mono text-sm num-tab text-stone-900">{fmt(c.totalOut)}</div>}
                  {c.totalIn > 0 && <div className="font-mono text-sm num-tab text-emerald-700">+{fmt(c.totalIn)}</div>}
                </div>
                <ChevronRight className="w-4 h-4 text-stone-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Download row */}
        <div className="px-5 mb-3 anim-fade stagger-6">
          <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl santander-red text-white flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-stone-900">For your accountant</div>
                <div className="text-[11px] text-stone-500">Download {monthLabel(statementMonth)} statement</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button onClick={() => fireToast('PDF generated · sent to your downloads.')}
                className="py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-medium hover:bg-stone-50">PDF</button>
              <button onClick={() => fireToast('CSV generated · sent to your downloads.')}
                className="py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-medium hover:bg-stone-50">CSV</button>
              <button onClick={() => fireToast('Excel generated · sent to your downloads.')}
                className="py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-medium hover:bg-stone-50">Excel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // === OPEN BANKING CONSENT SHEET ===
  const PinSheet = () => {
    const card = BUSINESS_CARDS[pinCardKey];
    const isFrozen = frozenCards.has(pinCardKey);
    const r = 26;
    const circ = 2 * Math.PI * r;
    const pct = pinCountdown / 30;
    return (
      <div className="fixed inset-0 z-50 bg-black/40 anim-fade flex items-end" onClick={closePin}>
        <div onClick={e => e.stopPropagation()} className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto anim-slide">
          <div className="flex justify-center pt-3 pb-1"><div className="w-12 h-1 bg-stone-300 rounded-full" /></div>
          <div className="px-5 pb-4 border-b border-stone-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-stone-500">Card management</div>
              <h2 className="font-display text-2xl mt-0.5">{card.name}</h2>
            </div>
            <button onClick={closePin} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"><X className="w-4 h-4" /></button>
          </div>
          <div className="px-5 py-5 space-y-4">
            {/* Card visual */}
            <div className="w-full h-44 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white p-5 relative overflow-hidden">
              <div className="absolute -top-14 -right-14 w-52 h-52 rounded-full bg-white/[0.03] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#c8102e]/[0.12] pointer-events-none" />
              <div className="absolute top-4 right-5 flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#c8102e]/80" />
                <div className="w-8 h-8 rounded-full bg-[#c8102e] -ml-3.5 opacity-65" />
              </div>
              <div className="relative h-full flex flex-col justify-between">
                <div className="w-12 h-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 opacity-90" />
                <div>
                  <div className="font-mono text-[17px] tracking-[0.22em] mb-2">{card.last4}</div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/55 mb-0.5">Valid thru</div>
                      <div className="text-sm font-mono">{card.expiry}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="text-[9px] uppercase tracking-wider text-white/55">{card.network}</div>
                      {isFrozen && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/25 border border-blue-400/25 rounded-full">
                          <Snowflake className="w-3 h-3 text-blue-300" />
                          <span className="text-[9px] uppercase tracking-wider text-blue-300">Frozen</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Freeze toggle */}
            <div className={`flex items-center justify-between p-4 rounded-2xl border ${isFrozen ? 'bg-blue-50/40 border-blue-200' : 'bg-stone-50 border-stone-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isFrozen ? 'bg-blue-100 text-blue-600' : 'bg-stone-200 text-stone-600'}`}>
                  <Snowflake className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">{isFrozen ? 'Card frozen' : 'Freeze card'}</div>
                  <div className={`text-[11px] ${isFrozen ? 'text-blue-700' : 'text-stone-500'}`}>{isFrozen ? 'All transactions blocked · unfreeze instantly' : 'Blocks all transactions — instant, reversible'}</div>
                </div>
              </div>
              <Toggle value={isFrozen} onChange={(v) => {
                setFrozenCards(prev => { const n = new Set(prev); v ? n.add(pinCardKey) : n.delete(pinCardKey); return n; });
                fireToast(v ? `${card.name} frozen — all transactions blocked` : `${card.name} unfrozen — ready to use`);
              }} />
            </div>

            {/* PIN section */}
            {!pinAuthDone ? (
              <div className="space-y-3">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center mx-auto mb-3 lift-2">
                    <Fingerprint className="w-7 h-7" />
                  </div>
                  <div className="font-display text-lg text-stone-900 mb-1">View your PIN</div>
                  <div className="text-[11px] text-stone-500 leading-relaxed mb-4 max-w-xs mx-auto">Retrieved from a secure HSM after biometric verification. Never stored in the app or transmitted in cleartext.</div>
                  <button
                    onClick={() => { setPinAuthDone(true); setPinRevealed(true); setPinCountdown(30); }}
                    className="w-full bg-stone-900 text-white py-4 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 active:scale-[0.98] transition-transform"
                  >
                    <Fingerprint className="w-4 h-4" />
                    Authenticate with Face ID
                  </button>
                </div>
                <div className="text-[10px] text-stone-400 text-center">Viewing your PIN is logged in your security audit trail.</div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-4">Your PIN</div>
                  {pinRevealed ? (
                    <div className="flex items-center justify-center gap-2.5 mb-5">
                      {card.pin.split('').map((digit, i) => (
                        <div key={i} className="w-14 h-16 rounded-2xl bg-white border border-stone-200 lift-1 flex items-center justify-center font-display text-3xl text-stone-900 font-medium">{digit}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2.5 mb-5">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="w-14 h-16 rounded-2xl bg-stone-200 border border-stone-300 flex items-center justify-center">
                          <div className="w-3.5 h-3.5 rounded-full bg-stone-400" />
                        </div>
                      ))}
                    </div>
                  )}
                  {pinRevealed && (
                    <div className="flex flex-col items-center gap-1.5 mb-4">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 60 60">
                          <circle cx="30" cy="30" r={r} fill="none" stroke="#e7e5e4" strokeWidth="4" />
                          <circle cx="30" cy="30" r={r} fill="none" stroke="#c8102e" strokeWidth="4"
                            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-base font-bold text-stone-900 tabular-nums">{pinCountdown}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-stone-500">Hides in {pinCountdown}s</div>
                    </div>
                  )}
                  <button
                    onClick={() => { if (pinRevealed) { setPinRevealed(false); setPinCountdown(30); } else { setPinRevealed(true); setPinCountdown(30); } }}
                    className={`w-full py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 active:scale-[0.98] transition-transform ${pinRevealed ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-900'}`}
                  >
                    {pinRevealed ? <><EyeOff className="w-4 h-4" /> Hide PIN</> : <><Eye className="w-4 h-4" /> Show PIN again</>}
                  </button>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-900 leading-relaxed"><strong>Never share your PIN.</strong> Santander will never ask for it. If you've shared it, call us immediately: <strong>0330 123 9860</strong>.</div>
                </div>
                <div className="text-[10px] text-stone-400 text-center">PIN viewed today · logged to security audit trail</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const OBSheet = () => (
    <div className="fixed inset-0 z-50 bg-black/40 anim-fade flex items-end" onClick={() => setShowOBSheet(false)}>
      <div onClick={e => e.stopPropagation()} className="w-full bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto anim-slide">
        <div className="px-5 pt-3 pb-2 sticky top-0 bg-white border-b border-stone-100">
          <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl">Open banking consents</h2>
              <p className="text-xs text-stone-500 mt-0.5">Third-party apps with access to your accounts · PSD2</p>
            </div>
            <button onClick={() => setShowOBSheet(false)} className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"><X className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="px-5 py-5 space-y-4">
          {!obFCRevoked && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/50 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>1 consent exposes personal account data</strong> — Funding Circle has active read access to both business and personal accounts.
              </div>
            </div>
          )}
          <div className="space-y-3">
            {OB_CONSENTS.map(consent => {
              const isRevoked = consent.id === 'fc' && obFCRevoked;
              return (
                <div key={consent.id} className={`p-4 rounded-2xl border ${consent.exposesPersonal && !isRevoked ? 'border-amber-300 bg-amber-50/30' : 'border-stone-200 bg-white'}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="font-medium text-sm">{consent.app}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{consent.purpose}</div>
                    </div>
                    {consent.exposesPersonal && !isRevoked && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-medium flex-shrink-0">Personal exposed</span>
                    )}
                    {isRevoked && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-medium flex-shrink-0">Revoked</span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-600 mb-1">{consent.scope}</div>
                  <div className="text-[11px] text-stone-400 mb-3">Expires {consent.expires}</div>
                  {!isRevoked && (
                    <button
                      onClick={() => {
                        if (consent.id === 'fc') {
                          setObFCRevoked(true);
                          fireToast('Funding Circle access revoked');
                        }
                      }}
                      className="text-[11px] font-medium text-[#c8102e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8102e] rounded"
                    >
                      Revoke access
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="text-[11px] text-stone-500 leading-relaxed">
              <strong className="text-stone-700">PSD2 · Open Banking Standard.</strong> You can revoke any consent at any time. The third party must stop accessing your data within 90 seconds.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // === COUNTERPARTY DETAIL SHEET ===
  const CounterpartySheet = () => {
    if (!openCounterparty) return null;
    const stats = counterpartyStats.find(c => c.name === openCounterparty);
    if (!stats) return null;

    const sortedTxns = [...stats.transactions].sort((a, b) => b.date.localeCompare(a.date));
    const avgPayment = stats.totalOut > 0 ? stats.totalOut / stats.transactions.filter(t => t.amount < 0).length : stats.totalIn / stats.transactions.filter(t => t.amount > 0).length;

    // Method breakdown — count transactions per payment type
    const methodBreakdown = stats.transactions.reduce((acc, t) => {
      acc[t.method] = (acc[t.method] || 0) + 1;
      return acc;
    }, {});
    const methodEntries = Object.entries(methodBreakdown).sort((a, b) => b[1] - a[1]);
    const primaryMethod = methodEntries[0]?.[0];
    const isRecurring = primaryMethod === 'dd' || primaryMethod === 'so';

    return (
      <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center bg-black/40 backdrop-blur-sm" onClick={() => setOpenCounterparty(null)}>
        <div onClick={e => e.stopPropagation()}
          className="w-full md:max-w-2xl bg-white rounded-t-3xl md:rounded-3xl max-h-[88vh] overflow-y-auto anim-slide-up">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-stone-300" />
          </div>

          {/* Header */}
          <div className="px-5 pt-4 pb-5 border-b border-stone-100">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.18em] text-[#c8102e] font-medium mb-1">{stats.category}</div>
                <h2 className="font-display-tight text-2xl text-stone-900 truncate">{stats.name}</h2>
                <div className="text-[11px] text-stone-500 mt-1">
                  {stats.count} {stats.count === 1 ? 'transaction' : 'transactions'} · last {stats.lastDate.slice(8, 10)}/{stats.lastDate.slice(5, 7)}/{stats.lastDate.slice(0, 4)}
                </div>
              </div>
              <button onClick={() => setOpenCounterparty(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Method breakdown — moved up to sit immediately under headline */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {methodEntries.map(([m, count]) => {
                const meta = methodFor(m);
                const MIcon = meta.icon;
                return (
                  <div key={m} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${meta.tint}`}>
                    <MIcon className="w-3 h-3" />
                    <span className="text-[11px] font-medium">{count} × {meta.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Recurring payment notice */}
            {isRecurring && (
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-3 flex gap-2.5 mt-3">
                <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-blue-900 leading-relaxed flex-1">
                  <strong className="font-medium">Recurring payment.</strong> {primaryMethod === 'dd' ? 'You\'re protected by the Direct Debit Guarantee — if anything goes wrong, you get an immediate refund from us.' : 'A standing order pays a fixed amount on a fixed date. You can cancel anytime.'}
                  <button onClick={() => fireToast(`We'll send the ${primaryMethod === 'dd' ? 'cancellation instruction' : 'standing order cancellation'} now. Confirmation in your audit log.`)}
                    className="text-blue-700 font-medium underline mt-1 block">
                    Cancel this {primaryMethod === 'dd' ? 'direct debit' : 'standing order'}
                  </button>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <div className="bg-stone-50 rounded-xl p-3.5 min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-stone-500 font-medium">Total {stats.totalOut > 0 ? 'paid' : 'received'}</div>
                <div className={`font-display-tight num-compact num-tab font-medium mt-1 ${stats.totalOut > 0 ? 'text-stone-900' : 'text-emerald-700'}`}>
                  {fmt(stats.totalOut > 0 ? stats.totalOut : stats.totalIn)}
                </div>
              </div>
              <div className="bg-stone-50 rounded-xl p-3.5 min-w-0">
                <div className="text-[9px] uppercase tracking-wider text-stone-500 font-medium">Average</div>
                <div className="font-display-tight num-compact num-tab font-medium mt-1 text-stone-900">{fmt(avgPayment)}</div>
              </div>
            </div>
          </div>

          {/* Transaction list */}
          <div className="px-5 pt-4 pb-4">
            <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium mb-2">All payments</div>
            <div className="space-y-1.5">
              {sortedTxns.map(t => {
                const isOut = t.amount < 0;
                const meta = methodFor(t.method);
                const MIcon = meta.icon;
                return (
                  <div key={t.id} className="p-3 rounded-xl border border-stone-100 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.tint}`}>
                      <MIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[13px] text-stone-900 truncate">{t.desc}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                        <span>{t.date.slice(8, 10)}/{t.date.slice(5, 7)}/{t.date.slice(0, 4)}</span>
                        <span className="text-stone-300">·</span>
                        <span>{meta.label}</span>
                      </div>
                    </div>
                    <div className={`font-mono text-sm num-tab font-medium flex-shrink-0 ${isOut ? 'text-stone-900' : 'text-emerald-700'}`}>
                      {isOut ? '' : '+'}{fmt(t.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 pb-6 grid grid-cols-2 gap-2">
            <button onClick={() => fireToast(`${stats.name} report exported.`)}
              className="py-3 rounded-xl bg-white border border-stone-200 text-sm font-medium">Export history</button>
            <button onClick={() => fireToast(`${stats.name} added to favourites.`)}
              className="py-3 rounded-xl bg-stone-900 text-white text-sm font-medium">Pin to home</button>
          </div>
        </div>
      </div>
    );
  };

  // === MTD SCREEN — Making Tax Digital home ===
  const MTDScreen = () => (
    <div className="pb-24">
      {/* Editorial header */}
      <div className="px-5 pt-4 pb-7 anim-fade">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-8 bg-[#c8102e]" />
          <div className="text-[10px] text-[#c8102e] uppercase tracking-[0.2em] font-medium">HMRC · Making Tax Digital</div>
        </div>
        <h1 className="font-display-tight text-[44px] leading-[0.95] text-stone-900">
          Tax,<br />
          <span className="italic font-light text-stone-800">handled.</span>
        </h1>
        <p className="text-sm text-stone-600 mt-4 leading-relaxed max-w-md">Connected directly to HMRC. Your transactions categorised automatically. Quarterly submissions in three taps.</p>
      </div>

      {/* HMRC connection status */}
      <div className="px-5 mb-6 anim-fade stagger-1">
        <div className="rounded-2xl bg-gradient-to-br from-[#c8102e]/[0.04] via-stone-50 to-[#c8102e]/[0.06] border border-stone-200/80 p-4 lift-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full red-accent-bar" />
          <div className="relative flex items-center gap-3 pl-1">
            <div className="relative flex-shrink-0">
              <div className="w-11 h-11 rounded-2xl santander-red text-white flex items-center justify-center lift-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white anim-pulse-glow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.15em] text-[#c8102e] font-medium">Connected to HMRC · Live</div>
              <div className="font-medium text-[14px] text-stone-900 mt-0.5">{mtdData.softwareName}</div>
              <div className="font-mono text-[10px] text-stone-500 mt-0.5 truncate">VRN {mtdData.vrn} · UTR {mtdData.utr}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current VAT obligation — hero in Santander red */}
      {currentVATObligation && (
        <div className="px-5 mb-7 anim-fade stagger-2">
          <div className="flex items-end justify-between mb-3 gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#c8102e] font-medium mb-0.5">Due in {daysUntilDeadline} days</div>
              <h2 className="font-display-tight text-2xl text-stone-900">Your VAT return</h2>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 flex-shrink-0">{currentVATObligation.period}</span>
          </div>

          <div className="relative overflow-hidden rounded-3xl santander-red-dark text-white lift-hero">
            <div className="absolute inset-0 grain pointer-events-none opacity-60" />
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl anim-float" />
            <div className="absolute -bottom-32 -left-16 w-64 h-64 rounded-full bg-black/20 blur-3xl" />

            <div className="relative p-6">
              {/* Top row */}
              <div className="flex items-start justify-between mb-6 gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-medium">VAT due</div>
                  <div className="text-xs text-white/60 mt-0.5">to HMRC · 7 November</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] uppercase tracking-wider text-white/70 font-medium">{currentVATObligation.transactionCount} txns</div>
                  <div className="text-xs text-white/60 mt-0.5">{transactionsToReview} to review</div>
                </div>
              </div>

              {/* Hero number — fluid sizing prevents overflow */}
              <div className="font-display-tight num-hero num-tab font-medium text-white">{fmt(currentVATObligation.vatDue)}</div>

              {/* Box breakdown */}
              <div className="grid grid-cols-2 gap-2.5 mt-5 mb-5">
                <div className="bg-white/[0.1] backdrop-blur-sm rounded-2xl p-3 border border-white/[0.12] min-w-0">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-white/70 font-medium">Box 1 · Sales VAT</div>
                  <div className="font-mono text-[13px] mt-1 num-tab text-white truncate">{fmt(currentVATObligation.salesVat)}</div>
                </div>
                <div className="bg-white/[0.1] backdrop-blur-sm rounded-2xl p-3 border border-white/[0.12] min-w-0">
                  <div className="text-[9px] uppercase tracking-[0.12em] text-white/70 font-medium">Box 4 · Reclaim</div>
                  <div className="font-mono text-[13px] mt-1 num-tab text-white truncate">{fmt(currentVATObligation.purchasesVat)}</div>
                </div>
              </div>

              {/* CTA — white pill on red background */}
              <button onClick={() => { setWorkflow('mtd-submit'); setMtdQuarterStep(0); }} className="btn-primary w-full bg-white text-[#c8102e] py-3.5 rounded-2xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-stone-50">
                Review & submit to HMRC <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="px-5 mb-7 anim-fade stagger-3">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-0.5">From your transactions</div>
            <h2 className="font-display-tight text-2xl text-stone-900">Things to know</h2>
          </div>
        </div>
        <div className="space-y-2">
          {mtdData.insights.map(i => {
            const I = i.icon;
            const colorMap = {
              opportunity: { bg: 'bg-emerald-50/60 border-emerald-200/40', icon: 'bg-emerald-100 text-emerald-700' },
              warning: { bg: 'bg-amber-50/60 border-amber-200/40', icon: 'bg-amber-100 text-amber-700' },
              tip: { bg: 'bg-blue-50/60 border-blue-200/40', icon: 'bg-blue-100 text-blue-700' },
            };
            const c = colorMap[i.kind];
            return (
              <div key={i.id} className={`rounded-2xl border ${c.bg} p-4 flex items-start gap-3 lift-1`}>
                <div className={`w-10 h-10 rounded-2xl ${c.icon} flex items-center justify-center flex-shrink-0`}>
                  <I className="w-5 h-5" />
                </div>
                <div className="flex-1 text-sm text-stone-800 leading-relaxed pt-0.5">{i.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Year to date */}
      <div className="px-5 mb-7 anim-fade stagger-4">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-0.5">Tax year 2026/27</div>
            <h2 className="font-display-tight text-2xl text-stone-900">Year to date</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-3">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 lift-1 relative overflow-hidden min-w-0">
            <div className="absolute top-0 left-0 w-1 h-8 red-accent-bar rounded-r" />
            <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium">Sales</div>
            <div className="font-display-tight num-compact num-tab font-medium mt-1.5 text-stone-900">{fmt(mtdData.yearToDate.sales)}</div>
            <div className="text-[10px] text-emerald-700 mt-1 font-medium">↑ 18% vs last year</div>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 lift-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium">Purchases</div>
            <div className="font-display-tight num-compact num-tab font-medium mt-1.5 text-stone-900">{fmt(mtdData.yearToDate.purchases)}</div>
            <div className="text-[10px] text-stone-500 mt-1">VAT-eligible spend</div>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-2xl p-4 lift-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium">Profit (estimate)</div>
            <div className="font-display-tight num-compact num-tab font-medium mt-1.5 text-stone-900">{fmt(mtdData.yearToDate.profit)}</div>
            <div className="text-[10px] text-stone-500 mt-1">Before tax & adjustments</div>
          </div>
          <div className="santander-red-dark text-white rounded-2xl p-4 lift-1 relative overflow-hidden min-w-0">
            <div className="absolute inset-0 grain pointer-events-none opacity-40" />
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/70 font-medium">Tax owed (est.)</div>
              <div className="font-display-tight num-compact num-tab font-medium mt-1.5 text-white">{fmt(mtdData.yearToDate.taxLiabilityEstimate)}</div>
              <div className="text-[10px] text-white/70 mt-1">Set aside automatically</div>
            </div>
          </div>
        </div>
      </div>

      {/* Past obligations */}
      <div className="px-5 mb-7 anim-fade stagger-5">
        <div className="flex items-end justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-stone-500 font-medium mb-0.5">Submission history</div>
            <h2 className="font-display-tight text-2xl text-stone-900">Past returns</h2>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200/80 divide-y divide-stone-100/80 lift-1 overflow-hidden">
          {mtdData.obligations.filter(o => o.status === 'submitted').map((o, i) => (
            <div key={i} className="p-4 flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] uppercase tracking-[0.12em] px-1.5 py-0.5 rounded font-medium bg-[#c8102e] text-white">{o.kind}</span>
                  <span className="font-medium text-[14px] text-stone-900 truncate">{o.period}</span>
                </div>
                <div className="text-[11px] text-stone-500 mt-1">Submitted {o.submittedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
              </div>
              <div className="text-right flex-shrink-0">
                {o.vatDue && <div className="font-mono text-[13px] num-tab font-medium text-stone-900">{fmt(o.vatDue)}</div>}
                {o.incomeNet && <div className="font-mono text-[13px] num-tab font-medium text-stone-900">{fmt(o.incomeNet)}</div>}
                <div className="text-[9px] text-emerald-700 uppercase tracking-[0.1em] mt-0.5 font-medium">✓ Accepted</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 mb-7 anim-fade stagger-6">
        <div className="grid grid-cols-2 gap-2.5">
          <ActionTile icon={Tag} title="Categorise transactions" desc={`${transactionsToReview} need review`} onClick={() => { setWorkflow('mtd-submit'); setMtdQuarterStep(0); }} />
          <ActionTile icon={Calculator} title="Tax estimator" desc="Live profit & tax calc" onClick={() => fireToast('Tax estimator coming next quarter')} />
          <ActionTile icon={FileText} title="VAT records" desc="Digital, HMRC-compliant" onClick={() => fireToast('Records auto-stored for 6 years')} />
          <ActionTile icon={Award} title="Penalty status" desc="0 points · all on time" onClick={() => fireToast('No penalty points — keep it up')} />
        </div>
      </div>

      {/* HMRC compliance footer */}
      <div className="px-5 mb-3 anim-fade stagger-6">
        <div className="rounded-2xl bg-gradient-to-br from-[#c8102e]/[0.03] to-stone-50 border border-stone-200/60 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full red-accent-bar" />
          <div className="relative">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl santander-red text-white flex items-center justify-center flex-shrink-0 lift-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.15em] text-[#c8102e] font-medium">HMRC-recognised software</div>
                <div className="font-medium text-sm text-stone-900 mt-0.5">Fully MTD-compliant</div>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] text-stone-600 leading-relaxed pl-12">
              <div className="flex items-start gap-2"><Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" /><span>Digital records kept for 6 years per HMRC requirement</span></div>
              <div className="flex items-start gap-2"><Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" /><span>Digital links — no copy-paste between systems</span></div>
              <div className="flex items-start gap-2"><Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" /><span>{mtdData.apiVersion} · direct to HMRC</span></div>
              <div className="flex items-start gap-2"><Check className="w-3 h-3 text-emerald-600 flex-shrink-0 mt-0.5" /><span>Audit-ready · 7-year retention per FCA SYSC 9</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // === MTD QUARTERLY SUBMISSION FLOW ===
  const renderMtdSubmit = () => {
    const txs = mtdData.currentQuarter.transactions;
    const reviewedCount = Object.keys(mtdReviewedTransactions).length;
    const needsReview = txs.filter(t => t.confidence === 'low' || t.businessUse === null);
    const allReviewed = needsReview.every(t => mtdReviewedTransactions[t.id]);

    const next = () => {
      if (mtdQuarterStep === 3) {
        setPaymentPending({
          kind: 'hmrc',
          label: 'VAT return · Q3 Jul–Sep 2026',
          total: 4118,
          count: 0,
          countdown: 5,
        });
      } else setMtdQuarterStep(mtdQuarterStep + 1);
    };
    const back = () => mtdQuarterStep === 0 ? closeWorkflow() : setMtdQuarterStep(mtdQuarterStep - 1);

    const titles = ['Review transactions', 'Check the numbers', 'Final declaration', 'Submit to HMRC'];
    const subs = [
      `${needsReview.length} transactions need a quick check`,
      'These are the figures we\'ll send HMRC',
      'You\'re legally responsible for what we submit',
      'Direct submission via HMRC MTD API',
    ];

    return (
      <StepFrame
        title={titles[mtdQuarterStep]}
        sub={subs[mtdQuarterStep]}
        total={4} current={mtdQuarterStep} onBack={back} onNext={next}
        nextLabel={mtdQuarterStep === 3 ? 'Submit to HMRC' : 'Continue'}
        replaces={{ form: 'Manual VAT100 spreadsheet + bridging software', savings: 'Direct to HMRC · receipt in seconds · no portal log-in' }}
        nextDisabled={
          (mtdQuarterStep === 0 && !allReviewed) ||
          (mtdQuarterStep === 2 && !mtdConfirmDeclaration)
        }
      >
        {/* STEP 0: Categorise transactions */}
        {mtdQuarterStep === 0 && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 flex gap-3">
              <Sparkles className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong>We've auto-categorised {txs.length - needsReview.length} of {txs.length} transactions.</strong> Just confirm the {needsReview.length} we're unsure about — tap business or personal.
              </div>
            </div>
            <div className="space-y-2">
              {txs.map(t => {
                const reviewed = mtdReviewedTransactions[t.id];
                const isAuto = t.confidence === 'high' && t.businessUse !== null;
                const decision = reviewed || (t.businessUse === true ? 'business' : t.businessUse === false ? 'personal' : null);
                return (
                  <div key={t.id} className={`rounded-2xl border p-3 ${decision ? 'border-stone-200 bg-white' : 'border-amber-300 bg-amber-50/40'} lift-1`}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-stone-900">{t.desc}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-stone-500">{t.date}</span>
                          {t.vatRate > 0 && <span className="text-[9px] uppercase tracking-wider bg-stone-100 px-1.5 py-0.5 rounded">VAT {t.vatRate}%</span>}
                          {isAuto && <span className="text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5" />Auto</span>}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`font-mono text-sm num-tab ${t.amount > 0 ? 'text-emerald-700' : 'text-stone-900'}`}>{t.amount > 0 ? '+' : ''}{fmt(t.amount)}</div>
                        {t.vat !== 0 && <div className="text-[10px] text-stone-500 mt-0.5">VAT {fmt(Math.abs(t.vat))}</div>}
                      </div>
                    </div>
                    {!isAuto && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button onClick={() => setMtdReviewedTransactions({ ...mtdReviewedTransactions, [t.id]: 'business' })}
                          className={`py-2 rounded-xl text-xs font-medium border transition-all ${decision === 'business' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-700'}`}>
                          Business
                        </button>
                        <button onClick={() => setMtdReviewedTransactions({ ...mtdReviewedTransactions, [t.id]: 'personal' })}
                          className={`py-2 rounded-xl text-xs font-medium border transition-all ${decision === 'personal' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-700'}`}>
                          Personal
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 1: Numbers — VAT9 Box summary */}
        {mtdQuarterStep === 1 && (
          <div className="space-y-3">
            <div className="rounded-2xl santander-red-dark text-white p-5 relative overflow-hidden lift-hero">
              <div className="absolute inset-0 grain pointer-events-none opacity-50" />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/70 font-medium">VAT due to HMRC</div>
                <div className="font-display-tight num-hero num-tab font-medium mt-1 text-white">{fmt(currentVATObligation.vatDue)}</div>
                <div className="text-xs text-white/70 mt-3">Direct debit set for 7 November · we'll remind you 3 days before</div>
              </div>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl divide-y divide-stone-100 lift-1">
              {[
                { box: 'Box 1', label: 'VAT due on sales', value: currentVATObligation.salesVat },
                { box: 'Box 2', label: 'VAT due on EU acquisitions', value: 0 },
                { box: 'Box 3', label: 'Total VAT due', value: currentVATObligation.salesVat },
                { box: 'Box 4', label: 'VAT reclaimed on purchases', value: currentVATObligation.purchasesVat },
                { box: 'Box 5', label: 'Net VAT to pay HMRC', value: currentVATObligation.vatDue, hero: true },
                { box: 'Box 6', label: 'Total sales (excl. VAT)', value: currentVATObligation.salesNet },
                { box: 'Box 7', label: 'Total purchases (excl. VAT)', value: currentVATObligation.purchasesNet },
                { box: 'Box 8', label: 'EU goods supplied', value: 0 },
                { box: 'Box 9', label: 'EU goods acquired', value: 0 },
              ].map(b => (
                <div key={b.box} className={`p-3.5 flex items-center justify-between gap-3 relative ${b.hero ? 'bg-gradient-to-r from-[#c8102e]/[0.05] to-stone-50' : ''}`}>
                  {b.hero && <div className="absolute top-0 left-0 w-1 h-full red-accent-bar" />}
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className={`font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${b.hero ? 'bg-[#c8102e] text-white' : 'bg-stone-100 text-stone-500'}`}>{b.box}</span>
                    <span className={`text-[13px] truncate ${b.hero ? 'font-medium text-stone-900' : 'text-stone-700'}`}>{b.label}</span>
                  </div>
                  <span className={`font-mono num-tab flex-shrink-0 ${b.hero ? 'text-[15px] font-medium text-[#c8102e]' : 'text-[13px] text-stone-700'}`}>{fmt(b.value)}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-stone-50 border border-stone-200/60 p-3 text-[11px] text-stone-600 leading-relaxed flex gap-2">
              <Link2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-[#c8102e]" />
              <div>These figures are calculated automatically from your transactions via digital links. No copy-paste, no manual entry — meets HMRC's MTD requirements in full.</div>
            </div>
          </div>
        )}

        {/* STEP 2: Declaration */}
        {mtdQuarterStep === 2 && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-stone-900 text-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileSignature className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">HMRC declaration</span>
              </div>
              <div className="text-sm leading-relaxed">"I declare that the information given on this VAT return is true and complete to the best of my knowledge and belief. I understand that providing false information may result in penalties or prosecution."</div>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200/50 p-4 flex gap-3">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>You're legally responsible.</strong> Even though we calculate the figures, the legal responsibility for accuracy sits with you. Take a moment to check the numbers feel right before submitting.
              </div>
            </div>

            <label className="flex gap-3 p-4 rounded-2xl border border-stone-200 bg-white cursor-pointer">
              <input type="checkbox" checked={mtdConfirmDeclaration} onChange={e => setMtdConfirmDeclaration(e.target.checked)} className="mt-0.5 accent-[#c8102e] flex-shrink-0" />
              <span className="text-xs text-stone-700 leading-relaxed">I confirm the information is true and complete to the best of my knowledge, and I'm authorised to submit this VAT return for {entity.name}.</span>
            </label>

            <div className="rounded-xl bg-stone-50 p-3 text-[11px] text-stone-600 leading-relaxed">
              <strong className="text-stone-900">If you change your mind:</strong> you can amend a submitted VAT return for up to 4 years if errors are below £10,000 (net), or contact HMRC if larger. We'll keep all records for 6 years.
            </div>
          </div>
        )}

        {/* STEP 3: Submit */}
        {mtdQuarterStep === 3 && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-200/40 p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center mx-auto mb-3 lift-2">
                <Send className="w-7 h-7" />
              </div>
              <h3 className="font-display-tight text-2xl text-stone-900">Ready to submit</h3>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed max-w-xs mx-auto">We'll send this directly to HMRC and store the receipt in your audit log.</p>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 space-y-3 lift-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">Submitting to</span>
                <span className="text-sm font-medium">HMRC MTD VAT API</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">Period</span>
                <span className="text-sm font-medium">{currentVATObligation.period}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500">VAT amount</span>
                <span className="text-sm font-mono num-tab font-medium">{fmt(currentVATObligation.vatDue)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="text-xs text-stone-500">Direct debit</span>
                <span className="text-sm font-medium text-emerald-700">Auto · 7 Nov</span>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 leading-relaxed text-center px-4">By submitting, you'll receive an HMRC receipt number within 30 seconds. Your records stay digitally linked and audit-ready.</div>
          </div>
        )}
      </StepFrame>
    );
  };

  // === MAIN RENDER ===
  // Desktop wraps the same screens in sidebar + main + right rail.
  // Mobile keeps the bottom-nav layout. Same state, same workflows, two shells.

  if (viewMode === 'desktop') {
    return (
      <div className="min-h-screen page-bg font-body text-stone-900" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
        <style>{css}</style>

        <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
          <div className="red-bar h-1" />
          <div className="max-w-[1440px] mx-auto px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#c8102e] flex items-center justify-center"><div className="w-3.5 h-3.5 rounded-full border-2 border-white" /></div>
              <div>
                <div className="font-display text-lg leading-none">Santander Business</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-stone-500 mt-0.5">{entity.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-stone-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Synced
              </div>
              <button onClick={() => setViewMode('mobile')} className="text-[10px] uppercase tracking-wider text-stone-500 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
                Switch to mobile
              </button>
              <button onClick={() => setShowEntitySwitcher(true)} className="text-[10px] uppercase tracking-wider text-stone-500 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
                {entity.label}
              </button>
              <button className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center relative">
                <Bell className="w-4 h-4" />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#c8102e]" />
              </button>
              <button className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-stone-100">
                <div className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-medium">JW</div>
                <span className="text-sm font-medium">James Whitfield</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-8 py-8 grid grid-cols-12 gap-6">
          {/* Left sidebar */}
          <aside className="col-span-2">
            <nav className="sticky top-24 space-y-1">
              {[
                { id: 'home', label: 'Overview', icon: Home },
                { id: 'approve', label: 'Awaiting signature', icon: FileSignature, badge: pendingApprovals.filter(p => !approvalState[p.id]).length },
                { id: 'statements', label: 'Statements', icon: BookOpen },
                { id: 'mtd', label: 'Tax · MTD', icon: Receipt, badge: transactionsToReview > 0 ? transactionsToReview : null },
                { id: 'audit', label: 'Audit trail', icon: Lock },
              ].map(t => {
                const I = t.icon; const active = tab === t.id;
                return (
                  <button key={t.id} onClick={() => setTab(t.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? 'bg-stone-900 text-white' : 'hover:bg-stone-100 text-stone-700'}`}>
                    <I className="w-4 h-4" />
                    <span className="flex-1 text-left">{t.label}</span>
                    {t.badge > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-[#c8102e] text-white'}`}>{t.badge}</span>}
                  </button>
                );
              })}
              <div className="border-t border-stone-200 my-3" />
              <div className="text-[10px] uppercase tracking-wider text-stone-500 px-3 mb-2">Quick actions</div>
              {[
                { id: 'wages', label: 'Bulk payments', icon: Banknote },
                { id: 'mandate', label: 'Change mandate', icon: Users },
                { id: 'biz', label: 'Business details', icon: Briefcase },
                { id: 'idcheck', label: 'ID register', icon: UserCheck },
                { id: 'closure', label: 'Close account', icon: Archive },
                { id: 'dormancy', label: 'Dormant accounts', icon: Pause },
              ].map(t => {
                const I = t.icon;
                return (
                  <button key={t.id} onClick={() => { setWorkflow(t.id); setStep(0); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-stone-100 text-stone-700">
                    <I className="w-4 h-4 text-stone-500" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
              <div className="pt-4 mt-4 border-t border-stone-200">
                <button onClick={() => setShowSavings(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-stone-100 text-stone-700">
                  <MailX className="w-4 h-4 text-stone-500" />
                  <span>Paperwork retired</span>
                </button>
                <button onClick={() => setShowCompliance(true)} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-stone-100 text-stone-700">
                  <Scale className="w-4 h-4 text-stone-500" />
                  <span>Your rights</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Centre: main content — same screens as mobile */}
          <main className={tab === 'statements' || tab === 'mtd' ? "col-span-10" : "col-span-7"}>
            <div className="max-w-2xl mx-auto">
              {tab === 'home' && <HomeScreen />}
              {tab === 'approve' && <ApproveScreen />}
              {tab === 'audit' && <AuditScreen />}
              {tab === 'mtd' && <MTDScreen />}
              {tab === 'statements' && <StatementsScreen />}
            </div>
          </main>

          {/* Right rail: live activity — hidden on financial tabs to give content full room */}
          {tab !== 'statements' && tab !== 'mtd' && (
          <aside className="col-span-3">
            <div className="sticky top-24 space-y-4">
              {cooling.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 px-1">Just a moment to think</div>
                  <div className="space-y-2">
                    {cooling.map(c => {
                      const total = 24 * 3600 * 1000;
                      const elapsed = Date.now() - (c.executesAt - total);
                      const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
                      return (
                        <div key={c.id} className="bg-white border border-amber-200 rounded-xl p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <Clock className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium">{c.desc}</div>
                              <div className="text-[10px] text-stone-500 mt-0.5">{formatExecuteTime(c.executesAt)}</div>
                            </div>
                          </div>
                          <div className="mb-2 h-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${pct}%` }} />
                          </div>
                          <button onClick={() => requestCancel(c.id)} className="w-full py-1.5 rounded-lg border border-stone-200 text-[11px] font-medium hover:bg-stone-50">Cancel</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {stalled.length > 0 && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-2 px-1">Priya's on it</div>
                  <div className="space-y-2">
                    {stalled.map(s => (
                      <div key={s.id} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <Headphones className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-blue-900">{s.desc}</div>
                            <div className="text-[10px] text-blue-900/70 mt-0.5">She'll reach out today</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Demo controls */}
              <div className="bg-stone-100 rounded-xl p-3 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-stone-500">Demo controls</div>
                <button onClick={() => startCooling({ type: 'Account closure', desc: 'Trading account ····2841', kind: 'closure' })}
                  className="w-full py-2 rounded-lg bg-white border border-stone-200 text-[11px] font-medium hover:bg-stone-50 text-stone-700">
                  Trigger cooling-off
                </button>
                <button onClick={() => stallRequest({ type: 'Mandate change', desc: 'Add Mark Patel · partner missed window' })}
                  className="w-full py-2 rounded-lg bg-white border border-stone-200 text-[11px] font-medium hover:bg-stone-50 text-stone-700">
                  Simulate timeout
                </button>
              </div>

              {/* Accessibility */}
              <div className="p-3 rounded-xl bg-stone-50 text-[10px] text-stone-600 leading-relaxed flex gap-2">
                <Heart className="w-3.5 h-3.5 text-[#c8102e] flex-shrink-0 mt-0.5" />
                <div>Large print, braille, audio, BSL video relay, Relay UK — we offer them all.</div>
              </div>

              {/* Motto */}
              <div className="text-center pt-2">
                <p className="text-[10px] text-stone-400 italic font-display">A digital bank with a personal touch</p>
              </div>

              {/* Attribution */}
              <div className="text-center pt-3 border-t border-stone-100 mt-3 space-y-0.5">
                <p className="text-[9px] text-stone-400">
                  Concept &amp; prototype by <span className="font-medium text-stone-500">Alan Davidson</span>
                </p>
                <p className="text-[9px] text-stone-300">Alan.Davidson@santander.co.uk</p>
              </div>
            </div>
          </aside>
          )}
        </div>

        {/* Workflow overlays — same as mobile, render full-screen */}
        {workflow === 'closure' && renderClosure()}
        {workflow === 'biz' && renderBiz()}
        {workflow === 'mandate' && renderMandate()}
        {workflow === 'wages' && renderWages()}
        {workflow === 'dormancy' && renderDormancy()}
        {workflow === 'unlink' && renderUnlink()}
        {workflow === 'ringfence' && renderRingfence()}
        {workflow === 'idcheck' && renderIdCheck()}
      {workflow === 'mtd-submit' && renderMtdSubmit()}

        {showCompliance && <ComplianceSheet />}
        {showSavings && <SavingsSheet />}
        {showRMSheet && <RMSheet />}
        {showEntitySwitcher && <EntitySheet />}
        {pendingCancelId && <CancelSheet />}
        {showPinSheet && <PinSheet />}
        {showOBSheet && <OBSheet />}

        {/* ── Payment / HMRC cool-off overlay ── */}
        {paymentPending && (() => {
          const maxCountdown = paymentPending.kind === 'hmrc' ? 5 : 10;
          const pct = paymentPending.countdown / maxCountdown;
          const r = 42;
          const circ = 2 * Math.PI * r;
          const isHmrc = paymentPending.kind === 'hmrc';
          return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/75 backdrop-blur-sm anim-fade">
              <div className="bg-white rounded-3xl p-8 mx-5 max-w-xs w-full shadow-2xl text-center">
                {/* Ring countdown */}
                <div className="relative w-24 h-24 mx-auto mb-5">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r={r} fill="none" stroke="#e7e5e4" strokeWidth="7" />
                    <circle cx="48" cy="48" r={r} fill="none" stroke="#c8102e" strokeWidth="7"
                      strokeDasharray={circ}
                      strokeDashoffset={circ * (1 - pct)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-stone-900 tabular-nums">{paymentPending.countdown}</span>
                  </div>
                </div>

                {/* Title */}
                <div className="text-xs uppercase tracking-widest text-stone-400 mb-1">
                  {isHmrc ? 'Submitting to HMRC' : 'Sending payment'}
                </div>
                <div className="font-display text-2xl text-stone-900 leading-tight mb-1">
                  {isHmrc ? 'One last chance to stop' : 'Check the details'}
                </div>
                <div className="text-sm text-stone-500 mb-1">{paymentPending.label}</div>
                {paymentPending.total > 0 && (
                  <div className="font-mono text-xl font-semibold text-stone-900 num-tab mb-5">
                    {fmt(paymentPending.total)}
                  </div>
                )}

                {/* Warning */}
                <div className={`rounded-2xl p-3 mb-5 text-xs leading-relaxed ${isHmrc ? 'bg-amber-50 text-amber-800' : 'bg-stone-50 text-stone-600'}`}>
                  {isHmrc
                    ? 'Once submitted, this return is lodged with HMRC and cannot be amended through this app. Contact HMRC directly to correct a filed return.'
                    : 'Money moves when the countdown ends. Cancel now if you have spotted a wrong account or amount.'}
                </div>

                {/* Cancel */}
                <button
                  onClick={() => {
                    setPaymentPending(null);
                    fireToast(isHmrc ? 'HMRC submission cancelled — nothing was sent.' : 'Payment cancelled — nothing was sent.');
                  }}
                  className="w-full bg-[#c8102e] text-white py-4 rounded-2xl font-medium text-sm active:scale-[0.98] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                >
                  Cancel — go back
                </button>
                <div className="mt-3 text-[11px] text-stone-400">
                  Sending automatically in {paymentPending.countdown}s
                </div>
              </div>
            </div>
          );
        })()}
        {openCounterparty && <CounterpartySheet />}

        {toast && (
          <div className="fixed bottom-8 right-8 z-50 anim-fade max-w-md">
            <div className="toast-card text-white px-5 py-3.5 rounded-2xl flex items-center gap-3">
              <CircleCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-sm">{toast}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile shell (default)
  return (
    <div className="min-h-screen page-bg font-body text-stone-900" style={{ fontFamily: "'Geist', system-ui, sans-serif" }}>
      <style>{css}</style>

      <header className="sticky top-0 z-30 bg-[#faf6ef]/85 backdrop-blur-xl border-b border-stone-200/60">
        <div className="red-bar h-1" />
        <div className="px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#c8102e] flex items-center justify-center"><div className="w-3 h-3 rounded-full border-2 border-white" /></div>
            <div>
              <div className="font-display text-base leading-none">Santander</div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-stone-500">{entity.isTreasurer ? 'Treasurer · ' : 'Business · '}{entity.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 px-2 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-stone-500">Live</span>
            </div>
            <button onClick={() => setViewMode('desktop')} className="text-[9px] uppercase tracking-wider text-stone-500 px-2 py-1 rounded-full bg-stone-100">Desktop</button>
            <button className="w-9 h-9 rounded-full hover:bg-stone-100 flex items-center justify-center relative">
              <Bell className="w-4 h-4" />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#c8102e]" />
            </button>
            <button className="w-9 h-9 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-medium">JW</button>
          </div>
        </div>
      </header>

      <main>
        {tab === 'home' && <HomeScreen />}
        {tab === 'approve' && <ApproveScreen />}
        {tab === 'audit' && <AuditScreen />}
        {tab === 'mtd' && <MTDScreen />}
        {tab === 'statements' && <StatementsScreen />}
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/85 backdrop-blur-2xl border-t border-stone-200/60">
        <div className="grid grid-cols-5 max-w-md mx-auto">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'approve', label: 'Sign', icon: FileSignature, badge: pendingApprovals.filter(p => !approvalState[p.id]).length },
            { id: 'statements', label: 'Money', icon: BookOpen },
            { id: 'mtd', label: 'Tax', icon: Receipt, badge: transactionsToReview > 0 ? transactionsToReview : null },
            { id: 'audit', label: 'Audit', icon: Lock },
          ].map(t => {
            const I = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} className="py-3 flex flex-col items-center gap-1 relative">
                <div className="relative">
                  <I className={`w-5 h-5 ${active ? 'text-[#c8102e]' : 'text-stone-500'}`} />
                  {t.badge > 0 && <div className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 rounded-full bg-[#c8102e] text-white text-[9px] flex items-center justify-center font-medium">{t.badge}</div>}
                </div>
                <div className={`text-[10px] uppercase tracking-wider ${active ? 'text-stone-900 font-medium' : 'text-stone-500'}`}>{t.label}</div>
                {active && <div className="absolute top-0 inset-x-6 h-0.5 bg-[#c8102e] rounded-full" />}
              </button>
            );
          })}
        </div>
      </nav>

      {workflow === 'closure' && renderClosure()}
      {workflow === 'biz' && renderBiz()}
      {workflow === 'mandate' && renderMandate()}
      {workflow === 'wages' && renderWages()}
      {workflow === 'dormancy' && renderDormancy()}
      {workflow === 'unlink' && renderUnlink()}
      {workflow === 'ringfence' && renderRingfence()}
      {workflow === 'idcheck' && renderIdCheck()}
      {workflow === 'mtd-submit' && renderMtdSubmit()}

      {showCompliance && <ComplianceSheet />}
      {showSavings && <SavingsSheet />}
      {showRMSheet && <RMSheet />}
      {showEntitySwitcher && <EntitySheet />}
      {pendingCancelId && <CancelSheet />}
      {showOBSheet && <OBSheet />}
      {openCounterparty && <CounterpartySheet />}

      {toast && (
        <div className="fixed bottom-24 inset-x-5 z-50 anim-fade">
          <div className="toast-card text-white px-5 py-3.5 rounded-2xl flex items-center gap-3">
            <CircleCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div className="text-sm">{toast}</div>
          </div>
        </div>
      )}
    </div>
  );
}
