import axios from 'axios';

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
}

export interface NewsItem {
    id: string;
    title: string;
    source: string;
    time: string;
    category: string;
    image: string;
    link: string;
}

export class IPODataScraper {
    private static CORS_PROXY = 'https://corsproxy.io/?';

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
     * Smart data fetcher - tries multiple sources
     */
    static async fetchLatestData(apiKey?: string): Promise<ScrapedIPOData[]> {
        // Try API first (if key is available)
        if (apiKey) {
            const apiData = await this.fetchFromIPOAlertsAPI(apiKey);
            if (apiData.length > 0) return apiData;
        }

        // Fallback to scraping
        return await this.scrapeChittorgarhData();
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

    /**
     * Fetch hyper-realtime Stock/Business news from multiple RSS sources for cross-verification
     */
    static async fetchIPONews(): Promise<NewsItem[]> {
        const sources = [
            { name: 'Moneycontrol', url: 'https://www.moneycontrol.com/news/business/feed' },
            { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/news/business/rssfeedmsid-1554397.cms' },
            { name: 'Business Standard', url: 'https://www.business-standard.com/rss/latest.rss' }
        ];

        try {
            const newsPromises = sources.map(source =>
                axios.get(this.CORS_PROXY + encodeURIComponent(source.url), { timeout: 8000 })
                    .then(res => this.parseRSSFeed(res.data, source.name))
                    .catch(() => [] as NewsItem[])
            );

            const allNewsResults = await Promise.all(newsPromises);
            const mergedNews = allNewsResults.flat();

            // Sort by time (newest first)
            mergedNews.sort((a, b) => {
                const timeA = this.parseTimeToMinutes(a.time);
                const timeB = this.parseTimeToMinutes(b.time);
                return timeA - timeB;
            });

            if (mergedNews.length > 0) {
                return mergedNews.slice(0, 15);
            }

            // Ultimate Fallback to Mirror API if RSS is blocked/fails
            const mirrorRes = await axios.get('https://saurav.tech/NewsAPI/top-headlines/category/business/in.json', { timeout: 5000 });
            if (mirrorRes.data && mirrorRes.data.articles) {
                return mirrorRes.data.articles.map((article: any) => ({
                    id: Math.random().toString(36).substring(2, 9),
                    title: article.title,
                    source: article.source.name || 'Market News',
                    time: 'Recently',
                    category: 'MARKET TRENDS',
                    image: article.urlToImage || 'https://images.unsplash.com/photo-1611974717482-962553c71df3?q=80&w=800',
                    link: article.url
                })).slice(0, 10);
            }

            return [];
        } catch (error) {
            console.error('All news sources failed:', error);
            return [];
        }
    }

    private static parseRSSFeed(xml: string, sourceName: string): NewsItem[] {
        const items: NewsItem[] = [];
        try {
            const itemRegex = /<item>(.*?)<\/item>/gs;
            const matches = xml.matchAll(itemRegex);

            for (const match of matches) {
                const content = match[1];
                const titleMatch = content.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
                const linkMatch = content.match(/<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/link>/i);
                const dateMatch = content.match(/<pubDate>(.*?)<\/pubDate>/i);
                const imgMatch = content.match(/<media:content[^>]*url="(.*?)"/i) ||
                    content.match(/<enclosure[^>]*url="(.*?)"/i) ||
                    content.match(/<img[^>]*src="(.*?)"/i);

                if (titleMatch && linkMatch) {
                    const title = titleMatch[1].trim();
                    const link = linkMatch[1].trim();
                    const pubDateStr = dateMatch ? dateMatch[1] : '';

                    let timeStr = 'Recently';
                    if (pubDateStr) {
                        const pubDate = new Date(pubDateStr);
                        const diffTicks = Date.now() - pubDate.getTime();
                        const diffMins = Math.floor(diffTicks / (1000 * 60));
                        const diffHours = Math.floor(diffMins / 60);

                        if (diffMins < 60) timeStr = `${diffMins}m ago`;
                        else if (diffHours < 24) timeStr = `${diffHours}h ago`;
                        else timeStr = `${Math.floor(diffHours / 24)}d ago`;
                    }

                    items.push({
                        id: Math.random().toString(36).substring(2, 9),
                        title: title.replace(/&amp;/g, '&'),
                        source: sourceName,
                        time: timeStr,
                        category: 'HYPER-LIVE',
                        image: imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1611974717482-962553c71df3?q=80&w=800',
                        link
                    });
                }
                if (items.length >= 8) break;
            }
        } catch (e) {
            console.error(`RSS parsing failed for ${sourceName}:`, e);
        }
        return items;
    }

    private static parseTimeToMinutes(timeStr: string): number {
        if (timeStr.includes('m ago')) return parseInt(timeStr);
        if (timeStr.includes('h ago')) return parseInt(timeStr) * 60;
        if (timeStr.includes('d ago')) return parseInt(timeStr) * 1440;
        return 99999; // Default for "Recently"
    }
}
