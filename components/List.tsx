import { useEffect, useState } from "react";
import { RiHashtag } from "react-icons/ri";
import { useStore } from "../apis/zustand";
import { IRoute, IPost, IType, IDict, ITag, SIZE } from "../custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import MotionFloat from "../motions/motionFloat";
import Box from "./Box";
import Loader from "./Loader";
import PostFeed from "./PostFeed";
import { motion } from "framer-motion";
import Link from "next/link";

interface IListProps {
  data: IPost[] | ITag[];
  route: IRoute;
  type: IType;
  handleIntersect?: Function;
  handleChange?: Function;
  changeListener?: any;
  loadingRef: [any, any];
}

export default function List({ data, route, type, loadingRef }: IListProps) {
  const [loading, setLoading] = useState(false);
  const { gSetPage, gPage, gSetSearch, gSetFeed, gCurUser, gStatus } =
    useStore();
  const { setLastIntersecting } = useInfiniteScroll({
    handleIntersect:
      route === "feed"
        ? () => gSetPage("feed", "post", gPage.feed.post + 1)
        : route === "search" && type === "post"
        ? () => gSetPage("search", "post", gPage.search.post + 1)
        : route === "search" && type === "tag"
        ? () => gSetPage("search", "tag", gPage.search.tag + 1)
        : () => {},
    handleChange:
      route === "feed"
        ? () => gSetFeed(gCurUser.id, gPage.feed.post)
        : route === "search" && type === "post"
        ? () => gSetSearch("posts", gPage.search.post)
        : route === "search" && type === "tag"
        ? () => gSetSearch("tags", gPage.search.tag, gStatus.keyword)
        : () => {},
    changeListener:
      route === "feed"
        ? gPage.feed
        : route === "search" && type === "post"
        ? gPage.search.post
        : route === "search" && type === "tag"
        ? gPage.search.tag
        : null,
  });

  useEffect(() => {
    setLoading(true);
  }, [loadingRef[0]]);

  useEffect(() => {
    setLoading(false);
  }, [loadingRef[1]]);

  return (
    <>
      {route === "feed" && (
        <>
          {(data as IPost[]).map((e, i) => (
            <>
              <PostFeed post={e} user={e.author || null} key={e.id} />
              {i === data.length - 1 && <div ref={setLastIntersecting}></div>}
            </>
          ))}
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
      {route === "search" && type === "post" && (
        <>
          <div className="grid grid-cols-3 mt-4 gap-y-2 gap-x-2">
            {(data as IPost[]).map((e, i) => (
              <>
                <div>
                  <Box post={{ ...e, id: e.id }} style={route} key={e.id}></Box>
                </div>
                {i === data.length - 1 && <div ref={setLastIntersecting}></div>}
              </>
            ))}
          </div>
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
      {route === "search" && type === "tag" && (
        <>
          <div className="grid">
            {(data as ITag[]).map((e, i) => (
              <>
                <MotionFloat>
                  <Link href={`tag/${e.name}`}>
                    <div className="flex items-center my-2 hover:cursor-pointer">
                      <div className="p-2 mr-2 rounded-full bg-gray-3 w-fit">
                        <RiHashtag size={SIZE.iconSmall} />
                      </div>
                      <div className="my-1 text-base text-left">{`#${e.name}`}</div>
                    </div>
                  </Link>
                </MotionFloat>
                {i === data.length - 1 && <div ref={setLastIntersecting}></div>}
              </>
            ))}
          </div>
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
    </>
  );
}
