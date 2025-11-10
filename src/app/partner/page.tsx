'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

/* =========================================
   공통 타입/더미 데이터
========================================= */
type OrderKPI = {
  label: string;
  value: number | string;
  hint?: string;
  tone?: 'ok' | 'warn' | 'bad' | 'info';
};
type Section = {
  title: string;
  items: OrderKPI[];
};

const TODAY_KPIS: Section[] = [
  {
    title: '주문·배송',
    items: [
      { label: '신규주문', value: 0, tone: 'info' },
      { label: '배송준비', value: 2, tone: 'warn' },
      { label: '배송중', value: 2, tone: 'info' },
      { label: '배송완료', value: 2, tone: 'ok' },
      { label: '구매확정', value: 0, tone: 'info' },
    ],
  },
  {
    title: '정산',
    items: [
      { label: '오늘정산', value: '0원', tone: 'info' },
      { label: '정산예정', value: '0원', hint: '익영업일', tone: 'info' },
      { label: '누적정산', value: '7,235원', tone: 'ok' },
    ],
  },
];

const ISSUE_KPIS: Section[] = [
  {
    title: '취소·반품·교환',
    items: [
      { label: '취소요청', value: 0, tone: 'ok' },
      { label: '반품요청', value: 0, tone: 'ok' },
      { label: '교환요청', value: 0, tone: 'ok' },
    ],
  },
  {
    title: '판매지연',
    items: [
      { label: '발송지연', value: 0, tone: 'ok' },
      { label: '취소지연', value: 0, tone: 'ok' },
      { label: '반품지연', value: 0, tone: 'ok' },
      { label: '교환지연', value: 0, tone: 'ok' },
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
      { label: '새로 작성된 리뷰', value: 0, tone: 'info' },
      { label: '평점 낮은 리뷰', value: 0, tone: 'ok' },
      { label: '발표 예정 리뷰 이벤트', value: 0, tone: 'info' },
    ],
  },
];

const PRODUCTS_KPIS: Section[] = [
  {
    title: '상품',
    items: [
      { label: '판매중 상품', value: 4, tone: 'info' },
      { label: '품절 상품', value: 3, tone: 'warn' },
      { label: '수정요청 상품', value: 0, tone: 'ok' },
    ],
  },
  {
    title: '판매자 등급',
    items: [
      { label: '11월 판매자 등급', value: '씨앗', tone: 'info' },
      { label: '11월 서비스 기준', value: '만족', tone: 'ok' },
    ],
  },
];

const RECENT_ORDERS = [
  { id: 'W20251107-00012', buyer: '홍*동', item: '브랜딩 컵홀더(2,000매)', price: 129000, status: '배송준비', date: '11-07 14:20' },
  { id: 'W20251107-00009', buyer: '김*수', item: '마케팅 컵홀더(5,000매)', price: 279000, status: '배송완료', date: '11-07 10:12' },
  { id: 'W20251106-00088', buyer: '박*진', item: '배달박스 광고(1set)', price: 99000, status: '구매확정', date: '11-06 18:40' },
];

const SALES_TODAY = { goal: 500000, value: 7235 };

/* =========================================
   유틸/작은 컴포넌트
========================================= */
const toneClass = (tone?: OrderKPI['tone']) =>
  ({
    ok: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    warn: 'text-amber-600 border-amber-200 bg-amber-50',
    bad: 'text-rose-600 border-rose-200 bg-rose-50',
    info: 'text-neutral-700 border-neutral-200 bg-white',
  }[tone || 'info']);

function SectionCard({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <header className="px-4 md:px-6 py-3 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-[15px] md:text-base font-semibold text-neutral-900">{title}</h3>
        {right}
      </header>
      <div className="p-4 md:p-6">{children}</div>
    </section>
  );
}

function KPIList({ items }: { items: OrderKPI[] }) {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {items.map((k) => (
        <li
          key={k.label}
          className={`rounded-xl border px-3 py-3 flex items-center justify-between ${toneClass(k.tone)}`}
        >
          <div className="text-sm text-neutral-600">{k.label}</div>
          <div className="text-base md:text-lg font-extrabold">{k.value}</div>
        </li>
      ))}
    </ul>
  );
}

function Badge({
  children,
  tone = 'info',
}: {
  children: React.ReactNode;
  tone?: OrderKPI['tone'];
}) {
  const cls =
    tone === 'ok'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : tone === 'warn'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : tone === 'bad'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-neutral-50 text-neutral-700 border-neutral-200';
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden">
      <div
        className="h-full bg-blue-600"
        style={{ width: `${pct}%` }}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
      />
    </div>
  );
}

/* =========================================
   페이지
========================================= */
export default function PartnerDashboard() {
  const [range, setRange] = useState<'today' | '7d' | '30d'>('today');
  const salesPct = useMemo(() => Math.min(100, Math.round((SALES_TODAY.value / SALES_TODAY.goal) * 100)), []);

  return (
    <main className="min-h-dvh bg-neutral-50">
      {/* 고정 헤더(WithFoM 공통 규격) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/assets/images/logo/withfom-logo-horizontal.png"
                alt="WithFom"
                className="h-[40px] md:h-[48px] w-auto"
              />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/partner/dashboard" className="font-semibold text-neutral-900">
                파트너 대시보드
              </Link>
              <Link href="/partner/orders" className="text-neutral-600 hover:text-neutral-900">
                주문관리
              </Link>
              <Link href="/partner/products" className="text-neutral-600 hover:text-neutral-900">
                상품관리
              </Link>
              <Link href="/partner/settlement" className="text-neutral-600 hover:text-neutral-900">
                정산
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-sm text-neutral-500">villadeblanc</span>
            <Link
              href="/logout"
              className="px-3 py-2 rounded-md border border-neutral-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              로그아웃
            </Link>
          </div>
        </div>
      </header>
      <div className="h-[72px]" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-12 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6 md:gap-8">
          {/* 사이드바 */}
          <aside className="rounded-2xl border border-neutral-200 bg-white shadow-sm h-fit sticky top-[96px]">
            <div className="p-5 border-b border-neutral-100 flex items-center gap-3">
              <img
                src="/assets/images/ads/holder1.png"
                className="w-12 h-12 rounded-xl object-cover"
                alt=""
              />
              <div>
                <div className="text-[15px] font-semibold text-neutral-900">빌라드블랑</div>
                <div className="text-xs text-neutral-500">통합 매니저</div>
              </div>
            </div>
            <nav className="p-2">
              {[
                ['대시보드', '/partner/dashboard'],
                ['주문관리', '/partner/orders'],
                ['배송/정산', '/partner/settlement'],
                ['상품관리', '/partner/products'],
                ['리뷰/문의', '/partner/reviews'],
                ['혜택·마케팅', '/partner/marketing'],
                ['데이터분석', '/partner/analytics'],
                ['광고관리', '/partner/ads'],
                ['프로모션', '/partner/promotion'],
                ['설정', '/partner/settings'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[15px] text-neutral-700 hover:bg-neutral-50"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* 메인 */}
          <div className="space-y-6 md:space-y-8">
            {/* 상단 헤드라인 + 범위 */}
            <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900">파트너 대시보드</h1>
                <p className="text-sm text-neutral-500 mt-1">
                  오늘 현황과 이슈를 한 눈에 확인하고 처리하세요.
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-white flex items-center">
                {(['today', '7d', '30d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 md:px-4 py-2 text-sm rounded-xl ${
                      range === r ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {r === 'today' ? '오늘' : r === '7d' ? '최근 7일' : '최근 30일'}
                  </button>
                ))}
              </div>
            </div>

            {/* 상단 KPI 그리드 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {TODAY_KPIS.map((sec) => (
                <SectionCard
                  key={sec.title}
                  title={sec.title}
                  right={<Badge tone="info">최근 업데이트</Badge>}
                >
                  <KPIList items={sec.items} />
                  {sec.title === '주문·배송' && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-neutral-500">
                      <div>오늘출발 <b className="text-neutral-900">0</b></div>
                      <div>예약구매 <b className="text-neutral-900">0</b></div>
                      <div>정기구독 <b className="text-neutral-900">0</b></div>
                      <div>도착보장 <b className="text-neutral-900">0</b></div>
                    </div>
                  )}
                  {sec.title === '정산' && (
                    <div className="mt-5">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-neutral-700">금일 매출 달성도</span>
                        <span className="font-semibold">{salesPct}%</span>
                      </div>
                      <ProgressBar value={SALES_TODAY.value} max={SALES_TODAY.goal} />
                      <div className="mt-1 text-xs text-neutral-500">
                        목표 {SALES_TODAY.goal.toLocaleString()}원 / 현재 {SALES_TODAY.value.toLocaleString()}원
                      </div>
                    </div>
                  )}
                </SectionCard>
              ))}
            </div>

            {/* 이슈/문의/리뷰 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {ISSUE_KPIS.map((sec) => (
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

            {/* 주문 테이블 + 상품/등급 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                            <Badge tone={o.status === '배송준비' ? 'warn' : o.status === '배송완료' ? 'ok' : 'info'}>
                              {o.status}
                            </Badge>
                          </td>
                          <td className="py-2">{o.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {PRODUCTS_KPIS.map((sec) => (
                  <SectionCard
                    key={sec.title}
                    title={sec.title}
                    right={
                      <Link href={sec.title === '상품' ? '/partner/products' : '/partner/settlement'} className="text-sm text-blue-600 hover:underline">
                        관리하기
                      </Link>
                    }
                  >
                    <div className="grid grid-cols-1 gap-3">
                      {sec.items.map((it) => (
                        <div key={it.label} className="flex items-center justify-between rounded-xl border border-neutral-200 px-3 py-3">
                          <div className="text-sm text-neutral-700">{it.label}</div>
                          <div className="text-base font-extrabold text-neutral-900">{it.value}</div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                ))}

                <SectionCard title="판매 성과 (금일)">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-600">주문건수</div>
                      <div className="mt-2 text-2xl font-extrabold">0</div>
                    </div>
                    <div className="rounded-xl border border-neutral-200 p-4">
                      <div className="text-sm text-neutral-600">매출액</div>
                      <div className="mt-2 text-2xl font-extrabold">{SALES_TODAY.value.toLocaleString()}원</div>
                    </div>
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* 하단 도움말 */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center md:justify-between gap-3">
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
                <Link href="/partner/support" className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">
                  1:1 문의
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
