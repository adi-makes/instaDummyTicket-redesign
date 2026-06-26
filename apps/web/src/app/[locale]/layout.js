import '../globals.css'
import {Manrope, Red_Hat_Display} from 'next/font/google'
import Footer from '@/components/shared/Footer'
import Navbar from '@/components/shared/Navbar'
import {LOCALES} from '@/i18n/config'
import {isRtlLocale, resolveLocale} from '@/i18n/utils'
import {getMessages} from '@/messages'

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-red-hat',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
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
    <html lang={locale} dir={isRtlLocale(locale) ? 'rtl' : 'ltr'} className={`${redHatDisplay.variable} ${manrope.variable}`}>
      <body>
        <Navbar locale={locale} messages={messages} />
        <main id="main-content">{children}</main>
        <Footer locale={locale} messages={messages} />
      </body>
    </html>
  )
}
