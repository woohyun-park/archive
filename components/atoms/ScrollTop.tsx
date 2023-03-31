import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { SIZE } from "../../apis/custom";

export default function ScrollTop() {
  return (
    <div className="fixed bottom-[6.25rem] w-full max-w-[480px] h-0">
      <div className="flex flex-col items-end float-right mr-6 -mt-24">
        <div
          className="p-1 mb-2 bg-white rounded-full opacity-75 hover:cursor-pointer w-fit"
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        >
          <HiChevronUp size={SIZE.icon} />
        </div>
        <div
          className="p-1 bg-white rounded-full opacity-75 hover:cursor-pointer w-fit"
          onClick={() => scrollTo({ top: 99999, behavior: "smooth" })}
        >
          <HiChevronDown size={SIZE.icon} />
        </div>
      </div>
    </div>
  );
}
