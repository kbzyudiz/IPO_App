import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info, Mail, HelpCircle, Phone, LogOut, ChevronRight, Edit3, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../data/store';
import PremiumLoader from '../components/PremiumLoader';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    action?: () => void;
    extra?: string;
    toggle?: boolean;
    initial?: boolean;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const ProfileScreen: React.FC = () => {
    const navigate = useNavigate();
    const { userName, userEmail, installDate, watchlist, updateProfile, resetAllData, syncMarketData, lastScraped, isLoading } = useAppStore();
    const [isEditing, setIsEditing] = useState(false);
    const [tempName, setTempName] = useState(userName);
    const [tempEmail, setTempEmail] = useState(userEmail);

    const handleSave = () => {
        updateProfile(tempName, tempEmail);
        setIsEditing(false);
    };

    const handleRefresh = async () => {
        await syncMarketData();
    };

    const getLastSyncTime = () => {
        if (!lastScraped) return 'Never';
        const date = new Date(lastScraped);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };

    const sections: MenuSection[] = [
        {
            title: 'About the App',
            items: [
                { icon: <HelpCircle size={18} />, label: 'About IPO Watch', action: () => navigate('/info/about') },
                { icon: <Info size={18} />, label: 'Market Disclaimer', action: () => navigate('/info/disclaimer') },
                { icon: <Mail size={18} />, label: 'Terms & Conditions', action: () => navigate('/info/terms') },
            ]
        },
        {
            title: 'Operations',
            items: [
                {
                    icon: <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />,
                    label: 'Sync Live Data',
                    action: handleRefresh,
                    extra: getLastSyncTime()
                },
                { icon: <Phone size={18} />, label: 'Contact Support' },
            ]
        }
    ];

    if (isLoading) return <PremiumLoader message="Analyzing market trends..." />;

    return (
        <div className="p-6 pb-24 flex flex-col gap-8 bg-bg-color min-h-screen">
            <header className="flex-between">
                <h1 className="text-2xl font-black text-text-primary">Profile</h1>
                <button className="w-10 h-10 rounded-full glass flex-center text-text-secondary shadow-sm" onClick={() => setIsEditing(!isEditing)}>
                    <Edit3 size={18} />
                </button>
            </header>

            {/* Profile Card */}
            <section className="glass p-6 rounded-[2.5rem] bg-gradient-to-br from-surface-card to-white border-border shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>

                <div className="flex items-center gap-6 mb-8 relative z-10">
                    <div className="w-20 h-20 rounded-full glass border-2 border-primary/20 flex-center bg-primary/5">
                        <span className="text-2xl font-black text-primary">
                            {userName.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    className="bg-surface-lighter border border-border rounded-lg px-2 py-1 text-sm text-text-primary outline-none focus:border-primary"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                />
                                <input
                                    className="bg-surface-lighter border border-border rounded-lg px-2 py-1 text-sm text-text-primary outline-none focus:border-primary mt-1"
                                    value={tempEmail}
                                    onChange={(e) => setTempEmail(e.target.value)}
                                />
                                <button onClick={handleSave} className="text-[10px] text-white font-black uppercase tracking-widest self-start bg-primary px-4 py-2 rounded-full mt-2 shadow-sm">Save Changes</button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-black text-text-primary truncate">{userName}</h2>
                                <p className="text-sm text-text-muted truncate mb-2 font-medium">{userEmail}</p>
                                <span className="text-[10px] bg-surface-lighter px-3 py-1 rounded-full text-text-muted font-black tracking-wider uppercase">Member Since {installDate}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-surface-lighter/50 rounded-2xl p-4 text-center border border-border/50">
                        <p className="text-2xl font-black text-primary">12</p>
                        <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1">IPOs Applied</p>
                    </div>
                    <div className="bg-surface-lighter/50 rounded-2xl p-4 text-center border border-border/50">
                        <p className="text-2xl font-black text-primary">{watchlist.length}</p>
                        <p className="text-[9px] text-text-muted font-black uppercase tracking-widest mt-1">Watching</p>
                    </div>
                </div>
            </section>

            {/* Menus */}
            <div className="flex flex-col gap-8">
                {sections.map((section, idx) => (
                    <div key={idx} className="flex flex-col gap-4">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted ml-2">{section.title}</h3>
                        <div className="glass rounded-[2rem] overflow-hidden divide-y divide-border border-border shadow-sm">
                            {section.items.map((item, i) => (
                                <div key={i} className="p-5 flex-between hover:bg-surface-lighter/50 transition-colors cursor-pointer group" onClick={item.action}>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-surface-lighter rounded-xl text-text-muted group-hover:text-primary transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="text-sm font-bold text-text-secondary">{item.label}</span>
                                    </div>
                                    {item.toggle ? (
                                        <Toggle active={item.initial || false} />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            {item.extra && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{item.extra}</span>}
                                            <ChevronRight size={18} className="text-text-muted" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={() => {
                    resetAllData();
                    navigate('/');
                }}
                className="w-full py-4 bg-error/10 text-error font-black uppercase tracking-[0.2em] rounded-2xl flex-center gap-2 border border-error/20 mb-4 active:bg-error/20 shadow-sm transition-all"
            >
                <LogOut size={20} />
                Reset & Log Out
            </button>

            <div className="text-center opacity-30 mt-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-primary">IPO Watch v1.1.0</p>
                <p className="text-[8px] text-text-muted mt-2">© 2025 PR MEDIA LABS</p>
            </div>
        </div>
    );
};

const Toggle = ({ active }: { active: boolean }) => {
    const [isOn, setIsOn] = useState(active);
    return (
        <button
            onClick={(e) => { e.stopPropagation(); setIsOn(!isOn); }}
            className={`w-11 h-6 rounded-full p-1 transition-all duration-300 relative ${isOn ? 'bg-primary' : 'bg-surface-lighter border border-white/5'}`}
        >
            <motion.div
                animate={{ x: isOn ? 20 : 0 }}
                className="w-4 h-4 rounded-full bg-white shadow-lg"
            />
        </button>
    );
};

export default ProfileScreen;
