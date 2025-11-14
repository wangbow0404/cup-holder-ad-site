'use client';

import React, { useState } from 'react';
import { ConsumerHome } from './components/ConsumerHome';
import { MyCoupons } from './components/MyCoupons';
import { ECommerce } from './components/ECommerce';
import { Profile } from './components/Profile';
import { CustomerService } from './components/CustomerService';
import { QRScanFlow } from './components/QRScanFlow';
import { Sidebar } from './components/Sidebar';

export type Page =
  | 'home'
  | 'coupons'
  | 'ecommerce'
  | 'profile'
  | 'customer-service'
  | 'qr-scan';

export default function ConsumerPage() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 모바일 햄버거 상태

  const handleQRScan = () => {
    setCurrentPage('qr-scan');
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  // 로그인 안 되어 있고 QR 스캔 플로우로 진입한 경우
  if (!isLoggedIn && currentPage === 'qr-scan') {
    return <QRScanFlow onLogin={handleLogin} />;
  }

  // 기본 로그인 화면
  if (!isLoggedIn) {
    return (
      <main className="min-h-dvh bg-gray-50 flex items-center justify-center p-4">
        <section className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <h1 className="mb-6 text-xl font-semibold text-neutral-900">
            소비자 로그인
          </h1>
          <button
            onClick={handleLogin}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-xl mb-4 font-medium transition-colors"
          >
            카카오톡으로 시작하기
          </button>
          <button
            onClick={handleQRScan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
          >
            QR 코드 스캔하기
          </button>
        </section>
      </main>
    );
  }

  // 로그인 이후 레이아웃
  return (
    <main className="min-h-dvh bg-gray-50 flex">
      {/* 데스크탑 사이드바 */}
      <aside className="hidden md:block md:w-64 md:flex-shrink-0">
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
        />
      </aside>

      {/* 모바일 상단바 */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between bg-white border-b border-gray-100 px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            QR
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-neutral-900">
              QR 리워드
            </span>
            <span className="text-[11px] text-gray-500">
              내 쿠폰·포인트 한눈에
            </span>
          </div>
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
      <section
        className={`
          flex-1 w-full
          pt-[64px] md:pt-6
          px-4 md:px-8
          pb-6
          md:ml-0
        `}
      >
        {currentPage === 'home' && <ConsumerHome onQRScan={handleQRScan} />}
        {currentPage === 'coupons' && <MyCoupons />}
        {currentPage === 'ecommerce' && <ECommerce />}
        {currentPage === 'profile' && <Profile />}
        {currentPage === 'customer-service' && <CustomerService />}
        {/* qr-scan은 로그인 후에는 ConsumerHome 등에서 따로 라우팅할 수 있으면 여기에 조건 추가 */}
      </section>

      {/* 모바일 햄버거 사이드바 (오프캔버스) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Dimmed 배경 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* 실제 사이드바 패널 */}
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl rounded-tr-3xl rounded-br-3xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  QR
                </div>
                <span className="text-sm font-semibold text-neutral-900">
                  QR 리워드
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
