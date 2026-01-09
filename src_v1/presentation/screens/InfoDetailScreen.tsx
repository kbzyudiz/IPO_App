import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

const InfoDetailScreen: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const navigate = useNavigate();

    const getContent = () => {
        switch (type) {
            case 'about':
                return {
                    title: 'About IPO Watch',
                    content: [
                        'IPO Watch is your premium companion for tracking the Indian stock market\'s Initial Public Offerings (IPOs).',
                        'Features include:',
                        '• Real-time GMP (Grey Market Premium) tracking.',
                        '• Detailed analysis of Mainboard and SME IPOs.',
                        '• Live subscription status and expected allotment dates.',
                        '• Profit calculations based on lot sizes.',
                        'Version: 1.1.0'
                    ]
                };
            case 'disclaimer':
                return {
                    title: 'Market Disclaimer',
                    content: [
                        'Grey Market Premium (GMP) values are unofficial, indicative, and subject to volatility. They do not guarantee listing prices.',
                        'All financial information provided in this app is for educational and informational purposes only.',
                        'IPO Watch is not a SEBI-registered investment advisor. We do not provide investment advice or recommendations.',
                        'Investing in the stock market, especially IPOs, involves high risk. Please consult a professional financial advisor before making any investment decisions.',
                        'We are not responsible for any financial losses incurred based on the data provided here.'
                    ]
                };
            case 'terms':
                return {
                    title: 'Terms & Conditions',
                    content: [
                        'By using IPO Watch, you agree to the following terms:',
                        '1. Accuracy of Data: While we strive for accuracy, we cannot guarantee the real-time correctness of scraped data from third-party sources.',
                        '2. Personal Use: This app is intended for personal research and information only.',
                        '3. No Professional Advice: Content within the app does not constitute financial, legal, or professional advice.',
                        '4. Third-Party Links: Redirections to brokers or news sites are beyond our control.',
                        '5. Updates: We reserve the right to modify or terminate technical features at any time.'
                    ]
                };
            default:
                return { title: 'Information', content: ['No information available.'] };
        }
    };

    const { title, content } = getContent();

    return (
        <div className="min-h-screen bg-bg-color pb-24">
            <header className="p-4 flex items-center gap-4 bg-white border-b border-border shadow-sm sticky top-0 z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full glass flex-center text-text-primary active:scale-90 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-lg font-black text-text-primary tracking-tight">{title}</h1>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6"
            >
                <div className="bg-white rounded-[2rem] p-8 border border-border shadow-md">
                    <div className="space-y-6">
                        {content.map((paragraph, index) => (
                            <p key={index} className="text-sm text-text-secondary leading-relaxed font-medium">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                <div className="mt-8 p-6 bg-surface-lighter rounded-2xl border border-dashed border-border text-center opacity-60">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-text-muted">
                        Last Updated: December 25, 2025
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default InfoDetailScreen;
