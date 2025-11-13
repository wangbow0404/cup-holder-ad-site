import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Star } from 'lucide-react';
import { Badge } from './ui/badge';

export function ReviewManagement() {
  const reviews = [
    { 
      id: 1, 
      product: '프리미엄 스킨케어 세트', 
      customer: '김**', 
      rating: 5, 
      content: '정말 만족스러워요! 피부가 촉촉해지고 화사해진 느낌입니다. 향도 좋고 흡수도 빨라서 아침에 쓰기 좋네요.', 
      date: '2025-11-10',
      replied: false
    },
    { 
      id: 2, 
      product: '데일리 선크림 50+', 
      customer: '이**', 
      rating: 4, 
      content: '백탁 현상 없고 가볍게 발리는게 좋아요. 다만 가격이 조금 부담되네요.', 
      date: '2025-11-09',
      replied: true,
      reply: '소중한 리뷰 감사합니다. 품질 좋은 제품으로 보답하겠습니다!'
    },
    { 
      id: 3, 
      product: '수분 에센스 100ml', 
      customer: '박**', 
      rating: 5, 
      content: '건성 피부에 딱이에요. 수분감이 오래 지속되고 메이크업 전에 바르면 화장도 잘 먹어요.', 
      date: '2025-11-08',
      replied: false
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-gray-900 mb-2">리뷰 관리</h1>
        <p className="text-gray-600">고객 리뷰를 확인하고 답글을 작성하세요</p>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-gray-900">{review.product}</p>
                  <Badge variant="outline">{review.customer}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 ml-2">{review.date}</span>
                </div>
              </div>
              {review.replied && (
                <Badge>답글 완료</Badge>
              )}
            </div>

            <p className="text-gray-700 mb-4">{review.content}</p>

            {review.replied ? (
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-600 mb-1">광고주 답글</p>
                <p className="text-gray-700">{review.reply}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Textarea placeholder="답글을 작성하세요..." rows={3} />
                <div className="flex justify-end">
                  <Button size="sm">답글 작성</Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
