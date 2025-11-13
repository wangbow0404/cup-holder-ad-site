import { useState } from 'react';
import { SurveyFlow } from './SurveyFlow';
import { ProductRecommendation } from './ProductRecommendation';
import { GameScreen } from './GameScreen';
import { GameResult } from './GameResult';

type FlowStep = 'landing' | 'survey' | 'recommendation' | 'game-intro' | 'game' | 'result' | 'signup';

interface QRScanFlowProps {
  onLogin: () => void;
}

export function QRScanFlow({ onLogin }: QRScanFlowProps) {
  const [step, setStep] = useState<FlowStep>('landing');
  const [userProfile] = useState({
    gender: '여성',
    age: '20대',
    region: '서울',
  });
  const [templateStyle] = useState<1 | 2 | 3 | 4>(1); // AI 자동 분기로 선택된 템플릿
  const [recommendedProduct, setRecommendedProduct] = useState('');
  const [gameResult, setGameResult] = useState<{ prize: string; rank: number } | null>(null);

  // 템플릿 스타일 적용
  const getTemplateStyles = () => {
    const styles = {
      1: { bg: 'bg-pink-50', accent: 'bg-pink-500', text: 'text-pink-600' },
      2: { bg: 'bg-blue-50', accent: 'bg-blue-500', text: 'text-blue-600' },
      3: { bg: 'bg-purple-50', accent: 'bg-purple-500', text: 'text-purple-600' },
      4: { bg: 'bg-green-50', accent: 'bg-green-500', text: 'text-green-600' },
    };
    return styles[templateStyle];
  };

  const style = getTemplateStyles();

  const handleSurveyComplete = (product: string) => {
    setRecommendedProduct(product);
    setStep('recommendation');
  };

  const handleGameComplete = (result: { prize: string; rank: number }) => {
    setGameResult(result);
    setStep('result');
  };

  const handleSignup = () => {
    setStep('signup');
  };

  const handleFinalLogin = () => {
    onLogin();
  };

  // 랜딩 페이지
  if (step === 'landing') {
    return (
      <div className={`min-h-screen ${style.bg} flex items-center justify-center p-4`}>
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${style.accent} rounded-full mx-auto mb-4`}></div>
            <h1 className={style.text}>환영합니다!</h1>
            <p className="text-gray-600 mt-2">
              AI가 분석한 당신의 프로필: {userProfile.gender} / {userProfile.age} / {userProfile.region}
            </p>
          </div>
          <button
            onClick={() => setStep('survey')}
            className={`w-full ${style.accent} text-white py-4 rounded-lg hover:opacity-90`}
          >
            캠페인 참여하기
          </button>
        </div>
      </div>
    );
  }

  // 설문/콘텐츠
  if (step === 'survey') {
    return <SurveyFlow style={style} onComplete={handleSurveyComplete} />;
  }

  // 제품 추천
  if (step === 'recommendation') {
    return <ProductRecommendation style={style} product={recommendedProduct} onNext={() => setStep('game-intro')} />;
  }

  // 게임 유도
  if (step === 'game-intro') {
    return (
      <div className={`min-h-screen ${style.bg} flex items-center justify-center p-4`}>
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h1 className={`${style.text} mb-4`}>🎁</h1>
          <h2 className="mb-4">이 제품을 무료로 받을 기회!</h2>
          <p className="text-gray-600 mb-8">
            지금 게임에 참여하고 {recommendedProduct}을(를) 받아가세요!
          </p>
          <button
            onClick={() => setStep('game')}
            className={`w-full ${style.accent} text-white py-4 rounded-lg hover:opacity-90`}
          >
            게임 참여하기
          </button>
        </div>
      </div>
    );
  }

  // 게임 실행
  if (step === 'game') {
    return <GameScreen style={style} onComplete={handleGameComplete} />;
  }

  // 결과 공개
  if (step === 'result') {
    return <GameResult style={style} result={gameResult!} onSignup={handleSignup} />;
  }

  // 회원가입 벽
  if (step === 'signup') {
    return (
      <div className={`min-h-screen ${style.bg} flex items-center justify-center p-4`}>
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h2 className="mb-4 text-center">🎉 당첨을 축하드립니다!</h2>
          <p className="text-gray-600 mb-6 text-center">
            당첨된 <span className={style.text}>{gameResult?.prize}</span>을(를) 수령하시려면
            <br />
            회원가입(로그인)이 필요합니다.
          </p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="이름"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="이메일"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="전화번호"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <input type="checkbox" id="defaultAddress" defaultChecked className="mt-1" />
                <label htmlFor="defaultAddress" className="text-gray-700">
                  기본 배송지 사용
                </label>
              </div>
              <input
                type="text"
                placeholder="배송지 주소"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleFinalLogin}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-4 rounded-lg"
            >
              카카오톡으로 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
