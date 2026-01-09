import { RegistrarType } from '../core/allotment-types';
import type { IPOMasterEntry } from '../core/allotment-types';

/**
 * IPO Master Database
 * Maps IPOs to their registrars and allotment status
 * 
 * In production, this would be:
 * - Fetched from backend API
 * - Stored in database
 * - Updated daily via admin panel
 */
export class IPOMasterService {
    /**
     * Static IPO master data (MVP)
     * TODO: Replace with API call in production
     */
    private static IPO_MASTER: IPOMasterEntry[] = [
        {
            id: 'azad-eng',
            name: 'Azad Engineering Limited',
            symbol: 'AZAD',
            registrar: RegistrarType.KFINTECH,
            registrarUrl: 'https://kosmic.kfintech.com/ipostatus/',
            allotmentDate: '26 Dec 2025',
            allotmentStatus: 'PUBLISHED'
        },
        {
            id: 'innova-captab',
            name: 'Innova Captab Limited',
            symbol: 'INNOVA',
            registrar: RegistrarType.KFINTECH,
            registrarUrl: 'https://kosmic.kfintech.com/ipostatus/',
            allotmentDate: '27 Dec 2025',
            allotmentStatus: 'PUBLISHED'
        },
        {
            id: 'suraj-estate',
            name: 'Suraj Estate Developers',
            symbol: 'SURAJ',
            registrar: RegistrarType.LINK_INTIME,
            registrarUrl: 'https://linkintime.co.in/MIPO/Ipoallotment.html',
            allotmentDate: '21 Dec 2025',
            allotmentStatus: 'PUBLISHED'
        },
        {
            id: 'muthoot-mf',
            name: 'Muthoot Microfin Limited',
            symbol: 'MUTHOOTMF',
            registrar: RegistrarType.KFINTECH,
            registrarUrl: 'https://kosmic.kfintech.com/ipostatus/',
            allotmentDate: '22 Dec 2025',
            allotmentStatus: 'PUBLISHED'
        },
        {
            id: 'happy-forgings',
            name: 'Happy Forgings Limited',
            symbol: 'HAPPY',
            registrar: RegistrarType.LINK_INTIME,
            registrarUrl: 'https://linkintime.co.in/MIPO/Ipoallotment.html',
            allotmentDate: '22 Dec 2025',
            allotmentStatus: 'PUBLISHED'
        },
        {
            id: 'motisons-jewel',
            name: 'Motisons Jewellers Limited',
            symbol: 'MOTISONS',
            registrar: RegistrarType.LINK_INTIME,
            registrarUrl: 'https://linkintime.co.in/MIPO/Ipoallotment.html',
            allotmentDate: '22 Dec 2025',
            allotmentStatus: 'PUBLISHED'
        },
        {
            id: 'rbz-jewellers',
            name: 'RBZ Jewellers Limited',
            symbol: 'RBZJEWEL',
            registrar: RegistrarType.BIGSHARE,
            registrarUrl: 'https://www.bigshareonline.com/ipo_Allotment.html',
            allotmentDate: '24 Dec 2025',
            allotmentStatus: 'PUBLISHED'
        },
        {
            id: 'nova-tech',
            name: 'Nova Tech Systems',
            symbol: 'NOVA',
            registrar: RegistrarType.KFINTECH,
            registrarUrl: 'https://kosmic.kfintech.com/ipostatus/',
            allotmentDate: '05 Jan 2026',
            allotmentStatus: 'PENDING'
        }
    ];

    /**
     * Get IPO master entry by ID
     */
    static getIPO(ipoId: string): IPOMasterEntry | null {
        return this.IPO_MASTER.find(ipo => ipo.id === ipoId) || null;
    }

    /**
     * Get all IPOs where allotment is published
     */
    static getPublishedAllotments(): IPOMasterEntry[] {
        return this.IPO_MASTER.filter(ipo => ipo.allotmentStatus === 'PUBLISHED');
    }

    /**
     * Get all IPOs by registrar
     */
    /**
     * Update allotment status
     */
    static updateAllotmentStatus(ipoId: string, status: 'UPCOMING' | 'PENDING' | 'PUBLISHED'): boolean {
        const ipo = this.IPO_MASTER.find(i => i.id === ipoId);
        if (ipo) {
            ipo.allotmentStatus = status;
            return true;
        }
        return false;
    }

    /**
     * Register a new IPO discovered by the automation machine
     */
    static registerDynamicIPO(name: string, registrar: RegistrarType, url: string): boolean {
        // Skip if already exists
        const exists = this.IPO_MASTER.find(i =>
            i.name.toLowerCase() === name.toLowerCase() ||
            i.id === name.toLowerCase().replace(/\s+/g, '-')
        );
        if (exists) return false;

        console.log(`🆕 Registering newly discovered IPO: ${name}`);

        this.IPO_MASTER.push({
            id: 'dyn-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: name,
            symbol: 'AUTO',
            registrar: registrar,
            registrarUrl: url,
            allotmentDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            allotmentStatus: 'PUBLISHED'
        });
        return true;
    }

    /**
     * Get all IPOs (for dropdown selection)
     */
    static getAllIPOs(): IPOMasterEntry[] {
        return [...this.IPO_MASTER];
    }
}
