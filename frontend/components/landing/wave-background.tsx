"use client";

import { motion, useReducedMotion } from "motion/react";

const PERIOD = 720;
const WIDTH = PERIOD * 4;

function wavePath(amplitude: number, baseline: number, height: number) {
  let d = `M0 ${baseline}`;
  for (let x = 0; x < WIDTH; x += PERIOD) {
    const q = PERIOD / 4;
    d += ` Q${x + q} ${baseline - amplitude} ${x + 2 * q} ${baseline} T${x + PERIOD} ${baseline}`;
  }
  return `${d} V${height} H0 Z`;
}

const LAYERS = [
  { amplitude: 14, baseline: 40, duration: 28, fill: "var(--primary)", opacity: 0.06 },
  { amplitude: 18, baseline: 70, duration: 20, fill: "var(--primary)", opacity: 0.09 },
  { amplitude: 10, baseline: 100, duration: 14, fill: "var(--primary)", opacity: 0.14 },
];

export function WaveBackground() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in oklab, var(--gold) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 sm:h-56">
        {LAYERS.map((l, i) => (
          <motion.svg
            key={i}
            viewBox={`0 0 ${WIDTH} 160`}
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 h-full w-[400%] sm:w-[200%]"
            initial={{ x: "0%" }}
            animate={reduce ? undefined : { x: i % 2 ? ["-25%", "0%"] : ["0%", "-25%"] }}
            transition={{ duration: l.duration, ease: "linear", repeat: Infinity }}
          >
            <path d={wavePath(l.amplitude, l.baseline, 160)} fill={l.fill} fillOpacity={l.opacity} />
          </motion.svg>
        ))}
        <motion.svg
          viewBox={`0 0 ${WIDTH} 160`}
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 h-full w-[400%] sm:w-[200%]"
          animate={reduce ? undefined : { x: ["0%", "-25%"] }}
          transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        >
          <path
            d={wavePath(12, 56, 160).split(" V")[0]}
            fill="none"
            stroke="var(--gold)"
            strokeOpacity={0.45}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </motion.svg>
      </div>
    </div>
  );
}
