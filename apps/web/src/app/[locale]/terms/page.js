import LegalPage from '@/components/shared/LegalPage'

export const metadata = {
  title: 'Terms of Service | InstaDummyTicket',
  description: 'Terms for using InstaDummyTicket flight reservation services.',
}

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of Service"
      intro="These terms explain how our temporary flight reservation service may be used."
      updatedAt="June 30, 2026"
      sections={[
        {
          title: 'Service purpose',
          body: [
            'InstaDummyTicket provides temporary flight reservations for visa applications, proof of onward travel, and travel documentation purposes.',
            'A reservation is not a boarding pass, paid airline ticket, or guarantee of visa approval or entry approval.',
          ],
        },
        {
          title: 'Customer responsibilities',
          body: [
            'You are responsible for entering accurate passenger, route, and date information before submitting an order.',
            'You agree not to use the service for unlawful, deceptive, or abusive purposes.',
          ],
        },
        {
          title: 'Delivery and accuracy',
          body: [
            'We aim to deliver reservations quickly, but delivery time may vary based on airline systems, payment review, or support requirements.',
            'If there is an issue with the reservation details, contact support as soon as possible so we can review it.',
          ],
        },
        {
          title: 'Limitation',
          body: ['We are not responsible for embassy, airline, immigration, or third-party decisions made after you receive your reservation.'],
        },
      ]}
    />
  )
}
