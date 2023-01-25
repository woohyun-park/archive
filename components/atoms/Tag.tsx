import Link from "next/link";
import { IDict } from "../../custom";

interface ITagProps {
  children?: React.ReactNode;
  style?: string;
}

export default function Tag({ children, style }: ITagProps) {
  return (
    <>
      <Link href={`/tag/${children}`}>
        <button
          id="tag_b1"
          className="inline-block px-2.5 py-2.5 text-xs font-medium text-white uppercase transition duration-150 ease-in-out bg-black rounded-lg shadow-md leading-tigt ext-center hover:bg-black-f hover:shadow-lg focus:bg-black-f focus:shadow-lg focus:outline-none focus:ring-0 active:bg-black-f active:shadow-lg min-w-fit"
        >
          {`#${children}`}
        </button>
      </Link>

      <style jsx>
        {`
          #tag_b1 {
            ${style}
          }
        `}
      </style>
    </>
  );
}
