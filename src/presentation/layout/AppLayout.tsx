import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { TrendingUp, Newspaper, User, Radio, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export const AppLayout = () => {
    const location = useLocation();

    // Hide bottom nav on detail pages if needed
    const showBottomNav = !location.pathname.includes('/ipo/');

    const navItems = [
        { id: 'discovery', icon: TrendingUp, label: 'Market', path: '/' },
        { id: 'calls', icon: Target, label: 'Calls', path: '/calls' },
        { id: 'allotment', icon: Radio, label: 'Allotment', path: '/allotment' },
        { id: 'news', icon: Newspaper, label: 'News', path: '/news' },
        { id: 'profile', icon: User, label: 'Profile', path: '/profile' }
    ];

    return (
        <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-indigo-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[100px] mix-blend-screen"></div>
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 max-w-md mx-auto min-h-screen p-4 pb-24">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            {showBottomNav && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
                    <nav className="max-w-md mx-auto rounded-[2.5rem] flex items-center justify-around p-2 shadow-2xl shadow-black/80 border border-white/5 backdrop-blur-3xl bg-black/40">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={`relative p-3.5 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 group outline-none tap-highlight-transparent ${isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-indigo-500/10 rounded-2xl border border-indigo-500/10"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <item.icon
                                        size={22}
                                        strokeWidth={isActive ? 3 : 2}
                                        className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                                    />
                                    {isActive && (
                                        <span className="text-[8px] font-black uppercase tracking-widest relative z-10">
                                            {item.label}
                                        </span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            )}
        </div>
    );
};
