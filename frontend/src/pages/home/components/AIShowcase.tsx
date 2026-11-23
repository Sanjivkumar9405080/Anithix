import { useEffect, useRef, useState } from 'react';
import { Compass, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

export const AIShowcase = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeCount, setNodeCount] = useState<number>(32);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const isMobile = width < 768;
    const count = isMobile ? 20 : 36;
    setNodeCount(count);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseColor: string;
    }

    const nodes: Node[] = [];
    const colors = ['#635BFF', '#8B7CFF', '#38BDF8', '#5145E5'];

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 2,
        baseColor: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const pointer = {
      x: -1000,
      y: -1000,
      radius: isMobile ? 100 : 160,
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const handlePointerLeave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.touches[0].clientX - rect.left;
        pointer.y = e.touches[0].clientY - rect.top;
      }
    };

    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handlePointerLeave);

    const handleResize = () => {
      if (!container || !canvas) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    let animationId: number;

    const render = () => {
      animationId = requestAnimationFrame(render);
      if (!isVisible) return;

      ctx.clearRect(0, 0, width, height);

      if (pointer.x > 0 && pointer.y > 0) {
        const radial = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          pointer.radius * 1.2
        );
        radial.addColorStop(0, 'rgba(99, 91, 255, 0.12)');
        radial.addColorStop(0.5, 'rgba(56, 189, 248, 0.05)');
        radial.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, pointer.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < pointer.radius && dist > 0) {
            const force = (pointer.radius - dist) / pointer.radius;
            node.x += (dx / dist) * force * 3;
            node.y += (dy / dist) * force * 3;
          }
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.baseColor;
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = isMobile ? 85 : 125;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(99, 91, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    render();

    return () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [prefersReducedMotion]);

  return (
    <section id="technology" className="py-24 sm:py-32 px-4 sm:px-8 bg-background-alt relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Technology Philosophy Statement */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-primary text-xs font-bold tracking-wider uppercase mb-5 border border-border shadow-soft-sm self-start">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>OUR PHILOSOPHY</span>
            </div>

            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-main tracking-tight leading-tight mb-6">
              Technology with intention.
            </h2>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal mb-8 font-sans">
              We believe the best solutions are not defined by complexity, but by how effectively they solve real problems.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-border flex items-start gap-3.5 shadow-soft-sm">
                <div className="p-2 rounded-lg bg-background-lavender text-primary shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main font-heading">Pragmatic, not speculative</h4>
                  <p className="text-xs text-text-secondary mt-0.5 font-sans">
                    We implement technologies that bring direct utility rather than chasing fragile industry fads.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-border flex items-start gap-3.5 shadow-soft-sm">
                <div className="p-2 rounded-lg bg-background-softBlue text-sky-600 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main font-heading">Clean and maintainable</h4>
                  <p className="text-xs text-text-secondary mt-0.5 font-sans">
                    Codebases and workflows designed to be transparent, documented, and resilient over time.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-border flex items-start gap-3.5 shadow-soft-sm">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-main font-heading">Human-centric outcomes</h4>
                  <p className="text-xs text-text-secondary mt-0.5 font-sans">
                    Built for the people who use it every day—students, teachers, staff, and customers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Reactive Field */}
          <div className="lg:col-span-7">
            <div
              ref={containerRef}
              className="relative w-full h-[380px] sm:h-[480px] bg-white rounded-3xl border border-border shadow-soft-md overflow-hidden flex flex-col justify-between p-6 cursor-crosshair group"
            >
              <div className="flex items-center justify-between z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-mono font-medium text-text-secondary">
                    Interactive Topology ({nodeCount} active nodes)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-primary bg-background-lavender px-2.5 py-1 rounded-full border border-primary/20 font-sans">
                  Hover or Touch Canvas
                </span>
              </div>

              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
                aria-label="Interactive visual representation of connected technology nodes"
              />

              <div className="z-10 pointer-events-none self-center bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-border shadow-soft-sm text-center max-w-xs">
                <Sparkles className="w-4 h-4 text-primary mx-auto mb-1" />
                <div className="font-heading font-bold text-xs text-text-main">ANTHIX Systems Principle</div>
                <div className="text-[11px] text-text-secondary mt-0.5 font-sans">
                  Connections create intelligence. Simplicity drives reliability.
                </div>
              </div>

              <div className="z-10 pointer-events-none text-right">
                <span className="text-[10px] font-mono text-text-secondary/70">
                  * Visual representation of ANTHIX technology philosophy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
