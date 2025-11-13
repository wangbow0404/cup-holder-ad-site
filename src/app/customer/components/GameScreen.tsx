import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Users } from 'lucide-react';

interface GameScreenProps {
  style: { bg: string; accent: string; text: string };
  onComplete: (result: { prize: string; rank: number }) => void;
}

const recentWinners = [
  { name: '김**', prize: 'OO 립밤', time: '방금 전' },
  { name: '이**', prize: 'XX카페 쿠폰', time: '1분 전' },
  { name: '박**', prize: 'OO 립밤', time: '3분 전' },
  { name: '최**', prize: 'YY카페 쿠폰', time: '5분 전' },
  { name: '정**', prize: 'OO 립밤', time: '7분 전' },
];

const prizes = [
  { rank: 1, name: 'OO 립밤 (로즈 핑크)', probability: 0.1 },
  { rank: 2, name: 'OO 립밤 (코랄)', probability: 0.1 },
  { rank: 3, name: 'XX 포인트 1000P', probability: 0.15 },
  { rank: 4, name: 'XX 포인트 500P', probability: 0.2 },
  { rank: 5, name: 'XX 포인트 300P', probability: 0.2 },
  { rank: 6, name: 'XX 포인트 100P', probability: 0.2 },
  { rank: 7, name: 'XX카페 사이즈업', probability: 0.05 },
];

export function GameScreen({ style, onComplete }: GameScreenProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [attempts, setAttempts] = useState(1);

  // 실시간 당첨자 롤링 (5초 간격)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinnerIndex((prev) => (prev + 1) % recentWinners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = () => {
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
      // 랜덤 당첨 결과 생성
      const random = Math.random();
      let cumulative = 0;
      let selectedPrize = prizes[prizes.length - 1];

      for (const prize of prizes) {
        cumulative += prize.probability;
        if (random <= cumulative) {
          selectedPrize = prize;
          break;
        }
      }

      onComplete({ prize: selectedPrize.name, rank: selectedPrize.rank });
    }, 3000);
  };

  const handleInviteFriend = () => {
    alert('친구 초대 링크가 복사되었습니다!');
    setAttempts(attempts + 1);
  };

  return (
    <div className={`min-h-screen ${style.bg} p-4`}>
      <div className="max-w-2xl mx-auto pt-8">
        {/* 실시간 당첨자 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">실시간 당첨자</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWinnerIndex}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex justify-between items-center"
            >
              <span className="text-gray-900">{recentWinners[currentWinnerIndex].name}</span>
              <span className={style.text}>{recentWinners[currentWinnerIndex].prize}</span>
              <span className="text-gray-500">{recentWinners[currentWinnerIndex].time}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 룰렛 게임 */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-center mb-8">행운의 룰렛</h2>

          {/* 룰렛 그래픽 */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <motion.div
              animate={{ rotate: isSpinning ? 360 * 5 : 0 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="w-full h-full rounded-full border-8 border-gray-200 relative overflow-hidden"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  #ef4444 0deg 51.4deg,
                  #f59e0b 51.4deg 102.8deg,
                  #10b981 102.8deg 154.2deg,
                  #3b82f6 154.2deg 205.6deg,
                  #8b5cf6 205.6deg 257deg,
                  #ec4899 257deg 308.4deg,
                  #06b6d4 308.4deg 360deg
                )`,
              }}
            >
              {/* 중앙 버튼 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Gift className="w-10 h-10 text-gray-700" />
                </button>
              </div>
            </motion.div>
            {/* 포인터 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-red-500"></div>
            </div>
          </div>

          {/* 참여 정보 */}
          <div className="text-center mb-6">
            <p className="text-gray-600">남은 기회: <span className={style.text}>{attempts}회</span></p>
          </div>

          {/* 친구 초대 */}
          <button
            onClick={handleInviteFriend}
            className="w-full border-2 border-dashed border-gray-300 text-gray-700 py-3 rounded-lg hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            친구 초대하고 1회 기회 더 받기
          </button>
        </div>

        {/* 경품 리스트 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6 border border-gray-200">
          <h3 className="text-gray-900 mb-4">경품 안내</h3>
          <div className="space-y-2">
            {prizes.map((prize) => (
              <div key={prize.rank} className="flex justify-between items-center text-gray-600">
                <span>{prize.rank}등</span>
                <span>{prize.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
