'use client';

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';

/* ================================
   상수: 슬라이더 텍스트/설정
=================================== */
const SLIDE_TITLES = ['생활속 광고', '파트너에게', '광고주에게', '모두에게'];
const SLIDE_DESCS = [
  '인구통계·성별·연령 등의 정교한 조건으로 원하는 타겟을 설정할 수 있어요.',
  '자영업자로 살아남기 어려운 세상, 컵홀더로 힘듦의 무게를 덜 수 있도록.',
  '가장 가까운 곳, 나만의 광고가 모두의 손 안에서 시작될 수 있습니다.',
  '새로운 연결을 추구하는 공간, 우리는 위드폼 입니다.',
];
const AUTOPLAY_INTERVAL = 5000;

/* ================================
   페이지 컴포넌트
=================================== */
export default function Page() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slidesLength = SLIDE_TITLES.length;
  // 브라우저/Node 환경 호환 안전 타입
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 모바일 메뉴
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdMenuOpen, setIsAdMenuOpen] = useState(false);
  const [isCommOpen, setIsCommOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((p) => !p);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsAdMenuOpen(false);
    setIsCommOpen(false);
  };

  // 메뉴 열릴 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // 슬라이더 이동
  const go = useCallback(
    (n: number) => {
      setCurrentSlideIndex((n + slidesLength) % slidesLength);
    },
    [slidesLength]
  );
  const next = useCallback(() => go(currentSlideIndex + 1), [currentSlideIndex, go]);
  const prev = useCallback(() => go(currentSlideIndex - 1), [currentSlideIndex, go]);

  // 페이지 효과(리빌)
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    if ('scrollRestoration' in history) (history as any).scrollRestoration = 'manual';
    const onLoad = () => {
      document.documentElement.style.scrollBehavior = 'smooth';
    };
    window.addEventListener('load', onLoad);

    const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              (e.target as HTMLElement).classList.add('active');
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add('active'));
    }
    // reduce-motion 대비 강제 활성화
    setTimeout(() => {
      reveals.forEach((el) => el.classList.add('active'));
    }, 600);

    return () => window.removeEventListener('load', onLoad);
  }, []);

  // 자동재생
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  // 슬라이드 목록 + 폴백
  const SLIDES = useMemo(
    () => [
      { src: '/assets/images/ads/slide1.png', speed: '0.06' },
      { src: '/assets/images/ads/slide2.png', speed: '0.08' },
      { src: '/assets/images/ads/slide3.png', speed: '0.05' },
      { src: '/assets/images/ads/slide4.png', speed: '0.07' },
    ],
    []
  );
  const FALLBACK_IMG = '/assets/images/ads/slide4.png';

  return (
    <>
      {/* 전역 보조 스타일 (영상 관련 셀렉터 제거됨) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html{scroll-behavior:smooth;}
          .reveal{opacity:0; transform:translateY(12px); transition:opacity .5s ease, transform .5s ease;}
          .reveal.active{opacity:1; transform:translateY(0);}
          .parallax{will-change:transform;}
          a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid #3b82f6; outline-offset:2px;}
        `,
        }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded shadow"
      >
        본문 바로가기
      </a>

      {/* ================= HEADER ================= */}
      <header
        id="site-header"
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-200"
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="#hero" className="flex items-center gap-3" aria-label="위드폼 홈으로">
              <img
                src="/assets/images/logo/withfom-logo-horizontal.png"
                alt="위드폼 With FoM 로고"
                className="h-[40px] md:h-[60px] w-auto"
              />
            </a>

            {/* 데스크톱 내비 */}
            <nav className="hidden md:flex items-center gap-6 text-gray-800">
              <div className="relative group">
                <button className="py-2 font-medium hover:text-blue-600" aria-haspopup="true">
                  광고매체
                </button>
                <div className="absolute left-0 top-full mt-2 min-w-[220px] p-3 bg-white border border-neutral-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <ul className="space-y-1">
                    <li>
                      <a href="#pro-modes" className="block rounded-lg px-3 py-2 hover:bg-neutral-100" role="menuitem">
                        컵홀더 광고
                      </a>
                    </li>
                    <li>
                      <a href="/delivery.html" className="block rounded-lg px-3 py-2 hover:bg-neutral-100" role="menuitem">
                        배달박스 광고
                      </a>
                    </li>
                    <li>
                      <a href="/bag.html" className="block rounded-lg px-3 py-2 hover:bg-neutral-100" role="menuitem">
                        포장봉투 광고
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <a href="/guide" className="py-2 font-medium hover:text-blue-600">
                이용가이드
              </a>
              <div className="relative group">
                <button className="py-2 font-medium hover:text-blue-600" aria-haspopup="true">
                  커뮤니티
                </button>
                <div className="absolute left-0 top-full mt-2 min-w-[220px] p-3 bg-white border border-neutral-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <ul className="space-y-1">
                    <li>
                      <a href="#" className="block rounded-lg px-3 py-2 hover:bg-neutral-100" role="menuitem">
                        공지사항
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block rounded-lg px-3 py-2 hover:bg-neutral-100" role="menuitem">
                        Q&amp;A
                      </a>
                    </li>
                    <li>
                      <a href="#" className="block rounded-lg px-3 py-2 hover:bg-neutral-100" role="menuitem">
                        EVENT
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          {/* 우측 버튼 + 모바일 햄버거 */}
          <div className="flex items-center gap-3">
            <a
              href="/consumer/login"
              onClick={closeMenu}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold hidden md:inline-flex"
            >
              로그인
            </a>
            <a
              href="/partner/login"
              onClick={closeMenu}
              className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-900 font-semibold hidden md:inline-flex"
            >
              파트너사 페이지
            </a>
            <a
              href="/Advertiser/login"
              onClick={closeMenu}
              className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-900 font-semibold hidden md:inline-flex"
            >
              광고주 페이지
            </a>
            <a
              href="/Administrator/login"
              onClick={closeMenu}
              className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-900 font-semibold hidden md:inline-flex"
            >
              관리자 페이지
            </a>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
              aria-label="메뉴 열기/닫기"
              aria-expanded={isMenuOpen}
              aria-controls="mobileMenuPanel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="h-[72px]" />

      {/* ===== 모바일 메뉴 오버레이 ===== */}
      <div
        className={`fixed inset-0 top-[72px] bg-black/40 z-[65] md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        id="mobileMenuPanel"
        className={`fixed inset-0 top-[72px] bg-white z-[70] md:hidden overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
      >
        <div className="p-6">
          <nav className="flex flex-col gap-1 text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-4">
            {/* 광고매체 아코디언 */}
            <div className="border-b border-neutral-100">
              <button
                onClick={() => setIsAdMenuOpen((prev) => !prev)}
                className="flex justify-between items-center w-full py-3 hover:text-blue-600"
                aria-expanded={isAdMenuOpen}
              >
                광고매체
                <span className={`transition-transform duration-200 ${isAdMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-[max-height,opacity] duration-300"
                style={{ maxHeight: isAdMenuOpen ? '500px' : 0, opacity: isAdMenuOpen ? 1 : 0 }}
              >
                <div className="space-y-1 pt-2">
                  <a
                    href="#pro-modes"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-600 hover:bg-neutral-100"
                  >
                    컵홀더 광고
                  </a>
                  <a
                    href="/delivery.html"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-600 hover:bg-neutral-100"
                  >
                    배달박스 광고
                  </a>
                  <a
                    href="/bag.html"
                    onClick={closeMenu}
                    onKeyDown={(e) => e.key === 'Enter' && closeMenu()}
                    className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-600 hover:bg-neutral-100"
                  >
                    포장봉투 광고
                  </a>
                </div>
              </div>
            </div>

            <a href="/guide" onClick={closeMenu} className="py-3 hover:text-blue-600 border-b border-neutral-100">
              이용가이드
            </a>

            {/* 커뮤니티 아코디언 */}
            <div className="border-b border-neutral-100">
              <button
                onClick={() => setIsCommOpen((prev) => !prev)}
                className="flex justify-between items-center w-full py-3 hover:text-blue-600"
                aria-expanded={isCommOpen}
              >
                커뮤니티
                <span className={`transition-transform duration-200 ${isCommOpen ? 'rotate-90' : 'rotate-0'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-[max-height,opacity] duration-300"
                style={{ maxHeight: isCommOpen ? '500px' : 0, opacity: isCommOpen ? 1 : 0 }}
              >
                <div className="space-y-1 pt-2">
                  <a
                    href="#"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-600 hover:bg-neutral-100"
                  >
                    공지사항
                  </a>
                  <a
                    href="#"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-600 hover:bg-neutral-100"
                  >
                    Q&amp;A
                  </a>
                  <a
                    href="#"
                    onClick={closeMenu}
                    className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-600 hover:bg-neutral-100"
                  >
                    EVENT
                  </a>
                </div>
              </div>
            </div>
          </nav>

          {/* 하단 버튼 */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <a
              href="/consumer/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[.99] transition"
            >
              로그인
            </a>
            <a
              href="/partner/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-3 rounded-md bg-neutral-900 text-white font-semibold hover:bg-neutral-800 active:scale-[.99] transition"
            >
              파트너사 페이지
            </a>
            <a
              href="/Advertiser/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-3 rounded-md bg-neutral-900 text-white font-semibold hover:bg-neutral-800 active:scale-[.99] transition"
            >
              광고주 페이지
            </a>
            <a
              href="/Administrator/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-3 rounded-md bg-neutral-900 text-white font-semibold hover:bg-neutral-800 active:scale-[.99] transition"
            >
              관리자 페이지
            </a>
          </div>
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <main id="main" className="bg-white text-neutral-900">
        {/* HERO */}
        <section id="hero" className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
          {/* 포스터 이미지 (영상 제거) */}
          <img
            src="/assets/images/hero/banner.png"
            alt="위드폼 배너"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" aria-hidden="true"></div>

          <div className="relative z-10 text-white">
            <div className="mx-auto max-w-[min(92vw,960px)] text-center flex flex-col items-center">
              <h1 className="font-extrabold tracking-tight text-[clamp(22px,5vw,46px)] leading-tight md:leading-[1.1] mb-6 reveal">
                <span className="block">일상에 스며드는 밀착형 생활광고,</span>
                <span className="block opacity-95">커피 한 잔이 브랜드의 첫인상이 됩니다</span>
              </h1>
              <a
                href="#ad-products"
                onClick={closeMenu}
                className="inline-flex mx-auto mt-2 bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 reveal"
              >
                지금바로 시작하기
              </a>
            </div>
          </div>
        </section>

        {/* 전문가모드(슬라이더) */}
        <section id="pro-modes" className="scroll-mt-[90px] relative mx-auto max-w-[1600px] px-6 lg:px-12 mt-24 md:mt-32 mb-16">
          <div className="mb-6">
            <div className="flex items-center gap-2 reveal">
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-neutral-900">컵홀더광고</h2>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500">
                →
              </span>
            </div>
            <p className="mt-3 text-neutral-600 text-[15px] md:text-base reveal">
              일상에 스며드는 똑똑한 생활광고를 원하시는 광고주분들에게 추천드리는 광고입니다.
            </p>
            <div className="mt-4 flex items-center gap-2 reveal">
              <span className="px-3 py-1 rounded-full text-[13px] bg-neutral-100 text-neutral-700">지역광고</span>
              <span className="px-3 py-1 rounded-full text-[13px] bg-neutral-100 text-neutral-700">정밀타겟광고</span>
            </div>
          </div>

          {/* 슬라이더 */}
          <div
            id="pmCarousel"
            className="relative bg-neutral-100/60 rounded-3xl p-4 md:p-8 min-h-[420px] md:min-h-[460px] overflow-hidden reveal"
            tabIndex={0}
          >
            <button
              onClick={prev}
              className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-10 text-2xl text-neutral-400 hover:text-neutral-600"
              aria-label="이전"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-10 text-2xl text-neutral-400 hover:text-neutral-600"
              aria-label="다음"
            >
              ›
            </button>

            <div id="pmTrack" className="absolute inset-0" suppressHydrationWarning>
              {SLIDES.map((slide, idx) => (
                <article
                  key={idx}
                  className={`pm-slide absolute inset-0 transition-opacity duration-500 parallax ${
                    currentSlideIndex === idx ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                  data-parallax
                  data-speed={slide.speed}
                >
                  {/* 스켈레톤 */}
                  <div className="absolute inset-0 bg-neutral-200 rounded-2xl" aria-hidden />
                  <img
                    src={slide.src}
                    alt={`컵홀더광고 ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      // 폴백에서도 에러가 나면 루프 방지
                      if (img.src.endsWith('slide4.png')) return;
                      img.src = FALLBACK_IMG;
                    }}
                    className="relative w-full h-full object-cover rounded-2xl"
                  />
                </article>
              ))}
            </div>
          </div>

          {/* 페이저 */}
          <div className="mt-6 flex items-center gap-3 reveal">
            {SLIDE_TITLES.map((_, index) => (
              <button
                key={index}
                onClick={() => go(index)}
                className={`h-10 w-10 rounded-lg border text-[15px] font-semibold transition ${
                  currentSlideIndex === index
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
                aria-selected={currentSlideIndex === index}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* 캡션 */}
          <div className="mt-6 reveal">
            <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-900">{SLIDE_TITLES[currentSlideIndex]}</h3>
            <p className="mt-2 text-neutral-500 text-lg md:text-xl">{SLIDE_DESCS[currentSlideIndex]}</p>
          </div>
        </section>

        {/* 광고 상품 */}
        <section id="ad-products" className="relative mx-auto max-w-[1600px] px-6 lg:px-12 mt-10 md:mt-12 mb-24">
          <div className="mb-6 md:mb-10 reveal">
            <div className="text-[15px] font-semibold text-blue-500 mb-2">광고 상품</div>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
              위드폼이기에 가능한
              <br className="hidden md:block" />
              원하는 타겟형광고
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <article
              className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden reveal"
              style={{ transitionDelay: '.02s' }}
            >
              <div className="bg-[#EAF3EE] h-[380px] md:h-[440px] flex items-center justify-center">
                <img
                  src="/assets/images/ads/holder1.png"
                  alt="브랜딩 광고 미리보기"
                  className="h-[85%] w-auto object-contain rounded-xl pointer-events-none"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-900">브랜딩 광고</h3>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-500">
                    →
                  </span>
                </div>
                <p className="mt-3 text-neutral-600 text-[15px] md:text-base">나만의 브랜드를 홍보하고 싶은 광고주분들에게</p>
                <div className="mt-5 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[13px] bg-neutral-100 text-neutral-700">브랜드홍보</span>
                  <span className="px-3 py-1 rounded-full text-[13px] bg-neutral-100 text-neutral-700">브랜드노출</span>
                </div>
              </div>
            </article>

            <article
              className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden reveal"
              style={{ transitionDelay: '.12s' }}
            >
              <div className="bg-[#EAF3EE] h-[380px] md:h-[440px] flex items-center justify-center">
                <img
                  src="/assets/images/ads/holder2.png"
                  alt="마케팅 광고 미리보기"
                  className="h-[85%] w-auto object-contain rounded-xl pointer-events-none"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-neutral-900">마케팅 광고</h3>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-300 text-neutral-500">
                    →
                  </span>
                </div>
                <p className="mt-3 text-neutral-600 text-[15px] md:text-base">식당부터 기업까지 제품판매가 목적인 광고주분들에게</p>
                <div className="mt-5 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[13px] bg-neutral-100 text-neutral-700">제품판매 및 홍보</span>
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-neutral-100">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12 py-12">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-neutral-700 reveal">
            <li><a href="#" className="hover:underline">유튜브</a></li>
            <li><a href="#" className="hover:underline">네이버 블로그</a></li>
            <li><a href="#" className="hover:underline">카카오 채널</a></li>
            <li><a href="#" className="hover:underline">인스타그램</a></li>
          </ul>
          <div className="mt-6 space-y-2 text-sm leading-relaxed text-neutral-500 reveal">
            <p>Copyright © With FoM Inc.</p>
            <p>
              (주)퍼스트오브메이 | 대표 김은수 | 사업자등록번호 000-00-00000 | 통신판매업신고번호 0000-경기파주-0000 | 호스팅 사업자 Amazon Web
              Service(AWS)
            </p>
            <p>주소 경기 파주시 청석로272, 10층 1004-106호 (동패동,센타프라자1) | 전화 문의 031-935-5715</p>
          </div>
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600 reveal">
            <li><a href="#" className="hover:underline">개인정보처리방침</a></li>
            <li><a href="#" className="hover:underline">이용약관</a></li>
            <li><a href="#" className="hover:underline">광고 운영정책</a></li>
            <li><a href="#" className="hover:underline">상품판매 운영정책</a></li>
          </ul>
        </div>
      </footer>

      {/* 플로팅 챗봇 버튼 */}
      <button id="chatbotBtn" className="fixed bottom-6 right-6 z-[60] p-0" aria-label="챗봇 열기">
        <img
          src="/assets/images/icons/챗봇.png"
          alt="챗봇"
          className="w-[72px] h-[72px] object-contain select-none pointer-events-none transition-transform duration-200 [clip-path:circle(40%)] [filter:drop-shadow(0_6px_18px_rgba(0,0,0,.25))]"
        />
      </button>
    </>
  );
}
