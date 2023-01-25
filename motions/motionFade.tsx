import { AnimatePresence, motion } from "framer-motion";

type IMotion = {
  children: React.ReactNode;
};

export default function MotionFade({ children }: IMotion) {
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
