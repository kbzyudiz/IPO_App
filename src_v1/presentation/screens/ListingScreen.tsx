import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Bookmark, ArrowUpRight, Clock } from 'lucide-react';
import { useAppStore } from '../../data/store';
import { type IPOStatus } from '../../core/types';

const IPOListingScreen: React.FC = () => {
    const navigate = useNavigate();
    const { ipos, watchlist, toggleWatchlist } = useAppStore();
    const [activeTab, setActiveTab] = useState<'all' | IPOStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredIpos = ipos.filter(ipo => {
        const matchesTab = activeTab === 'all' || ipo.status === activeTab;
        const matchesSearch = ipo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ipo.symbol.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const tabs: { id: 'all' | IPOStatus, label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'open', label: 'Open' },
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'announced', label: 'Announced' },
        { id: 'closed', label: 'Closed' }
    ];

    return (
        <div className="flex flex-col min-h-screen pb-24">
            <header className="sticky top-0 z-20 bg-bg-color/80 backdrop-blur-xl p-6 pb-2 border-b border-white/5">
                <h1 className="text-2xl font-bold mb-4">Market Listings</h1>

                {/* Search */}
                <div className="glass flex items-center px-4 py-2.5 rounded-2xl gap-3 mb-4 border-white/5">
                    <Search size={18} className="text-secondary" />
                    <input
                        type="text"
                        placeholder="Search company..."
                        className="bg-transparent border-none outline-none text-sm text-white flex-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Filter size={18} className="text-primary" />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-primary text-bg-color scale-105 shadow-lg shadow-primary/20' : 'bg-surface-lighter text-secondary'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="p-4 flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredIpos.map((ipo, index) => (
                        <motion.div
                            key={ipo.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => navigate(`/ipo/${ipo.id}`)}
                            className="glass p-5 rounded-3xl relative hover:bg-white/5 transition-colors group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 bg-white rounded-2xl p-2.5 flex-center">
                                        <img src={ipo.logo} alt="" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base leading-snug mb-1 pr-6">{ipo.name}</h3>
                                        <div className="flex gap-2">
                                            <span className={`badge badge-${ipo.status}`}>{ipo.status}</span>
                                            <span className="text-[10px] text-text-muted font-bold self-center uppercase">{ipo.type}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className={`p-2 rounded-lg transition-all ${watchlist.includes(ipo.id) ? 'text-primary' : 'text-text-muted hover:text-white'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleWatchlist(ipo.id);
                                    }}
                                >
                                    <Bookmark size={20} fill={watchlist.includes(ipo.id) ? "currentColor" : "none"} />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 mb-4">
                                <DetailsBox label="Price" value={`₹${ipo.priceRange}`} />
                                <DetailsBox label="GMP" value={`+₹${ipo.gmp}`} color="text-success" />
                                <DetailsBox label="Sub" value={`${ipo.subscription.total}x`} align="right" />
                            </div>

                            <div className="flex-between">
                                <div className="flex items-center gap-2 text-text-muted">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">
                                        {ipo.status === 'open' ? `Ends ${ipo.endDate}` :
                                            ipo.status === 'upcoming' ? `Starts ${ipo.startDate}` :
                                                `Listed ${ipo.listingDate || 'TBA'}`}
                                    </span>
                                </div>
                                <div className="text-primary flex items-center gap-1">
                                    <span className="text-xs font-bold uppercase tracking-widest">Details</span>
                                    <ArrowUpRight size={14} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredIpos.length === 0 && (
                    <div className="py-20 text-center flex-col flex-center">
                        <Search size={48} className="text-text-muted opacity-20 mb-4" />
                        <p className="text-secondary font-medium">No IPOs found in this category</p>
                    </div>
                )}
            </main>
        </div>
    );
};

const DetailsBox = ({ label, value, color = "text-white", align = "left" }: { label: string, value: string, color?: string, align?: "left" | "right" }) => (
    <div className={align === 'right' ? 'text-right' : 'text-left'}>
        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1">{label}</p>
        <p className={`text-sm font-bold truncate ${color}`}>{value}</p>
    </div>
);

export default IPOListingScreen;
