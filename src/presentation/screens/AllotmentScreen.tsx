import { useState, useEffect } from 'react';
import { useAppStore } from '../../data/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, Clock, Radio, CheckCircle, Wallet } from 'lucide-react';
import { RegistrarService } from '../../services/RegistrarService';

const AllotmentScreen = () => {
    const { ipos } = useAppStore();
    const [search, setSearch] = useState('');
    const [userPan, setUserPan] = useState('');
    const [panCopied, setPanCopied] = useState(false);

    // Load PAN from storage
    useEffect(() => {
        const savedPan = localStorage.getItem('USER_PAN');
        if (savedPan) setUserPan(savedPan);
    }, []);

    const handleSavePan = (val: string) => {
        const upVal = val.toUpperCase().slice(0, 10);
        setUserPan(upVal);
        localStorage.setItem('USER_PAN', upVal);
    };

    const handleCheckStatus = (registrarName: string) => {
        // Copy PAN if available
        if (userPan.length === 10) {
            navigator.clipboard.writeText(userPan);
            setPanCopied(true);
            setTimeout(() => setPanCopied(false), 2000);
        }

        const registrarInfo = RegistrarService.identifyRegistrar(registrarName);
        window.open(registrarInfo.url, '_blank');
    };

    const closedIpos = ipos
        .filter(i => i.status === 'closed')
        .filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.symbol.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());

    return (
        <div className="pb-32 bg-[#030305] min-h-screen font-outfit px-1">
            <header className="mb-6 pt-4">
                <h1 className="text-2xl font-black tracking-tighter text-white">
                    Check <span className="text-indigo-500">Allotment</span>
                </h1>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Official Registrar Portals</p>
            </header>

            {/* PAN Input Section */}
            <div className="mb-6 p-4 glass-card rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                        <Wallet size={12} /> Your PAN Number (Auto-Copy)
                    </label>
                    {panCopied && (
                        <motion.span
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[9px] font-bold text-emerald-400 flex items-center gap-1"
                        >
                            <CheckCircle size={10} /> Copied!
                        </motion.span>
                    )}
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={userPan}
                        onChange={(e) => handleSavePan(e.target.value)}
                        placeholder="ABCDE1234F"
                        className="w-full bg-[#030305]/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-black text-white tracking-widest placeholder-gray-700 outline-none focus:border-indigo-500/50 transition-all uppercase"
                        maxLength={10}
                    />
                    {userPan.length === 10 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                            <CheckCircle size={14} />
                        </div>
                    )}
                </div>
            </div>

            {/* Simplistic Search */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
                <Search size={16} className="text-gray-600" />
                <input
                    type="text"
                    placeholder="Find your IPO..."
                    className="bg-transparent border-none outline-none text-white w-full placeholder-gray-700 font-bold text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {closedIpos.length > 0 ? (
                        closedIpos.map((ipo, idx) => (
                            <motion.div
                                key={ipo.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all group"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-10 h-10 bg-white/5 rounded-xl p-2 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <img src={ipo.logo} alt="" className="w-full h-full object-contain brightness-0 invert opacity-40 group-hover:opacity-80 transition-opacity" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-white text-sm truncate">{ipo.name}</h4>
                                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-0.5">
                                            {ipo.registrar?.split(' ')[0] || 'LinkIntime'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleCheckStatus(ipo.registrar || '')}
                                    className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                                >
                                    <ExternalLink size={14} />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-16 text-center">
                            <Clock size={32} className="mx-auto text-gray-800 mb-4" />
                            <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">No recently closed IPOs</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-10 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 w-fit mx-auto">
                <Radio size={12} className="text-indigo-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Monitoring All Registrars</span>
            </div>
        </div>
    );
};

export default AllotmentScreen;
