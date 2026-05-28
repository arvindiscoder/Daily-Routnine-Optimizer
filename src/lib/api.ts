/**
 * Helper to resolve the correct API base URL based on the runtime environment.
 * If running on a native Capacitor platform (like Android), it routes requests
 * to the deployed hosted Cloud Run backend. Otherwise, it uses relative paths.
 */
export function getApiUrl(path: string): string {
  const origin = window.location.origin;

  // Detect Capacitor native platform environments (which serve on localhost with port !== 3000,
  // or use capacitor://localhost or file:// protocol)
  const isCapacitorNative =
    origin.startsWith("capacitor://") ||
    (origin.includes("localhost") && window.location.port !== "3000") ||
    origin.startsWith("file://");

  if (isCapacitorNative) {
    // Return the absolute shared app URL to utilize the server-side Gemini gateway
    const liveEndpoint = "https://ais-pre-m44ow4ss2wumsirjm4g6tf-345839305767.us-west1.run.app";
    return `${liveEndpoint}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  return path;
}
