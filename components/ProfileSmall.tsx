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
import { db, deleteEach, getDatasByQuery, updateUser } from "../apis/firebase";
import { getRoute, IAlarm, IPost, IType, IUser, SIZE } from "../libs/custom";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { displayCreatedAt } from "../libs/timeLib";
import { useUser } from "../stores/useUser";
import ProfileImg from "./atoms/ProfileImg";
import { useGlobal } from "../hooks/useGlobal";
import ActionAuthor from "./ActionAuthor";

type IProfileSmallProps = {
  user: IUser;
  post?: IPost;
  type: IType;
};

export default function ProfileSmall({ user, post }: IProfileSmallProps) {
  const { curUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(() =>
    curUser.followings.find((elem: string) => elem === user.id) ? true : false
  );
  const router = useRouter();
  const route = getRoute(router);

  const { deletePost } = useGlobal();

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
      const alarmRes = await getDatasByQuery(
        query(
          collection(db, "alarms"),
          where("uid", "==", curUser.id),
          where("targetUid", "==", user.id)
        )
      );
      await deleteEach(alarmRes, "alarms");
    } else {
      await updateDoc(curUserRef, {
        followings: arrayUnion(user.id),
      });
      await updateDoc(userRef, {
        followers: arrayUnion(curUser.id),
      });
      const newAlarm: IAlarm = {
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
      <div className="flex items-center justify-between w-full mt-2 mb-2">
        <div className="flex items-center">
          <ProfileImg
            size="sm"
            photoURL={user.photoURL}
            onClick={() => router.push(`/profile/${user.id}`)}
          />
          <div className="ml-1">
            <Link href={`/profile/${user?.id}`} legacyBehavior>
              <a className="text-sm text-black">{user?.displayName}</a>
            </Link>
            {route === "feed" || route === "post" ? (
              <div className="text-xs text-gray-1 -mt-[1px]">
                {displayCreatedAt(post?.createdAt)}
              </div>
            ) : (
              <div className="w-full overflow-hidden text-xs whitespace-pre-wrap text-gray-1 text-ellipsis">
                {user.txt}
              </div>
            )}
          </div>
        </div>
        {(() => {
          // TODO: 분기 확인해서 변경할것
          if (route === "post" || route === "search") {
            if (curUser.id === user.id) {
              return <></>;
            } else if (isFollowing) {
              return (
                <div
                  className="flex justify-center w-8 align-center"
                  onClick={handleToggleFollow}
                >
                  팔로잉
                </div>
              );
            } else {
              return (
                <div
                  className="flex justify-center w-8 text-white align-center bg-gray2"
                  onClick={handleToggleFollow}
                >
                  팔로우
                </div>
              );
            }
          } else if (user.id === curUser.id) {
            return <ActionAuthor post={post} />;
          } else {
            return <div></div>;
          }
        })()}
      </div>
    </>
  );
}
