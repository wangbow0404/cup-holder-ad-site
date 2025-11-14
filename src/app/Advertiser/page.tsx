'use client';

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CampaignWizard } from './components/CampaignWizard';
import { CampaignList } from './components/CampaignList';
import { ProductManagement } from './components/ProductManagement';
import { InventoryManagement } from './components/InventoryManagement';
import { OrderManagement } from './components/OrderManagement';
import { StoreSettings } from './components/StoreSettings';
import { ReviewManagement } from './components/ReviewManagement';
import { CustomerSupport } from './components/CustomerSupport';
import { Reports } from './components/Reports';
import { PlatformAds } from './components/PlatformAds';
import { Settlement } from './components/Settlement';
import { AccountSettings } from './components/AccountSettings';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 모바일 햄버거

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'campaign-new':
        return (
          <CampaignWizard onComplete={() => setCurrentPage('campaign-list')} />
        );
      case 'campaign-list':
        return <CampaignList />;
      case 'products':
        return <ProductManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'store-settings':
        return <StoreSettings />;
      case 'reviews':
        return <ReviewManagement />;
      case 'customer-support':
        return <CustomerSupport />;
      case 'reports':
        return <Reports />;
      case 'platform-ads':
        return <PlatformAds />;
      case 'settlement':
        return <Settlement />;
      case 'account-settings':
        return <AccountSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main className="min-h-dvh bg-gray-50 flex">
      {/* 데스크탑 사이드바 */}
      <aside className="hidden md:block md:w-64 md:flex-shrink-0">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      </aside>

      {/* 모바일 상단 헤더 */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 md:hidden">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">광고주 센터</span>
          <span className="text-sm font-semibold text-neutral-900">
            캠페인 대시보드
          </span>
        </div>

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
      </header>

      {/* 콘텐츠 영역 */}
      <section className="flex-1 w-full pt-[64px] md:pt-6 pb-6 px-4 md:px-8 overflow-y-auto">
        {renderPage()}
      </section>

      {/* 모바일 오프캔버스 사이드바 */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* 딤 배경 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* 사이드바 패널 */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl rounded-tr-3xl rounded-br-3xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">광고주 센터</span>
                <span className="text-sm font-semibold text-neutral-900">
                  캠페인 메뉴
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
              currentPage={currentPage}
              onNavigate={(page) => {
                setCurrentPage(page);
                setIsSidebarOpen(false);
              }}
              variant="mobile"
            />
          </div>
        </div>
      )}
    </main>
  );
}
