import { AnimatePresence, motion } from "framer-motion";
import { fadeVariants, floatVariants, IMotionType } from "../libs/motionLib";

type IMotion = {
  children: React.ReactNode;
  type: IMotionType;
};

export default function Motion({ children, type }: IMotion) {
  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={
          type === "fade" ? fadeVariants : type === "float" ? floatVariants : {}
        }
      >
        {children}
      </motion.div>
    </>
  );
}
