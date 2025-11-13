'use client';

import React, { useState } from 'react';
import { ConsumerHome } from './components/ConsumerHome';
import { MyCoupons } from './components/MyCoupons';
import { ECommerce } from './components/ECommerce';
import { Profile } from './components/Profile';
import { CustomerService } from './components/CustomerService';
import { QRScanFlow } from './components/QRScanFlow';
import { Sidebar } from './components/Sidebar';

type Page =
  | 'home'
  | 'coupons'
  | 'ecommerce'
  | 'profile'
  | 'customer-service'
  | 'qr-scan';

export default function ConsumerPage() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleQRScan = () => {
    setCurrentPage('qr-scan');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  if (!isLoggedIn && currentPage === 'qr-scan') {
    return <QRScanFlow onLogin={handleLogin} />;
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-dvh bg-gray-50 flex items-center justify-center p-4">
        <section className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="mb-6 text-xl font-semibold text-neutral-900">
            소비자 로그인
          </h1>
          <button
            onClick={handleLogin}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-lg mb-4 font-medium"
          >
            카카오톡으로 시작하기
          </button>
          <button
            onClick={handleQRScan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            QR 코드 스캔하기
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <section className="flex-1 ml-64">
        {currentPage === 'home' && <ConsumerHome onQRScan={handleQRScan} />}
        {currentPage === 'coupons' && <MyCoupons />}
        {currentPage === 'ecommerce' && <ECommerce />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'customer-service' && <CustomerService />}
      </section>
    </main>
  );
}
