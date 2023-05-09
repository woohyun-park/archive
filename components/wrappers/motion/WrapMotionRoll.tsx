import { motion } from "framer-motion";
import { MouseEventHandler } from "react";
import { MOTION_VIEWPORT } from "consts/motion";

type Props = {
  children: React.ReactNode;

  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function WrapMotionRoll({
  children,

  className,
  onClick,
}: Props) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial="initial"
      animate="animate"
      exit="exit"
      viewport={MOTION_VIEWPORT}
      variants={{
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
      }}
    >
      {children}
    </motion.div>
  );
}
