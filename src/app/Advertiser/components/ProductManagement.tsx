import { Card } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';

export function ProductManagement() {
  const products = [
    { id: 1, name: '프리미엄 스킨케어 세트', price: 89000, stock: 23, sales: 157, image: '🧴' },
    { id: 2, name: '오가닉 헤어 트리트먼트', price: 45000, stock: 45, sales: 98, image: '💆' },
    { id: 3, name: '데일리 선크림 50+', price: 32000, stock: 67, sales: 234, image: '☀️' },
    { id: 4, name: '수분 에센스 100ml', price: 58000, stock: 8, sales: 76, image: '💧' },
    { id: 5, name: '안티에이징 크림', price: 125000, stock: 15, sales: 45, image: '✨' },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 mb-2">상품 관리</h1>
          <p className="text-gray-600">등록된 제품을 관리하고 수정하세요</p>
        </div>
        <Button>새 상품 추가</Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상품</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>재고</TableHead>
              <TableHead>누적 판매</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{product.image}</span>
                    </div>
                    <div>
                      <p className="text-gray-900">{product.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">₩{product.price.toLocaleString()}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={product.stock < 10 ? 'destructive' : 'secondary'}>
                    {product.stock}개
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-gray-700">{product.sales}개</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="mt-4 text-gray-600">
        총 {products.length}개 상품 / 최대 20개
      </div>
    </div>
  );
}
