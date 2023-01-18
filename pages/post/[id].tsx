import Link from "next/link";
import { useRouter } from "next/router";
import { HiPencil, HiX } from "react-icons/hi";
import {
  db,
  deletePost,
  getData,
  getDataByQuery,
  getPath,
} from "../../apis/firebase";
import Back from "../../components/Back";
import PostAction from "../../components/PostAction";
import ProfileSmall from "../../components/ProfileSmall";
import {
  DEFAULT,
  IComment,
  ILike,
  IPost,
  IScrap,
  IUser,
  SIZE,
} from "../../custom";
import { useStore } from "../../apis/zustand";
import Image from "next/image";
import { collection, orderBy, query, where } from "firebase/firestore";

interface IPostProps {
  initPost: IPost;
  initUser: IUser;
}

export default function Post({ initPost, initUser }: IPostProps) {
  const { gCurUser } = useStore();
  const router = useRouter();

  function handleModify() {
    router.push(
      {
        pathname: "/add",
        query: { post: JSON.stringify(initPost) },
      },
      "/modify"
    );
  }

  async function handleDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
      await deletePost(initPost?.id as string);
      alert("삭제되었습니다");
    } else {
      console.log(initPost);
    }
    router.push("/");
  }

  return (
    <>
      {initPost === null && initUser === null ? (
        <div>존재하지 않는 페이지입니다</div>
      ) : (
        <>
          <div className="topCont">
            <Back style="post" />
            {gCurUser.id === initUser.id && (
              <div className="actionCont">
                <div className="svg" onClick={handleModify}>
                  <HiPencil size={SIZE.icon} />
                </div>
                <div className="svg" onClick={handleDelete}>
                  <HiX size={SIZE.icon} />
                </div>
              </div>
            )}
          </div>
          {initPost.imgs.length === 0 ? (
            <div className="bg"></div>
          ) : (
            <div className="imgCont">
              <div className="img">
                <Image src={initPost.imgs[0]} alt={DEFAULT.img.alt} fill />
              </div>
            </div>
          )}
          <ProfileSmall post={initPost} user={initUser} style="post" />
          <h1 className="title">{initPost.title}</h1>
          <div className="tagCont">
            {initPost.tags.map((tag, i) => (
              <Link key={i} href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                <div className="mainTag g-button1">{`#${tag}`}</div>
              </Link>
            ))}
          </div>
          <div className="text">{initPost.txt}</div>
          <PostAction post={initPost} style="post" />
        </>
      )}

      <style jsx>{`
        .topCont {
          display: flex;
        }
        .actionCont {
          display: flex;
          align-items: center;
          padding-top: 48px;
        }
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
          background-color: ${initPost && initPost.color};
          width: calc(100% + 32px);
          padding-bottom: calc(50%);
          transform: translate(-16px);
        }
        .img {
          width: calc(100% + 32px);
          transform: translateX(-16px);
        }
        .title {
          margin-bottom: 4px;
          font-size: 48px;
        }
        .tagCont {
          display: flex;
          justify-content: flex-end;
          flex-wrap: wrap;
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
          white-space: pre-wrap;
        }
        .svg:hover,
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
  const initPost = await getData<IPost>("posts", params.id);
  if (initPost === null)
    return {
      props: {
        initPost,
        initUser: null,
        initLikes: null,
        initComments: null,
        initScraps: null,
      },
    };
  const initUser = await getData<IUser>("users", initPost.uid as string);

  const id = initPost.id as string;
  const likes = await getDataByQuery(
    query(collection(db, "likes"), where("pid", "==", id))
  );
  const scraps = await getDataByQuery(
    query(collection(db, "scraps"), where("pid", "==", id))
  );
  const comments = await getDataByQuery(
    query(
      collection(db, "comments"),
      where("pid", "==", id),
      orderBy("createdAt", "desc")
    )
  );

  initPost.likes = likes ? (likes as ILike[]) : [];
  initPost.scraps = scraps ? (scraps as IScrap[]) : [];
  initPost.comments = comments ? (comments as IComment[]) : [];
  return { props: { initPost, initUser } };
}
