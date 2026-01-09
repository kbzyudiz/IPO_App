import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, FileText, ChevronRight, LogOut, X, HelpCircle } from 'lucide-react';
import { useAppStore } from '../../data/store';

export const ProfileScreen = () => {
    const { userName, userEmail, updateProfile } = useAppStore();
    const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);
    const [editProfileModal, setEditProfileModal] = useState(false);
    const [editName, setEditName] = useState(userName);
    const [editEmail, setEditEmail] = useState(userEmail);
    const [editPhone, setEditPhone] = useState('');

    const handleSaveProfile = () => {
        updateProfile(editName, editEmail);
        setEditProfileModal(false);
    };

    const MenuLink = ({ icon: Icon, title, subtitle, onClick }: any) => (
        <button
            onClick={onClick}
            className="w-full glass-card p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-full text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                    <Icon size={20} />
                </div>
                <div className="text-left">
                    <div className="font-semibold text-white text-sm">{title}</div>
                    {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
                </div>
            </div>
            <ChevronRight size={18} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
        </button>
    );

    return (
        <div className="pb-24">
            <h1 className="text-2xl font-outfit font-bold mb-6">My <span className="text-indigo-400">Profile</span></h1>

            {/* Profile Card */}
            <div className="glass-card p-6 rounded-2xl mb-8 flex items-center gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
                    {userName.charAt(0)}
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">{userName}</h2>
                    <p className="text-sm text-gray-400">{userEmail}</p>
                    <div className="mt-2 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded inline-block border border-emerald-500/20">
                        Pro Member
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">General</h3>
                <MenuLink
                    icon={User}
                    title="Edit Profile"
                    subtitle="Name, Email, Phone"
                    onClick={() => setEditProfileModal(true)}
                />
            </div>

            {/* Legal Section */}
            <div className="space-y-3 mb-8">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Legal & Support</h3>
                <MenuLink
                    icon={Shield}
                    title="Privacy Policy"
                    onClick={() => setPolicyModal('privacy')}
                />
                <MenuLink
                    icon={FileText}
                    title="Terms & Conditions"
                    onClick={() => setPolicyModal('terms')}
                />
                <MenuLink
                    icon={HelpCircle}
                    title="Help & Support"
                    onClick={() => window.location.href = 'mailto:support@ipowatch.com'}
                />
            </div>

            <button className="w-full p-4 rounded-xl border border-rose-500/20 text-rose-400 font-medium flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-colors">
                <LogOut size={18} />
                Sign Out
            </button>

            {/* Legal Modals */}
            <AnimatePresence>
                {policyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#1a1a1a] w-full max-w-lg rounded-2xl p-6 border border-white/10 max-h-[80vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-white">
                                    {policyModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                                </h3>
                                <button onClick={() => setPolicyModal(null)} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="prose prose-invert prose-sm text-gray-300">
                                <p>Last updated: Jan 01, 2026</p>
                                <p>
                                    Welcome to IPO Watch. By using our application, you agree to these terms.
                                    This data is provided for informational purposes only. We are not SEBI registered advisors.
                                </p>
                                <p>
                                    <strong>1. Data Accuracy</strong><br />
                                    While we strive for accuracy, IPO GMP and subscription figures are volatile and sourced from grey market estimates.
                                </p>
                                <p>
                                    <strong>2. Investment Advice</strong><br />
                                    We do not provide investment advice. Please consult your financial advisor before investing.
                                </p>
                                <p>
                                    <strong>3. User Data</strong><br />
                                    We respect your privacy. All user data is stored locally on your device where possible.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {editProfileModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setEditProfileModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-card p-6 rounded-3xl max-w-md w-full border border-white/10 relative"
                        >
                            <button
                                onClick={() => setEditProfileModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>

                            <h2 className="text-2xl font-bold mb-6 text-white">Edit Profile</h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-indigo-500/50 focus:outline-none transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-indigo-500/50 focus:outline-none transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                        Phone Number <span className="text-gray-600">(Optional)</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-medium focus:border-indigo-500/50 focus:outline-none transition-all"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setEditProfileModal(false)}
                                        className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
