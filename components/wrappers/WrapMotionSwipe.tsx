import { motion } from "framer-motion";
import { MouseEventHandler } from "react";

type IWrapMotion = {
  children: React.ReactNode;
  enterFrom: "none" | "left" | "right";
  exitTo: "left" | "right";
  key: string;
};

export default function WrapMotionSwipe({
  children,
  enterFrom,
  exitTo,
  key,
}: IWrapMotion) {
  const duration = 0.33;

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        key={key}
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          initial: {
            transform:
              enterFrom === "none"
                ? "translateX(0%)"
                : enterFrom === "left"
                ? `translateX(100%)`
                : `translateX(-100%)`,
            opacity: 0,
            transition: { duration },
          },
          animate: {
            transform: `translateX(0px)`,
            opacity: 1,
            transition: { duration },
          },
          exit: {
            transform:
              exitTo === "left" ? `translateX(-100%)` : `translateX(100%)`,
            opacity: 0,
            transition: { duration },
          },
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
