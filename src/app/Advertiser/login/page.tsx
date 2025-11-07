'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

type Lang = 'ko' | 'en' | 'ja' | 'zh-hans' | 'zh-hant';
const allowed: Lang[] = ['ko', 'en', 'ja', 'zh-hans', 'zh-hant'];

const dict: Record<Lang, any> = {
  ko: {
    idOrPhone: '아이디 또는 전화번호',
    password: '비밀번호',
    remember: '로그인 상태 유지',
    findId: '아이디 찾기',
    findPw: '비밀번호 찾기',
    login: '로그인',
    loggingIn: '로그인 중…',
    or: '또는',
    toJoin: '광고주 회원가입', // ⭐️ 한국어 텍스트 '관리자 회원가입'으로 수정
    errors: {
      required: '아이디와 비밀번호를 입력해주세요.',
      fail: '로그인 실패: 아이디 또는 비밀번호를 확인해주세요.',
      network: '서버 연결 오류가 발생했습니다.',
    },
    langLabel: '언어',
  },
  en: {
    idOrPhone: 'ID or phone number',
    password: 'Password',
    remember: 'Keep me signed in',
    findId: 'Find ID',
    findPw: 'Find password',
    login: 'Log in',
    loggingIn: 'Signing in…',
    or: 'or',
    toJoin: 'Partner sign up',
    errors: {
      required: 'Please enter your ID and password.',
      fail: 'Login failed. Check your ID or password.',
      network: 'Failed to connect to the server.',
    },
    langLabel: 'Language',
  },
  ja: {
    idOrPhone: 'ID または電話番号',
    password: 'パスワード',
    remember: 'ログイン状態を保持',
    findId: 'ID を探す',
    findPw: 'パスワードを探す',
    login: 'ログイン',
    loggingIn: 'ログイン中…',
    or: 'または',
    toJoin: 'パートナー会員登録',
    errors: {
      required: 'ID とパスワードを入力してください。',
      fail: 'ログインに失敗しました。ID またはパスワードを確認してください。',
      network: 'サーバーへの接続に失敗しました。',
    },
    langLabel: '言語',
  },
  'zh-hans': {
    idOrPhone: '账号或手机号',
    password: '密码',
    remember: '保持登录状态',
    findId: '找回账号',
    findPw: '找回密码',
    login: '登录',
    loggingIn: '登录中…',
    or: '或',
    toJoin: '合作伙伴注册',
    errors: {
      required: '请输入账号和密码。',
      fail: '登录失败：请检查账号或密码。',
      network: '服务器连接失败。',
    },
    langLabel: '语言',
  },
  'zh-hant': {
    idOrPhone: '帳號或手機號',
    password: '密碼',
    remember: '保持登入狀態',
    findId: '找回帳號',
    findPw: '找回密碼',
    login: '登入',
    loggingIn: '登入中…',
    or: '或',
    toJoin: '合作夥伴註冊',
    errors: {
      required: '請輸入帳號與密碼。',
      fail: '登入失敗：請檢查帳號或密碼。',
      network: '無法連線至伺服器。',
    },
    langLabel: '語言',
  },
};

export default function PartnerLoginPage() {
  // 1) SSR & 첫 렌더는 ko로 고정 → hydration 안전
  const [lang, setLang] = useState<Lang>('ko');

  // 2) 마운트 후 저장된/브라우저 언어 적용
  useEffect(() => {
    try {
      let initial: Lang = 'ko';
      const saved = localStorage.getItem('wf_lang') as Lang | null;
      if (saved && allowed.includes(saved)) initial = saved;
      else {
        const nav = navigator.language?.toLowerCase?.() ?? 'ko';
        if (nav.startsWith('ja')) initial = 'ja';
        else if (nav.startsWith('zh-tw') || nav === 'zh-hant') initial = 'zh-hant';
        else if (nav.startsWith('zh')) initial = 'zh-hans';
        else if (nav.startsWith('en')) initial = 'en';
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
    () => (nextParam ? `/partner/join?next=${encodeURIComponent(nextParam)}` : '/partner/join'),
    [nextParam]
  );

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrMsg(null);
      
      // 유효성 검사 및 API 호출 건너뛰기 
      
      setLoading(true);

      // ⭐️⭐️⭐️ 핵심 수정: 이동 경로를 메인 관리자 페이지로 수정 ⭐️⭐️⭐️
      const to = '/Advertiser'; 
      
      // 딜레이를 주어 로딩 상태를 잠깐 보여줍니다.
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      location.href = to;
      
    },
    []
  );

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
            <img
              src="/assets/images/logo/withfom-logo-horizontal.png"
              alt="WITH FoM"
              className="h-10 md:h-12 w-auto"
              onError={(e) =>
                ((e.target as HTMLImageElement).src =
                  '/partner/images/withfom-logo-horizontal.png')
              }
            />
            <label className="flex items-center gap-2 text-sm text-neutral-600">
              <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm7.93 9h-3.4a15.4 15.4 0 0 0-1.13-5.21A8.025 8.025 0 0 1 19.93 11ZM12 4.07A13.6 13.6 0 0 1 13.9 11h-3.8A13.6 13.6 0 0 1 12 4.07ZM4.07 13h3.4a15.4 15.4 0 0 0 1.13 5.21A8.025 8.025 0 0 1 4.07 13Zm0-2a8.025 8.025 0 0 1 4.53-5.21A15.4 15.4 0 0 0 7.47 11h-3.4Zm7.93 8.93A13.6 13.6 0 0 1 10.1 13h3.8A13.6 13.6 0 0 1 12 19.93Zm3.47-1.72A15.4 15.4 0 0 0 16.53 13h3.4a8.025 8.025 0 0 1-4.53 5.21Z" />
              </svg>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="appearance-none bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-700"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="zh-hans">中文(简体)</option>
                <option value="zh-hant">中文(台灣)</option>
                <option value="ja">日本語</option>
              </select>
            </label>
          </div>

          {/* 카드 */}
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-7">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 4.5V21h16v-2.5C20 16.17 16.33 14 12 14Z"/>
                </svg>
                ID
              </span>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              {/* 아이디 */}
              <div>
                <label htmlFor="loginId" className="sr-only">{t.idOrPhone}</label>
                <div className="relative">
                  <input
                    id="loginId"
                    name="loginId"
                    type="text"
                    autoComplete="username"
                    // required 속성 제거 
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 pr-10 focus:border-blue-500"
                    placeholder={t.idOrPhone}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 4.5V21h16v-2.5C20 16.17 16.33 14 12 14Z"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="password" className="sr-only">{t.password}</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    // required 속성 제거 
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 pr-10 focus:border-blue-500"
                    placeholder={t.password}
                  />
                  <button
                    type="button"
                    aria-label="toggle password"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    onClick={togglePw}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 5c-5 0-9 4-10 7 1 3 5 7 10 7s9-4 10-7c-1-3-5-7-10-7Zm0 12a5 5 0 1 1 5-5 5 5 0 0 1-5 5Z"/>
                    </svg>
                  </button>
                </div>
              </div>

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

              {/* 에러 */}
              {errMsg && <p className="text-red-600 text-sm" role="alert">{errMsg}</p>}

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl"
              >
                {loading ? t.loggingIn : t.login}
              </button>

              {/* 구분선 */}
              <div className="relative my-2">
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