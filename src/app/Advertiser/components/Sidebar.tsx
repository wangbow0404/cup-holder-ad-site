'use client';

import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  ListChecks,
  Package,
  Boxes,
  ShoppingBag,
  Store,
  MessageCircle,
  BarChart3,
  Megaphone,
  WalletCards,
  Settings2,
} from 'lucide-react';

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
  variant?: 'desktop' | 'mobile';
};

const navItems: {
  id: string;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: 'campaign-new',
    label: '새 캠페인 만들기',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'campaign-list',
    label: '캠페인 목록',
    icon: <ListChecks className="w-4 h-4" />,
  },
  {
    id: 'products',
    label: '상품 관리',
    icon: <Package className="w-4 h-4" />,
  },
  {
    id: 'inventory',
    label: '재고 관리',
    icon: <Boxes className="w-4 h-4" />,
  },
  {
    id: 'orders',
    label: '주문 관리',
    icon: <ShoppingBag className="w-4 h-4" />,
  },
  {
    id: 'store-settings',
    label: '스토어 설정',
    icon: <Store className="w-4 h-4" />,
  },
  {
    id: 'reviews',
    label: '리뷰 관리',
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    id: 'customer-support',
    label: '문의/고객센터',
    icon: <MessageCircle className="w-4 h-4" />,
  },
  {
    id: 'reports',
    label: '리포트',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'platform-ads',
    label: '플랫폼 광고',
    icon: <Megaphone className="w-4 h-4" />,
  },
  {
    id: 'settlement',
    label: '정산',
    icon: <WalletCards className="w-4 h-4" />,
  },
  {
    id: 'account-settings',
    label: '계정 설정',
    icon: <Settings2 className="w-4 h-4" />,
  },
];

export function Sidebar({
  currentPage,
  onNavigate,
  variant = 'desktop',
}: SidebarProps) {
  return (
    <nav
      className={`h-full bg-white flex flex-col ${
        variant === 'desktop' ? 'border-r border-gray-100' : ''
      }`}
    >
      {/* 상단 로고/타이틀 (데스크탑 전용) */}
      {variant === 'desktop' && (
        <div className="px-5 pt-6 pb-4 border-b border-gray-50">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">WithFom</span>
            <span className="text-sm font-semibold text-neutral-900">
              광고주 센터
            </span>
          </div>
        </div>
      )}

      {/* 메뉴 리스트 */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 text-sm rounded-2xl px-3 py-2.5
                transition-all
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-[0_0_0_1px_rgba(59,130,246,0.18)]'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span
                className={`
                  flex items-center justify-center rounded-xl border w-8 h-8
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

      {/* 하단 계정/프로필 영역 */}
      <div className="px-4 pb-5 pt-3 border-t border-gray-100">
        <button
          type="button"
          className="w-full flex items-center justify-between rounded-2xl bg-gray-50 px-3 py-2 text-xs text-gray-600"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px]">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-[11px]">
                광고주 마이페이지
              </span>
              <span className="text-[10px] text-gray-500">
                계정·정산 정보를 확인하세요
              </span>
            </div>
          </div>
          <span className="text-[11px] text-gray-400">›</span>
        </button>
      </div>
    </nav>
  );
}
