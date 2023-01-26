import { ReactNode, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

const itemVariants: Variants = {
  animate: {
    transform: `translateY(0px)`,
    opacity: 1,
    transition: { duration: 1 },
  },
  exit: {
    transform: `translateY(16px)`,
    opacity: 0,
    transition: { duration: 1 },
  },
};

interface ITestProps {
  data: any[];
  staggerChildren?: number;
  delayChildren?: number;
  callBack: (value: any, index: number, array: any[]) => ReactNode;
}

export default function MotionFloatList({
  data,
  delayChildren = 0.3,
  staggerChildren = 0.05,
  callBack,
}: ITestProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <motion.nav initial={false} animate={isOpen ? "animate" : "exit"}>
      <motion.div
        variants={{
          animate: {
            transition: {
              delayChildren,
              staggerChildren,
            },
          },
          exit: {},
        }}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        {data.map(callBack).map((e, i) => (
          <motion.div key={data[i].id} variants={itemVariants}>
            {e}
          </motion.div>
        ))}
      </motion.div>
    </motion.nav>
  );
}
