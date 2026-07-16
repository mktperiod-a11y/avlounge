"use client";

/* eslint-disable @next/next/no-img-element -- local licensed WebP portraits use deliberate crop positioning */

import {
  type FormEvent,
  type MouseEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ACTRESSES,
  WORKS,
  actressById,
  kdiskUrl,
  ondiskUrl,
  worksFor,
  type Actress,
  type Work,
} from "./data";

type View = "home" | "ranking" | "actresses" | "codes" | "archive" | "sources";
type RankingMode = "public" | "works" | "saved";

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: "home", label: "라운지" },
  { id: "ranking", label: "배우 랭킹" },
  { id: "actresses", label: "배우 찾기" },
  { id: "codes", label: "전체 품번" },
];

const PAGE_SIZE = 12;

function ArrowIcon({ direction = "right" }: { direction?: "right" | "up" }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      {direction === "up" ? (
        <path d="M5 15 15 5m-8 0h8v8" />
      ) : (
        <path d="M3 10h13m-5-5 5 5-5 5" />
      )}
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

function TicketIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        className={filled ? "is-filled" : ""}
        d="M6.5 3.5h11v17L12 17l-5.5 3.5v-17Z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand${compact ? " brand--compact" : ""}`}>
      <span className="brand__mark">A<span>V</span></span>
      <span className="brand__copy">
        <b>LOUNGE</b>
        <small>PRIVATE INDEX</small>
      </span>
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
        {description && <span>{description}</span>}
      </div>
      {action}
    </div>
  );
}

function ActressCard({
  actress,
  count,
  saved,
  onOpen,
  onSave,
}: {
  actress: Actress;
  count: number;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
}) {
  const handleSave = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onSave();
  };

  return (
    <article className="portrait-card" onClick={onOpen}>
      <button className="portrait-card__image" type="button" onClick={onOpen}>
        <img
          src={actress.image}
          alt={`${actress.nameKo} 공개 행사 사진`}
          style={{ objectPosition: actress.imagePosition }}
          loading="lazy"
        />
        <span className="portrait-card__rank">0{actress.rank}</span>
        <span className="portrait-card__open">프로필 보기 <ArrowIcon /></span>
      </button>
      <div className="portrait-card__caption">
        <button type="button" className="portrait-card__name" onClick={onOpen}>
          <b>{actress.nameKo}</b>
          <span>{actress.nameJp} · {actress.nameEn}</span>
        </button>
        <button
          className="icon-button icon-button--save"
          type="button"
          aria-label={saved ? `${actress.nameKo} 보관함에서 삭제` : `${actress.nameKo} 보관함에 저장`}
          aria-pressed={saved}
          onClick={handleSave}
        >
          <TicketIcon filled={saved} />
        </button>
      </div>
      <small className="portrait-card__meta">확인 품번 {count.toLocaleString("ko-KR")}건</small>
    </article>
  );
}

function WorkRow({
  work,
  saved,
  onOpen,
  onSave,
  onExternal,
  condensed = false,
}: {
  work: Work;
  saved: boolean;
  onOpen: () => void;
  onSave: () => void;
  onExternal: (site: "kdisk" | "ondisk") => void;
  condensed?: boolean;
}) {
  const actress = actressById(work.actressId);
  return (
    <article className={`work-row${condensed ? " work-row--condensed" : ""}`}>
      <button type="button" className="work-row__code" onClick={onOpen}>
        <small>CATALOGUE NO.</small>
        <b>{work.code}</b>
      </button>
      <button type="button" className="work-row__person" onClick={onOpen}>
        <span>{actress.nameKo}</span>
        <small>{actress.nameJp}</small>
      </button>
      {!condensed && <span className="work-row__studio">{work.studio}</span>}
      <div className="work-row__actions">
        <button type="button" onClick={() => onExternal("kdisk")} aria-label={`${work.code} 케이디스크 검색`}>
          K <span>케이디스크</span>
        </button>
        <button type="button" onClick={() => onExternal("ondisk")} aria-label={`${work.code} 온디스크 검색`}>
          O <span>온디스크</span>
        </button>
        <button
          type="button"
          className="work-row__save"
          onClick={onSave}
          aria-label={saved ? `${work.code} 보관함에서 삭제` : `${work.code} 보관함에 저장`}
          aria-pressed={saved}
        >
          <TicketIcon filled={saved} />
        </button>
        <button type="button" className="work-row__arrow" onClick={onOpen} aria-label={`${work.code} 상세 보기`}>
          <ArrowIcon />
        </button>
      </div>
    </article>
  );
}

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (page: number) => void }) {
  if (total <= 1) return null;
  const visible = Array.from({ length: total }, (_, index) => index + 1).filter(
    (number) => number === 1 || number === total || Math.abs(number - page) <= 1,
  );
  return (
    <nav className="pagination" aria-label="페이지 이동">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>이전</button>
      <div>
        {visible.map((number, index) => (
          <span key={number}>
            {index > 0 && number - visible[index - 1] > 1 && <i>…</i>}
            <button
              type="button"
              className={page === number ? "is-active" : ""}
              aria-current={page === number ? "page" : undefined}
              onClick={() => onChange(number)}
            >
              {String(number).padStart(2, "0")}
            </button>
          </span>
        ))}
      </div>
      <button type="button" disabled={page === total} onClick={() => onChange(page + 1)}>다음</button>
    </nav>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedActress, setSelectedActress] = useState<Actress | null>(null);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actressQuery, setActressQuery] = useState("");
  const [codeQuery, setCodeQuery] = useState("");
  const [studio, setStudio] = useState("전체");
  const [workSort, setWorkSort] = useState<"latest" | "oldest" | "code">("latest");
  const [actressSort, setActressSort] = useState<"rank" | "name" | "works">("rank");
  const [rankingMode, setRankingMode] = useState<RankingMode>("public");
  const [codePage, setCodePage] = useState(1);
  const [detailPage, setDetailPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionSent, setCorrectionSent] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let storedFavorites: string[] = [];
    try {
      const stored = window.localStorage.getItem("avlounge:archive:v1");
      if (stored) storedFavorites = JSON.parse(stored);
    } catch {}
    const frame = window.requestAnimationFrame(() => {
      setFavorites(storedFavorites);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("avlounge:archive:v1", JSON.stringify(favorites));
  }, [favorites, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const modalOpen = Boolean(selectedActress || selectedWork || searchOpen || correctionOpen);
    document.body.classList.toggle("modal-open", modalOpen);
    return () => document.body.classList.remove("modal-open");
  }, [selectedActress, selectedWork, searchOpen, correctionOpen]);

  const workCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    WORKS.forEach((work) => { counts[work.actressId] = (counts[work.actressId] || 0) + 1; });
    return counts;
  }, []);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const isSaved = (key: string) => favoriteSet.has(key);
  const toggleSaved = (key: string, label: string) => {
    setFavorites((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
    setToast(favoriteSet.has(key) ? `${label}을 보관함에서 뺐어요.` : `${label}을 보관함에 담았어요.`);
  };

  const go = (next: View) => {
    setView(next);
    setSelectedActress(null);
    setSelectedWork(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openActress = (actress: Actress) => {
    setSelectedWork(null);
    setSelectedActress(actress);
    setDetailPage(1);
  };

  const openWork = (work: Work) => {
    setSelectedWork(work);
  };

  const openExternal = (site: "kdisk" | "ondisk", term: string) => {
    const url = site === "kdisk" ? kdiskUrl(term) : ondiskUrl(term);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (opened) opened.opener = null;
    setToast(`${term} 검색 페이지를 새 창으로 열었어요.`);
  };

  const submitHeroSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchOpen(true);
  };

  const searchTerm = searchQuery.trim().toLowerCase();
  const searchedActresses = ACTRESSES.filter((actress) =>
    [actress.nameKo, actress.nameJp, actress.nameEn].some((name) => name.toLowerCase().includes(searchTerm)),
  );
  const searchedWorks = WORKS.filter((work) => work.code.toLowerCase().includes(searchTerm)).slice(0, 12);

  const directoryActresses = useMemo(() => {
    const term = actressQuery.trim().toLowerCase();
    const filtered = ACTRESSES.filter((actress) =>
      [actress.nameKo, actress.nameJp, actress.nameEn].some((name) => name.toLowerCase().includes(term)),
    );
    return [...filtered].sort((a, b) => {
      if (actressSort === "name") return a.nameKo.localeCompare(b.nameKo, "ko");
      if (actressSort === "works") return (workCounts[b.id] || 0) - (workCounts[a.id] || 0);
      return a.rank - b.rank;
    });
  }, [actressQuery, actressSort, workCounts]);

  const filteredWorks = useMemo(() => {
    const term = codeQuery.trim().toLowerCase();
    const filtered = WORKS.filter((work) => {
      const actress = actressById(work.actressId);
      const matchesTerm = !term || work.code.toLowerCase().includes(term) || actress.nameKo.includes(term) || actress.nameJp.includes(term) || actress.nameEn.toLowerCase().includes(term);
      return matchesTerm && (studio === "전체" || work.studio === studio);
    });
    return [...filtered].sort((a, b) => {
      if (workSort === "code") return a.code.localeCompare(b.code);
      if (workSort === "oldest") return b.order - a.order;
      return a.order - b.order;
    });
  }, [codeQuery, studio, workSort]);

  const pageWorks = filteredWorks.slice((codePage - 1) * PAGE_SIZE, codePage * PAGE_SIZE);
  const totalCodePages = Math.max(1, Math.ceil(filteredWorks.length / PAGE_SIZE));
  const studios = ["전체", ...Array.from(new Set(WORKS.map((work) => work.studio)))];

  const rankedActresses = useMemo(() => {
    const result = [...ACTRESSES];
    if (rankingMode === "works") return result.sort((a, b) => workCounts[b.id] - workCounts[a.id]);
    if (rankingMode === "saved") return result.sort((a, b) => Number(favoriteSet.has(`actress:${b.id}`)) - Number(favoriteSet.has(`actress:${a.id}`)) || a.rank - b.rank);
    return result.sort((a, b) => a.rank - b.rank);
  }, [rankingMode, workCounts, favoriteSet]);

  const archiveActresses = ACTRESSES.filter((actress) => isSaved(`actress:${actress.id}`));
  const archiveWorks = WORKS.filter((work) => isSaved(`work:${work.code}`));

  const changeCodePage = (page: number) => {
    setCodePage(page);
    document.querySelector(".catalogue-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="frame site-header__inner">
          <button className="logo-button" type="button" onClick={() => go("home")} aria-label="AV라운지 홈">
            <Brand />
          </button>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} type="button" className={view === item.id ? "is-active" : ""} onClick={() => go(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="header-actions">
            <button type="button" className="header-search" onClick={() => setSearchOpen(true)}>
              <SearchIcon /><span>배우·품번 검색</span>
            </button>
            <button type="button" className={`archive-button${view === "archive" ? " is-active" : ""}`} onClick={() => go("archive")}>
              <TicketIcon filled={favorites.length > 0} />
              <span>보관함</span>
              {favorites.length > 0 && <b>{favorites.length}</b>}
            </button>
          </div>
        </div>
      </header>

      <main>
        {view === "home" && (
          <>
            <section className="hero">
              <div className="hero__portrait">
                <img src={ACTRESSES[0].image} alt="세토 칸나 공개 행사 사진" style={{ objectPosition: ACTRESSES[0].imagePosition }} />
                <div className="hero__portrait-shade" />
                <div className="hero__issue">
                  <span>LOUNGE ISSUE</span>
                  <b>01</b>
                </div>
                <button type="button" className="hero__subject" onClick={() => openActress(ACTRESSES[0])}>
                  <small>THIS MONTH&apos;S INDEX</small>
                  <strong>{ACTRESSES[0].nameKo}</strong>
                  <span>{ACTRESSES[0].nameJp} · {ACTRESSES[0].nameEn}</span>
                </button>
              </div>
              <div className="hero__content">
                <p className="eyebrow">PRIVATE CATALOGUE · SEOUL</p>
                <h1>오늘은 누구를<br />찾고 있나요?</h1>
                <p className="hero__lead">배우부터 품번까지,<br />취향이 머무는 가장 조용한 인덱스.</p>
                <form className="hero-search" onSubmit={submitHeroSearch}>
                  <SearchIcon />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="배우명 또는 품번을 입력하세요"
                    aria-label="배우명 또는 품번 검색"
                  />
                  <button type="submit" aria-label="검색 열기"><ArrowIcon /></button>
                </form>
                <div className="hero__links">
                  <button type="button" onClick={() => go("ranking")}>배우 랭킹 보기 <ArrowIcon /></button>
                  <button type="button" onClick={() => go("codes")}>전체 품번 보기 <ArrowIcon /></button>
                </div>
                <div className="hero__stats">
                  <span><b>{ACTRESSES.length}</b> FEATURED ACTRESSES</span>
                  <span><b>{WORKS.length}</b> VERIFIED CODES</span>
                </div>
                <span className="hero__vertical">CURATED AV INDEX · 2026</span>
              </div>
            </section>

            <section className="ranking-spread frame section-space">
              <SectionTitle
                eyebrow="MONTHLY SELECTION · 2026.06"
                title="이번 달 배우 랭킹"
                description="공개 월간 자료를 기준으로 출처와 시점을 분리해 표시합니다."
                action={<button className="text-link" type="button" onClick={() => go("ranking")}>전체 랭킹 <ArrowIcon /></button>}
              />
              <div className="ranking-spread__grid">
                <button className="ranking-feature" type="button" onClick={() => openActress(ACTRESSES[0])}>
                  <img src={ACTRESSES[0].image} alt="" style={{ objectPosition: ACTRESSES[0].imagePosition }} />
                  <span className="ranking-feature__number">01</span>
                  <div>
                    <small>MONTHLY NO.1</small>
                    <h3>{ACTRESSES[0].nameKo}</h3>
                    <p>{ACTRESSES[0].nameJp} · {ACTRESSES[0].nameEn}</p>
                    <span>확인 품번 {workCounts[ACTRESSES[0].id]}건 <ArrowIcon /></span>
                  </div>
                </button>
                <div className="ranking-list">
                  {ACTRESSES.slice(1, 6).map((actress) => (
                    <button type="button" key={actress.id} onClick={() => openActress(actress)}>
                      <b>{String(actress.rank).padStart(2, "0")}</b>
                      <img src={actress.image} alt="" style={{ objectPosition: actress.imagePosition }} />
                      <span><strong>{actress.nameKo}</strong><small>{actress.nameJp} · {actress.nameEn}</small></span>
                      <i className={`trend trend--${actress.trend}`}>{actress.trend === "up" ? "↗" : actress.trend === "down" ? "↘" : "—"}</i>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="home-catalogue section-space">
              <div className="frame">
                <SectionTitle
                  eyebrow="NEW IN THE INDEX"
                  title="새로 채워진 품번"
                  description={`현재 ${WORKS.length.toLocaleString("ko-KR")}개 품번을 배우 프로필과 연결했습니다.`}
                  action={<button className="text-link text-link--light" type="button" onClick={() => go("codes")}>모든 품번 <ArrowIcon /></button>}
                />
                <div className="home-catalogue__list">
                  {WORKS.slice(0, 6).map((work) => (
                    <WorkRow
                      key={work.code}
                      work={work}
                      saved={isSaved(`work:${work.code}`)}
                      onOpen={() => openWork(work)}
                      onSave={() => toggleSaved(`work:${work.code}`, work.code)}
                      onExternal={(site) => openExternal(site, work.code)}
                      condensed
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="frame home-actresses section-space">
              <SectionTitle
                eyebrow="PORTRAIT DIRECTORY"
                title="배우를 찾아보세요"
                description="한글·일본어·로마자 이름과 연결된 품번을 함께 탐색합니다."
                action={<button className="text-link" type="button" onClick={() => go("actresses")}>배우 전체 보기 <ArrowIcon /></button>}
              />
              <div className="portrait-grid portrait-grid--home">
                {ACTRESSES.slice(2, 6).map((actress) => (
                  <ActressCard
                    key={actress.id}
                    actress={actress}
                    count={workCounts[actress.id] || 0}
                    saved={isSaved(`actress:${actress.id}`)}
                    onOpen={() => openActress(actress)}
                    onSave={() => toggleSaved(`actress:${actress.id}`, actress.nameKo)}
                  />
                ))}
              </div>
            </section>

            <section className="archive-banner frame section-space">
              <div className="archive-banner__ornament"><span>MY</span><b>ARCHIVE</b></div>
              <div>
                <p>LOUNGE ARCHIVE</p>
                <h2>마음에 든 배우와 품번은<br />라운지 티켓에 담아두세요.</h2>
                <span>로그인 없이 이 브라우저에 저장됩니다.</span>
              </div>
              <button type="button" onClick={() => go("archive")}>
                내 보관함 열기 <span>{favorites.length}</span><ArrowIcon />
              </button>
            </section>
          </>
        )}

        {view === "ranking" && (
          <section className="frame page-view">
            <div className="page-heading">
              <p>ACTRESS RANKING</p>
              <h1>배우 랭킹</h1>
              <span>순위 종류마다 기준이 다릅니다. 공개 월간 자료와 라운지 내 지표를 섞지 않고 따로 보여줍니다.</span>
            </div>
            <div className="ranking-tabs" role="tablist" aria-label="랭킹 기준">
              <button type="button" className={rankingMode === "public" ? "is-active" : ""} onClick={() => setRankingMode("public")}>공개 월간</button>
              <button type="button" className={rankingMode === "works" ? "is-active" : ""} onClick={() => setRankingMode("works")}>확인 품번 수</button>
              <button type="button" className={rankingMode === "saved" ? "is-active" : ""} onClick={() => setRankingMode("saved")}>내 보관함</button>
            </div>
            <div className="ranking-source">
              <span>INDEX NOTE</span>
              <p>{rankingMode === "public" ? "2026년 6월 공개 월간 자료를 옮겨 적은 기록이며 실시간 순위가 아닙니다." : rankingMode === "works" ? "현재 AV라운지에 연결된 확인 품번 개수 기준입니다." : "이 브라우저에 저장한 배우가 먼저 보입니다."}</p>
            </div>
            <div className="full-ranking">
              {rankedActresses.map((actress, index) => (
                <article key={actress.id}>
                  <button type="button" className="full-ranking__main" onClick={() => openActress(actress)}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <img src={actress.image} alt="" style={{ objectPosition: actress.imagePosition }} />
                    <span><strong>{actress.nameKo}</strong><small>{actress.nameJp} · {actress.nameEn}</small></span>
                    <i>{workCounts[actress.id]}<small>확인 품번</small></i>
                    <em className={`trend trend--${actress.trend}`}>{actress.trend === "up" ? "↗" : actress.trend === "down" ? "↘" : "—"}</em>
                    <ArrowIcon />
                  </button>
                  <button
                    type="button"
                    className="full-ranking__save"
                    onClick={() => toggleSaved(`actress:${actress.id}`, actress.nameKo)}
                    aria-label={`${actress.nameKo} 보관함 저장`}
                    aria-pressed={isSaved(`actress:${actress.id}`)}
                  ><TicketIcon filled={isSaved(`actress:${actress.id}`)} /></button>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === "actresses" && (
          <section className="frame page-view">
            <div className="page-heading page-heading--split">
              <div><p>PORTRAIT DIRECTORY</p><h1>배우 찾기</h1><span>표기가 달라도 한 프로필에서 찾을 수 있도록 연결했습니다.</span></div>
              <aside><b>{directoryActresses.length}</b><span>FEATURED PROFILES</span></aside>
            </div>
            <div className="directory-tools">
              <label className="directory-search">
                <SearchIcon />
                <input value={actressQuery} onChange={(event) => setActressQuery(event.target.value)} placeholder="한글·일본어·로마자 배우명" />
              </label>
              <div className="segmented-control" aria-label="배우 정렬">
                <button type="button" className={actressSort === "rank" ? "is-active" : ""} onClick={() => setActressSort("rank")}>인기순</button>
                <button type="button" className={actressSort === "works" ? "is-active" : ""} onClick={() => setActressSort("works")}>품번 많은 순</button>
                <button type="button" className={actressSort === "name" ? "is-active" : ""} onClick={() => setActressSort("name")}>이름순</button>
              </div>
            </div>
            {directoryActresses.length > 0 ? (
              <div className="portrait-grid">
                {directoryActresses.map((actress) => (
                  <ActressCard key={actress.id} actress={actress} count={workCounts[actress.id] || 0} saved={isSaved(`actress:${actress.id}`)} onOpen={() => openActress(actress)} onSave={() => toggleSaved(`actress:${actress.id}`, actress.nameKo)} />
                ))}
              </div>
            ) : <div className="empty-state"><b>찾는 배우가 없어요.</b><span>다른 표기나 품번으로 통합검색해 보세요.</span><button type="button" onClick={() => setSearchOpen(true)}>통합검색 열기</button></div>}
          </section>
        )}

        {view === "codes" && (
          <section className="frame page-view">
            <div className="page-heading page-heading--split">
              <div><p>FULL CATALOGUE</p><h1>전체 품번</h1><span>배우별로 확인한 품번을 빠짐없이 한 목록에 모았습니다.</span></div>
              <aside><b>{WORKS.length}</b><span>VERIFIED CODES</span></aside>
            </div>
            <div className="catalogue-tools">
              <label className="directory-search">
                <SearchIcon />
                <input value={codeQuery} onChange={(event) => { setCodeQuery(event.target.value); setCodePage(1); }} placeholder="품번 또는 배우명 검색" />
              </label>
              <select value={workSort} onChange={(event) => { setWorkSort(event.target.value as typeof workSort); setCodePage(1); }} aria-label="품번 정렬">
                <option value="latest">목록 최신순</option>
                <option value="oldest">목록 오래된 순</option>
                <option value="code">품번순</option>
              </select>
            </div>
            <div className="filter-chips" aria-label="제작사 필터">
              {studios.map((item) => <button type="button" key={item} className={studio === item ? "is-active" : ""} onClick={() => { setStudio(item); setCodePage(1); }}>{item}</button>)}
            </div>
            <div className="catalogue-summary"><span>{filteredWorks.length.toLocaleString("ko-KR")}개 결과</span><small>한 페이지에 {PAGE_SIZE}개씩 표시</small></div>
            <div className="catalogue-list">
              {pageWorks.map((work) => <WorkRow key={`${work.actressId}-${work.code}`} work={work} saved={isSaved(`work:${work.code}`)} onOpen={() => openWork(work)} onSave={() => toggleSaved(`work:${work.code}`, work.code)} onExternal={(site) => openExternal(site, work.code)} />)}
              {pageWorks.length === 0 && <div className="empty-state"><b>일치하는 품번이 없어요.</b><span>하이픈을 빼거나 배우명으로 다시 검색해 보세요.</span><button type="button" onClick={() => { setCodeQuery(""); setStudio("전체"); }}>필터 초기화</button></div>}
            </div>
            <Pagination page={codePage} total={totalCodePages} onChange={changeCodePage} />
          </section>
        )}

        {view === "archive" && (
          <section className="frame page-view archive-view">
            <div className="page-heading page-heading--split">
              <div><p>MY LOUNGE TICKET</p><h1>보관함</h1><span>저장한 배우와 품번은 이 브라우저에만 남습니다.</span></div>
              <aside><b>{favorites.length}</b><span>SAVED ITEMS</span></aside>
            </div>
            {favorites.length === 0 ? (
              <div className="archive-empty">
                <TicketIcon />
                <p>아직 담아둔 티켓이 없어요.</p>
                <span>배우와 품번 옆의 티켓 아이콘을 눌러 나만의 목록을 만들어 보세요.</span>
                <button type="button" onClick={() => go("actresses")}>배우 둘러보기 <ArrowIcon /></button>
              </div>
            ) : (
              <>
                <section className="archive-section">
                  <SectionTitle eyebrow="SAVED ACTRESSES" title={`저장한 배우 ${archiveActresses.length}명`} />
                  {archiveActresses.length > 0 ? <div className="portrait-grid portrait-grid--archive">{archiveActresses.map((actress) => <ActressCard key={actress.id} actress={actress} count={workCounts[actress.id]} saved onOpen={() => openActress(actress)} onSave={() => toggleSaved(`actress:${actress.id}`, actress.nameKo)} />)}</div> : <p className="archive-section__empty">저장한 배우가 없습니다.</p>}
                </section>
                <section className="archive-section">
                  <SectionTitle eyebrow="SAVED CODES" title={`저장한 품번 ${archiveWorks.length}개`} />
                  {archiveWorks.length > 0 ? <div className="catalogue-list">{archiveWorks.map((work) => <WorkRow key={`${work.actressId}-${work.code}`} work={work} saved onOpen={() => openWork(work)} onSave={() => toggleSaved(`work:${work.code}`, work.code)} onExternal={(site) => openExternal(site, work.code)} />)}</div> : <p className="archive-section__empty">저장한 품번이 없습니다.</p>}
                </section>
              </>
            )}
          </section>
        )}

        {view === "sources" && (
          <section className="frame page-view sources-view">
            <div className="page-heading"><p>DATA & PHOTO CREDITS</p><h1>출처와 기준</h1><span>AV라운지는 출처가 확인되는 정보만 현재 확인 범위와 함께 표시합니다.</span></div>
            <div className="source-principles">
              <article><span>01</span><h2>품번 데이터</h2><p>제작사 공식 작품 페이지와 공개 작품 색인을 대조한 품번만 수록합니다. 작품 제목이나 발매일처럼 현재 확인하지 않은 값은 임의로 만들지 않습니다.</p></article>
              <article><span>02</span><h2>랭킹 데이터</h2><p>공개 월간 순위, AV라운지의 확인 품번 수, 사용자의 보관함은 서로 다른 지표로 분리합니다. 현재 공개 월간 표시는 2026년 6월 기록입니다.</p></article>
              <article><span>03</span><h2>외부 검색</h2><p>케이디스크와 온디스크 버튼은 해당 품번 또는 배우명을 각 사이트 검색 결과로 전달합니다. 외부 사이트의 결과와 이용 조건은 각 서비스가 관리합니다.</p></article>
            </div>
            <SectionTitle eyebrow="CREATIVE COMMONS" title="배우 사진 출처" description="사진은 원본의 Creative Commons 조건에 따라 WebP로 변환하고 화면 비율에 맞춰 표시했습니다." />
            <div className="photo-credits">
              {ACTRESSES.map((actress) => (
                <a key={actress.id} href={actress.photoSource} target="_blank" rel="noopener noreferrer">
                  <img src={actress.image} alt="" style={{ objectPosition: actress.imagePosition }} />
                  <span><b>{actress.nameKo}</b><small>{actress.photoCredit} · {actress.photoLicense}</small></span>
                  <ArrowIcon direction="up" />
                </a>
              ))}
            </div>
            <div className="source-links">
              <a href="https://www.wikidata.org/" target="_blank" rel="noopener noreferrer">Wikidata <ArrowIcon direction="up" /></a>
              <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer">Wikimedia Commons <ArrowIcon direction="up" /></a>
              <a href="https://affiliate.dmm.com/api/" target="_blank" rel="noopener noreferrer">DMM Web API 안내 <ArrowIcon direction="up" /></a>
            </div>
          </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="frame site-footer__top">
          <div><Brand /><p>배우부터 품번까지, 취향이 머무는 곳.</p></div>
          <nav aria-label="하단 메뉴">
            <button type="button" onClick={() => go("ranking")}>배우 랭킹</button>
            <button type="button" onClick={() => go("actresses")}>배우 찾기</button>
            <button type="button" onClick={() => go("codes")}>전체 품번</button>
            <button type="button" onClick={() => go("sources")}>데이터 출처</button>
          </nav>
        </div>
        <div className="frame site-footer__bottom">
          <p><b>19+</b> 성인 대상 정보성 메타데이터 서비스입니다.</p>
          <span>© 2026 AV LOUNGE · 각 사진의 권리는 원 저작자에게 있습니다.</span>
        </div>
      </footer>

      <nav className="mobile-nav" aria-label="모바일 빠른 메뉴">
        {[
          ["home", "⌂", "홈"], ["actresses", "◎", "배우"], ["codes", "▦", "품번"], ["ranking", "↗", "랭킹"], ["archive", "◇", "보관함"],
        ].map(([id, icon, label]) => (
          <button key={id} type="button" className={view === id ? "is-active" : ""} onClick={() => go(id as View)}><span>{icon}</span>{label}</button>
        ))}
      </nav>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="통합검색">
          <div className="search-overlay__top frame">
            <Brand />
            <button type="button" onClick={() => setSearchOpen(false)} aria-label="검색 닫기"><CloseIcon /></button>
          </div>
          <div className="search-overlay__content frame">
            <p>GLOBAL SEARCH</p>
            <label>
              <SearchIcon />
              <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="배우명 또는 품번" />
            </label>
            {!searchTerm ? (
              <div className="search-suggestions"><span>추천 검색</span>{["세토 칸나", "카와키타 사이카", "SONE-991", "MIDV-639"].map((term) => <button type="button" key={term} onClick={() => setSearchQuery(term)}>{term}</button>)}</div>
            ) : (
              <div className="search-results">
                <section>
                  <h2>배우 <span>{searchedActresses.length}</span></h2>
                  {searchedActresses.slice(0, 6).map((actress) => <button type="button" key={actress.id} onClick={() => { setSearchOpen(false); openActress(actress); }}><img src={actress.image} alt="" style={{ objectPosition: actress.imagePosition }} /><span><b>{actress.nameKo}</b><small>{actress.nameJp} · {actress.nameEn}</small></span><ArrowIcon /></button>)}
                  {searchedActresses.length === 0 && <p>일치하는 배우가 없습니다.</p>}
                </section>
                <section>
                  <h2>품번 <span>{searchedWorks.length}</span></h2>
                  {searchedWorks.map((work) => <button type="button" key={`${work.actressId}-${work.code}`} onClick={() => { setSearchOpen(false); openWork(work); }}><b>{work.code}</b><span>{actressById(work.actressId).nameKo}</span><ArrowIcon /></button>)}
                  {searchedWorks.length === 0 && <p>일치하는 품번이 없습니다.</p>}
                </section>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedActress && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedActress(null); }}>
          <article className="actress-detail" role="dialog" aria-modal="true" aria-label={`${selectedActress.nameKo} 상세 정보`}>
            <button className="modal-close" type="button" onClick={() => setSelectedActress(null)} aria-label="배우 상세 닫기"><CloseIcon /></button>
            <div className="actress-detail__hero">
              <div className="actress-detail__photo"><img src={selectedActress.image} alt={`${selectedActress.nameKo} 공개 행사 사진`} style={{ objectPosition: selectedActress.imagePosition }} /><small>{selectedActress.photoLicense}</small></div>
              <div className="actress-detail__info">
                <p>PORTRAIT NO. {String(selectedActress.rank).padStart(2, "0")}</p>
                <h1>{selectedActress.nameKo}</h1>
                <h2>{selectedActress.nameJp} · {selectedActress.nameEn}</h2>
                <p className="actress-detail__description">{selectedActress.profile}</p>
                <dl>
                  <div><dt>상태</dt><dd>최근 자료 확인</dd></div>
                  <div><dt>활동 시작</dt><dd>{selectedActress.debut || "자료 확인 중"}</dd></div>
                  <div><dt>확인 품번</dt><dd>{workCounts[selectedActress.id]}건</dd></div>
                  <div><dt>사진</dt><dd>{selectedActress.photoLicense}</dd></div>
                </dl>
                <div className="actress-detail__actions">
                  <button type="button" className={isSaved(`actress:${selectedActress.id}`) ? "is-saved" : ""} onClick={() => toggleSaved(`actress:${selectedActress.id}`, selectedActress.nameKo)}><TicketIcon filled={isSaved(`actress:${selectedActress.id}`)} />{isSaved(`actress:${selectedActress.id}`) ? "보관함에 저장됨" : "보관함 저장"}</button>
                  <button type="button" onClick={() => { setCorrectionOpen(true); setCorrectionSent(false); }}>정보 정정 요청 <ArrowIcon /></button>
                </div>
                <div className="external-actions">
                  <button type="button" onClick={() => openExternal("kdisk", selectedActress.nameKo)}><b>K</b><span>케이디스크에서<br />작품 보러가기</span><ArrowIcon direction="up" /></button>
                  <button type="button" onClick={() => openExternal("ondisk", selectedActress.nameKo)}><b>O</b><span>온디스크에서<br />작품 보러가기</span><ArrowIcon direction="up" /></button>
                </div>
              </div>
            </div>
            <section className="actress-detail__works">
              <div><p>FULL FILMOGRAPHY</p><h2>전체 작품 번호 <span>{workCounts[selectedActress.id]}</span></h2><small>현재 공개 출처로 확인된 품번 전체를 표시합니다.</small></div>
              <div className="catalogue-list">
                {worksFor(selectedActress.id).slice((detailPage - 1) * PAGE_SIZE, detailPage * PAGE_SIZE).map((work) => <WorkRow key={work.code} work={work} saved={isSaved(`work:${work.code}`)} onOpen={() => openWork(work)} onSave={() => toggleSaved(`work:${work.code}`, work.code)} onExternal={(site) => openExternal(site, work.code)} />)}
              </div>
              <Pagination page={detailPage} total={Math.ceil(worksFor(selectedActress.id).length / PAGE_SIZE)} onChange={(page) => { setDetailPage(page); document.querySelector(".actress-detail__works")?.scrollIntoView({ behavior: "smooth" }); }} />
            </section>
          </article>
        </div>
      )}

      {selectedWork && (
        <div className="modal-backdrop modal-backdrop--work" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedWork(null); }}>
          <article className="work-detail" role="dialog" aria-modal="true" aria-label={`${selectedWork.code} 상세 정보`}>
            <button className="modal-close" type="button" onClick={() => setSelectedWork(null)} aria-label="품번 상세 닫기"><CloseIcon /></button>
            <p>CATALOGUE DETAIL</p>
            <h1>{selectedWork.code}</h1>
            <button type="button" className="work-detail__actress" onClick={() => { setSelectedWork(null); openActress(actressById(selectedWork.actressId)); }}>
              <img src={actressById(selectedWork.actressId).image} alt="" style={{ objectPosition: actressById(selectedWork.actressId).imagePosition }} />
              <span><small>ACTRESS</small><b>{actressById(selectedWork.actressId).nameKo}</b><em>{actressById(selectedWork.actressId).nameJp} · {actressById(selectedWork.actressId).nameEn}</em></span>
              <ArrowIcon />
            </button>
            <dl><div><dt>레이블 분류</dt><dd>{selectedWork.studio}</dd></div><div><dt>확인 기준</dt><dd>{selectedWork.source}</dd></div></dl>
            <button type="button" className="work-detail__save" onClick={() => toggleSaved(`work:${selectedWork.code}`, selectedWork.code)}><TicketIcon filled={isSaved(`work:${selectedWork.code}`)} />{isSaved(`work:${selectedWork.code}`) ? "보관함에 저장됨" : "이 품번 보관하기"}</button>
            <div className="external-actions external-actions--work">
              <button type="button" onClick={() => openExternal("kdisk", selectedWork.code)}><b>K</b><span>케이디스크에서<br />{selectedWork.code} 찾기</span><ArrowIcon direction="up" /></button>
              <button type="button" onClick={() => openExternal("ondisk", selectedWork.code)}><b>O</b><span>온디스크에서<br />{selectedWork.code} 찾기</span><ArrowIcon direction="up" /></button>
            </div>
            <button type="button" className="correction-link" onClick={() => { setCorrectionOpen(true); setCorrectionSent(false); }}>이 품번 정보 정정 요청 <ArrowIcon /></button>
          </article>
        </div>
      )}

      {correctionOpen && (
        <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setCorrectionOpen(false); }}>
          <aside className="correction-drawer" role="dialog" aria-modal="true" aria-label="정보 정정 요청">
            <button className="modal-close" type="button" onClick={() => setCorrectionOpen(false)} aria-label="정정 요청 닫기"><CloseIcon /></button>
            {correctionSent ? (
              <div className="correction-success"><span>✓</span><h2>임시 요청을 저장했어요.</h2><p>현재 버전에서는 이 브라우저에만 임시 보관됩니다. 운영 접수 채널이 연결되면 전송 기능으로 교체됩니다.</p><button type="button" onClick={() => setCorrectionOpen(false)}>확인</button></div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const saved = JSON.parse(localStorage.getItem("avlounge:corrections:v1") || "[]"); saved.push(Object.fromEntries(form)); localStorage.setItem("avlounge:corrections:v1", JSON.stringify(saved)); setCorrectionSent(true); }}>
                <p>CORRECTION REQUEST</p><h2>정보 정정 요청</h2><span>올바른 정보와 확인 가능한 근거를 남겨주세요.</span>
                <label>대상<input name="target" defaultValue={selectedWork?.code || selectedActress?.nameKo || ""} required /></label>
                <label>수정할 항목<select name="field" required><option value="">선택해 주세요</option><option>배우명·다른 표기</option><option>배우 기본 정보</option><option>품번 연결</option><option>사진·출처</option><option>기타</option></select></label>
                <label>올바른 내용<textarea name="content" rows={4} placeholder="어떻게 수정해야 하는지 적어주세요." required /></label>
                <label>근거 URL<input name="source" type="url" placeholder="https://" required /></label>
                <label>추가 설명<textarea name="note" rows={3} placeholder="선택 입력" /></label>
                <small>현재는 서버 접수 전 시안으로, 제출 내용이 이 브라우저에만 임시 저장됩니다.</small>
                <button type="submit">정정 요청 임시 저장 <ArrowIcon /></button>
              </form>
            )}
          </aside>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
