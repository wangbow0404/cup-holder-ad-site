import { useState } from 'react';
import { Button } from './ui/button';
import { Camera, CheckCircle, XCircle, Scan } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

interface ScanResult {
  success: boolean;
  couponName?: string;
  customerName?: string;
  expiryDate?: string;
  error?: string;
}

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  const startScanning = () => {
    setIsScanning(true);
    
    // 실제 환경에서는 카메라를 활성화하고 QR 코드를 스캔합니다
    // 여기서는 데모를 위해 2초 후 임시 결과를 표시합니다
    setTimeout(() => {
      const mockResult: ScanResult = Math.random() > 0.2 
        ? {
            success: true,
            couponName: '무료 사이즈업',
            customerName: '김철수',
            expiryDate: '2025-12-15',
          }
        : {
            success: false,
            error: '이미 사용된 쿠폰입니다',
          };
      
      setScanResult(mockResult);
      setShowResultDialog(true);
      setIsScanning(false);
    }, 2000);
  };

  const handleClose = () => {
    setShowResultDialog(false);
    setScanResult(null);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">쿠폰 사용 처리</h1>
        <p className="text-gray-600">소비자의 쿠폰 QR 코드를 스캔하여 사용 처리하세요</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* 스캐너 영역 */}
        <div className="aspect-square bg-gray-900 relative flex items-center justify-center">
          {isScanning ? (
            <div className="text-center">
              <div className="w-64 h-64 border-4 border-blue-500 rounded-lg relative animate-pulse">
                <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 animate-scan" />
              </div>
              <p className="text-white mt-6">QR 코드를 스캔 중입니다...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
                <Camera className="w-16 h-16 text-gray-600" />
              </div>
              <p className="text-gray-400">카메라 준비됨</p>
            </div>
          )}
        </div>

        {/* 컨트롤 영역 */}
        <div className="p-6">
          <Button 
            onClick={startScanning} 
            disabled={isScanning}
            className="w-full h-14"
          >
            <Scan className="w-5 h-5 mr-2" />
            {isScanning ? '스캔 중...' : 'QR 코드 스캔 시작'}
          </Button>

          {/* 사용 안내 */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-blue-900 mb-2">사용 방법</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. 소비자에게 쿠폰 QR 코드를 제시하도록 요청하세요</li>
              <li>2. "QR 코드 스캔 시작" 버튼을 클릭하세요</li>
              <li>3. QR 코드를 카메라에 맞추세요</li>
              <li>4. 자동으로 인식되어 사용 처리됩니다</li>
            </ol>
          </div>

          {/* 최근 사용 내역 */}
          <div className="mt-6">
            <h3 className="text-gray-900 mb-3">최근 사용 내역</h3>
            <div className="space-y-2">
              {[
                { name: '무료 사이즈업', customer: '이영희', time: '5분 전' },
                { name: '무료 음료', customer: '박민수', time: '12분 전' },
                { name: '무료 사이즈업', customer: '최지원', time: '25분 전' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-gray-900 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.customer}</p>
                  </div>
                  <div className="text-right">
                    <CheckCircle className="w-5 h-5 text-green-600 inline-block mb-1" />
                    <p className="text-xs text-gray-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 결과 다이얼로그 */}
      <AlertDialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              {scanResult?.success ? (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-10 h-10 text-red-600" />
                </div>
              )}
            </div>
            <AlertDialogTitle className="text-center">
              {scanResult?.success ? '쿠폰 사용 완료' : '사용 실패'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {scanResult?.success ? (
                <div className="space-y-2">
                  <p><span className="text-gray-900">쿠폰:</span> {scanResult.couponName}</p>
                  <p><span className="text-gray-900">고객명:</span> {scanResult.customerName}</p>
                  <p><span className="text-gray-900">유효기간:</span> {scanResult.expiryDate}</p>
                  <p className="text-green-600 mt-4">쿠폰이 정상적으로 사용 처리되었습니다.</p>
                </div>
              ) : (
                <p className="text-red-600">{scanResult?.error}</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleClose}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: calc(100% - 4px); }
          100% { top: 0; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
