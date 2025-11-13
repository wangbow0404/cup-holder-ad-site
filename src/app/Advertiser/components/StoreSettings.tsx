import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Upload } from 'lucide-react';

export function StoreSettings() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">미니 홈피 설정</h1>
        <p className="text-gray-600">소비자에게 노출될 스토어 정보를 관리하세요</p>
      </div>

      <Card className="p-6 space-y-6">
        <div>
          <Label htmlFor="brand-logo">브랜드 로고</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">클릭하여 로고를 업로드하세요</p>
            <p className="text-gray-500">JPG, PNG (최대 5MB)</p>
          </div>
        </div>

        <div>
          <Label htmlFor="brand-name">브랜드명</Label>
          <Input id="brand-name" placeholder="브랜드명을 입력하세요" defaultValue="프리미엄 뷰티" />
        </div>

        <div>
          <Label htmlFor="brand-tagline">브랜드 슬로건</Label>
          <Input id="brand-tagline" placeholder="한줄 소개를 입력하세요" defaultValue="당신의 피부를 위한 특별한 선택" />
        </div>

        <div>
          <Label htmlFor="brand-description">상세 설명</Label>
          <Textarea 
            id="brand-description" 
            placeholder="브랜드에 대한 자세한 설명을 입력하세요" 
            rows={6}
            defaultValue="프리미엄 뷰티는 자연에서 온 성분으로 당신의 피부를 케어합니다. 엄선된 오가닉 성분과 최첨단 기술의 조화로 건강하고 아름다운 피부를 선사합니다."
          />
        </div>

        <div>
          <Label htmlFor="contact-email">고객 문의 이메일</Label>
          <Input id="contact-email" type="email" placeholder="contact@example.com" />
        </div>

        <div>
          <Label htmlFor="contact-phone">고객 문의 전화</Label>
          <Input id="contact-phone" type="tel" placeholder="02-1234-5678" />
        </div>

        <div>
          <Label htmlFor="business-hours">운영 시간</Label>
          <Input id="business-hours" placeholder="평일 09:00 - 18:00" />
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button className="flex-1">저장하기</Button>
          <Button variant="outline" className="flex-1">미리보기</Button>
        </div>
      </Card>
    </div>
  );
}
