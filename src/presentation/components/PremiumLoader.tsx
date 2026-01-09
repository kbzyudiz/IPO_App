import { motion } from 'framer-motion';

interface PremiumLoaderProps {
    message?: string;
}

const PremiumLoader = ({ message = 'Loading...' }: PremiumLoaderProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-16 h-16 mx-auto mb-6 border-4 border-indigo-600 border-t-transparent rounded-full"
                />
                <p className="text-gray-400 text-sm font-medium">{message}</p>
            </div>
        </div>
    );
};

export default PremiumLoader;
