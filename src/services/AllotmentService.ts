import type {
    AllotmentCheckParams,
    AllotmentResult,
    AllotmentHistory
} from '../core/allotment-types';
import { IPOMasterService } from './IPOMasterService';
import { RegistrarFactory } from './registrars/RegistrarFactory';

/**
 * Core Allotment Service
 * Main entry point for allotment checks
 * Handles: validation, routing, caching, history
 */
export class AllotmentService {
    private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    private static cache: Map<string, AllotmentResult> = new Map();
    private static history: AllotmentHistory[] = [];

    /**
     * Main method: Check IPO allotment status
     */
    static async checkAllotment(params: AllotmentCheckParams): Promise<AllotmentResult> {
        const { ipoId, pan, applicationNumber } = params;

        // Step 1: Validate PAN format
        if (!this.validatePAN(pan)) {
            return {
                status: 'INVALID_DETAILS',
                ipoId,
                ipoName: 'Unknown',
                message: 'Invalid PAN format. Please enter a valid 10-character PAN (e.g., ABCDE1234F)',
                checkedAt: Date.now()
            };
        }

        // Step 2: Get IPO details from master
        const ipo = IPOMasterService.getIPO(ipoId);
        if (!ipo) {
            return {
                status: 'ERROR',
                ipoId,
                ipoName: 'Unknown',
                message: 'IPO not found in our database.',
                checkedAt: Date.now()
            };
        }

        // Step 3: Check if allotment is published
        if (ipo.allotmentStatus !== 'PUBLISHED') {
            return {
                status: 'RESULT_NOT_PUBLISHED',
                ipoId,
                ipoName: ipo.name,
                message: `Allotment results will be published on ${ipo.allotmentDate}. Please check back later.`,
                checkedAt: Date.now()
            };
        }

        // Step 4: Check cache (avoid redundant fetches)
        const cacheKey = this.getCacheKey(ipoId, pan);
        const cached = this.cache.get(cacheKey);
        if (cached && !this.isCacheStale(cached)) {
            console.log('Returning cached result');
            return cached;
        }

        // Step 5: Check if registrar is supported
        if (!RegistrarFactory.isSupported(ipo.registrar)) {
            return {
                status: 'ERROR',
                ipoId,
                ipoName: ipo.name,
                message: `${ipo.registrar} registrar is not yet supported. Please check on the official registrar website.`,
                checkedAt: Date.now()
            };
        }

        // Step 6: Route to correct registrar adapter
        try {
            const adapter = RegistrarFactory.getAdapter(ipo.registrar);
            const result = await adapter.checkAllotment({
                ipoId,
                pan,
                applicationNumber
            });

            // Ensure ipoName is set
            result.ipoName = ipo.name;

            // Step 7: Cache the result
            this.cache.set(cacheKey, result);

            // Step 8: Save to history (with hashed PAN)
            await this.saveToHistory(ipoId, ipo.name, pan, result);

            return result;

        } catch (error: any) {
            console.error('Allotment check failed:', error);
            return {
                status: 'ERROR',
                ipoId,
                ipoName: ipo.name,
                message: 'Unable to fetch allotment status. Please try again later or check the official registrar website.',
                checkedAt: Date.now()
            };
        }
    }

    /**
     * Get allotment history for a user (by PAN hash)
     */
    static async getHistory(pan: string): Promise<AllotmentHistory[]> {
        const panHash = await this.hashPAN(pan);
        return this.history.filter(h => h.panHash === panHash);
    }

    /**
     * Clear all history
     */
    static clearHistory(): void {
        this.history = [];
    }

    /**
     * Validate PAN format
     */
    private static validatePAN(pan: string): boolean {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        return panRegex.test(pan);
    }

    /**
     * Generate cache key
     */
    private static getCacheKey(ipoId: string, pan: string): string {
        return `${ipoId}:${pan}`;
    }

    /**
     * Check if cached result is stale
     */
    private static isCacheStale(result: AllotmentResult): boolean {
        return Date.now() - result.checkedAt > this.CACHE_DURATION;
    }

    /**
     * Hash PAN using SHA-256 (never store plain PAN)
     */
    private static async hashPAN(pan: string): Promise<string> {
        // Use Web Crypto API for secure hashing
        const encoder = new TextEncoder();
        const data = encoder.encode(pan);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Save result to history (with hashed PAN)
     */
    private static async saveToHistory(
        ipoId: string,
        ipoName: string,
        pan: string,
        result: AllotmentResult
    ): Promise<void> {
        const panHash = await this.hashPAN(pan);

        const historyEntry: AllotmentHistory = {
            id: `${ipoId}-${Date.now()}`,
            ipoId,
            ipoName,
            panHash,
            result,
            timestamp: Date.now()
        };

        this.history.push(historyEntry);

        // Keep only last 50 entries
        if (this.history.length > 50) {
            this.history = this.history.slice(-50);
        }
    }

    /**
     * Get user-friendly status message
     */
    static getStatusMessage(result: AllotmentResult): string {
        if (result.message) return result.message;

        switch (result.status) {
            case 'ALLOTTED':
                return `Congratulations! You have been allotted ${result.sharesAllotted || 0} shares.`;
            case 'NOT_ALLOTTED':
                return 'You have not been allotted shares. Refund will be processed soon.';
            case 'PENDING':
                return 'Allotment is still in progress. Please check back later.';
            case 'INVALID_DETAILS':
                return 'Invalid PAN or Application Number. Please verify your details.';
            case 'RESULT_NOT_PUBLISHED':
                return 'Allotment results are not yet published.';
            default:
                return 'Unable to fetch allotment status.';
        }
    }
}
