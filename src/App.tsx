import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { AppLayout } from './presentation/layout/AppLayout';
import { ProfileScreen } from './presentation/screens/ProfileScreen';
import DiscoveryScreen from './presentation/screens/DiscoveryScreen';
import { AlertsScreen } from './presentation/screens/AlertsScreen';
import { NewsScreen } from './presentation/screens/NewsScreen';
import DetailScreen from './presentation/screens/DetailScreen';
import { TradingCallsScreen } from './presentation/screens/TradingCallsScreen';
import AllotmentScreen from './presentation/screens/AllotmentScreen';
import { SplashScreen } from './presentation/components/SplashScreen';
import { useAppStore } from './data/store';
import { AutomationService } from './services/AutomationService';

const BackButtonHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleBack = async () => {
            const currentPath = location.pathname;
            if (currentPath === '/') {
                const confirmExit = window.confirm("Do you want to exit the app?");
                if (confirmExit) {
                    CapacitorApp.exitApp();
                }
            } else {
                navigate(-1);
            }
        };

        const listener = CapacitorApp.addListener('backButton', handleBack);
        return () => { listener.then(h => h.remove()); };
    }, [navigate, location]);

    return null;
};

function App() {
    const { isDarkMode, syncMarketData, fetchData } = useAppStore();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const initApp = async () => {
            try {
                const { userName, updateProfile } = useAppStore.getState();
                if (userName !== 'Rahul Sharma') {
                    updateProfile('Rahul Sharma', 'rahul.sharma@email.com');
                }
                await fetchData();
                await syncMarketData();
                AutomationService.syncAllotmentStatuses();
            } catch (err) {
                console.error("Initialization error:", err);
            } finally {
                setTimeout(() => setShowSplash(false), 2000);
            }
        };
        initApp();
    }, [fetchData, syncMarketData]);

    if (showSplash) {
        return <SplashScreen />;
    }

    return (
        <BrowserRouter>
            <BackButtonHandler />
            <div className={isDarkMode ? 'dark' : ''}>
                <Routes>
                    <Route path="/" element={<AppLayout />}>
                        <Route index element={<DiscoveryScreen />} />
                        <Route path="ipo/:id" element={<DetailScreen />} />
                        <Route path="discovery" element={<DiscoveryScreen />} />
                        <Route path="calls" element={<TradingCallsScreen />} />
                        <Route path="allotment" element={<AllotmentScreen />} />
                        <Route path="alerts" element={<AlertsScreen />} />
                        <Route path="news" element={<NewsScreen />} />
                        <Route path="profile" element={<ProfileScreen />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
