import { type IPO, type IPOStatus, type NewsItem } from '../core/types';
import { type DiscoveredIPO } from './scraper';

export class IPOService {
    // THIS IS THE CENTRAL DATA SOURCE
    // Updated with current dates relative to Jan 2026
    private static LOCAL_IPOS_RAW = [
        // OPEN IPOs (Jan 2026)
        {
            id: 'bharat-coking',
            name: 'Bharat Coking Coal (BCCL)',
            symbol: 'BCCL',
            type: 'Mainboard',
            sector: 'Mining',
            priceRange: '23-25',
            minQty: 600,
            minAmount: 14400,
            issueSize: '1200 Cr',
            marketCap: '4500 Cr',
            startDate: '09 Jan 2026',
            endDate: '13 Jan 2026',
            listingDate: '16 Jan 2026',
            gmp: 11,
            status: 'upcoming', // Based on Jan 9 start
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        },
        {
            id: 'gabion-tech',
            name: 'Gabion Technologies',
            symbol: 'GABION',
            type: 'SME',
            sector: 'Technology',
            priceRange: '78-81',
            minQty: 1600,
            minAmount: 129600,
            issueSize: '12.5 Cr',
            marketCap: '45 Cr',
            startDate: '06 Jan 2026',
            endDate: '08 Jan 2026',
            listingDate: '13 Jan 2026',
            gmp: 30,
            status: 'open',
            subscription: { total: 12.4, retail: 15.8, qib: 5.2, nii: 18.5 }
        },
        {
            id: 'yajur-fibres',
            name: 'Yajur Fibres',
            symbol: 'YAJUR',
            type: 'SME',
            sector: 'Textiles',
            priceRange: '165-174',
            minQty: 800,
            minAmount: 139200,
            issueSize: '18.4 Cr',
            marketCap: '68 Cr',
            startDate: '07 Jan 2026',
            endDate: '09 Jan 2026',
            listingDate: '14 Jan 2026',
            gmp: 60,
            status: 'open',
            subscription: { total: 2.1, retail: 4.5, qib: 0, nii: 1.2 }
        },
        {
            id: 'future-energy',
            name: 'Future Energy Solutions',
            symbol: 'FUTSOL',
            type: 'Mainboard',
            sector: 'Energy',
            priceRange: '230-245',
            minQty: 60,
            minAmount: 14700,
            issueSize: '450 Cr',
            marketCap: '1200 Cr',
            startDate: '05 Jan 2026',
            endDate: '08 Jan 2026',
            listingDate: '13 Jan 2026',
            gmp: 85,
            status: 'open',
            subscription: { total: 4.5, retail: 6.2, qib: 1.8, nii: 3.9 }
        },
        {
            id: 'victory-electric',
            name: 'Victory Electric Vehicles',
            symbol: 'VICTORY',
            type: 'SME',
            sector: 'EV',
            priceRange: '38-41',
            minQty: 3000,
            minAmount: 123000,
            issueSize: '15 Cr',
            marketCap: '55 Cr',
            startDate: '07 Jan 2026',
            endDate: '09 Jan 2026',
            listingDate: '14 Jan 2026',
            gmp: 5,
            status: 'open',
            subscription: { total: 0, retail: 0, qib: 0, nii: 0 }
        },
        {
            id: 'nova-tech',
            name: 'Nova Tech Systems',
            symbol: 'NOVA',
            type: 'Mainboard',
            sector: 'Technology',
            priceRange: '450-475',
            minQty: 32,
            minAmount: 15200,
            issueSize: '800 Cr',
            marketCap: '3500 Cr',
            startDate: '15 Jan 2026',
            endDate: '18 Jan 2026',
            listingDate: '23 Jan 2026',
            gmp: 120,
            status: 'upcoming',
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
            listingDate: '07 Jan 2026',
            status: 'closed',
            gmp: 14,
            subscription: { total: 55.4, retail: 62.1, qib: 12.8, nii: 88.5 }
        },
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
        }
    ];

    static async fetchAllIPOs(): Promise<IPO[]> {
        return this.LOCAL_IPOS_RAW.map(item => this.mapToInternalModel(item, item.status as any));
    }

    public static mapToInternalModel(item: any, status: IPOStatus): IPO {
        const seed = item.name.length;
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
            strengths: item.strengths || ["Market leadership", "Financial growth", "Wide distribution"],
            risks: item.risks || ["Customer dependence", "Raw material flux", "Regulated industry"],
            schedule: schedule,
            applyUrl: item.infoUrl || 'https://zerodha.com/ipo',
            financials: item.financials || {
                revenue: '₹ 156.4 Cr',
                profit: '₹ 24.2 Cr',
                assets: '₹ 89.5 Cr',
                margins: '15.4%'
            },
            promoters: item.promoters || {
                holdingPre: '98.5%',
                holdingPost: '72.4%',
                names: ['Rajesh Gupta', 'Suresh Kumar']
            }
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
                title: "India IPO Market Breaks Records: ₹1.92 Lakh Crore Target in 2026",
                summary: "Market analysts expect a surge in primary market activity...",
                source: "Economic Times",
                time: "2h ago",
                category: "MARKET",
                image: "https://images.unsplash.com/photo-1611974717482-962553c71df3?q=80&w=800",
                link: "https://economictimes.indiatimes.com/markets/ipos"
            },
            {
                id: 'news-2',
                title: "Nova Tech Systems Eyes ₹800 Cr Mainboard IPO in Feb 2026",
                summary: "The technology solutions provider has received preliminary approval...",
                source: "Moneycontrol",
                time: "5h ago",
                category: "MAINBOARD",
                image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800",
                link: "https://www.moneycontrol.com/news/business/ipo/"
            }
        ];
    }
}
