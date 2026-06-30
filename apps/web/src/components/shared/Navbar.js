'use client'

import Link from 'next/link'
import {useEffect, useMemo, useState} from 'react'
import {usePathname} from 'next/navigation'
import {Mail} from 'lucide-react'
import {localizedPath} from '@/i18n/routing'

function isActivePath(pathname, href) {
  if (href.endsWith('/en')) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navbar({locale, messages}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = useMemo(
    () => [
      {label: messages.nav.home, href: localizedPath(locale, '/')},
      {label: messages.nav.blogs, href: localizedPath(locale, '/blog')},
      {label: messages.nav.faq, href: localizedPath(locale, '/faq')},
    ],
    [locale, messages],
  )

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)
    return () => document.body.classList.remove('menu-open')
  }, [isOpen])

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(false), 0)
    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <header className="site-header">
      <nav className="mobile-navbar" aria-label={messages.nav.mainLabel}>
        <Link className="mobile-navbar__brand" href={localizedPath(locale, '/')} onClick={() => setIsOpen(false)}>
          InstaDummyTicket
        </Link>

        <div className="desktop-navbar__links" aria-label={messages.nav.mainLabel}>
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href)
            return (
              <Link
                key={item.href}
                className="desktop-navbar__link"
                data-active={active}
                href={item.href}
              >
                {item.label}
              </Link>
            )
          })}
          <Link className="desktop-navbar__support" href={localizedPath(locale, '/support')}>
            Support
          </Link>
        </div>

        <button
          className="mobile-navbar__toggle"
          type="button"
          aria-label={isOpen ? messages.nav.closeMenu : messages.nav.openMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((value) => !value)}
        >
          <span className="mobile-navbar__toggle-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </nav>

      <div className="mobile-menu" data-open={isOpen} id="mobile-menu">
        <div className="mobile-menu__inner">
          <div className="mobile-menu__primary">
            <ul className="mobile-menu__links" aria-label={messages.nav.mainLabel}>
              {navItems.map((item) => {
                const active = isActivePath(pathname, item.href)
                return (
                  <li key={item.href}>
                    <Link className="mobile-menu__link" data-active={active} href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <Link className="mobile-menu__support" href={localizedPath(locale, '/support')}>
              {messages.nav.contactSupport}
            </Link>
          </div>

          <footer className="mobile-menu__footer">
            <div className="mobile-menu__policy-links">
              <Link href={localizedPath(locale, '/privacy')}>{messages.footer.privacyPolicy}</Link>
              <Link href={localizedPath(locale, '/terms')}>{messages.footer.termsOfService}</Link>
              <Link href={localizedPath(locale, '/refund')}>{messages.footer.refundPolicy}</Link>
            </div>

            <div className="mobile-menu__socials" aria-label="Social links">
              <a href="https://www.instagram.com/" aria-label={messages.footer.instagram}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </a>
              <a href="https://www.facebook.com/" aria-label={messages.footer.facebook}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" />
                </svg>
              </a>
              <a href="mailto:support@instadummyticket.com" aria-label={messages.footer.gmail}>
                <Mail aria-hidden="true" size={21} strokeWidth={2} />
              </a>
            </div>

            <div className="mobile-menu__copyright">{messages.footer.copyright}</div>
          </footer>
        </div>
      </div>
    </header>
  )
}
