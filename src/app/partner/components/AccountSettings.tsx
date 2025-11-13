import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { PartnerData } from '../page';
import { CheckCircle } from 'lucide-react';

interface AccountSettingsProps {
  partnerData: PartnerData;
}

export function AccountSettings({ partnerData }: AccountSettingsProps) {
  const [bank, setBank] = useState('kb');
  const [accountNumber, setAccountNumber] = useState('123-456-789012');
  const [accountHolder, setAccountHolder] = useState('스타벅스 강남점');
  const [showSuccess, setShowSuccess] = useState(false);

  const isPlatinum = partnerData.tier === 'platinum';

  const handleSave = () => {
    if (!bank || !accountNumber || !accountHolder) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">정산 계좌</h1>
        <p className="text-gray-600">
          {isPlatinum ? '인센티브 정산받을 계좌를 관리하세요' : '정산 계좌를 관리하세요'}
        </p>
      </div>

      {/* 등급 안내 */}
      {!isPlatinum && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-6">
          <h3 className="text-orange-900 mb-2">안내</h3>
          <p className="text-sm text-orange-700">
            플래티넘 등급 파트너만 인센티브 정산 계좌를 사용할 수 있습니다.
            <br />
            현재 등급: <span className="uppercase">{partnerData.tier}</span>
          </p>
        </div>
      )}

      {isPlatinum && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-6">
          <h3 className="text-purple-900 mb-2">플래티넘 혜택</h3>
          <p className="text-sm text-purple-700">
            플래티넘 등급 파트너로서 개당 10원의 인센티브가 이 계좌로 정산됩니다.
            <br />
            매월 말일 정산 후 익월 5일에 자동으로 입금됩니다.
          </p>
        </div>
      )}

      {/* 계좌 정보 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">계좌 정보</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="bank">은행</Label>
            <Select value={bank} onValueChange={setBank} disabled={!isPlatinum}>
              <SelectTrigger id="bank">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kb">국민은행</SelectItem>
                <SelectItem value="shinhan">신한은행</SelectItem>
                <SelectItem value="woori">우리은행</SelectItem>
                <SelectItem value="hana">하나은행</SelectItem>
                <SelectItem value="nh">농협은행</SelectItem>
                <SelectItem value="ibk">기업은행</SelectItem>
                <SelectItem value="sc">SC제일은행</SelectItem>
                <SelectItem value="kakao">카카오뱅크</SelectItem>
                <SelectItem value="kbank">케이뱅크</SelectItem>
                <SelectItem value="toss">토스뱅크</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="account-number">계좌번호</Label>
            <Input
              id="account-number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="계좌번호를 입력하세요"
              disabled={!isPlatinum}
            />
            <p className="text-sm text-gray-500 mt-1">
              '-' 없이 숫자만 입력해주세요
            </p>
          </div>

          <div>
            <Label htmlFor="account-holder">예금주</Label>
            <Input
              id="account-holder"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="예금주명을 입력하세요"
              disabled={!isPlatinum}
            />
          </div>
        </div>

        {showSuccess && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-700">계좌 정보가 성공적으로 저장되었습니다</p>
            </div>
          </div>
        )}
      </div>

      {/* 정산 안내 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">정산 안내</h2>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <p className="text-gray-900">정산 계산</p>
              <p className="text-gray-600">매월 말일 기준으로 당월 인센티브를 계산합니다</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <p className="text-gray-900">정산 확인</p>
              <p className="text-gray-600">익월 1~3일 사이 정산 내역을 확인하실 수 있습니다</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <p className="text-gray-900">입금 처리</p>
              <p className="text-gray-600">익월 5일에 등록된 계좌로 자동 입금됩니다</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <p className="text-gray-900">이의 신청</p>
              <p className="text-gray-600">정산 내역 확인 후 7일 이내 이의 신청이 가능합니다</p>
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="flex gap-3">
        <Button 
          onClick={handleSave} 
          className="flex-1"
          disabled={!isPlatinum}
        >
          저장하기
        </Button>
        <Button variant="outline" className="flex-1">
          취소
        </Button>
      </div>
    </div>
  );
}
