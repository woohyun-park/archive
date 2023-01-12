import { signOut } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  auth,
  db,
  getData,
  getDataByQuery,
  getPath,
} from "../../apis/firebase";
import List from "../../components/List";
import { COLOR, IDict, IPost, IUser, SIZE } from "../../custom";
import { HiOutlineCog } from "react-icons/hi";
import { useStore } from "../../apis/zustand";
import Link from "next/link";
import { useEffect, useState } from "react";

interface IProfileProps {
  initUser: IUser;
  initPosts: IPost[];
  initScraps: IPost[];
  initTags: IDict<IPost[]>;
}

export default function Profile({
  initUser,
  initPosts,
  initScraps,
  initTags,
}: IProfileProps) {
  if (!initUser) return <div>존재하지 않는 페이지입니다</div>;

  const { curUser, setCurUser, updateCurUser } = useStore();
  // const [user, setUser] = useState<IUser>(initUser);
  // const [posts, setPosts] = useState(initPosts);
  // const [scraps, setScraps] = useState(initScraps);
  // const [tags, setTags] = useState(initTags);
  const [isFollowing, setIsFollowing] = useState(() =>
    curUser.followings.find((elem) => elem === initUser.id) ? true : false
  );

  // useEffect(() => {
  //   update();
  // }, [curUser]);

  // async function update() {
  //   if (curUser.id === user.id) {
  //     setUser(curUser);
  //     return;
  //   }
  //   const newUser = (await getData("users", user.id)) as IUser;
  //   setUser(newUser);
  // }
  async function handleToggleFollow() {
    const curUserRef = doc(db, "users", curUser.id);
    const userRef = doc(db, "users", initUser.id || "");
    if (isFollowing) {
      await updateDoc(curUserRef, { followings: arrayRemove(initUser.id) });
      await updateDoc(userRef, {
        followers: arrayRemove(curUser.id),
      });
    } else {
      await updateDoc(curUserRef, {
        followings: arrayUnion(initUser.id),
      });
      await updateDoc(userRef, {
        followers: arrayUnion(curUser.id),
      });
    }

    const tempFollowings = new Set(curUser.followings);
    if (isFollowing) {
      tempFollowings.delete(initUser.id || "");
    } else {
      tempFollowings.add(initUser.id || "");
    }
    const followings = Array.from(tempFollowings) as string[];
    setCurUser({ ...curUser, followings });
    updateCurUser({ ...curUser, followings });

    setIsFollowing(!isFollowing);
  }

  return (
    <>
      <>
        {initUser.id === curUser.id && (
          <div className="settingCont">
            <Link href="/setting" legacyBehavior>
              <div className="setting">
                <HiOutlineCog size={SIZE.icon} />
              </div>
            </Link>
          </div>
        )}
        <div className="profileTopCont">
          <div className="profileLeftCont">
            <h1>{initUser.displayName}</h1>
            <div className="profileInfoCont">
              <div>
                <div className="profileType">아카이브</div>
                <div className="profileNum">{initPosts.length}</div>
              </div>
              <div>
                <div className="profileType">팔로워</div>
                <div className="profileNum">{initUser.followers.length}</div>
              </div>
              <div>
                <div className="profileType">팔로잉</div>
                <div className="profileNum">{initUser.followings.length}</div>
              </div>
            </div>
          </div>
          <img className="profileImage" src={initUser.photoURL} />
        </div>
        {(() => {
          const result = [];
          if (curUser.id !== initUser.id) {
            if (curUser.followings.find((elem) => elem === initUser.id)) {
              result.push(
                <button onClick={handleToggleFollow} className="g-button2">
                  팔로잉
                </button>
              );
            } else {
              result.push(
                <button onClick={handleToggleFollow} className="g-button1">
                  팔로우
                </button>
              );
            }
          }
          return result;
        })()}
        <div className="profileTxtCont">{initUser.txt}</div>
        {initUser.id === curUser.id ? (
          <>
            <button onClick={() => signOut(auth)} className="g-button1">
              로그아웃
            </button>
          </>
        ) : (
          <></>
        )}
        <List
          data={{ grid: initPosts, tag: initTags, scrap: initScraps }}
          style="profile"
        />
      </>

      <style jsx>
        {`
          h1 {
            margin-top: 0;
            word-break: break-all;
          }
          .settingCont{
            display:flex;
            justify-content: flex-end;
          }
          .setting{
            display: flex;
            justify-content: flex-end;
            color:${COLOR.txt1};
          }
          .profileTopCont {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-top: 64px;
          }
          .profileTxtCont {
            max-height: 128px;
            height: 100%;
            padding: 32px 0;
            word-break: break-all;
          }
          .profileLeftCont {
            width: 70%;
          }
          .profileInfoCont {
            display: flex;
            justify-content: space-between;
            width: 70%;
          }
          .profileImage {
            border-radius: 72px;
            width: 96px;
            height: 96px;
            object-fit: cover;
          }
          .profileType {
            color: ${COLOR.txt3};s
          }
          .setting:hover{
            cursor:pointer;
          }
        `}
      </style>
    </>
  );
}

interface IServerSidePaths {
  params: IServerSideProps;
}

interface IServerSideProps {
  uid: string;
}

export async function getServerSidePaths() {
  const paths = getPath("users", "uid");
  return { paths, fallback: false };
}

export async function getServerSideProps({ params }: IServerSidePaths) {
  const uid = params.uid;
  const initUser = await getData("users", uid);
  const initPosts = await getDataByQuery("posts", "uid", "==", uid);
  const initScraps = await getDataByQuery("posts", "uid", "==", uid);
  const initTags = await getDataByQuery("posts", "uid", "==", uid);

  return { props: { initUser, initPosts, initScraps, initTags } };
}

// export async function getServerSideProps({ params }: IServerSidePaths) {
//   const deletedPosts = new Set();

//   const uid = params.uid;

//   const initUser = (await getData("users", uid)) as IUser;
//   if (initUser === null) {
//     return {
//       props: { initUser, initPosts: null, initScraps: null, initTags: null },
//     };
//   }

//   const postRef = collection(db, "posts");
//   const postSnap = await getDocs(
//     query(postRef, where("uid", "==", params.uid))
//   );
//   const initPosts: IPost[] = [];
//   postSnap.forEach((doc) => {
//     if (doc.data().isDeleted) {
//       deletedPosts.add(doc.data().id);
//       return;
//     }
//     initPosts.push({
//       ...(doc.data() as IPost),
//       createdAt: doc.data().createdAt.toDate(),
//       id: doc.id,
//     });
//   });

//   // scraps가 []인 경우에는 where()에서 "in"을 사용할 시 에러가 나므로 아래와 같이 분기해서 처리한다.
//   let initScraps: IPost[];
//   if (initUser.scraps.length === 0) {
//     initScraps = [];
//   } else {
//     initScraps = [];
//     const scrapSnap = await getDocs(
//       query(postRef, where("id", "in", initUser.scraps))
//     );
//     scrapSnap.forEach((doc) => {
//       if (doc.data().isDeleted) {
//         deletedPosts.add(doc.data().id);
//         return;
//       }
//       initScraps.push({
//         ...(doc.data() as IPost),
//         createdAt: doc.data().createdAt.toDate(),
//         id: doc.id,
//       });
//     });
//   }

//   let initTags: IDict<IPost[]> = {};
//   const user: IDict<string[]> = initUser.tags as IDict<string[]>;
//   for (const tag in user) {
//     if (user[tag].length !== 0) {
//       const tagSnap = await getDocs(
//         query(postRef, where("id", "in", user[tag]))
//       );
//       const tagPosts: IPost[] = [];
//       tagSnap.forEach((doc) => {
//         if (doc.data().isDeleted) {
//           deletedPosts.add(doc.data().id);
//           return;
//         }
//         tagPosts.push({
//           ...(doc.data() as IPost),
//           createdAt: doc.data().createdAt.toDate(),
//           id: doc.id,
//         });
//       });
//       initTags[tag] = tagPosts;
//     }
//   }

//   console.log(deletedPosts);
//   const toDelete = Array.from(deletedPosts);

//   if (toDelete.length === 0) {
//     return { props: { initUser, initPosts, initScraps, initTags } };
//   }

//   // Delete deleted comments
//   const commentRef = collection(db, "comments");
//   const commentSnap = getDocs(
//     query(commentRef, where("target", "in", toDelete))
//   );
//   (await commentSnap).forEach((each) => {
//     console.log(each.id);
//     deleteDoc(doc(db, "comments", each.id));
//   });

//   // Delete deleted posts from likes, posts, scraps, and tags of user
//   const tempLikes = [...initUser.likes].filter(
//     (each) => !toDelete.includes(each)
//   );
//   const tempPosts = [...initUser.posts].filter(
//     (each) => !toDelete.includes(each)
//   );
//   const tempScraps = [...initUser.scraps].filter(
//     (each) => !toDelete.includes(each)
//   );
//   const tempTags: IDict<string[]> = {};
//   const tags = initUser.tags as IDict<string[]>;
//   for (const tag in tags) {
//     const arr = [...initUser.tags[tag]].filter(
//       (each) => !toDelete.includes(each)
//     );
//     if (arr.length === 0) {
//     } else {
//       tempTags[tag] = arr;
//     }
//   }
//   const userRef = doc(db, "users", uid);
//   await updateDoc(userRef, {
//     likes: tempLikes,
//     posts: tempPosts,
//     scraps: tempScraps,
//     tags: tempTags,
//   });

//   return { props: { initUser, initPosts, initScraps, initTags } };
// }
