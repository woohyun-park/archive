import Image from "next/image";
import Link from "next/link";
import { HTMLInputTypeAttribute } from "react";
import { IUser } from "../../libs/custom";
interface IProfileImgProps {
  user: IUser;
}

export default function ProfileImg({ user }: IProfileImgProps) {
  return (
    <div className="mr-1 profileImg-small">
      <Link href={`/profile/${user?.id}`}>
        <Image src={user.photoURL} alt="" fill />
      </Link>
    </div>
  );
}
