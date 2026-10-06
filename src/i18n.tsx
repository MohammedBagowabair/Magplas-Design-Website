import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'en' | 'ms'
type Ctx<T> = { lang: Lang; setLang: (l: Lang) => void; c: T }
const I18nContext = createContext<Ctx<unknown> | null>(null)

export function I18nProvider<T>({ content, children }: { content: Record<Lang, T>; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem('lang')
      return s === 'ms' || s === 'en' ? s : 'en'
    } catch {
      return 'en'
    }
  })
  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('lang', l) } catch { /* ignore */ }
  }
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = 'ltr'
  }, [lang])
  const value = useMemo(() => ({ lang, setLang, c: content[lang] }), [lang, content])
  return <I18nContext.Provider value={value as Ctx<unknown>}>{children}</I18nContext.Provider>
}

export function useI18n<T>() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n outside provider')
  return ctx as Ctx<T>
}

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
