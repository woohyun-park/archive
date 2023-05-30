import { EasingFunction, motion } from "framer-motion";
import { MouseEventHandler } from "react";
import { MOTION_EASE, MOTION_TRANSITION, MOTION_VIEWPORT } from "consts/motion";

type Props = {
  children: React.ReactNode;
  direction: "x" | "y";
  offset: string;

  ease?: EasingFunction;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function WrapMotionAccordion({
  children,
  direction,
  offset,

  ease = MOTION_EASE,
  className,
  onClick,
}: Props) {
  const transition = { ...MOTION_TRANSITION, ease };

  const motionX = {
    initial: { width: offset, transition },
    animate: { width: offset, transition },
    exit: {
      maxWidth: 0,
      width: 0,
      opacity: 0,
      transition,
    },
  };

  const motionY = {
    initial: { height: offset, transition },
    animate: { height: offset, transition },
    exit: {
      maxHeight: 0,
      height: 0,
      opacity: 0,
      transition,
    },
  };

  return (
    <motion.div
      className={className}
      onClick={onClick}
      initial="initial"
      animate="animate"
      exit="exit"
      viewport={MOTION_VIEWPORT}
      variants={direction == "x" ? motionX : direction == "y" ? motionY : {}}
    >
      {children}
    </motion.div>
  );
}
