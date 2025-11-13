import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { AlertTriangle, Database, Copy } from 'lucide-react';

export function AccountSettings() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">계정 설정</h1>
        <p className="text-gray-600">회사 정보와 멤버십을 관리하세요</p>
      </div>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">회사/정산계좌</TabsTrigger>
          <TabsTrigger value="membership">멤버십 (데이터 보존)</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="p-6 space-y-6">
            <div>
              <h3 className="text-gray-900 mb-4">회사 정보</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company-name">회사명</Label>
                  <Input id="company-name" defaultValue="(주)프리미엄뷰티" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-number">사업자등록번호</Label>
                    <Input id="business-number" defaultValue="123-45-67890" />
                  </div>
                  <div>
                    <Label htmlFor="ceo-name">대표자명</Label>
                    <Input id="ceo-name" defaultValue="홍길동" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">사업장 주소</Label>
                  <Input id="address" defaultValue="서울특별시 강남구 테헤란로 123" />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-gray-900 mb-4">정산 계좌</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank">은행</Label>
                    <Input id="bank" defaultValue="국민은행" />
                  </div>
                  <div>
                    <Label htmlFor="account-number">계좌번호</Label>
                    <Input id="account-number" defaultValue="123-456-789012" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="account-holder">예금주</Label>
                  <Input id="account-holder" defaultValue="홍길동" />
                </div>
              </div>
            </div>

            <Button className="w-full">저장하기</Button>
          </Card>
        </TabsContent>

        <TabsContent value="membership">
          <div className="space-y-6">
            <Card className="p-6 bg-orange-50 border-orange-200">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-900 mb-2">데이터 보존 정책</p>
                  <p className="text-gray-700 mb-3">캠페인 종료 후 총 2개월간 데이터가 보존됩니다</p>
                  <ul className="space-y-2 text-gray-700">
                    <li>• <strong>1개월차 (유예 기간)</strong>: 멤버십 전환, 데이터 열람/다운로드, 기존 주문 처리 가능</li>
                    <li>• <strong>2개월차 (최종 제한)</strong>: 기존 주문의 배송/CS 응대만 가능</li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-900 mb-1">현재 멤버십</p>
                  <p className="text-gray-600">기본 (무료)</p>
                </div>
                <Badge variant="secondary">2개월 보존</Badge>
              </div>
              <div className="space-y-2 text-gray-700 mb-4">
                <div className="flex justify-between">
                  <span>데이터 보존 기간</span>
                  <span>2개월</span>
                </div>
                <div className="flex justify-between">
                  <span>데이터 용량</span>
                  <span>제한 없음</span>
                </div>
              </div>
            </Card>

            <div>
              <h3 className="text-gray-900 mb-4">유료 멤버십 플랜</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-900">라이트</h4>
                    <Badge variant="outline">₩12,000/월</Badge>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 3개월 데이터 보존</li>
                    <li>• 1GB 스토리지</li>
                    <li>• 기본 리포트</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">선택하기</Button>
                </Card>

                <Card className="p-6 border-blue-500 border-2 relative">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">인기</Badge>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-900">스탠다드</h4>
                    <Badge>₩25,000/월</Badge>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 6개월 데이터 보존</li>
                    <li>• 5GB 스토리지</li>
                    <li>• 상세 리포트 포함</li>
                  </ul>
                  <Button className="w-full mt-4">선택하기</Button>
                </Card>

                <Card className="p-6 hover:border-blue-500 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-gray-900">프로</h4>
                    <Badge variant="outline">₩55,000/월</Badge>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 12개월 데이터 보존</li>
                    <li>• 20GB 스토리지</li>
                    <li>• 미니 홈피 유지</li>
                    <li>• 모든 리포트 포함</li>
                  </ul>
                  <Button className="w-full mt-4" variant="outline">선택하기</Button>
                </Card>
              </div>
            </div>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Copy className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-900 mb-2">새 캠페인으로 복사</p>
                  <p className="text-gray-700 mb-3">2개월 만료 후, 소비자 DB는 삭제되나 '캠페인 설정값'은 유지됩니다</p>
                  <Button variant="outline">과거 설정값 불러오기</Button>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
