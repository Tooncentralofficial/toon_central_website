/**
 * If the URL is from Cloudinary, inserts transformation params for optimized
 * delivery (smaller size, auto format/quality). Non-Cloudinary URLs are returned unchanged.
 */
export function optimizeCloudinaryUrl(
  src: string | undefined | null,
  options?: { width?: number }
): string {
  if (src == null || typeof src !== "string" || !src.trim()) return "";
  const url = src.trim();
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  const width = options?.width ?? 800;
  const transform = `w_${width},q_auto,f_auto`;
  return url.replace("/upload/", `/upload/${transform}/`);
}
