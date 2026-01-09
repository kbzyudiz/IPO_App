import React from 'react';
import { motion } from 'framer-motion';
import { Users, User, Shield, Briefcase } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SubscriptionData {
    total: number;
    retail: number;
    qib: number;
    nii: number;
}

interface SubscriptionHeatmapProps {
    data: SubscriptionData;
    className?: string;
}

const SubscriptionHeatmap: React.FC<SubscriptionHeatmapProps> = ({ data, className }) => {
    const categories = [
        { key: 'total', label: 'Overall', icon: Users, color: 'from-blue-500 to-indigo-600', val: data.total },
        { key: 'qib', label: 'QIB', icon: Shield, color: 'from-purple-500 to-pink-600', val: data.qib },
        { key: 'nii', label: 'NII', icon: Briefcase, color: 'from-orange-500 to-red-600', val: data.nii },
        { key: 'retail', label: 'Retail', icon: User, color: 'from-emerald-500 to-teal-600', val: data.retail },
    ];

    const maxVal = Math.max(...categories.map(c => c.val), 1);

    return (
        <div className={cn("bg-surface-card border border-border rounded-[2.5rem] p-6 shadow-xl", className)}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-text-primary flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary rounded-full" />
                    Subscription Heatmap
                </h3>
                <div className="text-[10px] text-primary font-black px-2.5 py-1 bg-primary/10 rounded-lg border border-primary/20 tracking-widest uppercase">
                    Live Status
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {categories.map((cat, index) => {
                    const percentage = (cat.val / maxVal) * 100;
                    const Icon = cat.icon;

                    return (
                        <motion.div
                            key={cat.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group overflow-hidden"
                        >
                            <div className="bg-surface-lighter/50 border border-border rounded-2xl p-4 relative z-10 h-full hover:bg-surface-lighter transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={cn("p-2 rounded-xl bg-gradient-to-br text-white shadow-md", cat.color)}>
                                        <Icon size={18} />
                                    </div>
                                    <span className="text-2xl font-black text-text-primary">
                                        {cat.val}x
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-text-muted">
                                        <span>{cat.label}</span>
                                        <span>{Math.round(percentage)}% intensity</span>
                                    </div>

                                    <div className="h-2 w-full bg-surface-lighter rounded-full overflow-hidden border border-border/50">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut", delay: 0.5 + (index * 0.1) }}
                                            className={cn("h-full rounded-full shadow-sm", cat.color)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-[10px] text-text-muted border-t border-border pt-4 font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Hourly Updates
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    BSE & NSE Combined
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHeatmap;
