export type IPOStatus = 'open' | 'upcoming' | 'announced' | 'closed' | 'allotment_out';

export interface IPOSchedule {
    event: string;
    date: string;
}

export interface IPOInsight {
    id: string;
    message: string;
    type: 'status' | 'subscription' | 'gmp' | 'allotment' | 'listing';
    timestamp: number;
}

export interface IPO {
    id: string;
    name: string;
    symbol: string;
    status: IPOStatus;
    type: 'Mainboard' | 'SME';
    sector: string;
    priceRange: string;
    minQty: number;
    minAmount: number;
    issueSize: string;
    marketCap?: string;
    startDate: string;
    endDate: string;
    listingDate?: string;
    logo: string;
    gmp?: number;
    subscription: {
        retail: number;
        qib: number;
        nii: number;
        total: number;
    };
    about: string;
    strengths: string[];
    risks: string[];
    schedule: IPOSchedule[];
    applyUrl: string;
    rhpUrl?: string;
    registrar?: string;
    insights?: IPOInsight[];
    financials?: {
        revenue: string;
        profit: string;
        assets: string;
        margins: string;
    };
    promoters?: {
        holdingPre: string;
        holdingPost: string;
        names: string[];
    };
}

export interface MarketMetrics {
    totalIpos: number;
    openCount: number;
    upcomingCount: number;
    avgSubscription: number;
    topGmp: number;
}

export interface NewsItem {
    id: string;
    title: string;
    summary?: string;
    source: string;
    time: string;
    category: 'MAINBOARD' | 'SME' | 'MARKET' | 'ALLOTMENT';
    image: string;
    link: string;
}

export interface SmartAlert {
    id: string;
    title: string;
    message: string;
    type: 'critical' | 'info' | 'success' | 'warning';
    category: 'new_ipo' | 'gmp_spike' | 'status_change' | 'closing_soon' | 'news' | 'subscription_spike' | 'allotment_out';
    timestamp: number;
    ipoId?: string;
    isRead: boolean;
}
