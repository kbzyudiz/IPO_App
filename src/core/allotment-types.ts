// ============================================
// ALLOTMENT MODULE TYPES
// ============================================

/**
 * Supported IPO Registrars
 */
export const RegistrarType = {
    LINK_INTIME: 'link-intime',
    KFINTECH: 'kfintech',
    BIGSHARE: 'bigshare',
    UNKNOWN: 'unknown'
} as const;

export type RegistrarType = typeof RegistrarType[keyof typeof RegistrarType];

/**
 * Allotment check result status
 */
export type AllotmentStatus =
    | 'ALLOTTED'
    | 'NOT_ALLOTTED'
    | 'PENDING'
    | 'INVALID_DETAILS'
    | 'RESULT_NOT_PUBLISHED'
    | 'ERROR';

/**
 * Normalized allotment result (registrar-agnostic)
 */
export interface AllotmentResult {
    status: AllotmentStatus;
    ipoName: string;
    ipoId: string;
    applicationNumber?: string;
    sharesAllotted?: number;
    amountBlocked?: number;
    refundAmount?: number;
    dpId?: string;
    clientId?: string;
    checkedAt: number;
    message?: string; // User-friendly message
    rawData?: any; // For debugging only
}

/**
 * IPO Master entry for allotment tracking
 */
export interface IPOMasterEntry {
    id: string;
    name: string;
    symbol: string;
    registrar: RegistrarType;
    registrarUrl: string;
    allotmentDate: string;
    allotmentStatus: 'UPCOMING' | 'PENDING' | 'PUBLISHED';
    lastChecked?: number;
}

/**
 * Allotment check request parameters
 */
export interface AllotmentCheckParams {
    ipoId: string;
    pan: string;
    applicationNumber?: string;
}

/**
 * Allotment history entry (stored locally)
 */
export interface AllotmentHistory {
    id: string;
    ipoId: string;
    ipoName: string;
    panHash: string; // SHA-256 hashed PAN (never store plain)
    result: AllotmentResult;
    timestamp: number;
}

/**
 * Registrar adapter interface (all adapters must implement)
 */
export interface IRegistrarAdapter {
    name: RegistrarType;
    checkAllotment(params: AllotmentCheckParams): Promise<AllotmentResult>;
}
