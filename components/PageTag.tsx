import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Children } from "react";
import WrapMotion from "./wrappers/WrapMotion";

interface IPageTagProps {
  tags: any[];
  isLast: boolean;
  setLastIntersecting: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function PageTag({
  tags,
  isLast,
  setLastIntersecting,
}: IPageTagProps) {
  const router = useRouter();
  return (
    <>
      <AnimatePresence>
        {Children.toArray(
          tags.map((tag, i) => {
            return (
              <WrapMotion
                type="float"
                className="flex items-center mx-4 my-2 hover:cursor-pointer"
                onClick={() => router.push(`/tag/${tag.name}`)}
              >
                <div className="flex items-center justify-center w-8 h-8 mr-2 text-xl rounded-full bg-gray-3 text-bold">
                  #
                </div>
                <div>
                  <div className="text-sm font-bold text-black">
                    #{tag.name}
                  </div>
                  <div className="w-full overflow-hidden text-xs whitespace-pre-wrap -translate-y-[2px] text-gray-1 text-ellipsis">
                    게시물 {tag.tags.length}개
                  </div>
                </div>
                {!isLast && i === tags.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </WrapMotion>
            );
          })
        )}
      </AnimatePresence>
    </>
  );
}
