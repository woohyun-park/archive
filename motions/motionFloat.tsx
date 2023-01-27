import { motion, Variants } from "framer-motion";
import { useRouter } from "next/router";
import { useRef } from "react";

type IMotion = {
  children: React.ReactNode;
  duration?: number;
  amount?: number;
};

export default function MotionFloat({
  children,
  duration = 0.33,
  amount = 0.1,
}: IMotion) {
  const variants: Variants = {
    initial: {
      transform: `translateY(16px)`,
      opacity: 0,
      transition: { duration },
    },
    whileInView: {
      transform: `translateY(0px)`,
      opacity: 1,
      transition: { duration },
    },
  };
  const scrollRef = useRef(null);
  return (
    <>
      <div ref={scrollRef}>
        <motion.div
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount }}
          variants={variants}
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}
