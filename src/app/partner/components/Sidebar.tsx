'use client';

import React from 'react';
import type { PartnerData } from '../page';
import {
  LayoutDashboard,
  ClipboardList,
  PackageOpen,
  Gift,
  BarChart3,
  ScanLine,
  WalletCards,
  Store,
  Settings2,
} from 'lucide-react';

type SidebarProps = {
  activeMenu: string;
  onMenuChange: (key: string) => void;
  partnerData: PartnerData;
  variant?: 'desktop' | 'mobile';
};

const menuItems: {
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
    id: 'daily-report',
    label: '일일 소진 보고',
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    id: 'inventory',
    label: '컵홀더 발주',
    icon: <PackageOpen className="w-4 h-4" />,
  },
  {
    id: 'reward-status',
    label: '리워드 현황',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'reward-settings',
    label: '리워드 설정',
    icon: <Gift className="w-4 h-4" />,
  },
  {
    id: 'qr-scanner',
    label: 'QR 스캐너',
    icon: <ScanLine className="w-4 h-4" />,
  },
  {
    id: 'settlement',
    label: '정산',
    icon: <WalletCards className="w-4 h-4" />,
  },
  {
    id: 'store-settings',
    label: '매장 정보 수정',
    icon: <Store className="w-4 h-4" />,
  },
  {
    id: 'account-settings',
    label: '계정 설정',
    icon: <Settings2 className="w-4 h-4" />,
  },
];

export function Sidebar({
  activeMenu,
  onMenuChange,
  partnerData,
  variant = 'desktop',
}: SidebarProps) {
  const tierLabel =
    partnerData.tier === 'bronze'
      ? '브론즈'
      : partnerData.tier === 'silver'
      ? '실버'
      : partnerData.tier === 'gold'
      ? '골드'
      : '플래티넘';

  const tierClass =
    partnerData.tier === 'gold'
      ? 'bg-amber-50 text-amber-700'
      : partnerData.tier === 'platinum'
      ? 'bg-slate-900 text-slate-50'
      : partnerData.tier === 'silver'
      ? 'bg-slate-50 text-slate-600'
      : 'bg-orange-50 text-orange-600';

  return (
    <nav
      className={`h-full bg-white flex flex-col ${
        variant === 'desktop' ? 'border-r border-gray-100' : ''
      }`}
    >
      {/* 상단 매장 정보 (데스크탑 전용) */}
      {variant === 'desktop' && (
        <div className="px-5 pt-6 pb-4 border-b border-gray-50">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-semibold text-neutral-900">
              {partnerData.storeName}
            </div>
            <span
              className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${tierClass}`}
            >
              {tierLabel}
            </span>
          </div>
        </div>
      )}

      {/* 메뉴 리스트 */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onMenuChange(item.id)}
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

      {/* 하단 프로필/마이 버튼 */}
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
                파트너 마이페이지
              </span>
              <span className="text-[10px] text-gray-500">
                정산·계정 정보를 확인하세요
              </span>
            </div>
          </div>
          <span className="text-[11px] text-gray-400">›</span>
        </button>
      </div>
    </nav>
  );
}
