import { IPost } from "../apis/def";
import Image from "next/image";
import Profile from "./Profile";
import Tags from "./Tags";
import useCustomRouter from "../hooks/useCustomRouter";
import { useStatus } from "../stores/useStatus";
import { useUser } from "providers";

interface IPostProps {
  post: IPost;
}

export default function Post({ post }: IPostProps) {
  const { data: curUser } = useUser();
  const { setModalLoader } = useStatus();

  const router = useCustomRouter();

  function Title() {
    return (
      <div
        className="p-4 text-5xl font-bold break-words hover:cursor-pointer w-fit"
        onClick={() => {
          router.asPath !== `/post/${post.id}` && setModalLoader(true);
          router.push(`/post/${post.id}`);
        }}
      >
        {post.title}
      </div>
    );
  }

  return (
    <>
      {post.author ? (
        <>
          {post.imgs.length === 0 ? (
            <div className="w-full pb-[50%]" id="post_d1"></div>
          ) : (
            <div className="relative pb-[100%] w-full overflow-hidden">
              <Image src={post.imgs[0]} alt="" className="object-cover" fill />
            </div>
          )}
          {curUser.id === post.uid ? (
            <Profile
              post={post}
              user={post.author}
              info="time"
              className="px-4"
            />
          ) : (
            <Profile
              post={post}
              user={post.author}
              info="time"
              action="follow"
              className="px-4"
            />
          )}
          <Title />
          <Tags tags={post.tags} className="px-4" />
          <div className="mx-4 mt-1 mb-4 whitespace-pre-wrap">{post.txt}</div>
        </>
      ) : (
        <></>
      )}
      <style jsx>{`
        #post_d1 {
          background-color: ${post.color};
        }
      `}</style>
    </>
  );
}
