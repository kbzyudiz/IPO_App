import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, Zap, TrendingUp, Clock, CheckCircle2, Trash2 } from 'lucide-react';
import { useAppStore } from '../../data/store';
import { useNavigate } from 'react-router-dom';

const AlertCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { alerts, markAlertRead, clearAllAlerts } = useAppStore();
    const navigate = useNavigate();

    const unreadCount = alerts.filter(a => !a.isRead).length;

    const getIcon = (category: string) => {
        switch (category) {
            case 'new_ipo': return <Zap size={18} className="text-primary" />;
            case 'gmp_spike': return <TrendingUp size={18} className="text-success" />;
            case 'status_change': return <Clock size={18} className="text-warning" />;
            case 'closing_soon': return <Info size={18} className="text-error" />;
            default: return <Bell size={18} className="text-gray-400" />;
        }
    };

    const handleAlertClick = (alert: any) => {
        markAlertRead(alert.id);
        if (alert.ipoId) {
            setIsOpen(false);
            navigate(`/ipo/${alert.ipoId}`);
        }
    };

    return (
        <>
            {/* Bell Trigger */}
            <button
                onClick={() => setIsOpen(true)}
                className="p-3 rounded-full bg-gray-50 text-gray-500 hover:text-primary transition-colors border border-gray-100/50 relative"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2.5 right-2.5 w-4 h-4 bg-primary text-white text-[8px] font-black flex-center rounded-full border-2 border-white"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Notification Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-[200]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[201] flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Market Alerts</h2>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Smart Intelligence System</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
                                {alerts.length === 0 ? (
                                    <div className="flex-center flex-col h-full opacity-30 text-center px-10">
                                        <Bell size={64} className="mb-4" />
                                        <p className="text-sm font-bold">No active alerts</p>
                                        <p className="text-[10px] uppercase font-black tracking-widest mt-2">We'll notify you of GMP spikes and Listing gains.</p>
                                    </div>
                                ) : (
                                    alerts.map((alert) => (
                                        <motion.div
                                            key={alert.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            onClick={() => handleAlertClick(alert)}
                                            className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${alert.isRead
                                                    ? 'bg-gray-50/50 border-gray-100'
                                                    : 'bg-white border-primary/20 shadow-lg shadow-primary/5'
                                                }`}
                                        >
                                            {!alert.isRead && (
                                                <div className="absolute top-0 right-0 w-12 h-12 bg-primary/5 rounded-bl-[100px] flex items-start justify-end p-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                </div>
                                            )}

                                            <div className="flex gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex-center shrink-0 ${alert.type === 'critical' ? 'bg-error/10 text-error' :
                                                        alert.type === 'success' ? 'bg-success/10 text-success' :
                                                            alert.type === 'warning' ? 'bg-warning/10 text-warning' : 'bg-primary/10 text-primary'
                                                    }`}>
                                                    {getIcon(alert.category)}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className={`text-[13px] font-black leading-tight ${alert.isRead ? 'text-gray-600' : 'text-gray-900'
                                                        }`}>
                                                        {alert.title}
                                                    </h3>
                                                    <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
                                                        {alert.message}
                                                    </p>
                                                    <div className="flex items-center gap-2 pt-1">
                                                        <span className="text-[9px] font-black text-gray-300 uppercase underline decoration-gray-200">
                                                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {alert.isRead && <CheckCircle2 size={12} className="text-success" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {alerts.length > 0 && (
                                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                    <button
                                        onClick={clearAllAlerts}
                                        className="w-full py-4 bg-white border border-gray-200 rounded-2xl flex-center gap-2 text-[11px] font-black text-gray-500 hover:text-error hover:border-error/20 transition-all uppercase tracking-widest shadow-sm"
                                    >
                                        <Trash2 size={14} /> Clear Notifications
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style>{`
                .flex-center { display: flex; align-items: center; justify-content: center; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </>
    );
};

export default AlertCenter;
