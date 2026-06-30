import {getMessages} from '@/messages'
import {sanityFetch} from '@/sanity/lib/client'
import {faqItemsQuery} from '@/sanity/queries/content'
import {BadgeCheck, CircleHelp, ShieldCheck} from 'lucide-react'

export const metadata = {
  title: 'FAQ | InstaDummyTicket',
  description: 'Answers about dummy tickets, flight reservations, PNRs, delivery, and visa documentation.',
}

export default async function FaqPage({params}) {
  const {locale} = await params
  const messages = getMessages(locale)
  const items = (await sanityFetch({
    query: faqItemsQuery,
    tags: ['faqItem'],
  })) || []

  return (
    <main className="starter-page">
      <section className="cms-page-hero cms-page-hero--split">
        <div className="container-max">
          <div>
            <p className="cms-eyebrow">{messages.faq.eyebrow}</p>
            <h1>{messages.faq.title}</h1>
            <p>Clear answers before you book a verifiable flight reservation.</p>
          </div>
          <div className="cms-hero-note cms-hero-note--stack">
            <span><CircleHelp size={18} aria-hidden="true" /> Booking questions</span>
            <span><ShieldCheck size={18} aria-hidden="true" /> Secure checkout</span>
            <span><BadgeCheck size={18} aria-hidden="true" /> Verifiable PNRs</span>
          </div>
        </div>
      </section>

      <section className="container-max cms-section">
        {items.length > 0 ? (
          <div className="cms-faq-list">
            {items.map((item) => (
              <details key={item._id} className="cms-faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        ) : (
          <div className="cms-empty-state">
            <h2>{messages.faq.empty}</h2>
          </div>
        )}
      </section>
    </main>
  )
}
