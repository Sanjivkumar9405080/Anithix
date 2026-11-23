import { FAQHero, ScrollFAQSection, WhyTrustUs, FAQCTA } from './components';

export const FAQ = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Bold & Minimal Hero Header */}
      <FAQHero />

      {/* 2. Full-Screen Pinned Scroll-Driven FAQ Experience */}
      <ScrollFAQSection />

      {/* 3. Why Choose ANTHIX? Trust & Transparency Pillars */}
      <WhyTrustUs />

      {/* 4. Closing Call to Action: Your Next Question Could Start Something Great */}
      <FAQCTA />
    </div>
  );
};

export default FAQ;
