import {
  ProjectsHero,
  ProjectShowcase,
  ProjectCategories,
  ProjectCapabilities,
  ProjectsCTA,
} from './components';

export const Projects = () => {
  return (
    <div className="flex flex-col bg-white">
      {/* 1. Projects Hero: "WHAT WE CAN BUILD" — "Ideas Into Impact." */}
      <ProjectsHero />

      {/* 2. Alternating Side-Entry Project Cards Showcase (01 Left, 02 Right, etc.) */}
      <ProjectShowcase />

      {/* 3. More Ways We Can Build (8 Diverse Domains & Applications) */}
      <ProjectCategories />

      {/* 4. Built Around Your Needs (11 Full-Stack Capabilities & Consultation) */}
      <ProjectCapabilities />

      {/* 5. Section Ending CTA: "Have a Different Idea?" */}
      <ProjectsCTA />
    </div>
  );
};

export default Projects;
