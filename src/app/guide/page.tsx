'use client';

import React, { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    // ===== 0) 초기 스크롤 동작 (새로고침 시 최상단) =====
    document.documentElement.style.scrollBehavior = 'auto';
    if ('scrollRestoration' in history) (history as any).scrollRestoration = 'manual';
    const onDom = () => {
      if (location.hash) history.replaceState?.(null, '', location.pathname + location.search);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };
    const onLoad = () => { document.documentElement.style.scrollBehavior = 'smooth'; };
    window.addEventListener('DOMContentLoaded', onDom);
    window.addEventListener('load', onLoad);

    // ===== 1) Reveal 애니메이션 =====
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add('active');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );
      targets.forEach((t) => io.observe(t));
    } else {
      targets.forEach((t) => t.classList.add('active'));
    }

    // ===== 2) 챗봇 버튼 =====
    const onChat = () => alert('챗봇 서비스가 준비중입니다! 🤖');
    const chatBtn = document.getElementById('chatbotBtn');
    chatBtn?.addEventListener('click', onChat);

    // ===== cleanup =====
    return () => {
      window.removeEventListener('DOMContentLoaded', onDom);
      window.removeEventListener('load', onLoad);
      chatBtn?.removeEventListener('click', onChat);
    };
  }, []);

  return (
    <>
      {/* ====== 페이지 전역 스타일 (가이드 전용) ====== */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .fly-wrap{ position:relative }
        .fly-panel{
          position:absolute; left:0; top:100%;
          min-width:220px; padding:12px;
          background:#fff; border:1px solid #e5e7eb; border-radius:12px;
          box-shadow:0 8px 24px rgba(0,0,0,.08);
          opacity:0; visibility:hidden; transform:translateY(6px);
          transition:opacity .18s ease, transform .18s ease, visibility .18s;
          z-index:50;
        }
        .fly-wrap:hover .fly-panel,
        .fly-wrap:focus-within .fly-panel{ opacity:1; visibility:visible; transform:translateY(0) }
        .fly-bridge{ position:absolute; left:-12px; right:-12px; top:100%; height:14px; pointer-events:auto; }

        a:focus-visible, button:focus-visible { outline:2px solid #3b82f6; outline-offset:2px; }
        html { scroll-behavior:smooth; }
        #chatbotBtn{ background:transparent; border:0; box-shadow:none; cursor:pointer; }

        .reveal { opacity:0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; will-change: opacity, transform; }
        .reveal.active { opacity:1; transform: translateY(0); }

        @media (prefers-reduced-motion: reduce){
          * { scroll-behavior:auto !important; }
          .reveal, .reveal.active { opacity:1 !important; transform:none !important; }
        }
      `,
        }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded shadow"
      >
        본문 바로가기
      </a>

      {/* ===== HEADER (메인과 동일 톤) ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3" aria-label="위드폼 홈으로">
              <img
                src="/assets/images/logo/withfom-logo-horizontal.png"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    '/assets/images/logo/withfom-logo-horizontal.png')
                }
                alt="위드폼 With FoM 로고"
                className="h-[48px] md:h-[56px] w-auto"
              />
            </a>

            <nav className="hidden md:flex items-center gap-6 text-gray-800">
              <div className="fly-wrap">
                <button
                  className="py-2 font-medium hover:text-blue-600"
                  aria-haspopup="true"
                  aria-expanded={false}
                >
                  광고매체
                </button>
                <div className="fly-bridge" aria-hidden="true"></div>
                <div className="fly-panel" role="menu" aria-label="광고매체 하위메뉴">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="/#pro-modes"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                        role="menuitem"
                      >
                        컵홀더 광고
                      </a>
                    </li>
                    <li>
                      <a
                        href="/delivery.html"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                        role="menuitem"
                      >
                        배달박스 광고
                      </a>
                    </li>
                    <li>
                      <a
                        href="/bag.html"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                        role="menuitem"
                      >
                        포장봉투 광고
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 이 페이지에서는 현재 탭 표시 */}
              <a href="/guide" className="py-2 font-medium text-blue-600">
                이용가이드
              </a>

              <div className="fly-wrap">
                <button
                  className="py-2 font-medium hover:text-blue-600"
                  aria-haspopup="true"
                  aria-expanded={false}
                >
                  커뮤니티
                </button>
                <div className="fly-bridge" aria-hidden="true"></div>
                <div className="fly-panel" role="menu" aria-label="커뮤니티 하위메뉴">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                        role="menuitem"
                      >
                        공지사항
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                        role="menuitem"
                      >
                        Q&amp;A
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100"
                        role="menuitem"
                      >
                        EVENT
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/#estimate"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold"
            >
              시작하기
            </a>
            <a
              href="/partner/login.html"
              className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-900 font-semibold"
            >
              파트너사 페이지
            </a>
          </div>
        </div>
      </header>

      {/* 헤더 보정 스페이서 */}
      <div className="h-[72px]" />

      {/* ===== MAIN ===== */}
      <main id="main" className="bg-white text-neutral-900">
        {/* HERO 배너 */}
        <section className="relative">
          <img
            src="/assets/images/hero/banner.jpg"
            alt="이용가이드 배너"
            className="w-full h-[220px] md:h-[300px] object-cover"
          />

          {/* 돋보기 아이콘 */}
          <img
            src="/assets/images/icons/돋보기.png"
            alt=""
            aria-hidden="true"
            className="absolute left-6 md:left-10 bottom-[-48px] md:bottom-[-80px] w-[96px] h-[96px] md:w-[150px] md:h-[150px] object-contain drop-shadow-md"
          />
        </section>

        {/* 타이틀 섹션 */}
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-12 pt-10 md:pt-12 pb-6">
            <h1 className="text-[32px] md:text-[56px] font-extrabold tracking-tight leading-[1.12]">
              이용가이드
            </h1>
            <div className="mt-3 flex items-center gap-2 text-neutral-700">
              <span className="inline-flex items-center gap-2 text-sm md:text-base font-semibold">
                위드폼 광고 서비스를 시작하기 어려운 광고주분들에게
              </span>
            </div>
          </div>
        </section>

        {/* 본문 안내 이미지 */}
        <section className="min-h-[60vh] md:min-h-[72vh] flex items-center justify-center bg-white">
          <img
            src="/assets/images/ads/005.jpg"
            alt="위드폼 이용가이드 본문 미리보기"
            className="max-h-[84vh] w-auto object-contain rounded-xl shadow-md reveal"
          />
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-neutral-100">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12 py-12">
          <ul
            className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-neutral-700 reveal"
            data-anim="fade-up"
          >
            <li>
              <a href="#" className="hover:underline">
                유튜브
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                네이버 블로그
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                카카오 채널
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                인스타그램
              </a>
            </li>
          </ul>
          <div className="mt-6 space-y-2 text-sm leading-relaxed text-neutral-500 reveal">
            <p>Copyright © With FoM Inc.</p>
            <p>
              (주)위드폼 | 대표 김은수 | 사업자등록번호 000-00-00000 | 통신판매업신고번호
              0000-경기파주-0000 | 호스팅 사업자 Amazon Web Service(AWS)
            </p>
            <p>주소 경기 파주시 청석로272, 10층 1004-106호 (동패동,센타프라자1) | 전화 문의 031-935-5715</p>
          </div>
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600 reveal">
            <li>
              <a href="#" className="hover:underline">
                개인정보처리방침
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                이용약관
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                광고 운영정책
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                상품판매 운영정책
              </a>
            </li>
          </ul>
        </div>
      </footer>

      {/* ===== Floating Chatbot Button ===== */}
      <button id="chatbotBtn" className="fixed bottom-6 right-6 z-[60] p-0" aria-label="챗봇 열기">
        <img
          src="/assets/images/icons/챗봇.png"
          alt="챗봇"
          className="w-[72px] h-[72px] object-contain select-none pointer-events-none transition-transform duration-200
                     [clip-path:circle(40%)]
                     [filter:drop-shadow(0_6px_18px_rgba(0,0,0,.25))]"
        />
      </button>
    </>
  );
}
