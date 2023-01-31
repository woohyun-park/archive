import { AnimatePresence, motion } from "framer-motion";
import { fadeVariants, floatVariants, IMotionType } from "../libs/motionLib";

type IMotion = {
  children: React.ReactNode;
  type: IMotionType;
  key?: string;
  isVisible?: boolean;
};

export default function Motion({
  children,
  key,
  type,
  isVisible = true,
}: IMotion) {
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key={key}
            initial="initial"
            animate="animate"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            variants={
              type === "fade"
                ? fadeVariants
                : type === "float"
                ? floatVariants
                : {}
            }
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
