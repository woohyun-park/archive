import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

type IMotion = {
  children: React.ReactNode;
};

export default function MotionFloat({ children }: IMotion) {
  const router = useRouter();
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{
            transform: `translateY(16px)`,
            opacity: 0,
            transition: `transform 0.33s ease`,
          }}
          animate={{
            transform: `translateY(0px)`,
            opacity: 1,
            transition: `transform 0.33s ease`,
          }}
          exit={{
            transform: `translateY(16px)`,
            opacity: 0,
            transition: `transform 0.33s ease`,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
