import { useRouter } from "next/router";
import { Children, CSSProperties, MouseEventHandler } from "react";
import Btn from "./atoms/Btn";

interface ITabProps {
  tabs: ITab[];
}

interface ITab {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
  isActive?: boolean;
}

export default function Tab({ tabs }: ITabProps) {
  const router = useRouter();
  return (
    <div className="flex mx-4 mb-4">
      {Children.toArray(
        tabs.map((tab) => (
          <Btn
            label={tab.label}
            onClick={tab.onClick}
            style={tab.style}
            isActive={tab.isActive}
          />
        ))
      )}
    </div>
  );
}
