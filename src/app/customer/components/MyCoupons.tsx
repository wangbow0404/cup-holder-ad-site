import { Gift, Store, Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const mockAdvertiserRewards = [
  { id: 1, name: 'OO 립밤', brand: '올리브영', expiry: '2025.12.31', limit: 'E-Com 결제 시 사용' },
  { id: 2, name: 'XX 포인트', amount: '500P', brand: '스타벅스', expiry: '2025.11.30', limit: '1회 사용' },
];

const mockPartnerRewards = [
  { id: 3, name: 'XX카페 사이즈업', brand: 'XX카페', expiry: '2025.12.15', limit: '매장 방문 시 사용' },
  { id: 4, name: 'YY카페 1000P', brand: 'YY카페', expiry: '2025.11.20', limit: '매장 방문 시 사용' },
];

export function MyCoupons() {
  const [showQR, setShowQR] = useState<number | null>(null);

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8">내 쿠폰·리워드</h1>

        {/* 광고주 리워드 섹션 */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-6 h-6 text-blue-600" />
            <h2>광고주 리워드</h2>
          </div>
          <div className="space-y-4">
            {mockAdvertiserRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">{reward.name}</h3>
                    <p className="text-gray-600">{reward.brand}</p>
                    {reward.amount && (
                      <p className="text-blue-600 mt-1">{reward.amount}</p>
                    )}
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    사용하기
                  </button>
                </div>
                <div className="flex gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>유효기간: {reward.expiry}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{reward.limit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 파트너 리워드 섹션 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-6 h-6 text-green-600" />
            <h2>파트너 리워드 (매장 쿠폰)</h2>
          </div>
          <div className="space-y-4">
            {mockPartnerRewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">{reward.name}</h3>
                    <p className="text-gray-600">{reward.brand}</p>
                  </div>
                  <button
                    onClick={() => setShowQR(showQR === reward.id ? null : reward.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    {showQR === reward.id ? 'QR 닫기' : '사용하기'}
                  </button>
                </div>
                {showQR === reward.id && (
                  <div className="mt-4 p-6 bg-gray-50 rounded-lg flex flex-col items-center">
                    <p className="text-gray-600 mb-4">파트너가 스캔할 QR 코드</p>
                    <div className="w-48 h-48 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-green-600 rounded" />
                      </div>
                    </div>
                    <p className="text-gray-500 mt-4">유효시간: 5분</p>
                  </div>
                )}
                <div className="flex gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>유효기간: {reward.expiry}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{reward.limit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
