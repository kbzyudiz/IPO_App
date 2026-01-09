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
        'maashitla': 'https://maashitla.com/allotment-status',
        'cameo': 'https://ipo.cameoindia.com/',
        'skyline': 'https://www.skylinerta.com/ipo.php',
        'purva': 'https://www.purvashare.com/investor-service/ipo-query',
        'mas': 'https://www.masserv.com/opt.asp',
        'datamatics': 'https://www.datamaticsbpm.com/ipo-allotment-status'
    };

    private static REGISTRAR_NAMES: Record<string, string> = {
        [RegistrarType.LINK_INTIME]: 'Link Intime India Pvt Ltd',
        [RegistrarType.KFINTECH]: 'KFin Technologies Ltd',
        [RegistrarType.BIGSHARE]: 'Bigshare Services Pvt Ltd',
        'maashitla': 'Maashitla Securities Pvt Ltd',
        'cameo': 'Cameo Corporate Services Ltd',
        'skyline': 'Skyline Financial Services Pvt Ltd',
        'purva': 'Purva Sharegistry (India) Pvt Ltd',
        'mas': 'Mas Services Ltd',
        'datamatics': 'Datamatics Business Solutions Ltd'
    };

    /**
     * Identifies the registrar from a raw string (e.g. "Link Intime India Pvt Ltd")
     */
    static identifyRegistrar(rawName: string): RegistrarInfo {
        const lowerName = (rawName || '').toLowerCase();

        if (lowerName.includes('link') && lowerName.includes('intime')) return this.buildInfo(RegistrarType.LINK_INTIME);
        if (lowerName.includes('kfin') || lowerName.includes('kosmic')) return this.buildInfo(RegistrarType.KFINTECH);
        if (lowerName.includes('bigshare')) return this.buildInfo(RegistrarType.BIGSHARE);
        if (lowerName.includes('maashitla')) return this.buildInfo('maashitla' as any);
        if (lowerName.includes('cameo')) return this.buildInfo('cameo' as any);
        if (lowerName.includes('skyline')) return this.buildInfo('skyline' as any);
        if (lowerName.includes('purva')) return this.buildInfo('purva' as any);
        if (lowerName.includes('mas') && lowerName.includes('service')) return this.buildInfo('mas' as any);
        if (lowerName.includes('datamatics')) return this.buildInfo('datamatics' as any);

        // Fallback
        return {
            name: rawName || 'Unknown Registrar',
            type: RegistrarType.UNKNOWN,
            url: `https://www.google.com/search?q=${encodeURIComponent(rawName + ' allotment status')}`
        };
    }

    private static buildInfo(type: RegistrarType | 'maashitla' | 'cameo' | 'skyline' | 'purva' | 'mas' | 'datamatics'): RegistrarInfo {
        return {
            name: this.REGISTRAR_NAMES[type] || type,
            type: type as any,
            url: this.REGISTRAR_URLS[type] || ''
        };
    }

    /**
     * Gets the direct allotment check URL for a given registrar
     */
    static getUrl(type: string): string {
        return this.REGISTRAR_URLS[type] || '';
    }
}
