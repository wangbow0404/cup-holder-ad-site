import { useState } from 'react';
import { PartnerData } from '../page';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { CheckCircle } from 'lucide-react';

interface DailyReportProps {
  partnerData: PartnerData;
  setPartnerData: (data: PartnerData) => void;
}

export function DailyReport({ partnerData, setPartnerData }: DailyReportProps) {
  const [quantity, setQuantity] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const yesterdayQuantity = 120; // Mock data

  const handleSubmit = () => {
    const numQuantity = parseInt(quantity);
    
    if (!numQuantity || numQuantity <= 0) {
      alert('유효한 수량을 입력해주세요.');
      return;
    }

    // 전일 대비 200% 초과 검사
    const increaseRate = ((numQuantity - yesterdayQuantity) / yesterdayQuantity) * 100;
    
    if (increaseRate > 200) {
      setShowConfirmDialog(true);
    } else {
      submitReport();
    }
  };

  const submitReport = () => {
    setShowConfirmDialog(false);
    setPartnerData({
      ...partnerData,
      dailyReportCompleted: true,
    });
    setShowSuccessDialog(true);
    setQuantity('');
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">일일 소진 보고</h1>
        <p className="text-gray-600">오늘 사용된 컵홀더 수량을 보고해주세요</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-700">전일 소진량</p>
            <p className="text-gray-900">{yesterdayQuantity}개</p>
          </div>
          <div className="h-px bg-gray-200" />
        </div>

        <div className="mb-6">
          <label className="block text-gray-900 mb-2">
            오늘 소진량 <span className="text-red-600">*</span>
          </label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="정수를 입력하세요"
            className="text-lg"
          />
          <p className="text-sm text-gray-500 mt-2">
            전일 대비 200% 초과 시 확인창이 표시됩니다
          </p>
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={!quantity || partnerData.dailyReportCompleted}
        >
          {partnerData.dailyReportCompleted ? '보고 완료' : '제출'}
        </Button>
      </div>

      {partnerData.dailyReportCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-900">오늘의 일일 소진 보고가 완료되었습니다</p>
              <p className="text-sm text-green-700">내일 다시 보고해주세요</p>
            </div>
          </div>
        </div>
      )}

      {/* 200% 초과 확인 다이얼로그 */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>수량 확인</AlertDialogTitle>
            <AlertDialogDescription>
              입력하신 수량이 전일 대비 200%를 초과합니다.
              <br />
              전일: {yesterdayQuantity}개 → 오늘: {quantity}개
              <br /><br />
              정말 이 수량으로 보고하시겠습니까?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={submitReport}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 성공 다이얼로그 */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>보고 완료</AlertDialogTitle>
            <AlertDialogDescription>
              일일 소진 보고가 성공적으로 제출되었습니다.
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
