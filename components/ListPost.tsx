import { RiHashtag } from "react-icons/ri";
import { POST_PER_PAGE, useStore } from "../apis/zustand";
import { IRoute, IPost, IType, IDict, ITag, SIZE, getRoute } from "../custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import MotionFloat from "../motions/motionFloat";
import Box from "./Box";
import Loader from "./Loader";
import PostFeed from "./PostFeed";
import Link from "next/link";
import { useRouter } from "next/router";
import Cont from "./Cont";
import { HiArrowLeft, HiX } from "react-icons/hi";
import LinkScroll from "./LinkScroll";

interface IListPostProps {
  posts: IPost[];
  handleIntersect: Function;
  handleChange: Function;
  changeListener: any;
  option?: IListPostOption;
}

interface IListPostOption {
  includeProfile?: boolean;
  preserveScroll?: boolean;
  numCols?: number;
}

export default function ListPost({
  posts,
  handleIntersect,
  handleChange,
  changeListener,
  option = {
    includeProfile: false,
    preserveScroll: false,
    numCols: 1,
  },
}: IListPostProps) {
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect,
    handleChange,
    changeListener,
  });

  const PostWithProfile = (e: IPost, i: number) => (
    <>
      <PostFeed post={e} user={e.author || null} key={e.id} />
      {i === posts.length - 1 && <div ref={setLastIntersecting}></div>}
    </>
  );

  return (
    <>
      {option.includeProfile ? (
        <>
          {posts.map((e, i) =>
            option.preserveScroll ? (
              <LinkScroll key={i}>{PostWithProfile(e, i)}</LinkScroll>
            ) : (
              <>{PostWithProfile(e, i)}</>
            )
          )}
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      ) : (
        <>
          <div className="grid mt-4 mb-16 gap-y-2 gap-x-2" id={"d1"}>
            {posts.map((e, i) => (
              <>
                <div>
                  <Box post={{ ...e, id: e.id }} key={e.id}></Box>
                </div>
                {i === posts.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            ))}
          </div>
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
      <style jsx>
        {`
          #d1 {
            grid-column: ${option.numCols};
          }
        `}
      </style>
    </>
  );
}
