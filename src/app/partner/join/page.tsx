'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

/** ===== 설정 ===== */
const AGE_OPTIONS = ['10~20대', '20~30대', '30~40대', '40~50대', '50대 이상'];
const AREA_OPTIONS = ['회사', '학교', '주거지', '역세권', '오피스', '상가', '관광지'];
const AGE_MIN = 1, AGE_MAX = 3;
const AREA_MIN = 2, AREA_MAX = 4;
const SMS_TIMER_SEC = 180; // 인증코드 유효시간(초)

/** ===== 유틸 ===== */
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export default function PartnerJoinPage() {
  /** 전역 보조 스타일 */
  useEffect(() => {
    const css = `
      a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible {
        outline: 2px solid #3b82f6; outline-offset: 2px;
      }
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif; }
      .scrollbox::-webkit-scrollbar { width: 6px; }
      .scrollbox::-webkit-scrollbar-thumb { background:#d4d4d8; border-radius:8px; }
    `;
    const el = document.createElement('style');
    el.innerHTML = css;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  /** 단계: 약관(1) → 폼(2) */
  const [step, setStep] = useState<1 | 2>(1); // 운영에선 1로 변경

  /** 약관 동의 */
  const [agree, setAgree] = useState({ tos: false, privacy: false, lbs: false, marketing: false });
  const requiredOK = agree.tos && agree.privacy;
  const allChecked = Object.values(agree).every(Boolean);
  const toggleAll = () => setAgree({ tos: !allChecked, privacy: !allChecked, lbs: !allChecked, marketing: !allChecked });
  const toggleOne = (k: keyof typeof agree) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAgree((s) => ({ ...s, [k]: e.target.checked }));
  const goStep2 = (e: React.FormEvent) => { e.preventDefault(); if (requiredOK) setStep(2); };

  /** 폼 상태 */
  const [form, setForm] = useState({
    companyName: '',
    bizNo: '',
    ownerName: '',
    loginId: '',
    password: '',
    password2: '',
    phone: '',
    smsCode: '',
    address: '',
    openHours: '',
    workdays: 6 as 1|2|3|4|5|6|7,
    ageGroups: [] as string[],
    areaTypes: [] as string[],
  });

  /** 아이디 중복체크 */
  const [idChecking, setIdChecking] = useState(false);
  const [idAvailable, setIdAvailable] = useState<null | boolean>(null);
  const checkId = useCallback(async (id: string) => {
    if (!id) { setIdAvailable(null); return; }
    setIdChecking(true);
    try {
      const r = await fetch('/api/partner/auth/check-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: id }),
      });
      const data = await r.json().catch(() => ({}));
      // 기대 응답: { available: boolean }
      setIdAvailable(Boolean(data?.available));
    } catch {
      setIdAvailable(null);
    } finally {
      setIdChecking(false);
    }
  }, []);
  const onBlurLoginId = () => checkId(form.loginId.trim());

  /** 휴대폰 인증 */
  const [smsSending, setSmsSending] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [leftSec, setLeftSec] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const startTimer = useCallback(() => {
    setLeftSec(SMS_TIMER_SEC);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setLeftSec((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);
  useEffect(() => () => { if (timerRef.current) window.clearInterval(timerRef.current); }, []);

  const sendSms = useCallback(async () => {
    if (!form.phone) { alert('휴대폰 번호를 입력해 주세요.'); return; }
    setSmsSending(true);
    try {
      const r = await fetch('/api/partner/auth/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone }),
      });
      if (r.ok) {
        setSmsSent(true);
        setSmsVerified(false);
        startTimer();
        alert('인증코드를 전송했습니다.');
      } else {
        const msg = await r.text();
        alert('인증요청 실패: ' + msg);
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setSmsSending(false);
    }
  }, [form.phone, startTimer]);

  const verifySms = useCallback(async () => {
    if (!smsSent) return;
    if (!form.smsCode) { alert('인증코드를 입력해 주세요.'); return; }
    try {
      const r = await fetch('/api/partner/auth/verify-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: form.phone, code: form.smsCode }),
      });
      if (r.ok) {
        setSmsVerified(true);
        alert('휴대폰 인증이 완료되었습니다.');
      } else {
        const msg = await r.text();
        alert('인증 실패: ' + msg);
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    }
  }, [form.phone, form.smsCode, smsSent]);

  /** 주소 찾기 (새 창 → postMessage로 수신) */
  const openAddressSearch = () => {
    const w = window.open('/partner/address-search', 'addressSearch', 'width=560,height=640');
    if (!w) alert('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.');
  };
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      // 기대 메시지: { type:'addressSelected', address:'...' }
      if (e?.data?.type === 'addressSelected' && typeof e.data.address === 'string') {
        setForm((p) => ({ ...p, address: e.data.address }));
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  /** 선택 헬퍼 */
  const toggleIn = (key: 'ageGroups' | 'areaTypes', item: string, max: number) => {
    setForm((p) => {
      const cur = p[key];
      const has = cur.includes(item);
      if (has) return { ...p, [key]: cur.filter((v) => v !== item) };
      if (cur.length >= max) return p;
      return { ...p, [key]: [...cur, item] };
    });
  };
  const ageCount = form.ageGroups.length;
  const areaCount = form.areaTypes.length;

  /** 제출 */
  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!idAvailable) { alert('아이디 중복을 확인해 주세요.'); return; }
    if (form.password !== form.password2) { alert('비밀번호가 일치하지 않습니다.'); return; }
    if (!smsVerified) { alert('휴대폰 인증을 완료해 주세요.'); return; }
    if (ageCount < AGE_MIN) { alert(`연령대는 최소 ${AGE_MIN}개 선택해야 합니다. (최대 ${AGE_MAX})`); return; }
    if (areaCount < AREA_MIN) { alert(`상권유형은 최소 ${AREA_MIN}개 선택해야 합니다. (최대 ${AREA_MAX})`); return; }

    const payload = {
      companyName: form.companyName,
      bizNo: form.bizNo || null,
      ownerName: form.ownerName,
      loginId: form.loginId,
      password: form.password,
      phone: form.phone,
      address: form.address || null,
      openHours: form.openHours || null,
      workdaysPerWeek: form.workdays,
      ageGroups: form.ageGroups,
      areaTypes: form.areaTypes,
      agree: { ...agree },
    };

    try {
      const r = await fetch('/api/partner/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        alert('가입이 완료되었습니다. 로그인해 주세요.');
        window.location.href = '/partner/login';
      } else {
        const msg = await r.text();
        alert('가입 실패: ' + msg);
      }
    } catch {
      alert('네트워크 오류가 발생했습니다.');
    }
  }, [agree, areaCount, ageCount, form, idAvailable, smsVerified]);

  /** 렌더 */
  return (
    <main className="min-h-dvh grid place-items-center px-5 py-10 bg-neutral-50">
      <div className="w-full max-w-[900px]">
        {/* 로고 (메인으로 이동) */}
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <Link href="/" aria-label="위드폼 메인으로 이동">
            <img
              src="/assets/images/logo/withfom-logo-horizontal.png"
              alt="WITH FoM"
              className="h-10 md:h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              onError={(e) => ((e.target as HTMLImageElement).src = '/partner/images/withfom-logo-horizontal.png')}
            />
          </Link>
        </div>

        <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
          {/* 단계 표시 */}
          <div className="flex items-center gap-3 text-sm mb-6">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-neutral-300'}`} />
              <span className={`font-medium ${step === 1 ? 'text-neutral-800' : 'text-neutral-500'}`}>약관 동의</span>
            </div>
            <span className="text-neutral-300">/</span>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-neutral-300'}`} />
              <span className={`font-medium ${step === 2 ? 'text-neutral-800' : 'text-neutral-500 text-neutral-900'}`}>정보 입력</span>
            </div>
          </div>

          {/* ============ STEP 1 ============ */}
          {step === 1 && (
            <form className="space-y-5" onSubmit={goStep2}>
              <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50">
                <input type="checkbox" className="mt-1 h-5 w-5 accent-blue-600" checked={allChecked} onChange={toggleAll} />
                <div>
                  <div className="font-semibold text-neutral-900">전체 동의하기</div>
                  <p className="text-sm text-neutral-500 mt-1">위치기반서비스(선택), 이벤트·혜택 정보 수신(선택) 등을 포함합니다.</p>
                </div>
              </label>

              <div className="p-4 border border-neutral-200 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 accent-blue-600" checked={agree.tos} onChange={toggleOne('tos')} />
                  <span className="font-medium text-neutral-800">필수 이용약관</span>
                  <span className="ml-auto text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-500">필수</span>
                </label>
                <div className="mt-3 scrollbox h-28 overflow-y-auto text-sm text-neutral-600 leading-relaxed bg-neutral-50 rounded-lg p-3">
                  서비스 이용과 관련된 일반 조건이 들어갑니다. 실제 문구로 교체하세요.
                </div>
              </div>

              <div className="p-4 border border-neutral-200 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 accent-blue-600" checked={agree.privacy} onChange={toggleOne('privacy')} />
                  <span className="font-medium text-neutral-800">필수 개인정보 수집 및 이용</span>
                  <span className="ml-auto text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-500">필수</span>
                </label>
                <div className="mt-3 scrollbox h-28 overflow-y-auto text-sm text-neutral-600 leading-relaxed bg-neutral-50 rounded-lg p-3">
                  개인정보 관련 안내 문구가 들어가는 영역입니다. 실제 정책 본문으로 교체하세요.
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer">
                <input type="checkbox" className="h-5 w-5 accent-blue-600" checked={agree.lbs} onChange={toggleOne('lbs')} />
                <span className="font-medium text-neutral-800">선택 위치기반서비스 이용약관</span>
                <span className="ml-auto text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-500">선택</span>
              </label>

              <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer">
                <input type="checkbox" className="h-5 w-5 accent-blue-600" checked={agree.marketing} onChange={toggleOne('marketing')} />
                <span className="font-medium text-neutral-800">선택 개인정보 수집 및 이용(이벤트·혜택 수신)</span>
                <span className="ml-auto text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-500">선택</span>
              </label>

              <button
                type="submit"
                disabled={!requiredOK}
                className={requiredOK ? 'w-full mt-2 py-3.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white'
                                       : 'w-full mt-2 py-3.5 rounded-xl font-semibold bg-neutral-200 text-neutral-500 cursor-not-allowed'}
              >
                다음
              </button>
            </form>
          )}

          {/* ============ STEP 2 ============ */}
          {step === 2 && (
            <form className="space-y-6" onSubmit={onSubmit}>
              {/* A. 사업자 기본 */}
              <div>
                <h3 className="text-lg md:text-xl font-extrabold text-neutral-900">A) 사업자 기본 정보</h3>
                <p className="text-sm text-neutral-500 mt-1">사업자명·등록증·대표명은 가입 후 <b>실제 인증</b>으로 검증됩니다.</p>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">사업자명</label>
                    <input
                      value={form.companyName}
                      onChange={(e)=>setForm(p=>({ ...p, companyName: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                      placeholder="예) 위드폼 주식회사"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">사업자등록증(번호)</label>
                    <input
                      value={form.bizNo}
                      onChange={(e)=>setForm(p=>({ ...p, bizNo: e.target.value }))}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                      placeholder="예) 123-45-67890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">대표이름</label>
                    <input
                      value={form.ownerName}
                      onChange={(e)=>setForm(p=>({ ...p, ownerName: e.target.value }))}
                      required
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                      placeholder="예) 홍길동"
                    />
                  </div>
                </div>
              </div>

              {/* B. 계정(ID/비번) */}
              <div className="pt-2">
                <h3 className="text-lg md:text-xl font-extrabold text-neutral-900">B) 계정 설정</h3>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">아이디(이메일 또는 휴대폰)</label>
                    <input
                      value={form.loginId}
                      onChange={(e)=>{ setForm(p=>({ ...p, loginId: e.target.value })); setIdAvailable(null); }}
                      onBlur={onBlurLoginId}
                      autoComplete="username"
                      required
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                      placeholder="example@withfom.com 또는 010-0000-0000"
                    />
                    <p className="mt-1 text-xs">
                      {idAvailable === null && !idChecking && <span className="text-neutral-400">아이디 중복 여부를 확인합니다.</span>}
                      {idChecking && <span className="text-neutral-500">중복 확인 중…</span>}
                      {idAvailable === true && <span className="text-green-600">사용 가능한 아이디입니다.</span>}
                      {idAvailable === false && <span className="text-red-600">이미 있는 아이디입니다.</span>}
                    </p>
                  </div>
                  <div />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">비밀번호</label>
                    <input
                      value={form.password}
                      onChange={(e)=>setForm(p=>({ ...p, password: e.target.value }))}
                      type="password" autoComplete="new-password" minLength={8} required
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                      placeholder="영문/숫자 8자 이상"
                    />
                  </div>
                    <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">비밀번호 확인</label>
                    <input
                      value={form.password2}
                      onChange={(e)=>setForm(p=>({ ...p, password2: e.target.value }))}
                      type="password" required
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                      placeholder="다시 입력"
                    />
                    <p className="mt-1 text-xs text-neutral-500">{form.password && form.password2 && (form.password === form.password2 ? '일치합니다.' : '비밀번호가 일치하지 않습니다.')}</p>
                  </div>
                </div>
              </div>

              {/* C. 휴대폰 인증 */}
              <div className="pt-2">
                <h3 className="text-lg md:text-xl font-extrabold text-neutral-900">C) 휴대폰 본인 인증</h3>
                <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-3">
                  <input
                    value={form.phone}
                    onChange={(e)=>setForm(p=>({ ...p, phone: e.target.value }))}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                    placeholder="010-0000-0000"
                  />
                  <button
                    type="button"
                    onClick={sendSms}
                    disabled={smsSending}
                    className="px-4 py-3 rounded-xl font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-60"
                  >
                    {smsSending ? '요청 중…' : '인증요청'}
                  </button>
                </div>

                {smsSent && (
                  <div className="mt-3 grid md:grid-cols-[1fr_auto_auto] gap-3 items-start">
                    <input
                      value={form.smsCode}
                      onChange={(e)=>setForm(p=>({ ...p, smsCode: e.target.value }))}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                      placeholder="인증코드 입력"
                    />
                    <div className="px-3 py-3 text-sm text-neutral-600">{leftSec ? `남은 시간 ${Math.floor(leftSec/60)}:${String(leftSec%60).padStart(2,'0')}` : '만료'}</div>
                    <button
                      type="button"
                      onClick={verifySms}
                      className={`px-4 py-3 rounded-xl font-semibold ${smsVerified ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                    >
                      {smsVerified ? '인증완료' : '확인'}
                    </button>
                  </div>
                )}
              </div>

              {/* D. 주소/영업 */}
              <div className="pt-2">
                <h3 className="text-lg md:text-xl font-extrabold text-neutral-900">D) 주소 및 영업 정보</h3>
                <div className="mt-4 grid md:grid-cols-[1fr_auto] gap-3">
                  <input
                    value={form.address}
                    readOnly
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 bg-neutral-50 text-neutral-700"
                    placeholder="주소를 검색해 선택하세요."
                  />
                  <button
                    type="button"
                    onClick={openAddressSearch}
                    className="px-4 py-3 rounded-xl font-semibold border border-neutral-300 text-neutral-700 hover:bg-neutral-50 inline-flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
                    주소 찾기
                  </button>
                </div>

                <div className="mt-3 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">영업시간</label>
                    <input
                      value={form.openHours}
                      onChange={(e)=>setForm(p=>({ ...p, openHours: e.target.value }))}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                      placeholder="예) 09:00–22:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">주당 영업일수</label>
                    <select
                      value={form.workdays}
                      onChange={(e)=>setForm(p=>({ ...p, workdays: clamp(Number(e.target.value),1,7) as 1|2|3|4|5|6|7 }))}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 text-neutral-900"
                    >
                      {[1,2,3,4,5,6,7].map(n => <option key={n} value={n}>{n}일</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* E. 상권 입력(연령/유형) */}
              <div className="pt-2">
                <h3 className="text-lg md:text-xl font-extrabold text-neutral-900">E) 상권 입력</h3>
                <p className="text-sm text-neutral-500 mt-1">연령대는 최대 {AGE_MAX}개, 상권유형은 {AREA_MIN}~{AREA_MAX}개 선택</p>

                <div className="mt-4 grid md:grid-cols-2 gap-6">
                  {/* 연령층 */}
                  <div>
                    <div className="text-sm font-semibold text-neutral-800 mb-2">주 연령층</div>
                    <div className="grid grid-cols-2 gap-2">
                      {AGE_OPTIONS.map((opt) => {
                        const disabled = !form.ageGroups.includes(opt) && form.ageGroups.length >= AGE_MAX;
                        return (
                          <label key={opt} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 border ${disabled ? 'opacity-50' : ''}`}>
                            <input
                              type="checkbox"
                              checked={form.ageGroups.includes(opt)}
                              onChange={() => toggleIn('ageGroups', opt, AGE_MAX)}
                              disabled={disabled}
                              className="h-4 w-4 accent-blue-600 disabled:cursor-not-allowed"
                            />
                            <span className="text-neutral-800">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">선택 {ageCount}/{AGE_MAX}</p>
                  </div>

                  {/* 상권유형 */}
                  <div>
                    <div className="text-sm font-semibold text-neutral-800 mb-2">상권 유형</div>
                    <div className="grid grid-cols-2 gap-2">
                      {AREA_OPTIONS.map((opt) => {
                        const disabled = !form.areaTypes.includes(opt) && form.areaTypes.length >= AREA_MAX;
                        return (
                          <label key={opt} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 border ${disabled ? 'opacity-50' : ''}`}>
                            <input
                              type="checkbox"
                              checked={form.areaTypes.includes(opt)}
                              onChange={() => toggleIn('areaTypes', opt, AREA_MAX)}
                              disabled={disabled}
                              className="h-4 w-4 accent-blue-600 disabled:cursor-not-allowed"
                            />
                            <span className="text-neutral-800">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-neutral-500">선택 {areaCount}/{AREA_MAX} (최소 {AREA_MIN})</p>
                  </div>
                </div>
              </div>

              {/* F. 안내(소진알림/자동발주/등급/비용) */}
              <div className="pt-2 grid gap-3">
                <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50">
                  <div className="text-sm font-semibold text-neutral-800">소진/알림</div>
                  <p className="text-sm text-neutral-600 mt-1">일 1회 보고, 전일 대비 <b>+200%↑</b> 시 확인창 표시, 미보고 시 단계별 4회 알림.</p>
                </div>
                <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50">
                  <div className="text-sm font-semibold text-neutral-800">자동발주</div>
                  <p className="text-sm text-neutral-600 mt-1">재고 <b>30% 이하</b> 시 자동 발주 제안(분할 가능).</p>
                </div>
                <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50">
                  <div className="text-sm font-semibold text-neutral-800">등급</div>
                  <p className="text-sm text-neutral-600 mt-1">브론즈≥80 / 실버=표시90(실질85 인정) / 골드=표시100(실질90 인정) / 플래티넘=골드+1년.</p>
                </div>
                <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50">
                  <div className="text-sm font-semibold text-neutral-800">비용(파트너)</div>
                  <p className="text-sm text-neutral-600 mt-1">로고 유무 무관. 로고 미삽입이어도 처음부터 무료 제공. 비용은 등급 기준만 적용.</p>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <a href="/partner/login" className="px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-700">이전</a>
                <button
                  type="submit"
                  className="px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  가입 완료
                </button>
              </div>
            </form>
          )}
        </section>

        <p className="text-center text-sm text-neutral-600 mt-6">
          이미 계정이 있으신가요?{' '}
          <a href="/partner/login" className="text-blue-600 hover:underline font-medium">로그인</a>
        </p>
      </div>
    </main>
  );
}
