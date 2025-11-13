import { PartnerData } from '../page';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { AlertCircle, FileText, Coins } from 'lucide-react';

interface SettlementProps {
  partnerData: PartnerData;
}

interface SettlementItem {
  month: string;
  reportRate: number;
  amount: number;
  status: 'completed' | 'pending' | 'disputed';
}

export function Settlement({ partnerData }: SettlementProps) {
  const isPlatinum = partnerData.tier === 'platinum';
  const isBronze = partnerData.tier === 'bronze';

  const incentiveHistory: SettlementItem[] = [
    { month: '2025-10', reportRate: 95.5, amount: 284500, status: 'completed' },
    { month: '2025-09', reportRate: 92.3, amount: 261200, status: 'completed' },
    { month: '2025-08', reportRate: 94.1, amount: 273800, status: 'completed' },
  ];

  const cupholderBills: SettlementItem[] = [
    { month: '2025-10', reportRate: 82.5, amount: 125000, status: 'pending' },
    { month: '2025-09', reportRate: 81.2, amount: 118000, status: 'completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-orange-600 bg-orange-50';
      case 'disputed': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '정산 완료';
      case 'pending': return '결제 대기';
      case 'disputed': return '이의 신청 중';
      default: return status;
    }
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">정산</h1>
        <p className="text-gray-600">정산 내역 및 청구서를 확인하세요</p>
      </div>

      {/* 등급별 안내 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-blue-900 mb-2">현재 등급: {partnerData.tier.toUpperCase()}</h3>
            <div className="text-sm text-blue-700 space-y-1">
              {isPlatinum && (
                <p>• 플래티넘 등급: 인센티브 정산 내역 확인 가능 (개당 10원)</p>
              )}
              {isBronze && (
                <p>• 브론즈 등급: 컵홀더 50% 부담금 청구서 확인 필요</p>
              )}
              <p>• 보고율에 따라 월말 정산이 진행됩니다</p>
              <p>• 정산 내역 확인 후 7일 이내 이의 신청이 가능합니다</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue={isPlatinum ? "incentive" : isBronze ? "bills" : "common"} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {isPlatinum && (
            <TabsTrigger value="incentive">
              <Coins className="w-4 h-4 mr-2" />
              인센티브 정산
            </TabsTrigger>
          )}
          {isBronze && (
            <TabsTrigger value="bills">
              <FileText className="w-4 h-4 mr-2" />
              부담금 청구서
            </TabsTrigger>
          )}
          <TabsTrigger value="common">
            <FileText className="w-4 h-4 mr-2" />
            공통 정산
          </TabsTrigger>
        </TabsList>

        {/* 플래티넘 - 인센티브 정산 */}
        {isPlatinum && (
          <TabsContent value="incentive" className="mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4">인센티브 정산 내역</h2>
              <p className="text-sm text-gray-600 mb-6">개당 10원의 인센티브가 지급됩니다</p>

              <div className="space-y-3">
                {incentiveHistory.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-gray-900">{item.month}</p>
                        <p className="text-sm text-gray-600">보고율: {item.reportRate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">
                          {item.amount.toLocaleString()}원
                        </p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">상세 보기</Button>
                      {item.status === 'completed' && (
                        <Button variant="outline" size="sm">이의 신청 (7일)</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        )}

        {/* 브론즈 - 부담금 청구서 */}
        {isBronze && (
          <TabsContent value="bills" className="mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4">컵홀더 부담금 청구서</h2>
              <p className="text-sm text-gray-600 mb-6">컵홀더 비용의 50%를 부담합니다</p>

              <div className="space-y-3">
                {cupholderBills.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-gray-900">{item.month}</p>
                        <p className="text-sm text-gray-600">보고율: {item.reportRate}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">
                          {item.amount.toLocaleString()}원
                        </p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${getStatusColor(item.status)}`}>
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">상세 보기</Button>
                      {item.status === 'pending' && (
                        <Button size="sm">결제하기</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        )}

        {/* 공통 정산 */}
        <TabsContent value="common" className="mt-6">
          <div className="space-y-6">
            {/* 보고율 산식 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4">보고율 산식</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">보고율</span>
                    <span className="text-gray-900">= (보고 일수 / 영업 일수) × 100</span>
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">이번 달 보고 일수</span>
                    <span className="text-gray-900">28일</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">이번 달 영업 일수</span>
                    <span className="text-gray-900">30일</span>
                  </div>
                  <div className="h-px bg-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">현재 보고율</span>
                    <span className="text-blue-600">93.3%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 월말 정산 내역 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4">월말 정산 내역</h2>
              
              <div className="space-y-3">
                {[
                  { month: '2025-10', reportRate: 93.3, cupholder: 5420, reward: 2850 },
                  { month: '2025-09', reportRate: 91.5, cupholder: 5120, reward: 2610 },
                  { month: '2025-08', reportRate: 94.8, cupholder: 5680, reward: 2920 },
                ].map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-gray-900">{item.month}</p>
                        <p className="text-sm text-gray-600">보고율: {item.reportRate}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-3 bg-blue-50 rounded">
                        <p className="text-xs text-blue-700 mb-1">컵홀더 소진</p>
                        <p className="text-blue-900">{item.cupholder.toLocaleString()}개</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded">
                        <p className="text-xs text-purple-700 mb-1">리워드 발급</p>
                        <p className="text-purple-900">{item.reward.toLocaleString()}건</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">상세 보기</Button>
                      <Button variant="outline" size="sm">이의 신청 (7일)</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 등급 기준 안내 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4">등급별 혜택 (6개월 롤링 평균)</h2>
              
              <div className="space-y-3">
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-orange-900">브론즈</span>
                    <span className="text-sm text-orange-700">표시 ≥80%</span>
                  </div>
                  <p className="text-sm text-orange-700">컵홀더 50% 부담</p>
                </div>

                <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">실버</span>
                    <span className="text-sm text-gray-600">표시 85% / 실질 80%</span>
                  </div>
                  <p className="text-sm text-gray-600">무료 제공</p>
                </div>

                <div className="p-4 border border-yellow-300 rounded-lg bg-yellow-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-900">골드</span>
                    <span className="text-sm text-yellow-700">표시 100% / 실질 90%</span>
                  </div>
                  <p className="text-sm text-yellow-700">무료 + 매체 30% 할인쿠폰</p>
                </div>

                <div className="p-4 border border-purple-300 rounded-lg bg-purple-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-900">플래티넘</span>
                    <span className="text-sm text-purple-700">골드 충족 + 1년</span>
                  </div>
                  <p className="text-sm text-purple-700">골드 + 개당 10원 인센티브</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
