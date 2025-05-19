// Language Utils
import { getCollection } from 'astro:content';
import { ui, defaultLang } from './ui';

// Track translation lookups
const translationLookups = new Map<string, {
  count: number;
  found: boolean;
  lastAccessed: Date;
  languages: Set<string>;
}>();

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return async function t(key: string) {
    // Track this lookup
    const lookup = translationLookups.get(key) || {
      count: 0,
      found: false,
      lastAccessed: new Date(),
      languages: new Set()
    };
    lookup.count++;
    lookup.lastAccessed = new Date();
    lookup.languages.add(lang);
    
    // First try UI translations (i18n/*.json)
    const keys = key.split('.');
    let value: any = ui[lang];
    
    // Traverse the UI translation object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // If not found in current language, try default language
        value = ui[defaultLang];
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            // If still not found, try content translations
            const content = await getContentTranslations(lang);
            value = content;
            for (const k3 of keys) {
              if (value && typeof value === 'object' && k3 in value) {
                value = value[k3];
              } else {
                translationLookups.set(key, lookup);
                return key;
              }
            }
            break;
          }
        }
        break;
      }
    }
    
    lookup.found = true;
    translationLookups.set(key, lookup);
    return typeof value === 'string' ? value : key;
  }
}

export async function getContentTranslations(lang: keyof typeof ui) {
  const content = await import(`./content/${lang}.json`);
  return content.default;
}

// Debug function to get translation lookup stats
export function getTranslationStats() {
  const stats = Array.from(translationLookups.entries()).map(([key, data]) => ({
    key,
    count: data.count,
    found: data.found,
    lastAccessed: data.lastAccessed,
    languages: Array.from(data.languages)
  }));
  
  console.table(stats);
  return stats;
}

// Debug function to find missing translations
export function findMissingTranslations() {
  const missing = Array.from(translationLookups.entries())
    .filter(([_, data]) => !data.found)
    .map(([key, data]) => ({
      key,
      count: data.count,
      lastAccessed: data.lastAccessed,
      languages: Array.from(data.languages)
    }));
  
  console.table(missing);
  return missing;
}