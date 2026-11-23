import { AboutHero } from './components/AboutHero';
import { OurStory } from './components/OurStory';
import { OurMission } from './components/OurMission';
import { OurVision } from './components/OurVision';
import { OurValues } from './components/OurValues';
import { OurApproach } from './components/OurApproach';
import { OurFocus } from './components/OurFocus';
import { AboutCTA } from './components/AboutCTA';

export const About = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. About Hero Section with 3D Visual */}
      <AboutHero />

      {/* 2. Who We Are: Technology With a Purpose */}
      <OurStory />

      {/* 3. Our Mission: Soft Lavender Background */}
      <OurMission />

      {/* 4. Our Vision: Forward Movement & Growth */}
      <OurVision />

      {/* 5. Our Core Values: What Drives Us */}
      <OurValues />

      {/* 6. Our Approach: From Ideas to Impact (4 Steps) */}
      <OurApproach />

      {/* 7. Our Focus: Where Ideas Meet Technology */}
      <OurFocus />

      {/* 8. Closing Call to Action */}
      <AboutCTA />
    </div>
  );
};

export default About;
