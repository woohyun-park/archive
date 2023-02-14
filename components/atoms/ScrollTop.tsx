import { HiChevronDown, HiChevronUp } from "react-icons/hi2";
import { SIZE } from "../../libs/custom";

export default function ScrollTop() {
  return (
    <div className="fixed opacity-75 bottom-[6.25rem] right-[3rem]">
      <div>
        <div
          className="p-1 mb-2 bg-white rounded-full hover:cursor-pointer"
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
        >
          <HiChevronUp size={SIZE.icon} />
        </div>
        <div
          className="p-1 bg-white rounded-full hover:cursor-pointer"
          onClick={() => scrollTo({ top: 99999, behavior: "smooth" })}
        >
          <HiChevronDown size={SIZE.icon} />
        </div>
      </div>
    </div>
  );
}
