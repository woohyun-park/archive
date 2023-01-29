import { AnimatePresence, motion, Variants } from "framer-motion";
import { useRef } from "react";

type IMotion = {
  children: React.ReactNode;
  key: string;
  duration?: number;
  amount?: number;
  isVisible?: boolean;
};

export default function MotionFloat({
  children,
  key,
  isVisible = true,
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
    exit: {
      transform: `translateY(16px)`,
      opacity: 0,
      transition: { duration },
    },
  };
  const scrollRef = useRef(null);
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={key}
            initial="initial"
            whileInView="whileInView"
            exit="exit"
            viewport={{ once: true, amount }}
            variants={variants}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
