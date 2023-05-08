import { motion } from "framer-motion";
import { MouseEventHandler } from "react";

type IMotion = "float" | "fade" | "swipeLeft" | "roll";

type IWrapMotion = {
  children?: React.ReactNode;
  type: IMotion;
  key?: string;
  duration?: number;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function WrapMotion({
  children,
  type,
  key,
  duration,
  className,
  onClick,
}: IWrapMotion) {
  const float = {
    initial: {
      transform: `translateY(16px)`,
      opacity: 0,
      transition: { duration },
    },
    animate: {
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

  const fade = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const roll = {
    animate: {
      scale: [1, 1, 1, 1, 1, 1],
      rotate: [0, 90, 180, 270, 360, 0],
      transition: {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.15, 0.3, 0.45, 0.6, 1],
        repeat: Infinity,
        repeatDelay: 1,
      },
    },
  };

  return (
    <motion.div
      key={key}
      className={className}
      onClick={onClick}
      initial="initial"
      animate="animate"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
      variants={
        type === "float"
          ? float
          : type === "fade"
          ? fade
          : type == "roll"
          ? roll
          : {}
      }
    >
      {children}
    </motion.div>
  );
}
