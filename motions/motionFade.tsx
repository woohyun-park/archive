import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

type IMotionFade = {
  children: React.ReactNode;
};

export default function MotionFade({ children }: IMotionFade) {
  const router = useRouter();
  return (
    <>
      <AnimatePresence>
        <motion.div
          key={router.route}
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
