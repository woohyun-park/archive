import { kMaxLength } from "buffer";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { useRouter } from "next/router";

type IMotion = {
  children: React.ReactNode;
};

// TODO: 라우터 이동간이 아니라 그냥 exit, 즉 AnimatePresence가 안먹는다
// 이유가 뭔지 알아보고 수정할 수 있다면 수정할 것
export default function MotionFloat({ children }: IMotion) {
  const router = useRouter();
  const variants: Variants = {
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
  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </>
  );
}
