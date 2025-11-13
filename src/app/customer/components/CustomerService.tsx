import { Bell, MessageCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

type Tab = 'notice' | 'chatbot' | 'report';

const mockNotices = [
  { id: 1, title: '시스템 점검 안내', date: '2025.11.10' },
  { id: 2, title: '신규 파트너 입점 안내', date: '2025.11.08' },
  { id: 3, title: '개인정보 처리방침 개정 안내', date: '2025.11.05' },
];

export function CustomerService() {
  const [activeTab, setActiveTab] = useState<Tab>('notice');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: '안녕하세요! SARAH입니다. 무엇을 도와드릴까요?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const tabs = [
    { id: 'notice' as Tab, label: '공지사항', icon: Bell },
    { id: 'chatbot' as Tab, label: '챗봇 상담 (SARAH)', icon: MessageCircle },
    { id: 'report' as Tab, label: 'CS 신고하기', icon: AlertTriangle },
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      { id: chatMessages.length + 1, sender: 'user', text: inputMessage },
      { id: chatMessages.length + 2, sender: 'bot', text: '문의하신 내용을 확인 중입니다. 잠시만 기다려주세요.' },
    ]);
    setInputMessage('');
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-8">고객센터</h1>

        {/* 탭 메뉴 */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 공지사항 */}
        {activeTab === 'notice' && (
          <div className="space-y-3">
            {mockNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-gray-900">{notice.title}</h3>
                <span className="text-gray-500">{notice.date}</span>
              </div>
            ))}
          </div>
        )}

        {/* 챗봇 상담 */}
        {activeTab === 'chatbot' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">SARAH</h3>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  전송
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CS 신고하기 */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">신고 유형</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>불량 컵홀더</option>
                  <option>QR 코드 오류</option>
                  <option>어뷰징 의심</option>
                  <option>기타</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">신고 내용</label>
                <textarea
                  rows={6}
                  placeholder="신고 내용을 상세히 작성해주세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">첨부 파일 (선택)</label>
                <input
                  type="file"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                신고 접수하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
