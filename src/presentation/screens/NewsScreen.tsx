import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { NewsService } from '../../services/NewsService';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const CATEGORIES = [
    { id: 'ALL', label: 'All News' },
    { id: 'MAINBOARD', label: 'Mainboard' },
    { id: 'SME', label: 'SME IPOs' },
    { id: 'MARKET', label: 'Market Feed' },
];

export const NewsScreen = () => {
    const [news, setNews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');

    useEffect(() => {
        const loadNews = async () => {
            setIsLoading(true);
            const data = await NewsService.fetchAllNews();
            // Basic hard filters if desired, or just mixed feed
            setNews(data);
            setIsLoading(false);
        };
        loadNews();
    }, []);

    // Filter logic if needed
    // Filter logic
    const filteredNews = activeTab === 'ALL'
        ? news
        : news.filter(item => item.category === activeTab);

    const topStory = filteredNews[0];
    const otherStories = filteredNews.slice(1);

    return (
        <div className="pb-24 bg-[#030305] min-h-screen text-white">
            <div className="flex items-center justify-between mb-6 p-4">
                <h1 className="text-2xl font-black tracking-tighter">Market <span className="text-indigo-400">Buzz</span></h1>
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <Newspaper size={20} />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-6 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id)}
                        className={cn(
                            "px-4 py-2 rounded-full whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all border",
                            activeTab === cat.id
                                ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="px-4 space-y-6">
                {isLoading ? (
                    <div className="space-y-4">
                        <div className="h-64 bg-white/5 rounded-3xl animate-pulse" />
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass-card p-4 rounded-2xl animate-pulse flex gap-4">
                                <div className="w-20 h-20 bg-white/5 rounded-xl flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-white/10 rounded w-3/4" />
                                    <div className="h-3 bg-white/5 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredNews.length > 0 ? (
                    <>
                        {/* Top Spotlight Story */}
                        {activeTab === 'ALL' && topStory && (
                            <motion.a
                                href={topStory.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="block relative h-72 rounded-[2.5rem] overflow-hidden group mb-8 border border-white/10 shadow-2xl"
                            >
                                <img
                                    src={topStory.imageUrl || `https://source.unsplash.com/random/800x600/?business`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt="Top Story"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-3 py-1 bg-indigo-600 text-[9px] font-black rounded-lg uppercase tracking-widest">
                                            News Spotlight
                                        </span>
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] font-black rounded-lg uppercase tracking-widest border border-white/10">
                                            {topStory.source}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-black text-white mb-3 leading-tight group-hover:text-indigo-400 transition-colors">
                                        {topStory.title}
                                    </h2>
                                </div>
                            </motion.a>
                        )}

                        {/* List Stories */}
                        <div className="space-y-4">
                            <AnimatePresence mode='popLayout'>
                                {(activeTab === 'ALL' ? otherStories : filteredNews).map((item, idx) => (
                                    <motion.a
                                        key={item.id}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="glass-card p-4 rounded-2xl flex gap-4 group hover:border-indigo-500/30 transition-all border border-white/5"
                                    >
                                        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
                                            <img
                                                src={item.imageUrl || `https://source.unsplash.com/random/800x600/?business?sig=${idx}`}
                                                alt="News"
                                                className="w-full h-full object-cover transition-transform group-hover:scale-110 opacity-80"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                                        {item.source}
                                                    </span>
                                                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                                                    <div className="flex items-center gap-1 text-[9px] text-gray-500 font-bold">
                                                        <Clock size={10} />
                                                        {(() => {
                                                            try {
                                                                return new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                                            } catch (e) { return 'Just now'; }
                                                        })()}
                                                    </div>
                                                </div>
                                                <h3 className="font-bold text-sm text-white leading-snug group-hover:text-indigo-400 transition-colors line-clamp-3">
                                                    {item.title}
                                                </h3>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center gap-1 text-[9px] font-black text-gray-500 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest border border-white/5">
                                                    <ExternalLink size={10} className="text-indigo-500" />
                                                    READ FULL STORY
                                                </div>
                                                <ChevronRight size={14} className="text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 opacity-50"
                    >
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10 text-gray-500">
                            <Newspaper size={32} />
                        </div>
                        <h3 className="text-white font-bold mb-1">Silence in the Markets</h3>
                        <p className="text-gray-400 text-xs">No {activeTab.toLowerCase()} news found at the moment.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
