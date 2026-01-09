import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type IPO, type MarketMetrics, type IPOInsight, type SmartAlert, type NewsItem } from '../core/types';
import { IPOService } from './services';
import { IPODataScraper } from './scraper';

interface AppState {
    ipos: IPO[];
    news: NewsItem[];
    alerts: SmartAlert[];
    metrics: MarketMetrics;
    watchlist: string[]; // Array of IPO IDs
    isLoading: boolean;
    error: string | null;
    lastScraped: string | null;

    // Profile
    userName: string;
    userEmail: string;
    installDate: string;
    isDarkMode: boolean;

    // Actions
    fetchData: () => Promise<void>;
    syncMarketData: (apiKey?: string) => Promise<void>;
    toggleWatchlist: (id: string) => void;
    updateProfile: (name: string, email: string) => void;
    resetAllData: () => void;
    fetchNews: () => Promise<void>;
    addAlert: (alert: Omit<SmartAlert, 'id' | 'timestamp' | 'isRead'>) => void;
    markAlertRead: (id: string) => void;
    clearAllAlerts: () => void;

    // Admin Actions
    addIPO: (ipo: IPO) => void;
    updateIPO: (ipo: IPO) => void;
    deleteIPO: (id: string) => void;
}

const initialMetrics: MarketMetrics = {
    totalIpos: 0,
    openCount: 0,
    upcomingCount: 0,
    avgSubscription: 0,
    topGmp: 0
};

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            ipos: [],
            news: [],
            alerts: [],
            metrics: initialMetrics,
            watchlist: [],
            isLoading: false,
            error: null,
            lastScraped: null,

            userName: 'Rahul Sharma',
            userEmail: 'rahul.sharma@email.com',
            installDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            isDarkMode: true,

            fetchData: async () => {
                set({ isLoading: true, error: null });
                try {
                    const defaultIPOs = await IPOService.fetchAllIPOs();
                    const currentIPOs = get().ipos;

                    // Smart Merge: Keep existing items, but add missing ones from default list
                    const mergedIPOs = [...currentIPOs];
                    defaultIPOs.forEach(def => {
                        const exists = mergedIPOs.some(curr => curr.name.toLowerCase() === def.name.toLowerCase());
                        if (!exists) {
                            mergedIPOs.push(def);
                        }
                    });

                    set({
                        ipos: mergedIPOs,
                        metrics: calculateMetrics(mergedIPOs),
                        isLoading: false
                    });
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            syncMarketData: async () => {
                const apiKey = localStorage.getItem('IPO_API_KEY') || undefined;
                set({ isLoading: true, error: null });
                try {
                    // 1. Fetch latest metrics (GMP/Sub) and discovery data concurrently
                    const [scrapedData, discovered] = await Promise.all([
                        IPODataScraper.fetchLatestData(apiKey),
                        IPODataScraper.discoverNewIPOs(apiKey) // Pass apiKey safely
                    ]);

                    let currentIPOs = [...get().ipos]; // Use let as it will be modified

                    // 2. Discover & Add new IPOs
                    discovered.forEach(d => {
                        const exists = currentIPOs.some(i => i.name.toLowerCase() === d.name.toLowerCase());
                        if (!exists) {
                            currentIPOs.push(IPOService.convertDiscoveredToIPO(d));
                        }
                    });

                    // 3. Update existing IPOs with fresh scraper/API data and auto-calculate status
                    const updatedIPOs = currentIPOs.map(ipo => {
                        const liveData = scrapedData.find(s =>
                            s.name.toLowerCase().includes(ipo.name.toLowerCase()) ||
                            ipo.name.toLowerCase().includes(s.name.toLowerCase())
                        );

                        const previousIpo = { ...ipo };
                        let updatedIpo = { ...ipo };

                        // 1. Update Metrics from API/Scraper
                        if (liveData) {
                            if (liveData.gmp !== undefined) updatedIpo.gmp = liveData.gmp;
                            if (liveData.subscription) updatedIpo.subscription = liveData.subscription;
                        }

                        // 2. Auto-calculate status based on dates
                        const nowTime = new Date();
                        const startDate = new Date(ipo.startDate);
                        const endDate = new Date(ipo.endDate);

                        // Set end date to end of day to be inclusive
                        endDate.setHours(23, 59, 59, 999);

                        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                            if (nowTime < startDate) updatedIpo.status = 'upcoming';
                            else if (nowTime >= startDate && nowTime <= endDate) updatedIpo.status = 'open';
                            else if (nowTime > endDate) updatedIpo.status = 'closed';
                        }

                        // --- INTELLIGENCE ENGINE: Detect Changes ---
                        const newInsights = detectInsights(previousIpo, updatedIpo);
                        if (newInsights.length > 0) {
                            const existingInsights = ipo.insights || [];
                            // Filter out expired insights (older than 48 hours)
                            const freshInsights = existingInsights.filter(ins => (Date.now() - ins.timestamp) < 48 * 60 * 60 * 1000);

                            // Only add if it's a new unique message type for today
                            const uniqueInsights = [...freshInsights];
                            newInsights.forEach((n: IPOInsight) => {
                                const alreadyExists = uniqueInsights.some((ui) => ui.type === n.type && (Date.now() - ui.timestamp) < 24 * 60 * 60 * 1000);
                                if (!alreadyExists) {
                                    uniqueInsights.unshift(n);
                                }
                            });

                            updatedIpo.insights = uniqueInsights.slice(0, 5); // Keep last 5
                        } else {
                            // Still filter expired ones even if no new ones
                            updatedIpo.insights = (ipo.insights || []).filter(ins => (Date.now() - ins.timestamp) < 48 * 60 * 60 * 1000);
                        }

                        return updatedIpo;
                    });

                    set({
                        ipos: updatedIPOs,
                        metrics: calculateMetrics(updatedIPOs),
                        isLoading: false,
                        lastScraped: new Date().toISOString()
                    });

                    // 4. Update Alerts Center
                    const generatedAlerts: SmartAlert[] = [];
                    updatedIPOs.forEach((updated) => {
                        const old = currentIPOs.find(i => i.id === updated.id);
                        if (old) {
                            generatedAlerts.push(...detectAlerts(old, updated));
                        }
                    });

                    if (generatedAlerts.length > 0) {
                        const existingAlerts = get().alerts;
                        // Avoid duplicates for same IPO/Category in last 24h
                        const freshAlerts = generatedAlerts.filter(na =>
                            !existingAlerts.some(ea =>
                                ea.ipoId === na.ipoId &&
                                ea.category === na.category &&
                                (Date.now() - ea.timestamp) < 24 * 60 * 60 * 1000
                            )
                        );
                        set({ alerts: [...freshAlerts, ...existingAlerts].slice(0, 50) });
                    }
                } catch (err: any) {
                    set({ error: err.message, isLoading: false });
                }
            },

            toggleWatchlist: (id) => {
                const current = get().watchlist;
                if (current.includes(id)) {
                    set({ watchlist: current.filter(wid => wid !== id) });
                } else {
                    set({ watchlist: [...current, id] });
                }
            },

            updateProfile: (name, email) => {
                set({ userName: name, userEmail: email });
            },

            resetAllData: () => {
                set({
                    watchlist: [],
                    userName: 'New User',
                    userEmail: '',
                    metrics: initialMetrics,
                    ipos: [] // This will trigger a re-fetch of defaults on next mount if desired
                });
            },

            // Admin Logic
            addIPO: (ipo) => {
                const updatedIPOs = [ipo, ...get().ipos];
                set({
                    ipos: updatedIPOs,
                    metrics: calculateMetrics(updatedIPOs)
                });
            },

            updateIPO: (ipo) => {
                const updatedIPOs = get().ipos.map(i => i.id === ipo.id ? ipo : i);
                set({
                    ipos: updatedIPOs,
                    metrics: calculateMetrics(updatedIPOs)
                });
            },

            deleteIPO: (id) => {
                const updatedIPOs = get().ipos.filter(i => i.id !== id);
                set({
                    ipos: updatedIPOs,
                    metrics: calculateMetrics(updatedIPOs)
                });
            },

            fetchNews: async () => {
                set({ isLoading: true });
                try {
                    let news = await IPODataScraper.fetchIPONews();

                    // If scraper fails or blocked by CORS, use curated fallback
                    if (news.length === 0) {
                        news = IPOService.getFallbackNews();
                    }

                    set({ news, isLoading: false });
                } catch (err) {
                    set({
                        news: IPOService.getFallbackNews(),
                        isLoading: false
                    });
                }
            },

            addAlert: (alert) => {
                const newAlert: SmartAlert = {
                    ...alert,
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: Date.now(),
                    isRead: false
                };
                set({ alerts: [newAlert, ...get().alerts].slice(0, 50) });
            },

            markAlertRead: (id) => {
                set({
                    alerts: get().alerts.map(a => a.id === id ? { ...a, isRead: true } : a)
                });
            },

            clearAllAlerts: () => {
                set({ alerts: [] });
            }
        }),
        {
            name: 'ipowatch-v1-storage',
            partialize: (state) => ({
                ipos: state.ipos,
                metrics: state.metrics,
                watchlist: state.watchlist,
                userName: state.userName,
                userEmail: state.userEmail,
                installDate: state.installDate,
                isDarkMode: state.isDarkMode,
                alerts: state.alerts
            })
        }
    )
);

// Helper to calculate metrics
function calculateMetrics(data: IPO[]): MarketMetrics {
    const open = data.filter(i => i.status === 'open');
    const upcoming = data.filter(i => i.status === 'upcoming');
    const topGmp = Math.max(...data.map(i => i.gmp || 0), 0);
    const totalSub = data.reduce((acc, i) => acc + (i.subscription.total || 0), 0);

    return {
        totalIpos: data.length,
        openCount: open.length,
        upcomingCount: upcoming.length,
        avgSubscription: data.length > 0 ? parseFloat((totalSub / data.length).toFixed(1)) : 0,
        topGmp: topGmp
    };
}

/**
 * INTELLIGENCE ENGINE LOGIC
 * Compares old vs new state and generates educational insights
 */
function detectInsights(old: IPO, updated: IPO): IPOInsight[] {
    const insights: IPOInsight[] = [];
    const timestamp = Date.now();
    const id = () => Math.random().toString(36).substr(2, 9);

    // 1. Status Change
    if (old.status !== updated.status) {
        let msg = '';
        if (old.status === 'upcoming' && updated.status === 'open') {
            msg = 'This IPO is now LIVE for subscription.';
        } else if (old.status === 'open' && updated.status === 'closed') {
            msg = 'Subscription period ended. Allotment is expected next.';
        } else if (updated.status === 'closed' && (updated.gmp || 0) > (old.gmp || 0)) {
            msg = 'Post-closing GMP showing strength before allotment.';
        }

        if (msg) insights.push({ id: id(), type: 'status', message: msg, timestamp });
    }

    // 2. Subscription Surge
    if (updated.subscription.total > old.subscription.total + 2) {
        insights.push({
            id: id(),
            type: 'subscription',
            message: `Retail subscription increased rapidly today, showing higher participation.`,
            timestamp
        });
    }

    // 3. GMP Volatility
    if (updated.gmp !== undefined && old.gmp !== undefined) {
        const diff = updated.gmp - old.gmp;
        if (diff > 10) {
            insights.push({
                id: id(),
                type: 'gmp',
                message: 'GMP showing an upward spike in recent grey market trades.',
                timestamp
            });
        } else if (diff < -10) {
            insights.push({
                id: id(),
                type: 'gmp',
                message: 'GMP reduced recently. Grey market values are unofficial and highly volatile.',
                timestamp
            });
        }
    }

    // 4. Allotment specific
    if (updated.status === 'closed' && !old.registrar && updated.registrar) {
        insights.push({
            id: id(),
            type: 'allotment',
            message: 'Registrar has been finalized. Allotment data mapping in progress.',
            timestamp
        });
    }

    return insights;
}

/**
 * ALERT DETECTION LOGIC
 * Triggers system-wide notifications for critical market moments
 */
function detectAlerts(old: IPO, updated: IPO): SmartAlert[] {
    const alerts: SmartAlert[] = [];
    const id = () => Math.random().toString(36).substr(2, 9);
    const timestamp = Date.now();

    // 1. Status Change (High Priority)
    if (old.status !== updated.status) {
        if (updated.status === 'open') {
            alerts.push({
                id: id(),
                ipoId: updated.id,
                title: 'IPO Open Now! 🚀',
                message: `${updated.name} is now live for bidding. Don't miss the window.`,
                type: 'success',
                category: 'status_change',
                timestamp,
                isRead: false
            });
        } else if (updated.status === 'closed') {
            alerts.push({
                id: id(),
                ipoId: updated.id,
                title: 'IPO Bidding Closed',
                message: `${updated.name} has officially closed. Check back for allotment soon.`,
                type: 'info',
                category: 'status_change',
                timestamp,
                isRead: false
            });
        }
    }

    // 2. GMP Spike (Warning/Success)
    if (updated.gmp !== undefined && old.gmp !== undefined) {
        const diff = updated.gmp - old.gmp;
        if (diff > 20) {
            alerts.push({
                id: id(),
                ipoId: updated.id,
                title: 'GMP Surge Detected! 📈',
                message: `Strong demand for ${updated.name}! GMP jumped by ₹${diff} in last trade.`,
                type: 'success',
                category: 'gmp_spike',
                timestamp,
                isRead: false
            });
        }
    }

    // 3. Subscription High (Info)
    if (updated.subscription.total > 50 && old.subscription.total <= 50) {
        alerts.push({
            id: id(),
            ipoId: updated.id,
            title: 'Massive Demand! ⚡',
            message: `${updated.name} is now over 50x subscribed. Retail interest is peaking.`,
            type: 'warning',
            category: 'status_change',
            timestamp,
            isRead: false
        });
    }

    // 4. Closing Soon (Critical)
    const endDate = new Date(updated.endDate);
    const now = new Date();
    if (updated.status === 'open' && endDate.toDateString() === now.toDateString()) {
        const hoursLeft = 17 - now.getHours(); // Assuming 5 PM IST close
        if (hoursLeft > 0 && hoursLeft <= 4) {
            alerts.push({
                id: id(),
                ipoId: updated.id,
                title: 'Closing Soon! ⏳',
                message: `Final few hours left to apply for ${updated.name}!`,
                type: 'critical',
                category: 'closing_soon',
                timestamp,
                isRead: false
            });
        }
    }

    return alerts;
}

