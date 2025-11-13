import { Home, Gift, ShoppingCart, User, HeadphonesIcon, QrCode } from 'lucide-react';

type Page = 'home' | 'coupons' | 'ecommerce' | 'profile' | 'customer-service' | 'qr-scan';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'home' as Page, label: '홈', icon: Home },
    { id: 'coupons' as Page, label: '내 쿠폰·리워드', icon: Gift },
    { id: 'ecommerce' as Page, label: 'E-Commerce', icon: ShoppingCart },
    { id: 'profile' as Page, label: '회원정보', icon: User },
    { id: 'customer-service' as Page, label: '고객센터', icon: HeadphonesIcon },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <QrCode className="w-8 h-8 text-blue-600" />
          <h2>QR 리워드</h2>
        </div>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
