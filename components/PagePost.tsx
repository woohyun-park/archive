import { AnimatePresence } from "framer-motion";
import { IComment } from "../libs/custom";
import Comment from "./Comment";

interface IPagePostProps {
  comments: IComment[];
  isLast: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  setLastIntersecting: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function PagePost({
  comments,
  isLast,
  onClick,
  setLastIntersecting,
}: IPagePostProps) {
  return (
    <>
      <AnimatePresence>
        {comments.map((comment, i) => {
          return (
            <div key={comment.id}>
              <Comment comment={comment} onClick={onClick} />
              {!isLast && i === comments.length - 1 && (
                <div ref={setLastIntersecting}></div>
              )}
            </div>
          );
        })}
      </AnimatePresence>
    </>
  );
}
