import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Container, Section, SectionHeading } from '@/components/landing/section'

const faqs = [
  {
    question: 'Do I need to know Go to use vc-mono?',
    answer:
      'Basic familiarity helps, but the API follows simple, readable patterns — handlers, a typed query layer, and config in one place. If you can read JavaScript, you can read this Go.',
  },
  {
    question: 'How does single-origin deployment work?',
    answer:
      'The Vite build outputs directly into the Go embed directory, and the binary serves both /api/v1/* and the SPA fallback. Vercel builds and runs one server, so the frontend and API always deploy together.',
  },
  {
    question: 'Which database should I use?',
    answer:
      'Any Postgres works. The starter is tuned for Neon (simple protocol mode, small serverless pool), and migrations run through a versioned runner with advisory locking — safe even with concurrent deploys.',
  },
  {
    question: 'Can I add authentication and billing?',
    answer:
      'Yes. The Pro blueprint adds session auth, Stripe billing, and an admin dashboard on top of the same foundation. The Hobby tier gives you the full base to wire up your own.',
  },
  {
    question: 'Is this really a one-time payment?',
    answer:
      'Yes. Pro and Team are one-time purchases with lifetime updates to the starter. You host everything yourself, so there are no per-seat fees or usage meters from us.',
  },
  {
    question: 'What if it doesn’t save me time?',
    answer:
      'Every paid tier comes with a 30-day money-back guarantee. Email us and we’ll refund you — no questions, no forms.',
  },
]

export function Faq() {
  return (
    <Section id="faq" className="pt-0">
      <Container>
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Questions,{' '}
                <span className="text-gradient">answered.</span>
              </>
            }
            description="Everything builders usually ask before cloning the repo."
          />
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  )
}
