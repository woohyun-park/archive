import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  useEffect,
  useState,
} from "react";
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

interface IListProps {
  data: IPost[] | ITag[] | IDict<IPost[]>;
  type: IType;
  handleIntersect?: Function;
  handleChange?: Function;
  changeListener?: any;
}

export default function List({ data, type, handleChange }: IListProps) {
  const [loading, setLoading] = useState(false);
  const {
    gSetPage,
    gPage,
    gSetSearch,
    gSetFeed,
    gCurUser,
    gStatus,
    gFeed,
    gSearch,
  } = useStore();
  const router = useRouter();
  const route = getRoute(router);
  const loadingRef =
    route === "feed"
      ? [gPage.feed.post, gFeed]
      : route === "search" && type === "post"
      ? [gPage.sPost, gSearch.posts]
      : route === "search" && type === "tag"
      ? [gPage.search.tag, gSearch.tags]
      : route === "profile" && type === "tag"
      ? []
      : [];
  const { setLastIntersecting } = useInfiniteScroll({
    handleIntersect:
      route === "feed"
        ? () => gSetPage("feed", "post", gPage.feed.post + 1)
        : route === "search" && type === "post"
        ? () => gSetPage("search", "post", gPage.search.post + 1)
        : route === "search" && type === "tag"
        ? () => gSetPage("search", "tag", gPage.search.tag + 1)
        : route === "profile" && type === "tag"
        ? () => gSetPage("profile", "tag", gPage.profile.tag + 1)
        : () => {},
    handleChange:
      route === "feed"
        ? () => gSetFeed(gCurUser.id, gPage.feed.post)
        : route === "search" && type === "post"
        ? () => gSetSearch("posts", gPage.search.post)
        : route === "search" && type === "tag"
        ? () => gSetSearch("tags", gPage.search.tag, gStatus.keyword)
        : route === "profile" && type === "tag"
        ? () => handleChange && handleChange()
        : () => {},
    changeListener:
      route === "feed"
        ? gPage.feed.post
        : route === "search" && type === "post"
        ? gPage.search.post
        : route === "search" && type === "tag"
        ? gPage.search.tag
        : route === "profile" && type === "tag"
        ? gPage.profile.tag
        : null,
  });
  const [selected, setSelected] = useState("");

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
              {i === (data as IPost[]).length - 1 && (
                <div ref={setLastIntersecting}></div>
              )}
            </>
          ))}
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
      {route === "search" && type === "post" && (
        <>
          <div className="grid grid-cols-3 mt-4 mb-16 gap-y-2 gap-x-2">
            {(data as IPost[]).map((e, i) => (
              <>
                <div>
                  <Box post={{ ...e, id: e.id }} key={e.id}></Box>
                </div>
                {i === (data as IPost[]).length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            ))}
          </div>
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
      {route === "search" && type === "tag" && (
        <>
          <div className="grid mb-8">
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
                {i === (data as ITag[]).length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            ))}
          </div>
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
      {route === "profile" &&
        type === "tag" &&
        (selected === "" ? (
          <>
            <div className="grid grid-cols-3 mt-4 mb-24 gap-y-2 gap-x-2">
              {(() => {
                const result: JSX.Element[] = [];
                const arr = [...Object.entries(data)].slice(
                  0,
                  gPage.profile.tag * POST_PER_PAGE.profile.tag
                );
                arr.forEach(([tag, posts], i) => {
                  result.push(
                    <Cont
                      tag={tag}
                      posts={posts}
                      type="tag"
                      onClick={() => setSelected(tag)}
                    />
                  );
                  i === arr.length - 1 &&
                    result.push(<div ref={setLastIntersecting}></div>);
                });
                return result;
              })()}
              <div className="flex justify-center">{loading && <Loader />}</div>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 mt-4 mb-24 gap-y-2 gap-x-2">
              <HiArrowLeft size={SIZE.icon} onClick={() => setSelected("")} />
              <div></div>
              <div></div>
              {(data as IDict<IPost[]>)[selected].map((e, i) => (
                <>
                  <Box post={{ ...e, id: e.id }} key={e.id}></Box>
                  {i === (data as IDict<IPost[]>)[selected].length - 1 && (
                    <div ref={setLastIntersecting}></div>
                  )}
                </>
              ))}
              <div className="flex justify-center">{loading && <Loader />}</div>
            </div>
          </>
        ))}
    </>
  );
}
