import { AnimatePresence, motion, Variants } from "framer-motion";

type IMotion = {
  children: React.ReactNode;
  type: IMotionType;
  duration?: number;
  className?: string;
};

export type IMotionType = "float" | "fade";

export default function Motion({
  children,
  type,
  duration = 0.33,
  className,
}: IMotion) {
  return (
    <>
      <motion.div
        className={className}
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
