import { RegistrarType } from '../core/allotment-types';

export interface RegistrarInfo {
    name: string;
    type: RegistrarType | 'maashitla'; // Extending locally for now
    url: string;
    logo?: string;
}

export class RegistrarService {

    // Static mapping of known URLs
    private static REGISTRAR_URLS: Record<string, string> = {
        [RegistrarType.LINK_INTIME]: 'https://linkintime.co.in/initial_offer/public-issues.html',
        [RegistrarType.KFINTECH]: 'https://kosmic.kfintech.com/ipostatus/',
        [RegistrarType.BIGSHARE]: 'https://www.bigshareonline.com/ipo_Allotment.html',
        'maashitla': 'https://maashitla.com/allotment-status'
    };

    private static REGISTRAR_NAMES: Record<string, string> = {
        [RegistrarType.LINK_INTIME]: 'Link Intime',
        [RegistrarType.KFINTECH]: 'KFintech',
        [RegistrarType.BIGSHARE]: 'Bigshare Services',
        'maashitla': 'Maashitla Securities'
    };

    /**
     * Identifies the registrar from a raw string (e.g. "Link Intime India Pvt Ltd")
     */
    static identifyRegistrar(rawName: string): RegistrarInfo {
        const lowerName = rawName.toLowerCase();

        if (lowerName.includes('link') && lowerName.includes('intime')) {
            return this.buildInfo(RegistrarType.LINK_INTIME);
        }
        if (lowerName.includes('kfin') || lowerName.includes('kosmic')) {
            return this.buildInfo(RegistrarType.KFINTECH);
        }
        if (lowerName.includes('bigshare')) {
            return this.buildInfo(RegistrarType.BIGSHARE);
        }
        if (lowerName.includes('maashitla')) {
            return this.buildInfo('maashitla' as any);
        }

        // Fallback
        return {
            name: rawName || 'Unknown Registrar',
            type: RegistrarType.UNKNOWN,
            url: `https://www.google.com/search?q=${encodeURIComponent(rawName + ' allotment status')}`
        };
    }

    private static buildInfo(type: RegistrarType | 'maashitla'): RegistrarInfo {
        return {
            name: this.REGISTRAR_NAMES[type] || type,
            type: type,
            url: this.REGISTRAR_URLS[type] || ''
        };
    }

    /**
     * Gets the direct allotment check URL for a given registrar
     */
    static getUrl(type: RegistrarType | 'maashitla'): string {
        return this.REGISTRAR_URLS[type] || '';
    }
}
