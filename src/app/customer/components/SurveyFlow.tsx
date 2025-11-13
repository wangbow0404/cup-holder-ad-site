import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface SurveyFlowProps {
  style: { bg: string; accent: string; text: string };
  onComplete: (product: string) => void;
}

const surveyQuestions = [
  {
    id: 1,
    question: '평소 립 제품을 얼마나 자주 사용하시나요?',
    options: ['매일', '주 3-4회', '가끔', '거의 안 함'],
  },
  {
    id: 2,
    question: '선호하는 립 제품의 질감은?',
    options: ['매트', '글로시', '벨벳', '상관없음'],
  },
  {
    id: 3,
    question: '주로 선호하는 컬러는?',
    options: ['레드/핑크', '코랄/오렌지', '누드/베이지', '기타'],
  },
  {
    id: 4,
    question: '립 제품 선택 시 가장 중요한 요소는?',
    options: ['지속력', '보습력', '발색', '가격'],
  },
  {
    id: 5,
    question: '선호하는 가격대는?',
    options: ['1만원 이하', '1-2만원', '2-3만원', '3만원 이상'],
  },
];

export function SurveyFlow({ style, onComplete }: SurveyFlowProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < surveyQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 설문 완료 - 제품 추천
      onComplete('OO 립밤 (로즈 핑크)');
    }
  };

  const question = surveyQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / surveyQuestions.length) * 100;

  return (
    <div className={`min-h-screen ${style.bg} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        {/* 진행 바 */}
        <div className="mb-8">
          <div className="flex justify-between text-gray-600 mb-2">
            <span>질문 {currentQuestion + 1} / {surveyQuestions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${style.accent} h-2 rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 질문 */}
        <h2 className="mb-6">{question.question}</h2>

        {/* 옵션 */}
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="w-full flex items-center justify-between px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-current hover:bg-gray-50 transition-all group"
            >
              <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
