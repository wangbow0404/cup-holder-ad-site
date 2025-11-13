import { User, MapPin, Plus, Check } from 'lucide-react';
import { useState } from 'react';

type Tab = 'info' | 'address';

const mockAddresses = [
  { id: 1, name: '집', address: '서울시 강남구 테헤란로 123', isDefault: true },
  { id: 2, name: '회사', address: '서울시 서초구 서초대로 456', isDefault: false },
];

export function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('info');

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="mb-8">회원정보</h1>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span>회원정보 수정</span>
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'address'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin className="w-5 h-5" />
            <span>배송지 관리</span>
          </button>
        </div>

        {/* 회원정보 수정 */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">이름</label>
                <input
                  type="text"
                  defaultValue="홍길동"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  defaultValue="hong@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">전화번호</label>
                <input
                  type="tel"
                  defaultValue="010-1234-5678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                  저장하기
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 배송지 관리 */}
        {activeTab === 'address' && (
          <div className="space-y-4">
            {mockAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-gray-900">{addr.name}</h3>
                    {addr.isDefault && (
                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        기본 배송지
                      </span>
                    )}
                  </div>
                  <button className="text-blue-600 hover:underline">수정</button>
                </div>
                <p className="text-gray-600">{addr.address}</p>
              </div>
            ))}
            <button className="w-full bg-white rounded-lg p-6 shadow-sm border border-dashed border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600">
              <Plus className="w-5 h-5" />
              새 배송지 추가
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
