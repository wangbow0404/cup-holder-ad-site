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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 모바일 햄버거
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
        return (
          <Dashboard
            partnerData={partnerData}
            onNavigate={setActiveMenu}
          />
        );
      case 'daily-report':
        return (
          <DailyReport
            partnerData={partnerData}
            setPartnerData={setPartnerData}
          />
        );
      case 'inventory':
        return (
          <InventoryOrder
            partnerData={partnerData}
            setPartnerData={setPartnerData}
          />
        );
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
        return (
          <Dashboard
            partnerData={partnerData}
            onNavigate={setActiveMenu}
          />
        );
    }
  };

  return (
    <main className="min-h-dvh bg-gray-50 flex">
      {/* 데스크탑 사이드바 */}
      <aside className="hidden md:block md:w-64 md:flex-shrink-0">
        <Sidebar
          activeMenu={activeMenu}
          onMenuChange={setActiveMenu}
          partnerData={partnerData}
        />
      </aside>

      {/* 모바일 상단바 */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 md:hidden">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">파트너 센터</span>
          <span className="text-sm font-semibold text-neutral-900">
            {partnerData.storeName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`
              inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium
              ${
                partnerData.tier === 'gold'
                  ? 'bg-amber-50 text-amber-700'
                  : partnerData.tier === 'platinum'
                  ? 'bg-slate-900 text-slate-50'
                  : partnerData.tier === 'silver'
                  ? 'bg-slate-50 text-slate-600'
                  : 'bg-orange-50 text-orange-600'
              }
            `}
          >
            {partnerData.tier === 'bronze' && '브론즈'}
            {partnerData.tier === 'silver' && '실버'}
            {partnerData.tier === 'gold' && '골드'}
            {partnerData.tier === 'platinum' && '플래티넘'}
          </span>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-gray-200 w-9 h-9"
            aria-label="메뉴 열기"
          >
            <span className="sr-only">메뉴 열기</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-gray-800 rounded-full" />
              <span className="block h-0.5 w-5 bg-gray-800 rounded-full" />
              <span className="block h-0.5 w-5 bg-gray-800 rounded-full" />
            </div>
          </button>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <section className="flex-1 w-full pt-[64px] md:pt-6 pb-6 px-4 md:px-8 overflow-y-auto">
        {renderContent()}
      </section>

      {/* 모바일 오프캔버스 사이드바 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Dimmed 배경 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* 사이드바 패널 */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl rounded-tr-3xl rounded-br-3xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">파트너 센터</span>
                <span className="text-sm font-semibold text-neutral-900">
                  {partnerData.storeName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="inline-flex items-center justify-center rounded-full border border-gray-200 w-8 h-8"
                aria-label="메뉴 닫기"
              >
                <span className="sr-only">메뉴 닫기</span>
                <span className="block h-0.5 w-4 rotate-45 bg-gray-800 -translate-y-[1px]" />
                <span className="block h-0.5 w-4 -rotate-45 bg-gray-800 translate-y-[1px]" />
              </button>
            </div>

            <Sidebar
              activeMenu={activeMenu}
              onMenuChange={(key) => {
                setActiveMenu(key);
                setIsSidebarOpen(false);
              }}
              partnerData={partnerData}
              variant="mobile"
            />
          </div>
        </div>
      )}
    </main>
  );
}
