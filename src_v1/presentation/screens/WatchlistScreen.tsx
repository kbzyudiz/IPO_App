import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, Bell, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../data/store';
import { type IPO } from '../../core/types';

const WatchlistScreen: React.FC = () => {
    const navigate = useNavigate();
    const { ipos, watchlist, toggleWatchlist } = useAppStore();

    const watchedIpos = ipos.filter(ipo => watchlist.includes(ipo.id));

    const sections = [
        { id: 'open', title: 'Open Now', color: 'text-success', bg: 'bg-success', list: watchedIpos.filter((i: IPO) => i.status === 'open') },
        { id: 'upcoming', title: 'Upcoming', color: 'text-warning', bg: 'bg-warning', list: watchedIpos.filter((i: IPO) => i.status === 'upcoming') },
        { id: 'announced', title: 'Announced', color: 'text-primary', bg: 'bg-primary', list: watchedIpos.filter((i: IPO) => i.status === 'announced') },
        { id: 'closed', title: 'Closed / Listed', color: 'text-text-muted', bg: 'bg-text-muted', list: watchedIpos.filter((i: IPO) => i.status === 'closed') }
    ];

    const topGmp = Math.max(...watchedIpos.map((i: IPO) => i.gmp || 0), 0);

    return (
        <div className="p-6 pb-24 flex flex-col gap-8">
            <header className="flex-between">
                <div>
                    <h1 className="text-2xl font-bold">Watchlist</h1>
                    <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">{watchlist.length} Companies Tracked</p>
                </div>
                <div className="w-12 h-12 rounded-full glass flex-center text-primary border-primary/20 bg-primary/5">
                    <Bookmark size={20} fill="currentColor" />
                </div>
            </header>

            {/* Top Summary Strip */}
            {watchedIpos.length > 0 && (
                <div className="glass p-5 rounded-[2rem] grid grid-cols-2 gap-y-4 gap-x-6 border-white/10">
                    <SummaryItem label="Watching" value={`${watchlist.length} IPOs`} />
                    <SummaryItem label="Open Now" value={watchedIpos.filter((i: IPO) => i.status === 'open').length.toString()} />
                    <SummaryItem label="Upcoming" value={watchedIpos.filter((i: IPO) => i.status === 'upcoming').length.toString()} />
                    <SummaryItem label="Top GMP" value={`₹${topGmp}`} />
                </div>
            )}

            {/* Sections */}
            <div className="flex flex-col gap-10">
                <AnimatePresence mode="popLayout">
                    {watchedIpos.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 flex flex-col items-center text-center px-10"
                        >
                            <div className="w-20 h-20 rounded-full glass border-white/5 flex-center mb-6 text-text-muted opacity-30">
                                <Bookmark size={40} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Watchlist Empty</h3>
                            <p className="text-sm text-text-muted mb-8 italic">No IPOs in your watchlist yet. Start tracking to get instant updates.</p>
                            <button
                                onClick={() => navigate('/list')}
                                className="px-10 py-4 bg-primary text-bg-color font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20"
                            >
                                Browse IPOs
                            </button>
                        </motion.div>
                    ) : (
                        sections.map(section => (
                            section.list.length > 0 && (
                                <div key={section.id} className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3 ml-2">
                                        <div className={`w-2 h-2 rounded-full ${section.bg}`} />
                                        <h2 className={`text-[11px] font-black uppercase tracking-[0.2em] ${section.color}`}>{section.title}</h2>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {section.list.map((ipo: IPO) => (
                                            <WatchlistCard
                                                key={ipo.id}
                                                ipo={ipo}
                                                onDelete={() => toggleWatchlist(ipo.id)}
                                                onClick={() => navigate(`/ipo/${ipo.id}`)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const SummaryItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-[9px] text-text-muted uppercase font-black tracking-widest mb-1">{label}</p>
        <p className="text-base font-bold text-white pr-2">{value}</p>
    </div>
);

const WatchlistCard = ({ ipo, onDelete, onClick }: { ipo: IPO, onDelete: () => void, onClick: () => void }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, x: 20 }}
        className="glass p-5 rounded-[2rem] border-white/5 relative group cursor-pointer"
        onClick={onClick}
    >
        <div className="flex-between mb-4">
            <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-bold text-base truncate mb-1">{ipo.name}</h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{ipo.sector}</span>
                    <span className="text-text-muted">•</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${ipo.status === 'open' ? 'text-success' : 'text-text-muted'}`}>{ipo.status}</span>
                </div>
            </div>
            <div className="text-right flex-shrink-0">
                <p className="text-xs font-black text-white">₹{ipo.priceRange}</p>
                <p className="text-[10px] font-bold text-success mt-1">+{ipo.gmp} GMP</p>
            </div>
        </div>

        <div className="flex-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <Bell size={14} className="opacity-50" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Alerts</span>
                    <div className="w-7 h-4 rounded-full bg-white/5 border border-white/10 relative">
                        <div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-primary shadow-sm" />
                    </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-50">
                    <TrendingUp size={14} className="text-success" />
                    <span className="text-[10px] font-black">{ipo.subscription.total}x</span>
                </div>
            </div>
            <button
                className="p-2 text-error/40 hover:text-error transition-colors"
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
                <Trash2 size={18} />
            </button>
        </div>
    </motion.div>
);

export default WatchlistScreen;
