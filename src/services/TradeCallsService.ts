import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export interface TradeCall {
    id: string;
    stock: string;
    action: 'BUY' | 'SELL' | 'HOLD';
    target: string;
    stopLoss: string;
    broker: string;
    url: string;
    timestamp: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
}

export class TradeCallsService {
    // Moneycontrol Broker Research RSS
    private static FEED_URL = 'https://www.moneycontrol.com/rss/broker-research-reports.xml';
    private static PROXY = 'https://api.allorigins.win/raw?url=';

    static async fetchCalls(): Promise<TradeCall[]> {
        try {
            // Using AllOrigins proxy to bypass CORS
            const response = await axios.get(this.PROXY + encodeURIComponent(this.FEED_URL));
            const xmlData = response.data;

            const parser = new XMLParser({ ignoreAttributes: false });
            const result = parser.parse(xmlData);
            const items = result?.rss?.channel?.item || [];

            // Normalize to array
            const newsItems = Array.isArray(items) ? items : [items];

            return newsItems.map((item: any) => this.parseItem(item)).filter((call): call is TradeCall => call !== null);

        } catch (error) {
            console.error("Failed to fetch trade calls:", error);
            return []; // Fail gracefully with empty list (UI handles this)
        }
    }

    private static parseItem(item: any): TradeCall | null {
        try {
            const title = item.title || "";
            // Example Title: "Buy Tata Motors; target of Rs 1200: Motilal Oswal"
            // Example Title: "Accumulate HDFC Bank; target of Rs 1900: KR Choksey"

            // Regex to find Action (Buy/Sell/Accumulate)
            const actionMatch = title.match(/^(Buy|Sell|Accumulate|Hold|Reduce)/i);
            if (!actionMatch) return null; // Not a valid trade call

            let normalizeAction: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
            const rawAction = actionMatch[1].toUpperCase();
            if (['BUY', 'ACCUMULATE'].includes(rawAction)) normalizeAction = 'BUY';
            else if (['SELL', 'REDUCE'].includes(rawAction)) normalizeAction = 'SELL';

            // Regex to find Stock Name (Before the ';')
            const stockMatch = title.match(/^(?:Buy|Sell|Accumulate|Hold|Reduce)\s+([^;]+)/i);
            const stock = stockMatch ? stockMatch[1].trim() : "Unknown Stock";

            // Regex to find Target
            const targetMatch = title.match(/target\s+(?:of\s+)?(?:Rs\s+)?([\d,]+)/i);
            const target = targetMatch ? `₹${targetMatch[1]}` : "TBA";

            // Broker (After last colon)
            const brokerParts = title.split(':');
            const broker = brokerParts.length > 1 ? brokerParts[brokerParts.length - 1].trim() : "Market Expert";

            return {
                id: item.guid || Math.random().toString(36),
                stock: stock,
                action: normalizeAction,
                target: target,
                stopLoss: "---", // RSS doesn't usually have SL, keep placeholder
                broker: broker,
                url: item.link || "#",
                timestamp: item.pubDate,
                sentiment: normalizeAction === 'BUY' ? 'bullish' : normalizeAction === 'SELL' ? 'bearish' : 'neutral'
            };

        } catch (e) {
            return null;
        }
    }
}
