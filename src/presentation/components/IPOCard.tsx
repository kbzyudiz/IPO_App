import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, IndianRupee, ArrowRight, Zap } from 'lucide-react';
import { type IPO } from '../../core/types';
import { useNavigate } from 'react-router-dom';

interface IPOCardProps {
    ipo: IPO;
    index?: number;
    showDetails?: boolean;
}

const IPOCard: React.FC<IPOCardProps> = ({ ipo, index = 0, showDetails = true }) => {
    const navigate = useNavigate();
    const gmpValue = ipo.gmp || 0;
    const priceStr = ipo.priceRange?.split('-')[1] || ipo.priceRange || '0';
    const price = parseInt(priceStr) || 1;
    const gmpPercent = ((gmpValue / price) * 100).toFixed(1);

    const statusConfig = {
        open: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: 'Open' },
        closed: { color: 'text-rose-400 bg-rose-400/10 border-rose-400/20', label: 'Closed' },
        upcoming: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', label: 'Upcoming' },
        announced: { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', label: 'Announced' }
    };

    const config = statusConfig[ipo.status] || statusConfig.announced;
    const retailProfit = gmpValue * (ipo.minQty || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="glass-card rounded-3xl border-white/10 overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 cursor-pointer shadow-xl"
            onClick={() => navigate(`/ipo/${ipo.id}`)}
        >
            <div className="p-4">
                {/* Header: Logo, Name, Status */}
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-white/5 rounded-xl p-2 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <img src={ipo.logo} alt="" className="w-full h-full object-contain brightness-0 invert opacity-80" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-outfit font-black text-base text-white leading-tight truncate">
                                {ipo.name}
                            </h3>
                            <p className="text-[8px] text-indigo-400/80 font-black uppercase tracking-widest truncate">
                                {ipo.sector} • {ipo.type}
                            </p>
                        </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full border border-opacity-50 ${config.color}`}>
                        {config.label}
                    </span>
                </div>

                {/* Main Metrics: Tighter Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden">
                        <div className="flex items-center gap-1.5 text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">
                            <IndianRupee size={10} className="text-indigo-400" />
                            Offer Price
                        </div>
                        <div className="font-outfit font-black text-sm text-white">₹{ipo.priceRange}</div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden">
                        <div className="flex items-center gap-1.5 text-gray-500 text-[8px] font-black uppercase tracking-widest mb-1">
                            <TrendingUp size={10} className="text-emerald-400" />
                            GMP
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-outfit font-black text-sm text-emerald-400">₹{gmpValue}</span>
                            <span className="text-[8px] text-emerald-400/60 font-black">{gmpPercent}%</span>
                        </div>
                    </div>
                </div>

                {showDetails && (
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <Zap size={10} className="text-amber-400" />
                                <span className="text-[9px] font-black text-white/90 uppercase tracking-tight">₹{retailProfit.toLocaleString()} <span className="text-[7px] text-gray-500">PROFIT</span></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar size={10} className="text-indigo-400" />
                                <span className="text-[8px] font-black text-white/70 uppercase tracking-tight">{ipo.startDate} - {ipo.endDate}</span>
                            </div>
                        </div>
                        <button
                            className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                        >
                            <ArrowRight size={12} />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default IPOCard;
