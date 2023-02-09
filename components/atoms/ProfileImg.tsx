import Image from "next/image";
import Link from "next/link";
import { IUser } from "../../libs/custom";
interface IProfileImgProps {
  user: IUser;
  onClick?: () => void;
}

export default function ProfileImg({ user, onClick }: IProfileImgProps) {
  return (
    <div className="mr-1 profileImg-small" onClick={onClick}>
      <Link href={`/profile/${user?.id}`}>
        <Image src={user.photoURL} alt="" fill />
      </Link>
    </div>
  );
}
