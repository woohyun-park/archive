import { motion, Variants } from "framer-motion";
import { useRouter } from "next/router";

type IMotion = {
  children: React.ReactNode;
  duration: number;
};

export default function MotionFloat({ children, duration = 0.33 }: IMotion) {
  const router = useRouter();
  const variants: Variants = {
    initial: {
      transform: `translateY(16px)`,
      opacity: 0,
      transition: { duration },
    },
    whileInView: {
      transform: `translateY(0px)`,
      opacity: 1,
      transition: { duration },
    },
  };
  return (
    <>
      <motion.div
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        variants={variants}
      >
        {children}
      </motion.div>
    </>
  );
}
