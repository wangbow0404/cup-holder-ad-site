import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export function OrderManagement() {
  const [activeTab, setActiveTab] = useState('new');

  const newOrders = [
    { id: 1001, customer: '김**', product: '프리미엄 스킨케어 세트', amount: 89000, date: '2025-11-11 14:23' },
    { id: 1002, customer: '이**', product: '데일리 선크림 50+', amount: 32000, date: '2025-11-11 13:15' },
    { id: 1003, customer: '박**', product: '수분 에센스 100ml', amount: 58000, date: '2025-11-11 12:08' },
  ];

  const preparingOrders = [
    { id: 1004, customer: '최**', product: '오가닉 헤어 트리트먼트', amount: 45000, date: '2025-11-10 16:30' },
    { id: 1005, customer: '정**', product: '안티에이징 크림', amount: 125000, date: '2025-11-10 15:22' },
  ];

  const shippingOrders = [
    { id: 1006, customer: '강**', product: '프리미엄 스킨케어 세트', amount: 89000, trackingNumber: '123456789012', courier: 'CJ대한통운', date: '2025-11-09' },
    { id: 1007, customer: '윤**', product: '데일리 선크림 50+', amount: 32000, trackingNumber: '987654321098', courier: '로젠택배', date: '2025-11-09' },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">주문/배송 관리</h1>
        <p className="text-gray-600">주문을 확인하고 배송을 처리하세요</p>
      </div>

      <Card className="mb-6 p-6 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-900 mb-1">자동화 안내</p>
            <p className="text-gray-700">송장 입력 시 택배사 API와 자동 연동되어 배송 상태가 실시간으로 업데이트됩니다</p>
          </div>
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="new">
            신규 주문
            <Badge className="ml-2" variant="secondary">{newOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="preparing">
            배송 준비중
            <Badge className="ml-2" variant="secondary">{preparingOrders.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="shipping">배송 시작</TabsTrigger>
          <TabsTrigger value="completed">배송 완료</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>고객명</TableHead>
                  <TableHead>상품</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>주문일시</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="text-gray-900">#{order.id}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.customer}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.product}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">₩{order.amount.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.date}</p>
                    </TableCell>
                    <TableCell>
                      <Button size="sm">발주 확인</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="preparing">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>고객명</TableHead>
                  <TableHead>상품</TableHead>
                  <TableHead>금액</TableHead>
                  <TableHead>확인일시</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preparingOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="text-gray-900">#{order.id}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.customer}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.product}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">₩{order.amount.toLocaleString()}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.date}</p>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">송장 입력</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>송장번호 입력</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label htmlFor="courier">택배사</Label>
                              <Select>
                                <SelectTrigger id="courier">
                                  <SelectValue placeholder="택배사 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cj">CJ대한통운</SelectItem>
                                  <SelectItem value="hanjin">한진택배</SelectItem>
                                  <SelectItem value="logen">로젠택배</SelectItem>
                                  <SelectItem value="post">우체국택배</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="tracking">송장번호</Label>
                              <Input id="tracking" placeholder="송장번호를 입력하세요" />
                            </div>
                            <Button className="w-full">배송 시작</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>고객명</TableHead>
                  <TableHead>상품</TableHead>
                  <TableHead>택배사</TableHead>
                  <TableHead>송장번호</TableHead>
                  <TableHead>배송일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="text-gray-900">#{order.id}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.customer}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.product}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.courier}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-900">{order.trackingNumber}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-700">{order.date}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card className="p-12 text-center">
            <p className="text-gray-600">배송 완료된 주문이 없습니다</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
