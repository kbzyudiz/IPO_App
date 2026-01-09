import { BaseRegistrarAdapter } from './BaseRegistrarAdapter';
import { RegistrarType } from '../../core/allotment-types';
import type {
    AllotmentCheckParams,
    AllotmentResult
} from '../../core/allotment-types';

/**
 * KFintech Registrar Adapter
 * Handles allotment checks for IPOs managed by KFin Technologies
 * 
 * Official URL: https://kosmic.kfintech.com/ipostatus/
 */
export class KFintechAdapter extends BaseRegistrarAdapter {
    name = RegistrarType.KFINTECH;
    registrarUrl = 'https://kosmic.kfintech.com/ipostatus/';

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
            // Real implementation would involve making requests to KFintech's endpoint
            return this.mockAllotmentCheck(ipoId, pan, applicationNumber);

        } catch (error: any) {
            console.error('KFintech adapter error:', error);

            return this.createErrorResult(
                ipoId,
                'Unknown IPO',
                'ERROR',
                'Unable to fetch allotment status from KFintech. Please try again later.'
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
            return this.createSuccessResult(ipoId, 'Mock KFin IPO', {
                status: 'ALLOTTED',
                applicationNumber: applicationNumber || 'KF' + Date.now(),
                sharesAllotted: 75,
                amountBlocked: 14925,
                refundAmount: 0,
                message: 'Congratulations! KFintech has allotted shares to you.'
            });
        } else if (lastDigit % 3 === 1) {
            return this.createErrorResult(
                ipoId,
                'Mock KFin IPO',
                'NOT_ALLOTTED',
                'No shares allotted. Better luck next time with KFintech IPOs.'
            );
        } else {
            return this.createErrorResult(
                ipoId,
                'Mock KFin IPO',
                'RESULT_NOT_PUBLISHED',
                'Allotment results not yet published on KFintech portal. Check later.'
            );
        }
    }
}
