import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, Info, ArrowRight, ShieldCheck } from 'lucide-react';
import { type IPO } from '../../core/types';

interface ReadinessModeProps {
    ipo: IPO;
}

interface Task {
    label: string;
    type: 'check' | 'wait' | 'blocked' | 'info';
    id: string;
}

const ReadinessMode: React.FC<ReadinessModeProps> = ({ ipo }) => {
    const getReadinessContent = (): { tasks: Task[]; stage: string; color: string } => {
        const now = new Date();
        const start = new Date(ipo.startDate);
        const end = new Date(ipo.endDate);
        const listing = ipo.listingDate ? new Date(ipo.listingDate) : null;

        // Find Allotment Date from schedule
        const allotmentStr = ipo.schedule.find(s => s.event.toLowerCase().includes('allotment'))?.date;
        const allotment = allotmentStr ? new Date(allotmentStr) : null;

        // Stage: UPCOMING
        if (now < start) {
            return {
                stage: 'Preparation Mode',
                color: 'primary',
                tasks: [
                    { id: '1', label: 'Review basic company financials', type: 'check' },
                    { id: '2', label: 'Check price band & lot size', type: 'check' },
                    { id: '3', label: 'Ensure Demat account is active', type: 'check' },
                    { id: '4', label: 'Subscription trend (Starts on opening)', type: 'wait' }
                ]
            };
        }

        // Stage: OPEN
        if (now >= start && now <= end) {
            return {
                stage: 'Action Mode (IPO Open)',
                color: 'success',
                tasks: [
                    { id: '1', label: 'Monitor Live GMP strength', type: 'check' },
                    { id: '2', label: 'Observe QIB & Retail interest', type: 'check' },
                    { id: '3', label: 'Submit bid before 4:30 PM (End Date)', type: 'check' },
                    { id: '4', label: 'Allotment check (Available after closing)', type: 'blocked' }
                ]
            };
        }

        // Stage: CLOSED / WAITING
        if (now > end && (!allotment || now < allotment)) {
            return {
                stage: 'Waiting Mode',
                color: 'warning',
                tasks: [
                    { id: '1', label: 'Subscription period successfully ended', type: 'check' },
                    { id: '2', label: 'Funds are blocked in your bank account', type: 'info' },
                    { id: '3', label: 'Watch for allotment finalization', type: 'wait' },
                    { id: '4', label: 'Check status once registrar publishes data', type: 'blocked' }
                ]
            };
        }

        // Stage: ALLOTMENT DAY
        if (allotment && now.toDateString() === allotment.toDateString()) {
            return {
                stage: 'Action Mode (Allotment Day)',
                color: 'primary',
                tasks: [
                    { id: '1', label: 'Keep your PAN number ready', type: 'check' },
                    { id: '2', label: 'Check status on Registrar website', type: 'check' },
                    { id: '3', label: 'Mandate release (If not allotted)', type: 'wait' },
                    { id: '4', label: 'Shares credit (If allotted)', type: 'wait' }
                ]
            };
        }

        // Stage: LISTING PREP / DAY
        if (listing && now <= listing) {
            return {
                stage: 'Listing Readiness',
                color: 'success',
                tasks: [
                    { id: '1', label: 'Listing price announced at 10:00 AM', type: 'check' },
                    { id: '2', label: 'Pre-open session (9:00 - 9:45 AM)', type: 'check' },
                    { id: '3', label: 'Expect high volatility at open', type: 'info' },
                    { id: '4', label: 'GMP values are no longer relevant', type: 'blocked' }
                ]
            };
        }

        // DEFAULT / POST-LISTING
        return {
            stage: 'Post-Listing Info',
            color: 'text-muted',
            tasks: [
                { id: '1', label: 'Trading regularly on NSE/BSE', type: 'check' },
                { id: '2', label: 'Check current market price', type: 'info' },
                { id: '3', label: 'Compare with IPO price range', type: 'info' }
            ]
        };
    };

    const content = getReadinessContent();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-border shadow-xl overflow-hidden"
        >
            <div className={`p-5 px-6 bg-${content.color}/5 border-b border-${content.color}/10 flex-between`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-white shadow-sm flex-center text-${content.color}`}>
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h4 className="text-[14px] font-black text-text-primary tracking-tight">Today's IPO Readiness</h4>
                        <p className={`text-[9px] font-black uppercase tracking-widest text-${content.color} opacity-80 mt-0.5`}>
                            {content.stage}
                        </p>
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/50 flex-center border border-white">
                    <ArrowRight size={14} className="text-text-muted opacity-40" />
                </div>
            </div>

            <div className="p-6 space-y-4">
                {content.tasks.map((task) => (
                    <div key={task.id} className="flex gap-4 items-start group">
                        <div className="mt-0.5 shrink-0">
                            {task.type === 'check' && (
                                <div className={`w-5 h-5 rounded-full border-2 border-${content.color}/30 flex-center text-${content.color}`}>
                                    <CheckCircle2 size={12} strokeWidth={3} />
                                </div>
                            )}
                            {task.type === 'wait' && (
                                <div className="w-5 h-5 rounded-full border-2 border-warning/30 flex-center text-warning">
                                    <Clock size={12} strokeWidth={3} />
                                </div>
                            )}
                            {task.type === 'info' && (
                                <div className="w-5 h-5 rounded-full border-2 border-primary/30 flex-center text-primary">
                                    <Info size={12} strokeWidth={3} />
                                </div>
                            )}
                            {task.type === 'blocked' && (
                                <div className="w-5 h-5 rounded-full border-2 border-text-muted/20 flex-center text-text-muted/40">
                                    <AlertCircle size={12} strokeWidth={3} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className={`text-xs font-bold leading-relaxed ${task.type === 'blocked' ? 'text-text-muted/60 line-through decoration-text-muted/30' : 'text-text-primary'}`}>
                                {task.label}
                            </p>
                        </div>
                    </div>
                ))}

                <div className="mt-4 pt-4 border-t border-border/40">
                    <p className="text-[8px] text-text-muted font-bold text-center uppercase tracking-widest leading-loose opacity-60">
                        This checklist is informational and<br />does not constitute investment advice.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default ReadinessMode;
