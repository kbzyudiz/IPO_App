import { type IPO, type IPOStatus } from '../core/types';
import { type NewsItem, type DiscoveredIPO } from './scraper';

export class IPOService {
    // THIS IS THE CENTRAL DATA SOURCE
    // Updated with current dates (23 Dec 2024) and market cap
    private static LOCAL_IPOS_RAW = [
        {
            id: 'shyam-dhani',
            name: 'Shyam Dhani Industries',
            symbol: 'SHYAM',
            type: 'SME',
            sector: 'FMCG',
            priceRange: '65-70',
            minQty: 2000,
            minAmount: 140000,
            issueSize: '15.20 Cr',
            marketCap: '58 Cr',
            startDate: '22 Dec 2025',
            endDate: '24 Dec 2025',
            listingDate: '30 Dec 2025',
            gmp: 72,
            status: 'closed',
            subscription: { total: 204.96, retail: 185.2, qib: 45.3, nii: 412.5 }
        },
        {
            id: 'gujarat-kidney',
            name: 'Gujarat Kidney & Super Speciality',
            symbol: 'GKSSL',
            type: 'Mainboard',
            sector: 'Healthcare',
            priceRange: '108-114',
            minQty: 130,
            minAmount: 14820,
            issueSize: '250 Cr',
            marketCap: '820 Cr',
            startDate: '22 Dec 2025',
            endDate: '24 Dec 2025',
            listingDate: '30 Dec 2025',
            gmp: 0,
            status: 'closed',
            subscription: { total: 2.46, retail: 3.12, qib: 1.15, nii: 4.28 }
        },
        {
            id: 'dhara-rail',
            name: 'Dhara Rail Projects',
            symbol: 'DHARA',
            type: 'SME',
            sector: 'Infrastructure',
            priceRange: '120-126',
            minQty: 1000,
            minAmount: 126000,
            issueSize: '23.40 Cr',
            marketCap: '88 Cr',
            startDate: '23 Dec 2025',
            endDate: '26 Dec 2025',
            listingDate: '31 Dec 2025',
            gmp: 12,
            status: 'open',
            subscription: { total: 2.09, retail: 1.85, qib: 0, nii: 2.42 }
        },
        {
            id: 'apollo-techno',
            name: 'Apollo Techno Industries',
            symbol: 'APOLLO',
            type: 'SME',
            sector: 'Industrial',
            priceRange: '123-130',
            minQty: 1000,
            minAmount: 130000,
            issueSize: '21.50 Cr',
            marketCap: '82 Cr',
            startDate: '23 Dec 2025',
            endDate: '26 Dec 2025',
            listingDate: '31 Dec 2025',
            gmp: 6,
            status: 'open',
            subscription: { total: 3.71, retail: 4.15, qib: 0, nii: 3.28 }
        },
        {
            id: 'nanta-tech',
            name: 'Nanta Tech',
            symbol: 'NANTA',
            type: 'SME',
            sector: 'Technology',
            priceRange: '209-220',
            minQty: 600,
            minAmount: 132000,
            issueSize: '18.20 Cr',
            marketCap: '72 Cr',
            startDate: '23 Dec 2025',
            endDate: '26 Dec 2025',
            listingDate: '31 Dec 2025',
            gmp: 6,
            status: 'open',
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        },
        {
            id: 'admach-systems',
            name: 'Admach Systems',
            symbol: 'ADMACH',
            type: 'SME',
            sector: 'Engineering',
            priceRange: '227-239',
            minQty: 600,
            minAmount: 143400,
            issueSize: '24.10 Cr',
            marketCap: '95 Cr',
            startDate: '23 Dec 2025',
            endDate: '26 Dec 2025',
            listingDate: '31 Dec 2025',
            gmp: 5,
            status: 'open',
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        },
        {
            id: 'bai-kakaji',
            name: 'Bai Kakaji Polymers',
            symbol: 'BAIKAKAJI',
            type: 'SME',
            sector: 'Manufacturing',
            priceRange: '177-186',
            minQty: 800,
            minAmount: 148800,
            issueSize: '19.50 Cr',
            marketCap: '78 Cr',
            startDate: '23 Dec 2025',
            endDate: '26 Dec 2025',
            listingDate: '31 Dec 2025',
            gmp: 9,
            status: 'open',
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        },
        {
            id: 'e2e-trans',
            name: 'E to E Transportation',
            symbol: 'E2E',
            type: 'SME',
            sector: 'Logistics',
            priceRange: '164-174',
            minQty: 800,
            minAmount: 139200,
            issueSize: '45.10 Cr',
            marketCap: '175 Cr',
            startDate: '26 Dec 2025',
            endDate: '30 Dec 2025',
            listingDate: '03 Jan 2026',
            gmp: 134,
            status: 'open',
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        },
        {
            id: 'sundrex-oil',
            name: 'Sundrex Oil',
            symbol: 'SUNDREX',
            type: 'SME',
            sector: 'Oil & Gas',
            priceRange: '81-86',
            minQty: 1600,
            minAmount: 137600,
            issueSize: '12.40 Cr',
            marketCap: '48 Cr',
            startDate: '22 Dec 2025',
            endDate: '24 Dec 2025',
            status: 'closed',
            gmp: 1,
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        },
        {
            id: 'dachepalli',
            name: 'Dachepalli Publishers',
            symbol: 'DACHE',
            type: 'SME',
            sector: 'Publishing',
            priceRange: '100-102',
            minQty: 1200,
            minAmount: 122400,
            issueSize: '14.20 Cr',
            marketCap: '55 Cr',
            startDate: '22 Dec 2025',
            endDate: '24 Dec 2025',
            status: 'closed',
            gmp: 2,
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        },
        {
            id: 'modern-diag',
            name: 'Modern Diagnostic',
            symbol: 'MODERN',
            type: 'SME',
            sector: 'Healthcare',
            priceRange: '85-90',
            minQty: 1600,
            minAmount: 144000,
            issueSize: '22.10 Cr',
            marketCap: '85 Cr',
            startDate: '31 Dec 2025',
            endDate: '02 Jan 2026',
            status: 'upcoming',
            gmp: 0,
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        }
    ];

    static async fetchAllIPOs(): Promise<IPO[]> {
        return this.LOCAL_IPOS_RAW.map(item => this.mapToInternalModel(item, item.status as any));
    }

    public static mapToInternalModel(item: any, status: IPOStatus): IPO {
        const seed = item.name.length;

        // Helper to add days to a date string
        const addDays = (dateStr: string, days: number) => {
            if (!dateStr || dateStr === 'TBA') return 'TBA';
            try {
                const date = new Date(dateStr);
                date.setDate(date.getDate() + days);
                return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
            } catch (e) {
                return 'TBA';
            }
        };

        const startDate = item.startDate || 'TBA';
        const endDate = item.endDate || (startDate !== 'TBA' ? addDays(startDate, 2) : 'TBA');
        const listingDate = item.listingDate || (endDate !== 'TBA' ? addDays(endDate, 3) : 'TBA');

        // Generate full 6-step schedule matching T+3 standard
        const schedule = [
            { event: 'IPO Open Date', date: startDate },
            { event: 'IPO Close Date', date: endDate },
            { event: 'Basis of Allotment', date: (endDate !== 'TBA' ? addDays(endDate, 1) : 'TBA') },
            { event: 'Initiation of Refunds', date: (endDate !== 'TBA' ? addDays(endDate, 2) : 'TBA') },
            { event: 'Credit of Shares to Demat', date: (endDate !== 'TBA' ? addDays(endDate, 2) : 'TBA') },
            { event: 'IPO Listing Date', date: listingDate }
        ];

        return {
            id: item.id || Math.random().toString(36).substr(2, 9),
            name: item.name,
            symbol: item.symbol || 'SYMBOL',
            status: status,
            type: item.type === 'SME' ? 'SME' : 'Mainboard',
            sector: item.sector || (seed % 2 === 0 ? 'Technology' : 'Finance'),
            priceRange: item.priceRange || '0-0',
            minQty: item.minQty || 0,
            minAmount: item.minAmount || 0,
            issueSize: item.issueSize || '0 Cr',
            marketCap: item.marketCap,
            startDate: startDate,
            endDate: endDate,
            listingDate: listingDate,
            logo: item.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random&color=fff&size=128`,
            gmp: item.gmp || 0,
            subscription: item.subscription || { retail: 0, qib: 0, nii: 0, total: 0 },
            about: item.about || 'A leading company in its sector, consistently delivering value and growth.',
            strengths: item.strengths || [
                "Market leadership in its core business segment",
                "Strong track record of financial growth and profitability",
                "Wide distribution network reaching pan-India customers"
            ],
            risks: item.risks || [
                "Significant dependence on a few large customers",
                "Exposure to fluctuations in raw material prices",
                "Highly regulated industry with evolving compliance norms"
            ],
            schedule: schedule,
            applyUrl: item.infoUrl || 'https://zerodha.com/ipo'
        };
    }

    static convertDiscoveredToIPO(item: DiscoveredIPO): IPO {
        return this.mapToInternalModel({
            id: item.name.toLowerCase().replace(/\s+/g, '-'),
            ...item
        }, item.status);
    }

    static getFallbackNews(): NewsItem[] {
        return [
            {
                id: 'news-1',
                title: "India IPO Market Breaks Records in 2025: ₹1.76 Lakh Crore Raised",
                source: "Economic Times",
                time: "2h ago",
                category: "MARKET MILESTONE",
                image: "https://images.unsplash.com/photo-1611974717482-962553c71df3?q=80&w=800",
                link: "https://economictimes.indiatimes.com/markets/ipos"
            },
            {
                id: 'news-2',
                title: "Apollo Techno Industries IPO Opens Today: Check GMP and Price Band",
                source: "Moneycontrol",
                time: "5h ago",
                category: "NEW LISTING",
                image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800",
                link: "https://www.moneycontrol.com/news/business/ipo/"
            },
            {
                id: 'news-3',
                title: "KPMG Report: India IPO Pipeline Strong for 2026 with Reliance Jio, PhonePe",
                source: "Business Standard",
                time: "12h ago",
                category: "FUTURE OUTLOOK",
                image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800",
                link: "https://www.business-standard.com/markets/ipo"
            },
            {
                id: 'news-4',
                title: "Listing Gains Decline in 2025 Despite Record Fundraising",
                source: "Financial Express",
                time: "1d ago",
                category: "ANALYSIS",
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
                link: "https://www.financialexpress.com/market/ipo/"
            },
            {
                id: 'news-5',
                title: "Symbiotec Pharmalab Files DRHP for ₹2,180 Crore IPO",
                source: "Mint",
                time: "4d ago",
                category: "REGULATORY",
                image: "https://images.unsplash.com/photo-1579532566560-c560ad3ac0ae?q=80&w=800",
                link: "https://www.livemint.com/market/ipo"
            }
        ];
    }
}
