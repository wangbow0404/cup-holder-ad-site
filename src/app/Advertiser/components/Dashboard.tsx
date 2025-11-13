import { Card } from './ui/card';
import { Users, TrendingUp, MapPin, Gift, Package, AlertTriangle, ShoppingCart, MessageSquare, Star } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

export function Dashboard() {
  const kpiData = [
    { label: '전체 참여자 수', value: '12,458', icon: Users },
    { label: '실시간 참여율 (3h)', value: '87.3%', icon: TrendingUp },
    { label: '지역별 참여', value: '서울 42%', icon: MapPin },
    { label: '성별/연령', value: '여성 25-34세', icon: Users },
    { label: '쿠폰/포인트 사용량', value: '₩2.4M', icon: Gift },
    { label: '리워드 소진율', value: '68%', icon: Package },
  ];

  const todoItems = [
    { label: '신규 주문', count: 15, icon: ShoppingCart },
    { label: '배송 준비중', count: 8, icon: Package },
    { label: '1:1 문의', count: 3, icon: MessageSquare },
    { label: '신규 리뷰', count: 12, icon: Star },
  ];

  const topProducts = [
    { name: '프리미엄 스킨케어 세트', stock: 23 },
    { name: '오가닉 헤어 트리트먼트', stock: 45 },
    { name: '데일리 선크림 50+', stock: 67 },
    { name: '수분 에센스 100ml', stock: 8 },
    { name: '안티에이징 크림', stock: 15 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">광고주 홈 대시보드</h1>
        <p className="text-gray-600">캠페인 성과와 E-Commerce 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI Section */}
      <div>
        <h2 className="text-gray-900 mb-4">캠페인 성과 (KPI)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiData.map((kpi, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 mb-2">{kpi.label}</p>
                  <p className="text-gray-900">{kpi.value}</p>
                </div>
                <kpi.icon className="w-5 h-5 text-blue-600" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* E-Commerce Section */}
      <div>
        <h2 className="text-gray-900 mb-4">E-Commerce 현황 (To-Do)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {todoItems.map((item, index) => (
            <Card key={index} className="p-6 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <item.icon className="w-5 h-5 text-blue-600" />
                <Badge variant="secondary">{item.count}건</Badge>
              </div>
              <p className="text-gray-700">{item.label}</p>
            </Card>
          ))}
        </div>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">총 매출액 (이번 달)</p>
              <p className="text-gray-900">₩18,450,000</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Inventory Section */}
      <div>
        <h2 className="text-gray-900 mb-4">경품/재고 현황</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-6">
            <p className="text-gray-700 mb-4">게임 경품 소진율</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">68%</span>
                <span className="text-gray-600">680 / 1,000개</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-700">E-Com 제품 실시간 재고 (Top 5)</p>
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-700">{product.name}</span>
                  <Badge variant={product.stock < 10 ? 'destructive' : 'secondary'}>
                    {product.stock}개
                  </Badge>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-orange-600 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  재고 부족 (10개 미만) 경고: 2개 상품
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Map Section */}
      <Card className="p-6">
        <h3 className="text-gray-900 mb-4">상위 지역 (지도 사후 배정핀)</h3>
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <p className="text-gray-600">지도 시각화 영역</p>
            <p className="text-gray-500">상위 지역: 서울 강남구, 서초구, 송파구</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
