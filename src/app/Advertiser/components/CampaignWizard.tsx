import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, ArrowRight, Check, Upload, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';

interface CampaignWizardProps {
  onComplete: () => void;
}

export function CampaignWizard({ onComplete }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  const steps = [
    '목적 선택',
    '타깃 설정',
    '브랜드 등록',
    '제품 등록',
    'AI 크리에이티브',
    '참여 방식',
    '결과 매칭',
    '게임/리워드',
    '7등 설정',
    '미리보기/제출'
  ];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">캠페인 목적을 선택해주세요</h2>
              <p className="text-gray-600">캠페인의 주요 목표를 선택하세요</p>
            </div>
            <RadioGroup defaultValue="marketing">
              <Card className="p-6 cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="branding" id="branding" />
                  <div className="flex-1">
                    <Label htmlFor="branding" className="cursor-pointer">
                      <p className="text-gray-900 mb-1">브랜딩 (판매 X)</p>
                      <p className="text-gray-600">브랜드 인지도 향상에 집중</p>
                    </Label>
                  </div>
                </div>
              </Card>
              <Card className="p-6 cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="marketing" id="marketing" />
                  <div className="flex-1">
                    <Label htmlFor="marketing" className="cursor-pointer">
                      <p className="text-gray-900 mb-1">마케팅 (판매 O)</p>
                      <p className="text-gray-600">제품 판매 및 수익 창출</p>
                    </Label>
                  </div>
                </div>
              </Card>
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">타깃 설정</h2>
              <p className="text-gray-600">지역과 고객층을 선택하세요 (최대 5개)</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label>지역 (시/구)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['서울 강남구', '서울 서초구', '서울 송파구', '서울 마포구', '경기 성남시', '경기 수원시'].map((region) => (
                    <div key={region} className="flex items-center gap-2">
                      <Checkbox id={region} />
                      <Label htmlFor={region} className="cursor-pointer">{region}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>고객층 (최대 5개)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['여성 20-29세', '여성 30-39세', '남성 20-29세', '남성 30-39세', '모든 연령대'].map((demo) => (
                    <div key={demo} className="flex items-center gap-2">
                      <Checkbox id={demo} />
                      <Label htmlFor={demo} className="cursor-pointer">{demo}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">브랜드 등록</h2>
              <p className="text-gray-600">브랜드 정보를 입력하세요</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="brand-name">브랜드명</Label>
                <Input id="brand-name" placeholder="브랜드명을 입력하세요" />
              </div>
              <div>
                <Label htmlFor="brand-desc">브랜드 설명</Label>
                <Textarea id="brand-desc" placeholder="브랜드에 대한 설명을 입력하세요" rows={4} />
              </div>
              <div>
                <Label>로고 이미지</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">클릭하여 로고를 업로드하세요</p>
                  <p className="text-gray-500">JPG, PNG (최대 5MB)</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">제품 등록</h2>
              <p className="text-gray-600">판매 및 경품으로 사용할 제품을 등록하세요 (최대 20종)</p>
            </div>
            <Card className="p-6 bg-gray-50">
              <div className="space-y-4">
                <Input placeholder="제품명" />
                <Textarea placeholder="제품 설명" rows={3} />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>가격 (₩)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label>초기 재고 수량</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">제품 이미지 업로드</p>
                </div>
                <Button className="w-full">제품 추가</Button>
              </div>
            </Card>
            <div className="text-gray-600">등록된 제품: 0 / 20</div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">AI 크리에이티브</h2>
              <p className="text-gray-600">AI가 추천하는 후킹 문구와 이미지를 선택하세요</p>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              AI 추천 생성하기
            </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-4 cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="bg-gray-100 rounded-lg h-32 mb-3 flex items-center justify-center">
                    <p className="text-gray-500">AI 생성 이미지 {i}</p>
                  </div>
                  <p className="text-gray-700">"당신의 피부를 위한 특별한 선택"</p>
                  <Badge className="mt-2">AI 추천</Badge>
                </Card>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">참여 방식</h2>
              <p className="text-gray-600">고객 참여 방식을 선택하세요</p>
            </div>
            <RadioGroup defaultValue="survey">
              <Card className="p-6 cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="survey" id="survey" />
                  <div className="flex-1">
                    <Label htmlFor="survey" className="cursor-pointer">
                      <p className="text-gray-900 mb-1">설문/컨설팅</p>
                      <p className="text-gray-600">AI가 2가지 스타일의 질문지를 제안합니다</p>
                    </Label>
                  </div>
                </div>
              </Card>
              <Card className="p-6 cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="instant" id="instant" />
                  <div className="flex-1">
                    <Label htmlFor="instant" className="cursor-pointer">
                      <p className="text-gray-900 mb-1">영상/즉시 노출</p>
                      <p className="text-gray-600">바로 리워드를 제공합니다</p>
                    </Label>
                  </div>
                </div>
              </Card>
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">결과 매칭</h2>
              <p className="text-gray-600">질문과 결과를 제품과 매칭하세요</p>
            </div>
            <Card className="p-6">
              <p className="text-gray-700 mb-4">질문 5~6단계 (보기 2~5개) → 결과 (최대 20개) ↔ 제품 (최대 20종) 1:1 매칭</p>
              <div className="space-y-4">
                <div>
                  <Label>질문 1</Label>
                  <Input placeholder="예: 당신의 피부 타입은?" />
                  <div className="mt-2 space-y-2">
                    <Input placeholder="보기 1: 건성" />
                    <Input placeholder="보기 2: 지성" />
                    <Input placeholder="보기 3: 복합성" />
                  </div>
                </div>
                <Button variant="outline" className="w-full">질문 추가</Button>
              </div>
            </Card>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">게임/리워드 설정</h2>
              <p className="text-gray-600">1~6등 상품과 리워드를 설정하세요</p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((rank) => (
                <Card key={rank} className="p-4">
                  <div className="flex items-center gap-4">
                    <Badge>{rank}등</Badge>
                    <Input placeholder="상품/쿠폰/포인트" className="flex-1" />
                    <Input type="number" placeholder="원가 (₩)" className="w-32" />
                  </div>
                </Card>
              ))}
            </div>
            <Card className="p-6 bg-blue-50">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">총 예산 (자동 계산)</span>
                  <span className="text-gray-900">₩2,500,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">리워드 제한 (1회)</span>
                  <span className="text-gray-900">₩3,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">리워드 제한 (1일)</span>
                  <span className="text-gray-900">₩5,000</span>
                </div>
              </div>
            </Card>
            <div>
              <Label>유효 기간</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Input type="date" />
                <Input type="date" />
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">7등 설정 (파트너 리워드 슬롯)</h2>
              <p className="text-gray-600">파트너사 리워드를 설정하세요</p>
            </div>
            <Card className="p-6 bg-orange-50 border-orange-200">
              <div className="flex items-start gap-3 mb-4">
                <Badge variant="outline">7등</Badge>
                <div className="flex-1">
                  <p className="text-gray-900 mb-2">파트너사 리워드 슬롯</p>
                  <p className="text-gray-700">파트너사가 이용시 파트너사 상품 우선 제공</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>파트너 선택</Label>
                  <Input placeholder="파트너사를 선택하세요" />
                </div>
                <div className="text-gray-600">
                  이 슬롯은 파트너사의 상품이 자동으로 노출됩니다.
                </div>
              </div>
            </Card>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900 mb-2">미리보기 및 제출</h2>
              <p className="text-gray-600">캠페인을 최종 확인하고 제출하세요</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">컵홀더 시안</h3>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-500">시안 미리보기</p>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">랜딩페이지</h3>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-500">페이지 미리보기</p>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-gray-900 mb-4">QR 코드</h3>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-500">QR 미리보기</p>
                </div>
              </Card>
            </div>
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-gray-900">캠페인 준비 완료</p>
                  <p className="text-gray-600">제출 후 관리자 승인을 기다립니다 (최대 1-2 영업일)</p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-4">새 캠페인 생성</h1>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-gray-600">
            <span>단계 {currentStep} / {totalSteps}</span>
            <span>{steps[currentStep - 1]}</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
      </div>

      <div className="mb-8">
        {renderStepContent()}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          이전
        </Button>
        <Button onClick={nextStep}>
          {currentStep === totalSteps ? '제출하기' : '다음'}
          {currentStep < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
