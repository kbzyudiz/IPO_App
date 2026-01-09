import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Clock } from 'lucide-react';
import { useAppStore } from '../../data/store';
import { type IPO } from '../../core/types';
import PremiumLoader from '../components/PremiumLoader';
import AlertCenter from '../components/AlertCenter';

const HomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const { ipos, isLoading, userName } = useAppStore();

    const hotIpo = [...ipos].sort((a, b) => (b.gmp || 0) - (a.gmp || 0))[0];
    const openIpos = ipos.filter(i => i.status === 'open');

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (isLoading) return <PremiumLoader message="Preparing your market dashboard..." />;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };



    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-8 p-6 pt-2 pb-24 bg-bg-color min-h-screen"
        >
            <header className="flex justify-between items-end px-1 mt-4">
                <div>
                    <p className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mb-1 opacity-60">
                        {getGreeting()},
                    </p>
                    <h1 className="text-3xl font-black tracking-tighter text-text-primary">
                        {userName.split(' ')[0]} <span className="text-primary">.</span>
                    </h1>
                </div>
                <AlertCenter />
            </header>

            {/* Hot Right Now Card */}
            {hotIpo && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-surface-card to-white border border-primary/10 p-8 shadow-2xl shadow-primary/5 cursor-pointer group"
                    onClick={() => navigate(`/ipo/${hotIpo.id}`)}
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                        <TrendingUp size={120} />
                    </div>
                    <div className="relative z-10">
                        <span className="px-4 py-1.5 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                            Hot Right Now
                        </span>
                        <h2 className="text-3xl font-black text-text-primary mt-4 mb-2 tracking-tighter leading-none">
                            {hotIpo.name}
                        </h2>
                        <div className="flex items-center gap-4 text-sm font-bold text-text-muted">
                            <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-success" /> ₹{hotIpo.gmp} GMP</span>
                            <span className="flex items-center gap-1.5">🔥 Best Returns</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Market Pulse Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-black uppercase tracking-widest text-text-muted">Market Pulse</h3>
                    <div className="h-0.5 w-12 bg-border/40 rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <SummaryMetric label="Active IPOs" value={openIpos.length.toString()} color="text-primary" />
                    <SummaryMetric label="Upcoming" value={ipos.filter(i => i.status === 'upcoming').length.toString()} color="text-warning" />
                    <SummaryMetric label="Avg. GMP" value={`₹${(ipos.reduce((acc, i) => acc + (i.gmp || 0), 0) / (ipos.length || 1)).toFixed(0)}`} color="text-success" />
                    <SummaryMetric label="Total Issue" value="₹12.4K Cr" color="text-indigo-500" />
                </div>
            </div>

            {/* Open IPOs List */}
            <div className="space-y-6">
                <div className="flex justify-between items-end px-1">
                    <div>
                        <h3 className="text-xl font-black text-text-primary tracking-tight">Active Opportunities</h3>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Don't miss the deadline</p>
                    </div>
                    <button onClick={() => navigate('/list')} className="text-xs font-black text-primary uppercase tracking-widest mb-1 hover:underline">See All</button>
                </div>

                <div className="flex flex-col gap-5">
                    {openIpos.map(ipo => (
                        <IPOCard key={ipo.id} ipo={ipo} onClick={() => navigate(`/ipo/${ipo.id}`)} />
                    ))}
                    {openIpos.length === 0 && (
                        <div className="glass p-10 rounded-[2.5rem] text-center border-dashed border-border/60">
                            <Clock size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
                            <p className="text-text-secondary font-medium italic">No active IPOs today. Check upcoming!</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const SummaryMetric = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="glass p-5 rounded-3xl border-white/10 hover:border-primary/20 transition-all group">
        <p className="text-[9px] text-text-muted uppercase font-black tracking-widest mb-1 opacity-60">{label}</p>
        <p className={`text-xl font-black ${color} tracking-tighter`}>{value}</p>
    </div>
);

const IPOCard = ({ ipo, onClick }: { ipo: IPO, onClick: () => void }) => {
    const gmpValue = ipo.gmp || 0;
    const priceStr = ipo.priceRange?.split('-')[1] || ipo.priceRange || '0';
    const price = parseInt(priceStr) || 1;
    const gmpPercent = ((gmpValue / price) * 100).toFixed(1);

    // Calculate retail profit (approx)
    const retailProfit = gmpValue * (ipo.minQty || 0);
    const hniProfit = gmpValue * ((ipo.minQty || 0) * 14); // Approx lot multiplier for sHNI

    const allotmentDate = ipo.schedule?.find(s => s.event.toLowerCase().includes('allotment'))?.date || 'TBA';
    const listingDate = ipo.schedule?.find(s => s.event.toLowerCase().includes('listing'))?.date || 'TBA';

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1 } }}
            className="glass overflow-hidden rounded-[2.5rem] border-white/10 shadow-xl shadow-black/5 cursor-pointer group hover:border-primary/20 transition-all"
            onClick={onClick}
        >
            <div className="p-7">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4">
                        <div className="w-14 h-14 bg-white rounded-2xl p-2.5 shadow-sm border border-border group-hover:scale-110 transition-transform">
                            <img src={ipo.logo} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h4 className="font-black text-lg text-text-primary leading-tight pr-4">{ipo.name}</h4>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="px-2 py-0.5 bg-primary/10 rounded-md text-[9px] font-black uppercase text-primary">Mainboard</span>
                                <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider">{ipo.sector}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border/40 -mx-5 mb-5" />

                <div className="flex gap-6 mb-6">
                    {/* Logo Box / Tag */}
                    <div className="w-28 h-32 rounded-2xl bg-[#F4F7FF] flex flex-col items-center justify-center p-3 border border-primary/5">
                        <div className="flex gap-1 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-error/60" />
                            <div className="w-1.5 h-1.5 rounded-full bg-error/70" />
                            <div className="w-1.5 h-1.5 rounded-full bg-error/80" />
                        </div>
                        <span className="text-[13px] font-black text-[#1A1F36] tracking-tighter uppercase text-center">
                            {ipo.symbol || ipo.name.split(' ').map(n => n[0]).join('').slice(0, 4)}
                        </span>
                        <div className="w-12 h-0.5 bg-border/60 mt-4 rounded-full" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] font-bold text-text-muted">Date:</span>
                            <span className="text-[12px] font-black text-[#1A1F36]">{ipo.startDate} - {ipo.endDate}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] font-bold text-text-muted">Price:</span>
                            <span className="text-[12px] font-black text-[#1A1F36]">₹{ipo.priceRange}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] font-bold text-text-muted">Lot Size:</span>
                            <span className="text-[12px] font-black text-[#1A1F36]">{ipo.minQty}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] font-bold text-text-muted">Issue Size:</span>
                            <span className="text-[12px] font-black text-[#1A1F36]">₹{ipo.issueSize}</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-border/40 -mx-5 mb-5" />

                <div className="space-y-3.5 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-[14px] font-black text-text-secondary">GMP Rumors*:</span>
                        <span className="text-[15px] font-black text-[#22C55E]">{gmpValue} ({gmpPercent}%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-text-secondary">Last Heard:</span>
                        <span className="text-[13px] font-bold text-text-muted italic">Live Market Update</span>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-text-secondary">Allotment Date</span>
                        <span className="text-[13px] font-black text-text-muted">{allotmentDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-text-secondary">Listing Date</span>
                        <span className="text-[13px] font-black text-text-muted">{listingDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-text-secondary">GMP x Lots (IND)*</span>
                        <span className="text-[13px] font-black text-text-muted">{retailProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[13px] font-bold text-text-secondary">GMP x Lots (HNI)*</span>
                        <span className="text-[13px] font-black text-text-muted">{hniProfit.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex gap-3 mb-5 px-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        className="flex-1 py-4 rounded-xl border-2 border-border/40 text-[13px] font-black uppercase tracking-widest text-[#1A1F36] bg-white active:bg-surface-lighter transition-all"
                    >
                        VIEW
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); window.open(ipo.applyUrl, '_blank'); }}
                        className="flex-[2] py-4 rounded-xl bg-apply text-white text-[13px] font-black uppercase tracking-widest active:scale-95 shadow-lg transition-all"
                    >
                        APPLY
                    </button>
                </div>

                <p className="text-[10px] text-text-muted text-center font-bold opacity-80 pb-2">
                    * Info is indicative, not an investment advice.
                </p>
            </div>
        </motion.div>
    );
};

export default HomeScreen;
