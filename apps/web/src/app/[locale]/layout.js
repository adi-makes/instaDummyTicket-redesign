import '../globals.css'
import {Inter} from 'next/font/google'
import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import {LOCALES} from '@/i18n/config'
import {isRtlLocale, resolveLocale} from '@/i18n/utils'
import {getMessages} from '@/messages'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export function generateStaticParams() {
  return LOCALES.map((locale) => ({locale}))
}

export default async function LocaleLayout({children, params}) {
  const {locale: routeLocale} = await params
  const locale = resolveLocale(routeLocale)
  const messages = getMessages(locale)

  return (
    <html lang={locale} dir={isRtlLocale(locale) ? 'rtl' : 'ltr'} className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Navbar locale={locale} messages={messages} />
        <main id="main-content">{children}</main>
        <Footer locale={locale} messages={messages} />
      </body>
    </html>
  )
}
