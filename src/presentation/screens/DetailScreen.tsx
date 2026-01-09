import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft, TrendingUp, Wallet, Zap, Layers, IndianRupee, Calendar
} from 'lucide-react';
import SubscriptionHeatmap from '../components/SubscriptionHeatmap';
import { useAppStore } from '../../data/store';

const DetailScreen: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { ipos } = useAppStore();
    const ipo = ipos.find(i => i.id === id);

    if (!ipo) return <div className="p-10 text-center text-gray-400">IPO Not Found</div>;

    const gmpValue = ipo.gmp || 0;
    const priceRangeArr = ipo.priceRange?.split('-') || [];
    const maxPrice = parseInt(priceRangeArr[1] || priceRangeArr[0]) || 1;
    const gmpPercent = ((gmpValue / maxPrice) * 100).toFixed(1);
    const retailProfit = gmpValue * (ipo.minQty || 0);

    const statusConfig = {
        open: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: 'Open' },
        closed: { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', label: 'Closed' },
        upcoming: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', label: 'Upcoming' },
        announced: { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', label: 'Announced' }
    };

    const config = statusConfig[ipo.status] || statusConfig.announced;

    return (
        <div className="flex flex-col pb-10 bg-[#030305] min-h-screen text-white font-outfit">
            {/* Smooth Header */}
            <header className="sticky top-0 z-40 bg-[#030305]/80 backdrop-blur-2xl border-b border-white/5">
                <div className="flex items-center justify-between p-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl bg-white/5 text-gray-400 hover:text-white transition-all active:scale-90"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex-1 px-4 min-w-0">
                        <h2 className="font-black text-lg truncate text-center leading-tight tracking-tight">{ipo.name}</h2>
                        <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest text-center mt-0.5">{ipo.symbol} • {ipo.type}</p>
                    </div>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </header>

            <div className="px-4 space-y-6 pb-24 pt-2">
                {/* Premium Hero Card - Styled like IPOCard */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden"
                >
                    <div className="absolute top-[-30%] right-[-20%] w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] animate-pulse"></div>

                    <div className="flex items-center gap-5 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-3 flex items-center justify-center shadow-inner">
                            <img src={ipo.logo} alt="" className="w-full h-full object-contain brightness-0 invert opacity-90" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border border-opacity-50 ${config.color}`}>
                                    {config.label}
                                </span>
                                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Listing Day 1</span>
                            </div>
                            <h1 className="text-2xl font-black text-white mt-2 tracking-tighter leading-none">{ipo.name}</h1>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">
                                <IndianRupee size={10} className="text-indigo-400" /> Price Band
                            </div>
                            <div className="font-black text-lg text-white tracking-tight">₹{ipo.priceRange}</div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">
                                <TrendingUp size={10} className="text-emerald-400" /> GMP
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="font-black text-lg text-emerald-400 tracking-tight">+₹{gmpValue}</span>
                                <span className="text-[9px] text-emerald-400/60 font-black">({gmpPercent}%)</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Separator */}
                <div className="h-[1px] bg-white/5 w-full" />

                {/* Market Intelligence Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2">
                            <Zap size={14} />
                        </div>
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-0.5 opacity-60">Profit / Lot</p>
                        <p className="text-sm font-black text-white tracking-tighter">₹{retailProfit.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
                            <Layers size={14} />
                        </div>
                        <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-0.5 opacity-60">Lot Size</p>
                        <p className="text-sm font-black text-white tracking-tighter">{ipo.minQty || 'TBA'}</p>
                    </div>
                </div>

                {/* Separator */}
                <div className="h-[1px] bg-white/5 w-full" />

                {/* Scrollable Content (No Tabs) */}
                <div className="space-y-6">

                    {/* Timeline & Analysis */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6 flex items-center gap-2">
                            <Calendar size={12} /> Timeline
                        </h3>
                        <div className="relative border-l border-white/10 ml-1.5 pl-6 space-y-8">
                            {ipo.schedule && ipo.schedule.map((item, idx) => {
                                // Robust date parsing
                                const parseDate = (d: string) => {
                                    if (!d || d === 'TBA') return null;
                                    const parsed = new Date(d);
                                    return isNaN(parsed.getTime()) ? null : parsed;
                                };

                                const eventDate = parseDate(item.date);
                                const today = new Date();

                                // Normalized comparisons (ignoring time)
                                today.setHours(0, 0, 0, 0);
                                if (eventDate) eventDate.setHours(0, 0, 0, 0);

                                let status = 'future';
                                if (!eventDate) status = 'future';
                                else if (eventDate < today) status = 'past';
                                else if (eventDate.getTime() === today.getTime()) status = 'today';

                                return (
                                    <div key={idx} className="relative group">
                                        {/* Timeline Dot */}
                                        <div className={`absolute -left-[29px] top-1.5 transition-all duration-300 ${status === 'today'
                                                ? 'w-3 h-3 bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] animate-pulse'
                                                : status === 'past'
                                                    ? 'w-2.5 h-2.5 bg-indigo-500 border-indigo-500' // Completed
                                                    : 'w-2.5 h-2.5 bg-[#030305] border-2 border-white/20' // Future
                                            } rounded-full z-10`} />

                                        {/* Content */}
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className={`text-[10px] font-black uppercase tracking-widest ${status === 'today' ? 'text-emerald-400' : 'text-gray-500'
                                                        }`}>
                                                        {item.event}
                                                    </p>
                                                    {status === 'today' && (
                                                        <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-400 uppercase tracking-wider animate-pulse">
                                                            Live
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-sm font-black tracking-wide ${status === 'today' ? 'text-white' : 'text-gray-300'
                                                    }`}>
                                                    {item.date}
                                                </p>
                                            </div>

                                            {/* Status Badge (Right Side) */}
                                            {status === 'past' && <div className="text-[9px] text-indigo-400 font-bold opacity-60">DONE</div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="mt-8 text-xs text-gray-400 font-bold leading-relaxed border-t border-white/5 pt-4">
                            {ipo.name} ({ipo.sector}), Size: ₹{ipo.issueSize}, Ret. Quota: 35%. {ipo.type} issue.
                        </p>
                    </div>

                    {/* Separator */}
                    <div className="h-[1px] bg-white/5 w-full" />

                    {/* Subscription & RHP */}
                    <div className="space-y-6">
                        <SubscriptionHeatmap data={ipo.subscription} className="rounded-2xl border border-white/5" />

                        {/* Separator */}
                        <div className="h-[1px] bg-white/5 w-full" />

                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-500/10 rounded-xl"><Wallet size={16} className="text-indigo-400" /></div>
                                <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Financials</p>
                                    <p className="text-xs font-black text-white">Red Herring Prospectus</p>
                                </div>
                            </div>
                            <button
                                onClick={() => ipo.rhpUrl && window.open(ipo.rhpUrl, '_blank')}
                                disabled={!ipo.rhpUrl}
                                className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10"
                            >
                                View RHP
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Action Dock - "Apply Now" */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pt-4 bg-gradient-to-t from-[#030305] via-[#030305]/95 to-transparent z-50">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.open(ipo.applyUrl, '_blank')}
                    className="w-full py-6 rounded-[2.5rem] bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(79,70,229,0.3)] flex items-center justify-center gap-4 border border-indigo-400/30"
                >
                    Apply for Subscription
                    <Zap size={18} className="text-amber-400" />
                </motion.button>
            </div>
        </div>
    );
};

export default DetailScreen;
