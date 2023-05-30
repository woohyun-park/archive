import { motion } from "framer-motion";
import { MouseEventHandler } from "react";
import { MOTION_TRANSITION, MOTION_VIEWPORT } from "consts/motion";

type Props = {
  children: React.ReactNode;

  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function WrapMotionFade({
  children,

  className,
  onClick,
}: Props) {
  const transition = MOTION_TRANSITION;

  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial="initial"
      animate="animate"
      exit="exit"
      viewport={MOTION_VIEWPORT}
      variants={{
        initial: { opacity: 0, transition },
        animate: { opacity: 1, transition },
        exit: { opacity: 0, transition },
      }}
    >
      {children}
    </motion.div>
  );
}
