import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import { IPage, IPost, IType } from "../custom";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Box from "./Box";
import Loader from "./Loader";
import PostFeed from "./PostFeed";

interface IListProps {
  data: IPost[];
  page: IPage;
  type: IType;
  loadingRef: [any, any];
}

export default function List({ data, page, type, loadingRef }: IListProps) {
  const [loading, setLoading] = useState(false);
  const { gSetPage, gPage, gSetSearch, gSetFeed, gCurUser } = useStore();
  const { setLastIntersecting } = useInfiniteScroll({
    handleIntersect:
      page === "feed"
        ? () => gSetPage("feed", gPage.feed + 1)
        : page === "search" && type === "post"
        ? () => gSetPage("sPost", gPage.sPost + 1)
        : () => {},
    handleChange:
      page === "feed"
        ? () => gSetFeed(gCurUser.id, gPage.feed)
        : page === "search" && type === "post"
        ? () => gSetSearch("posts", gPage.sPost)
        : () => {},
    changeListener:
      page === "feed"
        ? gPage
        : page === "search" && type === "post"
        ? gPage
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
      {page === "feed" && (
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
      {page === "search" && type === "post" && (
        <>
          <div className="grid grid-cols-3 mt-4 gap-y-2 gap-x-2">
            {(data as IPost[]).map((e, i) => (
              <>
                <div>
                  <Box post={{ ...e, id: e.id }} style={page} key={e.id}></Box>
                </div>
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
