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
import InfinitePage from "../components/InfinitePage";
import WrapScroll from "../components/wrappers/WrapScroll";
import ScrollTop from "../components/atoms/ScrollTop";

export default function Feed() {
  const router = useRouter();
  const { curUser } = useUser();
  const { posts, filteredPosts, getPosts, getFilteredPosts, setFilteredPosts } =
    useFeed();
  const { keywords, setKeywords } = useKeyword();
  const keyword = keywords[router.pathname] || "";
  const { scroll } = useScrollSave();
  const [filterLoading, setFilterLoading] = useState(false);
  const [resetFilter, setResetFilter] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (router.query.refresh) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setFilterLoading(true);
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    if (e.target.value.slice(e.target.value.length - 1) !== " ") {
      setKeywords(router.pathname, e.target.value);
      setResetFilter(!resetFilter);
    }
    if (e.target.value === "") {
      setFilteredPosts([]);
    }
  }

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
            <IconBtn icon="alarm" onClick={() => router.push("/alarm")} />
            <ProfileImg
              size="sm"
              photoURL={curUser.photoURL}
              onClick={() => router.push(`/profile/${curUser.id}`)}
            />
          </div>
        </WrapScroll>
      </div>
      <IconInput
        icon="filter"
        onChange={handleChange}
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
        <InfinitePage
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
        <InfinitePage
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
      <ScrollTop />
    </div>
  );
}
