import React from 'react';
import { motion } from 'framer-motion';

const PremiumLoader: React.FC<{ message?: string }> = ({ message = 'Fetching market data...' }) => {
    return (
        <div className="fixed inset-0 z-[999] bg-bg-color/80 backdrop-blur-sm flex-center flex-col p-6">
            <div className="relative flex-center">
                {/* Main Pulsing Ring */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-24 h-24 bg-primary/20 rounded-full"
                />

                {/* Rotating Gradient Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary/30 border-b-primary/10 border-l-primary/60 shadow-lg"
                />

                {/* Inner Icon Dot */}
                <motion.div
                    animate={{
                        scale: [0.8, 1.1, 0.8],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/40"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-center"
            >
                <p className="text-sm font-black text-text-primary tracking-tight uppercase">
                    {message}
                </p>
                <div className="mt-3 flex justify-center gap-1.5">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-1.5 h-1.5 bg-primary rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default PremiumLoader;
