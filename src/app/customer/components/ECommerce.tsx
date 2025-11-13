import { Package, ShoppingCart, RotateCcw, Star, MessageSquare } from 'lucide-react';
import { useState } from 'react';

type Tab = 'orders' | 'cart' | 'returns' | 'reviews' | 'inquiries';

const mockOrders = [
  { id: 1, product: 'OO 립밤', date: '2025.11.10', status: '배송중', tracking: '1234567890' },
  { id: 2, product: 'XX 스킨케어 세트', date: '2025.11.08', status: '배송완료', tracking: '0987654321' },
];

export function ECommerce() {
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  const tabs = [
    { id: 'orders' as Tab, label: '주문/배송 조회', icon: Package },
    { id: 'cart' as Tab, label: '장바구니', icon: ShoppingCart },
    { id: 'returns' as Tab, label: '반품/환불 관리', icon: RotateCcw },
    { id: 'reviews' as Tab, label: '내가 쓴 리뷰', icon: Star },
    { id: 'inquiries' as Tab, label: '1:1 문의 내역', icon: MessageSquare },
  ];

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8">E-Commerce</h1>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 주문/배송 조회 */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">{order.product}</h3>
                    <p className="text-gray-500">주문일: {order.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      order.status === '배송중'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                {order.status === '배송중' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700 mb-2">송장번호: {order.tracking}</p>
                    <button className="text-blue-600 hover:underline">
                      배송 추적하기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 장바구니 */}
        {activeTab === 'cart' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">장바구니가 비어있습니다</p>
          </div>
        )}

        {/* 반품/환불 관리 */}
        {activeTab === 'returns' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <RotateCcw className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">반품/환불 내역이 없습니다</p>
          </div>
        )}

        {/* 내가 쓴 리뷰 */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">작성한 리뷰가 없습니다</p>
          </div>
        )}

        {/* 1:1 문의 내역 */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">문의 내역이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
