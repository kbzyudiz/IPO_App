import React from 'react';
import { motion } from 'framer-motion';
import { Award, BarChart3, PieChart, Briefcase, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../data/store';
import PremiumLoader from '../components/PremiumLoader';

const AnalyticsScreen: React.FC = () => {
    const { metrics, isLoading } = useAppStore();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const sectorData = [
        { name: 'Technology', count: 18, gain: '+45.2%' },
        { name: 'Healthcare', count: 12, gain: '+32.8%' },
        { name: 'Finance', count: 15, gain: '+28.4%' },
        { name: 'Automotive', count: 11, gain: '-5.2%' },
    ];

    if (isLoading) return <PremiumLoader message="Crunching market data..." />;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
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
                        Insights <span className="text-primary">.</span>
                    </h1>
                </div>
                <div className="w-11 h-11 rounded-[1.2rem] bg-white shadow-xl shadow-primary/10 border border-primary/10 flex-center active:scale-95 transition-all">
                    <BarChart3 size={20} className="text-primary" />
                </div>
            </header>

            {/* Overview Grid */}
            <motion.section variants={itemVariants}>
                <div className="flex items-center gap-2 mb-5 px-1">
                    <TrendingUp size={16} className="text-primary" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Market Overview</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Total IPOs" value={metrics.totalIpos.toString()} trend="+24%" variants={itemVariants} />
                    <StatCard label="Avg Listing" value="34.5%" trend="+5.2%" variants={itemVariants} />
                    <StatCard label="Oversubscribed" value="76%" trend="-2%" color="error" variants={itemVariants} />
                    <StatCard label="Mainboard" value="42" trend="+8" variants={itemVariants} />
                </div>
            </motion.section>

            {/* Sector Performance */}
            <motion.section variants={itemVariants}>
                <div className="flex items-center gap-2 mb-5 px-1">
                    <PieChart size={16} className="text-primary" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Sector Gains</h2>
                </div>
                <div className="bg-white rounded-[2.5rem] overflow-hidden border border-border/40 shadow-xl shadow-black/[0.02]">
                    {sectorData.map((sector, i) => (
                        <div key={i} className={`flex-between p-5 ${i !== sectorData.length - 1 ? 'border-b border-border/30' : ''} active:bg-surface-lighter transition-colors cursor-pointer`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/5 rounded-[1.1rem] flex-center text-primary shadow-inner border border-primary/5">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-[14px] text-text-primary">{sector.name}</h4>
                                    <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-0.5">{sector.count} Companies</p>
                                </div>
                            </div>
                            <div className={`text-[15px] font-black ${sector.gain.startsWith('+') ? 'text-success' : 'text-error'}`}>
                                {sector.gain}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Top Performer Card - Enhanced Light Aura */}
            <motion.section variants={itemVariants}>
                <div className="flex items-center gap-2 mb-5 px-1">
                    <Award size={16} className="text-primary" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Hall of Fame</h2>
                </div>
                <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="p-8 rounded-[2.5rem] cursor-pointer shadow-2xl shadow-primary/5 transition-all border border-primary/10 bg-white relative overflow-hidden group"
                    style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F5F8FF 100%)' }}
                >
                    <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[90px] pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-success/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="flex-1">
                                <span className="inline-flex items-center gap-2 text-[10px] font-black bg-primary/5 text-primary px-3.5 py-2 rounded-full uppercase tracking-[0.2em] mb-4 border border-primary/10">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_12px_rgba(71,117,251,0.6)]" />
                                    Top Performer 2024
                                </span>
                                <h2 className="text-2xl font-black leading-tight text-text-primary tracking-tighter">
                                    TechVision Limited
                                </h2>
                            </div>
                            <div className="w-14 h-14 rounded-[1.3rem] bg-primary/20 flex-center text-primary shadow-sm shrink-0">
                                <Award size={28} />
                            </div>
                        </div>

                        <div className="flex justify-between items-end mt-12">
                            <div className="space-y-1.5">
                                <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black opacity-80">Sector</p>
                                <p className="text-lg font-black text-text-primary tracking-tight">Technology</p>
                            </div>
                            <div className="text-right space-y-1.5">
                                <p className="text-[10px] text-success font-black uppercase tracking-[0.2em]">Listing Day Gain</p>
                                <p className="text-4xl font-black text-success tracking-tighter">
                                    <span className="text-[1.5rem] mr-0.5">+</span>156%
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.section>
        </motion.div>
    );
};

const StatCard = ({ label, value, trend, color = 'success', variants }: { label: string, value: string, trend: string, color?: 'success' | 'error', variants: any }) => (
    <motion.div
        variants={variants}
        className="bg-white p-6 rounded-[2.5rem] flex flex-col gap-4 border border-border/40 shadow-2xl shadow-black/[0.02] relative overflow-hidden group active:scale-[0.98] transition-all"
    >
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-colors" />

        <div className="relative z-10">
            <p className="text-[9px] text-text-muted font-black uppercase tracking-[0.2em] mb-2 opacity-70">{label}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-text-primary tracking-tighter">{value}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${color === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {trend}
                </span>
            </div>
        </div>

        <div className="h-1.5 w-full bg-surface-lighter rounded-full overflow-hidden mt-1 shadow-inner">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: color === 'success' ? '82%' : '45%' }}
                className={`h-full rounded-full ${color === 'success' ? 'bg-success' : 'bg-error'} opacity-60`}
            />
        </div>
    </motion.div>
);

export default AnalyticsScreen;
