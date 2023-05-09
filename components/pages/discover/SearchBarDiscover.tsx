import { SIZE } from "apis/def";
import BtnIcon from "components/atoms/BtnIcon";
import InputIcon from "components/atoms/InputIcon";
import Link from "next/link";

export default function SearchBar() {
  return (
    <Link href="/search">
      <InputIcon icon="search" keyword="" className="mx-4" />
    </Link>
  );
}
