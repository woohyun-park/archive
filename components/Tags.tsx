import { Children } from "react";
import Tag from "./atoms/Tag/Tag";
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
              <Tag label={tag} className="mb-1 ml-1" onClick={() => router.push(`/tag/${tag}`)} />
            );
          })
        )}
      </div>
    </div>
  );
}
