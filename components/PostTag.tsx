import { useRouter } from "next/router";
import { Children, CSSProperties } from "react";
import Btn from "./atoms/Btn";
import WrapLink from "./wrappers/WrapLink";

interface IPostTagProps {
  tags: string[];
  style?: CSSProperties;
}

export default function PostTag({ tags, style }: IPostTagProps) {
  const router = useRouter();
  return (
    <div className="flex flex-wrap justify-end w-full" style={style}>
      {Children.toArray(
        tags.map((tag, i) => (
          <WrapLink href={`/tag/${tag}`} loader={true}>
            <Btn
              label={`#${tag}`}
              style={{
                margin: "0.125rem",
                paddingRight: "0.5rem",
                paddingLeft: "0.5rem",
              }}
            />
          </WrapLink>
        ))
      )}
    </div>
  );
}
