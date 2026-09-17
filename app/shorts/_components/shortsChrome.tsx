"use client";

import React from "react";
import { ArrowDownIcon, PlayIcon } from "@/app/_shared/icons/icons";
import { ShortsType } from "@/helpers/types";

/**
 * Shared presentation pieces for the two shorts surfaces — the /shorts
 * carousel and the single short page. Both were drifting apart visually, so
 * the chrome that sits on top of the video lives here once.
 *
 * Everything keeps the existing palette (#05834B brand green, #FCFCFDB2 muted
 * white) and the existing icon set rather than introducing new ones.
 */

/** mm:ss. Empty until the browser knows how long the clip actually is. */
export const formatDuration = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";

  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;

  return `${mins}:${String(secs).padStart(2, "0")}`;
};

/**
 * Follows whichever video is on screen. Reads the real element rather than
 * running a timer, so the bar and the badge cannot drift away from what is
 * actually playing — buffering, seeking and looping all stay in step.
 */
export function useVideoClock(
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>,
  index: number
) {
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  React.useEffect(() => {
    const video = videoRefs.current?.[index];
    if (!video) return;

    const sync = () => {
      const total = video.duration;

      if (!Number.isFinite(total) || total <= 0) {
        setDuration(0);
        setProgress(0);
        return;
      }

      setDuration(total);
      setProgress(Math.min(1, Math.max(0, video.currentTime / total)));
    };

    sync();

    const events = [
      "timeupdate",
      "loadedmetadata",
      "durationchange",
      "seeked",
      "emptied",
    ];

    events.forEach((event) => video.addEventListener(event, sync));

    return () => {
      events.forEach((event) => video.removeEventListener(event, sync));
    };
  }, [videoRefs, index]);

  return { progress, duration };
}

interface ClockProps {
  videoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  index: number;
  className?: string;
}

/**
 * Kept as its own component on purpose: timeupdate fires several times a
 * second, and this way only the bar re-renders rather than the whole card.
 */
export function ShortProgressBar({ videoRefs, index, className = "" }: ClockProps) {
  const { progress } = useVideoClock(videoRefs, index);

  return (
    <div
      className={`absolute top-0 left-0 right-0 z-[24] h-[3px] bg-white/20 ${className}`}
      role="progressbar"
      aria-label="Playback progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div
        className="h-full bg-[#05834B] transition-[width] duration-100 ease-linear"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

export function DurationBadge({ videoRefs, index, className = "" }: ClockProps) {
  const { duration } = useVideoClock(videoRefs, index);
  const label = formatDuration(duration);

  if (!label) return null;

  return (
    <div
      className={`absolute z-[22] rounded bg-black/50 px-2 py-[2px] text-[0.65rem] tracking-wider text-[#FCFCFDB2] backdrop-blur-sm ${className}`}
    >
      {label}
    </div>
  );
}

/**
 * Tap feedback. `trigger` is a counter the parent bumps on each tap — a
 * boolean would not re-fire when the reader taps twice in a row.
 */
export function PlayPulse({
  trigger,
  isPaused,
}: {
  trigger: number;
  isPaused: boolean;
}) {
  const [flash, setFlash] = React.useState(false);

  React.useEffect(() => {
    if (!trigger) return;

    setFlash(true);
    const timer = setTimeout(() => setFlash(false), 550);

    return () => clearTimeout(timer);
  }, [trigger]);

  const circle = (animated: boolean) => (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <span
        className={`flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ${
          animated ? "shorts-play-pulse" : ""
        }`}
      >
        <PlayIcon className="ml-1 h-7 w-7 text-white" />
      </span>
    </div>
  );

  /*
   * A paused video keeps a steady button instead of the mockup's flash-only
   * treatment: a frozen frame with nothing on it just reads as broken.
   */
  if (isPaused) return circle(false);
  if (!flash) return null;

  return circle(true);
}

/** Nudge towards the next short. Hides itself once the reader has scrolled. */
export function ScrollHint({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute bottom-3 left-1/2 z-[22] flex -translate-x-1/2 flex-col items-center gap-0.5 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm md:bottom-6 md:left-auto md:right-6 md:translate-x-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
      <ArrowDownIcon className="shorts-scroll-bob h-4 w-4 text-[#FCFCFD]" />
      <span className="text-[0.55rem] uppercase tracking-[0.1em] text-[#FCFCFDB2]">
        Next
      </span>
    </div>
  );
}

/**
 * Creator line, title, description and genre pills as one block, the way the
 * mockup groups them. `followSlot` takes the caller's follow button so the
 * follow mutations stay where they already live.
 */
export function ShortMeta({
  short,
  followSlot,
  avatar,
  badge,
  className = "",
  compact = false,
}: {
  short?: Partial<ShortsType> | null;
  followSlot?: React.ReactNode;
  /** Rendered before the username — the single-short overlay shows a photo. */
  avatar?: React.ReactNode;
  /** Rendered after the username, e.g. the verified tick. Needs a username. */
  badge?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  if (!short) return null;

  const genres = Array.isArray(short.genres) ? short.genres : [];
  const username = short.user?.username;

  return (
    <div className={`flex flex-col gap-1.5 md:gap-2 ${className}`}>
      <div className="flex items-center gap-2 md:gap-3">
        {avatar}
        {username ? (
          <h3 className="line-clamp-1 flex items-center gap-1 text-sm text-[#FCFCFDB2] md:text-lg">
            {username}
            {badge}
          </h3>
        ) : null}
        {followSlot}
      </div>

      <h2
        className={`line-clamp-2 font-semibold leading-tight text-[#FCFCFD] ${
          compact ? "text-base md:text-xl" : "text-lg md:text-2xl"
        }`}
      >
        {short.title}
      </h2>

      {short.description ? (
        <p className="line-clamp-2 max-w-[20rem] text-xs leading-relaxed text-[#FCFCFDB2] md:text-sm">
          {short.description}
        </p>
      ) : null}

      {genres.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {genres.map((genre: any, index: number) => (
            <span
              key={genre?.id ?? index}
              className="border border-[#05834BF5] px-2 py-[0.1rem] text-[0.6rem] uppercase tracking-wide text-[#FCFCFDB2] md:px-3 md:py-1 md:text-xs"
            >
              {genre?.genre?.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
