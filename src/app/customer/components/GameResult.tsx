import { motion } from 'motion/react';
import { PartyPopper } from 'lucide-react';

interface GameResultProps {
  style: { bg: string; accent: string; text: string };
  result: { prize: string; rank: number };
  onSignup: () => void;
}

export function GameResult({ style, result, onSignup }: GameResultProps) {
  return (
    <div className={`min-h-screen ${style.bg} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 0.8 }}
        >
          <PartyPopper className={`w-20 h-20 ${style.text} mx-auto mb-4`} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="mb-2">축하합니다!</h1>
          <p className="text-gray-600 mb-6">{result.rank}등에 당첨되셨습니다!</p>

          <div className={`${style.accent} text-white py-8 px-6 rounded-lg mb-8`}>
            <h2 className="text-white mb-2">🎁</h2>
            <h3 className="text-white">{result.prize}</h3>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              ⚠️ 당첨된 <span>{result.prize}</span>을(를) 수령하시려면
              <br />
              회원가입(로그인)이 필요합니다.
            </p>
          </div>

          <button
            onClick={onSignup}
            className={`w-full ${style.accent} text-white py-4 rounded-lg hover:opacity-90`}
          >
            회원가입하고 받기
          </button>
        </motion.div>
      </div>
    </div>
  );
}
