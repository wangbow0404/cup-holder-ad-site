import { Home, ClipboardList, Package, Gift, QrCode, Receipt, Settings, User } from 'lucide-react';
import { PartnerData } from '../page';

interface SidebarProps {
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  partnerData: PartnerData;
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'bronze': return 'text-orange-600';
    case 'silver': return 'text-gray-400';
    case 'gold': return 'text-yellow-500';
    case 'platinum': return 'text-purple-500';
    default: return 'text-gray-600';
  }
};

const getTierName = (tier: string) => {
  switch (tier) {
    case 'bronze': return '브론즈';
    case 'silver': return '실버';
    case 'gold': return '골드';
    case 'platinum': return '플래티넘';
    default: return tier;
  }
};

export function Sidebar({ activeMenu, onMenuChange, partnerData }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: Home },
    { id: 'operations', label: '운영 관리', icon: ClipboardList, submenu: [
      { id: 'daily-report', label: '일일 소진 보고' },
      { id: 'inventory', label: '컵홀더 발주' },
    ]},
    { id: 'rewards', label: '리워드 관리', icon: Gift, submenu: [
      { id: 'reward-settings', label: '리워드 설정' },
      { id: 'reward-status', label: '쿠폰/포인트 현황' },
      { id: 'qr-scanner', label: '쿠폰 사용 처리' },
    ]},
    { id: 'settlement', label: '정산', icon: Receipt },
    { id: 'account', label: '계정 설정', icon: Settings, submenu: [
      { id: 'store-settings', label: '매장 정보 수정' },
      { id: 'account-settings', label: '정산 계좌' },
    ]},
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-gray-900 mb-2">{partnerData.storeName}</h1>
        <div className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-100 ${getTierColor(partnerData.tier)}`}>
          <span className="text-sm">{getTierName(partnerData.tier)}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-2">
            {item.submenu ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2 text-gray-700">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onMenuChange(subItem.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeMenu === subItem.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <button
                onClick={() => onMenuChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeMenu === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
