import { useState, useEffect } from 'react';
import { useAppStore } from '../../data/store';
import IPOCard from '../components/IPOCard';
import { Search, Filter } from 'lucide-react';
import AlertCenter from '../components/AlertCenter';
import { motion, AnimatePresence } from 'framer-motion';

const DiscoveryScreen = () => {
    const { ipos, userName, fetchData, updateProfile } = useAppStore();
    const [typeFilter, setTypeFilter] = useState<'all' | 'Mainboard' | 'SME'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Open' | 'Upcoming' | 'Closed'>('all');
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [search, setSearch] = useState('');

    // Ensure data is loaded and name is correct
    useEffect(() => {
        if (ipos.length === 0) {
            fetchData();
        }
        if (userName !== 'Rahul Sharma') {
            updateProfile('Rahul Sharma', 'rahul.sharma@email.com');
        }
    }, [ipos.length, fetchData, userName, updateProfile]);

    const filteredIPOs = ipos.filter(ipo => {
        const matchesType = typeFilter === 'all' || ipo.type === typeFilter;

        const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter === 'Open' && ipo.status === 'open') ||
            (statusFilter === 'Upcoming' && ipo.status === 'upcoming') ||
            (statusFilter === 'Closed' && ipo.status === 'closed');

        const matchesSearch =
            ipo.name.toLowerCase().includes(search.toLowerCase()) ||
            ipo.symbol.toLowerCase().includes(search.toLowerCase());

        return matchesType && matchesStatus && matchesSearch;
    });

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="pb-24 bg-[#030305] min-h-screen text-white font-outfit px-1">
            {/* Header section */}
            <header className="flex justify-between items-end mb-6 pt-4">
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

            {/* Multi-Filters UI */}
            <div className="space-y-4 mb-8">
                <div className="flex gap-3">
                    {/* Search Bar */}
                    <div className="glass-card p-3 rounded-2xl flex items-center gap-3 bg-white/5 border-white/10 shadow-2xl flex-1">
                        <Search size={18} className="text-indigo-500 ml-1" />
                        <input
                            type="text"
                            placeholder="Search company..."
                            className="bg-transparent border-none outline-none text-white w-full placeholder-gray-600 font-bold text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Button with Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowFilterMenu(!showFilterMenu)}
                            className={`glass-card p-3 rounded-2xl border border-white/10 shadow-2xl transition-all active:scale-95 ${statusFilter !== 'all' ? 'bg-indigo-600 border-indigo-500' : 'bg-white/5'
                                }`}
                        >
                            <Filter size={18} className={statusFilter !== 'all' ? 'text-white' : 'text-gray-500'} />
                        </button>

                        {/* Status Indicator Dot */}
                        {statusFilter !== 'all' && (
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#030305]" />
                        )}

                        {/* Dropdown Menu */}
                        <AnimatePresence>
                            {showFilterMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-36 bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 p-1.5"
                                >
                                    {['all', 'Open', 'Upcoming', 'Closed'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setStatusFilter(status as any);
                                                setShowFilterMenu(false);
                                            }}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 last:mb-0 ${statusFilter === status
                                                    ? 'bg-indigo-600 text-white shadow-lg'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            {status === 'all' ? 'All Status' : status}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Primary Type Tabs: All, Mainboard, SME */}
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                    {['all', 'Mainboard', 'SME'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setTypeFilter(f as any)}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${typeFilter === f
                                ? 'bg-indigo-600 text-white shadow-lg'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {f === 'all' ? 'All IPOs' : f}
                        </button>
                    ))}
                </div>

            </div>

            {/* IPO Feed */}
            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredIPOs.length > 0 ? (
                        filteredIPOs.map((ipo, idx) => (
                            <motion.div
                                key={ipo.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <IPOCard ipo={ipo} index={idx} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 text-center glass-card rounded-[2.5rem] border-dashed border-white/10">
                            <p className="text-xs font-black text-gray-600 uppercase tracking-widest">
                                No records found.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DiscoveryScreen;
