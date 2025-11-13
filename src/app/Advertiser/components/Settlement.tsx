import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { DollarSign } from 'lucide-react';

export function Settlement() {
  const settlements = [
    { 
      month: '2025-11', 
      totalSales: 18450000, 
      platformFee: 922500, 
      pgFee: 553500, 
      finalAmount: 16974000,
      status: '정산 예정',
      date: '2025-12-10'
    },
    { 
      month: '2025-10', 
      totalSales: 15230000, 
      platformFee: 761500, 
      pgFee: 456900, 
      finalAmount: 14011600,
      status: '정산 완료',
      date: '2025-11-10'
    },
    { 
      month: '2025-09', 
      totalSales: 12890000, 
      platformFee: 644500, 
      pgFee: 386700, 
      finalAmount: 11858800,
      status: '정산 완료',
      date: '2025-10-10'
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">E-Com 정산 내역</h1>
        <p className="text-gray-600">월별 판매 수익 정산 내역을 확인하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">이번 달 총 매출</p>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-gray-900">₩18,450,000</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">예상 정산액</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-gray-900">₩16,974,000</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">누적 정산액</p>
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-gray-900">₩25,870,400</p>
        </Card>
      </div>

      <Card className="mb-6 p-6 bg-blue-50 border-blue-200">
        <h3 className="text-gray-900 mb-3">정산 수수료 안내</h3>
        <div className="space-y-2 text-gray-700">
          <div className="flex items-center justify-between">
            <span>플랫폼 수수료</span>
            <span>5%</span>
          </div>
          <div className="flex items-center justify-between">
            <span>PG 수수료</span>
            <span>3%</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-blue-200">
            <span className="text-gray-900">총 공제율</span>
            <span className="text-gray-900">8%</span>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>정산 월</TableHead>
              <TableHead>총 매출</TableHead>
              <TableHead>플랫폼 수수료 (5%)</TableHead>
              <TableHead>PG 수수료 (3%)</TableHead>
              <TableHead>최종 정산액</TableHead>
              <TableHead>정산일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settlements.map((settlement) => (
              <TableRow key={settlement.month}>
                <TableCell>
                  <p className="text-gray-900">{settlement.month}</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">₩{settlement.totalSales.toLocaleString()}</p>
                </TableCell>
                <TableCell>
                  <p className="text-red-600">-₩{settlement.platformFee.toLocaleString()}</p>
                </TableCell>
                <TableCell>
                  <p className="text-red-600">-₩{settlement.pgFee.toLocaleString()}</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-900">₩{settlement.finalAmount.toLocaleString()}</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">{settlement.date}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={settlement.status === '정산 완료' ? 'default' : 'secondary'}>
                    {settlement.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
