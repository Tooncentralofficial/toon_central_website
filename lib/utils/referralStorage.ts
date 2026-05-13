const STORAGE_KEY = "tooncentral_referral_code";

export function setReferralCode(code: string | null | undefined): void {
  if (typeof window === "undefined") return;
  if (code) {
    window.localStorage.setItem(STORAGE_KEY, code);
  }
}

export function getReferralCode(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

export function clearReferralCode(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
