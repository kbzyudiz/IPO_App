import { BaseRegistrarAdapter } from './BaseRegistrarAdapter';
import { RegistrarType } from '../../core/allotment-types';
import type {
    AllotmentCheckParams,
    AllotmentResult
} from '../../core/allotment-types';

/**
 * Bigshare Registrar Adapter
 * Handles allotment checks for IPOs managed by Bigshare Online
 * 
 * Official URL: https://ipo.bigshareonline.com/IPO_Status.html
 */
export class BigshareAdapter extends BaseRegistrarAdapter {
    name = RegistrarType.BIGSHARE;
    registrarUrl = 'https://ipo.bigshareonline.com/IPO_Status.html';

    async checkAllotment(params: AllotmentCheckParams): Promise<AllotmentResult> {
        const { ipoId, pan, applicationNumber } = params;

        // Validate inputs
        if (!this.validatePAN(pan)) {
            return this.createErrorResult(
                ipoId,
                'Unknown IPO',
                'INVALID_DETAILS',
                'Invalid PAN format. Please enter a valid 10-character PAN.'
            );
        }

        try {
            // NOTE: This is a MOCK implementation for MVP
            // Real implementation would involve making requests to Bigshare's server
            return this.mockAllotmentCheck(ipoId, pan, applicationNumber);

        } catch (error: any) {
            console.error('Bigshare adapter error:', error);

            return this.createErrorResult(
                ipoId,
                'Unknown IPO',
                'ERROR',
                'Unable to fetch allotment status from Bigshare. Please try again later.'
            );
        }
    }

    /**
     * MOCK implementation for MVP
     */
    private mockAllotmentCheck(
        ipoId: string,
        pan: string,
        applicationNumber?: string
    ): AllotmentResult {
        // Simple logic based on PAN last digit for demo purposes
        const lastDigit = parseInt(pan.charAt(pan.length - 2));

        if (lastDigit % 3 === 0) {
            return this.createSuccessResult(ipoId, 'Mock Bigshare IPO', {
                status: 'ALLOTTED',
                applicationNumber: applicationNumber || 'BS' + Date.now(),
                sharesAllotted: 50,
                amountBlocked: 15000,
                refundAmount: 0,
                message: 'Success! Bigshare has confirmed your allotment.'
            });
        } else if (lastDigit % 3 === 1) {
            return this.createErrorResult(
                ipoId,
                'Mock Bigshare IPO',
                'NOT_ALLOTTED',
                'Allotment not received from Bigshare. Refund will be initiated.'
            );
        } else {
            return this.createErrorResult(
                ipoId,
                'Mock Bigshare IPO',
                'RESULT_NOT_PUBLISHED',
                'Bigshare status not yet updated. Please check again in a few hours.'
            );
        }
    }
}
