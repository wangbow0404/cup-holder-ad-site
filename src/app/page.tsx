'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';

/* ================================
   전역 선언 (카카오맵 타입)
=================================== */
declare global {
  interface Window {
    kakao: any;
  }
}

/* ================================
   상수: 히어로 배너 / 컵홀더 슬라이더 / 당첨자
=================================== */

const KAKAO_API_KEY = '207ab74d221bce1b934e4378d94ac6de';

const HERO_SLIDES = [
  '/assets/images/hero/banner1.jpg',
  '/assets/images/hero/banner2.jpg',
  '/assets/images/hero/banner3.jpg',
  '/assets/images/hero/banner4.jpg',
];
const HERO_FALLBACK = '/assets/images/hero/banner1.jpg';

// 컵홀더 슬라이더 텍스트
const SLIDE_TITLES = ['생활속 광고', '파트너에게', '광고주에게', '모두에게'];
const SLIDE_DESCS = [
  '인구통계·성별·연령 등의 정교한 조건으로 원하는 타겟을 설정할 수 있어요.',
  '자영업자로 살아남기 어려운 세상, 컵홀더로 힘듦의 무게를 덜 수 있도록.',
  '가장 가까운 곳, 나만의 광고가 모두의 손 안에서 시작될 수 있습니다.',
  '새로운 연결을 추구하는 공간, 우리는 위드폼 입니다.',
];

// 컵홀더 슬라이더 자동재생: 10초
const AUTOPLAY_INTERVAL = 10000;

// 반경 필터 옵션
const RADIUS_OPTIONS = [
  { label: '1km', value: 1000 },
  { label: '3km', value: 3000 },
  { label: '5km', value: 5000 },
];

// 기본 지도 중심 (서울 시청 근처)
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.978 };

/* ================================
   더미 데이터
=================================== */

// 최근 당첨자 5명
const WINNERS = [
  { name: '김*수', prize: '카페이용권 5,000원 당첨 🎉' },
  { name: '김*범', prize: '공연관람티켓 당첨 🎉' },
  { name: '박*성', prize: '디저트 세트 쿠폰 당첨 🎉' },
  { name: '반*영', prize: '영화 관람권 당첨 🎉' },
  { name: '정*희', prize: '스타벅스 기프티콘 당첨 🎉' },
];

// 추천 캠페인 카드 + 좌표 데이터
const CAMPAIGNS = [
  {
    id: 'cafe-hongdae-1',
    cafeName: '홍대 • 카페 루프탑',
    title: 'QR 스캔하고 친구랑 아메리카노 1+1',
    benefit: '아메리카노 1+1 + 컵홀더 광고 참여 브랜드 쿠폰 지급',
    period: '~ 2025. 01. 31',
    thumb: '/assets/images/campaigns/cafe-hongdae.jpg',
    href: '/campaigns/cafe-hongdae-1',
    tag: '테이크아웃 전용',
    lat: 37.5575,
    lng: 126.9236,
  },
  {
    id: 'cafe-gangnam-1',
    cafeName: '강남 • 카페 라운지',
    title: '직장인 점심시간 런치 세트 할인',
    benefit: '홀더 QR 스캔 시 샌드위치 세트 최대 30% 할인',
    period: '~ 2025. 02. 15',
    thumb: '/assets/images/campaigns/cafe-gangnam.jpg',
    href: '/campaigns/cafe-gangnam-1',
    tag: '런치 타임',
    lat: 37.498,
    lng: 127.0276,
  },
  {
    id: 'cafe-yeonnam-1',
    cafeName: '연남 • 카페 포인트',
    title: '주말 브런치 음료 사이즈업',
    benefit: 'QR 참여 시 전 메뉴 무료 사이즈업 + 스탬프 적립 2배',
    period: '~ 2025. 03. 01',
    thumb: '/assets/images/campaigns/cafe-yeonnam.jpg',
    href: '/campaigns/cafe-yeonnam-1',
    tag: '주말 한정',
    lat: 37.5668,
    lng: 126.9239,
  },
  {
    id: 'cafe-bundang-1',
    cafeName: '분당 • 카페 테라스',
    title: '패밀리 세트 디저트 무료 제공',
    benefit: '4잔 이상 주문 + QR 참여 시 디저트 1개 무료',
    period: '~ 2025. 01. 10',
    thumb: '/assets/images/campaigns/cafe-bundang.jpg',
    href: '/campaigns/cafe-bundang-1',
    tag: '패밀리 추천',
    lat: 37.3858,
    lng: 127.1246,
  },
];

/* 거리 계산 (Haversine) */
const toRad = (value: number) => (value * Math.PI) / 180;
const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371000; // m
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function Page() {
  // 컵홀더 슬라이더
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slidesLength = SLIDE_TITLES.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 히어로 배너 슬라이더
  const [heroIndex, setHeroIndex] = useState(0);
  const heroTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 모바일 메뉴
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdMenuOpen, setIsAdMenuOpen] = useState(false);
  const [isCommOpen, setIsCommOpen] = useState(false);

  // 챗봇 모달
  const [chatOpen, setChatOpen] = useState(false);

  // 당첨자 인덱스 + 티커 전용 상태
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [disableTickerTransition, setDisableTickerTransition] =
    useState(false);

  // 카카오 지도 관련 상태
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const markerMapRef = useRef<Record<string, any>>({});
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [selectedRadius, setSelectedRadius] = useState<number>(3000);
  const [visibleCampaigns, setVisibleCampaigns] =
    useState<typeof CAMPAIGNS>(CAMPAIGNS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const slidesLengthMemo = slidesLength;

  // 당첨자 확장 배열 (마지막에 첫번째를 한 번 더 붙임)
  const extendedWinners = useMemo(() => [...WINNERS, WINNERS[0]], []);

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

  // 컵홀더 슬라이더 이동
  const go = useCallback(
    (n: number) => {
      setCurrentSlideIndex((n + slidesLengthMemo) % slidesLengthMemo);
    },
    [slidesLengthMemo],
  );
  const next = useCallback(
    () => go(currentSlideIndex + 1),
    [currentSlideIndex, go],
  );
  const prev = useCallback(
    () => go(currentSlideIndex - 1),
    [currentSlideIndex, go],
  );

  // 리빌 애니메이션
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    if ('scrollRestoration' in history)
      (history as any).scrollRestoration = 'manual';

    const onLoad = () => {
      document.documentElement.style.scrollBehavior = 'smooth';
    };
    window.addEventListener('load', onLoad);

    const reveals = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal'),
    );

    const show = (el: HTMLElement) => {
      const delay = Number(el.dataset.delay || 0);
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.classList.add('active');
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              show(e.target as HTMLElement);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
      );

      reveals.forEach((el) => {
        const r = el.getBoundingClientRect();
        const inView =
          r.top < (window.innerHeight || 0) * 0.9 && r.bottom > 0;
        if (inView) show(el);
        else io.observe(el);
      });

      return () => {
        window.removeEventListener('load', onLoad);
        io.disconnect();
      };
    } else {
      // IntersectionObserver 미지원 브라우저: 처음 화면에 보이는 요소만 등장시키기
      reveals.forEach((el) => {
        const r = el.getBoundingClientRect();
        const inView =
          r.top < (window.innerHeight || 0) * 0.9 && r.bottom > 0;
        if (inView) show(el);
      });

      return () => {
        window.removeEventListener('load', onLoad);
      };
    }
  }, []);

  // 컵홀더 슬라이더 자동재생 (10초)
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next]);

  // 히어로 배너 자동재생 (5초)
  useEffect(() => {
    if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    heroTimerRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => {
      if (heroTimerRef.current) clearInterval(heroTimerRef.current);
    };
  }, []);

  // 컵홀더 이미지
  const SLIDES = useMemo(
    () => [
      { src: '/assets/images/ads/slide1.png', speed: '0.06' },
      { src: '/assets/images/ads/slide2.png', speed: '0.08' },
      { src: '/assets/images/ads/slide3.png', speed: '0.05' },
      { src: '/assets/images/ads/slide4.png', speed: '0.07' },
    ],
    [],
  );
  const FALLBACK_IMG = '/assets/images/ads/slide4.png';

  // 당첨자 티커: 2초마다 한 줄씩 위로
  useEffect(() => {
    const t = setInterval(() => {
      setWinnerIndex((prev) => prev + 1);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  // 티커 transition 끝났을 때, 맨 마지막(복제된 첫 줄)까지 갔으면
  const handleTickerTransitionEnd = () => {
    if (winnerIndex === extendedWinners.length - 1) {
      setDisableTickerTransition(true);
      setWinnerIndex(0);
    }
  };

  // disableTickerTransition true → 다음 프레임에 다시 애니메이션 켜기
  useEffect(() => {
    if (disableTickerTransition) {
      const id = requestAnimationFrame(() => {
        setDisableTickerTransition(false);
      });
      return () => cancelAnimationFrame(id);
    }
  }, [disableTickerTransition]);

  /* ================================
     카카오 지도: SDK 로딩
  ================================= */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        setIsKakaoLoaded(true);
      });
      return;
    }

    const existingScript =
      document.querySelector<HTMLScriptElement>(
        'script[data-kakao-map-sdk="true"]',
      );
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => setIsKakaoLoaded(true));
        }
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`;
    script.async = true;
    script.setAttribute('data-kakao-map-sdk', 'true');
    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setIsKakaoLoaded(true);
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  /* ================================
     카카오 지도: 초기화
  ================================= */
  useEffect(() => {
    if (!isKakaoLoaded || !mapContainerRef.current || map) return;
    const kakao = window.kakao;
    const center = new kakao.maps.LatLng(
      DEFAULT_CENTER.lat,
      DEFAULT_CENTER.lng,
    );
    const m = new kakao.maps.Map(mapContainerRef.current, {
      center,
      level: 5,
    });
    setMap(m);
  }, [isKakaoLoaded, map]);

  /* ================================
     위치 버튼 클릭
  ================================= */
  const handleLocateClick = () => {
    if (!navigator.geolocation) {
      setLocationError('브라우저에서 위치 정보를 지원하지 않습니다.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        setLocationError(
          '현재 위치를 가져오지 못했습니다. 위치 권한을 다시 확인해주세요.',
        );
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const handleRadiusChange = (value: number) => {
    setSelectedRadius(value);
  };

  const focusCampaignOnMap = (campaignId: string) => {
    if (!map || !isKakaoLoaded) return;
    const kakao = window.kakao;
    const campaign = CAMPAIGNS.find((c) => c.id === campaignId);
    if (!campaign || !campaign.lat || !campaign.lng) return;

    const position = new kakao.maps.LatLng(campaign.lat, campaign.lng);
    map.panTo(position);
    setSelectedCampaignId(campaignId);
  };

  /* ================================
     카카오 지도: 마커 / 반경 / 필터링
  ================================= */
  useEffect(() => {
    if (!map || !isKakaoLoaded) return;
    const kakao = window.kakao;

    // 기존 마커/도형 제거
    markersRef.current.forEach((marker) => {
      if (marker && marker.setMap) marker.setMap(null);
    });
    markersRef.current = [];
    markerMapRef.current = {};

    let filtered = CAMPAIGNS;

    // 유저 위치 기준 필터링
    if (userPos) {
      filtered = CAMPAIGNS.filter((c) => {
        if (!c.lat || !c.lng) return false;
        const dist = getDistance(
          userPos.lat,
          userPos.lng,
          c.lat,
          c.lng,
        );
        return dist <= selectedRadius;
      });

      const center = new kakao.maps.LatLng(userPos.lat, userPos.lng);
      map.setCenter(center);
    }

    setVisibleCampaigns(filtered);

    // 반경 표시
    if (userPos) {
      const circle = new kakao.maps.Circle({
        center: new kakao.maps.LatLng(userPos.lat, userPos.lng),
        radius: selectedRadius,
        strokeWeight: 1,
        strokeColor: '#3b82f6',
        strokeOpacity: 0.7,
        strokeStyle: 'shortdash',
        fillColor: '#3b82f6',
        fillOpacity: 0.12,
      });
      circle.setMap(map);
      markersRef.current.push(circle);

      const userMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(userPos.lat, userPos.lng),
        map,
      });
      markersRef.current.push(userMarker);
    }

    // 캠페인 마커 (커스텀 빨간 핀)
    filtered.forEach((c) => {
      if (!c.lat || !c.lng) return;

      const position = new kakao.maps.LatLng(c.lat, c.lng);

      // 빨간 핀 이미지
      const imageSrc = '/assets/images/icons/map-pin-red.png';
      const imageSize = new kakao.maps.Size(32, 40);
      const imageOption = {
        offset: new kakao.maps.Point(16, 40),
      };

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption,
      );

      const marker = new kakao.maps.Marker({
        position,
        map,
        image: markerImage,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedCampaignId(c.id);
        map.panTo(position);
      });

      markersRef.current.push(marker);
      markerMapRef.current[c.id] = marker;
    });
  }, [map, userPos, selectedRadius, isKakaoLoaded]);

  return (
    <>
      {/* 전역 스타일 */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html{scroll-behavior:smooth;}
          .reveal{
            opacity:0;
            transform:translateY(16px) scale(.98);
            filter:blur(3px);
            transition:
              opacity .6s cubic-bezier(.2,.6,.2,1),
              transform .6s cubic-bezier(.2,.6,.2,1),
              filter .6s cubic-bezier(.2,.6,.2,1);
            will-change:transform,opacity,filter;
          }
          .reveal.active{opacity:1; transform:translateY(0) scale(1); filter:blur(0)}
          .reveal[data-anim="left"]{transform:translateX(-30px) scale(.95); filter:blur(4px);}
          .reveal[data-anim="left"].active{transform:translateX(0) scale(1); filter:blur(0);}
          .reveal[data-anim="right"]{transform:translateX(30px) scale(.95); filter:blur(4px);}
          .reveal[data-anim="right"].active{transform:translateX(0) scale(1); filter:blur(0);}
          .reveal[data-anim="up"]{transform:translateY(30px) scale(.95); filter:blur(4px);}
          .reveal[data-anim="up"].active{transform:translateY(0) scale(1); filter:blur(0);}
          .reveal[data-anim="down"]{transform:translateY(-30px) scale(.95); filter:blur(4px);}
          .reveal[data-anim="down"].active{transform:translateY(0) scale(1); filter:blur(0);}
          .reveal[data-anim="scale"]{transform:scale(.7); filter:blur(5px);}
          .reveal[data-anim="scale"].active{transform:scale(1); filter:blur(0);}
          .reveal[data-anim="zoom-in"]{transform:scale(.5); opacity:0; filter:blur(6px);}
          .reveal[data-anim="zoom-in"].active{transform:scale(1); opacity:1; filter:blur(0);}
          .reveal[data-anim="zoom-out"]{transform:scale(1.3); opacity:0; filter:blur(6px);}
          .reveal[data-anim="zoom-out"].active{transform:scale(1); opacity:1; filter:blur(0);}
          .reveal[data-anim="rotate"]{transform:rotate(-5deg) scale(.9); opacity:0; filter:blur(4px);}
          .reveal[data-anim="rotate"].active{transform:rotate(0deg) scale(1); opacity:1; filter:blur(0);}
          .reveal[data-anim="rotate-left"]{transform:rotate(-10deg) translateX(-20px); opacity:0; filter:blur(4px);}
          .reveal[data-anim="rotate-left"].active{transform:rotate(0deg) translateX(0); opacity:1; filter:blur(0);}
          .reveal[data-anim="rotate-right"]{transform:rotate(10deg) translateX(20px); opacity:0; filter:blur(4px);}
          .reveal[data-anim="rotate-right"].active{transform:rotate(0deg) translateX(0); opacity:1; filter:blur(0);}
          .reveal[data-anim="diagonal-left"]{transform:translate(-30px, 30px) scale(.9); opacity:0; filter:blur(4px);}
          .reveal[data-anim="diagonal-left"].active{transform:translate(0, 0) scale(1); opacity:1; filter:blur(0);}
          .reveal[data-anim="diagonal-right"]{transform:translate(30px, 30px) scale(.9); opacity:0; filter:blur(4px);}
          .reveal[data-anim="diagonal-right"].active{transform:translate(0, 0) scale(1); opacity:1; filter:blur(0);}
          .reveal[data-anim="fade"]{opacity:0; transform:scale(1); filter:blur(0);}
          .reveal[data-anim="fade"].active{opacity:1; transform:scale(1); filter:blur(0);}
          .reveal[data-anim="slide-fade-up"]{transform:translateY(40px); opacity:0; filter:blur(5px);}
          .reveal[data-anim="slide-fade-up"].active{transform:translateY(0); opacity:1; filter:blur(0);}
          .reveal[data-anim="slide-fade-down"]{transform:translateY(-40px); opacity:0; filter:blur(5px);}
          .reveal[data-anim="slide-fade-down"].active{transform:translateY(0); opacity:1; filter:blur(0);}
          .floaty{will-change:transform; animation:floaty 6s ease-in-out infinite;}
          @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
          a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid #3b82f6; outline-offset:2px;}
          .glass{background:rgba(255,255,255,.8); backdrop-filter:saturate(160%) blur(6px);}
        `,
        }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded shadow"
      >
        본문 바로가기
      </a>

      {/* ================= 당첨자 스트립 (헤더 위, 고정) ================= */}
      <section className="fixed top-0 left-0 right-0 z-[60] bg-neutral-900 text-white text-sm md:text-base">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-12 h-11 md:h-12 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-sm md:text-base">
              🎉 최근 당첨자
            </span>
            <div className="overflow-hidden h-7">
              <div
                className={`flex flex-col ${
                  disableTickerTransition
                    ? ''
                    : 'transition-transform duration-500'
                }`}
                style={{
                  transform: `translateY(-${winnerIndex * 28}px)`,
                }}
                onTransitionEnd={handleTickerTransitionEnd}
              >
                {extendedWinners.map((w, idx) => (
                  <div
                    key={`${w.name}-${idx}`}
                    className="h-7 flex items-center justify-center text-xs md:text-sm"
                  >
                    <span className="font-semibold mr-1">{w.name}님</span>
                    <span>{w.prize}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HEADER ================= */}
      <header
        id="site-header"
        className="fixed top-[44px] left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-200"
      >
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <a
              href="#hero"
              className="flex items-center gap-3 reveal"
              data-anim="fade"
              data-delay="0"
              aria-label="위드폼 홈으로"
            >
              <img
                src="/assets/images/logo/withfom-logo-horizontal.png"
                alt="위드폼 With FoM 로고"
                className="h-[40px] md:h-[60px] w-auto reveal"
                data-anim="zoom-in"
                data-delay="50"
              />
            </a>

            {/* 데스크톱 내비 */}
            <nav
              className="hidden md:flex items-center gap-6 text-gray-800 reveal"
              data-anim="slide-fade-down"
              data-delay="100"
            >
              {/* Home 링크 */}
              <a
                href="#hero"
                className="py-2 font-medium hover:text-blue-600 reveal"
                data-anim="fade"
                data-delay="110"
              >
                Home
              </a>

              <div className="relative group">
                <button
                  className="py-2 font-medium hover:text-blue-600 reveal"
                  data-anim="fade"
                  data-delay="120"
                  aria-haspopup="true"
                >
                  광고매체
                </button>
                <div className="absolute left-0 top-full mt-2 min-w-[220px] p-3 bg-white border border-neutral-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="#pro-modes"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100 reveal"
                        data-anim="slide-fade-up"
                        data-delay="0"
                        role="menuitem"
                      >
                        컵홀더 광고
                      </a>
                    </li>
                    <li>
                      <a
                        href="/delivery.html"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100 reveal"
                        data-anim="slide-fade-up"
                        data-delay="50"
                        role="menuitem"
                      >
                        배달박스 광고
                      </a>
                    </li>
                    <li>
                      <a
                        href="/bag.html"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100 reveal"
                        data-anim="slide-fade-up"
                        data-delay="100"
                        role="menuitem"
                      >
                        포장봉투 광고
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <a
                href="/guide"
                className="py-2 font-medium hover:text-blue-600 reveal"
                data-anim="fade"
                data-delay="140"
              >
                이용가이드
              </a>
              <div className="relative group">
                <button
                  className="py-2 font-medium hover:text-blue-600 reveal"
                  data-anim="fade"
                  data-delay="160"
                  aria-haspopup="true"
                >
                  커뮤니티
                </button>
                <div className="absolute left-0 top-full mt-2 min-w-[220px] p-3 bg-white border border-neutral-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <ul className="space-y-1">
                    <li>
                      <a
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100 reveal"
                        data-anim="slide-fade-up"
                        data-delay="0"
                        role="menuitem"
                      >
                        공지사항
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100 reveal"
                        data-anim="slide-fade-up"
                        data-delay="50"
                        role="menuitem"
                      >
                        Q&amp;A
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block rounded-lg px-3 py-2 hover:bg-neutral-100 reveal"
                        data-anim="slide-fade-up"
                        data-delay="100"
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

          {/* 우측 버튼 + 모바일 햄버거 */}
          <div
            className="flex items-center gap-3 reveal"
            data-anim="fade"
            data-delay="180"
          >
            <a
              href="/customer"
              onClick={closeMenu}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-semibold hidden md:inline-flex reveal"
              data-anim="scale"
              data-delay="200"
            >
              로그인
            </a>
            <a
              href="/partner/login"
              onClick={closeMenu}
              className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-900 font-semibold hidden md:inline-flex reveal"
              data-anim="zoom-in"
              data-delay="220"
            >
              파트너사 페이지
            </a>
            <a
              href="/advertiser/login"
              onClick={closeMenu}
              className="bg-neutral-800 text-white px-4 py-2 rounded-md hover:bg-neutral-900 font-semibold hidden md:inline-flex reveal"
              data-anim="zoom-in"
              data-delay="240"
            >
              광고주 페이지
            </a>

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100 reveal"
              data-anim="rotate"
              data-delay="200"
              aria-label="메뉴 열기/닫기"
              aria-expanded={isMenuOpen}
              aria-controls="mobileMenuPanel"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16m-7 6h7'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 당첨바 + 헤더 높이 합산 스페이서 (44 + 72 = 116px) */}
      <div className="h-[116px]" />

      {/* ===== 모바일 메뉴 오버레이 ===== */}
      <div
        className={`fixed inset-0 top-[116px] bg-black/40 z-[65] md:hidden transition-opacity duration-300 ${
          isMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
        aria-hidden="true"
      />
      <div
        id="mobileMenuPanel"
        className={`fixed inset-0 top-[116px] bg-white z-[70] md:hidden overflow-y-auto transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="모바일 메뉴"
      >
        <div className="p-6">
          <nav className="flex flex-col gap-1 text-lg font-semibold text-neutral-800 border-b border-neutral-200 pb-4">
            {/* Home 링크 (모바일) */}
            <a
              href="#hero"
              onClick={closeMenu}
              className="py-3 hover:text-blue-600 border-b border-neutral-100"
            >
              Home
            </a>

            {/* 광고매체 아코디언 */}
            <div className="border-b border-neutral-100">
              <button
                onClick={() => setIsAdMenuOpen((prev) => !prev)}
                className="flex justify-between items-center w-full py-3 hover:text-blue-600"
                aria-expanded={isAdMenuOpen}
              >
                광고매체
                <span
                  className={`transition-transform duration-200 ${
                    isAdMenuOpen ? 'rotate-90' : 'rotate-0'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-[max-height,opacity] duration-300"
                style={{
                  maxHeight: isAdMenuOpen ? '500px' : 0,
                  opacity: isAdMenuOpen ? 1 : 0,
                }}
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
                    onKeyDown={(e) =>
                      e.key === 'Enter' && closeMenu()
                    }
                    className="block rounded-lg px-4 py-2 text-base font-normal text-neutral-600 hover:bg-neutral-100"
                  >
                    포장봉투 광고
                  </a>
                </div>
              </div>
            </div>

            <a
              href="/guide"
              onClick={closeMenu}
              className="py-3 hover:text-blue-600 border-b border-neutral-100"
            >
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
                <span
                  className={`transition-transform duration-200 ${
                    isCommOpen ? 'rotate-90' : 'rotate-0'
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </span>
              </button>
              <div
                className="overflow-hidden transition-[max-height,opacity] duration-300"
                style={{
                  maxHeight: isCommOpen ? '500px' : 0,
                  opacity: isCommOpen ? 1 : 0,
                }}
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
              href="/customer"
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
              href="/advertiser/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-3 rounded-md bg-neutral-900 text-white font-semibold hover:bg-neutral-800 active:scale-[.99] transition"
            >
              광고주 페이지
            </a>
            
          </div>
        </div>
      </div>

      {/* ================= NAV 밑 검색창 ================= */}
      <section className="relative bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-[1600px] px-4 md:px-6 lg:px-12 py-4">
          <form
            className="max-w-[640px] mx-auto flex items-center gap-3 reveal"
            data-anim="slide-fade-up"
            data-delay="40"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              className="flex-1 rounded-full border border-neutral-300 px-4 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="원하는 이벤트나 선물을 검색해보세요"
            />
            <button
              type="submit"
              className="shrink-0 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm md:text-base font-semibold hover:bg-neutral-800"
            >
              검색
            </button>
          </form>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <main id="main" className="bg-white text-neutral-900">
        {/* HERO – 1260 x 890 비율 중앙 배너 */}
        <section id="hero" className="w-full bg-white">
          <div
            className="relative w-full aspect-[1260/890] overflow-hidden reveal"
            data-anim="zoom-in"
            data-delay="0"
          >
            {HERO_SLIDES.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`위드폼 배너 ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  heroIndex === idx ? 'opacity-100' : 'opacity-0'
                }`}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (!img.src.endsWith('banner.png')) {
                    img.src = HERO_FALLBACK;
                  }
                }}
              />
            ))}

            {/* 하단 점 인디케이터 */}
            <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center">
              <div className="flex items-center gap-2">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setHeroIndex(idx)}
                    className="h-2.5 w-2.5 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        heroIndex === idx
                          ? 'rgba(0,0,0,0.95)'
                          : 'rgba(0,0,0,0.35)',
                    }}
                    aria-label={`${idx + 1}번 배너 보기`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 컵홀더 광고 슬라이더 */}
        <section
          id="pro-modes"
          className="scroll-mt-[90px] relative mx-auto max-w-[1600px] px-6 lg:px-12 mt-24 md:mt-32 mb-16 reveal"
          data-anim="up"
          data-delay="0"
        >
          <div className="mb-6">
            <div
              className="flex items-center gap-2 reveal"
              data-anim="diagonal-left"
              data-delay="20"
            >
              <h2
                className="text-3xl md:text-5xl font-extrabold leading-tight text-neutral-900 reveal"
                data-anim="slide-fade-up"
                data-delay="40"
              >
                캠페인 이용가이드
              </h2>
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 reveal"
                data-anim="rotate-right"
                data-delay="80"
              >
                →
              </span>
            </div>
            <p
              className="mt-3 text-neutral-600 text-[15px] md:text-base reveal"
              data-anim="fade"
              data-delay="100"
            >
              일상에 스며드는 똑똑한 생활광고를 이용하는 똑똑한 방법!
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-[13px] bg-neutral-100 text-neutral-700 reveal"
                data-anim="zoom-in"
                data-delay="160"
              >
                지역광고
              </span>
              <span
                className="px-3 py-1 rounded-full text-[13px] bg-neutral-100 text-neutral-700 reveal"
                data-anim="zoom-in"
                data-delay="220"
              >
                정밀타겟광고
              </span>
            </div>
          </div>

          <div
            id="pmCarousel"
            className="relative bg-neutral-100/60 rounded-3xl p-4 md:p-8 min-h-[420px] md:min-h-[460px] overflow-hidden reveal"
            data-anim="up"
            data-delay="200"
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

            <div
              id="pmTrack"
              className="absolute inset-0"
              suppressHydrationWarning
            >
              {SLIDES.map((slide, idx) => (
                <article
                  key={idx}
                  className={`pm-slide absolute inset-0 transition-opacity duration-500 ${
                    currentSlideIndex === idx
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  data-parallax
                  data-speed={slide.speed}
                >
                  <div
                    className="absolute inset-0 bg-neutral-200 rounded-2xl reveal"
                    data-anim="fade"
                    data-delay={`${idx * 50}`}
                    aria-hidden
                  />
                  <img
                    src={slide.src}
                    alt={`컵홀더광고 ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      const img = e.currentTarget as HTMLImageElement;
                      if (img.src.endsWith('slide4.png')) return;
                      img.src = FALLBACK_IMG;
                    }}
                    className="relative w-full h-full object-cover rounded-2xl reveal"
                    data-anim={idx % 2 === 0 ? 'zoom-in' : 'scale'}
                    data-delay={`${idx * 50 + 100}`}
                  />
                </article>
              ))}
            </div>
          </div>

          {/* 컵홀더 슬라이더 페이저 */}
          <div
            className="mt-6 flex items-center gap-3 reveal"
            data-anim="slide-fade-up"
            data-delay="300"
          >
            {SLIDE_TITLES.map((_, index) => (
              <button
                key={index}
                onClick={() => go(index)}
                className="h-10 w-10 rounded-lg border text-[15px] font-semibold transition reveal"
                data-anim={
                  index % 2 === 0 ? 'rotate-left' : 'rotate-right'
                }
                data-delay={`${60 + index * 80}`}
                aria-selected={currentSlideIndex === index}
                style={
                  currentSlideIndex === index
                    ? {
                        backgroundColor: '#3b82f6',
                        borderColor: '#3b82f6',
                        color: '#fff',
                      }
                    : { borderColor: '#e5e7eb', color: '#374151' }
                }
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* 컵홀더 슬라이더 캡션 */}
          <div
            className="mt-6 reveal"
            data-anim="diagonal-right"
            data-delay="400"
          >
            <h3
              className="text-2xl md:text-3xl font-extrabold text-neutral-900 reveal"
              data-anim="slide-fade-up"
              data-delay="60"
            >
              {SLIDE_TITLES[currentSlideIndex]}
            </h3>
            <p
              className="mt-2 text-neutral-500 text-lg md:text-xl reveal"
              data-anim="fade"
              data-delay="140"
            >
              {SLIDE_DESCS[currentSlideIndex]}
            </p>
          </div>
        </section>

        {/* 추천 캠페인 섹션 */}
        <section
          id="recommended-campaigns"
          className="relative mx-auto max-w-[1600px] px-6 lg:px-12 mt-16 md:mt-24 mb-12 reveal"
          data-anim="up"
          data-delay="0"
        >
          {/* 섹션 헤더 */}
          <div className="mb-8 md:mb-10">
            <div
              className="flex items-center gap-2 reveal"
              data-anim="diagonal-left"
              data-delay="20"
            >
              <h2
                className="text-3xl md:text-5xl font-extrabold leading-tight text-neutral-900 reveal"
                data-anim="slide-fade-up"
                data-delay="40"
              >
                추천 캠페인
              </h2>
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-300 text-neutral-500 reveal"
                data-anim="rotate-right"
                data-delay="80"
              >
                →
              </span>
            </div>
            <p
              className="mt-3 text-neutral-600 text-[15px] md:text-base reveal"
              data-anim="fade"
              data-delay="100"
            >
              지금, 위드폼 파트너 카페에서 참여할 수 있는 캠페인들이에요.
            </p>
          </div>

          {/* 캠페인 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
            {CAMPAIGNS.map((c, idx) => (
              <a
                key={c.id}
                href={c.href}
                className="group rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-lg transition transform duration-200 reveal"
                data-anim={
                  idx % 2 === 0 ? 'slide-fade-up' : 'diagonal-right'
                }
                data-delay={60 + idx * 120}
              >
                {/* 썸네일 영역 */}
                <div className="relative bg-neutral-100 aspect-[4/3] overflow-hidden">
                  <img
                    src={c.thumb}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {c.tag && (
                    <span className="absolute left-3 top-3 px-3 py-1 rounded-full bg-white/90 text-xs font-semibold text-neutral-800 shadow-sm">
                      {c.tag}
                    </span>
                  )}
                </div>

                {/* 텍스트 영역 */}
                <div className="flex-1 flex flex-col px-5 pt-4 pb-5">
                  <div className="text-[12px] font-semibold tracking-wide text-neutral-400 mb-1">
                    {c.cafeName}
                  </div>
                  <h3 className="text-[15px] md:text-base font-semibold text-neutral-900 leading-snug line-clamp-2 mb-2">
                    {c.title}
                  </h3>
                  <p className="text-[13px] md:text-sm text-neutral-600 leading-snug line-clamp-2 mb-4">
                    {c.benefit}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-[12px] text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>진행중 캠페인</span>
                    </span>
                    <span>{c.period}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 내 주변 캠페인 지도 섹션 */}
        <section
          id="campaign-map"
          className="relative mx-auto max-w-[1600px] px-6 lg:px-12 mb-24 reveal"
          data-anim="up"
          data-delay="80"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
            <div>
              <h2
                className="text-2xl md:text-3xl font-extrabold text-neutral-900 reveal"
                data-anim="slide-fade-up"
                data-delay="40"
              >
                내 주변 캠페인 한눈에 보기
              </h2>
              <p
                className="mt-2 text-sm md:text-[15px] text-neutral-600 reveal"
                data-anim="fade"
                data-delay="80"
              >
                위치 기반으로 반경 안에 있는 위드폼 캠페인 카페를 찾아드려요.
                <br className="hidden md:block" />
                위치 권한을 허용하면 내 주변에서 진행 중인 이벤트만 모아서 볼 수
                있어요.
              </p>
            </div>

            {/* 반경 필터 + 내 위치 버튼 */}
            <div
              className="flex flex-wrap items-center gap-2 md:gap-3 reveal"
              data-anim="diagonal-right"
              data-delay="100"
            >
              <div className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-1 py-1">
                {RADIUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleRadiusChange(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition ${
                      selectedRadius === opt.value
                        ? 'bg-neutral-900 text-white shadow-sm'
                        : 'text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleLocateClick}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-xs md:text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                {isLocating ? '내 위치 확인 중...' : '내 주변 이벤트 보기'}
              </button>
            </div>
          </div>

          {locationError && (
            <p className="mb-3 text-xs md:text-sm text-red-500">
              {locationError}
            </p>
          )}

          {/* 지도 + 리스트 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-6 lg:gap-8 items-stretch">
            {/* 지도 영역 */}
            <div
              className="rounded-3xl border border-neutral-200 overflow-hidden bg-neutral-100/70 reveal h-full min-h-[320px]"
              data-anim="slide-fade-up"
              data-delay="140"
            >
              <div ref={mapContainerRef} className="w-full h-full" />
              {!isKakaoLoaded && (
                <div className="flex items-center justify-center h-full text-sm text-neutral-500">
                  지도를 불러오는 중입니다...
                </div>
              )}
            </div>

            {/* 리스트 영역 */}
            <div
              className="rounded-3xl border border-neutral-200 bg-white p-4 md:p-5 flex flex-col reveal"
              data-anim="slide-fade-up"
              data-delay="180"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-sm md:text-base font-semibold text-neutral-900">
                  {userPos ? '반경 내 캠페인 목록' : '전체 캠페인 목록'}
                </h3>
                <span className="text-xs md:text-[13px] text-neutral-500">
                  {visibleCampaigns.length}개 캠페인
                </span>
              </div>
              <div className="mt-1 text-[11px] md:text-xs text-neutral-500">
                카드에 마우스를 올리면 지도가 해당 카페 위치로 이동해요.
              </div>

              <div className="mt-3 space-y-3 overflow-y-auto pr-1 flex-1 min-h-[260px]">
                {visibleCampaigns.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-xs md:text-sm text-neutral-500">
                    <p>선택한 반경 내 진행 중인 캠페인이 없습니다.</p>
                    <p className="mt-1">
                      반경을 넓혀보거나, 위치 권한을 다시 확인해 주세요.
                    </p>
                  </div>
                ) : (
                  visibleCampaigns.map((c) => (
                    <a
                      key={c.id}
                      href={c.href}
                      className={`block rounded-2xl border p-3 md:p-3.5 text-xs md:text-sm transition cursor-pointer ${
                        selectedCampaignId === c.id
                          ? 'border-blue-500 bg-blue-50/80 shadow-sm'
                          : 'border-neutral-200 bg-white hover:bg-neutral-50'
                      }`}
                      onMouseEnter={() => focusCampaignOnMap(c.id)}
                      onFocus={() => focusCampaignOnMap(c.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="hidden sm:block w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                          <img
                            src={c.thumb}
                            alt={c.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400 mb-0.5">
                            <span>{c.cafeName}</span>
                            {c.tag && (
                              <>
                                <span className="text-neutral-300">•</span>
                                <span className="text-neutral-500">
                                  {c.tag}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="font-semibold text-neutral-900 text-[13px] md:text-sm leading-snug line-clamp-2">
                            {c.title}
                          </div>
                          <div className="mt-1 text-[11px] md:text-xs text-neutral-600 line-clamp-2">
                            {c.benefit}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
                            <span className="inline-flex items-center gap-1">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              <span>진행중</span>
                            </span>
                            <span>{c.period}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        className="bg-neutral-100 reveal"
        data-anim="slide-fade-up"
        data-delay="0"
      >
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12 py-12">
          <ul
            className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium text-neutral-700 reveal"
            data-anim="fade"
            data-delay="100"
          >
            {['유튜브', '네이버 블로그', '카카오 채널', '인스타그램'].map(
              (t, i) => (
                <li
                  key={t}
                  className="reveal"
                  data-anim={
                    i % 2 === 0 ? 'diagonal-left' : 'diagonal-right'
                  }
                  data-delay={`${i * 60}`}
                >
                  <a href="#" className="hover:underline">
                    {t}
                  </a>
                </li>
              ),
            )}
          </ul>
          <div
            className="mt-6 space-y-2 text-sm leading-relaxed text-neutral-500 reveal"
            data-anim="fade"
            data-delay="200"
          >
            <p
              className="reveal"
              data-anim="slide-fade-up"
              data-delay="40"
            >
              Copyright © With FoM Inc.
            </p>
            <p className="reveal" data-anim="fade" data-delay="100">
              (주)퍼스트오브메이 | 대표 김은수 | 사업자등록번호 000-00-00000 |
              통신판매업신고번호 0000-경기파주-0000 | 호스팅 사업자 Amazon Web
              Service(AWS)
            </p>
            <p
              className="reveal"
              data-anim="slide-fade-up"
              data-delay="160"
            >
              주소 경기 파주시 청석로272, 10층 1004-106호 (동패동,센타프라자1) |
              전화 문의 031-935-5715
            </p>
          </div>
          <ul
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-neutral-600 reveal"
            data-anim="fade"
            data-delay="300"
          >
            {[
              '개인정보처리방침',
              '이용약관',
              '광고 운영정책',
              '상품판매 운영정책',
            ].map((t, i) => (
              <li
                key={t}
                className="reveal"
                data-anim={i % 2 === 0 ? 'zoom-in' : 'scale'}
                data-delay={`${i * 60 + 80}`}
              >
                <a href="#" className="hover:underline">
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>

      {/* 플로팅 챗봇 버튼 */}
      <button
        id="chatbotBtn"
        className="fixed bottom-6 right-6 z-[60] p-0 reveal"
        data-anim="zoom-in"
        data-delay="0"
        aria-label="챗봇 열기"
        onClick={() => setChatOpen(true)}
      >
        <img
          src="/assets/images/icons/챗봇.png"
          alt="챗봇"
          className="w-[72px] h-[72px] object-contain select-none pointer-events-none transition-transform duration-200 [clip-path:circle(40%)] [filter:drop-shadow(0_6px_18px_rgba(0,0,0,.25))]"
        />
      </button>

      {/* 챗봇 모달 */}
      {chatOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center"
          onClick={() => setChatOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-xl w-[90vw] max-w-[420px] p-6 z-[71] reveal"
            data-anim="zoom-in"
            data-delay="0"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <img
                  src="/assets/images/icons/챗봇.png"
                  alt=""
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  챗봇 서비스 준비중
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  챗봇서비스가 준비중입니다. 빠른 시일 내 오픈하겠습니다.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setChatOpen(false)}
                className="px-4 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50"
              >
                닫기
              </button>
              <a
                href="/support"
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
              >
                1:1 문의
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
