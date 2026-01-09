// import axios from 'axios'; // TODO: Uncomment when implementing real API integration
import { BaseRegistrarAdapter } from './BaseRegistrarAdapter';
import { RegistrarType } from '../../core/allotment-types';
import type {
    AllotmentCheckParams,
    AllotmentResult
} from '../../core/allotment-types';

/**
 * Link Intime Registrar Adapter
 * Handles allotment checks for IPOs managed by Link Intime India Pvt Ltd
 * 
 * Official URL: https://linkintime.co.in/MIPO/Ipoallotment.html
 */
export class LinkIntimeAdapter extends BaseRegistrarAdapter {
    name = RegistrarType.LINK_INTIME;
    registrarUrl = 'https://linkintime.co.in/MIPO/Ipoallotment.html';

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
            // Real implementation would:
            // 1. Make HTTP request to Link Intime portal
            // 2. Handle session/cookies if needed
            // 3. Parse HTML response
            // 4. Extract allotment data

            // For now, return mock data based on PAN pattern
            return this.mockAllotmentCheck(ipoId, pan, applicationNumber);

        } catch (error: any) {
            console.error('Link Intime adapter error:', error);

            return this.createErrorResult(
                ipoId,
                'Unknown IPO',
                'ERROR',
                'Unable to fetch allotment status. Please try again later.'
            );
        }
    }

    /**
     * MOCK implementation for MVP
     * TODO: Replace with real Link Intime API integration
     */
    private mockAllotmentCheck(
        ipoId: string,
        pan: string,
        applicationNumber?: string
    ): AllotmentResult {
        // Simulate different scenarios based on PAN last digit
        const lastDigit = parseInt(pan.charAt(pan.length - 2));

        if (lastDigit % 3 === 0) {
            // Allotted
            return this.createSuccessResult(ipoId, 'Mock IPO Name', {
                status: 'ALLOTTED',
                applicationNumber: applicationNumber || 'APP' + Date.now(),
                sharesAllotted: 100,
                amountBlocked: 15000,
                refundAmount: 0,
                message: 'Congratulations! You have been allotted shares.'
            });
        } else if (lastDigit % 3 === 1) {
            // Not allotted
            return this.createErrorResult(
                ipoId,
                'Mock IPO Name',
                'NOT_ALLOTTED',
                'You have not been allotted shares. Refund will be processed soon.'
            );
        } else {
            // Result not published
            return this.createErrorResult(
                ipoId,
                'Mock IPO Name',
                'RESULT_NOT_PUBLISHED',
                'Allotment results are not yet published. Please check back later.'
            );
        }
    }

    /**
     * Real implementation (commented out for MVP)
     * Uncomment and implement when ready for production
     */
    /*
    private async fetchFromLinkIntime(
        ipoId: string,
        pan: string,
        applicationNumber?: string
    ): Promise<AllotmentResult> {
        // Step 1: Get IPO list and find the correct IPO ID
        const ipoListUrl = 'https://linkintime.co.in/MIPO/Ipoallotment.html';
        const listResponse = await axios.get(ipoListUrl);
        
        // Parse HTML to find IPO dropdown options
        // Extract the internal IPO ID used by Link Intime
        
        // Step 2: Submit allotment check request
        const checkUrl = 'https://linkintime.co.in/MIPO/AllotmentStatus';
        const formData = new FormData();
        formData.append('IPOName', internalIpoId);
        formData.append('PAN', pan);
        if (applicationNumber) {
            formData.append('AppNo', applicationNumber);
        }
        
        const response = await axios.post(checkUrl, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        // Step 3: Parse HTML response
        const html = response.data;
        
        // Extract data using regex or HTML parser
        // Look for patterns like:
        // - "Application No: 12345"
        // - "Shares Allotted: 100"
        // - "Amount Blocked: 15000"
        
        // Step 4: Return normalized result
        return this.createSuccessResult(ipoId, ipoName, {
            applicationNumber: extractedAppNo,
            sharesAllotted: extractedShares,
            amountBlocked: extractedAmount,
            refundAmount: extractedRefund
        });
    }
    */
}
