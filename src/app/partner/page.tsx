'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

/* =========================================
   테마 (파란색 계열)
   - 사이드바: blue-900 계열
   - 포인트: blue-600/700
========================================= */
const theme = {
  brand: {
    bg: 'bg-blue-900',
    text: 'text-white',
    textMuted: 'text-blue-100',
    hover: 'hover:bg-blue-800',
    border: 'border-blue-800',
    chip: 'bg-blue-800 text-blue-100 border-blue-700',
  },
  surface: {
    card: 'bg-white',
    border: 'border-neutral-200',
    subtle: 'bg-neutral-50',
  },
  accent: {
    main: 'bg-blue-600',
    mainHover: 'hover:bg-blue-700',
    text: 'text-blue-600',
    badge: 'text-blue-700 bg-blue-50 border-blue-200',
  },
};

/* =========================================
   타입 & 더미 데이터
========================================= */
type Tone = 'ok' | 'warn' | 'bad' | 'info';
type KPI = { label: string; value: number | string; hint?: string; tone?: Tone };
type Todo = { label: string; done: boolean; tone?: Tone; action?: React.ReactNode };

const STORE = {
  name: '빌라드블랑',
  role: '통합 매니저',
  avatar: '/assets/images/ads/holder1.png',
};

const INITIAL = {
  dailyReportDone: false,
  stockPercent: 70,
  rewardToday: { couponsIssued: 0, couponsUsed: 0, pointsIssued: 0 },
  salesToday: 7235,
  salesGoal: 500000,
};

const RECENT_ORDERS = [
  { id: 'W20251107-00012', buyer: '홍*동', item: '브랜딩 컵홀더(2,000매)', price: 129000, status: '배송준비', date: '11-07 14:20' },
  { id: 'W20251107-00009', buyer: '김*수', item: '마케팅 컵홀더(5,000매)', price: 279000, status: '배송완료', date: '11-07 10:12' },
  { id: 'W20251106-00088', buyer: '박*진', item: '배달박스 광고(1set)', price: 99000, status: '구매확정', date: '11-06 18:40' },
];

/* =========================================
   유틸 & 작은 컴포넌트
========================================= */
const toneClass = (tone: Tone = 'info') =>
  ({
    ok: 'text-emerald-700 border-emerald-200 bg-emerald-50',
    warn: 'text-amber-700 border-amber-200 bg-amber-50',
    bad: 'text-rose-700 border-rose-200 bg-rose-50',
    info: 'text-neutral-700 border-neutral-200 bg-white',
  }[tone]);

function Badge({
  children,
  tone = 'info',
}: {
  children: React.ReactNode;
  tone?: Tone;
}) {
  const cls =
    tone === 'ok'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : tone === 'warn'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : tone === 'bad'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : theme.accent.badge; // info
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}

function SectionCard({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border ${theme.surface.border} ${theme.surface.card} shadow-sm`}>
      <header className="px-4 md:px-6 py-3 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-[15px] md:text-base font-semibold text-neutral-900">{title}</h3>
        {right}
      </header>
      <div className="p-4 md:p-6">{children}</div>
    </section>
  );
}

function Progress({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div
      className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className={`h-full ${theme.accent.main}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/* =========================================
   페이지
========================================= */
export default function PartnerDashboard() {
  const [range, setRange] = useState<'today' | '7d' | '30d'>('today');
  const [dailyReportDone, setDailyReportDone] = useState(INITIAL.dailyReportDone);
  const [stockPercent, setStockPercent] = useState(INITIAL.stockPercent);
  const [rewardToday] = useState(INITIAL.rewardToday);

  const salesPct = useMemo(
    () => Math.min(100, Math.round((INITIAL.salesToday / INITIAL.salesGoal) * 100)),
    []
  );

  const todos: Todo[] = [
    {
      label: '일일 소진 보고',
      done: dailyReportDone,
      tone: dailyReportDone ? 'ok' : 'bad',
      action: dailyReportDone ? (
        <Badge tone="ok">완료</Badge>
      ) : (
        <Link
          href="/partner/ops/consumption"
          className="px-2.5 py-1.5 rounded-md border border-rose-200 text-rose-700 text-xs hover:bg-rose-50"
        >
          지금 보고
        </Link>
      ),
    },
    {
      label: '컵홀더 재고 현황',
      done: stockPercent > 30,
      tone: stockPercent > 30 ? 'info' : 'warn',
      action: (
        <div className="flex items-center gap-2">
          <Badge tone={stockPercent > 50 ? 'ok' : stockPercent > 30 ? 'info' : 'warn'}>{stockPercent}%</Badge>
          <Link href="/partner/ops/purchase" className="px-2.5 py-1.5 rounded-md border border-neutral-300 text-xs hover:bg-neutral-50">
            발주하기
          </Link>
        </div>
      ),
    },
  ];

  const issueBlocks: { title: string; items: KPI[] }[] = [
    {
      title: '취소·반품·교환',
      items: [
        { label: '취소요청', value: 0, tone: 'ok' },
        { label: '반품요청', value: 0, tone: 'ok' },
        { label: '교환요청', value: 0, tone: 'ok' },
      ],
    },
    {
      title: '미답변 문의',
      items: [
        { label: '상품 Q&A', value: 0, tone: 'ok' },
        { label: '주문고객문의', value: 0, tone: 'ok' },
        { label: '톡톡문의', value: 0, tone: 'ok' },
      ],
    },
    {
      title: '리뷰 현황',
      items: [
        { label: '새 리뷰', value: 0, tone: 'info' },
        { label: '낮은 평점', value: 0, tone: 'ok' },
        { label: '리뷰 이벤트 예정', value: 0, tone: 'info' },
      ],
    },
  ];

  const showStockAlert = stockPercent <= 30;

  return (
    <main className="min-h-dvh">
      {/* 상단 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-[1600px] px-4 lg:px-8 h-[60px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <img src="/assets/images/logo/withfom-logo-horizontal.png" alt="WithFom" className="h-[36px] w-auto" />
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/partner/dashboard" className={`${theme.accent.text} font-semibold`}>파트너 대시보드</Link>
              <Link href="/partner/orders" className="text-neutral-600 hover:text-neutral-900">주문관리</Link>
              <Link href="/partner/products" className="text-neutral-600 hover:text-neutral-900">상품관리</Link>
              <Link href="/partner/settlement" className="text-neutral-600 hover:text-neutral-900">정산</Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-neutral-500">villadeblanc</span>
            <Link href="/logout" className="px-3 py-2 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              로그아웃
            </Link>
          </div>
        </div>
      </header>
      <div className="h-[60px]" />

      <div className="mx-auto max-w-[1600px] px-0 lg:px-8">
        <div className="grid grid-cols-[260px,1fr]">
          {/* 좌측 사이드바 (파란색) */}
          <aside className={`fixed top-[60px] left-0 bottom-0 w-[260px] ${theme.brand.bg} border-r ${theme.brand.border} overflow-y-auto`}>
            <div className="p-4 border-b border-blue-800 flex items-center gap-3">
              <img src={STORE.avatar} className="w-11 h-11 rounded-lg object-cover ring-2 ring-blue-800" alt="" />
              <div>
                <div className={`text-[15px] font-semibold ${theme.brand.text}`}>{STORE.name}</div>
                <div className={`text-[12px] ${theme.brand.textMuted}`}>{STORE.role}</div>
              </div>
            </div>

            {/* 검색 박스(옵션) */}
            <div className="p-3 border-b border-blue-800">
              <div className={`w-full ${theme.brand.chip} rounded-lg px-3 py-2 text-xs`}>메뉴를 선택하세요</div>
            </div>

            {/* 메뉴 그룹 */}
            <nav className="p-2 space-y-3">
              <div>
                <div className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider ${theme.brand.textMuted}`}>운영 관리</div>
                {[
                  ['일일 소진 보고', '/partner/ops/consumption'],
                  ['컵홀더 발주', '/partner/ops/purchase'],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] ${theme.brand.text} ${theme.brand.hover}`}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {label}
                  </Link>
                ))}
              </div>

              <div>
                <div className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider ${theme.brand.textMuted}`}>리워드 관리</div>
                {[
                  ['리워드 설정', '/partner/reward/settings'],
                  ['쿠폰/포인트 현황', '/partner/reward/status'],
                  ['쿠폰 사용 처리(스캔)', '/partner/reward/redeem'],
                ].map(([label, href]) => (
                  <Link key={label} href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] ${theme.brand.text} ${theme.brand.hover}`}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {label}
                  </Link>
                ))}
              </div>

              <div>
                <div className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider ${theme.brand.textMuted}`}>정산</div>
                {[
                  ['정산 내역', '/partner/settlement'],
                  ['등급별 분기 보기', '/partner/settlement/tiers'],
                ].map(([label, href]) => (
                  <Link key={label} href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] ${theme.brand.text} ${theme.brand.hover}`}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {label}
                  </Link>
                ))}
              </div>

              <div>
                <div className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider ${theme.brand.textMuted}`}>계정 설정</div>
                {[
                  ['매장 정보 수정', '/partner/settings/store'],
                  ['정산 계좌', '/partner/settings/settlement-account'],
                ].map(([label, href]) => (
                  <Link key={label} href={href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] ${theme.brand.text} ${theme.brand.hover}`}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
          </aside>

          {/* 메인 콘텐츠 */}
          <div className="col-start-2">
            <div className="ml-[260px] min-h-[calc(100dvh-60px)] p-5 md:p-7 lg:p-8 bg-neutral-50">
              {/* 헤더 타이틀 & 범위 */}
              <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-3 mb-5">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900">파트너 대시보드</h1>
                  <p className="text-sm text-neutral-500 mt-1">오늘 현황과 이슈를 한 눈에 확인하고 처리하세요.</p>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white flex items-center">
                  {(['today', '7d', '30d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`px-3 md:px-4 py-2 text-sm rounded-xl ${
                        range === r ? `${theme.accent.main} text-white` : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {r === 'today' ? '오늘' : r === '7d' ? '최근 7일' : '최근 30일'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 상단 3분할: To-Do / 재고 경고 / 리워드 요약 */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <SectionCard
                  title="오늘의 할 일 (To-Do)"
                  right={
                    <button
                      onClick={() => setDailyReportDone((v) => !v)}
                      className="text-xs px-2.5 py-1.5 rounded-md border border-neutral-300 hover:bg-neutral-50"
                    >
                      {dailyReportDone ? '보고 취소' : '보고 완료 체크'}
                    </button>
                  }
                >
                  <ul className="space-y-2">
                    {todos.map((t) => (
                      <li key={t.label} className={`flex items-center justify-between rounded-xl border px-3 py-3 ${toneClass(t.tone)}`}>
                        <div className="text-sm font-medium">{t.label}</div>
                        <div className="flex items-center gap-3">{t.action}</div>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                <SectionCard title="재고 경고" right={<Badge tone={showStockAlert ? 'warn' : 'ok'}>{showStockAlert ? '주의' : '정상'}</Badge>}>
                  {showStockAlert ? (
                    <div className="space-y-3">
                      <p className="text-sm text-amber-700">재고 부족! 발주가 필요합니다. 임계치(30%) 이하로 내려갔습니다.</p>
                      <div className="flex items-center gap-3">
                        <Link href="/partner/ops/purchase" className={`px-3 py-2 rounded-md ${theme.accent.main} text-white text-sm font-semibold ${theme.accent.mainHover}`}>
                          즉시 발주
                        </Link>
                        <button
                          onClick={() => setStockPercent((v) => Math.min(100, v + 10))}
                          className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50"
                        >
                          가상 +10% (테스트)
                        </button>
                      </div>
                      <Progress value={stockPercent} max={100} />
                      <div className="text-xs text-neutral-500">현재 {stockPercent}%</div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-neutral-600">재고가 안정적입니다.</p>
                      <Progress value={stockPercent} max={100} />
                      <div className="text-xs text-neutral-500">현재 {stockPercent}% · 임계치 30%</div>
                    </div>
                  )}
                </SectionCard>

                <SectionCard title="리워드 현황 요약" right={<Badge tone="info">금일</Badge>}>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <li className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="text-sm text-neutral-600">오늘 발급된 쿠폰</div>
                      <div className="mt-2 text-2xl font-extrabold">{rewardToday.couponsIssued}</div>
                    </li>
                    <li className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="text-sm text-neutral-600">오늘 사용된 쿠폰</div>
                      <div className="mt-2 text-2xl font-extrabold">{rewardToday.couponsUsed}</div>
                    </li>
                    <li className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="text-sm text-neutral-600">오늘 발급된 포인트</div>
                      <div className="mt-2 text-2xl font-extrabold">{rewardToday.pointsIssued}</div>
                    </li>
                  </ul>
                  <div className="mt-4 flex items-center gap-2">
                    <Link href="/partner/reward/settings" className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50">
                      리워드 설정
                    </Link>
                    <Link href="/partner/reward/status" className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50">
                      현황 보기
                    </Link>
                    <Link href="/partner/reward/redeem" className={`px-3 py-2 rounded-md ${theme.accent.main} text-white text-sm font-semibold ${theme.accent.mainHover}`}>
                      쿠폰 사용 처리
                    </Link>
                  </div>
                </SectionCard>
              </div>

              {/* 주문·정산 KPI + 최근 주문 */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                <SectionCard title="주문·정산 요약" right={<Badge tone="info">최근 업데이트</Badge>}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: '신규주문', value: 0, tone: 'info' as Tone },
                      { label: '배송준비', value: 2, tone: 'warn' as Tone },
                      { label: '배송중', value: 2, tone: 'info' as Tone },
                      { label: '배송완료', value: 2, tone: 'ok' as Tone },
                    ].map((k) => (
                      <div key={k.label} className={`rounded-xl border px-3 py-3 flex items-center justify-between ${toneClass(k.tone)}`}>
                        <div className="text-sm">{k.label}</div>
                        <div className="text-lg font-extrabold">{k.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-neutral-700">금일 매출 달성도</span>
                      <span className="font-semibold">{salesPct}%</span>
                    </div>
                    <Progress value={INITIAL.salesToday} max={INITIAL.salesGoal} />
                    <div className="mt-1 text-xs text-neutral-500">
                      목표 {INITIAL.salesGoal.toLocaleString()}원 / 현재 {INITIAL.salesToday.toLocaleString()}원
                    </div>
                  </div>
                </SectionCard>

                <SectionCard
                  title="최근 주문"
                  right={
                    <Link href="/partner/orders" className="text-sm text-blue-600 hover:underline">
                      더보기
                    </Link>
                  }
                >
                  <div className="overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-neutral-500 border-b">
                          <th className="py-2 pr-2">주문번호</th>
                          <th className="py-2 pr-2">구매자</th>
                          <th className="py-2 pr-2">상품</th>
                          <th className="py-2 pr-2 text-right">금액</th>
                          <th className="py-2 pr-2">상태</th>
                          <th className="py-2">일시</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RECENT_ORDERS.map((o) => (
                          <tr key={o.id} className="border-b last:border-0">
                            <td className="py-2 pr-2 font-medium text-neutral-900">{o.id}</td>
                            <td className="py-2 pr-2">{o.buyer}</td>
                            <td className="py-2 pr-2">{o.item}</td>
                            <td className="py-2 pr-2 text-right">{o.price.toLocaleString()}원</td>
                            <td className="py-2 pr-2">
                              <Badge tone={o.status === '배송준비' ? 'warn' : o.status === '배송완료' ? 'ok' : 'info'}>{o.status}</Badge>
                            </td>
                            <td className="py-2">{o.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </div>

              {/* 이슈·문의·리뷰 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {issueBlocks.map((sec) => (
                  <SectionCard key={sec.title} title={sec.title}>
                    <ul className="space-y-2">
                      {sec.items.map((it) => (
                        <li key={it.label} className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2">
                          <span className="text-sm text-neutral-700">{it.label}</span>
                          <Badge tone={it.tone}>{it.value}</Badge>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                ))}
              </div>

              {/* 등급/보고 정책 */}
              <SectionCard title="파트너 등급 및 보고 정책" >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">등급 (6개월 롤링 평균)</h4>
                    <ul className="space-y-2 text-sm">
                      <li><b className="text-neutral-900">브론즈</b>: 표시 ≥80% <Badge tone="info">혜택: 컵홀더 50% 부담</Badge></li>
                      <li><b className="text-neutral-900">실버</b>  : 표시 85% / 실질 80% 인정 <Badge tone="ok">혜택: 무료 제공</Badge></li>
                      <li><b className="text-neutral-900">골드</b>  : 표시 100% / 실질 90% <Badge tone="ok">혜택: 무료 + 매체 30% 할인쿠폰</Badge></li>
                      <li><b className="text-neutral-900">플래티넘</b>: 골드 충족 + 1년 <Badge tone="ok">혜택: 골드 + 개당 10원 인센</Badge></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900 mb-2">보고 & 제재</h4>
                    <p className="text-sm text-neutral-700">
                      <b>미보고 알림(4단계)</b>: ① 마감 30분 전 ② 마감 2h 후 ③ 24시 30분 ④ 다음날 오픈 +1h
                    </p>
                    <p className="text-sm text-neutral-700 mt-2">
                      <b>패널티</b>: 허위 보고 적발 시 즉시 한 등급 강등 + 당월 인센 박탈
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/partner/settlement/tiers" className="text-sm text-blue-600 hover:underline">등급 산식 및 분기표 자세히 보기</Link>
                </div>
              </SectionCard>

              {/* 도움말 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-3 mt-6">
                <div>
                  <div className="text-[15px] font-semibold text-neutral-900">무엇을 도와드릴까요?</div>
                  <p className="text-sm text-neutral-500 mt-1">자주 묻는 질문, 공지사항, 채팅 상담으로 빠르게 해결하세요.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/partner/help/faq" className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50">
                    FAQ
                  </Link>
                  <Link href="/partner/notice" className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50">
                    공지사항
                  </Link>
                  <Link href="/partner/support" className={`px-3 py-2 rounded-md ${theme.accent.main} text-white text-sm font-semibold ${theme.accent.mainHover}`}>
                    1:1 문의
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* /메인 */}
        </div>
      </div>
    </main>
  );
}
