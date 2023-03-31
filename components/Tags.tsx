import { Children } from "react";
import { mergeTailwindClasses } from "../apis/tailwind";
import useCustomRouter from "../hooks/useCustomRouter";
import { ITag } from "../apis/def";
import Btn from "./atoms/Btn";

interface ITagsProps {
  tags: string[];
  className?: string;
}

export default function Tags({ tags, className }: ITagsProps) {
  const router = useCustomRouter();

  return (
    <div
      className={mergeTailwindClasses(
        "flex justify-end w-full",
        className || ""
      )}
    >
      <div className="flex flex-row-reverse flex-wrap-reverse justify-start w-2/3">
        {Children.toArray(
          [...tags].reverse().map((tag, i) => {
            return (
              <Btn
                label={`#${tag}`}
                className="px-2 mb-1 ml-1"
                onClick={() => router.push(`/tag/${tag}`)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
