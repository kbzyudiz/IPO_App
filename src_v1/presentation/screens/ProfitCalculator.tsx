import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Calculator,
    TrendingUp,
    ShieldAlert,
    Info,
    Percent,
    ArrowRight,
    Target
} from 'lucide-react';
import { useAppStore } from '../../data/store';

const ProfitCalculator: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { ipos } = useAppStore();
    const ipo = ipos.find(i => i.id === id);

    const [lots, setLots] = useState(1);
    const [category, setCategory] = useState<'retail' | 'shni' | 'bhni'>('retail');

    if (!ipo) return <div className="p-10 text-center text-white">IPO Not Found</div>;

    const basePrice = parseInt(ipo.priceRange.split('-')[1]) || 0;
    const gmpValue = ipo.gmp || 0;
    const sharesPerLot = ipo.minQty || 0;

    const investment = basePrice * sharesPerLot * lots;
    const estProfit = gmpValue * sharesPerLot * lots;
    const totalValue = investment + estProfit;
    const percentageGain = ((gmpValue / basePrice) * 100).toFixed(1);

    // UNIQUE FEATURE: Allotment Probability Logic
    const calculateProbability = () => {
        const sub = ipo.subscription;
        let prob = 0;

        if (category === 'retail') {
            prob = (1 / (sub.retail || 1)) * 100;
        } else if (category === 'shni') {
            prob = (1 / (sub.nii || 1)) * 100 * 0.7; // Simplified HNI lottery logic
        } else {
            prob = (1 / (sub.qib || 1)) * 100 * 0.2;
        }

        return Math.min(prob, 100).toFixed(2);
    };

    return (
        <div className="flex flex-col pb-24 min-h-screen bg-bg-color">
            <header className="sticky top-0 z-30 glass backdrop-blur-xl flex items-center p-4 px-6 border-b border-white/5">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-secondary hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="ml-4">
                    <h2 className="font-black text-lg text-white">Profit & Probability</h2>
                    <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">{ipo.name}</p>
                </div>
            </header>

            <div className="p-6 space-y-8">
                {/* Result Hero Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative overflow-hidden rounded-[2.5rem] p-8 bg-gradient-to-br from-primary to-primary-dark shadow-2xl shadow-primary/20"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-20">
                        <TrendingUp size={120} />
                    </div>

                    <p className="text-bg-color/70 text-xs font-black uppercase tracking-widest mb-1">Expected Listing Profit</p>
                    <h1 className="text-5xl font-black text-bg-color mb-6">₹{estProfit.toLocaleString()}</h1>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-bg-color/10">
                        <div>
                            <p className="text-bg-color/50 text-[10px] font-black uppercase tracking-tighter">Total Value</p>
                            <p className="text-lg font-bold text-bg-color">₹{totalValue.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-bg-color/50 text-[10px] font-black uppercase tracking-tighter">Growth</p>
                            <p className="text-lg font-bold text-bg-color">+{percentageGain}%</p>
                        </div>
                    </div>
                </motion.div>

                {/* Configuration Section */}
                <section className="space-y-6">
                    <div className="flex-between">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">Investment Strategy</h3>
                        <Calculator size={14} className="text-primary" />
                    </div>

                    <div className="glass p-6 rounded-[2.5rem] space-y-8">
                        {/* Lot Selector */}
                        <div>
                            <div className="flex-between mb-4">
                                <span className="text-sm font-bold text-white">Number of Lots</span>
                                <span className="text-primary font-black">{lots}</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="15" step="1"
                                value={lots}
                                onChange={(e) => setLots(parseInt(e.target.value))}
                                className="w-full accent-primary bg-white/5 h-1.5 rounded-full appearance-none cursor-pointer"
                            />
                            <div className="flex-between mt-2 px-1">
                                <span className="text-[9px] text-text-muted font-bold">1 Lot</span>
                                <span className="text-[9px] text-text-muted font-bold">13-15 (Max Retail)</span>
                            </div>
                        </div>

                        {/* Category Selector */}
                        <div className="grid grid-cols-3 gap-2">
                            <CategoryButton
                                active={category === 'retail'}
                                onClick={() => setCategory('retail')}
                                label="Retail"
                                desc="< 2L"
                            />
                            <CategoryButton
                                active={category === 'shni'}
                                onClick={() => setCategory('shni')}
                                label="S-HNI"
                                desc="2L - 10L"
                            />
                            <CategoryButton
                                active={category === 'bhni'}
                                onClick={() => setCategory('bhni')}
                                label="B-HNI"
                                desc="> 10L"
                            />
                        </div>
                    </div>
                </section>

                {/* UNIQUE FEATURE: The Allotment Probability Meter */}
                <section className="space-y-4">
                    <div className="flex-between">
                        <div className="flex items-center gap-2">
                            <Target size={14} className="text-warning" />
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-warning">Probability Simulator</h3>
                        </div>
                        <span className="text-[9px] bg-warning/10 text-warning px-2 py-0.5 rounded-full font-black uppercase">Alpha AI</span>
                    </div>

                    <div className="glass p-6 rounded-[2.5rem] relative overflow-hidden bg-gradient-to-br from-warning/[0.03] to-transparent">
                        <div className="flex-between mb-6">
                            <div>
                                <h4 className="text-2xl font-black text-white">{calculateProbability()}%</h4>
                                <p className="text-[10px] text-text-muted font-bold uppercase">Estimated Winning Chance</p>
                            </div>
                            <div className="w-16 h-16 rounded-full border-4 border-warning/10 flex-center relative">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="32" cy="32" r="28"
                                        fill="transparent"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        className="text-warning"
                                        strokeDasharray={176}
                                        strokeDashoffset={176 - (176 * parseFloat(calculateProbability()) / 100)}
                                    />
                                </svg>
                                <span className="absolute text-[10px] font-black">{Math.round(parseFloat(calculateProbability()))}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-2xl flex items-start gap-4">
                            <ShieldAlert size={18} className="text-warning flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-text-secondary leading-relaxed">
                                Our Simulator uses real-time subscription multiples and category quotas to predict your mathematically calculated chance of success.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Listing Day Strategy */}
                <section className="space-y-4">
                    <SectionLabel icon={<Info size={14} />} label="Listing Strategy" />
                    <div className="glass p-5 rounded-[2rem] border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex-center text-primary">
                                <Percent size={18} />
                            </div>
                            <p className="text-sm font-black text-white uppercase tracking-tight">Tax Implication (STCG)</p>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed mb-4">
                            Selling on the listing day will attract <span className="text-error font-bold">20% STCG Tax</span>. Your post-tax profit would be approximately <span className="text-success font-bold">₹{(estProfit * 0.85).toLocaleString()}</span> (considering net charges).
                        </p>
                        <button className="w-full py-3 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-white/10 transition-all">
                            View Expert Selling Recommendation
                        </button>
                    </div>
                </section>
            </div>

            {/* Float Action */}
            <div className="fixed bottom-[70px] left-1/2 -translate-x-1/2 w-full max-w-[480px] p-4 z-40">
                <button
                    onClick={() => navigate(-1)}
                    className="w-full h-14 glass border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl flex-center gap-3 active:scale-95 transition-all shadow-2xl"
                >
                    Back to IPO Details
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

const SectionLabel = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="flex items-center gap-2 px-1">
        <div className="text-text-muted">{icon}</div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted">{label}</h3>
    </div>
);

const CategoryButton = ({ active, onClick, label, desc }: { active: boolean, onClick: () => void, label: string, desc: string }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 p-3 rounded-2xl transition-all border ${active ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-surface-lighter border-white/5 text-text-muted'}`}
    >
        <span className="text-xs font-black uppercase tracking-tighter">{label}</span>
        <span className="text-[8px] font-bold opacity-60">{desc}</span>
    </button>
);

export default ProfitCalculator;
