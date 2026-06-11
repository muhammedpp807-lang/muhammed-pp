/**
 * MUHAMMED PP — API Service Layer
 * Simulates a production-grade REST API (Node/Express + MongoDB)
 * backed by localStorage for demo purposes. All endpoints are async
 * and return promises, mimicking network latency.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const LATENCY = 180;
const wait = <T,>(data: T): Promise<T> => new Promise(r => setTimeout(() => r(data), LATENCY + Math.random() * 120));

// ============ Analytics tracker (simulates server-side analytics) ============
interface AnalyticsEvent {
  type: "page_view" | "download" | "like" | "comment" | "rating" | "follow";
  target?: string;
  meta?: Record<string, any>;
  at: string;
  sessionId: string;
  device: "desktop" | "mobile" | "tablet";
  browser: string;
  country: string;
}

const SESSION = Math.random().toString(36).slice(2);
const COUNTRIES = ["India","United States","United Arab Emirates","United Kingdom","Germany","Saudi Arabia","Canada","Australia","Japan","Singapore"];
const BROWSERS = ["Chrome","Firefox","Safari","Edge","Arc"];
const device = () => {
  const w = window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
};
const browser = () => BROWSERS[Math.floor(Math.random()*BROWSERS.length)];
const country = () => COUNTRIES[Math.floor(Math.random()*COUNTRIES.length)];

const AN_KEY = "mp_analytics";
const readAnalytics = (): AnalyticsEvent[] => {
  try { return JSON.parse(localStorage.getItem(AN_KEY) || "[]"); } catch { return []; }
};
const writeAnalytics = (list: AnalyticsEvent[]) => localStorage.setItem(AN_KEY, JSON.stringify(list));

export const Analytics = {
  track(type: AnalyticsEvent["type"], target?: string, meta?: Record<string, any>) {
    const ev: AnalyticsEvent = { type, target, meta, at: new Date().toISOString(), sessionId: SESSION, device: device(), browser: browser(), country: country() };
    const list = readAnalytics();
    list.push(ev);
    // keep last 500
    writeAnalytics(list.slice(-500));
    return wait({ ok: true });
  },
  list() { return wait(readAnalytics()); },
  summary() {
    const list = readAnalytics();
    const byType: Record<string, number> = {};
    const byPage: Record<string, number> = {};
    const byCountry: Record<string, number> = {};
    const byDevice: Record<string, number> = {};
    const byBrowser: Record<string, number> = {};
    list.forEach(e => {
      byType[e.type] = (byType[e.type] || 0) + 1;
      if (e.type === "page_view" && e.target) byPage[e.target] = (byPage[e.target] || 0) + 1;
      byCountry[e.country] = (byCountry[e.country] || 0) + 1;
      byDevice[e.device] = (byDevice[e.device] || 0) + 1;
      byBrowser[e.browser] = (byBrowser[e.browser] || 0) + 1;
    });
    return wait({ total: list.length, byType, byPage, byCountry, byDevice, byBrowser });
  }
};

// ============ File upload (simulates Cloudinary / Firebase Storage) ============
export interface UploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export async function uploadFile(file: File): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // for images, return data url; otherwise simulate cloud url
      const url = file.type.startsWith("image/") ? (reader.result as string) : `https://cdn.muhammedpp.dev/uploads/${Date.now()}-${encodeURIComponent(file.name)}`;
      wait({ url, name: file.name, size: file.size, type: file.type, uploadedAt: new Date().toISOString() }).then(resolve);
    };
    reader.onerror = () => reject(new Error("Upload failed"));
    reader.readAsDataURL(file);
  });
}

// ============ Rate limiter (simulates Express rate limiting) ============
const rateStore = new Map<string, { count: number; resetAt: number }>();
export function rateLimit(key: string, max = 5, windowMs = 60_000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateStore.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) { entry.count = 0; entry.resetAt = now + windowMs; }
  entry.count++;
  rateStore.set(key, entry);
  return { allowed: entry.count <= max, remaining: Math.max(0, max - entry.count) };
}

// ============ Validators ============
export const validators = {
  email(s: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); },
  required(s: any) { return s !== null && s !== undefined && String(s).trim().length > 0; },
  password(s: string) { return s.length >= 6; },
  sanitize(s: string) {
    return s.replace(/<[^>]*>/g, "").slice(0, 5000);
  }
};

// ============ JWT-like token (client-side simulation) ============
export const token = {
  issue(payload: Record<string, any>) {
    const body = btoa(unescape(encodeURIComponent(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 7 * 86400_000 }))));
    const sig = btoa(`sig_${Math.random().toString(36).slice(2)}`);
    return `mp.${body}.${sig}`;
  },
  verify(t: string | null): Record<string, any> | null {
    if (!t) return null;
    try {
      const [, body] = t.split(".");
      const p = JSON.parse(decodeURIComponent(escape(atob(body))));
      if (p.exp < Date.now()) return null;
      return p;
    } catch { return null; }
  }
};

export type { AnalyticsEvent };
