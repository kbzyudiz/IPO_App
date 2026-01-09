import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './data/store';

// Components
import BottomNav from './presentation/components/BottomNav';

// Screens
import HomeScreen from './presentation/screens/HomeScreen';
import ListingScreen from './presentation/screens/ListingScreen';
import DetailScreen from './presentation/screens/DetailScreen';
import AnalyticsScreen from './presentation/screens/AnalyticsScreen';
import AllotmentScreen from './presentation/screens/AllotmentScreen';
import ProfitCalculator from './presentation/screens/ProfitCalculator';
import NewsScreen from './presentation/screens/NewsScreen';
import ProfileScreen from './presentation/screens/ProfileScreen';
import AdminScreen from './presentation/screens/AdminScreen';
import InfoDetailScreen from './presentation/screens/InfoDetailScreen';

const App: React.FC = () => {
  const { fetchData, syncMarketData, fetchNews } = useAppStore();

  useEffect(() => {
    const initializeApp = async () => {
      await fetchData();
      syncMarketData();
      fetchNews();
    };

    initializeApp();

    const interval = setInterval(() => {
      syncMarketData();
      fetchNews();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchData, syncMarketData, fetchNews]);

  return (
    <BrowserRouter>
      <div className="flex-1 w-full overflow-y-auto no-scrollbar">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/list" element={<ListingScreen />} />
          <Route path="/ipo/:id" element={<DetailScreen />} />
          <Route path="/analytics" element={<AnalyticsScreen />} />
          <Route path="/allotment" element={<AllotmentScreen />} />
          <Route path="/calc/:id" element={<ProfitCalculator />} />
          <Route path="/news" element={<NewsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/info/:type" element={<InfoDetailScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <BottomNav />
    </BrowserRouter>
  );
};

export default App;
