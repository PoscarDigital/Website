import { defineMiddleware } from 'astro:middleware';
import { khmerWords } from './i18n/khmer-words';

// Longest first so ការគ្រប់គ្រង wins over គ្រប់គ្រង at the same position.
const wordPattern = new RegExp(
  [...khmerWords].sort((a, b) => b.length - a.length).join('|'),
  'g',
);

// Elements whose text must be left alone.
const SKIP = /^<(script|style|title|textarea|template)\b/i;

/**
 * Wrap known Khmer words in <span class="kh-w"> (white-space: nowrap) in the
 * page body, so lines only break between whole words. See
 * src/i18n/khmer-words.ts for why. Only text between tags is touched —
 * never attributes, <script>, <style> or <head>.
 */
function protectKhmerWords(html: string): string {
  const bodyStart = html.indexOf('<body');
  if (bodyStart < 0) return html;
  const parts = html.slice(bodyStart).split(/(<[^>]*>)/);
  let skipUntil: string | null = null;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (i % 2 === 1) {
      // a tag
      if (skipUntil) {
        if (part.toLowerCase().startsWith(skipUntil)) skipUntil = null;
      } else {
        const m = part.match(SKIP);
        if (m && !part.endsWith('/>')) skipUntil = `</${m[1].toLowerCase()}`;
      }
      continue;
    }
    if (skipUntil || !/[ក-៿]/.test(part)) continue;
    parts[i] = part.replace(wordPattern, (w) => `<span class="kh-w">${w}</span>`);
  }
  return html.slice(0, bodyStart) + parts.join('');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const isKhmer = /^\/km(\/|$)/.test(context.url.pathname);
  const type = response.headers.get('content-type') ?? '';
  if (!isKhmer || !type.includes('text/html')) return response;
  const html = await response.text();
  return new Response(protectKhmerWords(html), {
    status: response.status,
    headers: response.headers,
  });
});
