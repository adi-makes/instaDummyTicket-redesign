import LegalPage from '@/components/shared/LegalPage'

export const metadata = {
  title: 'Refund Policy | InstaDummyTicket',
  description: 'Refund policy for InstaDummyTicket reservation orders.',
}

export default function RefundPage() {
  return (
    <LegalPage
      eyebrow="Refunds"
      title="Refund Policy"
      intro="Our refund policy is designed around fast digital delivery and correction-first support."
      updatedAt="June 30, 2026"
      sections={[
        {
          title: 'Digital delivery',
          body: [
            'Because reservations are prepared and delivered digitally, completed orders are generally not refundable once the reservation has been issued.',
            'If delivery has not started, contact support immediately and we will review whether cancellation is still possible.',
          ],
        },
        {
          title: 'Corrections',
          body: [
            'If we make an error in the reservation details, we will correct it or issue a replacement where possible.',
            'Errors caused by incorrect information submitted by the customer may require a new order.',
          ],
        },
        {
          title: 'Failed delivery',
          body: ['If we are unable to provide the ordered reservation, we will offer a replacement option or refund the affected order.'],
        },
        {
          title: 'How to request help',
          body: ['Email support@instadummyticket.com with your order details and a clear description of the issue.'],
        },
      ]}
    />
  )
}
