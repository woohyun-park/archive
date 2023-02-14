import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { SIZE } from "../../libs/custom";

export default function ScrollTop() {
  return (
    <div className="fixed bottom-[6.25rem] w-full max-w-[480px]">
      <div className="flex flex-col items-end mr-6">
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
