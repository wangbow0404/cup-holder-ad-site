import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { TrendingUp } from 'lucide-react';

export function PlatformAds() {
  const campaigns = [
    { id: 1, name: '플랫폼 홈 배너 광고', type: 'CPM', budget: 500000, spent: 342000, impressions: 156000, clicks: 3420, status: '진행중' },
    { id: 2, name: '타깃 푸시 알림', type: 'CPC', budget: 300000, spent: 245000, impressions: 89000, clicks: 2450, status: '진행중' },
    { id: 3, name: '추천 상품 영역', type: 'CPT', budget: 200000, spent: 200000, impressions: 45000, clicks: 1580, status: '종료' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 mb-2">플랫폼 광고</h1>
          <p className="text-gray-600">플랫폼 내부 광고를 집행하고 성과를 확인하세요</p>
        </div>
        <Button>새 광고 만들기</Button>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">광고 집행</TabsTrigger>
          <TabsTrigger value="reports">광고 리포트</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">총 예산</p>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-gray-900">₩1,000,000</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">집행 금액</p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-gray-900">₩787,000</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">잔여 예산</p>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-gray-900">₩213,000</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">광고 상품 안내</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <Badge className="mb-2">CPM</Badge>
                <p className="text-gray-900 mb-1">노출 기반 과금</p>
                <p className="text-gray-600">1,000회 노출당 ₩3,000</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <Badge className="mb-2">CPC</Badge>
                <p className="text-gray-900 mb-1">클릭 기반 과금</p>
                <p className="text-gray-600">클릭당 ₩100</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <Badge className="mb-2">CPT</Badge>
                <p className="text-gray-900 mb-1">기간 기반 과금</p>
                <p className="text-gray-600">7일 기준 ₩200,000</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>캠페인명</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>예산</TableHead>
                  <TableHead>집행액</TableHead>
                  <TableHead>노출수</TableHead>
                  <TableHead>클릭수</TableHead>
                  <TableHead>상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <p className="text-gray-900">{campaign.name}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">₩{campaign.budget.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">₩{campaign.spent.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{campaign.impressions.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{campaign.clicks.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === '진행중' ? 'default' : 'secondary'}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
