import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

export interface MarketNewsItem {
    id: string;
    title: string;
    link: string;
    pubDate: string; // "Fri, 09 Jan 2026 04:30:00 GMT"
    source: string;
    sentiment?: 'bullish' | 'bearish' | 'neutral';
    imageUrl?: string;
    category?: 'MAINBOARD' | 'SME' | 'MARKET';
}

export class NewsService {
    // Google News RSS Feeds (India Edition)
    private static FEEDS = {
        IPO: 'https://news.google.com/rss/search?q=IPO+India+when:1d&hl=en-IN&gl=IN&ceid=IN:en',
        MARKET: 'https://news.google.com/rss/topics/CAAqTggimacBCiZDQW9TX0tSM0wyMHZNR3R2WkRVdU1DcmdNQkl0VURZd2J5Z0FQAQ?hl=en-IN&gl=IN&ceid=IN:en', // Market/Business Topic
        SME: 'https://news.google.com/rss/search?q=SME+IPO+India+when:2d&hl=en-IN&gl=IN&ceid=IN:en'
    };

    private static PROXY = 'https://api.allorigins.win/raw?url='; // "raw" returns the XML string directly

    /**
     * Fetches and agregates news from all channels
     */
    static async fetchAllNews(): Promise<MarketNewsItem[]> {
        try {
            const [ipoNews, marketNews, smeNews] = await Promise.all([
                this.fetchFeed(this.FEEDS.IPO, 'MAINBOARD'),
                this.fetchFeed(this.FEEDS.MARKET, 'MARKET'),
                this.fetchFeed(this.FEEDS.SME, 'SME')
            ]);

            // Merge and sort by date (newest first)
            const allNews = [...ipoNews, ...marketNews, ...smeNews];

            // Deduplicate by title
            const uniqueNews = Array.from(new Map(allNews.map(item => [item.title, item])).values());

            return uniqueNews.sort((a, b) =>
                new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
            );

        } catch (error) {
            console.error('Failed to fetch comprehensive news:', error);
            return [];
        }
    }

    private static async fetchFeed(feedUrl: string, category: 'MAINBOARD' | 'SME' | 'MARKET'): Promise<MarketNewsItem[]> {
        try {
            let xmlData = '';

            // NATIVE: Bypass CORS using Native HTTP
            if (Capacitor.isNativePlatform()) {
                const response = await CapacitorHttp.get({
                    url: feedUrl, // Direct URL, no proxy needed natively
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                xmlData = response.data;
            }
            // WEB: Use Proxy
            else {
                const response = await axios.get(this.PROXY + encodeURIComponent(feedUrl));
                xmlData = response.data && response.data.contents ? response.data.contents : response.data;
            }

            // Parse XML
            const parser = new XMLParser({
                ignoreAttributes: false,
                attributeNamePrefix: "@_"
            });

            const result = parser.parse(xmlData);

            const channel = result?.rss?.channel;
            const items = channel?.item || [];

            // Normalize items array
            const newsItems = Array.isArray(items) ? items : [items];

            return newsItems.map((item: any) => ({
                id: this.getText(item.guid) || Math.random().toString(36),
                title: this.getText(item.title) || 'Market Update',
                link: this.getText(item.link) || '#',
                pubDate: this.getText(item.pubDate) || new Date().toISOString(),
                source: this.getText(item.source) || 'Market News',
                imageUrl: this.extractImage(this.getText(item.description)),
                sentiment: this.analyzeSentiment(this.getText(item.title) || ''),
                category: category
            }));
        } catch (e) {
            console.warn(`Error fetching feed ${feedUrl}`, e);
            return [];
        }
    }

    /**
     * Helper to safely extract text from XML parser result
     * Handles cases where text is wrapped with attributes or is null
     */
    private static getText(val: any): string {
        if (!val) return '';
        if (typeof val === 'string') return val;
        if (typeof val === 'object') {
            return val['#text'] || val['text'] || '';
        }
        return String(val);
    }

    private static extractImage(description: string): string | undefined {
        if (!description) return undefined;
        // Try simple img tag extraction
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) return imgMatch[1];
        return undefined;
    }

    /**
     * Basic sentiment analysis on headlines
     */
    private static analyzeSentiment(title: string): 'bullish' | 'bearish' | 'neutral' {
        const lower = title.toLowerCase();
        if (lower.match(/(surge|jump|rally|high|gain|profit|buy|strong|record|premium)/)) return 'bullish';
        if (lower.match(/(crash|fall|drop|loss|sell|weak|low|down|risk)/)) return 'bearish';
        return 'neutral';
    }

}
