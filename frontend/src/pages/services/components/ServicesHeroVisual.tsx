import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from '../../../hooks/useReducedMotion';
import { Globe, Cpu, Cog, GraduationCap } from 'lucide-react';

interface ServicesHeroVisualProps {
  className?: string;
}

export const ServicesHeroVisual = ({ className = '' }: ServicesHeroVisualProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL availability check
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 2. Central Core: Glowing Violet-Blue Sphere
    const coreGeo = new THREE.SphereGeometry(1.15, 36, 36);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x635bff,
      emissive: 0x5145e5,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.5,
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // Subtle outer wireframe ring around core
    const wireGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8b7cff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // 3. Orbiting Rings (representing connected systems)
    const ringMaterials = [
      new THREE.LineBasicMaterial({ color: 0x635bff, transparent: true, opacity: 0.3 }),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.3 }),
      new THREE.LineBasicMaterial({ color: 0x5145e5, transparent: true, opacity: 0.2 }),
    ];

    const rings: THREE.Line[] = [];
    const ringRadii = [2.2, 2.7, 3.2];
    ringRadii.forEach((radius, i) => {
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let j = 0; j <= segments; j++) {
        const theta = (j / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
      }
      ringGeo.setFromPoints(points);
      const ring = new THREE.Line(ringGeo, ringMaterials[i % ringMaterials.length]);
      ring.rotation.x = 0.5 + i * 0.4;
      ring.rotation.y = 0.3 * i;
      mainGroup.add(ring);
      rings.push(ring);
    });

    // 4. Orbiting Satellites (Digital, AI, Automation, Learning)
    const satellites = [
      { radius: 2.2, speed: 0.8, angle: 0, color: 0x38bdf8, size: 0.28 },
      { radius: 2.7, speed: -0.6, angle: 1.5, color: 0x635bff, size: 0.32 },
      { radius: 3.2, speed: 0.5, angle: 3.2, color: 0x5145e5, size: 0.26 },
      { radius: 2.5, speed: -0.7, angle: 4.8, color: 0x8b7cff, size: 0.24 },
    ];

    const satelliteMeshes: { mesh: THREE.Mesh; line: THREE.Line; config: (typeof satellites)[0] }[] = [];

    satellites.forEach((sat) => {
      const satGeo = new THREE.SphereGeometry(sat.size, 20, 20);
      const satMat = new THREE.MeshStandardMaterial({
        color: sat.color,
        emissive: sat.color,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.2,
      });
      const satMesh = new THREE.Mesh(satGeo, satMat);
      mainGroup.add(satMesh);

      // Connecting line from satellite to core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: sat.color,
        transparent: true,
        opacity: 0.35,
      });
      const satLine = new THREE.Line(lineGeo, lineMat);
      mainGroup.add(satLine);

      satelliteMeshes.push({ mesh: satMesh, line: satLine, config: sat });
    });

    // 5. Floating Ambient Data Particles
    const particleCount = 45;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 6;
      particlePositions[i + 2] = (Math.random() - 0.5) * 5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x8b7cff,
      size: 0.045,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x635bff, 2.0);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.6);
    dirLight2.position.set(-5, -4, 4);
    scene.add(dirLight2);

    // 7. Mouse Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotationY = x * 0.45;
      targetRotationX = y * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Rotate core
        coreMesh.rotation.y = elapsedTime * 0.3;
        coreMesh.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15;
        wireMesh.rotation.y = -elapsedTime * 0.25;
        wireMesh.rotation.z = elapsedTime * 0.15;

        // Smooth mouse parallax
        mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

        // Animate rings
        rings.forEach((ring, i) => {
          ring.rotation.z = elapsedTime * (0.1 + i * 0.05);
        });

        // Animate satellites and dynamic connecting lines
        satelliteMeshes.forEach((item, index) => {
          const { mesh, line, config } = item;
          const currentAngle = config.angle + elapsedTime * config.speed * 0.5;
          const inclination = index * 0.4;
          const x = Math.cos(currentAngle) * config.radius;
          const y = Math.sin(currentAngle * 1.2) * 0.7 * Math.sin(inclination + 0.5);
          const z = Math.sin(currentAngle) * config.radius;

          mesh.position.set(x, y, z);

          // Update connecting line vertices
          const positions = line.geometry.attributes.position.array as Float32Array;
          positions[0] = 0;
          positions[1] = 0;
          positions[2] = 0;
          positions[3] = x;
          positions[4] = y;
          positions[5] = z;
          line.geometry.attributes.position.needsUpdate = true;
        });

        // Slow particle drift
        particles.rotation.y = elapsedTime * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [prefersReducedMotion]);

  return (
    <div className={`relative w-full aspect-square max-w-[540px] mx-auto select-none ${className}`}>
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Fallback if WebGL is disabled */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-background-lavender/30 rounded-3xl border border-border">
          <div className="relative w-64 h-64 rounded-full bg-gradient-to-tr from-primary to-electric flex items-center justify-center shadow-soft-lg animate-pulse">
            <div className="w-48 h-48 rounded-full bg-white flex flex-col items-center justify-center text-center p-4">
              <Globe className="w-8 h-8 text-primary mb-2" />
              <span className="font-heading font-bold text-sm text-text-main">Connected Systems</span>
              <span className="text-xs text-text-secondary">Digital · AI · Training</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating System Feature Badges */}
      <div
        className="absolute top-4 left-0 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft-sm text-xs font-semibold text-text-main animate-bounce"
        style={{ animationDuration: '4s' }}
      >
        <div className="w-2 h-2 rounded-full bg-sky animate-ping" />
        <Globe className="w-3.5 h-3.5 text-primary" />
        <span>Digital Systems</span>
      </div>

      <div
        className="absolute bottom-12 left-2 sm:left-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft-sm text-xs font-semibold text-text-main animate-bounce"
        style={{ animationDuration: '5s', animationDelay: '1s' }}
      >
        <div className="w-2 h-2 rounded-full bg-primary" />
        <Cpu className="w-3.5 h-3.5 text-primary" />
        <span>AI Integration</span>
      </div>

      <div
        className="absolute top-16 right-0 sm:right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft-sm text-xs font-semibold text-text-main animate-bounce"
        style={{ animationDuration: '4.5s', animationDelay: '0.5s' }}
      >
        <div className="w-2 h-2 rounded-full bg-primary-deep" />
        <Cog className="w-3.5 h-3.5 text-primary-deep" />
        <span>Automation Flow</span>
      </div>

      <div
        className="absolute bottom-6 right-2 sm:right-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-border shadow-soft-sm text-xs font-semibold text-text-main animate-bounce"
        style={{ animationDuration: '5.5s', animationDelay: '1.5s' }}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
        <span>Practical Learning</span>
      </div>
    </div>
  );
};
