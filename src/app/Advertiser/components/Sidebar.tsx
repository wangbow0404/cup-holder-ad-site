import { LayoutDashboard, Megaphone, ShoppingBag, Store, FileText, TrendingUp, Wallet, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: '홈 대시보드', icon: LayoutDashboard },
    {
      id: 'campaign',
      label: '캠페인',
      icon: Megaphone,
      subItems: [
        { id: 'campaign-new', label: '새 캠페인 생성' },
        { id: 'campaign-list', label: '캠페인 목록' },
      ],
    },
    {
      id: 'ecommerce',
      label: 'E-Commerce',
      icon: ShoppingBag,
      subItems: [
        { id: 'products', label: '상품 관리' },
        { id: 'inventory', label: '재고 관리' },
        { id: 'orders', label: '주문/배송 관리' },
      ],
    },
    {
      id: 'store',
      label: '스토어 관리',
      icon: Store,
      subItems: [
        { id: 'store-settings', label: '미니 홈피 설정' },
        { id: 'reviews', label: '리뷰 관리' },
        { id: 'customer-support', label: '고객 문의(CS)' },
      ],
    },
    { id: 'reports', label: '리포트', icon: FileText },
    { id: 'platform-ads', label: '플랫폼 광고', icon: TrendingUp },
    { id: 'settlement', label: '정산', icon: Wallet },
    { id: 'account-settings', label: '계정 설정', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-gray-900">광고주 플랫폼</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.subItems ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 text-gray-700">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                <div className="ml-7 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Button
                      key={subItem.id}
                      variant={currentPage === subItem.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => onNavigate(subItem.id)}
                    >
                      {subItem.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <Button
                variant={currentPage === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-2"
                onClick={() => onNavigate(item.id)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
