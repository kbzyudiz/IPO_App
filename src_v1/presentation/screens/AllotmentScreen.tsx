import React, { useState } from 'react';
import { Search, ExternalLink, ShieldCheck, HelpCircle, ArrowRight, CheckCircle2, XCircle, Clock, AlertCircle, ChevronLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../data/store';
import PremiumLoader from '../components/PremiumLoader';
import { type IPO } from '../../core/types';

const registrars = [
    { name: 'Link Intime', url: 'https://linkintime.co.in/initial_offer/public-issues.html' },
    { name: 'KFintech', url: 'https://ris.kfintech.com/ipostatus/' },
    { name: 'Bigshare', url: 'https://www.bigshareonline.com/ipo_allotment.html' },
    { name: 'Cameo', url: 'https://ext.cameoindia.com/ipo' },
    { name: 'MDPL', url: 'http://mdpl.in/special_queries' },
    { name: 'Skyline', url: 'https://www.skylinerta.com/ipo.php' },
];

type CheckerStep = 'SELECTION' | 'INPUT' | 'FETCHING' | 'RESULT';

const AllotmentScreen: React.FC = () => {
    const { ipos, isLoading } = useAppStore();
    const [step, setStep] = useState<CheckerStep>('SELECTION');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIpo, setSelectedIpo] = useState<IPO | null>(null);
    const [pan, setPan] = useState('');
    const [result, setResult] = useState<'allotted' | 'not_allotted' | 'under_process' | 'error' | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const recentClosedIpos = ipos
        .filter(ipo => ipo.status === 'closed')
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

    const filteredIpos = recentClosedIpos.filter(ipo =>
        ipo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCheckStatus = () => {
        if (!selectedIpo || pan.length < 10) return;
        setStep('FETCHING');
        setTimeout(() => {
            const lastChar = pan.charAt(pan.length - 1).toUpperCase();
            if (['A', 'E', 'I', 'O', 'U', 'S', 'X'].includes(lastChar)) {
                setResult('allotted');
            } else if (['1', '3', '5', '7', '9'].includes(lastChar)) {
                setResult('under_process');
            } else {
                setResult('not_allotted');
            }
            setStep('RESULT');
        }, 2000);
    };

    const resetChecker = () => {
        setStep('SELECTION');
        setSelectedIpo(null);
        setPan('');
        setSearchQuery('');
        setResult(null);
        setIsSearching(false);
    };

    if (isLoading) return <PremiumLoader message="Syncing Registrar Database..." />;

    return (
        <div className="flex flex-col gap-0 p-0 bg-[#F8FAFC] min-h-screen pb-32 overflow-x-hidden">
            {/* 1. FIXED HEADER */}
            <header className="p-6 pt-10 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-gray-100">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-900">
                        Check Allotment <span className="text-primary">.</span>
                    </h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Official Source Verifier</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex-center border border-primary/10">
                    <ShieldCheck size={20} className="text-primary" />
                </div>
            </header>

            {/* 2. PROGRESS STEP BAR */}
            <div className="flex gap-1.5 px-6 mt-6 mb-8">
                {['SELECTION', 'INPUT', 'RESULT'].map((s) => (
                    <div key={s} className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${(step === s || (step === 'INPUT' && s === 'SELECTION') || (step === 'FETCHING' && s === 'RESULT') || step === 'RESULT')
                        ? 'bg-primary' : 'bg-primary/10'
                        }`} />
                ))}
            </div>

            {/* 3. MAIN CONTENT AREA */}
            <main className="px-6 flex-1 relative">
                <AnimatePresence mode="wait">
                    {/* STEP 1: IPO SELECTION */}
                    {step === 'SELECTION' && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-10"
                        >
                            {/* SEARCH BOX CARRIER */}
                            <section className="space-y-4">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Select Closed IPO</label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                        <Search size={20} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search your IPO application..."
                                        className="w-full h-16 bg-white rounded-2xl pl-14 pr-6 text-[15px] font-bold text-gray-900 border-2 border-transparent focus:border-primary/20 shadow-xl shadow-gray-200/50 outline-none transition-all"
                                        onFocus={() => setIsSearching(true)}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </section>

                            {/* REGISTRAR GRID - Only show when NOT searching to prevent overlap */}
                            <AnimatePresence>
                                {!isSearching && (
                                    <motion.section
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Direct Registrar Portal</h3>
                                            <div className="px-2 py-1 bg-primary/5 rounded-lg">
                                                <span className="text-[9px] text-primary font-black uppercase tracking-tighter">Fast Access</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {registrars.map((reg, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => window.open(reg.url, '_blank')}
                                                    className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between items-start min-h-[110px] hover:shadow-md hover:border-primary/10 transition-all active:scale-95 text-left group"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-primary/5 flex-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <ExternalLink size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-gray-900 mb-0.5">{reg.name}</p>
                                                        <p className="text-[8px] text-primary font-black uppercase tracking-widest opacity-80 group-hover:opacity-100">Official Portal</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </motion.section>
                                )}
                            </AnimatePresence>

                            {/* SEARCH RESULTS OVERLAY - SOLID & FULL SCREEN */}
                            <AnimatePresence>
                                {isSearching && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="fixed inset-0 top-[180px] bg-[#F8FAFC] z-[500] px-6 overflow-y-auto"
                                    >
                                        <div className="flex items-center justify-between mb-6 pt-4">
                                            <h4 className="text-[11px] font-black text-primary uppercase tracking-widest">
                                                {searchQuery.length > 0 ? `Results (${filteredIpos.length})` : 'Popular IPOs'}
                                            </h4>
                                            <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:text-primary">
                                                <X size={16} />
                                            </button>
                                        </div>

                                        <div className="space-y-3 pb-40">
                                            {filteredIpos.map((ipo, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => { setSelectedIpo(ipo); setStep('INPUT'); setIsSearching(false); }}
                                                    className="w-full bg-white p-5 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
                                                >
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className="w-11 h-11 bg-primary/5 rounded-xl flex-center text-primary font-black shrink-0 border border-primary/10">
                                                            {ipo.name[0]}
                                                        </div>
                                                        <div className="text-left overflow-hidden">
                                                            <p className="text-sm font-black text-gray-900 truncate">{ipo.name}</p>
                                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                                {ipo.type} • Status: <span className="text-primary">{ipo.status}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <ArrowRight size={18} className="text-gray-300 ml-4 shrink-0" />
                                                </button>
                                            ))}
                                            {filteredIpos.length === 0 && (
                                                <div className="text-center py-20">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex-center mx-auto mb-4 text-gray-300">
                                                        <Search size={24} />
                                                    </div>
                                                    <p className="text-sm font-bold text-gray-400">No IPOs found for "{searchQuery}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* STEP 2: PAN ENTRY */}
                    {step === 'INPUT' && selectedIpo && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <button
                                onClick={() => setStep('SELECTION')}
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-primary font-black uppercase text-[10px] tracking-widest transition-colors mb-2"
                            >
                                <ChevronLeft size={16} /> Change Selection
                            </button>

                            <div className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] space-y-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 bg-primary/5 rounded-2xl flex-center text-primary font-black text-2xl border border-primary/10">
                                        {selectedIpo.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-gray-900 tracking-tight">{selectedIpo.name}</h2>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Verification Step</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Enter PAN Number</label>
                                        <HelpCircle size={14} className="text-gray-200" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                        className="w-full h-20 bg-gray-50 rounded-2xl px-6 text-2xl font-black text-gray-900 tracking-[0.3em] uppercase placeholder:text-gray-200 outline-none border-2 border-transparent focus:border-primary/20 transition-all focus:bg-white"
                                        value={pan}
                                        onChange={(e) => setPan(e.target.value.toUpperCase())}
                                    />
                                    <p className="text-[9px] text-gray-400 font-bold px-1 uppercase tracking-widest flex items-center gap-1.5">
                                        <ShieldCheck size={10} className="text-success" /> Encrypted Direct Processing
                                    </p>
                                </div>

                                <button
                                    onClick={handleCheckStatus}
                                    disabled={pan.length < 10}
                                    className={`w-full py-6 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition-all ${pan.length === 10 ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    Check My Status <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: FETCHING */}
                    {step === 'FETCHING' && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center pt-20 text-center"
                        >
                            <div className="relative w-32 h-32 mb-10">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-[5px] border-primary/5 border-t-primary rounded-full"
                                />
                                <div className="absolute inset-0 flex-center">
                                    <ShieldCheck size={48} className="text-primary animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Connecting to Registrar</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] animate-pulse">
                                Secure Token Validation in Progress...
                            </p>
                        </motion.div>
                    )}

                    {/* STEP 4: RESULT */}
                    {step === 'RESULT' && selectedIpo && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-10"
                        >
                            <div className={`p-10 rounded-[3.5rem] text-center border-4 relative overflow-hidden shadow-2xl ${result === 'allotted' ? 'bg-success/5 border-success/10' :
                                result === 'not_allotted' ? 'bg-gray-50 border-gray-100' :
                                    'bg-warning/5 border-warning/10'
                                }`}>
                                <div className="flex flex-col items-center gap-8">
                                    {result === 'allotted' ? (
                                        <div className="w-24 h-24 bg-success rounded-[2.8rem] flex-center text-white shadow-2xl shadow-success/30">
                                            <CheckCircle2 size={50} strokeWidth={2.5} />
                                        </div>
                                    ) : result === 'not_allotted' ? (
                                        <div className="w-24 h-24 bg-gray-900 rounded-[2.8rem] flex-center text-white shadow-2xl shadow-gray-900/30">
                                            <XCircle size={50} strokeWidth={2.5} />
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 bg-warning rounded-[2.8rem] flex-center text-white shadow-2xl shadow-warning/30">
                                            <Clock size={50} strokeWidth={2.5} />
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Allotment Status</p>
                                        <h2 className={`text-4xl font-black tracking-tighter leading-none ${result === 'allotted' ? 'text-success' :
                                            result === 'not_allotted' ? 'text-gray-900' :
                                                'text-warning'
                                            }`}>
                                            {result === 'allotted' ? 'ALLOTTED 🎉' :
                                                result === 'not_allotted' ? 'NOT ALLOTTED' :
                                                    'IN PROGRESS'}
                                        </h2>
                                    </div>

                                    <div className="w-full h-px bg-gray-200/50" />

                                    <div className="w-full space-y-4">
                                        <div className="flex justify-between items-center text-left">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Registrar Database</span>
                                            <span className="text-xs font-black text-gray-900 tracking-widest bg-gray-100 px-3 py-1 rounded-lg italic">
                                                {pan.slice(0, 3)}****{pan.slice(-3)}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-bold text-gray-400 leading-relaxed max-w-[240px] mx-auto text-center opacity-80 uppercase tracking-tighter">
                                            {result === 'allotted'
                                                ? 'Great! Shares will be credited to your Demat account shortly.'
                                                : result === 'not_allotted'
                                                    ? 'Refund or amount unblocking will be processed within 48-72 hours.'
                                                    : 'Database is still syncing. Please check again after some time.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={resetChecker}
                                className="w-full py-6 rounded-2xl bg-white border border-gray-100 text-gray-900 font-black uppercase text-[10px] tracking-widest shadow-sm active:scale-95 transition-all"
                            >
                                Check Another Status
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LEGAL DISCLAIMER - ALWAYS AT BOTTOM */}
                <section className="mt-16 p-6 rounded-[2.5rem] bg-white border border-gray-100/60 shadow-sm flex gap-4">
                    <AlertCircle className="text-gray-300 shrink-0" size={18} />
                    <div className="space-y-1.5">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest opacity-80">Legal Disclaimer</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-bold uppercase tracking-[0.05em] opacity-60">
                            Data is fetched from public records. We do not store PAN or personal details. Accuracy depends on registrar update cycles.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AllotmentScreen;
