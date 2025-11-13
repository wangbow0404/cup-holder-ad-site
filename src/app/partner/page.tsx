'use client';

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DailyReport } from './components/DailyReport';
import { InventoryOrder } from './components/InventoryOrder';
import { RewardSettings } from './components/RewardSettings';
import { RewardStatus } from './components/RewardStatus';
import { QRScanner } from './components/QRScanner';
import { Settlement } from './components/Settlement';
import { StoreSettings } from './components/StoreSettings';
import { AccountSettings } from './components/AccountSettings';

export type PartnerTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface PartnerData {
  tier: PartnerTier;
  storeName: string;
  dailyReportCompleted: boolean;
  inventoryLevel: number;
  todayCouponsIssued: number;
  todayCouponsUsed: number;
  todayPointsIssued: number;
}

export default function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [partnerData, setPartnerData] = useState<PartnerData>({
    tier: 'silver',
    storeName: '스타벅스 강남점',
    dailyReportCompleted: false,
    inventoryLevel: 35,
    todayCouponsIssued: 12,
    todayCouponsUsed: 8,
    todayPointsIssued: 1500,
  });

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard partnerData={partnerData} onNavigate={setActiveMenu} />;
      case 'daily-report':
        return <DailyReport partnerData={partnerData} setPartnerData={setPartnerData} />;
      case 'inventory':
        return <InventoryOrder partnerData={partnerData} setPartnerData={setPartnerData} />;
      case 'reward-settings':
        return <RewardSettings />;
      case 'reward-status':
        return <RewardStatus />;
      case 'qr-scanner':
        return <QRScanner />;
      case 'settlement':
        return <Settlement partnerData={partnerData} />;
      case 'store-settings':
        return <StoreSettings />;
      case 'account-settings':
        return <AccountSettings partnerData={partnerData} />;
      default:
        return <Dashboard partnerData={partnerData} onNavigate={setActiveMenu} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeMenu={activeMenu} 
        onMenuChange={setActiveMenu}
        partnerData={partnerData}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
