import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Info, Calendar, TrendingUp, ExternalLink,
    IndianRupee, Layers, ShieldCheck, BarChart2,
    Star, Clock, Target, AlertCircle, CheckCircle2, Bookmark
} from 'lucide-react';
import SubscriptionHeatmap from '../components/SubscriptionHeatmap';
import ReadinessMode from '../components/ReadinessMode';
import { useAppStore } from '../../data/store';

const IPODetailScreen: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { ipos, toggleWatchlist, watchlist } = useAppStore();
    const ipo = ipos.find(i => i.id === id);
    const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'financials'>('overview');

    if (!ipo) return <div className="p-10 text-center">IPO Not Found</div>;

    const expectedListing = parseInt(ipo.priceRange.split('-')[1] || '0') + (ipo.gmp || 0);
    const listingGain = ((ipo.gmp || 0) / (parseInt(ipo.priceRange.split('-')[1]) || 1) * 100).toFixed(1);
    const isWatchlisted = watchlist.includes(ipo.id);

    return (
        <div className="flex flex-col pb-32 bg-gradient-to-b from-bg-color to-surface-lighter">
            {/* Enhanced Sticky Header */}
            <header className="sticky top-0 z-30 glass backdrop-blur-xl border-b border-white/5">
                <div className="flex-between p-4 px-6">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-secondary hover:text-text-primary transition-colors active:scale-95">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="text-center min-w-0 px-4">
                        <h2 className="font-bold text-base truncate">{ipo.name}</h2>
                        <div className="flex-center gap-2 mt-0.5">
                            <span className={`badge badge-${ipo.status}`}>{ipo.status === 'open' ? 'Live' : ipo.status}</span>
                            <span className="text-[10px] text-text-muted font-bold uppercase">{ipo.sector}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => toggleWatchlist(ipo.id)}
                            className={`p-2 rounded-xl transition-all ${isWatchlisted ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            <Bookmark size={20} fill={isWatchlisted ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="p-6 flex flex-col gap-6">
                {/* Change Insight Engine Banner */}
                {ipo.insights && ipo.insights.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-primary/5 border border-primary/20 rounded-3xl p-5 mb-2 relative overflow-hidden group hover:bg-primary/10 transition-all cursor-default"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
                            <ShieldCheck size={48} className="text-primary" />
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex-center text-primary shrink-0 border border-primary/5">
                                <Info size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-1.5 opacity-80 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    Change Insight Engine
                                </p>
                                <p className="text-[13px] font-black text-text-primary leading-snug tracking-tight">
                                    {ipo.insights[0].message}
                                </p>
                                <p className="text-[8px] text-text-muted font-bold uppercase mt-2.5 opacity-60">
                                    Auto-Detected {new Date(ipo.insights[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Neutral Sentiment
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* IPO Action Readiness Mode */}
                <ReadinessMode ipo={ipo} />

                {/* Hero Card with Enhanced Design */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-surface-card to-white border border-border shadow-xl"
                >
                    {/* Animated Background */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-success/20 rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10 p-6">
                        {/* Logo and Company Info */}
                        <div className="flex items-start gap-6 mb-6">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-24 h-24 bg-white rounded-3xl p-4 flex-center shadow-lg border border-border"
                            >
                                <img src={ipo.logo} alt="" className="w-full h-full object-contain" />
                            </motion.div>
                            <div className="flex-1">
                                <h1 className="text-2xl font-black text-text-primary mb-2">{ipo.name}</h1>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="px-3 py-1 bg-surface-lighter rounded-full text-[10px] font-black uppercase tracking-widest text-text-muted border border-border">
                                        {ipo.type}
                                    </span>
                                    <span className="px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                                        MCap: {ipo.marketCap}
                                    </span>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 font-medium">
                                    {ipo.about}
                                </p>
                            </div>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <MetricCard
                                icon={<IndianRupee size={18} />}
                                label="Issue Size"
                                value={`₹${ipo.issueSize}`}
                                color="text-primary"
                            />
                            <MetricCard
                                icon={<Layers size={18} />}
                                label="Lot Size"
                                value={`${ipo.minQty} Shares`}
                                color="text-warning"
                            />
                            <MetricCard
                                icon={<IndianRupee size={18} />}
                                label="Price Band"
                                value={`₹${ipo.priceRange}`}
                                color="text-success"
                            />
                            <MetricCard
                                icon={<Target size={18} />}
                                label="Investment"
                                value={`₹${ipo.minAmount.toLocaleString()}`}
                                color="text-error"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* GMP & Expected Returns Card */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden glass rounded-[2.5rem] border-border shadow-lg"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                    <div className="relative z-10 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-6 bg-success rounded-full" />
                            <h3 className="text-lg font-black text-text-primary">Expected Returns</h3>
                            <div className="ml-auto px-2 py-1 bg-success/10 rounded-lg">
                                <span className="text-xs font-bold text-success">LIVE GMP</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Current GMP</p>
                                <div className="flex items-baseline gap-2">
                                    <TrendingUp size={20} className="text-success" />
                                    <span className="text-3xl font-black text-success">₹{ipo.gmp}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Expected Listing</p>
                                <div className="flex items-baseline gap-2">
                                    <Star size={20} className="text-warning" />
                                    <span className="text-3xl font-black text-text-primary">₹{expectedListing}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-success/20 to-success/5 rounded-2xl p-4 border border-success/20">
                            <div className="flex-between">
                                <div>
                                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Potential Gain</p>
                                    <p className="text-2xl font-black text-success">+{listingGain}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Per Lot Profit</p>
                                    <span className="text-2xl font-black text-success">₹{((ipo.gmp || 0) * ipo.minQty).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Tab Navigation */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                    <TabButton
                        active={activeTab === 'overview'}
                        onClick={() => setActiveTab('overview')}
                        icon={<Info size={16} />}
                        label="Overview"
                    />
                    <TabButton
                        active={activeTab === 'timeline'}
                        onClick={() => setActiveTab('timeline')}
                        icon={<Calendar size={16} />}
                        label="Timeline"
                    />
                    <TabButton
                        active={activeTab === 'financials'}
                        onClick={() => setActiveTab('financials')}
                        icon={<BarChart2 size={16} />}
                        label="Financials"
                    />
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex flex-col gap-6"
                        >
                            {/* Subscription Heatmap */}
                            <SubscriptionHeatmap data={ipo.subscription} />

                            {/* Investment Thesis */}
                            <div className="grid grid-cols-1 gap-4">
                                <ThesisCard
                                    title="Why to Apply"
                                    icon={<CheckCircle2 size={16} />}
                                    items={ipo.strengths}
                                    color="success"
                                />
                                <ThesisCard
                                    title="Key Risks"
                                    icon={<AlertCircle size={16} />}
                                    items={ipo.risks}
                                    color="error"
                                />
                            </div>

                            {/* Quick Stats */}
                            <section className="glass p-6 rounded-[2.5rem]">
                                <h3 className="text-sm font-black uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
                                    <ShieldCheck size={14} />
                                    Investment Details
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <QuickStat label="Face Value" value="₹10" />
                                    <QuickStat label="Listing In" value="T+3 Days" />
                                    <QuickStat label="Listing At" value="NSE, BSE" />
                                    <QuickStat label="Category" value={ipo.type} />
                                </div>
                            </section>

                            {/* Intelligence History */}
                            {ipo.insights && ipo.insights.length > 0 && (
                                <section className="p-1 px-2">
                                    <div className="flex-between mb-5">
                                        <h3 className="text-sm font-black uppercase tracking-wider text-text-muted flex items-center gap-2">
                                            <TrendingUp size={14} className="text-primary" />
                                            Change History
                                        </h3>
                                        <span className="text-[8px] font-black bg-primary/10 text-primary px-2 py-1 rounded-md uppercase tracking-wider">Auto-Log</span>
                                    </div>
                                    <div className="space-y-4">
                                        {ipo.insights.map((ins, idx) => (
                                            <div key={ins.id} className="flex gap-4 relative">
                                                {idx < ipo.insights!.length - 1 && (
                                                    <div className="absolute left-4 top-8 bottom-[-16px] w-px bg-border/50 border-dashed border-l" />
                                                )}
                                                <div className="w-8 h-8 rounded-xl bg-white border border-border flex-center shrink-0 relative z-10 shadow-sm">
                                                    {ins.type === 'status' && <Clock size={14} className="text-primary" />}
                                                    {ins.type === 'gmp' && <TrendingUp size={14} className="text-success" />}
                                                    {ins.type === 'subscription' && <Layers size={14} className="text-warning" />}
                                                    {ins.type === 'allotment' && <ShieldCheck size={14} className="text-primary" />}
                                                </div>
                                                <div className="flex-1 pb-2">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-[9px] font-black uppercase text-text-muted tracking-widest">{ins.type} update</span>
                                                        <span className="text-[9px] font-bold text-text-muted opacity-60">
                                                            {new Date(ins.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-[12px] font-bold text-text-primary leading-snug">
                                                        {ins.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'timeline' && (
                        <motion.div
                            key="timeline"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <section className="glass p-6 rounded-[2.5rem] relative overflow-hidden">
                                <div className="absolute left-[34px] top-16 bottom-16 w-0.5 bg-gradient-to-b from-primary/40 via-primary/20 to-white/5" />
                                <h3 className="text-sm font-black uppercase tracking-wider text-text-muted mb-6 flex items-center gap-2">
                                    <Calendar size={14} />
                                    IPO Timeline
                                </h3>
                                <div className="flex flex-col gap-6">
                                    {ipo.schedule.map((step, idx) => {
                                        const isPast = step.date !== 'TBA' && new Date() > new Date(step.date);
                                        return (
                                            <TimelineItem
                                                key={idx}
                                                label={step.event}
                                                date={step.date}
                                                active={isPast || (idx === 0)}
                                                index={idx}
                                            />
                                        );
                                    })}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === 'financials' && (
                        <motion.div
                            key="financials"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <section className="glass p-6 rounded-[2.5rem]">
                                <h3 className="text-sm font-black uppercase tracking-wider text-text-muted mb-6 flex items-center gap-2">
                                    <BarChart2 size={14} />
                                    Financial Metrics (₹ Cr.)
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <FinancialMetric
                                        label="Revenue"
                                        value={Math.floor(Math.random() * 500) + 200}
                                        trend="+12%"
                                    />
                                    <FinancialMetric
                                        label="Net Profit"
                                        value={Math.floor(Math.random() * 50) + 10}
                                        trend="+18%"
                                        color="success"
                                    />
                                    <FinancialMetric
                                        label="Total Assets"
                                        value={Math.floor(Math.random() * 800) + 400}
                                        trend="+8%"
                                    />
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Button at end of content */}
                <div className="mt-4">
                    <button
                        onClick={() => window.open(ipo.applyUrl, '_blank')}
                        className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl flex-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95"
                    >
                        <ExternalLink size={20} />
                        Apply Now
                    </button>
                </div>

                {/* Disclaimer */}
                <div className="p-5 mt-6 rounded-2xl bg-surface-deep border border-dashed border-white/10 opacity-60 text-center">
                    <p className="text-[9px] uppercase tracking-widest leading-relaxed text-text-muted">
                        Investment in securities market are subject to market risks. Read all scheme related documents carefully before investing.
                    </p>
                </div>
            </div>

            {/* Enhanced Sticky Action Footer */}
            <div className="fixed bottom-24 left-0 right-0 z-50 px-6 sm:hidden pointer-events-none">
                <div className="max-w-[480px] mx-auto pointer-events-auto">
                    <motion.button
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-14 bg-gradient-to-r from-primary to-primary-600 text-white font-black uppercase tracking-widest rounded-2xl flex-center gap-3 shadow-2xl shadow-primary/40 relative overflow-hidden group"
                        onClick={() => window.open(ipo.applyUrl, '_blank')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <ExternalLink size={20} className="stroke-[3] relative z-10" />
                        <span className="relative z-10">Apply for IPO</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

// Component: Metric Card
const MetricCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
    <div className="bg-surface-card rounded-2xl p-4 border border-border hover:bg-surface-lighter transition-all group shadow-sm">
        <div className={`w-10 h-10 rounded-xl bg-surface-lighter flex-center ${color} mb-3 group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">{label}</p>
        <p className="text-lg font-black text-text-primary">{value}</p>
    </div>
);

// Component: Tab Button
const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex-center gap-2 transition-all ${active
            ? 'bg-primary text-white shadow-lg shadow-primary/20'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-lighter'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

// Component: Thesis Card
const ThesisCard = ({ title, icon, items, color }: { title: string, icon: React.ReactNode, items: string[], color: string }) => (
    <div className={`glass p-6 rounded-[2rem] bg-${color}/[0.02] border-${color}/10`}>
        <h3 className={`text-sm font-black uppercase tracking-wider text-${color} mb-4 flex items-center gap-2`}>
            {icon}
            {title}
        </h3>
        <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${color} mt-1.5 flex-shrink-0`} />
                    <span>{item}</span>
                </div>
            ))}
        </div>
    </div>
);

// Component: Quick Stat
const QuickStat = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-surface-lighter rounded-xl p-3 border border-border">
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">{label}</p>
        <p className="text-sm font-bold text-text-primary">{value}</p>
    </div>
);

// Component: Timeline Item
const TimelineItem = ({ label, date, active, index }: { label: string, date: string, active?: boolean, index: number }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="flex gap-6 items-center relative z-10"
    >
        <div className={`w-8 h-8 rounded-xl flex-center border transition-all duration-500 ${active
            ? 'bg-primary border-primary shadow-lg shadow-primary/20'
            : 'bg-surface-deep border-white/5'
            }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-bg-color' : 'bg-white/10'}`} />
        </div>
        <div className="flex-1">
            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-0.5">{label}</p>
            <p className={`text-sm font-bold ${active ? 'text-text-primary' : 'text-text-muted'}`}>{date}</p>
        </div>
        {active && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-1 bg-primary/10 rounded-lg"
            >
                <Clock size={14} className="text-primary" />
            </motion.div>
        )}
    </motion.div>
);

// Component: Financial Metric
const FinancialMetric = ({ label, value, trend, color = 'text-text-primary' }: { label: string, value: number, trend: string, color?: string }) => (
    <div className="bg-surface-card rounded-2xl p-4 border border-border shadow-sm">
        <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">{label}</p>
        <p className={`text-xl font-black ${color} mb-1`}>₹{value}</p>
        <p className="text-xs font-bold text-success">{trend}</p>
    </div>
);

export default IPODetailScreen;
