import Btn from "./atoms/Button/Button";
import { Children } from "react";
import { twMerge } from "tailwind-merge";
import { useCustomRouter } from "hooks";

interface ITagsProps {
  tags: string[];
  className?: string;
}

export default function Tags({ tags, className }: ITagsProps) {
  const router = useCustomRouter();

  return (
    <div className={twMerge("flex justify-end w-full", className || "")}>
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
