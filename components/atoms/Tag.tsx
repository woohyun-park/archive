import Link from "next/link";

interface ITagProps {
  children?: React.ReactNode;
}

export default function Tag({ children }: ITagProps) {
  return (
    <>
      <Link href={`/tag/${children}`}>
        <button
          className="p-2 ext-center rounded-lg text-white inline-block px-2.5 py-2.5 
        bg-black font-medium text-xs leading-tight uppercase shadow-md hover:bg-black-f 
        hover:shadow-lg focus:bg-black-f focus:shadow-lg focus:outline-none focus:ring-0 
        active:bg-black-f active:shadow-lg transition duration-150 ease-in-out min-w-fit"
        >
          {`#${children}`}
        </button>
      </Link>
    </>
  );
}
