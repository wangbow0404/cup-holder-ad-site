import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Ticket, Coins } from 'lucide-react';

interface CouponStats {
  name: string;
  totalIssued: number;
  used: number;
  expired: number;
  available: number;
}

export function RewardStatus() {
  const coupons: CouponStats[] = [
    {
      name: '무료 사이즈업',
      totalIssued: 1250,
      used: 480,
      expired: 120,
      available: 650,
    },
    {
      name: '무료 음료',
      totalIssued: 500,
      used: 220,
      expired: 30,
      available: 250,
    },
  ];

  const pointStats = {
    totalIssued: 125000,
    totalUsed: 48000,
    available: 77000,
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">쿠폰/포인트 현황</h1>
        <p className="text-gray-600">발급 및 사용 현황을 수량 중심으로 확인하세요</p>
      </div>

      <Tabs defaultValue="coupons" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="coupons">
            <Ticket className="w-4 h-4 mr-2" />
            쿠폰 현황
          </TabsTrigger>
          <TabsTrigger value="points">
            <Coins className="w-4 h-4 mr-2" />
            포인트 현황
          </TabsTrigger>
        </TabsList>

        {/* 쿠폰 현황 */}
        <TabsContent value="coupons" className="mt-6">
          <div className="space-y-4">
            {coupons.map((coupon, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-gray-900">{coupon.name}</h2>
                    <p className="text-sm text-gray-600">쿠폰 현황</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-sm text-blue-700 mb-2">총 발행</p>
                    <p className="text-blue-900">
                      {coupon.totalIssued.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                    <p className="text-sm text-green-700 mb-2">사용 완료</p>
                    <p className="text-green-900">
                      {coupon.used.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm text-gray-700 mb-2">기간 만료</p>
                    <p className="text-gray-900">
                      {coupon.expired.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                    <p className="text-sm text-purple-700 mb-2">현재 사용 가능</p>
                    <p className="text-purple-900">
                      {coupon.available.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">사용률</span>
                    <span className="text-sm text-gray-900">
                      {((coupon.used / coupon.totalIssued) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: `${(coupon.used / coupon.totalIssued) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 포인트 현황 */}
        <TabsContent value="points" className="mt-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Coins className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-gray-900">포인트 현황</h2>
                <p className="text-sm text-gray-600">총 포인트 발급 및 사용 현황</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-6 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-sm text-blue-700 mb-2">총 발행 포인트</p>
                <p className="text-blue-900">
                  {pointStats.totalIssued.toLocaleString()}점
                </p>
              </div>

              <div className="p-6 rounded-lg bg-orange-50 border border-orange-100">
                <p className="text-sm text-orange-700 mb-2">총 사용 포인트</p>
                <p className="text-orange-900">
                  {pointStats.totalUsed.toLocaleString()}점
                </p>
              </div>

              <div className="p-6 rounded-lg bg-green-50 border border-green-100">
                <p className="text-sm text-green-700 mb-2">현재 사용 가능 포인트</p>
                <p className="text-green-900">
                  {pointStats.available.toLocaleString()}점
                </p>
              </div>
            </div>

            {/* 포인트 사용률 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">포인트 사용률</span>
                <span className="text-sm text-gray-900">
                  {((pointStats.totalUsed / pointStats.totalIssued) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-orange-600"
                  style={{ width: `${(pointStats.totalUsed / pointStats.totalIssued) * 100}%` }}
                />
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-gray-900 mb-3">연동 로직</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>당첨 시: 총 발행 포인트 증가 + 현재 사용 가능 포인트 증가</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>사용 시: 총 사용 포인트 증가 + 현재 사용 가능 포인트 감소</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-600 mt-1">•</span>
                  <span>만료 시: 기간 만료 포인트 증가 + 현재 사용 가능 포인트 감소</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
