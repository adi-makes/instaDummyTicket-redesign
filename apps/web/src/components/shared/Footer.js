'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {BadgeCheck, Copyright, CreditCard, LockKeyhole, Mail, ShieldCheck} from 'lucide-react'
import {localizedPath} from '@/i18n/routing'

export default function Footer({locale, messages}) {
  const pathname = usePathname()
  const bookPath = localizedPath(locale, '/book')
  const isBookRoute = pathname === bookPath || pathname.startsWith(`${bookPath}/`)

  if (isBookRoute) return null

  const trustItems = [
    {label: messages.footer.sslSecured, icon: ShieldCheck},
    {label: messages.footer.securePayment, icon: CreditCard},
    {label: messages.footer.privacyProtected, icon: LockKeyhole},
    {label: messages.footer.legitimate, icon: BadgeCheck},
  ]

  return (
    <footer className="site-footer">
      <div className="container-max site-footer__inner">
        <div className="site-footer__brand">
          <h2>{messages.footer.brand}</h2>
          <p>{messages.footer.disclaimer}</p>
        </div>

        <div className="site-footer__columns">
          <nav className="site-footer__column" aria-label={messages.footer.quickLinks}>
            <h3>{messages.footer.quickLinks}</h3>
            <Link href={localizedPath(locale, '/faq')}>{messages.footer.faq}</Link>
            <Link href={localizedPath(locale, '/blog')}>{messages.footer.blogs}</Link>
            <Link href={localizedPath(locale, '/support')}>{messages.footer.support}</Link>
          </nav>

          <nav className="site-footer__column site-footer__column--legal" aria-label={messages.footer.legal}>
            <h3>{messages.footer.legal}</h3>
            <Link href={localizedPath(locale, '/privacy')}>{messages.footer.privacyPolicy}</Link>
            <Link href={localizedPath(locale, '/terms')}>{messages.footer.termsOfService}</Link>
            <Link href={localizedPath(locale, '/refund')}>{messages.footer.refundPolicy}</Link>
          </nav>
        </div>

        <div className="site-footer__trust" aria-label={messages.footer.trustBadges}>
          {trustItems.map(({label, icon: Icon}) => (
            <span key={label}>
              <Icon aria-hidden="true" size={18} strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>

        <div className="site-footer__socials" aria-label={messages.footer.socialLinks}>
          <a href="https://www.instagram.com/" aria-label={messages.footer.instagram}>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2}}
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" />
            </svg>
          </a>
          <a href="https://www.facebook.com/" aria-label={messages.footer.facebook}>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{width: 22, height: 22, fill: 'currentColor', stroke: 'none'}}
            >
              <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" />
            </svg>
          </a>
          <a href="mailto:support@instadummyticket.com" aria-label={messages.footer.gmail}>
            <Mail aria-hidden="true" size={22} strokeWidth={2} />
          </a>
        </div>

        <div className="site-footer__bottom">
          <Copyright aria-hidden="true" size={16} strokeWidth={2} />
          <span>{messages.footer.copyright}</span>
          <span aria-hidden="true">•</span>
          <span>{messages.footer.rights}</span>
        </div>
      </div>
    </footer>
  )
}
