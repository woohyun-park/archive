import { useRouter } from "next/router";
import { Children } from "react";
import Btn from "./Btn";

interface IPostTagsProps {
  tags: string[];
}

export default function PostTags({ tags }: IPostTagsProps) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap justify-end w-full mb-8">
      {Children.toArray(
        tags.map((tag, i) => (
          <Btn
            label={`#${tag}`}
            onClick={() => router.push(`/tag/${tag}`)}
            style={{
              margin: "0.125rem",
              paddingRight: "0.5rem",
              paddingLeft: "0.5rem",
            }}
          />
        ))
      )}
    </div>
  );
}
