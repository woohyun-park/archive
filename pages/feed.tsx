import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useFeed } from "../stores/useFeed";
import { useScrollSave } from "../stores/useScrollSave";
import { useUser } from "../stores/useUser";
import ProfileImg from "../components/atoms/ProfileImg";
import IconBtn from "../components/atoms/IconBtn";
import IconInput from "../components/atoms/IconInput";
import { debounce } from "lodash";
import { useKeyword } from "../stores/useKeyword";
import PageInfinite from "../components/PageInfinite";
import WrapScroll from "../components/wrappers/WrapScroll";
import { useModal } from "../stores/useModal";
import WrapLink from "../components/wrappers/WrapLink";

export default function Feed() {
  const { curUser } = useUser();
  const {
    posts,
    filteredPosts,
    refresh,
    getPosts,
    getFilteredPosts,
    setFilteredPosts,
    setRefresh,
  } = useFeed();
  const { keywords, setKeywords } = useKeyword();
  const { scroll } = useScrollSave();
  const { setModalLoader } = useModal();

  const router = useRouter();
  const [filterLoading, setFilterLoading] = useState(false);
  const [resetFilter, setResetFilter] = useState<boolean | null>(null);

  const keyword = keywords[router.pathname] || "";

  useEffect(() => {
    setModalLoader(false);
    setTimeout(() => {
      if (refresh) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setFilterLoading(true);
        setRefresh(false);
      } else {
        window.scrollTo(0, scroll[router.pathname]);
      }
    }, 10);
  }, []);

  useEffect(() => {
    debounce(() => {
      resetFilter !== null && setFilterLoading(true);
    }, 500)();
  }, [keyword]);

  useEffect(() => {
    async function filterPosts() {
      if (keyword.length === 0) {
        await getPosts(curUser.id, "refresh");
      } else {
        await getFilteredPosts(curUser.id, "init", keyword);
      }
      setFilterLoading(false);
    }
    filterPosts();
  }, [filterLoading]);

  return (
    <div className="relative flex flex-col">
      <div className="flex items-center justify-between px-4 pb-2">
        <h1
          className="hover:cursor-pointer title-logo"
          onClick={() => router.reload()}
        >
          archive
        </h1>
        <WrapScroll>
          <div className="flex items-center justify-center">
            <WrapLink href="/alarm" loader={true}>
              <IconBtn icon="alarm" />
            </WrapLink>
            <WrapLink href={`/profile/${curUser.id}`} loader={true}>
              <ProfileImg size="sm" photoURL={curUser.photoURL} />
            </WrapLink>
          </div>
        </WrapScroll>
      </div>
      <IconInput
        icon="filter"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          const keyword = e.target.value;
          if (keyword === "") {
            setFilteredPosts([]);
          } else if (keyword.slice(keyword.length - 1) !== " ") {
            setKeywords(router.pathname, keyword);
            setResetFilter(!resetFilter);
          }
        }}
        onDelete={() => {
          setKeywords(router.pathname, "");
          setResetFilter(!resetFilter);
          setFilteredPosts([]);
        }}
        keyword={keyword}
        placeholder={"찾고싶은 태그를 입력해보세요!"}
        style="margin-left: 1rem; margin-right: 1rem;"
      />
      <Loader isVisible={filterLoading} />
      {keyword.length === 0 ? (
        <PageInfinite
          page="feed"
          data={posts}
          onIntersect={() => getPosts(curUser.id, "load")}
          onChange={() => {}}
          onRefresh={async () => {
            await getPosts(curUser.id, "refresh");
          }}
          changeListener={posts}
        />
      ) : (
        <PageInfinite
          page="feed"
          data={filteredPosts}
          onIntersect={() => getFilteredPosts(curUser.id, "load", keyword)}
          onChange={() => {}}
          onRefresh={async () => {
            await getFilteredPosts(curUser.id, "refresh", keyword);
          }}
          changeListener={filteredPosts}
        />
      )}
      <div className="mb-24"></div>
    </div>
  );
}
