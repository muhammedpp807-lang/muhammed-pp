"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const smoothstep = (value: number) => value * value * (3 - 2 * value);
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

type Scene = {
  id: string;
  x: number;
  y: number;
  primary: number;
  secondary: number;
  detail: number;
};

type SceneFrame = Scene & { phase: number };
type SceneStop = SceneFrame & { center: number };
type Vec3 = { x: number; y: number; z: number };

const sceneMap: Scene[] = [
  { id: "hero", x: 0.76, y: 0.24, primary: 0.78, secondary: 0.34, detail: 0.58 },
  { id: "about", x: 0.18, y: 0.54, primary: 0.46, secondary: 0.58, detail: 0.46 },
  { id: "skills", x: 0.83, y: 0.42, primary: 0.51, secondary: 0.35, detail: 0.42 },
  { id: "featured", x: 0.16, y: 0.4, primary: 0.68, secondary: 0.48, detail: 0.63 },
  { id: "projects", x: 0.8, y: 0.2, primary: 0.82, secondary: 0.33, detail: 0.78 },
  { id: "timeline", x: 0.2, y: 0.72, primary: 0.46, secondary: 0.6, detail: 0.55 },
  { id: "achievements", x: 0.82, y: 0.48, primary: 0.39, secondary: 0.4, detail: 0.35 },
  { id: "contact", x: 0.5, y: 0.84, primary: 0.31, secondary: 0.29, detail: 0.25 },
];

const initialScene: SceneFrame = { ...sceneMap[0], phase: 0 };

/**
 * Autoplaying multi-plane atmosphere plus a procedural 3D wireframe.
 * A visible-page requestAnimationFrame loop runs slowly at rest and accelerates
 * with scroll velocity. React never rerenders for frame or scroll updates.
 */
export default function ParallaxBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const primaryGlowRef = useRef<HTMLDivElement>(null);
  const secondaryGlowRef = useRef<HTMLDivElement>(null);
  const tertiaryGlowRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<SVGSVGElement>(null);
  const meshCanvasRef = useRef<HTMLCanvasElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const signalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = !document.hidden;
    let reducedMotion = motionQuery.matches;
    let staticFrameDrawn = false;
    let sectionStops: SceneStop[] = [];
    let animationTime = 0;
    let lastFrameTime = 0;
    let lastDrawTime = 0;
    let scrollBoost = 1;
    let targetScrollBoost = 1;
    let scrollActiveUntil = 0;
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let canvasWidth = 0;
    let canvasHeight = 0;
    let canvasDpr = 1;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowMemory = typeof deviceMemory === "number" && deviceMemory <= 4;
    const observedMain = document.querySelector("main");

    const resizeMeshCanvas = () => {
      const canvas = meshCanvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      canvasDpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 640 || lowMemory ? 1 : 1.35);
      const targetWidth = Math.round(canvasWidth * canvasDpr);
      const targetHeight = Math.round(canvasHeight * canvasDpr);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
    };

    const cross = (a: Vec3, b: Vec3): Vec3 => ({
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x,
    });

    const normalize = (v: Vec3): Vec3 => {
      const length = Math.hypot(v.x, v.y, v.z) || 1;
      return { x: v.x / length, y: v.y / length, z: v.z / length };
    };

    const centerline = (u: number, morph: number): Vec3 => {
      const circle: Vec3 = {
        x: 1.48 * Math.cos(u),
        y: 1.08 * Math.sin(u),
        z: 0.16 * Math.sin(2 * u),
      };
      const loop = 1.18 + 0.58 * Math.cos(3 * u);
      const knot: Vec3 = {
        x: loop * Math.cos(2 * u),
        y: loop * Math.sin(2 * u),
        z: 0.68 * Math.sin(3 * u),
      };
      return {
        x: mix(circle.x, knot.x, morph),
        y: mix(circle.y, knot.y, morph),
        z: mix(circle.z, knot.z, morph),
      };
    };

    const projectPoint = (
      point: Vec3,
      centerX: number,
      centerY: number,
      size: number,
      yaw: number,
      pitch: number,
      roll: number,
    ) => {
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      let x = point.x * cosYaw + point.z * sinYaw;
      let z = -point.x * sinYaw + point.z * cosYaw;
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      const y = point.y * cosPitch - z * sinPitch;
      z = point.y * sinPitch + z * cosPitch;
      const cosRoll = Math.cos(roll);
      const sinRoll = Math.sin(roll);
      const rotatedX = x * cosRoll - y * sinRoll;
      const rotatedY = x * sinRoll + y * cosRoll;
      const perspective = 4.8 / Math.max(2.5, 4.8 + z);
      x = centerX + rotatedX * size * perspective;
      const screenY = centerY + rotatedY * size * perspective;
      return { x, y: screenY };
    };

    const drawWireframe = (scene: SceneFrame, totalProgress: number, scrollY: number, motionScale: number, animationTime: number) => {
      const canvas = meshCanvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context || canvasWidth < 1 || canvasHeight < 1) return;

      context.setTransform(canvasDpr, 0, 0, canvasDpr, 0, 0);
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.lineCap = "round";
      context.lineJoin = "round";

      const mobile = window.innerWidth < 640;
      const smallMemory = mobile || lowMemory;
      const smallestDimension = Math.min(canvasWidth, canvasHeight);
      const phase = clamp(scene.phase);
      const idleMorph = 0.5 + 0.5 * Math.sin(animationTime * 0.2);
      const morph = smoothstep(clamp((phase * 0.7 + idleMorph * 0.3) * 1.18));
      const knotYaw = -0.68 + phase * Math.PI * 1.35 + totalProgress * 0.18 + animationTime * 0.075;
      const knotPitch = 0.38 + (scene.y - 0.5) * 0.35 + Math.sin(animationTime * 0.15) * 0.065;
      const knotRoll = (scene.x - 0.5) * 0.42 + Math.sin(animationTime * 0.12) * 0.055;
      const knotScale = smallestDimension * (mobile ? 0.235 : 0.295);
      const knotX = (mobile ? canvasWidth * 0.5 : canvasWidth * (0.21 + scene.x * 0.14)) + Math.sin(animationTime * 0.1) * 12 * motionScale;
      const knotY = canvasHeight * (0.39 + scene.y * 0.14) - scrollY * 0.01 * motionScale + Math.cos(animationTime * 0.12) * 8 * motionScale;
      const tubeRadius = 0.075 + Math.sin((phase + idleMorph * 0.35) * Math.PI) * 0.052;
      const longitudinalLines = mobile ? 10 : lowMemory ? 18 : 28;
      const longitudinalSamples = mobile ? 34 : lowMemory ? 48 : 70;
      const crossSectionLines = mobile ? 4 : lowMemory ? 8 : 13;
      const crossSectionSamples = mobile ? 32 : lowMemory ? 44 : 60;
      const breathing = 0.94 + Math.sin(animationTime * 0.8) * 0.06;
      const wireAlpha = (mobile ? 0.25 : 0.31 + scene.detail * 0.1) * breathing;

      const tubePoint = (u: number, angle: number): Vec3 => {
        const center = centerline(u, morph);
        const ahead = centerline(u + 0.004, morph);
        const behind = centerline(u - 0.004, morph);
        const tangent = normalize({ x: ahead.x - behind.x, y: ahead.y - behind.y, z: ahead.z - behind.z });
        const reference = Math.abs(tangent.z) > 0.92 ? { x: 0, y: 1, z: 0 } : { x: 0, y: 0, z: 1 };
        const normal = normalize(cross(tangent, reference));
        const binormal = normalize(cross(tangent, normal));
        return {
          x: center.x + tubeRadius * (Math.cos(angle) * normal.x + Math.sin(angle) * binormal.x),
          y: center.y + tubeRadius * (Math.cos(angle) * normal.y + Math.sin(angle) * binormal.y),
          z: center.z + tubeRadius * (Math.cos(angle) * normal.z + Math.sin(angle) * binormal.z),
        };
      };

      const drawCurve = (points: Vec3[], color: string, alpha: number, width: number, close = false) => {
        if (points.length < 2) return;
        context.beginPath();
        points.forEach((point, index) => {
          const projected = projectPoint(point, knotX, knotY, knotScale, knotYaw, knotPitch, knotRoll);
          if (index === 0) context.moveTo(projected.x, projected.y);
          else context.lineTo(projected.x, projected.y);
        });
        if (close) context.closePath();
        context.strokeStyle = color;
        context.globalAlpha = alpha;
        context.lineWidth = width;
        context.stroke();
      };

      // A tubular torus knot morphs from a calm ring into a more complex loop as sections pass.
      for (let line = 0; line < longitudinalLines; line += 1) {
        const angle = (line / longitudinalLines) * Math.PI * 2;
        const points: Vec3[] = [];
        for (let sample = 0; sample <= longitudinalSamples; sample += 1) {
          points.push(tubePoint((sample / longitudinalSamples) * Math.PI * 2, angle));
        }
        drawCurve(points, "#8dbbff", wireAlpha * (0.68 + (line % 4) * 0.1), 0.82);
      }

      for (let ring = 0; ring < crossSectionLines; ring += 1) {
        const u = (ring / crossSectionLines) * Math.PI * 2;
        const points: Vec3[] = [];
        for (let sample = 0; sample < crossSectionSamples; sample += 1) {
          points.push(tubePoint(u, (sample / crossSectionSamples) * Math.PI * 2));
        }
        drawCurve(points, "#6eaaff", wireAlpha * 0.76, 0.72, true);
      }

      if (!mobile) {
        // A second original extruded M wireframe rotates with the evolving knot.
        const markCenterX = canvasWidth * (0.62 + scene.x * 0.13) + Math.cos(animationTime * 0.075) * 10 * motionScale;
        const markCenterY = canvasHeight * (0.38 + scene.y * 0.18) - scrollY * 0.014 * motionScale + Math.sin(animationTime * 0.09) * 7 * motionScale;
        const markScale = smallestDimension * (0.285 + Math.sin(animationTime * 0.16) * 0.008);
        const markYaw = knotYaw * 0.74 + 0.22 + animationTime * 0.052;
        const markPitch = 0.28 + phase * 0.12 + Math.cos(animationTime * 0.13) * 0.05;
        const markRoll = -0.16 + (scene.x - 0.5) * 0.25 + Math.sin(animationTime * 0.1) * 0.04;
        const depth = 0.2 + morph * 0.3;
        const markPoints: Array<[number, number]> = [
          [-1, 0.82], [-1, -0.82], [-0.74, -0.82], [0, 0.12],
          [0.74, -0.82], [1, -0.82], [1, 0.82],
        ];
        const extrusionLayers = smallMemory ? 7 : 14;
        const projectedLayers: Array<Array<{ x: number; y: number }>> = [];

        for (let layer = 0; layer < extrusionLayers; layer += 1) {
          const z = (layer / (extrusionLayers - 1) - 0.5) * depth;
          const projected = markPoints.map(([x, y]) => projectPoint(
            { x, y, z }, markCenterX, markCenterY, markScale, markYaw, markPitch, markRoll,
          ));
          projectedLayers.push(projected);
          context.beginPath();
          projected.forEach((point, index) => {
            if (index === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          });
          context.strokeStyle = layer === 0 || layer === extrusionLayers - 1 ? "#a4caff" : "#6e9eed";
          context.globalAlpha = (layer === 0 || layer === extrusionLayers - 1 ? 0.28 : 0.14) + scene.detail * 0.08;
          context.lineWidth = layer === 0 || layer === extrusionLayers - 1 ? 1.05 : 0.72;
          context.stroke();
        }

        context.beginPath();
        markPoints.forEach((_, pointIndex) => {
          const first = projectedLayers[0][pointIndex];
          const last = projectedLayers[projectedLayers.length - 1][pointIndex];
          context.moveTo(first.x, first.y);
          context.lineTo(last.x, last.y);
        });
        context.strokeStyle = "#8bb7ff";
        context.globalAlpha = 0.3 + scene.detail * 0.1;
        context.lineWidth = 0.75;
        context.stroke();
      }

      context.globalAlpha = 1;
    };

    const measuredLayers = () => [
      atmosphereRef.current,
      gridRef.current,
      dustRef.current,
      primaryGlowRef.current,
      secondaryGlowRef.current,
      tertiaryGlowRef.current,
      geometryRef.current,
      ribbonRef.current,
      blueprintRef.current,
      trailRef.current,
      signalRef.current,
    ];

    const resetLayers = () => {
      measuredLayers().forEach((layer) => {
        if (layer) layer.style.transform = "translate3d(0, 0, 0)";
      });
      if (primaryGlowRef.current) primaryGlowRef.current.style.opacity = "0.42";
      if (secondaryGlowRef.current) secondaryGlowRef.current.style.opacity = "0.3";
      if (tertiaryGlowRef.current) tertiaryGlowRef.current.style.opacity = "0.24";
      if (ribbonRef.current) ribbonRef.current.style.opacity = "0.28";
      if (blueprintRef.current) blueprintRef.current.style.opacity = "0.19";
      if (trailRef.current) trailRef.current.style.opacity = "0.24";
      if (backgroundRef.current) {
        backgroundRef.current.dataset.scene = "still";
        backgroundRef.current.dataset.motionSpeed = "1.00";
      }
      drawWireframe(initialScene, 0, 0, 1, 0);
    };

    const measureSections = () => {
      sectionStops = sceneMap.flatMap((scene, index) => {
        const element = document.getElementById(scene.id);
        if (!element) return [];
        const rect = element.getBoundingClientRect();
        return [{ ...scene, phase: index / Math.max(sceneMap.length - 1, 1), center: rect.top + window.scrollY + rect.height * 0.5 }];
      });
    };

    const getScene = (focusY: number): SceneFrame => {
      if (sectionStops.length === 0) return initialScene;
      if (focusY <= sectionStops[0].center) return sectionStops[0];
      const last = sectionStops[sectionStops.length - 1];
      if (focusY >= last.center) return last;

      for (let index = 0; index < sectionStops.length - 1; index += 1) {
        const from = sectionStops[index];
        const to = sectionStops[index + 1];
        if (focusY >= from.center && focusY <= to.center) {
          const span = Math.max(to.center - from.center, 1);
          const progress = smoothstep(clamp((focusY - from.center) / span));
          return {
            id: progress < 0.5 ? from.id : to.id,
            x: mix(from.x, to.x, progress),
            y: mix(from.y, to.y, progress),
            primary: mix(from.primary, to.primary, progress),
            secondary: mix(from.secondary, to.secondary, progress),
            detail: mix(from.detail, to.detail, progress),
            phase: mix(from.phase, to.phase, progress),
          };
        }
      }
      return last;
    };

    const updateLayers = (time: number) => {
      frame = 0;
      if (!visible) return;
      if (reducedMotion) {
        if (!staticFrameDrawn) {
          resetLayers();
          staticFrameDrawn = true;
        }
        return;
      }
      staticFrameDrawn = false;

      const deltaTime = Math.min(Math.max(lastFrameTime === 0 ? 16.67 : time - lastFrameTime, 1), 50);
      lastFrameTime = time;
      if (time >= scrollActiveUntil) targetScrollBoost = 1;
      const easing = 1 - Math.exp(-deltaTime / 75);
      scrollBoost += (targetScrollBoost - scrollBoost) * easing;
      if (Math.abs(scrollBoost - targetScrollBoost) < 0.015) scrollBoost = targetScrollBoost;
      animationTime += (deltaTime / 1000) * scrollBoost;

      const drawInterval = window.innerWidth < 640 || lowMemory
        ? (scrollBoost > 1.12 ? 1000 / 60 : 1000 / 30)
        : 1000 / 60;
      if (lastDrawTime > 0 && time - lastDrawTime < drawInterval) {
        frame = window.requestAnimationFrame(updateLayers);
        return;
      }
      lastDrawTime = time;

      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight || 1;
      const viewportWidth = window.innerWidth || 1;
      const fullRange = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      const totalProgress = clamp(scrollY / fullRange);
      const heroProgress = clamp(scrollY / (viewportHeight * 1.15));
      const scene = getScene(scrollY + viewportHeight * 0.52);
      const isSmallScreen = viewportWidth < 640;
      const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
      const motionScale = (isSmallScreen ? 0.34 : isTablet ? 0.68 : 1) * (lowMemory ? 0.72 : 1);
      const sceneOffsetX = (scene.x - 0.5) * viewportWidth * 0.42;
      const sceneOffsetY = (scene.y - 0.46) * viewportHeight * 0.42;

      if (atmosphereRef.current) {
        const driftX = Math.sin(animationTime * 0.13) * 18 * motionScale;
        const driftY = Math.cos(animationTime * 0.1) * 14 * motionScale;
        atmosphereRef.current.style.transform = `translate3d(${Math.round(-scrollY * 0.012 * motionScale + driftX)}px, ${Math.round(-scrollY * 0.042 * motionScale + driftY)}px, 0) scale(${(1.055 + totalProgress * 0.045 + Math.sin(animationTime * 0.16) * 0.008).toFixed(3)})`;
      }
      if (gridRef.current) {
        const gridDrift = Math.sin(animationTime * 0.09) * 7 * motionScale;
        gridRef.current.style.transform = `translate3d(${Math.round(scrollY * 0.016 * motionScale + gridDrift)}px, ${Math.round(-scrollY * 0.031 * motionScale + Math.cos(animationTime * 0.08) * 6 * motionScale)}px, 0) scale(1.045)`;
      }
      if (primaryGlowRef.current) {
        const x = scrollY * 0.011 * motionScale + sceneOffsetX + Math.sin(animationTime * 0.12) * 22 * motionScale;
        const y = -scrollY * 0.048 * motionScale + sceneOffsetY + Math.cos(animationTime * 0.1) * 16 * motionScale;
        primaryGlowRef.current.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) scale(${(1 + totalProgress * 0.055 + scene.primary * 0.025 + Math.sin(animationTime * 0.17) * 0.018).toFixed(3)})`;
        primaryGlowRef.current.style.opacity = (0.22 + scene.primary * 0.55 + (1 - heroProgress) * 0.06 + Math.sin(animationTime * 0.22) * 0.025).toFixed(3);
      }
      if (secondaryGlowRef.current) {
        const x = -scrollY * 0.017 * motionScale - sceneOffsetX * 0.72 + Math.cos(animationTime * 0.085) * 18 * motionScale;
        const y = scrollY * 0.022 * motionScale + sceneOffsetY * 0.74 + Math.sin(animationTime * 0.11) * 13 * motionScale;
        secondaryGlowRef.current.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) scale(${(1.035 - totalProgress * 0.025 + scene.secondary * 0.035 + Math.sin(animationTime * 0.14) * 0.012).toFixed(3)})`;
        secondaryGlowRef.current.style.opacity = (0.15 + scene.secondary * 0.52 + Math.cos(animationTime * 0.16) * 0.018).toFixed(3);
      }
      if (tertiaryGlowRef.current) {
        const x = scrollY * 0.009 * motionScale + sceneOffsetX * 0.42 + Math.sin(animationTime * 0.075) * 15 * motionScale;
        const y = -scrollY * 0.028 * motionScale + sceneOffsetY * 0.5 + Math.cos(animationTime * 0.09) * 12 * motionScale;
        tertiaryGlowRef.current.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0) scale(${(0.98 + totalProgress * 0.055 + scene.detail * 0.025 + Math.sin(animationTime * 0.12) * 0.014).toFixed(3)})`;
        tertiaryGlowRef.current.style.opacity = (0.1 + scene.detail * 0.39).toFixed(3);
      }
      if (geometryRef.current) {
        const rotation = totalProgress * 12 * motionScale + Math.sin(animationTime * 0.1) * 2.2;
        geometryRef.current.style.transform = `translate3d(${Math.round(-scrollY * 0.008 * motionScale + Math.sin(animationTime * 0.1) * 6 * motionScale)}px, ${Math.round(-scrollY * 0.032 * motionScale + Math.cos(animationTime * 0.1) * 6 * motionScale)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${(1 + scene.detail * 0.018).toFixed(3)})`;
        geometryRef.current.style.opacity = (0.2 + scene.detail * 0.48).toFixed(3);
      }
      if (ribbonRef.current) {
        ribbonRef.current.style.transform = `translate3d(${Math.round(scrollY * 0.024 * motionScale + sceneOffsetX * 0.28 + Math.sin(animationTime * 0.1) * 12 * motionScale)}px, ${Math.round(-scrollY * 0.055 * motionScale - sceneOffsetY * 0.24 + Math.cos(animationTime * 0.1) * 9 * motionScale)}px, 0) rotate(${(-totalProgress * 5.2 * motionScale + Math.sin(animationTime * 0.08) * 1.1).toFixed(2)}deg) scale(${(1 + scene.detail * 0.018).toFixed(3)})`;
        ribbonRef.current.style.opacity = (0.18 + scene.detail * 0.18 + Math.sin(animationTime * 0.2) * 0.014).toFixed(3);
      }
      if (blueprintRef.current) {
        blueprintRef.current.style.transform = `translate3d(${Math.round(-scrollY * 0.013 * motionScale - sceneOffsetX * 0.18 + Math.sin(animationTime * 0.07) * 10 * motionScale)}px, ${Math.round(scrollY * 0.039 * motionScale + sceneOffsetY * 0.2 + Math.cos(animationTime * 0.085) * 8 * motionScale)}px, 0)`;
        blueprintRef.current.style.opacity = (0.11 + scene.detail * 0.24 + Math.sin(animationTime * 0.18) * 0.012).toFixed(3);
      }
      if (dustRef.current) {
        dustRef.current.style.transform = `translate3d(${Math.round(-scrollY * 0.032 * motionScale + Math.sin(animationTime * 0.16) * 7 * motionScale)}px, ${Math.round(scrollY * 0.047 * motionScale + Math.cos(animationTime * 0.14) * 7 * motionScale)}px, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${Math.round(-scrollY * 0.022 * motionScale + Math.sin(animationTime * 0.11) * 12 * motionScale)}px, ${Math.round(scrollY * 0.035 * motionScale + Math.cos(animationTime * 0.09) * 8 * motionScale)}px, 0) rotate(${(scene.x * 2.2 - 1.1 + Math.sin(animationTime * 0.12) * 0.18).toFixed(2)}deg)`;
        trailRef.current.style.opacity = (0.12 + scene.detail * 0.34 + Math.sin(animationTime * 0.22) * 0.016).toFixed(3);
      }
      if (signalRef.current) {
        signalRef.current.style.transform = `translate3d(${Math.round(-scrollY * 0.018 * motionScale + sceneOffsetX * 0.18 + Math.cos(animationTime * 0.09) * 8 * motionScale)}px, ${Math.round(scrollY * 0.024 * motionScale + Math.sin(animationTime * 0.1) * 7 * motionScale)}px, 0)`;
        signalRef.current.style.opacity = (0.2 + scene.primary * 0.4 + Math.sin(animationTime * 0.17) * 0.014).toFixed(3);
      }

      drawWireframe(scene, totalProgress, scrollY, motionScale, animationTime);
      if (backgroundRef.current) {
        backgroundRef.current.dataset.scene = scene.id;
        backgroundRef.current.dataset.motionSpeed = scrollBoost.toFixed(2);
      }
      frame = window.requestAnimationFrame(updateLayers);
    };

    const requestUpdate = () => {
      if (visible && !frame) frame = window.requestAnimationFrame(updateLayers);
    };
    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY || window.pageYOffset;
      const elapsed = Math.max(now - lastScrollTime, 8);
      const velocity = Math.abs(currentY - lastScrollY) / elapsed;
      targetScrollBoost = velocity > 0.035 ? 1 + Math.min(velocity * 2.4, 4.8) : 1;
      scrollActiveUntil = now + 190;
      lastScrollY = currentY;
      lastScrollTime = now;
      requestUpdate();
    };
    const onVisibilityChange = () => {
      visible = !document.hidden;
      if (visible) {
        lastFrameTime = 0;
        lastDrawTime = 0;
        requestUpdate();
      } else if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        lastFrameTime = 0;
      }
    };
    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      staticFrameDrawn = false;
      scrollBoost = 1;
      targetScrollBoost = 1;
      lastFrameTime = 0;
      lastDrawTime = 0;
      requestUpdate();
    };
    const onResize = () => {
      resizeMeshCanvas();
      measureSections();
      staticFrameDrawn = false;
      lastDrawTime = 0;
      requestUpdate();
    };
    const onLoad = () => {
      measureSections();
      requestUpdate();
    };

    resizeMeshCanvas();
    measureSections();
    const resizeObserver = observedMain && "ResizeObserver" in window
      ? new ResizeObserver(() => {
          measureSections();
          requestUpdate();
        })
      : null;
    if (observedMain) resizeObserver?.observe(observedMain);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onLoad, { once: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    motionQuery.addEventListener("change", onMotionChange);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motionQuery.removeEventListener("change", onMotionChange);
      resizeObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={backgroundRef} className="cinematic-background" aria-hidden="true">
      <div ref={atmosphereRef} className="cinematic-atmosphere" />
      <div ref={gridRef} className="cinematic-grid-layer" />
      <canvas ref={meshCanvasRef} className="cinematic-mesh-canvas" />
      <div ref={primaryGlowRef} className="cinematic-glow cinematic-glow-primary" />
      <div ref={secondaryGlowRef} className="cinematic-glow cinematic-glow-secondary" />
      <div ref={tertiaryGlowRef} className="cinematic-glow cinematic-glow-tertiary" />
      <div ref={geometryRef} className="cinematic-geometry">
        <span className="cinematic-orbit cinematic-orbit-one" />
        <span className="cinematic-orbit cinematic-orbit-two" />
        <span className="cinematic-crosshair" />
      </div>
      <svg ref={ribbonRef} className="cinematic-ribbon" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <g className="cinematic-ribbon-shadow">
          <path d="M-70 610 C120 170 352 774 536 352 S900 170 1100 522 S1320 490 1530 128" />
          <path d="M-50 660 C170 220 370 824 566 402 S932 220 1132 572 S1354 540 1560 178" />
          <path d="M-90 560 C70 120 328 720 506 302 S868 120 1068 472 S1290 440 1502 78" />
        </g>
        <g className="cinematic-ribbon-wire">
          <path d="M-70 610 C120 170 352 774 536 352 S900 170 1100 522 S1320 490 1530 128" />
          <path d="M-50 660 C170 220 370 824 566 402 S932 220 1132 572 S1354 540 1560 178" />
          <path d="M-90 560 C70 120 328 720 506 302 S868 120 1068 472 S1290 440 1502 78" />
          <path d="M80 320 L208 468 L347 345 L498 548 L665 380 L842 524 L1047 292 L1224 458" />
          <path d="M80 320 L170 534 L347 345 L440 620 L665 380 L755 608 L1047 292 L1140 544 L1224 458" />
        </g>
        <g className="cinematic-ribbon-nodes">
          <circle cx="208" cy="468" r="5" />
          <circle cx="347" cy="345" r="5" />
          <circle cx="665" cy="380" r="5" />
          <circle cx="842" cy="524" r="5" />
          <circle cx="1047" cy="292" r="5" />
        </g>
      </svg>
      <div ref={blueprintRef} className="cinematic-blueprint">
        <span className="cinematic-blueprint-index">01</span>
        <span className="cinematic-blueprint-mark">MPP</span>
        <span className="cinematic-blueprint-label">NETWORK // FIELD MAP</span>
      </div>
      <div ref={dustRef} className="cinematic-dust" />
      <div ref={trailRef} className="cinematic-trails" aria-hidden="true">
        <span className="cinematic-trail cinematic-trail-one" />
        <span className="cinematic-trail cinematic-trail-two" />
        <span className="cinematic-trail cinematic-trail-three" />
      </div>
      <div ref={signalRef} className="cinematic-signal-line" />
      <div className="cinematic-vignette" />
    </div>
  );
}
