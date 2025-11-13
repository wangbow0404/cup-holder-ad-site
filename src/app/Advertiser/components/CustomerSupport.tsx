import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { MessageSquare } from 'lucide-react';

export function CustomerSupport() {
  const inquiries = [
    {
      id: 1,
      customer: '김**',
      subject: '배송 문의',
      content: '주문한지 3일이 지났는데 아직 발송이 안되었다고 나오네요. 언제쯤 받을 수 있을까요?',
      date: '2025-11-11 14:30',
      status: 'new',
      order: '#1001'
    },
    {
      id: 2,
      customer: '이**',
      subject: '제품 사용법 문의',
      content: '에센스와 크림 사용 순서가 궁금합니다. 아침 저녁 모두 사용해도 될까요?',
      date: '2025-11-10 16:20',
      status: 'new',
      order: null
    },
    {
      id: 3,
      customer: '박**',
      subject: '교환/반품 문의',
      content: '제품을 받았는데 용기가 파손되어 있어요. 교환 가능한가요?',
      date: '2025-11-09 11:15',
      status: 'answered',
      order: '#998',
      answer: '불편을 드려 죄송합니다. 즉시 새 제품으로 교환 발송해드리겠습니다. 파손된 제품은 반송하지 않으셔도 됩니다.'
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">고객 문의 (CS)</h1>
        <p className="text-gray-600">고객 문의를 확인하고 답변하세요</p>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-900">{inquiry.subject}</p>
                    <Badge variant="outline">{inquiry.customer}</Badge>
                    {inquiry.order && (
                      <Badge variant="secondary">{inquiry.order}</Badge>
                    )}
                  </div>
                  <p className="text-gray-600">{inquiry.date}</p>
                </div>
              </div>
              {inquiry.status === 'new' ? (
                <Badge variant="destructive">미답변</Badge>
              ) : (
                <Badge>답변 완료</Badge>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700">{inquiry.content}</p>
            </div>

            {inquiry.status === 'answered' ? (
              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-600 mb-1">답변</p>
                <p className="text-gray-700">{inquiry.answer}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea placeholder="답변을 작성하세요..." rows={4} />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">임시 저장</Button>
                  <Button size="sm">답변하기</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
