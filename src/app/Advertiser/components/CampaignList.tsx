import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Zap } from 'lucide-react';

export function CampaignList() {
  const campaigns = [
    { id: 1, name: '여름 스킨케어 캠페인', status: '진행중', startDate: '2025-01-01', endDate: '2025-03-31', participants: 12458, budget: 2500000 },
    { id: 2, name: '신제품 런칭 이벤트', status: '승인대기', startDate: '2025-02-01', endDate: '2025-04-30', participants: 0, budget: 1800000 },
    { id: 3, name: '가을 프로모션', status: '종료', startDate: '2024-09-01', endDate: '2024-11-30', participants: 8734, budget: 2000000 },
    { id: 4, name: '크리스마스 특별 기획', status: '만료됨', startDate: '2024-12-01', endDate: '2024-12-31', participants: 5621, budget: 1500000 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '진행중': return 'default';
      case '승인대기': return 'secondary';
      case '종료': return 'outline';
      case '만료됨': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">캠페인 목록</h1>
        <p className="text-gray-600">진행 중인 캠페인과 과거 캠페인을 관리하세요</p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>캠페인명</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>기간</TableHead>
              <TableHead>참여자</TableHead>
              <TableHead>예산</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <p className="text-gray-900">{campaign.name}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(campaign.status) as any}>
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">{campaign.startDate} ~ {campaign.endDate}</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">{campaign.participants.toLocaleString()}명</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">₩{campaign.budget.toLocaleString()}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">상세</Button>
                    {campaign.status === '진행중' && (
                      <Button variant="default" size="sm" className="gap-1">
                        <Zap className="w-3 h-3" />
                        Boost
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="mt-6 p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <p className="text-gray-900 mb-1">Boost 기능</p>
            <p className="text-gray-700">총 예산을 +20% 증액하면 캠페인 기간이 1/2로 단축됩니다. 더 빠르게 목표를 달성하세요!</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
