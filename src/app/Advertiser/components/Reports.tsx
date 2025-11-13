import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Download, Lock } from 'lucide-react';

export function Reports() {
  const reports = [
    {
      id: 1,
      name: '여름 스킨케어 캠페인',
      type: 'summary',
      version: 'v.3',
      lastUpdate: '2025-11-10',
      price: 0,
      available: true
    },
    {
      id: 2,
      name: '여름 스킨케어 캠페인 - 상세 리포트',
      type: 'detailed',
      version: 'v.2',
      lastUpdate: '2025-11-08',
      price: 9900,
      available: false
    },
    {
      id: 3,
      name: '여름 스킨케어 캠페인 - 교차 리포트',
      type: 'cross',
      version: 'v.1',
      lastUpdate: '2025-11-05',
      price: 29000,
      available: false
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">리포트</h1>
        <p className="text-gray-600">캠페인 성과 리포트를 확인하고 다운로드하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <FileText className="w-8 h-8 text-blue-600 mb-3" />
          <p className="text-gray-900 mb-1">요약 리포트</p>
          <p className="text-gray-600 mb-2">기본 성과 지표 및 요약</p>
          <Badge>무료</Badge>
        </Card>

        <Card className="p-6">
          <FileText className="w-8 h-8 text-purple-600 mb-3" />
          <p className="text-gray-900 mb-1">상세 리포트</p>
          <p className="text-gray-600 mb-2">상세한 분석 및 인사이트</p>
          <Badge variant="secondary">₩9,900</Badge>
        </Card>

        <Card className="p-6">
          <FileText className="w-8 h-8 text-orange-600 mb-3" />
          <p className="text-gray-900 mb-1">교차 리포트</p>
          <p className="text-gray-600 mb-2">다차원 교차 분석</p>
          <Badge variant="secondary">₩29,000</Badge>
        </Card>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="w-6 h-6 text-gray-600" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-900">{report.name}</p>
                    <Badge variant="outline">{report.version}</Badge>
                  </div>
                  <p className="text-gray-600">마지막 업데이트: {report.lastUpdate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {report.available ? (
                  <>
                    <Badge>무료</Badge>
                    <Button size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      다운로드
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-900">₩{report.price.toLocaleString()}</p>
                    <Button size="sm" className="gap-2">
                      <Lock className="w-4 h-4" />
                      구매하기
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
