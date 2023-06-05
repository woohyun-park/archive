import Button from "../Button/Button";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  onClick: () => void;

  className?: string;
};

export default function Tag({ label, onClick, className }: Props) {
  return <Button className={twMerge("px-2", className)} label={`#${label}`} onClick={onClick} />;
}
