import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Clock } from 'lucide-react';
import { useAppStore } from '../../data/store';
import PremiumLoader from '../components/PremiumLoader';
import AlertCenter from '../components/AlertCenter';
import IPOCard from '../components/IPOCard';

const HomeScreen: React.FC = () => {
    const navigate = useNavigate();
    const { ipos, isLoading, userName } = useAppStore();
    const [filter, setFilter] = React.useState<'all' | 'mainboard' | 'sme'>('all');

    const hotIpo = [...ipos]
        .filter(i => i.status !== 'closed')
        .sort((a, b) => (b.gmp || 0) - (a.gmp || 0))[0];

    const filteredIpos = ipos.filter(i => {
        if (filter === 'mainboard') return i.type === 'Mainboard';
        if (filter === 'sme') return i.type === 'SME';
        return true;
    });

    const openIpos = filteredIpos.filter(i => i.status === 'open');

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
            className="flex flex-col gap-8 p-6 pt-2 pb-24 bg-[#030305] min-h-screen"
        >
            <header className="flex justify-between items-end px-1 mt-4">
                <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1 opacity-60">
                        {getGreeting()},
                    </p>
                    <h1 className="text-3xl font-black tracking-tighter text-white">
                        {userName.split(' ')[0]} <span className="text-indigo-500">.</span>
                    </h1>
                </div>
                <AlertCenter />
            </header>

            {/* Hot Right Now Card */}
            {hotIpo && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 via-white/5 to-white/5 border border-indigo-500/20 p-8 shadow-2xl shadow-indigo-500/10 cursor-pointer group"
                    onClick={() => navigate(`/ipo/${hotIpo.id}`)}
                >
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>

                    <div className="relative z-10">
                        <span className="px-4 py-1.5 bg-indigo-500/20 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-400 border border-indigo-500/30">
                            High GMP Performance 🔥
                        </span>
                        <h2 className="text-3xl font-black text-white mt-5 mb-3 tracking-tighter leading-tight drop-shadow-sm">
                            {hotIpo.name}
                        </h2>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                            <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-emerald-400" /> ₹{hotIpo.gmp} Current GMP</span>
                            <div className="w-1 h-1 bg-white/20 rounded-full" />
                            <span className="flex items-center gap-1.5 text-indigo-400">View Analytics</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Market Pulse Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 opacity-80">Market Statistics</h3>
                    <div className="h-[1px] flex-1 mx-4 bg-white/5" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <SummaryMetric label="Active IPOs" value={openIpos.length.toString()} color="text-indigo-400" />
                    <SummaryMetric label="Upcoming" value={ipos.filter(i => i.status === 'upcoming').length.toString()} color="text-amber-400" />
                    <SummaryMetric label="Avg. GMP" value={`₹${(ipos.reduce((acc, i) => acc + (i.gmp || 0), 0) / (ipos.length || 1)).toFixed(0)}`} color="text-emerald-400" />
                    <SummaryMetric label="Market Trend" value="Bullish" color="text-indigo-400" />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                {(['all', 'mainboard', 'sme'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Open IPOs List */}
            <div className="space-y-6">
                <div className="flex justify-between items-end px-1">
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tighter">Live Opportunities</h3>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1 opacity-60">Verified Primary Market Intelligence</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {openIpos.map((ipo, idx) => (
                        <IPOCard key={ipo.id} ipo={ipo} index={idx} />
                    ))}
                    {openIpos.length === 0 && (
                        <div className="glass-card p-12 rounded-[2.5rem] text-center border-dashed border-white/10 opacity-60">
                            <Clock size={40} className="mx-auto text-gray-500 mb-4" />
                            <p className="text-sm font-bold text-gray-400 italic">No IPOs currently open for subscription.</p>
                            <p className="text-[10px] mt-2 uppercase tracking-widest font-black text-indigo-400">Check Discovery for Upcoming</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const SummaryMetric = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="glass-card p-5 rounded-3xl border-white/5 hover:border-indigo-500/20 transition-all flex flex-col justify-center">
        <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest mb-1.5 opacity-60">{label}</p>
        <p className={`text-xl font-black ${color} tracking-tighter drop-shadow-sm`}>{value}</p>
    </div>
);

export default HomeScreen;
