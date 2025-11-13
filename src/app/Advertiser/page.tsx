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

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'campaign-new':
        return <CampaignWizard onComplete={() => setCurrentPage('campaign-list')} />;
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
