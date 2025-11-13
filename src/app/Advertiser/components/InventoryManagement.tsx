import { Card } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';

export function InventoryManagement() {
  const inventory = [
    { id: 1, name: '프리미엄 스킨케어 세트', initial: 200, sold: 177, current: 23 },
    { id: 2, name: '오가닉 헤어 트리트먼트', initial: 150, sold: 105, current: 45 },
    { id: 3, name: '데일리 선크림 50+', initial: 300, sold: 233, current: 67 },
    { id: 4, name: '수분 에센스 100ml', initial: 100, sold: 92, current: 8 },
    { id: 5, name: '안티에이징 크림', initial: 80, sold: 65, current: 15 },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">재고 관리</h1>
        <p className="text-gray-600">실시간 재고 현황을 확인하고 관리하세요</p>
      </div>

      <Card className="mb-6 p-6 bg-orange-50 border-orange-200">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-orange-600" />
          <div>
            <p className="text-gray-900">재고 부족 경고</p>
            <p className="text-gray-700">10개 미만 상품이 2개 있습니다. 재고를 보충해주세요.</p>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상품명</TableHead>
              <TableHead>초기 총량</TableHead>
              <TableHead>누적 판매</TableHead>
              <TableHead>현재고</TableHead>
              <TableHead>수동 조절</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="text-gray-900">{item.name}</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">{item.initial}개</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">{item.sold}개</p>
                </TableCell>
                <TableCell>
                  <p className="text-gray-900">{item.current}개</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Input type="number" className="w-20" defaultValue={item.current} />
                    <Button size="sm" variant="outline">변경</Button>
                  </div>
                </TableCell>
                <TableCell>
                  {item.current < 10 ? (
                    <Badge variant="destructive">부족</Badge>
                  ) : item.current < 30 ? (
                    <Badge variant="secondary">보통</Badge>
                  ) : (
                    <Badge>충분</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
