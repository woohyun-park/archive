import { motion } from "framer-motion";

type IWrapMotion = {
  children: React.ReactNode;
  type: IWrapMotionType;
  duration?: number;
  className?: string;
};

export type IWrapMotionType = "float" | "fade";

export default function WrapMotion({
  children,
  type,
  duration = 0.33,
  className,
}: IWrapMotion) {
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
