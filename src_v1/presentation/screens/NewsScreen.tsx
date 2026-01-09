import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, Loader2,
    Bookmark, Search,
    User, ArrowUpRight
} from 'lucide-react';
import { useAppStore } from '../../data/store';
import AlertCenter from '../components/AlertCenter';

const NewsScreen: React.FC = () => {
    const { news, fetchNews, isLoading, userName } = useAppStore();
    const [activeTab, setActiveTab] = useState('Trending');

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const sources = [
        { id: 'ET', name: 'ET', color: 'bg-red-50' },
        { id: 'MC', name: 'MC', color: 'bg-blue-50' },
        { id: 'BS', name: 'BS', color: 'bg-orange-50' },
        { id: 'LM', name: 'LM', color: 'bg-teal-50' },
        { id: 'CN', name: 'CN', color: 'bg-indigo-50' },
        { id: 'OTH', name: '+', color: 'bg-gray-50' }
    ];

    const tabs = ['Trending', 'IPO', 'Market', 'Economy', 'Global'];

    if (isLoading && news.length === 0) {
        return (
            <div className="flex-center flex-col h-[80vh] bg-white">
                <Loader2 className="w-8 h-8 text-primary animate-spin opacity-20" />
            </div>
        );
    }

    const featured = news[0];
    const secondary = news.slice(1, 3);
    const feed = news.slice(3);

    return (
        <div className="bg-[#FFFFFF] min-h-screen pb-32 font-sans overflow-x-hidden">

            {/* 1. PREMIUM PERSONALIZED HEADER */}
            <header className="px-6 pt-6 flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex-center overflow-hidden">
                        <User className="text-gray-400" size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Market Watch,</p>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">{userName}</h1>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 rounded-full bg-gray-50 text-gray-500 hover:text-primary transition-colors border border-gray-100/50">
                        <Search size={20} />
                    </button>
                    <AlertCenter />
                </div>
            </header>

            {/* 2. AIRY SOURCE SELECTOR */}
            <section className="px-6 mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Verified Channels</h3>
                </div>
                <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
                    {sources.map(src => (
                        <div key={src.id} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
                            <div className={`w-14 h-14 rounded-full ${src.color} border border-gray-100 flex-center transition-all group-hover:scale-105 active:scale-95 shadow-sm group-hover:shadow-md`}>
                                <span className="text-[14px] font-black text-gray-800 tracking-tighter">{src.name}</span>
                            </div>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{src.id === 'OTH' ? 'More' : src.id}</span>
                        </div>
                    ))}
                </div>
            </section>

            <main className="px-6 space-y-12">
                {/* 3. THE SPOTLIGHT (Single Power Card) */}
                {featured && (
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Today Trending 🔥</h3>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest">View More</button>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 border border-gray-100 group cursor-pointer bg-white"
                            onClick={() => window.open(featured.link, '_blank')}
                        >
                            <div className="aspect-[16/10] overflow-hidden">
                                <img src={featured.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute top-5 right-5 z-20">
                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-colors">
                                        <Bookmark size={20} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">MUST READ</span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{featured.time}</span>
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 leading-[1.2] tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {featured.title}
                                </h2>
                                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{featured.source} Network</span>
                                    <ArrowUpRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* 4. BREAKING NEWS (Horizontal Feed) */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-[50] py-2 -mx-6 px-6">
                        <div className="flex gap-6 overflow-x-auto no-scrollbar">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-gray-900' : 'text-gray-300 hover:text-gray-400'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {secondary.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="space-y-4 group cursor-pointer"
                                onClick={() => window.open(item.link, '_blank')}
                            >
                                <div className="aspect-[4/3] rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                                    <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest mb-1.5">
                                        <span className="text-primary">{item.source}</span>
                                        <span className="text-gray-400">{item.time}</span>
                                    </div>
                                    <h4 className="text-[13px] font-black text-gray-900 leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h4>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 5. LATEST INSIGHTS (Vertical List) */}
                <section className="space-y-6 pb-20">
                    <div className="flex items-center gap-2 px-1">
                        <TrendingUp size={16} className="text-primary" />
                        <h3 className="text-[12px] font-black text-gray-300 uppercase tracking-widest">Latest Insights</h3>
                        <div className="flex-1 h-px bg-gray-50" />
                    </div>
                    <div className="space-y-8">
                        {feed.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex gap-6 items-start group cursor-pointer"
                                onClick={() => window.open(item.link, '_blank')}
                            >
                                <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-gray-50">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                        <span className="text-primary">{item.source}</span>
                                        <span className="text-gray-400">{item.time}</span>
                                    </div>
                                    <h4 className="text-[15px] font-black text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center gap-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                            <Bookmark size={12} /> Save
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </main>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
                .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
                .flex-center { display: flex; align-items: center; justify-content: center; }
            `}</style>
        </div>
    );
};

export default NewsScreen;
