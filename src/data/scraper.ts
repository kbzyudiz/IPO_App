import axios from 'axios';
import { IPOService } from './services';

export interface ScrapedIPOData {
    name: string;
    gmp?: number;
    subscription?: {
        retail: number;
        qib: number;
        nii: number;
        total: number;
    };
}

export interface DiscoveredIPO {
    name: string;
    symbol: string;
    type: 'Mainboard' | 'SME';
    priceRange: string;
    startDate: string;
    endDate: string;
    status: 'open' | 'upcoming' | 'closed';
    rawDateRange?: string;
    profileUrl?: string;
    scrapedSchedule?: { event: string; date: string }[];
    registrar?: string;
}

import { type NewsItem, type IPOSchedule } from '../core/types';
export type { NewsItem };

export class IPODataScraper {
    private static CORS_PROXY = 'https://api.allorigins.win/raw?url=';

    /**
     * Scrapes live IPO data from Chittorgarh.com
     * This is a fallback method when manual updates aren't available
     */
    static async scrapeChittorgarhData(): Promise<ScrapedIPOData[]> {
        try {
            const gmpUrl = encodeURIComponent('https://www.chittorgarh.com/report/live-ipo-gmp/21/');
            const subscriptionUrl = encodeURIComponent('https://www.chittorgarh.com/report/ipo-subscription-status-live-tracking/22/');

            // Fetch both pages
            const [gmpResponse, subResponse] = await Promise.all([
                axios.get(this.CORS_PROXY + gmpUrl, { timeout: 10000 }),
                axios.get(this.CORS_PROXY + subscriptionUrl, { timeout: 10000 })
            ]);

            const gmpData = this.parseGMPData(gmpResponse.data);
            const subscriptionData = this.parseSubscriptionData(subResponse.data);

            // Merge the data
            return this.mergeScrapedData(gmpData, subscriptionData);
        } catch (error) {
            console.error('Scraping failed:', error);
            return [];
        }
    }

    /**
     * Parse GMP data from HTML
     */
    private static parseGMPData(html: string): Map<string, number> {
        const gmpMap = new Map<string, number>();

        try {
            // Extract table rows containing GMP data
            const tableRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
            const matches = html.matchAll(tableRegex);

            for (const match of matches) {
                const row = match[1];

                // Extract company name and GMP
                const nameMatch = row.match(/<td[^>]*>([^<]+(?:Ltd|Limited|India|Pharma|Tech).*?)<\/td>/i);
                const gmpMatch = row.match(/<td[^>]*>(?:₹|Rs\.?\s*)?(\d+)<\/td>/);

                if (nameMatch && gmpMatch) {
                    const name = nameMatch[1].trim();
                    const gmp = parseInt(gmpMatch[1]);
                    gmpMap.set(name, gmp);
                }
            }
        } catch (error) {
            console.error('GMP parsing error:', error);
        }

        return gmpMap;
    }

    /**
     * Parse subscription data from HTML
     */
    private static parseSubscriptionData(html: string): Map<string, any> {
        const subMap = new Map<string, any>();

        try {
            // Extract table rows
            const tableRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
            const matches = html.matchAll(tableRegex);

            for (const match of matches) {
                const row = match[1];

                // Extract company name
                const nameMatch = row.match(/<td[^>]*>([^<]+(?:Ltd|Limited|India|Pharma|Tech).*?)<\/td>/i);

                // Extract subscription numbers (looking for patterns like "5.2x" or "5.2")
                const numberMatches = row.matchAll(/(\d+\.?\d*)x?/g);
                const numbers = Array.from(numberMatches).map(m => parseFloat(m[1]));

                if (nameMatch && numbers.length >= 4) {
                    const name = nameMatch[1].trim();
                    subMap.set(name, {
                        retail: numbers[0] || 0,
                        qib: numbers[1] || 0,
                        nii: numbers[2] || 0,
                        total: numbers[3] || 0
                    });
                }
            }
        } catch (error) {
            console.error('Subscription parsing error:', error);
        }

        return subMap;
    }

    /**
     * Merge GMP and subscription data
     */
    private static mergeScrapedData(
        gmpData: Map<string, number>,
        subscriptionData: Map<string, any>
    ): ScrapedIPOData[] {
        const result: ScrapedIPOData[] = [];
        const allNames = new Set([...gmpData.keys(), ...subscriptionData.keys()]);

        for (const name of allNames) {
            result.push({
                name,
                gmp: gmpData.get(name),
                subscription: subscriptionData.get(name)
            });
        }

        return result;
    }

    /**
     * Fetch data from ipoalerts.in API (if available)
     * This is a premium API that provides structured JSON data
     */
    static async fetchFromIPOAlertsAPI(apiKey?: string): Promise<ScrapedIPOData[]> {
        if (!apiKey) {
            console.warn('IPO Alerts API key not provided');
            return [];
        }

        try {
            const response = await axios.get('https://api.ipoalerts.in/v1/ipos', {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            });

            return response.data.map((ipo: any) => ({
                name: ipo.name,
                gmp: ipo.gmp,
                subscription: {
                    retail: ipo.subscription?.retail || 0,
                    qib: ipo.subscription?.qib || 0,
                    nii: ipo.subscription?.nii || 0,
                    total: ipo.subscription?.total || 0
                }
            }));
        } catch (error) {
            console.error('IPO Alerts API failed:', error);
            return [];
        }
    }

    /**
     * Backup Scraper: IPOPremium.in
     * URL: https://ipopremium.in/ipo-gmp/
     */
    static async scrapeIPOPremiumData(): Promise<ScrapedIPOData[]> {
        try {
            const url = 'https://ipopremium.in/ipo-gmp/';
            const proxyUrl = this.CORS_PROXY + encodeURIComponent(url);
            const response = await axios.get(proxyUrl, { timeout: 12000 });
            const html = response.data;
            const scrapedData: ScrapedIPOData[] = [];

            // Extract table rows
            const tableRegex = /<table[^>]*>(.*?)<\/table>/gs;
            const tableMatch = tableRegex.exec(html);

            if (tableMatch) {
                const tbody = tableMatch[1];
                const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
                const rows = tbody.matchAll(rowRegex);

                for (const row of rows) {
                    const content = row[1];
                    const tds = Array.from(content.matchAll(/<td[^>]*>(.*?)<\/td>/gs)).map(m => {
                        return m[1].replace(/<[^>]*>/g, '').trim();
                    });

                    // Typically: [0] Name, [1] Offer Price, [2] GMP, [3] Kostak, [4] Subject
                    if (tds.length >= 3) {
                        const name = tds[0].replace(/&amp;/g, '&');
                        const gmpMatch = tds[2].match(/(\d+)/);
                        const gmp = gmpMatch ? parseInt(gmpMatch[1]) : 0;

                        if (name) {
                            scrapedData.push({ name, gmp });
                        }
                    }
                }
            }
            console.log(`[IPOPremium] Scraped ${scrapedData.length} IPOs`);
            return scrapedData;
        } catch (error) {
            console.warn('IPOPremium scraping failed:', error);
            return [];
        }
    }

    /**
     * Backup Scraper: IPOWatch Subscription Status
     * URL: https://ipowatch.in/ipo-subscription-numbers-status/
     */
    static async scrapeIPOWatchSubscription(): Promise<ScrapedIPOData[]> {
        try {
            const url = 'https://ipowatch.in/ipo-subscription-numbers-status/';
            const proxyUrl = this.CORS_PROXY + encodeURIComponent(url);
            const response = await axios.get(proxyUrl, { timeout: 12000 });
            const html = response.data;
            const scrapedData: ScrapedIPOData[] = [];

            const tableRegex = /<table[^>]*>(.*?)<\/table>/gs;
            const tableMatch = tableRegex.exec(html);

            if (tableMatch) {
                const tbody = tableMatch[1];
                const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
                const rows = tbody.matchAll(rowRegex);

                let rowIndex = 0;
                for (const row of rows) {
                    rowIndex++;
                    if (rowIndex === 1) continue; // Skip Header

                    const content = row[1];
                    const tds = Array.from(content.matchAll(/<td[^>]*>(.*?)<\/td>/gs)).map(m => {
                        return m[1].replace(/<[^>]*>/g, '').trim();
                    });

                    // Expected: [0] Name, [1] QIB, [2] NII, [3] Retail, [4] Total, [5] Date
                    if (tds.length >= 5) {
                        const name = tds[0].replace(/&amp;/g, '&');

                        // Parse numbers (handle "2.5x", "2.5", or just "2")
                        const parseSub = (str: string) => parseFloat(str.replace(/x/i, '').trim()) || 0;

                        const qib = parseSub(tds[1]);
                        const nii = parseSub(tds[2]);
                        const retail = parseSub(tds[3]);
                        const total = parseSub(tds[4]);

                        if (name) {
                            scrapedData.push({
                                name,
                                subscription: { qib, nii, retail, total }
                            });
                        }
                    }
                }
            }
            console.log(`[IPOWatch Sub] Scraped ${scrapedData.length} Subscription stats`);
            return scrapedData;
        } catch (error) {
            console.warn('IPOWatch Subscription scraping failed:', error);
            return [];
        }
    }

    /**
     * Scrapes live IPO data from IPOWatch (GMP Focus)
     * URL: https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/
     */
    static async scrapeIPOWatchData(): Promise<ScrapedIPOData[]> {
        try {
            const url = 'https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/';
            const proxyUrl = this.CORS_PROXY + encodeURIComponent(url);

            const response = await axios.get(proxyUrl, { timeout: 10000 });
            const html = response.data;

            const scrapedData: ScrapedIPOData[] = [];

            // Regex to extract table rows from the first table (Mainboard/SME)
            const tableRegex = /<table[^>]*>(.*?)<\/table>/gs;
            const tableMatch = tableRegex.exec(html);

            if (tableMatch) {
                const tbody = tableMatch[1];
                const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
                const rows = tbody.matchAll(rowRegex);

                let rowIndex = 0;
                for (const row of rows) {
                    rowIndex++;
                    if (rowIndex === 1) continue; // Skip header

                    const content = row[1];
                    const tds = Array.from(content.matchAll(/<td[^>]*>(.*?)<\/td>/gs)).map(m => {
                        return m[1].replace(/<[^>]*>/g, '').trim();
                    });

                    if (tds.length >= 2) {
                        const name = tds[0].replace(/&amp;/g, '&').trim();
                        // Extract number from GMP (e.g., "₹30" -> 30, "₹- " -> 0)
                        const gmpMatch = tds[1].match(/(\d+)/);
                        const gmp = gmpMatch ? parseInt(gmpMatch[1]) : 0;

                        // Basic data extraction for MVP
                        scrapedData.push({
                            name,
                            gmp
                        });
                    }
                }
            }

            console.log(`[IPOWatch] Scraped ${scrapedData.length} IPOs`);
            return scrapedData;
        } catch (error) {
            console.error('IPOWatch scraping failed:', error);
            return [];
        }
    }

    /**
     * Smart data fetcher - Hybrid Strategy
     * Merges GMP from IPOWatch (Reliable) with Subscription from Chittorgarh (Detailed)
     */
    static async fetchLatestData(apiKey?: string): Promise<ScrapedIPOData[]> {
        // 1. Try API first (if key is available)
        if (apiKey) {
            const apiData = await this.fetchFromIPOAlertsAPI(apiKey);
            if (apiData.length > 0) return apiData;
        }

        // 2. Parallel Fetch from BOTH sources
        // We use Promise.all to fetch them simultaneously for speed
        let [ipoWatchData, chittorgarhData] = await Promise.all([
            this.scrapeIPOWatchData(),
            this.scrapeChittorgarhData()
        ]);

        // --- BACKUP LAYER ---
        // If IPOWatch fails or returns empty, try IPOPremium
        if (ipoWatchData.length === 0) {
            console.log('[Hybrid Scraper] Primary GMP source failed, trying backup (IPOPremium)...');
            ipoWatchData = await this.scrapeIPOPremiumData();
        }

        // If Chittorgarh fails (empty subscription data), try IPOWatch Subscription backup
        if (chittorgarhData.length === 0) {
            console.log('[Hybrid Scraper] Primary Subscription source failed, trying backup (IPOWatch Sub)...');
            chittorgarhData = await this.scrapeIPOWatchSubscription();
        }

        console.log(`[Hybrid Scraper] GMP Source: ${ipoWatchData.length}, Sub Source: ${chittorgarhData.length}`);

        // 3. Intelligent Merge
        // We use a Map to dedup by normalized name
        const mergedMap = new Map<string, ScrapedIPOData>();

        const normalize = (name: string) => name.toLowerCase().replace(/ipo/g, '').replace(/[^a-z0-9]/g, '');

        // A. Load Chittorgarh Data First (Base - Good for Subscription)
        chittorgarhData.forEach(item => {
            const key = normalize(item.name);
            mergedMap.set(key, item);
        });

        // B. Overlay IPOWatch Data (Overlay - Good for GMP)
        ipoWatchData.forEach(item => {
            const key = normalize(item.name);
            const existing = mergedMap.get(key);

            if (existing) {
                // Merge logic: Update GMP from IPOWatch if it exists (usually fresher)
                if (item.gmp !== undefined && item.gmp > 0) {
                    existing.gmp = item.gmp;
                }
                // We keep existing.subscription from Chittorgarh (as IPOWatch usually lacks it)
            } else {
                // New IPO found only in IPOWatch
                mergedMap.set(key, item);
            }
        });

        const result = Array.from(mergedMap.values());
        console.log(`[Hybrid Scraper] Merged into ${result.length} unique IPOs`);
        return result;
    }

    /**
     * Discovers new IPOs from the main listing pages or professional API
     */
    static async discoverNewIPOs(apiKey?: string): Promise<DiscoveredIPO[]> {
        if (apiKey) {
            try {
                const statuses: ('open' | 'upcoming' | 'announced' | 'closed')[] = ['open', 'upcoming', 'announced', 'closed'];
                const fetchPromises = statuses.map(status =>
                    axios.get(`https://api.ipoalerts.in/ipos?status=${status}`, {
                        headers: { 'x-api-key': apiKey },
                        timeout: 10000
                    })
                );

                const responses = await Promise.all(fetchPromises);
                const allIPOs: DiscoveredIPO[] = [];

                responses.forEach((res, idx) => {
                    if (res.data && Array.isArray(res.data.data)) {
                        res.data.data.forEach((ipo: any) => {
                            allIPOs.push({
                                name: ipo.name,
                                symbol: ipo.symbol || ipo.name.split(' ')[0].toUpperCase(),
                                type: ipo.type === 'SME' ? 'SME' : 'Mainboard',
                                priceRange: ipo.priceRange || `${ipo.minPrice}-${ipo.maxPrice}` || 'TBA',
                                startDate: ipo.startDate || 'TBA',
                                endDate: ipo.endDate || 'TBA',
                                status: statuses[idx] === 'announced' ? 'upcoming' : (statuses[idx] as any)
                            });
                        });
                    }
                });
                return allIPOs;
            } catch (error) {
                console.error('API Discovery failed, falling back to scraper:', error);
            }
        }

        // Try IPOWatch Discovery (More reliable currently)
        try {
            const url = 'https://ipowatch.in/ipo-grey-market-premium-latest-ipo-gmp/';
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await axios.get(proxyUrl, { timeout: 10000 });
            const html = response.data;

            const discovered: DiscoveredIPO[] = [];
            const tableRegex = /<table[^>]*>(.*?)<\/table>/gs;
            const tableMatch = tableRegex.exec(html);

            if (tableMatch) {
                const tbody = tableMatch[1];
                const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
                const rows = tbody.matchAll(rowRegex);

                let rowIndex = 0;
                for (const row of rows) {
                    rowIndex++;
                    if (rowIndex === 1) continue; // Skip header

                    const content = row[1];
                    const tds = Array.from(content.matchAll(/<td[^>]*>(.*?)<\/td>/gs)).map(m => {
                        return m[1].replace(/<[^>]*>/g, '').trim();
                    });

                    // [0] Name, [1] GMP, [2] Price, [3] Gain, [4] Review, [5] Date, [6] Type
                    if (tds.length >= 7) {
                        const name = tds[0].replace(/&amp;/g, '&').trim();
                        const dateRange = tds[5]; // e.g., "9-13 Jan"
                        const type = tds[6].includes('SME') ? 'SME' : 'Mainboard';
                        const priceRange = tds[2].replace(/₹/g, '').trim();

                        // Parse date range into startDate and endDate
                        // Format: "9-13 Jan" or "31-2 Jan" or "7-9 Jan"
                        let startDate = 'TBA';
                        let endDate = 'TBA';

                        const dateMatch = dateRange.match(/(\d+)-(\d+)\s+([A-Za-z]+)/);
                        if (dateMatch) {
                            const currentYear = new Date().getFullYear();
                            const month = dateMatch[3];
                            startDate = `${dateMatch[1].padStart(2, '0')} ${month} ${currentYear}`;
                            endDate = `${dateMatch[2].padStart(2, '0')} ${month} ${currentYear}`;
                        }

                        const now = new Date();
                        const sDate = new Date(startDate);
                        const eDate = new Date(endDate);

                        let status: 'open' | 'upcoming' | 'closed' = 'upcoming';
                        if (now >= sDate && now <= eDate) status = 'open';
                        else if (now > eDate) status = 'closed';


                        // Extract URL
                        // tds[0] contains the link: <a href="https://ipowatch.in/..." ...>Name</a>
                        // We need to parse it from the raw `content` of the row, not the stripped `tds`.
                        // The columns in `tds` are stripped of tags.
                        // Let's re-extract the first TD's inner HTML from `content`.
                        const firstTdMatch = content.match(/<td[^>]*>(.*?)<\/td>/s); // First TD
                        let detailUrl = '';
                        if (firstTdMatch) {
                            const linkMatch = firstTdMatch[1].match(/href="([^"]+)"/);
                            if (linkMatch) detailUrl = linkMatch[1];
                        }

                        let timeline: IPOSchedule[] = [];

                        // IF the IPO is OPEN or UPCOMING, let's fetch the detailed schedule
                        // We limit this to active ones to save bandwidth/time
                        if ((status === 'open' || status === 'upcoming') && detailUrl) {
                            try {
                                console.log(`[Detailed Scraping] Fetching schedule for ${name}...`);
                                timeline = await this.scrapeDetailedSchedule(detailUrl);
                            } catch (e) {
                                console.warn(`Failed to scrape details for ${name}`, e);
                            }
                        }

                        // Extract Registrar
                        const registrarEvent = timeline.find(e => e.event === 'Registrar');
                        const registrarName = registrarEvent ? registrarEvent.date : undefined;

                        discovered.push({
                            name,
                            symbol: name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, ''),
                            type,
                            priceRange,
                            startDate,
                            endDate,
                            status,
                            rawDateRange: dateRange,
                            profileUrl: detailUrl,
                            scrapedSchedule: timeline.length > 0 ? timeline : undefined,
                            registrar: registrarName
                        });
                    }
                }
            }
            if (discovered.length > 0) return discovered;
        } catch (error) {
            console.error('IPOWatch Discovery failed:', error);
        }

        // Fallback to Chittorgarh Scraping
        try {
            const mainboardUrl = encodeURIComponent('https://www.chittorgarh.com/report/ipo-report-list/81/');
            const smeUrl = encodeURIComponent('https://www.chittorgarh.com/report/sme-ipo-report-list/84/');

            const [mainboardRes, smeRes] = await Promise.all([
                axios.get(this.CORS_PROXY + mainboardUrl, { timeout: 10000 }),
                axios.get(this.CORS_PROXY + smeUrl, { timeout: 10000 })
            ]);

            const mainboardIPOs = this.parseDiscoveryTable(mainboardRes.data, 'Mainboard');
            const smeIPOs = this.parseDiscoveryTable(smeRes.data, 'SME');

            return [...mainboardIPOs, ...smeIPOs];
        } catch (error) {
            console.error('Discovery failed:', error);
            return [];
        }
    }

    /**
     * Visits the specific IPO detail page to scrape the "Tentative Timetable"
     */
    private static async scrapeDetailedSchedule(url: string): Promise<IPOSchedule[]> {
        const schedule: IPOSchedule[] = [];
        try {
            // Basic IPOWatch Detail Page Scraper
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await axios.get(proxyUrl, { timeout: 8000 });
            const html = response.data;

            // Look for the table with Dates
            // The structure is usually <tr><td>Event</td><td>Date</td></tr>
            // We search generically for rows to be robust
            const rowRegex = /<tr[^>]*>\s*<td[^>]*>(.*?)<\/td>\s*<td[^>]*>(.*?)<\/td>\s*<\/tr>/gs;
            const matches = html.matchAll(rowRegex);

            for (const match of matches) {
                const eventRaw = match[1].replace(/<[^>]*>/g, '').trim(); // Strip HTML
                const dateRaw = match[2].replace(/<[^>]*>/g, '').trim(); // Strip HTML

                // Map to our standard keys
                let eventName = '';
                if (eventRaw.match(/Open Date/i)) eventName = 'IPO Open Date';
                else if (eventRaw.match(/Close Date/i)) eventName = 'IPO Close Date';
                else if (eventRaw.match(/Allotment/i)) eventName = 'Basis of Allotment';
                else if (eventRaw.match(/Refunds/i)) eventName = 'Initiation of Refunds';
                else if (eventRaw.match(/Credit/i)) eventName = 'Credit of Shares to Demat';
                else if (eventRaw.match(/Listing/i)) eventName = 'IPO Listing Date';
                else if (eventRaw.match(/Registrar/i)) eventName = 'Registrar'; // Capture Registrar

                if (eventName && dateRaw) {
                    schedule.push({ event: eventName, date: dateRaw });
                }
            }
        } catch (error) {
            console.warn(`Detail scrape failed for ${url}`, error);
        }
        return schedule;
    }

    private static parseDiscoveryTable(html: string, type: 'Mainboard' | 'SME'): DiscoveredIPO[] {
        const ipos: DiscoveredIPO[] = [];
        try {
            const tableRegex = /<tr[^>]*>(.*?)<\/tr>/gs;
            const matches = html.matchAll(tableRegex);

            for (const match of matches) {
                const row = match[1];
                // Extract <td> contents precisely
                const tds = Array.from(row.matchAll(/<td[^>]*>(.*?)<\/td>/gs)).map(m => {
                    let text = m[1].replace(/<[^>]*>/g, '').trim();
                    // Basic HTML entity decoding
                    return text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                });

                if (tds.length >= 6) {
                    const fullName = tds[0];
                    const openDate = tds[1];
                    const closeDate = tds[2];
                    const priceRange = tds[4];

                    if (!fullName || fullName.toLowerCase().includes('company') || openDate.toLowerCase().includes('open date')) continue;

                    // Clean name: remove "IPO" suffix and extra spaces
                    const name = fullName.replace(/\s+IPO$/i, '').trim();

                    // Simple status derivation
                    const now = new Date();
                    const start = new Date(openDate);
                    const end = new Date(closeDate);

                    let status: 'open' | 'upcoming' | 'closed' = 'upcoming';
                    if (now >= start && now <= end) status = 'open';
                    else if (now > end) status = 'closed';

                    console.log(`[Discovery] Found ${type}: ${name} (${status})`);

                    ipos.push({
                        name,
                        symbol: name.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, ''),
                        type,
                        priceRange,
                        startDate: openDate,
                        endDate: closeDate,
                        status
                    });
                }
            }
        } catch (error) {
            console.error('Discovery parsing error:', error);
        }
        return ipos;
    }


    /* TEMPORARILY DISABLED - RSS sources returning stale data
    private static readonly NEWS_SOURCES = [
        // Google News - High frequency, reliable (using proxy to avoid CORS)
        'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://news.google.com/rss/search?q=IPO+India+when:7d&hl=en-IN&gl=IN&ceid=IN:en'),
        // Moneycontrol - Good quality
        'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://www.moneycontrol.com/rss/MCTOPNEWS.xml'),
        // Economic Times - Market specific
        'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://economictimes.indiatimes.com/markets/ipos/fpos/rssfeeds/19754920.cms')
    ];
    */

    /**
     * Scrapes live IPO news from Moneycontrol
     * URL: https://www.moneycontrol.com/news/business/ipo/
     */
    static async scrapeMoneycontrolNews(): Promise<NewsItem[]> {
        try {
            const url = 'https://www.moneycontrol.com/news/business/ipo/';
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

            const response = await axios.get(proxyUrl, { timeout: 10000 });
            const html = response.data;

            const newsItems: NewsItem[] = [];

            // Regex to extract news items from Moneycontrol's listing
            // Standard MC pattern: <li class="clearfix" id="newslist-...">...</li>
            const newsItemRegex = /<li[^>]*class="clearfix"[^>]*>(.*?)<\/li>/gs;
            const matches = html.matchAll(newsItemRegex);

            let count = 0;
            for (const match of matches) {
                if (count >= 10) break;

                const content = match[1];

                // Extract Title and Link
                const linkMatch = content.match(/<h2><a href="([^"]+)" title="([^"]+)">/);
                // Extract Source (usually Moneycontrol)
                const source = "Moneycontrol";
                // Extract Time
                const timeMatch = content.match(/<span>([^<]+)<\/span>/);
                // Extract Image
                const imgMatch = content.match(/<img[^>]*src="([^"]+)"/);

                if (linkMatch) {
                    const title = linkMatch[2].replace(/&amp;/g, '&');
                    const link = linkMatch[1].startsWith('http') ? linkMatch[1] : `https://www.moneycontrol.com${linkMatch[1]}`;
                    const time = timeMatch ? timeMatch[1].trim() : 'Recently';
                    const image = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1611974717482-962553c71df3?q=80&w=800';

                    newsItems.push({
                        id: `mc-${count}-${Date.now()}`,
                        title,
                        source,
                        time,
                        category: 'MARKET',
                        image,
                        link
                    });
                    count++;
                }
            }

            return newsItems;
        } catch (error) {
            console.error('Moneycontrol scraping failed:', error);
            return [];
        }
    }

    /**
     * Scrapes live IPO news from Economic Times
     */
    static async scrapeEconomicTimesNews(): Promise<NewsItem[]> {
        try {
            const url = 'https://economictimes.indiatimes.com/markets/ipos/fpos';
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await axios.get(proxyUrl, { timeout: 10000 });
            const html = response.data;
            const newsItems: NewsItem[] = [];

            // Pattern for ET news in the listing
            const itemRegex = /<div class="eachStory">.*?<a href="([^"]+)">.*?<h3[^>]*>(.*?)<\/h3>.*?<p>(.*?)<\/p>.*?<time[^>]*>(.*?)<\/time>/gs;
            const matches = html.matchAll(itemRegex);

            let count = 0;
            for (const match of matches) {
                if (count >= 10) break;
                const link = match[1].startsWith('http') ? match[1] : `https://economictimes.indiatimes.com${match[1]}`;
                const title = match[2].trim();
                const summary = match[3].trim();
                const time = match[4].trim();

                newsItems.push({
                    id: `et-${count}-${Date.now()}`,
                    title,
                    summary,
                    source: 'Economic Times',
                    time,
                    category: title.toUpperCase().includes('SME') ? 'SME' : 'MARKET',
                    image: 'https://images.unsplash.com/photo-1611974717482-962553c71df3?q=80&w=800',
                    link
                });
                count++;
            }
            return newsItems;
        } catch (error) {
            console.error('ET scraping failed:', error);
            return [];
        }
    }

    /**
     * Scrapes live IPO news from Financial Express
     */
    static async scrapeFinancialExpressNews(): Promise<NewsItem[]> {
        try {
            const url = 'https://www.financialexpress.com/market/ipo/';
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
            const response = await axios.get(proxyUrl, { timeout: 10000 });
            const html = response.data;
            const newsItems: NewsItem[] = [];

            const itemRegex = /<article[^>]*>.*?<h[23][^>]*><a href="([^"]+)"[^>]*>(.*?)<\/a><\/h[23]>.*?<div class="entry-excerpt">.*?<p>(.*?)<\/p>/gs;
            const matches = html.matchAll(itemRegex);

            let count = 0;
            for (const match of matches) {
                if (count >= 10) break;
                const link = match[1];
                const title = match[2].trim();
                const summary = match[3].trim();

                newsItems.push({
                    id: `fe-${count}-${Date.now()}`,
                    title,
                    summary,
                    source: 'Financial Express',
                    time: 'Recent',
                    category: title.toUpperCase().includes('SME') ? 'SME' : 'MAINBOARD',
                    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800',
                    link
                });
                count++;
            }
            return newsItems;
        } catch (error) {
            console.error('FE scraping failed:', error);
            return [];
        }
    }

    /**
     * Fetch hyper-realtime Stock/Business news from multiple sources
     */
    static async fetchIPONews(): Promise<NewsItem[]> {
        try {
            const results = await Promise.allSettled([
                this.scrapeMoneycontrolNews(),
                this.scrapeEconomicTimesNews(),
                this.scrapeFinancialExpressNews()
            ]);

            const allNews: NewsItem[] = [];
            results.forEach(res => {
                if (res.status === 'fulfilled') {
                    allNews.push(...res.value);
                }
            });

            if (allNews.length > 0) {
                // Sort by relative time if possible (simplified by balancing sources)
                return allNews.slice(0, 30);
            }

            return IPOService.getFallbackNews();
        } catch (error) {
            console.warn('News aggregation failed, using fallback:', error);
            return IPOService.getFallbackNews();
        }
    }
}

