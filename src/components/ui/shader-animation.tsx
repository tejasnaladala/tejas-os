"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js fragment-shader background. Single full-screen quad, GLSL-driven
 * field of warm orange/cream gradients. Pause-on-hidden via
 * document.visibilitychange so it does not burn battery in background tabs.
 *
 * Adapted from the user-supplied ShaderAnimation reference. Cleaned of any
 * markdown link artifacts (e.g. "new THREE.Camera()").
 */
export default function ShaderAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const camera = new THREE.Camera();
    camera.position.z = 1;

    const scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;

        // Warm Anthropic-orange / cream cream-paper field.
        // Slowly drifting noise; not too saturated.
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy / resolution.xy);
          uv.x *= resolution.x / resolution.y;
          float t = time * 0.06;

          float n = noise(uv * 2.5 + vec2(t, t * 0.6));
          n = 0.55 + 0.45 * n;

          // Cream paper base
          vec3 base = vec3(0.961, 0.957, 0.937);
          // Anthropic orange accent (CC785C)
          vec3 accent = vec3(0.800, 0.471, 0.361);

          float warmth = smoothstep(0.45, 0.95, n);
          vec3 col = mix(base, accent, warmth * 0.18);

          // Subtle vignette toward bottom-right
          float v = smoothstep(0.0, 1.6, length(uv - vec2(0.6, 0.4)));
          col *= mix(1.0, 0.92, v);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.appendChild(renderer.domElement);

    function onWindowResize() {
      if (!container) return;
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      uniforms.resolution.value.x = renderer.domElement.width;
      uniforms.resolution.value.y = renderer.domElement.height;
    }
    onWindowResize();
    window.addEventListener("resize", onWindowResize);

    let raf = 0;
    let running = true;
    function animate() {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      uniforms.time.value += 0.05;
      renderer.render(scene, camera);
    }

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        running = true;
        animate();
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    animate();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
