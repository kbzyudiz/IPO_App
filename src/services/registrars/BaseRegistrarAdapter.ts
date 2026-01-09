import { RegistrarType } from '../../core/allotment-types';
import type {
    IRegistrarAdapter,
    AllotmentCheckParams,
    AllotmentResult,
    AllotmentStatus
} from '../../core/allotment-types';

/**
 * Base abstract class for all registrar adapters
 * Provides common utilities and enforces interface contract
 */
export abstract class BaseRegistrarAdapter implements IRegistrarAdapter {
    abstract name: RegistrarType;
    abstract registrarUrl: string;

    /**
     * Main method - must be implemented by each registrar
     */
    abstract checkAllotment(params: AllotmentCheckParams): Promise<AllotmentResult>;

    /**
     * Validate PAN format (common across all registrars)
     */
    protected validatePAN(pan: string): boolean {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
        return panRegex.test(pan);
    }

    /**
     * Validate Application Number format (basic check)
     */
    protected validateApplicationNumber(appNo: string): boolean {
        return appNo.length >= 6 && appNo.length <= 20;
    }

    /**
     * Create error result with user-friendly message
     */
    protected createErrorResult(
        ipoId: string,
        ipoName: string,
        status: AllotmentStatus,
        message: string
    ): AllotmentResult {
        return {
            status,
            ipoId,
            ipoName,
            message,
            checkedAt: Date.now()
        };
    }

    /**
     * Create success result
     */
    protected createSuccessResult(
        ipoId: string,
        ipoName: string,
        data: Partial<AllotmentResult>
    ): AllotmentResult {
        return {
            status: 'ALLOTTED',
            ipoId,
            ipoName,
            checkedAt: Date.now(),
            ...data
        };
    }

    /**
     * Sanitize and normalize text from HTML responses
     */
    protected sanitizeText(text: string): string {
        return text
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/<[^>]*>/g, '')
            .trim();
    }

    /**
     * Parse number from string (handles Indian number format)
     */
    protected parseNumber(value: string): number {
        return parseFloat(value.replace(/,/g, ''));
    }
}
