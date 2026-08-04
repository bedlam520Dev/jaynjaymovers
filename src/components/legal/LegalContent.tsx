'use client';

import type { ReactNode } from 'react';

type Mode = 'page' | 'overlay';

function Section({ children }: { children: ReactNode }) {
  return <section className='space-y-3'>{children}</section>;
}

function LegalArticle({ mode, children }: { mode: Mode; children: ReactNode }) {
  return (
    <article
      className={
        mode === 'page'
          ? 'panel-retro mx-auto max-w-4xl space-y-6 px-6 py-16 text-sm leading-relaxed'
          : 'space-y-6 px-4 py-6 text-sm leading-relaxed'
      }
    >
      {children}
    </article>
  );
}

function LegalHeader({
  mode,
  title,
  lastUpdated,
}: {
  mode: Mode;
  title: string;
  lastUpdated: string;
}) {
  return (
    <header className={`text-center ${mode === 'page' ? 'mb-8' : 'mb-4'}`}>
      <h1 className='font-heading text-3xl font-bold shadow-glow'>{title}</h1>
      <p className='text-muted-foreground mt-2'>{lastUpdated}</p>
    </header>
  );
}

const sectionStyles = 'text-muted-foreground';

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h2 className='font-display text-xl font-semibold'>{children}</h2>
);

const SectionText = ({ children }: { children: ReactNode }) => (
  <p className={`mt-2 ${sectionStyles}`}>{children}</p>
);

{/* const SectionList = ({ items }: { items: string[] }) => (
  <ul className={`mt-2 list-disc space-y-1 pl-6 ${sectionStyles}`}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
); */}

type LegalContentProps = { mode?: Mode };

export function TermsContent({ mode = 'page' }: LegalContentProps) {
  return (
    <LegalArticle mode={mode}>
      <LegalHeader
        mode={mode}
        title='Terms of Service'
        lastUpdated='Last updated: July 2026'
      />
      <Section>
        <SectionTitle>1. Overview</SectionTitle>
        <SectionText>
          These Terms of Service govern your use of the Jay N Jay Movers website and
          services. By using our services, you agree to these terms.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>2. Services</SectionTitle>
        <SectionText>
          Jay N Jay Movers provides residential and commercial moving services, packing
          services, storage solutions, and related services. All services are subject to
          availability and scheduling.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>3. Estimates and Pricing</SectionTitle>
        <SectionText>
          Estimates provided through our website are preliminary and non-binding. Final
          pricing is confirmed after an in-home assessment or upon completion of the
          move. We reserve the right to adjust pricing based on actual scope, weight,
          distance, and any additional services requested.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>4. Payment</SectionTitle>
        <SectionText>
          Payment is due upon completion of services unless otherwise agreed. We accept
          credit cards, debit cards, and other payment methods as indicated at the time
          of booking. Late payments may be subject to interest charges.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>5. Cancellation Policy</SectionTitle>
        <SectionText>
          Cancellations made more than 72 hours before the scheduled move time will
          receive a full refund. Cancellations within 72 hours may be subject to a
          cancellation fee. No-shows may be charged the full amount.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>6. Liability</SectionTitle>
        <SectionText>
          Jay N Jay Movers is fully licensed, bonded, and insured. Our liability for
          damaged or lost items is limited to the valuation declared at the time of
          booking, up to a maximum of $0.60 per pound per article unless additional
          insurance is purchased.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>7. Prohibited Items</SectionTitle>
        <SectionText>
          We cannot transport hazardous materials, perishable goods, plants, firearms,
          or illegal items. Please inform us of any special items that require
          additional handling.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>8. Changes to Terms</SectionTitle>
        <SectionText>
          We may update these terms from time to time. Continued use of our services
          after changes constitutes acceptance of the updated terms.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>9. Contact</SectionTitle>
        <SectionText>
          If you have questions about these terms, please contact us at{' '}
          <a
            href='mailto:info@jaynjaymovers.com'
            className='text-primary underline'
          >
            info@jaynjaymovers.com
          </a>{' '}
          or call (971) 304-8913.
        </SectionText>
      </Section>
    </LegalArticle>
  );
}

export function PrivacyContent({ mode = 'page' }: LegalContentProps) {
  return (
    <LegalArticle mode={mode}>
      <LegalHeader
        mode={mode}
        title='Privacy Policy'
        lastUpdated='Last updated: July 2026'
      />
      <Section>
        <SectionTitle>1. Information We Collect</SectionTitle>
        <SectionText>
          We collect information you provide directly to us, such as your name, phone
          number, email address, and move details when you request a quote, schedule a
          move, or create an account.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>2. How We Use Your Information</SectionTitle>
        <SectionText>
          We use your information to provide moving services, communicate with you about
          your bookings, send estimates and invoices, and improve our services. We do
          not sell your personal information to third parties.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>3. Data Security</SectionTitle>
        <SectionText>
          We implement appropriate technical and organizational measures to protect your
          personal data. However, no method of transmission over the Internet is 100%
          secure, and we cannot guarantee absolute security.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>4. Data Retention</SectionTitle>
        <SectionText>
          We retain your information for as long as necessary to provide services and
          comply with legal obligations. You may request deletion of your account and
          associated data by contacting us.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>5. Third-Party Services</SectionTitle>
        <SectionText>
          We use third-party services for payment processing, authentication, and
          analytics. These services have their own privacy policies, and we encourage
          you to review them.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>6. Your Rights</SectionTitle>
        <SectionText>
          You have the right to access, correct, or delete your personal information. To
          make a request, please contact us at{' '}
          <a
            href='mailto:info@jaynjaymovers.com'
            className='text-primary underline'
          >
            info@jaynjaymovers.com
          </a>
          .
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>7. Changes to This Policy</SectionTitle>
        <SectionText>
          We may update this Privacy Policy from time to time. The updated version will
          be indicated by an updated Last updated date.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>8. Contact Us</SectionTitle>
        <SectionText>
          For privacy-related questions, contact us at{' '}
          <a
            href='mailto:info@jaynjaymovers.com'
            className='text-primary underline'
          >
            info@jaynjaymovers.com
          </a>{' '}
          or call (971) 304-8913.
        </SectionText>
      </Section>
    </LegalArticle>
  );
}

export function DataPolicyContent({ mode = 'page' }: LegalContentProps) {
  return (
    <LegalArticle mode={mode}>
      <LegalHeader
        mode={mode}
        title='Data Handling Policy'
        lastUpdated='Last updated: July 2026'
      />
      <Section>
        <SectionTitle>1. Principles</SectionTitle>
        <SectionText>
          Jay N Jay Movers is committed to protecting your personal data. We collect
          only the information necessary to provide our moving services and maintain the
          highest standards of data security and privacy.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>2. Data We Collect</SectionTitle>
        <SectionText>
          We collect information you provide when requesting quotes, scheduling moves,
          or creating accounts. This includes your name, phone number, email address,
          move addresses, and service preferences.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>3. How We Use Data</SectionTitle>
        <SectionText>
          Your data is used to coordinate moves, send confirmations and updates, process
          payments, and improve our services. We do not use your data for marketing
          purposes without your consent.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>4. Data Sharing</SectionTitle>
        <SectionText>
          We do not sell or rent your personal information. We may share data with
          trusted third-party service providers (payment processors, authentication
          services, etc.) who assist in operating our business, under strict
          confidentiality agreements.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>5. Data Security</SectionTitle>
        <SectionText>
          We use industry-standard security measures to protect your data, including
          encryption, secure servers, and regular security audits. Access to your data
          is restricted to authorized personnel only.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>6. Data Retention</SectionTitle>
        <SectionText>
          We retain your data only as long as necessary to provide services and comply
          with legal obligations. You may request deletion of your account and
          associated data at any time by contacting us.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>7. Your Rights</SectionTitle>
        <SectionText>
          You have the right to access, correct, or delete your personal information. To
          exercise these rights, please contact us at{' '}
          <a
            href='mailto:info@jaynjaymovers.com'
            className='text-primary underline'
          >
            info@jaynjaymovers.com
          </a>
          .
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>8. Contact</SectionTitle>
        <SectionText>
          For questions about our data handling practices, contact us at{' '}
          <a
            href='mailto:info@jaynjaymovers.com'
            className='text-primary underline'
          >
            info@jaynjaymovers.com
          </a>{' '}
          or call (971) 304-8913.
        </SectionText>
      </Section>
    </LegalArticle>
  );
}

export function RefundContent({ mode = 'page' }: LegalContentProps) {
  return (
    <LegalArticle mode={mode}>
      <LegalHeader
        mode={mode}
        title='Refund Policy'
        lastUpdated='Last updated: July 2026'
      />
      <Section>
        <SectionTitle>1. Satisfaction Guarantee</SectionTitle>
        <SectionText>
          Jay N Jay Movers is committed to providing high-quality moving services. If
          you are not satisfied with our work, please contact us within 48 hours of
          completion so we can address the issue.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>2. Cancellation Refunds</SectionTitle>
        <SectionText>
          Cancellations made more than 72 hours before the scheduled move will receive a
          full refund of any deposit paid. Cancellations within 72 hours may be subject
          to a cancellation fee of up to 50% of the estimated total.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>3. Damage Claims</SectionTitle>
        <SectionText>
          In the event of damage to your belongings, please report the issue within 72
          hours of delivery. Claims will be evaluated according to the valuation
          declared at the time of booking and our liability limitations outlined in the
          Terms of Service.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>4. Non-Refundable Items</SectionTitle>
        <SectionText>
          Custom crating, specialty handling, and third-party services (such as storage
          or insurance) may be non-refundable once rendered. Any refundable portion of
          the move will be prorated based on services not completed.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>5. Refund Process</SectionTitle>
        <SectionText>
          Approved refunds will be issued to the original payment method within 7-10
          business days. We will notify you once the refund has been processed.
        </SectionText>
      </Section>
      <Section>
        <SectionTitle>6. Contact for Refunds</SectionTitle>
        <SectionText>
          To request a refund or discuss a billing issue, please contact us at{' '}
          <a
            href='mailto:info@jaynjaymovers.com'
            className='text-primary underline'
          >
            info@jaynjaymovers.com
          </a>{' '}
          or call (971) 304-8913.
        </SectionText>
      </Section>
    </LegalArticle>
  );
}
