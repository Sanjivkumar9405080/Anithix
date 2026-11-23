import {
  ApproachHero,
  ProcessOverview,
  DiscoverSection,
  StrategySection,
  BuildSection,
  EvolveSection,
  CollaborationSection,
  ApproachCTA,
} from './components';

export const Approach = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Approach Hero with 3D Progressive Transformation Visual */}
      <ApproachHero />

      {/* 2. Process Overview: A Clear Path From Idea to Impact */}
      <ProcessOverview />

      {/* 3. Step 01: Discover - Understand Before You Build */}
      <DiscoverSection />

      {/* 4. Step 02: Plan - Turn Understanding Into Direction */}
      <StrategySection />

      {/* 5. Step 03: Build - Build With Purpose. Refine With Care */}
      <BuildSection />

      {/* 6. Step 04: Evolve - Good Solutions Keep Getting Better */}
      <EvolveSection />

      {/* 7. Collaboration: Better Solutions Start With Collaboration */}
      <CollaborationSection />

      {/* 8. Across Different Needs & Final Call to Action */}
      <ApproachCTA />
    </div>
  );
};

export default Approach;
