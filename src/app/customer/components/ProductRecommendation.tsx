import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface ProductRecommendationProps {
  style: { bg: string; accent: string; text: string };
  product: string;
  onNext: () => void;
}

export function ProductRecommendation({ style, product, onNext }: ProductRecommendationProps) {
  return (
    <div className={`min-h-screen ${style.bg} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <Sparkles className={`w-16 h-16 ${style.text} mx-auto mb-4`} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="mb-4">당신에게는</h1>
          <div className={`${style.accent} text-white py-6 px-8 rounded-lg mb-6`}>
            <h2 className="text-white">{product}</h2>
            <p className="text-white/90 mt-2">을(를) 추천합니다!</p>
          </div>

          <p className="text-gray-600 mb-8">
            당신의 답변을 분석한 결과, 이 제품이 가장 잘 어울려요!
          </p>

          <button
            onClick={onNext}
            className={`w-full ${style.accent} text-white py-4 rounded-lg hover:opacity-90`}
          >
            다음 단계로
          </button>
        </motion.div>
      </div>
    </div>
  );
}
