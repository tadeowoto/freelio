import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

export default function InformationItem({
  title,
  number,
}: {
  title: string;
  number: number | null;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, number ?? 0, {
      duration: 1,
      ease: "easeOut",
    });
    return controls.stop;
  }, [number, count]);

  return (
    <div>
      <p className="text-midnight-ink text-sm mb-2">{title}</p>
      <motion.p className="text-5xl font-bold font-display text-midnight-ink leading-none">
        {rounded}
      </motion.p>
    </div>
  );
}
