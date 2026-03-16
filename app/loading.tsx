import { ToonCentralIcon } from "./_shared/icons/icons";

export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg-primary)] flex items-center justify-center overflow-hidden">
      <div className="relative flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div className="absolute h-36 w-36 rounded-full bg-[var(--green100)]/20 blur-3xl animate-pulse" />

        <div className="relative flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full border border-[var(--green100)]/25" />
          <div className="absolute h-36 w-36 rounded-full border border-[var(--green100)]/10 animate-ping" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[var(--bg-secondary)] shadow-[0_0_40px_rgba(5,131,75,0.18)] animate-bounce">
            <ToonCentralIcon className="h-14 w-14" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg font-semibold tracking-[0.2em] text-[var(--text-primary)]">
            TOON CENTRAL
          </p>
          <div className="flex items-center justify-center gap-2 text-[#969AA0]">
            <span className="text-sm uppercase tracking-[0.35em]">
              Loading
            </span>
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green100)] animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green100)] animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--green100)] animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
