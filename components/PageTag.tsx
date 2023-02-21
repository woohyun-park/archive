import { AnimatePresence } from "framer-motion";
import { IAlarm, ITag } from "../libs/custom";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import WrapMotion from "./wrappers/WrapMotion";

interface IPageTagProps {
  tags: ITag[];
  isLast: boolean;
  setLastIntersecting: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function PageTag({
  tags,
  isLast,
  setLastIntersecting,
}: IPageTagProps) {
  return (
    <>
      <AnimatePresence>
        {tags.map((tag, i) => {
          return (
            <WrapMotion type="float" key={tag.id}>
              <>
                <div>{tag.name}</div>
                {!isLast && i === tags.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            </WrapMotion>
          );
        })}
      </AnimatePresence>
    </>
  );
}
