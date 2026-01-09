import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CheckCircle, Newspaper, User } from 'lucide-react';

const BottomNav: React.FC = () => {
    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[70px] glass border-t border-white/5 flex justify-around items-center z-50 px-4">
            <NavItem to="/" icon={<Home size={22} />} label="Home" />
            <NavItem to="/allotment" icon={<CheckCircle size={22} />} label="Allotment" />
            <NavItem to="/news" icon={<Newspaper size={22} />} label="News" />
            <NavItem to="/profile" icon={<User size={22} />} label="Profile" />
        </nav>
    );
};

const NavItem: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-text-muted hover:text-text-secondary'}`}
    >
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </NavLink>
);

export default BottomNav;
