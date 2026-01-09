import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Edit2, Trash2, RefreshCw, X,
    ArrowLeft, LayoutDashboard, Database, TrendingUp,
    Globe, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../data/store';
import type { IPO, IPOStatus } from '../../core/types';

const AdminScreen: React.FC = () => {
    const navigate = useNavigate();
    const { ipos, addIPO, updateIPO, deleteIPO, syncMarketData, isLoading, metrics } = useAppStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingIpo, setEditingIpo] = useState<Partial<IPO> | null>(null);

    const filteredIpos = ipos.filter(ipo =>
        ipo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ipo.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (ipo: IPO) => {
        setEditingIpo(ipo);
        setIsEditorOpen(true);
    };

    const handleAdd = () => {
        setEditingIpo({
            id: Math.random().toString(36).substr(2, 9),
            name: '',
            symbol: '',
            status: 'upcoming',
            type: 'Mainboard',
            sector: '',
            priceRange: '',
            minQty: 0,
            minAmount: 0,
            issueSize: '',
            marketCap: '',
            startDate: '',
            endDate: '',
            listingDate: '',
            logo: '',
            gmp: 0,
            subscription: { retail: 0, qib: 0, nii: 0, total: 0 },
            about: '',
            strengths: [],
            risks: [],
            schedule: [],
            applyUrl: 'https://zerodha.com/ipo'
        });
        setIsEditorOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingIpo) return;

        if (editingIpo.id && ipos.find(i => i.id === editingIpo.id)) {
            updateIPO(editingIpo as IPO);
        } else {
            addIPO(editingIpo as IPO);
        }
        setIsEditorOpen(false);
        setEditingIpo(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this IPO?')) {
            deleteIPO(id);
        }
    };

    return (
        <div className="min-h-screen bg-bg-color pb-24">
            {/* Header */}
            <header className="sticky top-0 z-30 glass border-b border-border shadow-sm p-4 px-6 flex-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-secondary hover:text-text-primary">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-text-primary leading-tight">Admin Console</h1>
                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Management Panel</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => syncMarketData()}
                        disabled={isLoading}
                        className="p-2.5 rounded-xl border border-border bg-surface-card text-text-secondary hover:text-primary disabled:opacity-50"
                    >
                        <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        <span className="text-sm font-black uppercase tracking-wider hidden sm:inline">Add IPO</span>
                    </button>
                </div>
            </header>

            <div className="p-6 max-w-5xl mx-auto flex flex-col gap-8">
                {/* API Configuration & Stats Overview */}
                <section className="space-y-6">
                    <div className="bg-surface-card border border-border rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                            <Globe size={120} className="text-primary" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex-between mb-6">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                                        <RefreshCw size={14} className="text-primary" />
                                        Data Engine Config
                                    </h3>
                                    <p className="text-[10px] text-text-muted font-bold mt-1">Connect to ipoalerts.in for real-time schedules</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full border flex items-center gap-2 ${localStorage.getItem('IPO_API_KEY') ? 'bg-success/5 border-success/20 text-success' : 'bg-warning/5 border-warning/20 text-warning'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${localStorage.getItem('IPO_API_KEY') ? 'bg-success' : 'bg-warning'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {localStorage.getItem('IPO_API_KEY') ? 'Connected' : 'Offline Mode'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                                    <input
                                        type="password"
                                        placeholder="Enter ipoalerts.in API Key..."
                                        defaultValue={localStorage.getItem('IPO_API_KEY') || ''}
                                        onBlur={(e) => {
                                            if (e.target.value) {
                                                localStorage.setItem('IPO_API_KEY', e.target.value);
                                                window.location.reload();
                                            }
                                        }}
                                        className="w-full pl-12 pr-4 py-3.5 bg-surface-lighter border border-border rounded-2xl outline-none focus:border-primary text-sm font-bold transition-all"
                                    />
                                </div>
                                <button
                                    onClick={() => window.open('https://ipoalerts.in/signup', '_blank')}
                                    className="px-6 py-3.5 bg-surface-lighter border border-border rounded-2xl text-text-primary text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all shadow-sm active:scale-95"
                                >
                                    Get Free Key
                                    <ExternalLink size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <AdminStatCard label="Total IPOs" value={metrics.totalIpos} icon={<Database size={16} />} color="text-primary" />
                        <AdminStatCard label="Live Now" value={metrics.openCount} icon={<Globe size={16} />} color="text-success" />
                        <AdminStatCard label="Upcoming" value={metrics.upcomingCount} icon={<TrendingUp size={16} />} color="text-warning" />
                        <AdminStatCard label="Avg Sub" value={`${metrics.avgSubscription}x`} icon={<LayoutDashboard size={16} />} color="text-error" />
                    </div>
                </section>

                {/* Main Table Container */}
                <section className="bg-surface-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-border flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-muted">IPO Inventory</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                            <input
                                type="text"
                                placeholder="Filter by name or symbol..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-surface-lighter rounded-xl border border-border text-sm text-text-primary focus:border-primary outline-none transition-all w-full sm:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-surface-lighter/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Company</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">Price</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted">GMP</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredIpos.map((ipo) => (
                                    <tr key={ipo.id} className="hover:bg-surface-lighter/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white p-1 border border-border shadow-sm flex-center">
                                                    <img src={ipo.logo} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-primary">{ipo.name}</p>
                                                    <p className="text-[10px] text-text-muted uppercase font-black tracking-tighter">{ipo.symbol} • {ipo.type}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${ipo.status === 'open' ? 'bg-success/10 text-success' :
                                                ipo.status === 'upcoming' ? 'bg-warning/10 text-warning' : 'bg-text-muted/10 text-text-muted'
                                                }`}>
                                                {ipo.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-text-secondary">₹{ipo.priceRange}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-black ${(ipo.gmp || 0) > 0 ? 'text-success' : 'text-text-muted'}`}>
                                                {(ipo.gmp || 0) > 0 ? `+₹${ipo.gmp}` : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(ipo)} className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(ipo.id)} className="p-2 text-text-muted hover:text-error hover:bg-error/5 rounded-lg transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                                <button onClick={() => window.open(`/ipo/${ipo.id}`, '_blank')} className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-lighter rounded-lg transition-all">
                                                    <ExternalLink size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Editor Modal */}
            <AnimatePresence>
                {isEditorOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-bg-color w-full max-w-2xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-border flex-between bg-surface-card">
                                <div>
                                    <h2 className="text-xl font-black text-text-primary">
                                        {editingIpo?.name ? 'Edit IPO' : 'New IPO Listing'}
                                    </h2>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Store Entry Configuration</p>
                                </div>
                                <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-surface-lighter rounded-full transition-colors text-text-muted">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-bg-color">
                                <form id="ipoForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted px-1">Company Name</label>
                                        <input
                                            required
                                            value={editingIpo?.name}
                                            onChange={(e) => setEditingIpo({ ...editingIpo, name: e.target.value })}
                                            className="bg-surface-lighter border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-bold"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted px-1">Symbol (e.g. RELIANCE)</label>
                                        <input
                                            required
                                            value={editingIpo?.symbol}
                                            onChange={(e) => setEditingIpo({ ...editingIpo, symbol: e.target.value })}
                                            className="bg-surface-lighter border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-bold uppercase"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted px-1">Category</label>
                                        <select
                                            value={editingIpo?.type}
                                            onChange={(e) => setEditingIpo({ ...editingIpo, type: e.target.value as 'Mainboard' | 'SME' })}
                                            className="bg-surface-lighter border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-bold"
                                        >
                                            <option value="Mainboard">Mainboard</option>
                                            <option value="SME">SME</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted px-1">Status</label>
                                        <select
                                            value={editingIpo?.status}
                                            onChange={(e) => setEditingIpo({ ...editingIpo, status: e.target.value as IPOStatus })}
                                            className="bg-surface-lighter border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-bold"
                                        >
                                            <option value="open">Open (Live)</option>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="closed">Closed</option>
                                            <option value="announced">Announced</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted px-1">Price Range</label>
                                        <input
                                            placeholder="e.g. 90-95"
                                            value={editingIpo?.priceRange}
                                            onChange={(e) => setEditingIpo({ ...editingIpo, priceRange: e.target.value })}
                                            className="bg-surface-lighter border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-bold"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted px-1">CMP / GMP Point</label>
                                        <input
                                            type="number"
                                            value={editingIpo?.gmp}
                                            onChange={(e) => setEditingIpo({ ...editingIpo, gmp: parseInt(e.target.value) })}
                                            className="bg-surface-lighter border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-bold"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted px-1">Logo URL</label>
                                        <input
                                            value={editingIpo?.logo}
                                            onChange={(e) => setEditingIpo({ ...editingIpo, logo: e.target.value })}
                                            className="bg-surface-lighter border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 col-span-1 md:col-span-2">
                                        <label className="text-[10px] font-black uppercase text-text-muted px-1">About Company</label>
                                        <textarea
                                            rows={3}
                                            value={editingIpo?.about}
                                            onChange={(e) => setEditingIpo({ ...editingIpo, about: e.target.value })}
                                            className="bg-surface-lighter border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary text-sm font-medium"
                                        />
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-border bg-surface-card flex gap-3">
                                <button
                                    onClick={() => setIsEditorOpen(false)}
                                    className="flex-1 py-3 border border-border rounded-2xl text-text-secondary font-black uppercase tracking-widest text-xs hover:bg-surface-lighter"
                                >
                                    Cancel
                                </button>
                                <button
                                    form="ipoForm"
                                    type="submit"
                                    className="flex-1 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const AdminStatCard = ({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) => (
    <div className="bg-surface-card border border-border rounded-3xl p-5 shadow-sm">
        <div className={`p-2.5 rounded-xl bg-surface-lighter ${color} w-fit mb-4`}>
            {icon}
        </div>
        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-text-primary italic tracking-tight">{value}</p>
    </div>
);

export default AdminScreen;
