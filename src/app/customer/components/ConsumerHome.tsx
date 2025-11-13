import { Ticket, Coins, Package, ChevronRight, QrCode } from 'lucide-react';
import { motion } from 'motion/react';

interface ConsumerHomeProps {
  onQRScan: () => void;
}

const mockCampaigns = [
  { id: 1, name: '스타벅스 신제품 체험', date: '2025.11.10', reward: '아메리카노 쿠폰' },
  { id: 2, name: '올리브영 립밤 캠페인', date: '2025.11.09', reward: '립밤 1개' },
  { id: 3, name: '투썸플레이스 이벤트', date: '2025.11.08', reward: '사이즈업 쿠폰' },
];

export function ConsumerHome({ onQRScan }: ConsumerHomeProps) {
  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1>마이페이지</h1>
          <button
            onClick={onQRScan}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <QrCode className="w-5 h-5" />
            QR 스캔하기
          </button>
        </div>

        {/* ① 요약 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="w-6 h-6 text-blue-600" />
              <span className="text-gray-600">내 쿠폰</span>
            </div>
            <p className="text-blue-600">12개</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-6 h-6 text-yellow-600" />
              <span className="text-gray-600">내 포인트</span>
            </div>
            <p className="text-yellow-600">8,500 P</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6 text-green-600" />
              <span className="text-gray-600">배송중</span>
            </div>
            <p className="text-green-600">3건</p>
          </motion.div>
        </div>

        {/* ② 플랫폼 광고 배너 1 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-8 mb-8 text-white"
        >
          <h3 className="text-white mb-2">🎁 신규 회원 특별 혜택</h3>
          <p className="text-purple-100 mb-4">지금 가입하고 5,000P 받아가세요!</p>
          <button className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50">
            자세히 보기
          </button>
        </motion.div>

        {/* ③ 최근 참여 캠페인 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2>최근 참여 캠페인</h2>
            <button className="text-blue-600 flex items-center gap-1">
              전체보기
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {mockCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <h4 className="text-gray-900 mb-1">{campaign.name}</h4>
                  <p className="text-gray-500">{campaign.date}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    {campaign.reward}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ④ 플랫폼 광고 배너 2 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-8 text-white"
        >
          <h3 className="text-white mb-2">☕ 파트너 카페 할인 이벤트</h3>
          <p className="text-blue-100 mb-4">전국 제휴 카페에서 사용 가능한 쿠폰을 받아보세요!</p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50">
            쿠폰 받기
          </button>
        </motion.div>
      </div>
    </div>
  );
}
