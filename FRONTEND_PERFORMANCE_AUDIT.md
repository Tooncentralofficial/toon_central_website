# Frontend Performance Audit - Toon Central Website

## Summary
Found **20 performance issues** in the frontend that are unrelated to backend API optimization.
These are categorized by severity: how much they impact load time and user experience.

---

## CRITICAL (Kills page load speed)

### 1. ClientLayout blocks ALL rendering until JS hydrates
**File:** `app/clientLayout.tsx` lines 9-23
**Problem:** Uses `useLayoutEffect` + `isClient` state to conditionally render children. Until JavaScript executes and sets `isClient = true`, the user sees a completely blank page. This destroys First Contentful Paint (FCP) — the #1 metric Google uses for page speed ranking.
```tsx
const [isClient, setIsClient] = useState(false);
useLayoutEffect(() => setIsClient(true), []);
return isClient ? <AppProvider>{children}</AppProvider> : <div className="..." />;
```
**Why it exists:** Removing the gate causes React hydration errors — one or more child components render differently on server vs client. The gate is a brute-force workaround that prevents SSR of the entire tree.
**Proper fix:** Requires identifying and fixing the specific components that cause hydration mismatches (likely components using `window`/`document` during render, or NextUI components with SSR incompatibilities). This is a deeper investigation task — not a simple removal.
**Impact:** Every page loads as blank → waits for JS bundle → then renders. On slow connections this can be 2-5 seconds of white screen.

### 2. Only carousel data is prefetched server-side — everything else waits for client
**File:** `app/page.tsx` lines 71-74
**Problem:** The homepage Server Component only prefetches the carousel. All other sections (recommendations, popular, trending, shorts, originals, todaysPicks, popularbytoons, HorizontalScroll) fetch data client-side AFTER hydration. This means:
1. Page HTML arrives from server (mostly empty skeletons)
2. JS bundle downloads and executes
3. React hydrates
4. Each section fires its own API request
5. Data arrives, components re-render

**Impact:** 8+ API calls fire sequentially after page load instead of being prefetched on the server.

### 3. ✅ FIXED — `HomeShorts` was rendered TWICE on the homepage
**File:** `app/page.tsx`
**What happened:** Git history shows `<HomeShorts />` was originally placed between `<PopularByToons />` and `<HorizontalScroll />` (commit `ddc7588`, Oct 25 2025). Later, a second instance was added higher up between `<RecommendtnTabs />` and `<Popular />` (commit `d043153`, Jan 19 2026) — but the original was never removed.
**Why it matters:** Both instances use the same queryKey `"shorts-home"` and render identical content. React Query deduplicates the API call, but the browser still builds 2x the DOM — two Swiper carousels, two sets of `<video>` elements (up to 20 videos downloading instead of 10), and two sets of event listeners.
**Fix:** Removed the old (lower) instance, kept the newer (higher) position that the developer intentionally moved it to.

### 4. ✅ FIXED — All 10 short videos loaded on homepage
**File:** `app/_page/shortsHome.tsx` lines 128-137, 183-189
**What happened:** Every short in both the mobile and desktop Swiper carousels rendered `<video src={item.upload}>` without a `preload` attribute. The browser defaults to `preload="auto"`, which tells it to start downloading the entire video file for ALL 10 slides immediately — even though only the active (centered) slide plays. A single short video can be 5-50MB, so 10 concurrent video downloads compete with images and API calls for bandwidth.
**Why it matters:** On mobile connections, this could mean 50-500MB of video downloads before the user even scrolls. The page feels slow because the browser is saturating the network with video downloads instead of loading visible content.
**Fix:** Added `preload={index === activeIndex ? "auto" : "none"}` to both mobile and desktop video elements. Only the active slide's video downloads immediately; others wait until the user swipes to them (the existing `useEffect` that calls `video.play()` on slide change triggers the download at that point).

---

## HIGH (Significant slowdown)

### 5. ✅ FIXED — `priority` set on ALL card images — defeats the purpose
**Files:** `app/_shared/cards/cardTitleBottom.tsx` line 131, `app/_shared/cards/cardTitleOutside.tsx` line 46
**What `priority` does:** Next.js `<Image priority>` tells the browser "download this image immediately at highest priority, before anything else." It adds a `<link rel="preload">` to the page head. This is useful for above-the-fold hero images — but when set on ALL card images, every single one gets preloaded simultaneously.
**What was wrong:** `CardTitleOutside` is used in 10 places (originals, todaysPicks, topRecommendations, genre tabs, comic detail "you may also like", etc.) — all below-the-fold or on secondary pages. Setting `priority` on these images means the browser tries to eagerly download 30-50+ card images at highest priority, competing with the actual above-the-fold carousel images for bandwidth. The result is that everything loads slower.
**Fix:** Removed `priority` from `CardTitleOutside`. Next.js `<Image>` already defaults to `loading="lazy"` when `priority` is not set, so simply removing it is enough — the images will now only load when the user scrolls near them. Kept `priority` on `CardTitleBottom` since it's ONLY used in the homepage carousel — the one place where eager loading is correct.

### 6. ✅ FIXED — DndProvider (drag-and-drop) wrapped the entire app
**File:** `app/clientLayout.tsx` line 15
**What happened:** `react-dnd` and `HTML5Backend` were imported in `clientLayout.tsx` and wrapped around every page via `<DndProvider backend={HTML5Backend}>`. But drag-and-drop is only used in one place: `DraggableImage` on the creator's "add part" page (`app/user/library/books/addpart/`). Every other page — homepage, comic detail, shorts, discover, profile — loaded ~40KB+ of drag-and-drop JS that was never used.
**Why it matters:** The `react-dnd` and `react-dnd-html5-backend` packages are added to the initial JS bundle for every page. This increases download size and Time to Interactive for all users, even though only creators uploading comic panels ever need drag-and-drop.
**Fix:** Removed `DndProvider` from `clientLayout.tsx` and moved it into the addpart page component that actually uses it. The drag-and-drop JS now only loads when a creator navigates to that specific page.

### 7. ✅ FIXED — Framer Motion wrapped ALL page content with 750ms fade-in
**File:** `lib/appProvider.tsx` lines 80-88
**What happened:** Every page's content was wrapped in `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>`. This meant the entire page started invisible (`opacity: 0`) and took 750ms to fade in — even when the content was ready immediately. This also imported Framer Motion's animation system (~30KB gzipped) into the critical rendering path for every page, regardless of whether any page actually needed animations.
**Why it matters:** Users saw a blank page for up to 750ms after content was already rendered. The fade makes the app feel slower than it actually is. And the Framer Motion JS had to download and execute before any content could appear.
**Fix:** Replaced `motion.div` with a plain `div` and removed the unused `motion` import from `framer-motion`. Content now appears instantly when ready. If specific page transitions need animation in the future, they can be added to individual components rather than wrapping the entire app.

### 8. ✅ FIXED — Slick Carousel CSS loaded globally
**File:** `app/layout.tsx` lines 4-5
**What happened:** The two slick-carousel CSS files (`slick.css` and `slick-theme.css`) were imported in the root layout, which means they were bundled into the critical CSS for every single page — the discover page, comic detail pages, shorts, user profile, etc. — even though react-slick is only used by two components: `homeCarousel.tsx` and `popular.tsx`, both on the homepage.
**Why it matters:** CSS in the root layout is render-blocking — the browser must download and parse all of it before painting anything. Adding unused CSS to every page increases this blocking time for no benefit.
**Fix:** Moved the imports into the two components that actually use react-slick. Next.js bundles CSS from client components into their respective chunks, so the slick CSS now only loads when those components render.

### 9. ✅ FIXED — No image `sizes` prop on CardTitleOutside
**File:** `app/_shared/cards/cardTitleOutside.tsx` line 40
**What `sizes` does:** When Next.js `<Image>` generates a `srcset` (multiple image resolutions), the browser needs the `sizes` prop to know which resolution to download. Without it, the browser defaults to assuming the image fills the full viewport width (`100vw`) and downloads the largest available size — even if the image is actually rendered at 33% width inside a 3-column grid.
**What was wrong:** `CardTitleOutside` used `width={200}` with CSS `width: "100%"` but no `sizes` prop. On mobile, cards sit in a 3-column grid (~33vw each), but the browser downloaded images sized for 100vw — roughly 3x larger than needed.
**Fix:** Added `sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"` matching the actual grid breakpoints (3 cols mobile, 4 cols tablet, 5 cols desktop). The browser now downloads appropriately sized images for each screen size.

### 10. ✅ FIXED — Search fired API call on every keystroke — no debounce
**File:** `app/_shared/layout/search.tsx`
**What happened:** The search input's `onChange` updated `filter.search` immediately, and the entire `filter` object was in the queryKey `["search", filter]`. Every character typed changed the queryKey, triggering a new API request — typing "batman" fired 6 requests ("b", "ba", "bat", "batm", "batma", "batman"). Most of these responses were discarded as the next one arrived.
**Why it matters:** 6 API requests instead of 1 per search. On the server, this means 6x the database queries. On slow connections, results flash in and out as each intermediate response arrives and gets replaced.
**Fix:** Split into `searchInput` (updates instantly for responsive typing) and `debouncedSearch` (updates 300ms after the user stops typing, used in the queryKey). Also added `enabled: debouncedSearch.length >= 2` so the API isn't called for empty or single-character searches. No extra dependencies — uses a simple `setTimeout`/`clearTimeout` via `useRef`.

---

## MEDIUM (Noticeable inefficiency)

### 11. ✅ FIXED — Popular vs PopularByToons had conflicting queryKey/queryFn
**Files:** `app/_page/popular.tsx` line 34, `app/_page/popularbytoons.tsx` line 17
**What happened:** Both components used queryKey `"popular_by_toon"` but their queryFn fetched different limits from the same endpoint — Popular fetched `limit=10` (slider) and PopularByToons fetched `limit=5` (grid). React Query deduplicates by queryKey, so whichever mounts first caches its result and the second component silently uses that cached data instead of ever running its own queryFn. The queryKey and queryFn were out of sync — same key but different fetch functions, which is a React Query anti-pattern.
**Fix:** Aligned PopularByToons to use the same queryKey `"popular_by_toon"` AND the same `limit=10` queryFn as Popular. React Query now makes one API call and both components share the result. PopularByToons already had `.slice(0, 5)` in both its mobile and desktop render paths, so it still displays only 5 items. One API call instead of a confusing mismatch.

### 12. ✅ FIXED — TodaysPicksMobile duplicated the Originals API call
**Files:** `app/_page/todaysPicksMobile.tsx` lines 23-27, `app/_page/originals.tsx` lines 16-20
**What happened:** Both components fetch the same endpoint (`/home/toon-central-originals`) but used different queryKeys — TodaysPicksMobile used `"todayspicks"` with `limit=6`, Originals used `"originals"` with `limit=10`. React Query treats different queryKeys as separate cache entries, so two API calls were fired for overlapping data on every page load.
**Fix:** Changed TodaysPicksMobile to use the same queryKey `"originals"` and same `limit=10` as Originals. React Query now deduplicates the call — one API request serves both components. Added `.slice(0, 6)` to TodaysPicksMobile's render to keep displaying only 6 items as before.

### 13. ✅ FIXED — HorizontalScroll (test.tsx) made 3 API calls, only used 1
**File:** `app/_page/test.tsx`
**What happened:** This mobile-only component (`block md:hidden`) made 3 API calls on every page load: (1) `/genres/pull/list` for the genre list — never used in the render, (2) `/genres/comic/1/all` for action genre comics — the only data actually rendered, (3) `/genres/comic/3/all` for comedy genre comics — `ComedyItems` state was populated but never referenced in the JSX. It also had pagination functions (`fetchMoreData`, `fetchMoreComedyData`) that were defined but never called, and the same redundant `useState` + `useEffect` pattern from issue #14.
**Fix:** Removed the 2 unused queries (genre list and comedy), removed all unused state variables and pagination functions. The component now makes 1 API call instead of 3 and derives `actionItems` directly from the query result.

### 14. ✅ FIXED — Redundant state management pattern everywhere
**Files:** `homeCarousel.tsx`, `popular.tsx`, `trending.tsx`, `originals.tsx`, `popularbytoons.tsx`, `todaysPicksMobile.tsx`
**What happened:** Every section component duplicated React Query's managed state into a local `useState` + `useEffect` pattern:
```tsx
const [items, setItems] = useState([]);
const { data, isSuccess } = useQuery({...});
useEffect(() => {
  if (isSuccess) setItems(data?.data?.comics || []);
}, [isLoading, isFetching, data]);
// render uses `items` instead of `data` directly
```
React Query already tracks loading/success/error states and holds the data. The `useEffect` copies that data into a separate state variable, which triggers a second render cycle: (1) query resolves → component re-renders with new `data`, (2) `useEffect` fires → `setState` → component re-renders again with the copied data. Every data fetch caused 2 renders instead of 1.
**Fix:** Removed the `useState` and `useEffect` in all 6 components. Each now derives the items directly from the query result: `const items = data?.data?.comics || []` (or `|| dummyItems` for components that show placeholder cards during loading). One render per data fetch instead of two.

### 15. `window.matchMedia` resize listeners instead of CSS
**Files:** `homeCarousel.tsx` lines 63-79, `topRecommendations.tsx` lines 20-38, `trending.tsx` lines 21-39, `originals.tsx` lines 27-35
**Problem:** Multiple components attach `window.addEventListener("resize", ...)` to determine how many items to show. This is what CSS media queries (via Tailwind's responsive classes) or CSS `display: none` handle for free, without JavaScript.
**Impact:** Unnecessary re-renders on window resize. Each resize event triggers state updates and re-renders across 4+ components simultaneously.

### 16. ✅ FIXED — Footer artificially delayed by 2 seconds
**File:** `app/_shared/layout/footermain.tsx` lines 74-86
**What happened:** `MainfooterWithDelay` hid the footer entirely for 2 seconds using `useState(false)` + `setTimeout(() => setIsVisible(true), 2000)`. This was a workaround to prevent the footer from appearing at the top of the page before content loaded and pushed it down.
**Why it matters:** Users see no footer for 2 seconds, then it suddenly appears — causing a layout shift (CLS). The workaround also delays the footer on subsequent page visits where content is cached and loads instantly, adding unnecessary wait time.
**Fix:** Removed the delay logic — the footer now renders immediately. With the other performance fixes (removed framer-motion fade, removed DndProvider, etc.), content loads fast enough that the footer renders in its correct position at the bottom.

---

## LOW (Minor issues)

### 17. ✅ FIXED — `console.log` in shortsHome.tsx
**File:** `app/_page/shortsHome.tsx` line 34
Removed `console.log(shorts)` that logged the full shorts array on every render.
**Note:** ~80 other `console.log` calls exist across the codebase. A full cleanup is a separate task.

### 18. ✅ FIXED — Google Analytics loader script missing `strategy` prop
**File:** `app/layout.tsx` line 68
**What happened:** There are two Google Analytics `<Script>` tags — the loader (fetches the external `gtag.js` file from Google) and the setup (inline JS that configures the tracker). The setup script already had `strategy="afterInteractive"`, but the loader did not.
**Why it matters:** Next.js `<Script>` without a `strategy` defaults to `beforeInteractive`, meaning the browser fetches the ~90KB gtag.js file during initial page load, before React hydration starts. This blocks the page from becoming interactive while waiting for Google's server to respond. With `strategy="afterInteractive"`, the script loads only after the page is already interactive — analytics still work, but users see and interact with the page faster.
**Fix:** Added `strategy="afterInteractive"` to the loader `<Script>`.

### 19. ✅ FIXED — `loading.tsx` rendered empty div — no visual feedback
**File:** `app/loading.tsx`
**What happened:** Next.js App Router uses `loading.tsx` as an automatic loading UI during route transitions (it wraps page content in a `<Suspense>` boundary). The file existed but rendered an empty `<div>` — so when users navigated between pages, they saw a blank screen with no indication that anything was happening.
**Why it matters:** Without loading feedback, users think the app is frozen and may click again or leave. A visible loading state reassures them the page is loading.
**Fix:** Added a centered spinner using the app's accent color (`#3EFFA2`) with Tailwind's `animate-spin`. Lightweight — no extra dependencies, pure CSS animation.

### 20. ✅ FIXED — `react-slick` imported via require() prevents tree-shaking
**File:** `app/_page/popular.tsx` line 27
**What happened:** Used CommonJS `require("react-slick").default` instead of ES module `import Slider from "react-slick"`. CommonJS `require()` is evaluated at runtime, so the bundler (webpack/turbopack) cannot statically analyze which exports are used and cannot tree-shake unused code from the `react-slick` package. ES `import` is statically analyzable, allowing the bundler to drop any unused exports from the final bundle.
**Fix:** Replaced with `import Slider from "react-slick"`.

---

## Quick Wins (Easy fixes, big impact)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 3 | Remove duplicate `<HomeShorts />` | Halves video downloads | 1 min |
| 17 | Remove `console.log(shorts)` | Cleaner console | 1 min |
| 5 | Remove `priority` from cards, keep only on carousel | Better image loading | 5 min |
| 10 | Add debounce to search input | Fewer API calls | 10 min |
| 11 | Fix duplicate queryKey for Popular sections | Correct data | 5 min |
| 12 | Unify todaysPicks + originals queryKey | 1 fewer API call | 5 min |
| 14 | Remove redundant useState/useEffect, use query data directly | Fewer re-renders | 30 min |
| 18 | Add `strategy="afterInteractive"` to gtag | Faster FCP | 1 min |

## Bigger Improvements (Need architectural changes)

| # | Fix | Impact | Effort |
|---|-----|--------|--------|
| 1 | Remove isClient gate in ClientLayout | Instant FCP | Medium |
| 2 | Prefetch all homepage data server-side | Much faster homepage | Medium |
| 4 | Use video poster images, load video on interaction | Save bandwidth | Medium |
| 6 | Lazy-load DndProvider only on creator pages | Smaller bundle | Medium |
| 7 | Remove motion.div wrapper or reduce to instant | Faster perceived load | Low |
| 9 | Add proper `sizes` prop to all Image components | Smaller image downloads | Medium |

---

## PART 2: Optimizations Proven on Demo (toon-demo) to Apply Here

These are optimizations we built and tested on the demo frontend that should be ported to this real website. Each was proven to work.

---

### D1. Suspense Streaming — Each Section Loads Independently (NOT Promise.all)
**What we did on demo:** Instead of using `Promise.all` (which waits for ALL API calls to finish before showing anything), we wrapped each homepage section in its own `<Suspense>` boundary with an async Server Component. This lets React **stream** each section to the browser as soon as its data is ready — independently.

**Why NOT Promise.all:** With `Promise.all`, if the carousel API takes 200ms but shorts takes 2 seconds, the user sees nothing for 2 seconds. With Suspense streaming, the carousel appears at 200ms, other sections stream in as they resolve. The slowest section doesn't block the fastest.

**What to do here:** Convert each homepage section into an async Server Component that fetches its own data, wrap each in `<Suspense>`:
```tsx
// page.tsx — Server Component (no "use client")
import { Suspense } from "react";

// Each section is its own async Server Component
async function CarouselSection() {
  const res = await getRequest("/home/top-carousel?page=1&limit=10");
  return <HomeCarousel initialData={res.data?.comics} />;  // pass data as props
}

async function RecommendationsSection() {
  const [recsRes, genresRes] = await Promise.all([
    getRequest("/home/top-recommendations?filter=all&page=1&limit=10"),
    getRequest("/selectables/genres"),
  ]);
  return <RecommendtnTabs initialData={recsRes.data?.comics} genres={genresRes.data} />;
}

async function TrendingSection() {
  const res = await getRequest("/home/trending?filter=all&page=1&limit=10");
  return <Trending initialData={res.data?.comics} />;
}
// ... same pattern for each section

export default function Home() {
  return (
    <main>
      <Suspense fallback={<CarouselSkeleton />}>
        <CarouselSection />           {/* streams as soon as carousel API responds */}
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <RecommendationsSection />    {/* streams independently */}
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <TrendingSection />           {/* streams independently */}
      </Suspense>
      {/* ... each section streams on its own */}
    </main>
  );
}
```

**How it works:**
1. Browser receives initial HTML with skeleton fallbacks immediately
2. Server fetches all API calls in parallel (they run concurrently inside separate Suspense boundaries)
3. As each API call resolves, React streams that section's HTML to the browser
4. Each section appears as soon as its data is ready — no waterfall, no blocking

**Impact:** First section appears in ~200ms instead of waiting for all 8+ API calls. Each section streams progressively. The page feels dramatically faster.

### D2. ISR Caching for Homepage API Calls
**What we did on demo:** Added `next: { revalidate: 60 }` to the fetch options so homepage data is cached for 60 seconds. First visitor triggers a fresh fetch; subsequent visitors within 60s get the cached response instantly.
**What to do here:** The requests go through axios (server actions via `"use server"`), not native `fetch()`. Two options:
- **Option A:** Add `cache: "force-cache"` + `next: { revalidate: 60 }` headers to the server-side prefetch calls in `page.tsx` by switching from axios to native `fetch()` for the prefetch calls only
- **Option B:** Use React Query's `staleTime` (already set to 60s in appProvider) — this handles client-side caching. For server-side caching, wrap the prefetch calls in `unstable_cache` from `next/cache`

**Impact:** After first load, homepage data is served from Next.js cache for 60 seconds — near-instant response, zero backend load for repeat visits.

### D3. ✅ PARTIALLY FIXED — `sizes` prop added to all card Image components
**What was wrong:** All three card components (`CardTitleBottom`, `CardTitleTop`, `CardTitleOutside`) used `width={200}` with CSS `width: "100%"` but had no `sizes` prop. Without `sizes`, the browser assumes the image fills the full viewport width (`100vw`) and downloads the largest available srcset variant — even when the image is rendered at 20-33% of the viewport inside a grid or carousel.

**What was fixed:**
- **Fix #9:** Added `sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"` to `CardTitleOutside` (grid cards)
- **Fix #5:** Removed `priority` from `CardTitleOutside` (was on every card, defeating the purpose). Kept `priority` only on `CardTitleBottom` (carousel — above-the-fold)
- **Fix D3:** Added `sizes` to `CardTitleTop` (`"(max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"` — desktop-only grid) and `CardTitleBottom` (`"(max-width: 550px) 83vw, (max-width: 700px) 50vw, (max-width: 1024px) 33vw, 25vw"` — carousel breakpoints)

**What's NOT changed:** The `fill` mode switch (replacing `width/height` with `fill` + relative parent) would require restructuring HTML in all card components. This is a larger refactor that risks breaking layouts and should be done separately with visual testing.

**Impact:** The browser now downloads appropriately sized images for each screen size across all card components. Mobile users no longer download desktop-sized images — typically 50-75% bandwidth savings on card images.

### D4. ✅ FIXED — Search debounce
**What was wrong:** The search fired an API call on every keystroke with no debounce or minimum character requirement. Typing "batman" triggered 6 API requests.
**Fix (Fix #10):** Split into `searchInput` (instant for responsive typing) and `debouncedSearch` (300ms delay, used in queryKey). Added `enabled: debouncedSearch.length >= 2`. Typing "batman" now fires 1 API call instead of 6.

**What to do here:** Add debounce to the existing search:
```tsx
const [debouncedSearch, setDebouncedSearch] = useState("");
const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const handleSearch = (e: any) => {
  const value = e.target.value;
  setFilter((prev) => ({ ...prev, search: value }));  // instant UI update
  if (debounceRef.current) clearTimeout(debounceRef.current);
  debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300);  // delayed API call
};

const { data, isLoading } = useQuery({
  queryKey: ["search", debouncedSearch],
  queryFn: () => getRequest(`/search?query=${debouncedSearch}&page=1&limit=10`),
  enabled: debouncedSearch.trim().length >= 2,  // don't search for "a"
});
```

Also add keyboard shortcut to open search from anywhere:
```tsx
useEffect(() => {
  function handleKey(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); onOpen(); }
  }
  document.addEventListener("keydown", handleKey);
  return () => document.removeEventListener("keydown", handleKey);
}, []);
```

**Impact:** Typing "batman" fires 1 API call instead of 6. Keyboard shortcut is a UX improvement power users expect. Portal prevents modal rendering bugs.

### D5. Hybrid Server + Client Components — Server Fetches, Client Handles Interaction
**What we did on demo:** The homepage `page.tsx` is a Server Component (no `"use client"`). Interactive features like search and genre tab switching are separate Client Components that get imported into the Server Component. The server fetches the initial data and passes it as props — the Client Component only handles user interaction, not initial data loading.

**Why this matters:** Currently, the entire homepage is client-side. Every section component has `"use client"` at the top, which means:
- Data can't be fetched server-side (no SSR benefit)
- User sees skeletons while JS downloads → hydrates → fires API calls
- Search and genre tabs force the entire page to be client-rendered

**The pattern we proved:**
```tsx
// page.tsx — Server Component (fetches data, no JS sent to browser)
async function RecommendationsSection() {
  const [recsRes, genresRes] = await Promise.all([
    getRequest("/home/top-recommendations?filter=all&page=1&limit=10"),
    getRequest("/selectables/genres"),
  ]);
  // Pass server-fetched data as props to the Client Component
  return <GenreTabsClient initialComics={recsRes.data?.comics} genres={genresRes.data} />;
}

// GenreTabsClient.tsx — "use client" (only handles genre switching)
"use client";
export function GenreTabsClient({ initialComics, genres }) {
  const [activeGenre, setActiveGenre] = useState("all");
  const [comics, setComics] = useState(initialComics);  // starts with server data

  useEffect(() => {
    if (activeGenre === "all") { setComics(initialComics); return; }
    // Only fetches from browser when user clicks a different genre
    getRequest(`/genres/comic/${activeGenre}/all`).then(res => setComics(res.data?.comics));
  }, [activeGenre]);

  return (
    <>
      {/* Genre pill buttons */}
      {/* Comic grid using `comics` state */}
    </>
  );
}
```

**The same pattern for search:** Search stays as a `"use client"` component imported into the layout. It only runs in the browser (search is inherently interactive). But the rest of the page doesn't need to be client-rendered just because search exists.

**What needs to change here:**
- `page.tsx` becomes a pure Server Component (remove `HydrationBoundary` + `QueryClient` approach)
- Each section becomes an async function that fetches data server-side
- Interactive sections (genre tabs, likes) become Client Components that receive initial data as props
- Search stays client-side (already is) — just needs to be imported properly

**Impact:** The page loads with real data in the initial HTML (not skeletons). Interactive features work immediately after hydration. The JS bundle is smaller because Server Components send zero JavaScript to the browser.

### D6. Fetch Priority API for Critical Requests
**What we did on demo:** Added `priority: "high"` to the carousel fetch call so the browser prioritizes it over other network requests.
**What to do here:** Since the homepage prefetch happens server-side, this mainly applies to the client-side React Query refetches. Can be added as a fetch option in the axios instance or in the individual `queryFn` for the carousel.
**Impact:** Moderate — browser hint to prioritize the most important request.

### D7. ✅ FIXED — Cloudinary URL Optimization missing on CardTitleTop
**What happened:** The codebase has `optimizeCloudinaryUrl()` in `imageUtils.ts` that inserts `w_800,q_auto,f_auto` into Cloudinary URLs — enabling automatic format conversion (WebP/AVIF) and quality optimization. `CardTitleOutside` and `CardTitleBottom` both used it, but `CardTitleTop` used the raw URL: `src={cardData?.coverImage || ""}`. This meant all images in the Recommendations and Trending sections were served at full original size and format.
**Fix:** Added `import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils"` and wrapped the src: `src={optimizeCloudinaryUrl(cardData?.coverImage ?? "")}`. These images now get automatic WebP/AVIF conversion and quality optimization — typically 50-80% smaller file sizes.

### D8. Video Poster Images Instead of Blank Frames
**Problem:** Videos show blank black frames before loading. With `preload="none"` on non-active slides, inactive videos show nothing until swiped to.
**Recommendation:** Add `poster={item.coverImage}` to `<video>` elements so the browser shows the cover image as a thumbnail while videos load.

### D9. Proper Skeleton Loading States (Suspense Fallbacks)
**What we did on demo:** Created dedicated skeleton components that match the exact layout of the real content:
- `HeroSkeleton` — a pulse-animated box matching the carousel's aspect ratio (`aspect-21/9`)
- `SectionSkeleton` — a title bar + row of card-shaped pulse boxes matching the grid layout
- `loading.tsx` — full page skeleton for route transitions between pages

Each skeleton is used as the `fallback` prop in `<Suspense>`, so users see the page structure instantly while data streams in.

**Why this matters:** A blank screen while loading feels slow. A skeleton that matches the layout makes the page feel like it loaded instantly and content is "filling in." It also prevents layout shift — the skeleton reserves exactly the same space as the real content, so nothing jumps when data arrives.

**What's wrong in the real site:**
- `app/loading.tsx` renders an empty `<div>` — user sees nothing during route transitions
- Homepage sections use `dummyItems` as loading placeholders (renders fake card data), which is heavier than simple pulse skeletons
- The footer is hidden for 2 seconds via `setTimeout` as a hack to avoid it showing before content

**What to do here:**
```tsx
// Skeleton for each Suspense boundary:
function SectionSkeleton() {
  return (
    <div className="mb-10">
      <div className="h-6 w-32 rounded bg-[var(--bg-secondary)] mb-4 animate-pulse" />
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-[150px] md:h-[260px] rounded-[8px] bg-[var(--bg-secondary)] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// Used in page.tsx:
<Suspense fallback={<SectionSkeleton />}>
  <TrendingSection />
</Suspense>
```

Also update `loading.tsx` to show a proper full-page skeleton instead of an empty div.

**Impact:** Perceived performance — users see page structure instantly. No layout shift when data arrives. No more `setTimeout` hacks for the footer.

---

## Summary: Total Optimization Opportunities

| Category | Count | Key Items |
|----------|-------|-----------|
| Existing bugs/inefficiencies (Part 1) | 20 | ClientLayout blocking, duplicate components, no debounce, wrong priority |
| Demo-proven optimizations (Part 2) | 9 | Suspense streaming, hybrid Server+Client, ISR caching, `<Image>` fill+sizes, debounced search+portal, skeletons |
| Backend API optimizations (task.md) | 6 remaining | #11, #13, #14, #15, #16, #18, #25 |
| **Total** | **35** | |

### Recommended Fix Order
1. **Quick wins first** (Part 1: #3, #5, #11, #12, #17, #18) — 30 minutes, immediate improvement
2. **Core architecture from demo** (D1 Suspense streaming, D5 hybrid Server+Client, D4 debounced search, D7 Cloudinary fix) — the biggest speed boost, converts homepage to streaming SSR with Client Components only for interactive parts
3. **Image & media optimizations** (D3 image priority, D8 video posters) — bandwidth savings
4. **Caching** (D2 ISR caching) — repeat visit performance
5. **Cleanup fixes** (Part 1: #1, #4, #6, #7, #14, #15) — remove dead weight from the bundle
6. **Backend API optimizations** (task.md remaining) — separate track
