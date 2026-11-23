import {
  ServicesHero,
  ServiceOverview,
  DigitalSolutions,
  AIAndAutomation,
  TechnicalTraining,
  ServicesProcess,
  ServicesFAQ,
  ServicesCTA,
} from './components';

export const Services = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Services Hero with 3D Connected Systems Visual */}
      <ServicesHero />

      {/* 2. Services Overview: Three Ways We Create Impact */}
      <ServiceOverview />

      {/* 3. Pillar 01: Digital Solutions Detailed Breakdown */}
      <DigitalSolutions />

      {/* 4. Pillar 02: AI & Automation Interactive Pipeline */}
      <AIAndAutomation />

      {/* 5. Pillar 03: Technical Training & Code Sandbox */}
      <TechnicalTraining />

      {/* 6 & 7. Our Approach Timeline (How We Work) & Why ANTHIX */}
      <ServicesProcess />

      {/* 8. Frequently Asked Questions Accordion */}
      <ServicesFAQ />

      {/* 9. Final Closing Call to Action */}
      <ServicesCTA />
    </div>
  );
};

export default Services;
