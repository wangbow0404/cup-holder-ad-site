import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, Settings as SettingsIcon } from 'lucide-react';

interface Reward {
  id: string;
  type: 'product' | 'coupon' | 'point';
  name: string;
  quantity: string;
  validDays: string;
}

interface RewardSlot {
  id: number;
  rewardName: string;
  probability: string;
}

export function RewardSettings() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [rewards, setRewards] = useState<Reward[]>([
    { id: '1', type: 'coupon', name: '무료 사이즈업', quantity: '10000', validDays: '30' }
  ]);
  const [dailyLimit, setDailyLimit] = useState('100');
  const [perPersonLimit, setPerPersonLimit] = useState('1');
  const [slots, setSlots] = useState<RewardSlot[]>([
    { id: 1, rewardName: '무료 사이즈업', probability: '10' },
    { id: 2, rewardName: '', probability: '0' },
  ]);

  const addReward = () => {
    if (rewards.length >= 3) {
      alert('최대 3개의 리워드만 설정할 수 있습니다.');
      return;
    }
    setRewards([
      ...rewards,
      { id: Date.now().toString(), type: 'coupon', name: '', quantity: '', validDays: '30' }
    ]);
  };

  const removeReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id));
  };

  const updateReward = (id: string, field: keyof Reward, value: string) => {
    setRewards(rewards.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addSlot = () => {
    if (slots.length >= 6) {
      alert('최대 6개의 슬롯만 설정할 수 있습니다.');
      return;
    }
    setSlots([...slots, { id: Date.now(), rewardName: '', probability: '0' }]);
  };

  const removeSlot = (id: number) => {
    setSlots(slots.filter(s => s.id !== id));
  };

  const updateSlot = (id: number, field: keyof RewardSlot, value: string) => {
    setSlots(slots.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const totalProbability = slots.reduce((sum, slot) => sum + (parseFloat(slot.probability) || 0), 0);

  const getRewardTypeName = (type: string) => {
    switch (type) {
      case 'product': return '제품';
      case 'coupon': return '쿠폰';
      case 'point': return '포인트';
      default: return type;
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">리워드 설정</h1>
        <p className="text-gray-600">매장의 리워드 시스템을 설정하세요</p>
      </div>

      {/* 리워드 참여 On/Off */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-1">리워드 참여</h2>
            <p className="text-sm text-gray-600">리워드 시스템 참여 여부를 설정합니다</p>
          </div>
          <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>
      </div>

      {isEnabled && (
        <>
          {/* 리워드 설정 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900">리워드 설정 (최대 2~3종)</h2>
              <Button 
                onClick={addReward} 
                variant="outline" 
                size="sm"
                disabled={rewards.length >= 3}
              >
                <Plus className="w-4 h-4 mr-2" />
                리워드 추가
              </Button>
            </div>

            <div className="space-y-4">
              {rewards.map((reward, index) => (
                <div key={reward.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-gray-900">리워드 #{index + 1}</h3>
                    {rewards.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReward(reward.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`type-${reward.id}`}>유형</Label>
                      <Select 
                        value={reward.type} 
                        onValueChange={(value) => updateReward(reward.id, 'type', value)}
                      >
                        <SelectTrigger id={`type-${reward.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product">제품</SelectItem>
                          <SelectItem value="coupon">쿠폰</SelectItem>
                          <SelectItem value="point">포인트</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`name-${reward.id}`}>리워드명</Label>
                      <Input
                        id={`name-${reward.id}`}
                        value={reward.name}
                        onChange={(e) => updateReward(reward.id, 'name', e.target.value)}
                        placeholder="예: 무료 사이즈업"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`quantity-${reward.id}`}>총 수량</Label>
                      <Input
                        id={`quantity-${reward.id}`}
                        type="number"
                        value={reward.quantity}
                        onChange={(e) => updateReward(reward.id, 'quantity', e.target.value)}
                        placeholder="만 단위"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`valid-${reward.id}`}>유효 기간</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`valid-${reward.id}`}
                          type="number"
                          value={reward.validDays}
                          onChange={(e) => updateReward(reward.id, 'validDays', e.target.value)}
                        />
                        <span className="text-gray-600">일</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 제한 설정 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-gray-900 mb-4">제한 설정</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daily-limit">1일 사용 제한</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="daily-limit"
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                  />
                  <span className="text-gray-600">회</span>
                </div>
              </div>

              <div>
                <Label htmlFor="person-limit">1인당 사용 제한</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="person-limit"
                    type="number"
                    value={perPersonLimit}
                    onChange={(e) => setPerPersonLimit(e.target.value)}
                  />
                  <span className="text-gray-600">회</span>
                </div>
              </div>
            </div>
          </div>

          {/* 확률 설정 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-gray-900 mb-1">확률 설정 (1~6 슬롯)</h2>
                <p className="text-sm text-gray-600">
                  총 확률: <span className={totalProbability === 100 ? 'text-green-600' : 'text-red-600'}>
                    {totalProbability}%
                  </span>
                  {totalProbability !== 100 && ' (총합이 100%가 되어야 합니다)'}
                </p>
              </div>
              <Button 
                onClick={addSlot} 
                variant="outline" 
                size="sm"
                disabled={slots.length >= 6}
              >
                <Plus className="w-4 h-4 mr-2" />
                슬롯 추가
              </Button>
            </div>

            <div className="space-y-3">
              {slots.map((slot, index) => (
                <div key={slot.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                    {index + 1}
                  </div>
                  
                  <Select 
                    value={slot.rewardName} 
                    onValueChange={(value) => updateSlot(slot.id, 'rewardName', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="리워드 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {rewards.map(reward => (
                        <SelectItem key={reward.id} value={reward.name}>
                          {reward.name || '이름 없음'} ({getRewardTypeName(reward.type)})
                        </SelectItem>
                      ))}
                      <SelectItem value="empty">꽝</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2 w-32">
                    <Input
                      type="number"
                      value={slot.probability}
                      onChange={(e) => updateSlot(slot.id, 'probability', e.target.value)}
                      className="w-20"
                      min="0"
                      max="100"
                    />
                    <span className="text-gray-600">%</span>
                  </div>

                  {slots.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSlot(slot.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full" disabled={totalProbability !== 100}>
              설정 저장
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
