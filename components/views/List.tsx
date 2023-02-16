import { Children, useState } from "react";
import { RiHashtag } from "react-icons/ri";
import { POST_PER_PAGE, useStore } from "../../stores/useStore";
import { IRoute, IPost, IType, IDict, ITag, SIZE } from "../../libs/custom";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import WrapMotion from "../wrappers/WrapMotion";
import PostBox from "../PostBox";
import Loader from "../Loader";
import Link from "next/link";
import Cont from "../Cont";
import { HiArrowLeft } from "react-icons/hi";

interface IListProps {
  data: IPost[] | ITag[] | IDict<IPost[]>;
  type: IType;
  route: IRoute;
  handleIntersect?: Function;
  handleChange?: Function;
  changeListener?: any;
}

export default function List({ data, type, route, handleChange }: IListProps) {
  const { gSetPage, gPage, gSetSearch, gStatus } = useStore();
  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect:
      route === "search" && type === "tag"
        ? () => gSetPage("search", "tag", gPage.search.tag + 1)
        : route === "profile" && type === "tag"
        ? () => gSetPage("profile", "tag", gPage.profile.tag + 1)
        : () => {},
    handleChange:
      route === "search" && type === "tag"
        ? () => gSetSearch("tags", gPage.search.tag, gStatus.keyword)
        : route === "profile" && type === "tag"
        ? () => handleChange && handleChange()
        : () => {},
    changeListener:
      route === "search" && type === "tag"
        ? gPage.search.tag
        : route === "profile" && type === "tag"
        ? gPage.profile.tag
        : null,
  });
  const [selected, setSelected] = useState("");

  return (
    <>
      {route === "search" && type === "tag" && (
        <>
          <div className="grid mb-8">
            {Children.toArray(
              (data as ITag[]).map((e, i) => (
                <>
                  <WrapMotion type="float">
                    <Link href={`tag/${e.name}`}>
                      <div className="flex items-center my-2 hover:cursor-pointer">
                        <div className="p-2 mr-2 rounded-full bg-gray-3 w-fit">
                          <RiHashtag size={SIZE.iconSm} />
                        </div>
                        <div className="my-1 text-base text-left">{`#${e.name}`}</div>
                      </div>
                    </Link>
                  </WrapMotion>
                  {i === (data as ITag[]).length - 1 && (
                    <div ref={setLastIntersecting}></div>
                  )}
                </>
              ))
            )}
          </div>
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      )}
      {route === "profile" &&
        (type === "tag" || type === "scrap") &&
        (selected === "" ? (
          <>
            <div className="grid grid-cols-3 mt-4 mb-24 gap-y-2 gap-x-2">
              {(() => {
                const result: JSX.Element[] = [];
                const arr = [...Object.entries(data)].slice(
                  0,
                  gPage.profile[type] * POST_PER_PAGE.profile[type]
                );
                arr.forEach(([each, posts], i) => {
                  result.push(
                    <Cont
                      tag={each}
                      posts={posts}
                      type={type}
                      onClick={() => setSelected(each)}
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
              <HiArrowLeft
                className="hover:cursor-pointer"
                size={SIZE.icon}
                onClick={() => setSelected("")}
              />
              <div></div>
              <div></div>
              {Children.toArray(
                (data as IDict<IPost[]>)[selected].map((e, i) => (
                  <>
                    <PostBox post={{ ...e, id: e.id }} includeTitle></PostBox>
                    {i === (data as IDict<IPost[]>)[selected].length - 1 && (
                      <div ref={setLastIntersecting}></div>
                    )}
                  </>
                ))
              )}
              <div className="flex justify-center">{loading && <Loader />}</div>
            </div>
          </>
        ))}
    </>
  );
}
