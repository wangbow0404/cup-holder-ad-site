'use client';

import { useState } from 'react';

// shadcn-ui
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// icons
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Store,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  Search,
  Download,
  MapPin,
} from 'lucide-react';

// charts
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// ---------- utils ----------
const formatKR = (n: number) => new Intl.NumberFormat('ko-KR').format(n);

// Pie 라벨 렌더러 (JSX 밖으로 분리하여 타입 명시)
type PieLabelPayload = { name: string; percent: number };
const renderPieLabel = ({ name, percent }: PieLabelPayload) =>
  `${name} ${(percent * 100).toFixed(0)}%`;

// ---------- page ----------
export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<'day' | 'month' | 'quarter' | 'year'>('month');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const revenueData = [
    { name: '1주', advertiser: 4200, partner: 2400, total: 6600 },
    { name: '2주', advertiser: 3800, partner: 2100, total: 5900 },
    { name: '3주', advertiser: 5100, partner: 2800, total: 7900 },
    { name: '4주', advertiser: 6300, partner: 3200, total: 9500 },
  ];

  const platformStats = {
    totalRevenue: 29_900_000,
    advertiserRevenue: 19_500_000,
    partnerRevenue: 10_400_000,
    totalExpense: 8_200_000,
    netProfit: 21_700_000,
    revenueChange: 12.5,
    profitChange: 15.3,
  };

  const todoItems = [
    { id: 1, type: 'campaign', label: '신규 캠페인 승인 대기', count: 8, urgent: true },
    { id: 2, type: 'partner', label: '신규 파트너 가입 승인 대기', count: 5, urgent: true },
    { id: 3, type: 'cs', label: 'CS 신고 접수', count: 12, urgent: false },
    { id: 4, type: 'ai', label: 'AI 블라인드 리뷰', count: 3, urgent: false },
  ];

  const userStats = { advertisers: 1247, partners: 3892, consumers: 45_621 };

  const topAdvertisers = [
    { rank: 1, name: '스타벅스 코리아', amount: 45_200_000, metric: '캠페인 집행 금액' },
    { rank: 2, name: '이디야커피', amount: 38_500_000, metric: '캠페인 집행 금액' },
    { rank: 3, name: '투썸플레이스', amount: 32_100_000, metric: '캠페인 집행 금액' },
    { rank: 4, name: '메가커피', amount: 28_900_000, metric: '캠페인 집행 금액' },
    { rank: 5, name: '빽다방', amount: 25_700_000, metric: '캠페인 집행 금액' },
  ];

  const topPartners = [
    { rank: 1, name: '성수동 카페A', rate: 98.5, metric: '소진 보고율' },
    { rank: 2, name: '강남역 카페B', rate: 97.2, metric: '소진 보고율' },
    { rank: 3, name: '홍대 카페C', rate: 96.8, metric: '소진 보고율' },
    { rank: 4, name: '이태원 카페D', rate: 95.4, metric: '소진 보고율' },
    { rank: 5, name: '건대 카페E', rate: 94.9, metric: '소진 보고율' },
  ];

  const distributionData = [
    { name: '브론즈', value: 1892, color: '#CD7F32' },
    { name: '실버', value: 1245, color: '#C0C0C0' },
    { name: '골드', value: 542, color: '#FFD700' },
    { name: '플래티넘', value: 213, color: '#E5E4E2' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 text-2xl font-semibold">관리자 대시보드</h1>
          <p className="text-gray-500 mt-1">플랫폼 전체 현황을 실시간으로 확인하세요</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(v: 'day' | 'month' | 'quarter' | 'year') => setPeriod(v)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">일</SelectItem>
              <SelectItem value="month">월</SelectItem>
              <SelectItem value="quarter">분기</SelectItem>
              <SelectItem value="year">년</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" type="button">
            <Download className="w-4 h-4 mr-2" aria-hidden />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">총 수익</span>
            <DollarSign className="w-5 h-5 text-blue-600" aria-hidden />
          </div>
          <div className="text-gray-900 text-xl font-semibold">₩{formatKR(platformStats.totalRevenue)}</div>
          <div className="flex items-center gap-1 mt-2 text-green-600">
            <TrendingUp className="w-4 h-4" aria-hidden />
            <span className="text-sm">{platformStats.revenueChange}%</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">광고주 수익</span>
            <ShoppingBag className="w-5 h-5 text-purple-600" aria-hidden />
          </div>
          <div className="text-gray-900 text-xl font-semibold">
            ₩{formatKR(platformStats.advertiserRevenue)}
          </div>
          <p className="text-gray-400 mt-2 text-sm">캠페인 + 멤버십</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">파트너 수익</span>
            <Store className="w-5 h-5 text-orange-600" aria-hidden />
          </div>
          <div className="text-gray-900 text-xl font-semibold">
            ₩{formatKR(platformStats.partnerRevenue)}
          </div>
          <p className="text-gray-400 mt-2 text-sm">컵홀더 결제</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">총 지출</span>
            <TrendingDown className="w-5 h-5 text-red-600" aria-hidden />
          </div>
          <div className="text-gray-900 text-xl font-semibold">
            ₩{formatKR(platformStats.totalExpense)}
          </div>
          <p className="text-gray-400 mt-2 text-sm">인센티브 지급</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700">총 순이익</span>
            <DollarSign className="w-5 h-5 text-blue-700" aria-hidden />
          </div>
          <div className="text-gray-900 text-xl font-semibold">
            ₩{formatKR(platformStats.netProfit)}
          </div>
          <div className="flex items-center gap-1 mt-2 text-blue-700">
            <TrendingUp className="w-4 h-4" aria-hidden />
            <span className="text-sm">{platformStats.profitChange}%</span>
          </div>
        </Card>
      </div>

      {/* To-Do + Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-gray-900 mb-4 text-lg font-semibold">📋 오늘의 업무 (To-Do List)</h2>
          <div className="space-y-3">
            {todoItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.urgent ? (
                    <AlertCircle className="w-5 h-5 text-red-500" aria-hidden />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-gray-400" aria-hidden />
                  )}
                  <span className="text-gray-700">{item.label}</span>
                </div>
                <Badge variant={item.urgent ? 'destructive' : 'secondary'}>{item.count}건</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4 text-lg font-semibold">👥 주체별 현황</h2>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">총 광고주 수</span>
                <Users className="w-5 h-5 text-purple-600" aria-hidden />
              </div>
              <div className="text-gray-900 mt-1 text-xl font-semibold">
                {userStats.advertisers.toLocaleString()}명
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">총 파트너 수</span>
                <Store className="w-5 h-5 text-orange-600" aria-hidden />
              </div>
              <div className="text-gray-900 mt-1 text-xl font-semibold">
                {userStats.partners.toLocaleString()}명
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">총 소비자 수</span>
                <Users className="w-5 h-5 text-blue-600" aria-hidden />
              </div>
              <div className="text-gray-900 mt-1 text-xl font-semibold">
                {userStats.consumers.toLocaleString()}명
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Line Chart */}
      <Card className="p-6">
        <h2 className="text-gray-900 mb-4 text-lg font-semibold">📊 수익 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="advertiser" stroke="#9333ea" strokeWidth={2} name="광고주" />
            <Line type="monotone" dataKey="partner" stroke="#f97316" strokeWidth={2} name="파트너" />
            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} name="총계" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Rankings + Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-gray-900 mb-4 text-lg font-semibold">🏆 광고주 순위 (Top 5)</h2>
          <div className="space-y-3">
            {topAdvertisers.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.rank === 1
                      ? 'bg-yellow-400 text-white'
                      : item.rank === 2
                      ? 'bg-gray-300 text-white'
                      : item.rank === 3
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {item.rank}
                </div>
                <div className="flex-1">
                  <div className="text-gray-700">{item.name}</div>
                  <div className="text-gray-500">₩{formatKR(item.amount)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4 text-lg font-semibold">⭐ 파트너 순위 (Top 5)</h2>
          <div className="space-y-3">
            {topPartners.map((item) => (
              <div key={item.rank} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.rank === 1
                      ? 'bg-yellow-400 text-white'
                      : item.rank === 2
                      ? 'bg-gray-300 text-white'
                      : item.rank === 3
                      ? 'bg-orange-400 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {item.rank}
                </div>
                <div className="flex-1">
                  <div className="text-gray-700">{item.name}</div>
                  <div className="text-gray-500">{item.rate}%</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4 text-lg font-semibold">📈 파트너 등급 분포</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderPieLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Search & Map placeholder */}
      <Card className="p-6">
        <h2 className="text-gray-900 mb-4 text-lg font-semibold">🔍 통합 검색 & 지도 연동</h2>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden />
            <Input
              placeholder="광고주명 또는 파트너명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="등급" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="platinum">플래티넘</SelectItem>
              <SelectItem value="gold">골드</SelectItem>
              <SelectItem value="silver">실버</SelectItem>
              <SelectItem value="bronze">브론즈</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button">검색</Button>
        </div>
        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" aria-hidden />
            <p>지도 연동 뷰 (등급/상권/재고 필터 적용 가능)</p>
          </div>
        </div>
        <p className="text-gray-500 mt-3 text-sm">
          💡 검색 시 해당 업체의 개별 데이터로 대시보드가 전환됩니다
        </p>
      </Card>
    </div>
  );
}
