import { useState, useEffect } from 'react';
import { useAppStore } from '../../data/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Radio, Plus, Trash2, User, ChevronRight } from 'lucide-react';
import { RegistrarService } from '../../services/RegistrarService';
import { ProfileService, type UserProfile } from '../../services/ProfileService';
import BottomSheet from '../components/BottomSheet';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';

const AllotmentScreen = () => {
    const { ipos } = useAppStore();
    const [search, setSearch] = useState('');
    const [profiles, setProfiles] = useState<UserProfile[]>([]);

    // Bottom Sheet State
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedIpoUrl, setSelectedIpoUrl] = useState('');
    const [selectedIpoName, setSelectedIpoName] = useState('');

    // Add New Profile State
    const [newName, setNewName] = useState('');
    const [newPan, setNewPan] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = () => {
        setProfiles(ProfileService.getProfiles());
    };

    const handleAddProfile = () => {
        if (!newName || newPan.length !== 10) return;
        try {
            const updated = ProfileService.saveProfile(newName, newPan);
            setProfiles(updated);
            setNewName('');
            setNewPan('');
            setIsAdding(false);
        } catch (e) {
            alert('Profile already exists');
        }
    };

    const handleDeleteProfile = (id: string) => {
        const updated = ProfileService.deleteProfile(id);
        setProfiles(updated);
    };

    const openCheckSheet = (registrar: string, ipoName: string) => {
        const info = RegistrarService.identifyRegistrar(registrar);
        setSelectedIpoUrl(info.url);
        setSelectedIpoName(ipoName);
        setIsSheetOpen(true);
    };

    const openManager = () => {
        setSelectedIpoUrl('');
        setSelectedIpoName('');
        setIsSheetOpen(true);
    };

    const handleCheckForProfile = async (profile: UserProfile) => {
        if (!selectedIpoUrl) return; // Guard clause

        // 1. Decrypt and Copy PAN
        try {
            await navigator.clipboard.writeText(profile.pan);
            setCopyFeedback(profile.id);
            setTimeout(() => setCopyFeedback(null), 2000);
        } catch (e) {
            console.error('Copy failed', e);
        }

        // 2. Open Browser
        if (Capacitor.isNativePlatform()) {
            await Browser.open({ url: selectedIpoUrl });
        } else {
            window.open(selectedIpoUrl, '_blank');
        }
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
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Family Portfolio Manager</p>
            </header>

            {/* Quick Stats / Hint - CLICKABLE NOW */}
            <div
                onClick={openManager}
                className="mb-6 p-4 rounded-2xl bg-indigo-900/10 border border-indigo-500/20 flex items-center justify-between active:scale-95 transition-all cursor-pointer group"
            >
                <div>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1 group-hover:text-indigo-300">Saved Accounts</p>
                    <p className="text-xl font-black text-white">{profiles.length} Profiles</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold text-indigo-400/50 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Manage</span>
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <User size={18} />
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-white/5 rounded-2xl border border-white/5">
                <Search size={16} className="text-gray-600" />
                <input
                    type="text"
                    placeholder="Find IPO to check..."
                    className="bg-transparent border-none outline-none text-white w-full placeholder-gray-700 font-bold text-xs"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* IPO List */}
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
                                            {ipo.registrar || 'Unknown Registrar'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => openCheckSheet(ipo.registrar || '', ipo.name)}
                                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                >
                                    Check
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

            {/* Monitoring Status */}
            <div className="mt-10 flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 w-fit mx-auto">
                <Radio size={12} className="text-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Monitoring Registrars Live</span>
            </div>

            {/* Bottom Sheet for Profiles */}
            <BottomSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                title={selectedIpoName ? `Check ${selectedIpoName.split(' ')[0]}` : 'Manage Profiles'}
            >
                <div className="space-y-6">
                    {/* List of Profiles */}
                    <div className="space-y-3">
                        {profiles.map(profile => (
                            <div key={profile.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-black text-white">
                                        {profile.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{profile.name}</div>
                                        <div className="text-[9px] text-gray-500 font-mono">
                                            {copyFeedback === profile.id ? <span className="text-emerald-400">PAN Copied!</span> : '••••' + profile.pan.slice(-4)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {selectedIpoUrl && (
                                        <button
                                            onClick={() => handleCheckForProfile(profile)}
                                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-wider text-white transition-colors flex items-center gap-1"
                                        >
                                            Check <ChevronRight size={10} />
                                        </button>
                                    )}
                                    <button onClick={() => handleDeleteProfile(profile.id)} className="p-2 text-gray-600 hover:text-rose-400">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {profiles.length === 0 && (
                            <div className="text-center py-6 text-gray-600 text-xs">
                                No profiles added yet.
                            </div>
                        )}
                    </div>

                    {/* Add Profile Section */}
                    {isAdding ? (
                        <div className="p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                            <input
                                className="w-full bg-[#030305] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                                placeholder="Name (e.g. Dad)"
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                            />
                            <input
                                className="w-full bg-[#030305] border border-white/10 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500 uppercase"
                                placeholder="PAN Number"
                                maxLength={10}
                                value={newPan}
                                onChange={e => setNewPan(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button onClick={handleAddProfile} className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-xs font-bold">Save</button>
                                <button onClick={() => setIsAdding(false)} className="px-4 bg-white/5 text-gray-400 rounded-lg py-2 text-xs font-bold">Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="pt-4">
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-xs font-bold hover:border-indigo-500/50 hover:text-indigo-400 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={14} /> Add new PAN
                            </button>
                        </div>
                    )}
                </div>
            </BottomSheet>
        </div>
    );
};

export default AllotmentScreen;
