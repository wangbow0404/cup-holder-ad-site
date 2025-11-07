import './globals.css';

export const metadata = {
  title: '위드폼 | With FoM',
  description: '일상에 스며드는 밀착형 생활광고',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="bg-white">
      {/* 배경 검정 방지: 최소 높이 + 흰 배경 */}
      <body className="min-h-screen bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
