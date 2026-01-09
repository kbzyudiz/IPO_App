import { motion } from 'framer-motion';

export const SplashScreen = () => {
    return (
        <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center z-[100]">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative"
            >
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mb-6">
                    <span className="text-4xl font-bold text-white font-outfit">IV</span>
                </div>
                <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl -z-10 rounded-full animate-pulse" />
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-outfit font-bold text-white mb-2"
            >
                IPO <span className="text-indigo-400">Vibe</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-sm tracking-widest uppercase"
            >
                Market Intelligence
            </motion.p>
        </div>
    );
};
