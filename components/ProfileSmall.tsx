import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { db, updateUser } from "../apis/firebase";
import { useStore } from "../apis/zustand";
import { COLOR, DEFAULT, IPost, IStyle, IUser } from "../custom";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Delete from "./Delete";
import Modify from "./Modify";
import TIME from "../apis/time";

type IProfileSmallProps = {
  user: IUser;
  post?: IPost;
  style: IStyle;
};

export default function ProfileSmall({
  user,
  style,
  post,
}: IProfileSmallProps) {
  const { gCurUser } = useStore();
  const [isFollowing, setIsFollowing] = useState(() =>
    gCurUser.followings.find((elem) => elem === user.id) ? true : false
  );
  const router = useRouter();

  useEffect(() => {
    setIsFollowing(
      gCurUser.followings.find((elem) => elem === user.id) ? true : false
    );
  }, [gCurUser]);

  async function handleToggleFollow() {
    const gCurUserRef = doc(db, "users", gCurUser.id);
    const userRef = doc(db, "users", user.id);
    if (isFollowing) {
      await updateDoc(gCurUserRef, { followings: arrayRemove(user.id) });
      await updateDoc(userRef, {
        followers: arrayRemove(gCurUser.id),
      });
    } else {
      await updateDoc(gCurUserRef, {
        followings: arrayUnion(user.id),
      });
      await updateDoc(userRef, {
        followers: arrayUnion(gCurUser.id),
      });
    }
    const tempFollowings = new Set(gCurUser.followings);
    if (isFollowing) {
      tempFollowings.delete(user.id);
    } else {
      tempFollowings.add(user.id);
    }
    const followings = Array.from(tempFollowings) as string[];
    updateUser({ id: gCurUser.id, followings: followings });
    setIsFollowing(!isFollowing);
  }

  return (
    <>
      <div
        className="flex items-center justify-between w-full"
        id={`d1-${style}`}
      >
        <div className="flex items-center">
          <div className="mr-1 profileImg-small">
            <Link href={`/profile/${user?.id}`}>
              <Image src={user.photoURL} alt="" fill />
            </Link>
          </div>
          <div>
            <Link href={`/profile/${user?.id}`} legacyBehavior>
              <a className="text-sm text-black">{user?.displayName}</a>
            </Link>
            {style === "feed" || style === "post" ? (
              <div className="text-xs text-gray-1 -mt-[1px]">
                {TIME.displayCreatedAt(post?.createdAt)}
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
          if (style === "post" || style === "search") {
            if (gCurUser.id === user.id) {
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
          } else if (user.id === gCurUser.id) {
            return (
              <>
                <div className="flex">
                  <Modify post={post as IPost} />
                  <Delete id={post?.id || ""} />
                </div>
              </>
            );
          } else {
            return <div></div>;
          }
        })()}
      </div>

      <style jsx>
        {`
          #d1-post,
          #d1-feed {
            margin: 32px 0 8px 0;
          }
        `}
      </style>
    </>
  );
}
