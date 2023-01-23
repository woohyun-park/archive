import { useRouter } from "next/router";
import { HiArrowLeft } from "react-icons/hi";
import { SIZE } from "../custom";

interface IBackProps {
  message?: string;
}

export default function Back({ message }: IBackProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex justify-between bg-bg1">
        <div
          className="my-4 hover:cursor-pointer"
          onClick={() => {
            if (message) {
              if (confirm(message)) router.back();
              return;
            }
            router.back();
          }}
        >
          <HiArrowLeft size={SIZE.icon} />
        </div>
      </div>
    </>
  );
}
