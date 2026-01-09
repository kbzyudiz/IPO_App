import { Bell } from 'lucide-react';
import { useAppStore } from '../../data/store';
import { useNavigate } from 'react-router-dom';

const AlertCenter = () => {
    const { alerts } = useAppStore();
    const navigate = useNavigate();
    const unreadCount = alerts.filter(a => !a.isRead).length;

    return (
        <button
            onClick={() => navigate('/alerts')}
            className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
            <Bell size={20} className="text-gray-400" />
            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                </div>
            )}
        </button>
    );
};

export default AlertCenter;
