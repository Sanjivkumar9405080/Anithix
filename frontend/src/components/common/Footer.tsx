import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-background-alt border-t border-border pt-16 pb-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-border">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary via-[#8B7CFF] to-sky-400 flex items-center justify-center shadow-soft-sm group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-black text-base font-heading tracking-wider">A</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-black text-xl tracking-tight text-text-main group-hover:text-primary transition-colors">
                    ANTHIX
                  </span>
                  <span className="text-[9px] tracking-widest uppercase font-bold text-text-secondary -mt-1">
                    Ideas Into Impact
                  </span>
                </div>
              </Link>

              <p className="text-sm text-text-secondary leading-relaxed max-w-sm mb-6 font-sans">
                A technology startup helping businesses and institutions through digital development, AI and automation, and technical training.
              </p>
            </div>

            <div className="text-xs text-text-secondary font-sans">
              Focused on purposeful engineering, clear communication, and measurable outcomes.
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text-main mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-text-secondary font-sans">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-primary transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/approach" className="hover:text-primary transition-colors">
                  Our Approach
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Anchors */}
          <div className="lg:col-span-4">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text-main mb-4">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-text-secondary font-sans">
              <li>
                <Link
                  to="/services"
                  className="text-left hover:text-primary transition-colors block"
                >
                  <div className="font-medium text-text-main hover:text-primary font-heading">Digital Solutions</div>
                  <div className="text-xs text-text-secondary">Modern websites & web applications</div>
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-left hover:text-primary transition-colors block"
                >
                  <div className="font-medium text-text-main hover:text-primary font-heading">AI & Automation</div>
                  <div className="text-xs text-text-secondary">Practical AI integrations & workflows</div>
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-left hover:text-primary transition-colors block"
                >
                  <div className="font-medium text-text-main hover:text-primary font-heading">Technical Training</div>
                  <div className="text-xs text-text-secondary">Skill-building for students & teams</div>
                </Link>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-border">
              <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider">
                Official Channels: Updating soon
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary font-sans">
          <div>
            &copy; {currentYear} ANTHIX. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-text-secondary">Light Theme System</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-white border border-border hover:border-primary text-text-main hover:text-primary transition-colors shadow-soft-xs"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
