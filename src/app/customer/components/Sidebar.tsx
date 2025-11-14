'use client';

import React from 'react';
import type { Page } from '../page';
import {
  Home,
  Gift,
  ShoppingCart,
  User,
  HeadphonesIcon,
} from 'lucide-react';

type SidebarProps = {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  variant?: 'desktop' | 'mobile';
};

const navItems: {
  id: Page;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'home',
    label: '홈',
    icon: <Home className="w-4 h-4" />,
  },
  {
    id: 'coupons',
    label: '내 쿠폰·리워드',
    icon: <Gift className="w-4 h-4" />,
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce',
    icon: <ShoppingCart className="w-4 h-4" />,
  },
  {
    id: 'profile',
    label: '회원정보',
    icon: <User className="w-4 h-4" />,
  },
  {
    id: 'customer-service',
    label: '고객센터',
    icon: <HeadphonesIcon className="w-4 h-4" />,
  },
];

export function Sidebar({
  currentPage,
  onNavigate,
  variant = 'desktop',
}: SidebarProps) {
  return (
    <nav
      className={`
        h-full
        bg-white
        flex flex-col
        ${variant === 'desktop' ? 'border-r border-gray-100' : ''}
      `}
    >
      {/* 로고 영역 (데스크탑 전용) */}
      {variant === 'desktop' && (
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              QR
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">
                QR 리워드
              </span>
              <span className="text-xs text-gray-500">
                내 쿠폰·포인트 한눈에
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 네비게이션 */}
      <div className="flex-1 px-4 pb-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 text-sm font-medium rounded-2xl
                px-4 py-3
                transition-all
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.25)]'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span
                className={`
                  flex items-center justify-center rounded-full border
                  w-8 h-8
                  ${
                    isActive
                      ? 'border-blue-200 bg-white text-blue-600'
                      : 'border-gray-200 bg-white text-gray-600'
                  }
                `}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 하단 프로필 버튼 (선택) */}
      <div className="px-4 pb-5 pt-2 border-t border-gray-100">
        <button
          type="button"
          className="w-full flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2 text-xs text-gray-600"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px]">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-[11px]">마이페이지</span>
              <span className="text-[10px] text-gray-500">
                내 정보·참여 내역 보기
              </span>
            </div>
          </div>
          <span className="text-[11px] text-gray-400">›</span>
        </button>
      </div>
    </nav>
  );
}
