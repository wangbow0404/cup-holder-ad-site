import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { PartnerData } from '../page';
import { Button } from './ui/button';

interface DashboardProps {
  partnerData: PartnerData;
  onNavigate: (menu: string) => void;
}

export function Dashboard({ partnerData, onNavigate }: DashboardProps) {
  const isLowInventory = partnerData.inventoryLevel <= 30;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">파트너 홈</h1>
        <p className="text-gray-600">오늘의 업무 현황을 확인하세요</p>
      </div>

      {/* 오늘의 할 일 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">오늘의 할 일</h2>
        
        <div className="space-y-4">
          {/* 일일 소진 보고 */}
          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              {partnerData.dailyReportCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <div>
                <p className="text-gray-900">일일 소진 보고</p>
                <p className="text-sm text-gray-500">
                  {partnerData.dailyReportCompleted ? '완료' : '미완료'}
                </p>
              </div>
            </div>
            {!partnerData.dailyReportCompleted && (
              <Button 
                onClick={() => onNavigate('daily-report')}
                variant="outline"
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
              >
                지금 보고하기
              </Button>
            )}
          </div>

          {/* 컵홀더 재고 */}
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isLowInventory ? 'bg-orange-100' : 'bg-green-100'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isLowInventory ? 'bg-orange-600' : 'bg-green-600'
                  }`} />
                </div>
                <p className="text-gray-900">컵홀더 재고 현황</p>
              </div>
              <span className={`${isLowInventory ? 'text-orange-600' : 'text-green-600'}`}>
                {partnerData.inventoryLevel}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isLowInventory ? 'bg-orange-600' : 'bg-green-600'
                }`}
                style={{ width: `${partnerData.inventoryLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 재고 경고 */}
      {isLowInventory && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-orange-900 mb-2">재고 부족!</h3>
              <p className="text-orange-700 mb-4">
                컵홀더 재고가 {partnerData.inventoryLevel}%로 부족합니다. 발주가 필요합니다.
              </p>
              <Button 
                onClick={() => onNavigate('inventory')}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                즉시 발주
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 리워드 현황 요약 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-4">리워드 현황 요약</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <p className="text-sm text-blue-700 mb-2">오늘 발급된 쿠폰</p>
            <p className="text-blue-900">
              {partnerData.todayCouponsIssued}건
            </p>
          </div>

          <div className="p-4 rounded-lg bg-green-50 border border-green-100">
            <p className="text-sm text-green-700 mb-2">오늘 사용된 쿠폰</p>
            <p className="text-green-900">
              {partnerData.todayCouponsUsed}건
            </p>
          </div>

          <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
            <p className="text-sm text-purple-700 mb-2">오늘 발급된 포인트</p>
            <p className="text-purple-900">
              {partnerData.todayPointsIssued.toLocaleString()}점
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
