import { useState, useCallback } from 'react';
import { Hero } from './components/Hero';
import { AboutPreview } from './components/AboutPreview';
import { ServicesPreview } from './components/ServicesPreview';
import { AIShowcase } from './components/AIShowcase';
import { WhyAnthix } from './components/WhyAnthix';
import { Process } from './components/Process';
import { ProjectConcepts } from './components/ProjectConcepts';
import { ContactCTA } from './components/ContactCTA';
import { ServiceType } from '../../types';

export const Home = () => {
  const [selectedService, setSelectedService] = useState<ServiceType>('Digital Solutions');

  const scrollToContact = useCallback((service?: ServiceType) => {
    if (service) {
      setSelectedService(service);
    }
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToServices = useCallback(() => {
    const servicesElement = document.getElementById('services');
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="flex flex-col">
      {/* 1. Hero */}
      <Hero
        onExploreClick={scrollToServices}
        onContactClick={() => scrollToContact()}
      />

      {/* 2. The ANTHIX Approach: IDEA -> TECHNOLOGY -> IMPACT */}
      <AboutPreview />

      {/* 3. Three Distinct Service Offerings */}
      <ServicesPreview
        onSelectService={(service) => scrollToContact(service)}
      />

      {/* 4. Interactive Technology Philosophy & Topology */}
      <AIShowcase />

      {/* 5. Four Foundational Principles */}
      <WhyAnthix />

      {/* 6. Four-Stage Process Timeline */}
      <Process />

      {/* 7. Ideas in Practice: Architectural Concepts */}
      <ProjectConcepts
        onSelectService={(service) => scrollToContact(service)}
      />

      {/* 8. Contact Form & Final CTA Closing */}
      <ContactCTA
        selectedService={selectedService}
        onServiceChange={setSelectedService}
        onContactClick={() => scrollToContact()}
      />
    </div>
  );
};
