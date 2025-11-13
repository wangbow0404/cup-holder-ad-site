import { useState } from 'react';
import { PartnerData } from '../page';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Package, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface InventoryOrderProps {
  partnerData: PartnerData;
  setPartnerData: (data: PartnerData) => void;
}

export function InventoryOrder({ partnerData, setPartnerData }: InventoryOrderProps) {
  const [orderQuantity, setOrderQuantity] = useState('');
  const [threshold, setThreshold] = useState([30]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const currentInventory = 3500; // Mock current inventory count
  const maxInventory = 10000; // Mock max capacity

  const handleOrder = () => {
    if (!orderQuantity || parseInt(orderQuantity) <= 0) {
      alert('유효한 수량을 입력해주세요.');
      return;
    }

    setShowSuccessDialog(true);
    setOrderQuantity('');
  };

  const handleQuickOrder = (percentage: number) => {
    const targetInventory = Math.floor(maxInventory * (percentage / 100));
    const neededQuantity = Math.max(0, targetInventory - currentInventory);
    setOrderQuantity(neededQuantity.toString());
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">컵홀더 발주</h1>
        <p className="text-gray-600">재고 현황을 확인하고 발주를 신청하세요</p>
      </div>

      {/* 현재 재고 현황 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">현재 재고 현황</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">현재 재고</p>
            <p className="text-gray-900">{currentInventory.toLocaleString()}개</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 mb-1">재고율</p>
            <p className={partnerData.inventoryLevel <= 30 ? 'text-orange-600' : 'text-green-600'}>
              {partnerData.inventoryLevel}%
            </p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">재고 진행률</span>
            <span className="text-sm text-gray-600">
              {currentInventory.toLocaleString()} / {maxInventory.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all ${
                partnerData.inventoryLevel <= 30 ? 'bg-orange-600' : 'bg-green-600'
              }`}
              style={{ width: `${partnerData.inventoryLevel}%` }}
            />
          </div>
        </div>

        {partnerData.inventoryLevel <= 30 && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-700">
              재고가 30% 이하입니다. 발주를 권장합니다.
            </p>
          </div>
        )}
      </div>

      {/* 발주 신청 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-gray-900 mb-4">발주 신청</h2>

        <div className="mb-6">
          <Label htmlFor="order-quantity" className="mb-2">
            발주 수량
          </Label>
          <Input
            id="order-quantity"
            type="number"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(e.target.value)}
            placeholder="발주할 수량을 입력하세요"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-700 mb-3">분할 발주 (빠른 선택)</p>
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={() => handleQuickOrder(50)}
              className="h-auto py-3 flex flex-col items-center"
            >
              <Package className="w-5 h-5 mb-1" />
              <span className="text-sm">50%까지</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQuickOrder(75)}
              className="h-auto py-3 flex flex-col items-center"
            >
              <Package className="w-5 h-5 mb-1" />
              <span className="text-sm">75%까지</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleQuickOrder(100)}
              className="h-auto py-3 flex flex-col items-center"
            >
              <Package className="w-5 h-5 mb-1" />
              <span className="text-sm">100%까지</span>
            </Button>
          </div>
        </div>

        <Button onClick={handleOrder} className="w-full">
          발주 신청
        </Button>
      </div>

      {/* 자동 발주 임계치 설정 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-4">자동 발주 임계치 설정</h2>
        <p className="text-sm text-gray-600 mb-4">
          재고가 설정한 임계치 이하로 떨어지면 알림을 받습니다
        </p>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <Label>임계치</Label>
            <span className="text-blue-600">{threshold[0]}%</span>
          </div>
          <Slider
            value={threshold}
            onValueChange={setThreshold}
            min={20}
            max={40}
            step={5}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>20%</span>
            <span>40%</span>
          </div>
        </div>

        <p className="text-sm text-gray-500">
          현재 재고가 {threshold[0]}% 이하로 떨어지면 발주 알림을 받게 됩니다
        </p>
      </div>

      {/* 발주 성공 다이얼로그 */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>발주 신청 완료</AlertDialogTitle>
            <AlertDialogDescription>
              컵홀더 발주가 성공적으로 신청되었습니다.
              <br />
              승인 후 2-3일 내에 배송될 예정입니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
