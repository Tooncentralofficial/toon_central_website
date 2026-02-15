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

### 6. DndProvider (drag-and-drop) wraps the entire app
**File:** `app/clientLayout.tsx` line 15
**Problem:** `react-dnd` and `HTML5Backend` are imported and mounted on every page. Drag-and-drop is only used in the creator's comic upload flow. This adds ~40KB+ of JS to the initial bundle that 99% of page views never use.
**Impact:** Larger initial JS bundle = slower Time to Interactive (TTI).

### 7. Framer Motion wraps ALL page content
**File:** `lib/appProvider.tsx` lines 80-86
```tsx
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}>
  {children}
</motion.div>
```
**Problem:** Every page transition triggers Framer Motion's animation system. This adds Framer Motion (~30KB gzipped) to the critical rendering path and causes a 750ms fade-in delay before content is fully visible.
**Impact:** Perceived slowness — content fades in over 0.75 seconds even when data is already available.

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

### 10. Search fires API call on every keystroke — no debounce
**File:** `app/_shared/layout/search.tsx` lines 40-46
**Problem:** `useQuery` with `queryKey: ["search", filter]` triggers a new API call every time the filter state changes. Since `handleSearch` updates filter on every `onChange`, typing "batman" fires 6 API requests.
**Impact:** Unnecessary API load and wasted bandwidth. On slow connections, stale results flash before final results appear.

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

### 13. HorizontalScroll (test.tsx) makes 3 hardcoded API calls
**File:** `app/_page/test.tsx` lines 26-44
**Problem:** Fetches genre list, then hardcodes genre IDs 1 (action) and 3 (comedy). Fires 3 API calls for a mobile-only component that desktop users never see.
**Impact:** 3 unnecessary network requests on mobile. Desktop users still download the component JS.

### 14. Redundant state management pattern everywhere
**Files:** Almost every section component (homeCarousel, popular, trending, originals, popularbytoons, todaysPicksMobile)
**Problem:** Components duplicate React Query's state into local useState:
```tsx
const [items, setItems] = useState([]);
const { data, isSuccess } = useQuery({...});
useEffect(() => {
  if (isSuccess) setItems(data?.data?.comics || []);
}, [isLoading, isFetching, data]);
```
React Query already manages loading/success/error states. This pattern causes extra re-renders (query resolves → effect runs → setState → re-render).
**Impact:** Double re-render per data fetch, unnecessary code complexity.

### 15. `window.matchMedia` resize listeners instead of CSS
**Files:** `homeCarousel.tsx` lines 63-79, `topRecommendations.tsx` lines 20-38, `trending.tsx` lines 21-39, `originals.tsx` lines 27-35
**Problem:** Multiple components attach `window.addEventListener("resize", ...)` to determine how many items to show. This is what CSS media queries (via Tailwind's responsive classes) or CSS `display: none` handle for free, without JavaScript.
**Impact:** Unnecessary re-renders on window resize. Each resize event triggers state updates and re-renders across 4+ components simultaneously.

### 16. Footer artificially delayed by 2 seconds
**File:** `app/_shared/layout/footermain.tsx` lines 74-86
```tsx
const timer = setTimeout(() => setIsVisible(true), delay); // delay = 2000
```
**Problem:** The footer is hidden for 2 seconds via setTimeout. This is a hack to avoid it appearing before content. A proper solution would use Intersection Observer or CSS.
**Impact:** Footer flashes in after 2 seconds, creating a layout shift.

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

### D3. Next.js `<Image>` with `fill` + `sizes` + Selective `priority`
**What we did on demo:** Replaced the raw `<img>` approach with Next.js `<Image>` using `fill` mode + `sizes` prop across all pages (homepage, comic detail, shorts). Only the hero carousel gets `priority`. Every other image lazy-loads automatically.

**What's wrong in the real site:** The site already uses `next/image` but incorrectly — every card uses fixed `width={200} height={240}` with inline styles to stretch to 100%:
```tsx
// Current pattern in all card components — suboptimal
<Image
  src={...}
  width={200}       // tells Next.js to generate a 200px image
  height={240}
  style={{ width: "100%", height: "100%" }}  // then stretches it via CSS
  priority          // on EVERY card — defeats the purpose
/>
```
This tells Next.js the image is 200px wide, but CSS stretches it to fill its container (often 300-400px). The browser downloads a too-small image and upscales it (blurry), OR downloads extra srcset sizes wastefully. And `priority` on every card means nothing is prioritized.

**What to do here:**
1. Switch to `fill` mode (image fills its `position: relative` parent)
2. Add `sizes` prop so the browser picks the right srcset variant per screen
3. Remove `priority` from all cards — keep only on the carousel's visible slide
```tsx
// Correct pattern from the demo:
<div className="relative h-[260px]">  {/* parent must be position: relative */}
  <Image
    src={optimizeCloudinaryUrl(cardData?.coverImage ?? "")}
    alt={cardData?.title || "toon_central"}
    fill                                    // fills the parent container
    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
    className="object-cover"                // CSS handles aspect ratio
    // NO priority — lazy loads by default
  />
</div>
```

**Impact:**
- `fill` + `sizes` = browser downloads exactly the right image size per device (phone gets 200px, desktop gets 400px)
- Removing `priority` from cards = above-the-fold carousel images load first, off-screen images lazy-load
- Next.js auto-converts to WebP/AVIF (smaller files than JPEG/PNG)

### D4. Search Modal with Debounce, Portal, and Keyboard Shortcuts
**What we did on demo:** Built a full search experience:
- **300ms debounce** — waits for the user to stop typing before calling the API. Minimum 2 characters required.
- **`createPortal`** — renders the modal directly on `<body>` so it escapes any parent stacking context (the nav's `backdrop-blur` was trapping the modal overlay on the demo — same risk here with NextUI's `Navbar`).
- **Keyboard shortcuts** — `Ctrl+K` / `Cmd+K` to open, `ESC` to close. Auto-focuses the input on open.
- **Thumbnail results** — search results show cover images, not just text buttons.

**What's wrong in the real site:** The current search (`app/_shared/layout/search.tsx`) fires a `useQuery` on every keystroke with no debounce, no minimum character requirement, and no keyboard shortcuts.

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

### D7. Cloudinary URL Optimization (Already Partially Done)
**What we did on demo:** Transformed Cloudinary URLs to include `w_800,q_auto,f_auto` for automatic format conversion (WebP/AVIF) and quality optimization.
**What's already here:** `imageUtils.ts` already has `optimizeCloudinaryUrl()` that inserts `w_800,q_auto,f_auto`. However, `CardTitleTop` on line 20 does NOT use it — it uses the raw URL:
```tsx
// cardTitleTop.tsx line 20 — raw URL, not optimized
src={`${cardData?.coverImage || ""}`}

// Should be:
src={optimizeCloudinaryUrl(cardData?.coverImage ?? "")}
```
**Impact:** `CardTitleTop` images (used in recommendations and trending) are served unoptimized — full size, original format. Fixing this reduces image size by 50-80%.

### D8. Video Poster Images Instead of Autoloading Videos
**What we did on demo:** The demo didn't have shorts videos on the homepage, so this is a new recommendation based on what we learned about lazy loading.
**What to do here:** Replace `<video src={item.upload}>` with a poster/thumbnail approach:
```tsx
// Instead of loading the full video:
<video src={item.upload} ... />

// Use a poster image, load video only on interaction:
<video poster={item.coverImage || item.thumbnail} preload="none" ... />
```
Or better yet, show a static `<Image>` with a play button overlay, and only load the `<video>` element when the user clicks or the slide becomes active.
**Impact:** Eliminates 10 video downloads (potentially 50-500MB) from homepage load. Replaces with ~10 thumbnail images (~500KB total).

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
