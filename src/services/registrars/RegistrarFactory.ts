import { RegistrarType } from '../../core/allotment-types';
import type { IRegistrarAdapter } from '../../core/allotment-types';
import { LinkIntimeAdapter } from './LinkIntimeAdapter';
import { KFintechAdapter } from './KFintechAdapter';
import { BigshareAdapter } from './BigshareAdapter';

/**
 * Factory to get the appropriate registrar adapter
 * Adding new registrars only requires:
 * 1. Create new adapter class
 * 2. Import it
 * 3. Add case in switch statement
 */
export class RegistrarFactory {
    private static adapters: Map<RegistrarType, IRegistrarAdapter> = new Map();

    /**
     * Get adapter instance for a registrar (singleton pattern)
     */
    static getAdapter(registrar: RegistrarType): IRegistrarAdapter {
        // Check cache first
        if (this.adapters.has(registrar)) {
            return this.adapters.get(registrar)!;
        }

        // Create new instance
        let adapter: IRegistrarAdapter;

        switch (registrar) {
            case RegistrarType.LINK_INTIME:
                adapter = new LinkIntimeAdapter();
                break;

            case RegistrarType.KFINTECH:
                adapter = new KFintechAdapter();
                break;

            case RegistrarType.BIGSHARE:
                adapter = new BigshareAdapter();
                break;

            default:
                throw new Error(`Unsupported registrar: ${registrar}`);
        }

        // Cache for reuse
        this.adapters.set(registrar, adapter);
        return adapter;
    }

    /**
     * Check if a registrar is supported
     */
    static isSupported(registrar: RegistrarType): boolean {
        const supported: RegistrarType[] = [
            RegistrarType.LINK_INTIME,
            RegistrarType.KFINTECH,
            RegistrarType.BIGSHARE
        ];
        return supported.includes(registrar);
    }

    /**
     * Get list of all supported registrars
     */
    static getSupportedRegistrars(): RegistrarType[] {
        return [
            RegistrarType.LINK_INTIME,
            RegistrarType.KFINTECH,
            RegistrarType.BIGSHARE
        ];
    }
}

