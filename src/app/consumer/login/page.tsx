'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Lang = 'ko' | 'en';
const allowed: Lang[] = ['ko', 'en'];

const dict: Record<Lang, any> = {
  ko: {
    idOrPhone: '아이디',            // ← ID 고정
    password: '비밀번호',
    remember: '로그인 상태 유지',
    findId: '아이디 찾기',
    findPw: '비밀번호 찾기',
    login: '로그인',
    loggingIn: '로그인 중…',
    or: '또는',
    toJoin: '회원가입',
    errors: {
      required: '아이디와 비밀번호를 입력해주세요.',
      fail: '로그인 실패: 아이디 또는 비밀번호를 확인해주세요.',
      network: '서버 연결 오류가 발생했습니다.',
    },
    langLabel: '한국어',
  },
  en: {
    title: 'WITH FoM Login',
    idOrPhone: 'ID',               // ← ID 고정
    password: 'Password',
    remember: 'Keep me signed in',
    findId: 'Find ID',
    findPw: 'Find password',
    login: 'Log in',
    loggingIn: 'Signing in…',
    or: 'or',
    toJoin: 'Sign up',
    errors: {
      required: 'Please enter your ID and password.',
      fail: 'Login failed. Check your ID or password.',
      network: 'Failed to connect to the server.',
    },
    langLabel: 'English',
  },
};

export default function ConsumerLoginPage() {
  // 1) 초기 언어 ko 고정 → hydration 안전
  const [lang, setLang] = useState<Lang>('ko');

  // 2) 마운트 후 저장된/브라우저 언어 반영
  useEffect(() => {
    try {
      let initial: Lang = 'ko';
      const saved = localStorage.getItem('wf_lang') as Lang | null;
      if (saved && allowed.includes(saved)) initial = saved;
      else {
        const nav = navigator.language?.toLowerCase?.() ?? 'ko';
        if (nav.startsWith('en')) initial = 'en';
      }
      setLang(initial);
    } catch {}
  }, []);

  // 3) 변경 시 저장
  useEffect(() => {
    try { localStorage.setItem('wf_lang', lang); } catch {}
  }, [lang]);

  const t = dict[lang];

  const search = typeof window !== 'undefined' ? new URLSearchParams(location.search) : null;
  const nextParam = useMemo(() => search?.get('next') ?? null, [search]);
  const joinHref = useMemo(
    () => (nextParam ? `/consumer/join?next=${encodeURIComponent(nextParam)}` : '/consumer/join'),
    [nextParam]
  );

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  // 로그인 제출
  const onSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrMsg(null);

    const fd = new FormData(e.currentTarget);
    const loginId = String(fd.get('loginId') || '').trim();
    const password = String(fd.get('password') || '').trim();

    if (!loginId || !password) {
      setErrMsg(t.errors.required);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/consumer/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId, password }),
      });

      if (res.ok) {
        const to = nextParam ? nextParam : '/consumer';
        location.href = to;
      } else {
        setErrMsg(t.errors.fail);
      }
    } catch {
      setErrMsg(t.errors.network);
    } finally {
      setLoading(false);
    }
  }, [nextParam, t.errors]);

  // 비밀번호 보기 토글
  const togglePw = useCallback(() => {
    const input = document.getElementById('password') as HTMLInputElement | null;
    if (input) input.type = input.type === 'password' ? 'text' : 'password';
  }, []);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            a:focus-visible, button:focus-visible, input:focus-visible {
              outline: 2px solid #3b82f6; outline-offset: 2px;
            }
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif; }
          `,
        }}
      />

      <main className="min-h-dvh grid place-items-center px-5 py-10 bg-neutral-50">
        <div className="w-full max-w-[480px]">
          {/* 로고 + 언어 */}
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <Link href="/" aria-label="메인으로 이동">
              <img
                src="/assets/images/logo/withfom-logo-horizontal.png"
                alt="WITH FoM"
                className="h-10 md:h-12 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/partner/images/withfom-logo-horizontal.png';
                }}
              />
            </Link>

            <select
              aria-label="언어 선택"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="appearance-none bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-700"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* 로그인 카드 */}
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-7">
            {/* 상단 타이틀(선택) */}
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">{t.title}</h2>

            {/* ID 배지 */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 4.5V21h16v-2.5C20 16.17 16.33 14 12 14Z"/>
                </svg>
                ID
              </span>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              {/* 아이디 */}
              <div className="relative">
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  autoComplete="username"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 pr-10 focus:border-blue-500 text-neutral-900"
                  placeholder={t.idOrPhone}  // '아이디' 또는 'ID'
                />
                {/* 아이콘(옵션) */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 4.5V21h16v-2.5C20 16.17 16.33 14 12 14Z"/>
                  </svg>
                </span>
              </div>

              {/* 비밀번호 */}
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-neutral-300 px-4 py-3 pr-10 focus:border-blue-500 text-neutral-900"
                  placeholder={t.password}
                />
                <button
                  type="button"
                  aria-label="비밀번호 보기"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  onClick={togglePw}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7Zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z"/>
                  </svg>
                </button>
              </div>

              {/* 오류 메시지 */}
              {errMsg && <p className="text-sm text-red-600" role="alert">{errMsg}</p>}

              {/* 옵션 */}
              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 select-none">
                  <input type="checkbox" className="h-4 w-4 accent-blue-600" />
                  <span className="text-neutral-700">{t.remember}</span>
                </label>
                <div className="flex items-center gap-3">
                  <a href="#" className="text-neutral-500 hover:text-neutral-800">{t.findId}</a>
                  <span className="text-neutral-300">|</span>
                  <a href="#" className="text-neutral-500 hover:text-neutral-800">{t.findPw}</a>
                </div>
              </div>

              {/* 로그인 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl"
              >
                {loading ? t.loggingIn : t.login}
              </button>

              {/* 구분선 */}
              <div className="relative my-3">
                <div className="h-px bg-neutral-200" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 text-xs text-neutral-400">
                  {t.or}
                </span>
              </div>

              {/* 회원가입 */}
              <a
                href={joinHref}
                className="block w-full text-center bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-3.5 rounded-xl"
              >
                {t.toJoin}
              </a>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
