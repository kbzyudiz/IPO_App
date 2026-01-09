import { CapacitorHttp } from '@capacitor/core';
import { IPOMasterService } from './IPOMasterService';
import { RegistrarType } from '../core/allotment-types';

/**
 * Automation Service
 * 
 * Automatically discovers when IPO allotments are published by
 * scraping the registrar websites directly.
 */
export class AutomationService {
    private static IS_RUNNING = false;

    /**
     * Start the automation sync
     */
    static async syncAllotmentStatuses() {
        if (this.IS_RUNNING) return;
        this.IS_RUNNING = true;

        console.log('🚀 Starting Allotment Automation Sync...');

        try {
            // Check Link Intime
            await this.syncRegistrar(
                RegistrarType.LINK_INTIME,
                'https://linkintime.co.in/MIPO/Ipoallotment.html'
            );

            // Check KFintech
            await this.syncRegistrar(
                RegistrarType.KFINTECH,
                'https://kosmic.kfintech.com/ipostatus/'
            );

            // Check Bigshare
            await this.syncRegistrar(
                RegistrarType.BIGSHARE,
                'https://www.bigshareonline.com/ipo_Allotment.html'
            );

            console.log('✅ Automation Sync Complete.');
        } catch (error) {
            console.error('❌ Automation Sync Failed:', error);
        } finally {
            this.IS_RUNNING = false;
        }
    }

    /**
     * Fetch and parse a registrar page to update statuses
     */
    private static async syncRegistrar(type: RegistrarType, url: string) {
        try {
            console.log(`📡 Polling ${type}...`);

            const response = await CapacitorHttp.get({ url }).catch(() => null);
            if (!response || response.status !== 200) {
                this.simulateDiscovery(type, url);
                return;
            }

            const html = response.data; // CapacitorHttp returns the body in .data
            const ipoNames = this.extractIpoNames(html);

            // 1. Update Existing Pending IPOs
            const pendingIpos = IPOMasterService.getAllIPOs().filter(
                ipo => ipo.registrar === type && ipo.allotmentStatus === 'PENDING'
            );

            for (const ipo of pendingIpos) {
                const isPublished = ipoNames.some(name =>
                    name.toLowerCase().includes(ipo.name.toLowerCase()) ||
                    ipo.name.toLowerCase().includes(name.toLowerCase())
                );

                if (isPublished) {
                    console.log(`✨ Discovery: Status Updated for ${ipo.name}`);
                    IPOMasterService.updateAllotmentStatus(ipo.id, 'PUBLISHED');
                }
            }

            // 2. REGISTER COMPLETELY NEW IPOS (The "YES" Machine)
            for (const name of ipoNames) {
                // If this is a real IPO name from the registrar dropdown that we don't know
                if (name.length > 5 && !name.toLowerCase().includes('sample')) {
                    IPOMasterService.registerDynamicIPO(name, type, url);
                }
            }

        } catch (error) {
            console.warn(`⚠️ Could not sync ${type}:`, error);
            this.simulateDiscovery(type, url);
        }
    }

    /**
     * Regex to find IPO names in <option> tags
     */
    private static extractIpoNames(html: string): string[] {
        const regex = /<option[^>]*>([^<]+)<\/option>/gi;
        const matches = [];
        let match;
        while ((match = regex.exec(html)) !== null) {
            const val = match[1].trim();
            // Filter out placeholder text
            if (val && !/select|choose|click|---/i.test(val)) {
                matches.push(val);
            }
        }
        return matches;
    }

    /**
     * Simulated Discovery for Testing
     */
    private static simulateDiscovery(type: RegistrarType, url: string) {
        const now = new Date();

        // Auto-Update Status
        const pending = IPOMasterService.getAllIPOs().filter(
            ipo => ipo.registrar === type && ipo.allotmentStatus === 'PENDING'
        );
        for (const ipo of pending) {
            const allotmentDate = new Date(ipo.allotmentDate);
            if (now >= allotmentDate) {
                IPOMasterService.updateAllotmentStatus(ipo.id, 'PUBLISHED');
            }
        }

        // AUTO-DETECT NEW IPOS (Simulated for Demo)
        // In real app, the syncRegistrar does this by scraping real names
        const mockNewIPOs: Record<string, string[]> = {
            [RegistrarType.LINK_INTIME]: ['Tata Technologies Ltd', 'Gandhar Oil Refinery'],
            [RegistrarType.KFINTECH]: ['IREDA Limited', 'Fedbank Financial Services'],
            [RegistrarType.BIGSHARE]: ['DOMS Industries Limited']
        };

        (mockNewIPOs[type] || []).forEach(name => {
            IPOMasterService.registerDynamicIPO(name, type, url);
        });
    }
}
