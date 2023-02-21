import { motion } from "framer-motion";
import { MouseEventHandler } from "react";

type IWrapMotion = {
  children: React.ReactNode;
  type: IWrapMotionType;
  key?: string;
  duration?: number;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export type IWrapMotionType = "float" | "fade" | "swipeLeft";

export default function WrapMotion({
  children,
  type,
  key,
  duration = 0.33,
  className,
  onClick,
}: IWrapMotion) {
  return (
    <>
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
            ? {
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
              }
            : type === "fade"
            ? {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
              }
            : {}
        }
      >
        {children}
      </motion.div>
    </>
  );
}
