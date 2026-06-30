import LegalPage from '@/components/shared/LegalPage'

export const metadata = {
  title: 'Privacy Policy | InstaDummyTicket',
  description: 'How InstaDummyTicket collects, uses, and protects customer information.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="We keep data collection limited to what is needed to create and deliver your reservation."
      updatedAt="June 30, 2026"
      sections={[
        {
          title: 'Information we collect',
          body: [
            'We collect the details you submit while creating a reservation, including route details, travel dates, passenger name, and email address.',
            'Payment details are handled by our payment processor. We do not store full card numbers on our servers.',
          ],
        },
        {
          title: 'How we use information',
          body: [
            'We use your information to prepare your flight reservation, deliver booking details, provide support, and prevent abuse or fraudulent activity.',
            'We may use aggregated, non-identifying information to improve the website experience and booking flow.',
          ],
        },
        {
          title: 'Data protection',
          body: [
            'We use reasonable technical and organizational safeguards to protect submitted information from unauthorized access.',
            'Access to customer information is limited to people and systems that need it to provide the service.',
          ],
        },
        {
          title: 'Contact',
          body: ['For privacy questions or data requests, contact support@instadummyticket.com.'],
        },
      ]}
    />
  )
}
