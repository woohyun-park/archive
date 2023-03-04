import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { db } from "../apis/firebase";
import { IAlarm, IPost, IUser } from "../libs/custom";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { displayCreatedAt } from "../libs/timeLib";
import { useUser } from "../stores/useUser";
import ProfileImg from "./ProfileImg";
import ModifyAndDelete from "./ModifyAndDelete";
import Btn from "./atoms/Btn";
import { readDatasByQuery } from "../apis/fbRead";
import { deleteAll } from "../apis/fbDelete";
import { updateUser } from "../apis/fbUpdate";
import { mergeTailwindClasses } from "../apis/tailwind";

type IProfileProps = {
  user: IUser;
  info?: "time" | "intro";
  action?: "follow" | "modifyAndDelete";
  post?: IPost;
  className?: string;
};

export default function Profile({
  user,
  post,
  info,
  action,
  className,
}: IProfileProps) {
  const { curUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(() =>
    curUser.followings.find((elem: string) => elem === user.id) ? true : false
  );
  const router = useRouter();

  useEffect(() => {
    setIsFollowing(
      curUser.followings.find((elem) => elem === user.id) ? true : false
    );
  }, [curUser]);

  async function handleToggleFollow() {
    const curUserRef = doc(db, "users", curUser.id);
    const userRef = doc(db, "users", user.id);
    if (isFollowing) {
      await updateDoc(curUserRef, { followings: arrayRemove(user.id) });
      await updateDoc(userRef, {
        followers: arrayRemove(curUser.id),
      });
      const alarmRes = await readDatasByQuery<IAlarm>(
        query(
          collection(db, "alarms"),
          where("uid", "==", curUser.id),
          where("targetUid", "==", user.id)
        )
      );
      await deleteAll(alarmRes, "alarms");
    } else {
      await updateDoc(curUserRef, {
        followings: arrayUnion(user.id),
      });
      await updateDoc(userRef, {
        followers: arrayUnion(curUser.id),
      });
      const newAlarm: IAlarm = {
        id: "",
        uid: curUser.id,
        type: "follow",
        targetUid: user.id,
        createdAt: new Date(),
      };
      const ref = await addDoc(collection(db, "alarms"), newAlarm);
      await updateDoc(ref, { id: ref.id });
    }
    const tempFollowings = new Set(curUser.followings);
    if (isFollowing) {
      tempFollowings.delete(user.id);
    } else {
      tempFollowings.add(user.id);
    }
    const followings = Array.from(tempFollowings) as string[];
    updateUser({ id: curUser.id, followings: followings });
    setIsFollowing(!isFollowing);
  }

  return (
    <>
      <div
        className={mergeTailwindClasses(
          "flex items-center justify-between w-full mt-2 mb-2",
          className || ""
        )}
      >
        <div className="flex items-center">
          <ProfileImg
            size="sm"
            photoURL={user.photoURL}
            onClick={() => router.push(`/profile/${user.id}`)}
          />
          <div className="ml-1">
            <Link href={`/profile/${user?.id}`} legacyBehavior>
              <a className="text-sm font-bold text-black">
                {user?.displayName}
              </a>
            </Link>
            {info === "time" && (
              <div className="text-xs -translate-y-[2px] text-gray-1">
                {post && displayCreatedAt(post?.createdAt)}
              </div>
            )}
            {info === "intro" && (
              <div className="w-full overflow-hidden text-xs whitespace-pre-wrap -translate-y-[2px] text-gray-1 text-ellipsis">
                {user.txt}
              </div>
            )}
          </div>
        </div>
        {action === "follow" &&
          (isFollowing ? (
            <Btn
              label="팔로잉"
              onClick={handleToggleFollow}
              isActive={false}
              size="sm"
            />
          ) : (
            <Btn label="팔로우" onClick={handleToggleFollow} size="sm" />
          ))}
        {action === "modifyAndDelete" && <ModifyAndDelete post={post} />}
      </div>
    </>
  );
}
