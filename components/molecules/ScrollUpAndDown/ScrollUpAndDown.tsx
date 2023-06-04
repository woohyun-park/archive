import { Icon } from "components/atoms";

// TODO: ScrollUpAndDown 훅으로 아무 페이지에서나 사용할 수 있도록 설정

export default function ScrollUpAndDown() {
  return (
    <div className="w-fit">
      <Icon
        icon="up"
        className="p-1 mb-2 bg-white rounded-full opacity-75 hover:cursor-pointer w-fit"
        onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
      />
      <Icon
        icon="down"
        className="p-1 bg-white rounded-full opacity-75 hover:cursor-pointer w-fit"
        onClick={() => scrollTo({ top: 99999, behavior: "smooth" })}
      />
    </div>
  );
}
