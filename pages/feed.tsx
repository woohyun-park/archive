import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { useFeed } from "../stores/useFeed";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import ProfileImg from "../components/ProfileImg";
import BtnIcon from "../components/atoms/BtnIcon";
import InputIcon from "../components/atoms/InputIcon";
import { debounce } from "lodash";
import Page from "../components/Page";
import WrapScroll from "../components/wrappers/WrapScroll";
import WrapLink from "../components/wrappers/WrapLink";
import PagePosts from "../components/PagePosts";

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
  const { scroll, keywords, setScroll, setKeywords, setModalLoader } =
    useStatus();

  const router = useRouter();
  const [filterLoading, setFilterLoading] = useState(false);
  const [resetFilter, setResetFilter] = useState<boolean | null>(null);

  const keyword = keywords[router.asPath] || "";

  useEffect(() => {
    setModalLoader(false);
    setTimeout(() => {
      if (refresh) {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        setFilterLoading(true);
        setRefresh(false);
      } else {
        window.scrollTo(0, scroll[router.asPath]);
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
        await getPosts("refresh", curUser.id);
      } else {
        await getFilteredPosts("init", curUser.id, keyword);
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
              <BtnIcon icon="alarm" />
            </WrapLink>
            <WrapLink href={`/profile/${curUser.id}`} loader={true}>
              <ProfileImg size="sm" photoURL={curUser.photoURL} />
            </WrapLink>
          </div>
        </WrapScroll>
      </div>
      <InputIcon
        icon="filter"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          e.preventDefault();
          const keyword = e.target.value;
          if (keyword === "") {
            setFilteredPosts([]);
          } else if (keyword.slice(keyword.length - 1) !== " ") {
            setKeywords(router.asPath, keyword);
            setResetFilter(!resetFilter);
          }
        }}
        onDelete={() => {
          setKeywords(router.asPath, "");
          setResetFilter(!resetFilter);
          setFilteredPosts([]);
        }}
        keyword={keyword}
        placeholder={"찾고싶은 태그를 입력해보세요!"}
        style="margin-left: 1rem; margin-right: 1rem;"
      />
      <Loader isVisible={filterLoading} />
      {keyword.length === 0 ? (
        <Page
          page="feed"
          data={posts}
          onIntersect={() => getPosts("load", curUser.id)}
          onChange={() => {}}
          onRefresh={async () => {
            await getPosts("refresh", curUser.id);
          }}
          changeListener={posts}
        />
      ) : (
        <Page
          page="feed"
          data={filteredPosts}
          onIntersect={() => getFilteredPosts("load", curUser.id, keyword)}
          onChange={() => {}}
          onRefresh={async () => {
            await getFilteredPosts("refresh", curUser.id, keyword);
          }}
          changeListener={filteredPosts}
        />
      )}
      <div className="mb-24"></div>
    </div>
  );
}
