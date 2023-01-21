import Link from "next/link";
import { useRouter } from "next/router";
import { HiPencil, HiX } from "react-icons/hi";
import {
  db,
  deletePost,
  getData,
  getDatasByQuery,
  getPath,
} from "../../apis/firebase";
import Back from "../../components/Back";
import PostAction from "../../components/PostAction";
import ProfileSmall from "../../components/ProfileSmall";
import { IComment, ILike, IPost, IScrap, IUser, SIZE } from "../../custom";
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
          <div className="flex items-baseline justify-between">
            <Back />
            {gCurUser.id === initUser.id && (
              <div className="flex items-center pt-6 mt-12">
                <div className="hover:cursor-pointer" onClick={handleModify}>
                  <HiPencil size={SIZE.icon} />
                </div>
                <div className="hover:cursor-pointer" onClick={handleDelete}>
                  <HiX size={SIZE.icon} />
                </div>
              </div>
            )}
          </div>
          {initPost.imgs.length === 0 ? (
            <div
              className="w-[calc(100%+32px)] -translate-x-4 pb-[50%]"
              id="d1"
            ></div>
          ) : (
            <div className="relative pb-[100%] w-[calc(100%+32px)] -translate-x-4">
              <Image
                src={initPost.imgs[0]}
                alt=""
                className="object-cover"
                fill
              />
            </div>
          )}
          <ProfileSmall post={initPost} user={initUser} style="post" />
          <h1 className="mb-1 text-5xl">{initPost.title}</h1>
          <div className="flex flex-wrap justify-end w-full mb-8">
            {initPost.tags.map((tag, i) => (
              <Link key={i} href={{ pathname: `/tag/${tag}` }} legacyBehavior>
                <div className="mr-1 w-fit g-button1">{`#${tag}`}</div>
              </Link>
            ))}
          </div>
          <div className="mt-1 mb-4 whitespace-pre-wrap">{initPost.txt}</div>
          <PostAction post={initPost} style="post" />
        </>
      )}

      <style jsx>{`
        #d1 {
          background-color: ${initPost.color};
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
  const likes = await getDatasByQuery(
    query(collection(db, "likes"), where("pid", "==", id))
  );
  const scraps = await getDatasByQuery(
    query(collection(db, "scraps"), where("pid", "==", id))
  );
  const comments = await getDatasByQuery(
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
