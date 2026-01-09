import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, ExternalLink } from 'lucide-react';
import { TradeCallsService, type TradeCall } from '../../services/TradeCallsService';
import PremiumLoader from '../components/PremiumLoader';

export const TradingCallsScreen = () => {
    const [calls, setCalls] = useState<TradeCall[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            const data = await TradeCallsService.fetchCalls();
            setCalls(data);
            setIsLoading(false);
        };
        fetch();
    }, []);

    if (isLoading) return <PremiumLoader message="Scanning Broker Reports..." />;

    return (
        <div className="pb-24 pt-4 px-4 bg-[#030305] min-h-screen text-white">
            <h1 className="text-2xl font-black mb-6 tracking-tighter">Pro <span className="text-indigo-400">Trade Calls</span></h1>

            {calls.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <p className="text-gray-400">No active calls found today.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {calls.map((call, idx) => (
                        <motion.div
                            key={call.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-5 rounded-[1.5rem] relative overflow-hidden group border border-white/5 hover:border-indigo-500/30 transition-all"
                        >
                            {/* Analysis Tag */}
                            <div className="absolute top-0 right-0 bg-white/5 px-3 py-1 rounded-bl-xl border-l border-b border-white/5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{call.broker}</span>
                            </div>

                            <div className="flex justify-between items-start mb-4 mt-2">
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight">{call.stock}</h3>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">
                                        {new Date(call.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${call.action === 'BUY'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : call.action === 'SELL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    }`}>
                                    {call.action}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/5 p-3 rounded-xl border border-emerald-500/10 relative overflow-hidden">
                                    <div className="text-[9px] text-emerald-400 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                                        <Target size={10} /> Target
                                    </div>
                                    <div className="text-lg font-black text-emerald-300">{call.target}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5 relative overflow-hidden">
                                    <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-1">
                                        Stoploss
                                    </div>
                                    <div className="text-lg font-black text-gray-300">{call.stopLoss}</div>
                                </div>
                            </div>

                            <a
                                href={call.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 rounded-xl bg-white/5 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:bg-white/10 transition-all"
                            >
                                View Report <ExternalLink size={12} />
                            </a>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-8 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center">
                <p className="text-[10px] text-indigo-300 leading-relaxed font-medium opacity-80">
                    Disclaimer: These calls are aggregated from brokereage research reports.
                    Not financial advice. Trade at your own risk.
                </p>
            </div>
        </div>
    );
};
