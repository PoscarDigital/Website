// Language Utils
import { getCollection } from 'astro:content';
import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return async function t(key: keyof typeof ui[typeof defaultLang] | string) {
    // Handle UI translations
    if (key in ui[lang]) {
      return ui[lang][key as keyof typeof ui[typeof defaultLang]];
    }
    if (key in ui[defaultLang]) {
      return ui[defaultLang][key as keyof typeof ui[typeof defaultLang]];
    }
    
    // Handle content translations
    const content = await getContentTranslations(lang);
    const keys = key.split('.');
    let value = content;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }
}

export async function getContentTranslations(lang: keyof typeof ui) {
  const content = await import(`./content/${lang}.json`);
  return content.default;
}