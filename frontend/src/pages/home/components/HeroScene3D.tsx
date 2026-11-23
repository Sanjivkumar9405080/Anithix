import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface HeroScene3DProps {
  className?: string;
}

export const HeroScene3D = ({ className = '' }: HeroScene3DProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect WebGL support
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 3. Main Composition Group
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // 4. Central Sculptural Core
    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x635BFF,
      emissive: 0x38BDF8,
      emissiveIntensity: 0.16,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.72,
      ior: 1.45,
      transparent: true,
      opacity: 0.94,
      reflectivity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    heroGroup.add(coreMesh);

    // Inner pulsating intelligence node
    const innerCoreGeo = new THREE.DodecahedronGeometry(0.75, 0);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0x5145E5,
      emissive: 0x635BFF,
      emissiveIntensity: 0.5,
      roughness: 0.25,
      metalness: 0.3,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    heroGroup.add(innerCore);

    // Outer architectural wireframe cage
    const cageGeo = new THREE.IcosahedronGeometry(1.68, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x8B7CFF,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    heroGroup.add(cageMesh);

    // 5. Orbital Energy Rings
    const orbitalGroup = new THREE.Group();
    heroGroup.add(orbitalGroup);

    const ringDefinitions = [
      { radius: 2.25, tube: 0.016, color: 0x635BFF, rotX: Math.PI / 3.2, rotY: Math.PI / 6.5, speed: 0.25 },
      { radius: 2.75, tube: 0.012, color: 0x38BDF8, rotX: -Math.PI / 4.1, rotY: Math.PI / 3.2, speed: -0.20 },
      { radius: 3.30, tube: 0.010, color: 0x8B7CFF, rotX: Math.PI / 2.1, rotY: -Math.PI / 4.8, speed: 0.18 },
    ];

    const rings: THREE.Mesh[] = [];
    ringDefinitions.forEach((def) => {
      const geo = new THREE.TorusGeometry(def.radius, def.tube, 16, 120);
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.color,
        emissiveIntensity: 0.35,
        roughness: 0.2,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = def.rotX;
      ring.rotation.y = def.rotY;
      orbitalGroup.add(ring);
      rings.push(ring);
    });

    // 6. Satellite Nodes & Connectors
    const nodeGeo = new THREE.SphereGeometry(0.07, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38BDF8,
      emissive: 0x38BDF8,
      emissiveIntensity: 0.7,
      roughness: 0.2,
    });

    const satellites: { mesh: THREE.Mesh; angle: number; speed: number; radius: number; ringIndex: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const satMesh = new THREE.Mesh(nodeGeo, nodeMat);
      const ringIdx = i % ringDefinitions.length;
      orbitalGroup.add(satMesh);
      satellites.push({
        mesh: satMesh,
        angle: (i * Math.PI * 2) / 5,
        speed: (0.4 + (i % 2) * 0.2) * (i % 2 === 0 ? 1 : -1),
        radius: ringDefinitions[ringIdx].radius,
        ringIndex: ringIdx,
      });
    }

    // 7. Translucent Floating Facets / Small Octahedra
    const facetGroup = new THREE.Group();
    heroGroup.add(facetGroup);
    const facetGeo = new THREE.OctahedronGeometry(0.18, 0);
    const facetMat = new THREE.MeshPhysicalMaterial({
      color: 0x8B7CFF,
      transmission: 0.6,
      opacity: 0.6,
      transparent: true,
      roughness: 0.2,
    });

    const floatingFacets: { mesh: THREE.Mesh; initY: number; speed: number; rotSpeed: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const facet = new THREE.Mesh(facetGeo, facetMat);
      const theta = (i * Math.PI * 2) / 6;
      const dist = 2.4 + Math.random() * 0.8;
      const initY = (Math.random() - 0.5) * 1.8;
      facet.position.set(Math.cos(theta) * dist, initY, Math.sin(theta) * dist * 0.5);
      facetGroup.add(facet);
      floatingFacets.push({
        mesh: facet,
        initY,
        speed: 0.8 + Math.random() * 0.6,
        rotSpeed: (Math.random() - 0.5) * 1.5,
      });
    }

    // 8. Particle Atmosphere
    const particleCount = 48;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x635BFF,
      size: 0.065,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    heroGroup.add(particles);

    // 9. Lighting
    const ambient = new THREE.AmbientLight(0xFFFFFF, 1.3);
    scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(0x38BDF8, 2.2);
    dirLight1.position.set(6, 6, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x635BFF, 2.0);
    dirLight2.position.set(-6, -4, 4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x8B7CFF, 1.4, 12);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Initial appearance
    heroGroup.scale.set(0.85, 0.85, 0.85);

    // Mouse pointer interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Scroll progress handler
    let scrollProgress = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      scrollProgress = Math.min(scrollY / vh, 1.4);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        heroGroup.rotation.y += (targetRotY + elapsed * 0.15 + scrollProgress * 0.4 - heroGroup.rotation.y) * 0.04;
        heroGroup.rotation.x += (targetRotX + scrollProgress * 0.25 - heroGroup.rotation.x) * 0.04;

        coreMesh.rotation.y = elapsed * 0.22;
        coreMesh.rotation.z = Math.sin(elapsed * 0.3) * 0.1;
        innerCore.rotation.y = -elapsed * 0.35;
        innerCore.rotation.x = elapsed * 0.2;
        cageMesh.rotation.y = elapsed * 0.14;

        rings.forEach((ring, idx) => {
          ring.rotation.z = elapsed * ringDefinitions[idx].speed + scrollProgress * 0.3;
        });

        satellites.forEach((sat) => {
          sat.angle += sat.speed * 0.015;
          const ring = rings[sat.ringIndex];
          const x = Math.cos(sat.angle) * sat.radius;
          const y = Math.sin(sat.angle) * sat.radius;
          sat.mesh.position.set(x, y, 0);
          sat.mesh.rotation.copy(ring.rotation);
        });

        floatingFacets.forEach((f) => {
          f.mesh.position.y = f.initY + Math.sin(elapsed * f.speed) * 0.15;
          f.mesh.rotation.y += f.rotSpeed * 0.01;
        });

        particles.rotation.y = elapsed * 0.05;

        heroGroup.position.y = -scrollProgress * 0.7;
        heroGroup.position.z = -scrollProgress * 0.5;
        const currentScale = 1 - scrollProgress * 0.15;
        heroGroup.scale.set(currentScale, currentScale, currentScale);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animId);

      coreGeo.dispose();
      coreMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      facetGeo.dispose();
      facetMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      rings.forEach((r) => {
        r.geometry.dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className={`relative w-full h-full min-h-[380px] lg:min-h-[520px] flex items-center justify-center ${className}`}>
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-primary/20 bg-gradient-to-tr from-background-lavender via-white to-background-softBlue flex items-center justify-center shadow-soft-lg">
          <div className="w-40 h-40 rounded-full border border-sky-400/30 animate-spin" style={{ animationDuration: '20s' }} />
          <div className="absolute w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-sky-400 transform rotate-45 shadow-glow-primary flex items-center justify-center">
            <span className="text-white font-black text-3xl font-heading -rotate-45">A</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mountRef} 
      className={`relative w-full h-full min-h-[380px] lg:min-h-[540px] flex items-center justify-center pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
