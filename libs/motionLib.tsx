import { Variants } from "framer-motion";

export const floatVariants: Variants = {
  initial: {
    transform: `translateY(16px)`,
    opacity: 0,
    transition: { duration: 0.33 },
  },
  animate: {
    transform: `translateY(0px)`,
    opacity: 1,
    transition: { duration: 0.33 },
  },
  exit: {
    transform: `translateY(16px)`,
    opacity: 0,
    transition: { duration: 0.33 },
  },
};

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const swipeRightVariants: Variants = {
  initial: {
    opacity: 0,
    transform: "translateX(16px)",
    transition: { duration: 0.1 },
  },
  animate: {
    opacity: 1,
    transform: "translateX(0px)",
    transition: { duration: 0.1 },
  },
  exit: {
    opacity: 0,
    transform: "translateX(16px)",
    transition: { duration: 0.1 },
  },
};

export type IMotionType = "float" | "fade";
