

export const PlaceholderScreen = ({ title }: { title: string }) => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
            <span className="text-3xl">🚧</span>
        </div>
        <h2 className="text-2xl font-outfit font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 max-w-sm">
            This module is currently being upgraded for the V2 experience. Check back soon!
        </p>
    </div>
);
