import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db, getData, getPath } from "../../apis/firebase";
import { useStore } from "../../apis/zustand";
import Back from "../../components/Back";
import PostAction from "../../components/PostAction";
import ProfileSmall from "../../components/ProfileSmall";
import { IPost, IUser } from "../../custom";

interface IPostProps {
  initPost: IPost;
  initUser: IUser;
}

export default function Post({ initPost, initUser }: IPostProps) {
  const [post, setPost] = useState(initPost);
  const [user, setUser] = useState(initUser);
  const { curUser } = useStore();

  useEffect(() => {
    update();
  }, [curUser]);

  async function update() {
    if (post === null || user === null) {
      return;
    }
    const newPost = (await getData("posts", post.id)) as IPost;
    if (newPost === null) return;
    setPost(newPost);
    const newUser = (await getData("users", post.uid)) as IUser;
    setUser(newUser);
  }

  return (
    <>
      {post === null && user === null ? (
        <div>존재하지 않는 페이지입니다</div>
      ) : (
        <>
          <Back />
          {post?.imgs.length === 0 ? (
            <div className="bg"></div>
          ) : (
            <div className="imgCont">
              <img className="img" src={post?.imgs[0]} />
            </div>
          )}
          <ProfileSmall post={post} user={user} style="post" />
          <h1 className="title">{post?.title}</h1>
          <div className="tagCont">
            {post.tags.map((tag, i) => (
              <Link key={i} href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                <div className="mainTag g-button1">{`#${tag}`}</div>
              </Link>
            ))}
          </div>
          <div className="text">{post?.txt}</div>
          <PostAction post={post} style="post" />
        </>
      )}

      <style jsx>{`
        .imgCont {
          position: relative;
          width: calc(100% + 32px);
          max-width: 480px;
          transform: translateX(-16px);
          padding-bottom: calc(100% + 32px);
          overflow: hidden;
        }
        .img {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(50, 50);
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .bg {
          background-color: ${post?.color};
          width: calc(100% + 32px);
          padding-bottom: calc(50%);
          transform: translate(-16px);
        }
        .img {
          width: calc(100% + 32px);
          transform: translateX(-16px);
        }
        .title {
          word-break: keep-all;
          margin-bottom: 4px;
          font-size: 48px;
        }
        .tagCont {
          display: flex;
          justify-content: flex-end;
          width: 100%;
          margin-bottom: 32px;
        }
        .mainTag {
          margin-left: 4px;
          width: fit-content;
        }
        .text {
          margin-top: 8px;
          margin-bottom: 36px;
        }
        .mainTag:hover,
        .subTag:hover {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

interface IServerSidePaths {
  params: IServerSideProps;
}
interface IServerSideProps {
  id: string;
}

export async function getServerSidePaths() {
  const paths = await getPath("posts", "id");
  return { paths, fallback: false };
}

export async function getServerSideProps({ params }: IServerSidePaths) {
  const initPost = await getData("posts", params.id);
  if (initPost === null) return { props: { initPost, initUser: null } };
  const initUser = await getData("users", initPost.uid);
  return { props: { initPost, initUser } };
}
