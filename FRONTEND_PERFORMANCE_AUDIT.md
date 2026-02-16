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

### 2. ✅ FIXED — Only carousel data was prefetched server-side
**File:** `app/page.tsx`
**What happened:** The homepage Server Component only prefetched the carousel queryKey. All other sections (recommendations/genres, popular, trending, shorts, originals, HorizontalScroll) fetched data client-side AFTER hydration. This meant:
1. Page HTML arrived from server (mostly empty skeletons)
2. JS bundle downloaded and executed
3. React hydrated
4. Each section fired its own API request
5. Data arrived, components re-rendered

**Fix (2 parts):**
1. **Expanded prefetches** — Added `Promise.all` with 7 prefetch queries matching the exact queryKeys used by each client component: `all_genres`, `carousel`, `popular_by_toon`, `trending`, `originals`, `shorts-home`, `genre_0` (first genre tab content). All run in parallel on the server using the existing `getRequest` helper. React Query's `HydrationBoundary` dehydrates the results into the initial HTML, so client components receive pre-populated cache — no client-side API calls on first load.
2. **Added page-level ISR** — `export const revalidate = 60` caches the entire rendered HTML for 60 seconds. Within that window, visitors get instant pre-built HTML with zero server rendering or API calls.

**Key detail — genre queryKey mismatch:** The original prefetch used `queryKey: ["genre_action"]` but the client `GenreTabContent` component uses `["genre_${activeTab.id}", activeTab.id]`. These didn't match, so React Query ignored the prefetched data. Fixed by using `["genre_0", 0]` (the "All" genre, which is the first tab — prepended by the API with ID 0).

**Impact:** Homepage loads with real data instead of skeletons. 7 API calls move from client-side to server-side. ISR caches the entire page HTML for 60 seconds — near-instant responses for repeat visitors with zero server rendering or API calls.

### 3. ✅ FIXED — `HomeShorts` was rendered TWICE on the homepage
**File:** `app/page.tsx`
**What happened:** Git history shows `<HomeShorts />` was originally placed between `<PopularByToons />` and `<HorizontalScroll />` (commit `ddc7588`, Oct 25 2025). Later, a second instance was added higher up between `<RecommendtnTabs />` and `<Popular />` (commit `d043153`, Jan 19 2026) — but the original was never removed.
**Why it matters:** Both instances use the same queryKey `"shorts-home"` and render identical content. React Query deduplicates the API call, but the browser still builds 2x the DOM — two Swiper carousels, two sets of `<video>` elements (up to 20 videos downloading instead of 10), and two sets of event listeners.
**Fix:** Removed the old (lower) instance, kept the newer (higher) position that the developer intentionally moved it to.

### 4. ✅ FIXED — All 10 short videos loaded on homepage
**File:** `app/_page/shortsHome.tsx` lines 128-137, 183-189
**What happened:** Every short in both the mobile and desktop Swiper carousels rendered `<video src={item.upload}>` without a `preload` attribute. The browser defaults to `preload="auto"`, which tells it to start downloading the entire video file for ALL 10 slides immediately — even though only the active (centered) slide plays. A single short video can be 5-50MB, so 10 concurrent video downloads compete with images and API calls for bandwidth.
**Why it matters:** On mobile connections, this could mean 50-500MB of video downloads before the user even scrolls. The page feels slow because the browser is saturating the network with video downloads instead of loading visible content.
**Fix:** Added `preload={index === activeIndex ? "auto" : "metadata"}` to both mobile and desktop video elements. The active slide's video downloads fully and plays automatically. Other slides load only metadata (first frame thumbnail, ~50KB) — giving a visual preview without downloading the full video (5-50MB each). Using `"metadata"` instead of `"none"` ensures all slides show a visible thumbnail regardless of which slide the Swiper considers "active."

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

---

## PART 2: Optimizations Proven on Demo (toon-demo) to Apply Here

These are optimizations we built and tested on the demo frontend that should be ported to this real website. Each was proven to work.

---

### D1. ~~Suspense Streaming~~ — NOT USED
**Tried and rejected.** We implemented per-section Suspense streaming with async Server Components. Each section loaded independently as its data arrived. However, the visual effect (sections appearing one by one) was undesirable — the page looked fragmented. Also, Suspense streaming prevents effective page-level ISR caching (the page can't be cached as a single HTML snapshot).
**Instead:** Using `Promise.all` to prefetch all 7 sections in parallel + page-level `revalidate = 60` (ISR). All sections load together, and the entire page is cached for 60 seconds. This is the better approach for the homepage where all sections load at similar speeds and content is the same for all users.

### D2. ✅ FIXED — ISR Caching for Homepage
**What we did on demo:** Added `next: { revalidate: 60 }` to the fetch options so homepage data is cached for 60 seconds.
**Fix (implemented as part of Fix #2):**
- Added `export const revalidate = 60` to `page.tsx` — caches the entire rendered page HTML for 60 seconds (ISR)
- All 7 homepage API calls are prefetched server-side via `Promise.all` using `getRequest`, and the results are dehydrated into the HTML via React Query's `HydrationBoundary`
**Impact:** After first load, homepage is served from cache for 60 seconds — near-instant response, zero server rendering or API calls for repeat visits within that window.

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

### D5. ~~Hybrid Server + Client Components~~ — NOT NEEDED
**Why skipped:** This approach would require rewriting every section component to accept props instead of using React Query's `useQuery`. The current approach (server prefetch + `HydrationBoundary` + `dehydrate`) achieves the same result — data is fetched server-side and passed to client components via React Query's cache — without modifying any client component code. The existing `"use client"` components work as-is because they find their data already in the hydrated cache.

### D6. ~~Fetch Priority API~~ — NOT NEEDED
**Why skipped:** Fetch Priority is a browser hint for client-side requests. Since all homepage data is now prefetched server-side (and cached via ISR + Data Cache), there are no client-side fetches to prioritize on initial load.

### D7. ✅ FIXED — Cloudinary URL Optimization missing on CardTitleTop
**What happened:** The codebase has `optimizeCloudinaryUrl()` in `imageUtils.ts` that inserts `w_800,q_auto,f_auto` into Cloudinary URLs — enabling automatic format conversion (WebP/AVIF) and quality optimization. `CardTitleOutside` and `CardTitleBottom` both used it, but `CardTitleTop` used the raw URL: `src={cardData?.coverImage || ""}`. This meant all images in the Recommendations and Trending sections were served at full original size and format.
**Fix:** Added `import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils"` and wrapped the src: `src={optimizeCloudinaryUrl(cardData?.coverImage ?? "")}`. These images now get automatic WebP/AVIF conversion and quality optimization — typically 50-80% smaller file sizes.

### D8. Video Poster Images Instead of Blank Frames
**Problem:** Videos show blank black frames before loading. With `preload="none"` on non-active slides, inactive videos show nothing until swiped to.
**Recommendation:** Add `poster={item.coverImage}` to `<video>` elements so the browser shows the cover image as a thumbnail while videos load.

### D9. ~~Suspense Skeleton Fallbacks~~ — NOT NEEDED
**Why skipped:** Since we're not using Suspense streaming (D1 was rejected), there are no `<Suspense>` boundaries that need skeleton fallbacks. The homepage loads all data server-side via `Promise.all` and renders everything at once. The `loading.tsx` spinner (Fix #19) already handles route transitions. The footer delay hack was already removed (Fix #16).

---

## Summary: Total Optimization Opportunities

| Category | Status | Details |
|----------|--------|---------|
| Part 1 fixes (20 total) | **18 FIXED**, 2 remaining | #1 (ClientLayout gate — needs deep investigation), #15 (resize listeners — design-dependent) |
| Part 2 demo optimizations (9 total) | **4 FIXED**, 2 remaining, 3 skipped | Fixed: D2 (ISR), D3 (sizes), D4 (debounce), D7 (Cloudinary). Remaining: D8 (video posters). Skipped: D1 (Suspense), D5 (Hybrid), D6 (Fetch Priority), D9 (Skeletons) |
| Backend API optimizations (task.md) | Separate track | #11, #13, #14, #15, #16, #18, #25 |

### Remaining Frontend Fixes
1. **#1 — ClientLayout `isClient` gate** — Needs investigation to identify which component causes hydration mismatch. Removing the gate causes errors.
2. **#15 — `window.matchMedia` resize listeners** — 4 components use JS resize listeners instead of CSS breakpoints. Requires testing responsive layouts.
3. **D8 — Video poster images** — Add `poster={item.coverImage}` to `<video>` elements so non-active shorts show thumbnails instead of blank frames.
