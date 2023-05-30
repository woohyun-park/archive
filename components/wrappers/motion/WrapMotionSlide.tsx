import { motion } from "framer-motion";
import { MouseEventHandler } from "react";
import { MOTION_TRANSITION, MOTION_VIEWPORT } from "consts/motion";
import WrapMotionAccordion from "./WrapMotionAccordion";

type Props = {
  children: React.ReactNode;
  direction: "x" | "y";
  offset: string;

  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export default function WrapMotionSlide({
  children,
  direction,
  offset,

  className,
  onClick,
}: Props) {
  const transition = MOTION_TRANSITION;

  const motionXHelper = {
    initial: { x: "100%", transition },
    animate: { x: "0%", transition },
    exit: { x: "100%", transition },
  };

  const motionYHelper = {
    initial: { y: "100%", transition },
    animate: { y: "0%", transition },
    exit: { y: "100%", transition },
  };

  return (
    <WrapMotionAccordion
      direction={direction}
      offset={offset}
      onClick={onClick}
      className={className}
    >
      <motion.div
        className="absolute"
        initial="initial"
        animate="animate"
        exit="exit"
        viewport={MOTION_VIEWPORT}
        variants={
          direction == "x"
            ? motionXHelper
            : direction == "y"
            ? motionYHelper
            : {}
        }
      >
        {children}
      </motion.div>
    </WrapMotionAccordion>
  );
}
