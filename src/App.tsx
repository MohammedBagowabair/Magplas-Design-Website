import { useCallback, useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { useI18n, asset } from './i18n'
import { Reveal } from './Reveal'
import { useActiveSection, useMenu } from './hooks'
import { type Content, gallery, WA, PHONE, MAPS, PITCH_WA } from './content'

const useC = () => useI18n<Content>()
const wa = (t: string) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`
const img = (n: string, w: 640 | 1200) => asset(`images/${n}-${w}.webp`)
const set = (n: string) => `${img(n, 640)} 640w, ${img(n, 1200)} 1200w`

function WaIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  )
}

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center bg-graphite text-concrete">
        <span className="xp text-[15px] leading-none">M</span>
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 bg-signal" />
      </span>
      <span className="leading-none">
        <span className="xp block text-[17px] tracking-tight">Magplas</span>{' '}
        <span className="mono mt-1 block text-[8.5px] text-steel">Design Sdn Bhd</span>
      </span>
    </span>
  )
}

function Header() {
  const { c, lang, setLang } = useC()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const closeMenu = useCallback(() => setOpen(false), [])
  useMenu(open, closeMenu, btnRef)
  const links = Object.entries(c.nav) as [string, string][]
  const active = useActiveSection(links.map(([id]) => id))
  return (
    <header className="bar fixed inset-x-0 top-0 z-40 border-b border-line/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="tap flex items-center"><Logo /></a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label={c.a11y.main}>
          {links.map(([id, l]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'true' : undefined} className={`nav-link mono relative py-3.5 text-[11.5px] transition hover:text-signal-ink ${active === id ? 'text-graphite' : 'text-graphite/75'}`}>{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <button data-lang-toggle onClick={() => setLang(lang === 'en' ? 'ms' : 'en')} aria-label={c.langAria} className="tap mono border border-graphite/20 px-3 text-xs font-medium transition hover:border-signal hover:text-signal">{c.langLabel}</button>
          <a href={wa(c.contact.waText)} target="_blank" rel="noopener" className="tap hidden items-center gap-2 bg-signal px-4 text-[13px] font-semibold text-coal transition hover:bg-graphite hover:text-white sm:inline-flex"><WaIcon className="h-4 w-4" />{c.contact.wa}</a>
          <button ref={btnRef} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mnav" aria-label={open ? c.close : c.menu} className="tap grid place-items-center border border-graphite/20 lg:hidden">
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-graphite transition ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-graphite transition ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mnav" className="fade grid-bg h-[calc(100dvh-4rem)] overflow-y-auto bg-concrete px-5 pb-10 pt-2 lg:hidden" aria-label={c.a11y.mobile}>
          {links.map(([id, l], i) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} aria-current={active === id ? 'true' : undefined} className={`flex min-h-[58px] items-center justify-between border-b border-line transition active:text-signal-ink ${active === id ? 'text-signal-ink' : ''}`}>
              <span className="xp text-2xl">{l}</span><span className="mono text-[11px] text-steel">0{i + 1}</span>
            </a>
          ))}
          <a href={wa(c.contact.waText)} target="_blank" rel="noopener" className="mt-8 flex min-h-[52px] items-center justify-center gap-2 bg-signal font-semibold text-coal"><WaIcon />{c.contact.wa}</a>
        </nav>
      )}
    </header>
  )
}

function Hero() {
  const { c } = useC()
  return (
    <section id="top" className="grid-bg relative overflow-hidden pt-16">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-8 sm:px-8 lg:pb-20 lg:pt-14">
        <p className="kick">{c.hero.tag}</p>
        <h1 className="xp mt-5 leading-[0.9]" style={{ fontSize: 'clamp(2.15rem, 10.2vw, 8.25rem)' }}>
          {c.hero.lines.map((l, i) => (
            <span key={l} className="rise">
              <span style={{ animationDelay: `${120 + i * 110}ms` }} className={i === 1 ? 'outline-text' : i === 2 ? 'text-signal' : ''}>{l}</span>
            </span>
          ))}
        </h1>
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="max-w-md text-[15.5px] leading-relaxed text-graphite/75 sm:text-base">{c.hero.lead}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={wa(c.contact.waText)} target="_blank" rel="noopener" className="inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap bg-signal px-6 font-semibold text-coal transition hover:bg-graphite hover:text-white"><WaIcon />{c.hero.cta}</a>
              <a href="#process" className="inline-flex min-h-[52px] items-center justify-center gap-2 whitespace-nowrap border border-graphite px-6 font-semibold transition hover:bg-graphite hover:text-concrete">{c.hero.cta2} <span aria-hidden>↓</span></a>
            </div>
            <div className="mt-10 space-y-7">
              {[{ k: '<1%', l: c.hero.dimA }, { k: '4.9★', l: c.hero.dimB }].map((d, i) => (
                <div key={d.l}>
                  <div className="flex items-end justify-between gap-4">
                    <span className="xp text-4xl leading-none sm:text-5xl">{d.k}</span>
                    <span className="mono pb-1 text-right text-[10.5px] text-steel">{d.l}</span>
                  </div>
                  <div className="dim dim-grow on mt-3" style={{ transitionDelay: `${500 + i * 200}ms` }} />
                </div>
              ))}
            </div>
          </div>
          <div className="relative lg:col-span-7">
            <span className="cross -left-1 -top-1 z-10" aria-hidden /><span className="cross -right-1 -top-1 z-10" aria-hidden />
            <span className="cross -bottom-1 -left-1 z-10" aria-hidden /><span className="cross -bottom-1 -right-1 z-10" aria-hidden />
            <div className="relative aspect-[4/3] overflow-hidden bg-line lg:aspect-[16/11]">
              <img src={img('hero', 1200)} srcSet={set('hero')} sizes="(min-width:1024px) 55vw, 92vw" width={1200} height={800} alt={c.hero.caption} loading="eager" fetchPriority="high" decoding="sync" className="h-full w-full object-cover" />
              <span className="mono absolute bottom-3 left-3 bg-concrete/90 px-2 py-1 text-[10px] text-graphite">{c.hero.caption}</span>
              <span className="mono absolute right-3 top-3 bg-graphite px-2 py-1 text-[10px] text-concrete">3.13°N 101.72°E</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Ticker() {
  const { c } = useC()
  const row = [...c.ticker, ...c.ticker]
  return (
    <div className="overflow-hidden bg-graphite py-4 text-concrete" aria-hidden>
      <div className="marquee">
        {row.map((t, i) => <span key={i} className="mono flex items-center gap-6 whitespace-nowrap px-6 text-[13px]">{t}<span className="h-2 w-2 bg-signal" /></span>)}
      </div>
    </div>
  )
}

function Services() {
  const { c } = useC()
  return (
    <section id="services" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div><p className="kick">{c.services.kicker}</p><h2 className="h2 mt-4">{c.services.title}</h2></div>
        </Reveal>
        <div className="mt-12 grid border-l border-t border-line sm:grid-cols-2">
          {c.services.items.map((s, i) => (
            <Reveal key={s.code} delay={i * 80} className="spec border-b border-r border-line bg-paper/60 p-6 sm:p-8">
              <div className="flex items-start justify-between">
                <span className="mono text-[11px] text-signal-ink">{s.code}</span>
                <span className="mono text-[10px] text-steel">0{i + 1}/04</span>
              </div>
              <h3 className="xp mt-8 text-xl leading-tight sm:text-2xl">{s.t}</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-graphite/70">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Slider() {
  const { c } = useC()
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const drag = useRef(false)
  const move = (x: number) => {
    const r = box.current!.getBoundingClientRect()
    setPos(Math.min(100, Math.max(0, ((x - r.left) / r.width) * 100)))
  }
  const down = (e: RPointerEvent) => { drag.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); move(e.clientX) }
  return (
    <section className="grid-bg-dark bg-coal py-20 text-concrete sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7"><p className="kick !text-concrete/60">{c.slider.kicker}</p><h2 className="h2 mt-4">{c.slider.title}</h2></div>
          <p className="max-w-md text-[15px] leading-relaxed text-concrete/65 lg:col-span-5">{c.slider.lead}</p>
        </Reveal>
        <Reveal className="mt-12">
          <div ref={box} className="ba relative aspect-[4/3] overflow-hidden bg-graphite sm:aspect-[16/9]"
            onPointerDown={down} onPointerMove={(e) => drag.current && move(e.clientX)} onPointerUp={() => (drag.current = false)} onPointerCancel={() => (drag.current = false)}>
            <img src={img('after', 1200)} srcSet={set('after')} sizes="(min-width:1280px) 1216px, 100vw" width={1200} height={800} alt={c.slider.after} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <img src={img('before', 1200)} srcSet={set('before')} sizes="(min-width:1280px) 1216px, 100vw" width={1200} height={800} alt={c.slider.before} loading="lazy" decoding="async" className="h-full w-full object-cover" draggable={false} />
            </div>
            <span className="mono absolute left-3 top-3 bg-concrete px-2 py-1 text-[10.5px] text-graphite">{c.slider.before}</span>
            <span className="mono absolute right-3 top-3 bg-signal px-2 py-1 text-[10.5px] text-coal">{c.slider.after}</span>
            <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-signal" style={{ left: `${pos}%` }}>
              <button role="slider" aria-label={c.slider.aria} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
                aria-valuetext={`${Math.round(pos)}% ${c.slider.before}`}
                onKeyDown={(e) => {
                  const k: Record<string, (p: number) => number> = { ArrowLeft: (p) => p - 5, ArrowDown: (p) => p - 5, ArrowRight: (p) => p + 5, ArrowUp: (p) => p + 5, Home: () => 0, End: () => 100, PageDown: (p) => p - 20, PageUp: (p) => p + 20 }
                  if (k[e.key]) { e.preventDefault(); setPos((p) => Math.min(100, Math.max(0, k[e.key](p)))) }
                }}
                className="pointer-events-auto absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-signal text-coal shadow-xl ring-4 ring-coal/20 transition-transform active:scale-95">
                <span aria-hidden className="text-lg">⟷</span>
              </button>
            </div>
          </div>
          <p className="mono mt-3 text-[10.5px] text-concrete/70">{c.slider.note}</p>
        </Reveal>
      </div>
    </section>
  )
}

const stepImg = ['plan', 'before', 'plan', 'build', 'finish']

function Process() {
  const { c } = useC()
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])
  const [wide, setWide] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)) })
    }, { rootMargin: '-45% 0px -50% 0px' })
    refs.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [])
  const n = c.process.steps.length
  return (
    <section id="process" className="bg-graphite py-20 text-concrete sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <p className="kick !text-concrete/60">{c.process.kicker}</p>
            <h2 className="h2 h2-tight mt-4">{c.process.title}</h2>
            <div className="mt-8 flex items-center gap-4">
              <span className="xp text-5xl text-signal">0{active + 1}</span>
              <div className="flex-1">
                <div className="h-1 bg-white/10"><div className="h-1 bg-signal transition-all duration-500" style={{ width: `${((active + 1) / n) * 100}%` }} /></div>
                <p className="mono mt-2 text-[10.5px] text-concrete/70">{c.process.steps[active].tag} · 0{active + 1}/0{n}</p>
              </div>
            </div>
            {wide && <div className="relative mt-8 aspect-[4/3] overflow-hidden bg-coal">
              {stepImg.map((s, i) => (
                <img key={i} src={img(s, 640)} width={640} height={427} loading="lazy" decoding="async" alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${active === i ? 'opacity-100' : 'opacity-0'}`} />
              ))}
              <span className="mono absolute bottom-3 left-3 bg-coal/85 px-2 py-1 text-[10px]">{c.hero.caption}</span>
            </div>}
          </div>
        </div>
        <ol className="relative lg:col-span-6 lg:col-start-7">
          <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-white/15" />
          {c.process.steps.map((s, i) => (
            <li key={s.t} ref={(el) => { refs.current[i] = el }} data-i={i} className="relative pb-14 pl-16 last:pb-0 lg:pb-28">
              <span className={`absolute left-0 top-0 grid h-10 w-10 place-items-center border font-mono text-sm transition-colors duration-500 ${active >= i ? 'border-signal bg-signal text-coal' : 'border-white/25 bg-graphite text-concrete/70'}`}>0{i + 1}</span>
              <p className="mono text-[10.5px] text-signal">{s.tag}</p>
              <h3 className={`xp mt-2 text-2xl leading-tight transition-colors duration-500 sm:text-3xl ${active === i ? 'text-concrete' : 'text-concrete/45'}`}>{s.t}</h3>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-concrete/65">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Principles() {
  const { c } = useC()
  return (
    <section id="principles" className="grid-bg py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><p className="kick">{c.principles.kicker}</p><h2 className="h2 mt-4 max-w-4xl">{c.principles.title}</h2></Reveal>
        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-10">
          {c.principles.items.map((p, i) => (
            <Reveal key={p.t} delay={i * 120}>
              <p className="xp leading-none text-signal" style={{ fontSize: 'clamp(3rem, 5.5vw, 4.5rem)' }}>{p.k}</p>
              <div className="dim dim-grow mt-5" />
              <h3 className="xp mt-5 text-xl">{p.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-graphite/70">{p.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Work() {
  const { c } = useC()
  return (
    <section id="work" className="border-t border-line bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal><p className="kick">{c.work.kicker}</p><h2 className="h2 mt-4">{c.work.title}</h2></Reveal>
        <Reveal className="mt-10">
          <div className="mono hidden grid-cols-12 border-b-2 border-graphite pb-3 text-[10.5px] text-steel sm:grid">
            <span className="col-span-1">#</span><span className="col-span-6">{c.work.cols[0]}</span><span className="col-span-2">{c.work.cols[1]}</span><span className="col-span-3 text-right">{c.work.cols[2]}</span>
          </div>
          {c.work.rows.map((r, i) => (
            <div key={r.n} className="grid grid-cols-12 items-baseline gap-y-1 border-b border-line py-5">
              <span className="mono col-span-2 text-[11px] text-signal-ink sm:col-span-1">P-0{i + 1}</span>
              <span className="xp col-span-10 text-lg leading-tight sm:col-span-6 sm:text-xl">{r.n}</span>
              <span className="mono col-span-6 col-start-3 text-[11px] text-steel sm:col-span-2 sm:col-start-auto">{r.type}</span>
              <span className="mono col-span-4 text-right text-[11px] text-steel sm:col-span-3">{r.loc}</span>
            </div>
          ))}
        </Reveal>
        <Reveal className="mt-16 flex flex-wrap items-end justify-between gap-3">
          <h3 className="xp text-xl">{c.work.galleryTitle}</h3>
          <p className="mono text-[10.5px] text-steel">{c.work.galleryNote}</p>
        </Reveal>
        <div tabIndex={0} role="region" aria-label={c.a11y.gallery} className="-mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0">
          {gallery.map((g, i) => (
            <figure key={g.img} className={`relative w-[78%] shrink-0 snap-start overflow-hidden bg-line sm:w-auto ${i < 2 ? 'sm:col-span-3' : 'sm:col-span-2'}`}>
              <img src={img(g.img, 640)} srcSet={set(g.img)} sizes={i < 2 ? '(min-width:640px) 50vw, 78vw' : '(min-width:640px) 33vw, 78vw'} width={g.w} height={g.h} loading="lazy" decoding="async" alt={c.work.galleryTitle} className="aspect-[4/3] h-full w-full object-cover transition duration-700 hover:scale-[1.04]" />
              <figcaption className="mono absolute left-2 top-2 bg-concrete/90 px-1.5 py-0.5 text-[9.5px]">IMG-0{i + 1}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const { c } = useC()
  const [i, setI] = useState(0)
  const n = c.reviews.items.length
  const go = useCallback((d: number) => setI((v) => (v + d + n) % n), [n])
  const r = c.reviews.items[i]
  return (
    <section id="reviews" className="bg-signal py-20 text-coal sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="mono inline-flex items-center gap-2 text-[11px] text-coal/80"><span className="h-2 w-2 bg-coal" />{c.reviews.kicker}</p>
          <h2 className="h2 mt-4">{c.reviews.title}</h2>
          <p className="mt-3 text-lg">★★★★★ <span className="mono text-xs text-coal/80">{c.reviews.sub}</span></p>
        </Reveal>
        <div className="lg:col-span-7 lg:col-start-6">
          <blockquote key={`${i}-${c.reviews.kicker}`} className="fade min-h-[220px] sm:min-h-[200px]">
            <p className="text-[1.35rem] font-medium leading-snug sm:text-[1.75rem]">“{r.q}”</p>
            <footer className="mono mt-6 text-[11px] text-coal/80">— {r.a}</footer>
          </blockquote>
          <div className="mt-8 flex items-center gap-3">
            <button onClick={() => go(-1)} aria-label={c.reviews.prev} className="tap grid h-12 w-12 place-items-center border border-coal/60 text-xl transition hover:bg-coal hover:text-signal">←</button>
            <button onClick={() => go(1)} aria-label={c.reviews.next} className="tap grid h-12 w-12 place-items-center border border-coal/60 text-xl transition hover:bg-coal hover:text-signal">→</button>
            <span className="mono ml-2 text-xs text-coal/80" aria-live="polite">0{i + 1} / 0{n}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const { c } = useC()
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4"><p className="kick">{c.faq.kicker}</p><h2 className="h2 mt-4">{c.faq.title}</h2></Reveal>
        <div className="border-t border-graphite lg:col-span-7 lg:col-start-6">
          {c.faq.items.map(([q, a], i) => (
            <details key={q} className="border-b border-line" open={i === 0}>
              <summary className="flex min-h-[64px] cursor-pointer items-center justify-between gap-4 py-4 text-[16.5px] font-semibold">
                <span className="flex gap-4"><span className="mono pt-0.5 text-[11px] text-signal-ink">Q{i + 1}</span>{q}</span>
                <span className="faq-i grid h-9 w-9 shrink-0 place-items-center border border-graphite/25 text-lg transition" aria-hidden>+</span>
              </summary>
              <p className="pb-6 pl-9 pr-10 text-[15px] leading-relaxed text-graphite/70">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const { c } = useC()
  const [today, setToday] = useState(-1)
  useEffect(() => {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' })).getDay()
    setToday(d === 0 || d === 6 ? 1 : 0)
  }, [])
  return (
    <section id="contact" className="grid-bg-dark bg-coal py-20 text-concrete sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <p className="kick !text-concrete/60">{c.contact.kicker}</p>
          <h2 className="xp mt-4 leading-[0.92]" style={{ fontSize: 'clamp(2.3rem, 6.5vw, 4.5rem)' }}>{c.contact.title}</h2>
          <p className="mt-6 max-w-md text-[15.5px] leading-relaxed text-concrete/70">{c.contact.lead}</p>
          <a href={wa(c.contact.waText)} target="_blank" rel="noopener" className="mt-8 inline-flex min-h-[56px] items-center gap-3 bg-signal px-7 font-semibold text-coal transition hover:bg-concrete hover:text-graphite"><WaIcon />{c.contact.wa}</a>
        </Reveal>
        <Reveal className="space-y-px lg:col-span-5 lg:col-start-8">
          <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`} className="flex min-h-[72px] items-center justify-between gap-4 bg-white/5 px-5 py-4 transition hover:bg-white/10">
            <span><span className="mono block text-[10.5px] text-concrete/70">{c.contact.call}</span><span className="mt-1 block text-lg font-semibold">{PHONE}</span></span><span className="text-signal" aria-hidden>→</span>
          </a>
          <a href={MAPS} target="_blank" rel="noopener" className="block bg-white/5 px-5 py-4 transition hover:bg-white/10">
            <span className="mono block text-[10.5px] text-concrete/70">{c.contact.visit}</span>
            <span className="mt-1 block text-[15px] leading-relaxed">{c.contact.address}</span>
            <span className="mt-2 block text-sm font-semibold text-signal">{c.contact.directions} ↗</span>
          </a>
          <div className="bg-white/5 px-5 py-4">
            <span className="mono block text-[10.5px] text-concrete/70">{c.contact.hours}</span>
            <dl className="mt-2">
              {c.contact.days.map(([d, h], i) => (
                <div key={d} className={`flex flex-wrap justify-between gap-x-4 py-1.5 text-[15px] ${today === i ? 'font-semibold text-concrete' : 'text-concrete/75'}`}>
                  <dt className="flex items-center gap-2 whitespace-nowrap">{today === i && <span className="h-1.5 w-1.5 bg-signal" />}{d}</dt><dd className="whitespace-nowrap">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  const { c } = useC()
  return (
    <footer className="bg-coal pb-28 pt-4 text-concrete sm:pb-12">
      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 pt-10 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="[&_*]:!text-concrete [&_.bg-graphite]:!bg-concrete [&_.bg-graphite_span]:!text-graphite"><Logo /></span>
          <a href="#top" className="tap mono inline-flex items-center gap-2 self-start border border-white/20 px-4 text-[11px] transition hover:border-signal hover:text-signal sm:self-auto">{c.footer.toTop} <span aria-hidden>↑</span></a>
        </div>
        <div className="mt-8 grid gap-2 text-sm text-concrete/75 sm:grid-cols-3">
          <a href={`tel:${PHONE.replace(/[^+\d]/g, '')}`} className="inline-flex min-h-[36px] items-center hover:text-signal">{PHONE}</a>
          <a href={wa(c.contact.waText)} target="_blank" rel="noopener" className="inline-flex min-h-[36px] items-center gap-2 hover:text-signal"><WaIcon className="h-4 w-4" />WhatsApp</a>
          <a href={MAPS} target="_blank" rel="noopener" className="inline-flex min-h-[36px] items-center hover:text-signal">Sunway Velocity, Kuala Lumpur ↗</a>
        </div>
        <div className="mt-8 flex flex-col gap-3 border border-dashed border-white/20 p-5 text-sm text-concrete/70 sm:flex-row sm:items-center sm:justify-between">
          <p>{c.footer.pitch}</p>
          <a href={PITCH_WA} target="_blank" rel="noopener" className="tap inline-flex shrink-0 items-center gap-2 font-semibold text-signal hover:text-concrete"><WaIcon className="h-4 w-4" />{c.footer.pitchLink}</a>
        </div>
        <p className="mono mt-6 text-[10.5px] text-concrete/70">{c.footer.credit}</p>
      </div>
    </footer>
  )
}

function Fab() {
  const { c } = useC()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 1.1)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <a href={wa(c.contact.waText)} target="_blank" rel="noopener" aria-label={c.contact.wa} aria-hidden={!show} tabIndex={show ? 0 : -1}
      data-fab className={`fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center bg-signal text-coal shadow-[0_10px_30px_rgba(255,91,31,.4)] transition duration-300 sm:hidden ${show ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}>
      <WaIcon className="h-6 w-6" />
    </a>
  )
}

export default function App() {
  const { c } = useC()
  return (
    <>
      <a href="#services" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-signal focus:px-4 focus:py-2 focus:text-coal">{c.a11y.skip}</a>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <Services />
        <Slider />
        <Process />
        <Principles />
        <Work />
        <Reviews />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Fab />
    </>
  )
}
