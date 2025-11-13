import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';

interface BeveragePrice {
  name: string;
  price: string;
}

export function StoreSettings() {
  const [businessArea, setBusinessArea] = useState('gangnam');
  const [openTime, setOpenTime] = useState('08:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [targetCustomers, setTargetCustomers] = useState<string[]>(['20s', 'office']);
  const [beverages, setBeverages] = useState<BeveragePrice[]>([
    { name: '아메리카노', price: '4500' },
    { name: '카페라떼', price: '5000' },
    { name: '카푸치노', price: '5000' },
  ]);

  const customerGroups = [
    { id: '10s', label: '10대' },
    { id: '20s', label: '20대' },
    { id: '30s', label: '30대' },
    { id: '40s', label: '40대' },
    { id: 'office', label: '직장인' },
    { id: 'student', label: '학생' },
    { id: 'parents', label: '학부모' },
  ];

  const toggleCustomerGroup = (id: string) => {
    if (targetCustomers.includes(id)) {
      setTargetCustomers(targetCustomers.filter(g => g !== id));
    } else {
      if (targetCustomers.length >= 5) {
        alert('최대 5개까지 선택 가능합니다.');
        return;
      }
      setTargetCustomers([...targetCustomers, id]);
    }
  };

  const updateBeverage = (index: number, field: keyof BeveragePrice, value: string) => {
    const updated = [...beverages];
    updated[index] = { ...updated[index], [field]: value };
    setBeverages(updated);
  };

  const handleSave = () => {
    if (targetCustomers.length < 2) {
      alert('주 고객층은 최소 2개 이상 선택해야 합니다.');
      return;
    }

    alert('매장 정보가 저장되었습니다.');
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">매장 정보 수정</h1>
        <p className="text-gray-600">매장의 기본 정보를 관리하세요</p>
      </div>

      <div className="space-y-6">
        {/* 상권 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-4">상권</h2>
          
          <div>
            <Label htmlFor="business-area">상권 분류</Label>
            <Select value={businessArea} onValueChange={setBusinessArea}>
              <SelectTrigger id="business-area">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gangnam">강남 비즈니스 지구</SelectItem>
                <SelectItem value="hongdae">홍대 상권</SelectItem>
                <SelectItem value="itaewon">이태원 상권</SelectItem>
                <SelectItem value="jamsil">잠실 상권</SelectItem>
                <SelectItem value="residential">주거 지역</SelectItem>
                <SelectItem value="university">대학가</SelectItem>
                <SelectItem value="commercial">상업 지구</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 영업시간 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-4">영업시간</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="open-time">오픈 시간</Label>
              <Input
                id="open-time"
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="close-time">마감 시간</Label>
              <Input
                id="close-time"
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
              />
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            현재 영업시간: {openTime} - {closeTime}
          </p>
        </div>

        {/* 주 고객층 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-4">주 고객층</h2>
          <p className="text-sm text-gray-600 mb-4">
            2~5개를 선택해주세요 (현재: {targetCustomers.length}개 선택)
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {customerGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleCustomerGroup(group.id)}
              >
                <Checkbox
                  id={group.id}
                  checked={targetCustomers.includes(group.id)}
                  onCheckedChange={() => toggleCustomerGroup(group.id)}
                />
                <label
                  htmlFor={group.id}
                  className="flex-1 cursor-pointer"
                >
                  {group.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* 음료 가격 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-4">음료 3종 가격</h2>
          <p className="text-sm text-gray-600 mb-4">
            대표 음료 3종의 가격을 설정해주세요
          </p>
          
          <div className="space-y-4">
            {beverages.map((beverage, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`beverage-name-${index}`}>음료명</Label>
                  <Input
                    id={`beverage-name-${index}`}
                    value={beverage.name}
                    onChange={(e) => updateBeverage(index, 'name', e.target.value)}
                    placeholder="음료명 입력"
                  />
                </div>
                <div>
                  <Label htmlFor={`beverage-price-${index}`}>가격 (원)</Label>
                  <Input
                    id={`beverage-price-${index}`}
                    type="number"
                    value={beverage.price}
                    onChange={(e) => updateBeverage(index, 'price', e.target.value)}
                    placeholder="가격 입력"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 설정된 가격은 리워드 가치 산정 및 통계에 활용됩니다
            </p>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            저장하기
          </Button>
          <Button variant="outline" className="flex-1">
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}
