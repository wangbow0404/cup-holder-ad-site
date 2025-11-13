'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

type Lang = 'ko' | 'en' | 'ja' | 'zh-hans' | 'zh-hant';
const allowed: Lang[] = ['ko', 'en', 'ja', 'zh-hans', 'zh-hant'];

const dict: Record<Lang, any> = {
  ko: {
    step: { terms: '약관 동의', form: '정보 입력' },
    allAgree: '전체 동의하기',
    allAgreeDesc: '위치기반서비스(선택), 이벤트·혜택 정보 수신(선택) 등을 포함합니다.',
    tos: '필수 이용약관',
    privacy: '필수 개인정보 수집 및 이용',
    required: '필수',
    lbs: '선택 위치기반서비스 이용약관',
    marketing: '선택 개인정보 수집 및 이용(이벤트·혜택 수신)',
    optional: '선택',
    next: '다음',
    prev: '이전',
    submit: '가입 완료',

    name: '이름',
    namePh: '이름을 입력하세요',
    loginId: '아이디(이메일 또는 휴대폰)',
    loginIdPh: 'example@withfom.com 또는 010-0000-0000',
    password: '비밀번호',
    passwordPh: '영문/숫자 8자 이상',
    password2: '비밀번호 확인',
    password2Ph: '비밀번호 확인',
    phone: '휴대폰 번호',
    phonePh: '010-0000-0000',
    reqOTP: '인증요청',
    sending: '전송중…',
    address: '주소',
    addressPh: '주소를 입력하거나 찾기를 눌러 선택',
    findAddr: '주소 찾기',

    hasAccount: '이미 계정이 있으신가요?',
    toLogin: '로그인',

    alerts: {
      pwMismatch: '비밀번호가 일치하지 않습니다. 확인해주세요.',
      signupOk: '가입이 완료되었습니다. 로그인해 주세요.',
      signupFailPrefix: '가입 실패: ',
      networkErr: '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      phoneInvalid: '휴대폰 번호를 정확히 입력해주세요.',
      otpSent: '인증번호를 전송했어요. 문자함을 확인해주세요!',
    },
  },
  en: {
    step: { terms: 'Agree to Terms', form: 'Enter Information' },
    allAgree: 'Agree to All',
    allAgreeDesc: 'Includes optional Location-based Service terms and optional marketing consent.',
    tos: 'Required Terms of Service',
    privacy: 'Required Privacy Policy',
    required: 'Required',
    lbs: 'Optional Location-based Service Terms',
    marketing: 'Optional Marketing Consent',
    optional: 'Optional',
    next: 'Next',
    prev: 'Back',
    submit: 'Create Account',

    name: 'Name',
    namePh: 'Enter your name',
    loginId: 'Login ID (Email or Mobile)',
    loginIdPh: 'example@withfom.com or 010-0000-0000',
    password: 'Password',
    passwordPh: 'At least 8 characters',
    password2: 'Confirm Password',
    password2Ph: 'Re-enter password',
    phone: 'Mobile Number',
    phonePh: '010-0000-0000',
    reqOTP: 'Send Code',
    sending: 'Sending…',
    address: 'Address',
    addressPh: 'Type or search address',
    findAddr: 'Find Address',

    hasAccount: 'Already have an account?',
    toLogin: 'Log in',

    alerts: {
      pwMismatch: 'Passwords do not match.',
      signupOk: 'Sign-up complete. Please log in.',
      signupFailPrefix: 'Sign-up failed: ',
      networkErr: 'Network error. Please try again later.',
      phoneInvalid: 'Please enter a valid phone number.',
      otpSent: 'Verification code sent. Please check your messages.',
    },
  },
  ja: {
    step: { terms: '約款に同意', form: '情報入力' },
    allAgree: 'すべてに同意する',
    allAgreeDesc: '位置情報サービス(任意)・マーケティング受信(任意)を含みます。',
    tos: '必須 利用規約',
    privacy: '必須 個人情報の収集および利用',
    required: '必須',
    lbs: '任意 位置情報サービス約款',
    marketing: '任意 マーケティング情報受信',
    optional: '任意',
    next: '次へ',
    prev: '戻る',
    submit: '登録を完了',

    name: '名前',
    namePh: 'お名前を入力',
    loginId: 'ログインID（メールまたは携帯）',
    loginIdPh: 'example@withfom.com または 010-0000-0000',
    password: 'パスワード',
    passwordPh: '英数字8文字以上',
    password2: 'パスワード確認',
    password2Ph: 'もう一度入力',
    phone: '携帯番号',
    phonePh: '010-0000-0000',
    reqOTP: '認証コード',
    sending: '送信中…',
    address: '住所',
    addressPh: '住所を入力または検索',
    findAddr: '住所検索',

    hasAccount: 'すでにアカウントをお持ちですか？',
    toLogin: 'ログイン',

    alerts: {
      pwMismatch: 'パスワードが一致しません。',
      signupOk: '登録が完了しました。ログインしてください。',
      signupFailPrefix: '登録失敗：',
      networkErr: 'ネットワークエラーが発生しました。しばらくしてからお試しください。',
      phoneInvalid: '正しい携帯番号を入力してください。',
      otpSent: '認証コードを送信しました。メッセージをご確認ください。',
    },
  },
  'zh-hans': {
    step: { terms: '同意条款', form: '填写信息' },
    allAgree: '全部同意',
    allAgreeDesc: '包含可选的定位服务条款与营销信息接收。',
    tos: '必选 服务条款',
    privacy: '必选 个人信息收集与使用',
    required: '必选',
    lbs: '可选 定位服务条款',
    marketing: '可选 营销信息接收',
    optional: '可选',
    next: '下一步',
    prev: '上一步',
    submit: '完成注册',

    name: '姓名',
    namePh: '请输入姓名',
    loginId: '登录ID（邮箱或手机）',
    loginIdPh: 'example@withfom.com 或 010-0000-0000',
    password: '密码',
    passwordPh: '至少8位',
    password2: '确认密码',
    password2Ph: '再次输入',
    phone: '手机号',
    phonePh: '010-0000-0000',
    reqOTP: '发送验证码',
    sending: '发送中…',
    address: '地址',
    addressPh: '输入或搜索地址',
    findAddr: '查找地址',

    hasAccount: '已有账号？',
    toLogin: '登录',

    alerts: {
      pwMismatch: '两次输入的密码不一致。',
      signupOk: '注册完成，请登录。',
      signupFailPrefix: '注册失败：',
      networkErr: '网络错误，请稍后再试。',
      phoneInvalid: '请输入正确的手机号。',
      otpSent: '验证码已发送，请查收短信。',
    },
  },
  'zh-hant': {
    step: { terms: '同意條款', form: '填寫資料' },
    allAgree: '全部同意',
    allAgreeDesc: '包含可選的定位服務條款與行銷訊息接收。',
    tos: '必選 服務條款',
    privacy: '必選 個人資訊蒐集與使用',
    required: '必選',
    lbs: '可選 定位服務條款',
    marketing: '可選 行銷訊息接收',
    optional: '可選',
    next: '下一步',
    prev: '上一步',
    submit: '完成註冊',

    name: '姓名',
    namePh: '請輸入姓名',
    loginId: '登入ID（電子郵件或手機）',
    loginIdPh: 'example@withfom.com 或 010-0000-0000',
    password: '密碼',
    passwordPh: '至少8碼',
    password2: '確認密碼',
    password2Ph: '再次輸入',
    phone: '手機號碼',
    phonePh: '010-0000-0000',
    reqOTP: '發送驗證碼',
    sending: '傳送中…',
    address: '地址',
    addressPh: '輸入或搜尋地址',
    findAddr: '找地址',

    hasAccount: '已經有帳號？',
    toLogin: '登入',

    alerts: {
      pwMismatch: '兩次輸入的密碼不一致。',
      signupOk: '註冊完成，請登入。',
      signupFailPrefix: '註冊失敗：',
      networkErr: '網路錯誤，請稍後再試。',
      phoneInvalid: '請輸入正確的手機號碼。',
      otpSent: '驗證碼已發送，請查收簡訊。',
    },
  },
};

export default function ConsumerJoinPage() {
  /** ========= 언어 ========= */
  const [lang, setLang] = useState<Lang>('ko');

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

  useEffect(() => {
    try { localStorage.setItem('wf_lang', lang); } catch {}
  }, [lang]);

  const t = dict[lang];

  /** ========= 쿼리/이동 ========= */
  const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const nextParam = useMemo(() => search?.get('next') ?? null, [search]);
  const toLoginHref = useMemo(() => {
    const base = '/consumer/login';
    return nextParam ? `${base}?next=${encodeURIComponent(nextParam)}` : base;
  }, [nextParam]);

  /** ========= 단계/동의 ========= */
  const [step, setStep] = useState<1 | 2>(1);
  const [agree, setAgree] = useState({ tos: false, privacy: false, lbs: false, marketing: false });
  const allChecked = agree.tos && agree.privacy && agree.lbs && agree.marketing;
  const requiredOK = agree.tos && agree.privacy;

  const onToggleAll = useCallback(() => {
    const v = !allChecked;
    setAgree({ tos: v, privacy: v, lbs: v, marketing: v });
  }, [allChecked]);

  const onChangeAgree = useCallback(
    (k: keyof typeof agree) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setAgree((s) => ({ ...s, [k]: e.target.checked })),
    []
  );

  const goStep2 = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!requiredOK) return;
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [requiredOK]
  );

  const backToStep1 = useCallback(() => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /** ========= 폼 제출 ========= */
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const pw = String(fd.get('password') || '');
      const pw2 = String(fd.get('password2') || '');
      if (pw !== pw2) {
        alert(t.alerts.pwMismatch);
        return;
      }
      const payload = {
        name: String(fd.get('name') || ''),
        loginId: String(fd.get('loginId') || ''),
        password: pw,
        phone: String(fd.get('phone') || ''),
        address: String(fd.get('address') || ''),
        agree: { ...agree },
      };

      try {
        const r = await fetch('/api/consumer/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (r.ok) {
          alert(t.alerts.signupOk);
          const to = nextParam ? `/consumer/login?next=${encodeURIComponent(nextParam)}` : '/consumer/login';
          window.location.href = to;
        } else {
          const msg = await r.text();
          alert(t.alerts.signupFailPrefix + msg);
        }
      } catch {
        alert(t.alerts.networkErr);
      }
    },
    [agree, nextParam, t.alerts]
  );

  /** ========= 휴대폰 입력 + 인증요청 ========= */
  const [phone, setPhone] = useState('');
  const [otpSending, setOtpSending] = useState(false);

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length < 4) return d;
    if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };
  const onChangePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };
  const onRequestOTP = async () => {
    const pure = phone.replace(/\D/g, '');
    if (pure.length < 10) {
      alert(t.alerts.phoneInvalid);
      return;
    }
    try {
      setOtpSending(true);
      // TODO: 실제 문자 발송 API로 교체
      // await fetch('/api/sms/send', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ phone: pure, type:'consumer-join' }) })
      await new Promise((r) => setTimeout(r, 600));
      alert(t.alerts.otpSent);
    } finally {
      setOtpSending(false);
    }
  };

  /** ========= 스타일 ========= */
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid #3b82f6; outline-offset: 2px; }
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif; }
          .scrollbox::-webkit-scrollbar { width: 6px; }
          .scrollbox::-webkit-scrollbar-thumb { background:#d4d4d8; border-radius:8px; }
        `,
        }}
      />

      <main className="min-h-dvh grid place-items-center px-5 py-10 bg-neutral-50">
        <div className="w-full max-w-[760px]">
          {/* 로고 + 언어 (로고 클릭 시 메인으로 이동) */}
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <a href="/" aria-label="메인으로">
              <img
                src="/assets/images/logo/withfom-logo-horizontal.png"
                alt="WITH FoM"
                className="h-10 md:h-12 w-auto"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src =
                    '/consumer/images/withfom-logo-horizontal.png')
                }
              />
            </a>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 1 0 10 10A10.012 10.012 0 0 0 12 2Zm7.93 9h-3.4a15.4 15.4 0 0 0-1.13-5.21A8.025 8.025 0 0 1 19.93 11ZM12 4.07A13.6 13.6 0 0 1 13.9 11h-3.8A13.6 13.6 0 0 1 12 4.07ZM4.07 13h3.4a15.4 15.4 0 0 0 1.13 5.21A8.025 8.025 0 0 1 4.07 13Zm0-2a8.025 8.025 0 0 1 4.53-5.21A15.4 15.4 0 0 0 7.47 11h-3.4Zm7.93 8.93A13.6 13.6 0 0 1 10.1 13h3.8A13.6 13.6 0  0 1 12 19.93Zm3.47-1.72A15.4 15.4 0  0 0 16.53 13h3.4a8.025 8.025 0 0 1-4.53 5.21Z" />
              </svg>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="appearance-none bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-700"
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="zh-hans">中文(简体)</option>
                <option value="zh-hant">中文(台灣)</option>
                <option value="ja">日本語</option>
              </select>
            </div>
          </div>

          {/* 카드 */}
          <section className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 md:p-8">
            {/* 단계 표시 */}
            <div className="flex items-center gap-3 text-sm mb-6">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-neutral-300'}`} />
                <span className={`font-medium ${step === 1 ? 'text-neutral-800' : 'text-neutral-500'}`} suppressHydrationWarning>
                  {t.step.terms}
                </span>
              </div>
              <span className="text-neutral-300">/</span>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-neutral-300'}`} />
                <span className={`font-medium ${step === 2 ? 'text-neutral-800' : 'text-neutral-500'}`} suppressHydrationWarning>
                  {t.step.form}
                </span>
              </div>
            </div>

            {/* 1단계: 약관 동의 */}
            {step === 1 && (
              <form className="space-y-5" onSubmit={goStep2}>
                {/* 전체 동의 */}
                <label className="flex items-start gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50">
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-blue-600" checked={allChecked} onChange={onToggleAll} />
                  <div>
                    <div className="font-semibold text-neutral-900" suppressHydrationWarning>{t.allAgree}</div>
                    <p className="text-sm text-neutral-500 mt-1" suppressHydrationWarning>{t.allAgreeDesc}</p>
                  </div>
                </label>

                {/* 필수: 이용약관 */}
                <div className="p-4 border border-neutral-200 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="h-5 w-5 accent-blue-600" checked={agree.tos} onChange={onChangeAgree('tos')} />
                    <span className="font-medium text-neutral-800" suppressHydrationWarning>{t.tos}</span>
                    <span className="ml-auto text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-500" suppressHydrationWarning>{t.required}</span>
                  </label>
                  <div className="mt-3 scrollbox h-28 overflow-y-auto text-sm text-neutral-600 leading-relaxed bg-neutral-50 rounded-lg p-3">
                    서비스 이용과 관련된 일반 조건이 들어갑니다. 실제 문구로 교체하세요.
                  </div>
                </div>

                {/* 필수: 개인정보 */}
                <div className="p-4 border border-neutral-200 rounded-xl">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="h-5 w-5 accent-blue-600" checked={agree.privacy} onChange={onChangeAgree('privacy')} />
                    <span className="font-medium text-neutral-800" suppressHydrationWarning>{t.privacy}</span>
                    <span className="ml-auto text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-500" suppressHydrationWarning>{t.required}</span>
                  </label>
                  <div className="mt-3 scrollbox h-28 overflow-y-auto text-sm text-neutral-600 leading-relaxed bg-neutral-50 rounded-lg p-3">
                    개인정보 관련 안내 문구가 들어가는 영역입니다. 실제 정책 본문으로 교체하세요.
                  </div>
                </div>

                {/* 선택: 위치기반 */}
                <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 accent-blue-600" checked={agree.lbs} onChange={onChangeAgree('lbs')} />
                  <span className="font-medium text-neutral-800" suppressHydrationWarning>{t.lbs}</span>
                  <span className="ml-auto text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-500" suppressHydrationWarning>{t.optional}</span>
                </label>

                {/* 선택: 마케팅 */}
                <label className="flex items-center gap-3 p-4 border border-neutral-200 rounded-xl cursor-pointer">
                  <input type="checkbox" className="h-5 w-5 accent-blue-600" checked={agree.marketing} onChange={onChangeAgree('marketing')} />
                  <span className="font-medium text-neutral-800" suppressHydrationWarning>{t.marketing}</span>
                  <span className="ml-auto text-xs rounded-full px-2 py-0.5 bg-neutral-100 text-neutral-500" suppressHydrationWarning>{t.optional}</span>
                </label>

                <button
                  type="submit"
                  disabled={!requiredOK}
                  className={
                    requiredOK
                      ? 'w-full mt-2 py-3.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white'
                      : 'w-full mt-2 py-3.5 rounded-xl font-semibold bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  }
                >
                  {t.next}
                </button>
              </form>
            )}

            {/* 2단계: 정보 입력 */}
            {step === 2 && (
              <form className="space-y-4" onSubmit={onSubmit}>
                {/* 이름 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1" suppressHydrationWarning>
                    {t.name}
                  </label>
                  <input
                    name="name"
                    required
                    placeholder={t.namePh}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-neutral-900 placeholder:text-neutral-300"
                  />
                </div>

                {/* 아이디 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1" suppressHydrationWarning>
                    {t.loginId}
                  </label>
                  <input
                    name="loginId"
                    autoComplete="username"
                    required
                    placeholder={t.loginIdPh}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-neutral-900 placeholder:text-neutral-300"
                  />
                </div>

                {/* 비밀번호/확인 */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1" suppressHydrationWarning>
                      {t.password}
                    </label>
                    <input
                      id="pw"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      placeholder={t.passwordPh}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-neutral-900 placeholder:text-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1" suppressHydrationWarning>
                      {t.password2}
                    </label>
                    <input
                      id="pw2"
                      name="password2"
                      type="password"
                      required
                      placeholder={t.password2Ph}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-neutral-900 placeholder:text-neutral-300"
                    />
                  </div>
                </div>

                {/* 휴대폰 + 인증요청 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1" suppressHydrationWarning>
                    {t.phone}
                  </label>
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <input
                      name="phone"
                      value={phone}
                      onChange={onChangePhone}
                      inputMode="numeric"
                      placeholder={t.phonePh}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-neutral-900 placeholder:text-neutral-300"
                      aria-label={t.phone}
                    />
                    <button
                      type="button"
                      onClick={onRequestOTP}
                      disabled={otpSending}
                      className="px-4 md:px-5 whitespace-nowrap rounded-xl border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {otpSending ? t.sending : t.reqOTP}
                    </button>
                  </div>
                </div>

                {/* 주소 + 찾기 */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1" suppressHydrationWarning>
                    {t.address}
                  </label>
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <input
                      name="address"
                      placeholder={t.addressPh}
                      className="w-full rounded-xl border border-neutral-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-neutral-900 placeholder:text-neutral-300"
                    />
                    <button
                      type="button"
                      onClick={() => (window.location.href = '/consumer/address/search')}
                      className="inline-flex items-center gap-1 px-4 py-3 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="7" strokeWidth="2" />
                        <path d="m20 20-3.5-3.5" strokeWidth="2" />
                      </svg>
                      {t.findAddr}
                    </button>
                  </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={backToStep1} className="px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-700">
                    {t.prev}
                  </button>
                  <button id="btn-submit" type="submit" className="px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    {t.submit}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* 하단 이동 */}
          <p className="text-center text-sm text-neutral-600 mt-6">
            <span suppressHydrationWarning>{t.hasAccount}</span>{' '}
            <a href={toLoginHref} className="text-blue-600 hover:underline font-medium" suppressHydrationWarning>
              {t.toLogin}
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
