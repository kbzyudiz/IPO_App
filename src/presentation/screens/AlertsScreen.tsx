import { useState } from 'react';
import { useAppStore } from '../../data/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Clock, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { type SmartAlert } from '../../core/types';

export const AlertsScreen = () => {
    const { alerts, markAlertRead, clearAllAlerts } = useAppStore();
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

    const filteredAlerts = filter === 'ALL'
        ? alerts
        : alerts.filter(a => !a.isRead);

    const getIcon = (type: SmartAlert['type']) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-emerald-400" size={20} />;
            case 'warning': return <AlertTriangle className="text-amber-400" size={20} />;
            case 'critical': return <Clock className="text-rose-400" size={20} />;
            default: return <Info className="text-blue-400" size={20} />;
        }
    };

    const formatTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (mins > 0) return `${mins}m ago`;
        return 'Just now';
    };

    return (
        <div className="pb-32 bg-[#030305] min-h-screen text-white">
            <div className="flex items-center justify-between p-4 mb-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter">Smart <span className="text-indigo-400">Alerts</span></h1>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Real-time Notifications</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter(filter === 'ALL' ? 'UNREAD' : 'ALL')}
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border transition-all ${filter === 'UNREAD'
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 font-black'
                            : 'bg-white/5 border-white/5 text-gray-400'
                            }`}
                    >
                        {filter === 'ALL' ? 'Show Unread' : 'Show All'}
                    </button>
                    {alerts.length > 0 && (
                        <button
                            onClick={clearAllAlerts}
                            className="p-2 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/10 hover:bg-rose-500/20 transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="px-4 space-y-4">
                <AnimatePresence mode='popLayout'>
                    {filteredAlerts.length > 0 ? (
                        filteredAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => markAlertRead(alert.id)}
                                className={`glass-card p-5 rounded-2xl relative overflow-hidden transition-all border ${alert.isRead ? 'border-white/5 opacity-60' : 'border-indigo-500/30 bg-indigo-500/5'
                                    }`}
                            >
                                {!alert.isRead && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
                                )}

                                <div className="flex gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/5 shadow-inner`}>
                                        {getIcon(alert.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className={`font-black text-sm tracking-tight ${alert.isRead ? 'text-gray-400' : 'text-white'}`}>
                                                {alert.title}
                                            </h3>
                                            <span className="text-[9px] text-gray-500 font-bold whitespace-nowrap ml-2 uppercase tracking-widest">
                                                {formatTime(alert.timestamp)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                                            {alert.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 opacity-30 flex flex-col items-center gap-4"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-400 border border-white/5">
                                <Bell size={40} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silence is Golden</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
