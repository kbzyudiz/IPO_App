import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertCircle } from 'lucide-react';

interface TradeCall {
    id: string;
    stock: string;
    type: 'BUY' | 'SELL';
    entry: string;
    target: string;
    stopLoss: string;
    status: 'ACTIVE' | 'HIT' | 'SL_HIT';
    time: string;
    analyst: string;
}

const MOCK_CALLS: TradeCall[] = [
    {
        id: '1',
        stock: 'ZOMATO',
        type: 'BUY',
        entry: '265.50 - 268.00',
        target: '295.00',
        stopLoss: '252.00',
        status: 'ACTIVE',
        time: '45m ago',
        analyst: 'Equity Master'
    },
    {
        id: '2',
        stock: 'TATA MOTORS',
        type: 'BUY',
        entry: '942.00',
        target: '1020.00',
        stopLoss: '915.00',
        status: 'ACTIVE',
        time: '2h ago',
        analyst: 'Pro Trader'
    },
    {
        id: '3',
        stock: 'HDFC BANK',
        type: 'SELL',
        entry: '1720.00',
        target: '1640.00',
        stopLoss: '1765.00',
        status: 'HIT',
        time: 'Yesterday',
        analyst: 'Market Pulse'
    }
];

export const TradingCallsScreen = () => {
    const [calls] = useState<TradeCall[]>(MOCK_CALLS);

    return (
        <div className="pb-24">
            <h1 className="text-2xl font-outfit font-bold mb-6">Pro <span className="text-indigo-400">Trade Calls</span></h1>

            <div className="space-y-4">
                {calls.map((call, idx) => (
                    <motion.div
                        key={call.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card p-4 rounded-2xl relative overflow-hidden"
                    >
                        {/* Status Tag */}
                        <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase rounded-bl-xl ${call.status === 'ACTIVE' ? 'bg-indigo-500 text-white' :
                            call.status === 'HIT' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                            }`}>
                            {call.status === 'HIT' ? 'Target Hit' : call.status}
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{call.stock}</h3>
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                    by <span className="text-indigo-300">{call.analyst}</span> • {call.time}
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${call.type === 'BUY'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                {call.type}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white/5 p-2 rounded-lg text-center">
                                <div className="text-[10px] text-gray-500 uppercase">Entry</div>
                                <div className="text-sm font-bold text-white">{call.entry}</div>
                            </div>
                            <div className="bg-white/5 p-2 rounded-lg text-center border border-emerald-500/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/5" />
                                <div className="text-[10px] text-emerald-400 uppercase flex items-center justify-center gap-1">
                                    <Target size={10} /> Target
                                </div>
                                <div className="text-sm font-bold text-emerald-300">{call.target}</div>
                            </div>
                            <div className="bg-white/5 p-2 rounded-lg text-center border border-rose-500/10 relative overflow-hidden">
                                <AlertCircle size={40} className="absolute -right-2 -bottom-2 text-rose-500/5" />
                                <div className="text-[10px] text-rose-400 uppercase">Stoploss</div>
                                <div className="text-sm font-bold text-rose-300">{call.stopLoss}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center">
                <p className="text-xs text-indigo-300 leading-relaxed">
                    Disclaimer: These calls are for educational purposes only.
                    Please consult your financial advisor before trading.
                </p>
            </div>
        </div>
    );
};
