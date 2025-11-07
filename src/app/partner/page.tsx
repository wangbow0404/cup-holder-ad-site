'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

/* ===== (공통 이펙트용) ===== */
const AUTOPLAY_INTERVAL = 5000;

export default function Page() {
  /* ========= 헤더/모바일 메뉴 ========= */
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdMenuOpen, setIsAdMenuOpen] = useState(false);
  const [isCommOpen, setIsCommOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(v => !v);
  const closeMenu = () => { setIsMenuOpen(false); setIsAdMenuOpen(false); setIsCommOpen(false); };

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  /* ========= 파트너 입력 폼 상태/규정 ========= */
  const MC_MIN = 2, MC_MAX = 5;       // 주 고객층
  const AREA_MIN = 2, AREA_MAX = 4;   // 주변 상권
  const AGE_MIN = 1, AGE_MAX = 3;     // 연령대(최대 3개 선택)

  const CUSTOMER_OPTIONS = [
    '직장인','대학생','고등학생','중학생','초등(보호자)',
    '커플','프리랜서','가족/학부모','여행객','외국인','노인층'
  ];
  const AREA_OPTIONS = ['주거','오피스','상가','학교','관광지','역세권'];

  // ✅ 추가: 연령대 옵션
  const AGE_OPTIONS = ['10~20대', '20~30대', '30~40대', '40~50대', '50대 이상'];

  const [inputs, setInputs] = useState({
    cupHolderType: 'full' as 'full' | 'mix',
    mainCustomerTypes: [] as string[],
    areaTypes: [] as string[],
    ageGroups: [] as string[],          // ✅ 추가
    avgDrinkPrice: 5000,
    dailyTakeout: 500,
  });

  // 체크박스 핸들러(최대치 도달 시 추가 선택 차단)
  const toggleInArray = (
    group: 'mainCustomerTypes' | 'areaTypes' | 'ageGroups', // ✅ 확장
    item: string,
    max: number
  ) => {
    setInputs(prev => {
      const cur = prev[group] as string[];
      const selected = cur.includes(item);
      if (selected) {
        return { ...prev, [group]: cur.filter(v => v !== item) };
      } else {
        if (cur.length >= max) return prev; // 더 이상 추가 불가
        return { ...prev, [group]: [...cur, item] };
      }
    });
  };

  const mcCount = inputs.mainCustomerTypes.length;
  const areaCount = inputs.areaTypes.length;
  const ageCount = inputs.ageGroups.length; // ✅ 추가

  const isMcDisabled = (opt: string) =>
    !inputs.mainCustomerTypes.includes(opt) && mcCount >= MC_MAX;

  const isAreaDisabled = (opt: string) =>
    !inputs.areaTypes.includes(opt) && areaCount >= AREA_MAX;

  const isAgeDisabled = (opt: string) => // ✅ 추가
    !inputs.ageGroups.includes(opt) && ageCount >= AGE_MAX;

  // 숫자 보정
  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
  const snap500 = (n: number) => Math.round(n / 500) * 500;

  const onBlurPrice = () => {
    setInputs(p => {
      const v = Number.isFinite(p.avgDrinkPrice) ? p.avgDrinkPrice : 0;
      return { ...p, avgDrinkPrice: clamp(snap500(v), 1000, 20000) };
    });
  };
  const onBlurTakeout = () => {
    setInputs(p => {
      const v = Math.round(Number.isFinite(p.dailyTakeout) ? p.dailyTakeout : 0);
      return { ...p, dailyTakeout: clamp(v, 1, 2000) };
    });
  };

  // 제출 검증(최소 개수/필수값)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputs.cupHolderType) { alert('컵홀더 유형을 선택해 주세요.'); return; }
    if (ageCount < AGE_MIN) { alert(`연령대는 최소 ${AGE_MIN}개 선택해야 합니다. (최대 ${AGE_MAX}개)`); return; } // ✅ 추가
    if (mcCount < MC_MIN) { alert(`주 고객층은 최소 ${MC_MIN}개 선택해야 합니다.`); return; }
    if (areaCount < AREA_MIN) { alert(`주변 상권은 최소 ${AREA_MIN}개 선택해야 합니다.`); return; }
    if (inputs.avgDrinkPrice < 1000 || inputs.avgDrinkPrice > 20000) { alert('음료 평균가는 1,000~20,000원입니다.'); return; }
    if (inputs.dailyTakeout < 1 || inputs.dailyTakeout > 2000) { alert('일일 테이크아웃은 1~2000입니다.'); return; }

    // TODO: 실제 API 전송
    alert('상권/운영 정보가 제출되었습니다.');
    console.log('SUBMIT', inputs);
  };

  return (
    <>
      {/* 전역 보조 스타일 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
            outline: 2px solid #3b82f6; outline-offset: 2px;
          }
        `
        }}
      />

      {/* 스킵 링크 */}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded shadow">본문 바로가기</a>

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-3" aria-label="위드폼 홈으로">
              <img src="/assets/images/logo/withfom-logo-horizontal.png" alt="위드폼 With FoM 로고" className="h-[40px] md:h-[56px] w-auto" />
            </a>

            {/* 데스크톱 내비(간단 표기) */}
            <nav className="hidden md:flex items-center gap-6 text-neutral-800">
              <a href="#" className="py-2 font-semibold hover:text-blue-600">광고매체</a>
              <a href="/guide" className="py-2 font-semibold hover:text-blue-600">이용가이드</a>
              <a href="#" className="py-2 font-semibold hover:text-blue-600">커뮤니티</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a href="#estimate" className="hidden md:inline-flex bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold">시작하기</a>
            <a href="/partner/login" className="hidden md:inline-flex bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-900 font-semibold">파트너사 페이지</a>

            {/* 모바일 햄버거 */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
              aria-label="메뉴 열기/닫기"
              aria-expanded={isMenuOpen}
              aria-controls="mobileMenuPanel"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="h-[72px]" />

      {/* 모바일 메뉴 */}
      <div className={`fixed inset-0 top-[72px] bg-black/40 z-[65] md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={closeMenu} />
      <div
        id="mobileMenuPanel"
        className={`fixed inset-0 top-[72px] bg-white z-[70] md:hidden overflow-y-auto transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog" aria-modal="true" aria-label="모바일 메뉴"
      >
        <div className="p-6">
          <nav className="flex flex-col gap-1 text-lg font-semibold text-neutral-900 border-b border-neutral-200 pb-4">
            <div className="border-b border-neutral-100">
              <button onClick={() => setIsAdMenuOpen(v => !v)} className="flex justify-between items-center w-full py-3 hover:text-blue-600" aria-expanded={isAdMenuOpen}>
                광고매체
                <span className={`transition-transform ${isAdMenuOpen ? 'rotate-90' : 'rotate-0'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </span>
              </button>
              <div className="overflow-hidden transition-[max-height,opacity] duration-300" style={{ maxHeight: isAdMenuOpen ? '500px' : 0, opacity: isAdMenuOpen ? 1 : 0 }}>
                <div className="space-y-1 pt-2">
                  <a href="#form" onClick={closeMenu} className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-700 hover:bg-neutral-100">컵홀더 광고</a>
                  <a href="/delivery.html" onClick={closeMenu} className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-700 hover:bg-neutral-100">배달박스 광고</a>
                  <a href="/bag.html" onClick={closeMenu} className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-700 hover:bg-neutral-100">포장봉투 광고</a>
                </div>
              </div>
            </div>

            <a href="/guide" onClick={closeMenu} className="py-3 hover:text-blue-600 border-b border-neutral-100">이용가이드</a>

            <div className="border-b border-neutral-100">
              <button onClick={() => setIsCommOpen(v => !v)} className="flex justify-between items-center w-full py-3 hover:text-blue-600" aria-expanded={isCommOpen}>
                커뮤니티
                <span className={`transition-transform ${isCommOpen ? 'rotate-90' : 'rotate-0'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </span>
              </button>
              <div className="overflow-hidden transition-[max-height,opacity] duration-300" style={{ maxHeight: isCommOpen ? '500px' : 0, opacity: isCommOpen ? 1 : 0 }}>
                <div className="space-y-1 pt-2">
                  <a href="#" onClick={closeMenu} className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-700 hover:bg-neutral-100">공지사항</a>
                  <a href="#" onClick={closeMenu} className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-700 hover:bg-neutral-100">Q&amp;A</a>
                  <a href="#" onClick={closeMenu} className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-700 hover:bg-neutral-100">EVENT</a>
                </div>
              </div>
            </div>
          </nav>

          <div className="mt-6 flex flex-col gap-4">
            <a href="#form" onClick={closeMenu} className="text-center bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 font-bold">지금 바로 시작하기</a>
            <a href="/partner/login" onClick={closeMenu} className="text-center bg-neutral-800 text-white px-4 py-3 rounded-md hover:bg-neutral-900 font-bold">파트너사 페이지</a>
          </div>
        </div>
      </div>

      {/* ===== 메인 폼 ===== */}
      <main id="main" className="min-h-screen bg-neutral-100 px-6 md:px-10 py-10 text-neutral-900">
        <div id="form" className="mx-auto max-w-4xl bg-white rounded-2xl shadow-lg border border-neutral-200">
          <header className="p-6 md:p-8 border-b border-neutral-200">
            <h1 className="text-2xl md:text-3xl font-extrabold">파트너사 상권/운영 정보 입력</h1>
            <p className="mt-2 text-neutral-600">광고 집행 요건 충족을 위한 필수 정보를 입력해 주세요.</p>
          </header>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            <h2 className="text-lg md:text-xl font-bold">A) 상권·운영 입력 요건</h2>

            {/* 카드(2컬럼: 항목 / 형식) */}
            <div className="rounded-xl overflow-hidden border border-neutral-200">
              {/* 헤더 */}
              <div className="grid grid-cols-[150px_1.5fr] text-sm font-semibold bg-neutral-50 text-neutral-900 border-b border-neutral-200">
                <div className="p-3 border-r border-neutral-200">항목</div>
                <div className="p-3">형식 (클릭/입력)</div>
              </div>

              {/* 컵홀더 유형 */}
              <div className="grid grid-cols-[150px_1.5fr] items-center text-sm border-b border-neutral-200">
                <div className="p-3 bg-neutral-50 font-semibold text-neutral-900 border-r border-neutral-200">컵홀더 유형</div>
                <div className="p-3">
                  <label className="mr-6 inline-flex items-center gap-2 select-none text-neutral-900">
                    <input
                      type="radio"
                      name="cupHolderType"
                      value="full"
                      checked={inputs.cupHolderType === 'full'}
                      onChange={(e) => setInputs(p => ({ ...p, cupHolderType: e.target.value as 'full' }))}
                      className="h-4 w-4 accent-blue-600"
                    />
                    전체형
                  </label>
                  <label className="inline-flex items-center gap-2 select-none text-neutral-900">
                    <input
                      type="radio"
                      name="cupHolderType"
                      value="mix"
                      checked={inputs.cupHolderType === 'mix'}
                      onChange={(e) => setInputs(p => ({ ...p, cupHolderType: e.target.value as 'mix' }))}
                      className="h-4 w-4 accent-blue-600"
                    />
                    믹스형
                  </label>
                </div>
              </div>

              {/* ✅ 고객 구성(연령대 선택 UI) */}
              <div className="grid grid-cols-[150px_1.5fr] items-start text-sm border-b border-neutral-200">
                <div className="p-3 bg-neutral-50 font-semibold text-neutral-900 border-r border-neutral-200">고객 구성</div>
                <div className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AGE_OPTIONS.map(opt => (
                      <label key={opt} className={`inline-flex items-center gap-2 select-none ${isAgeDisabled(opt) ? 'opacity-50' : ''}`}>
                        <input
                          type="checkbox"
                          value={opt}
                          checked={inputs.ageGroups.includes(opt)}
                          onChange={() => toggleInArray('ageGroups', opt, AGE_MAX)}
                          disabled={isAgeDisabled(opt)}
                          className="h-4 w-4 accent-blue-600 disabled:cursor-not-allowed"
                        />
                        <span className="text-neutral-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">선택 {ageCount}/{AGE_MAX} (최소 {AGE_MIN}개, 최대 {AGE_MAX}개 선택)</p>
                </div>
              </div>

              {/* 주 고객층 */}
              <div className="grid grid-cols-[150px_1.5fr] items-start text-sm border-b border-neutral-200">
                <div className="p-3 bg-neutral-50 font-semibold text-neutral-900 border-r border-neutral-200">주 고객층</div>
                <div className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CUSTOMER_OPTIONS.map(opt => (
                      <label key={opt} className={`inline-flex items-center gap-2 select-none ${isMcDisabled(opt) ? 'opacity-50' : ''}`}>
                        <input
                          type="checkbox"
                          value={opt}
                          checked={inputs.mainCustomerTypes.includes(opt)}
                          onChange={() => toggleInArray('mainCustomerTypes', opt, MC_MAX)}
                          disabled={isMcDisabled(opt)}
                          className="h-4 w-4 accent-blue-600 disabled:cursor-not-allowed"
                        />
                        <span className="text-neutral-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">선택 {mcCount}/{MC_MAX} (최소 {MC_MIN}개 필요)</p>
                </div>
              </div>

              {/* 주변 상권 */}
              <div className="grid grid-cols-[150px_1.5fr] items-start text-sm border-b border-neutral-200">
                <div className="p-3 bg-neutral-50 font-semibold text-neutral-900 border-r border-neutral-200">주변 상권</div>
                <div className="p-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {AREA_OPTIONS.map(opt => (
                      <label key={opt} className={`inline-flex items-center gap-2 select-none ${isAreaDisabled(opt) ? 'opacity-50' : ''}`}>
                        <input
                          type="checkbox"
                          value={opt}
                          checked={inputs.areaTypes.includes(opt)}
                          onChange={() => toggleInArray('areaTypes', opt, AREA_MAX)}
                          disabled={isAreaDisabled(opt)}
                          className="h-4 w-4 accent-blue-600 disabled:cursor-not-allowed"
                        />
                        <span className="text-neutral-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">선택 {areaCount}/{AREA_MAX} (최소 {AREA_MIN}개 필요)</p>
                </div>
              </div>

              {/* 음료 평균가 */}
              <div className="grid grid-cols-[150px_1.5fr] items-center text-sm border-b border-neutral-200">
                <div className="p-3 bg-neutral-50 font-semibold text-neutral-900 border-r border-neutral-200">음료 평균가</div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1000}
                      max={20000}
                      step={500}
                      value={inputs.avgDrinkPrice}
                      onChange={(e) => setInputs(p => ({ ...p, avgDrinkPrice: Number(e.target.value) }))}
                      onBlur={onBlurPrice}
                      className="w-full md:w-60 rounded-lg border border-neutral-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-neutral-900 placeholder-neutral-400"
                      placeholder="예) 5000"
                    />
                    <span className="text-neutral-700">원</span>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">1,000~20,000 / 500원 단위</p>
                </div>
              </div>

              {/* 일일 테이크아웃 */}
              <div className="grid grid-cols-[150px_1.5fr] items-center text-sm">
                <div className="p-3 bg-neutral-50 font-semibold text-neutral-900 border-r border-neutral-200">일일 테이크아웃</div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={2000}
                      value={inputs.dailyTakeout}
                      onChange={(e) => setInputs(p => ({ ...p, dailyTakeout: Number(e.target.value) }))}
                      onBlur={onBlurTakeout}
                      className="w-full md:w-60 rounded-lg border border-neutral-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-neutral-900 placeholder-neutral-400"
                      placeholder="예) 500"
                    />
                    <span className="text-neutral-700">잔/일</span>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">1~2000 정수</p>
                </div>
              </div>
            </div>

            {/* 제출 */}
            <div className="pt-2">
              <button type="submit" className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                파트너 정보 제출
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-neutral-100">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12 py-12">
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-neutral-700">
            <li><a href="#" className="hover:underline">유튜브</a></li>
            <li><a href="#" className="hover:underline">네이버 블로그</a></li>
            <li><a href="#" className="hover:underline">카카오 채널</a></li>
            <li><a href="#" className="hover:underline">인스타그램</a></li>
          </ul>
          <div className="mt-6 space-y-2 text-sm leading-relaxed text-neutral-600">
            <p>Copyright © With FoM Inc.</p>
            <p>(주)퍼스트오브메이 | 대표 김은수 | 사업자등록번호 000-00-00000 | 통신판매업신고번호 0000-경기파주-0000 | 호스팅 사업자 AWS</p>
            <p>주소 경기 파주시 청석로272, 10층 1004-106호 (동패동,센타프라자1) | 전화 031-935-5715</p>
          </div>
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600">
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
          className="w-[72px] h-[72px] object-contain select-none pointer-events-none transition-transform duration-200
                     [clip-path:circle(40%)]
                     [filter:drop-shadow(0_6px_18px_rgba(0,0,0,.25))]"
        />
      </button>
    </>
  );
}
