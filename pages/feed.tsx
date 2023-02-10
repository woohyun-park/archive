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
import PostBox from "../components/PostBox";
import WrapScroll from "../components/wrappers/WrapScroll";
import { useModal } from "../stores/useModal";

export default function Feed() {
  const router = useRouter();
  const { curUser } = useUser();
  const { posts, filteredPosts, getPosts, getFilteredPosts } = useFeed();
  const { keywords, setKeywords } = useKeyword();
  const keyword = keywords[router.pathname] || "";
  const [curPosts, setCurPosts] = useState(
    filteredPosts.length === 0 ? posts : filteredPosts
  );
  const { scroll } = useScrollSave();
  const [filterLoading, setFilterLoading] = useState(false);
  const [resetFilter, setResetFilter] = useState<boolean | null>(null);
  const { setModalLoader } = useModal();

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
    filteredPosts.length === 0
      ? setCurPosts(posts)
      : setCurPosts(filteredPosts);
  }, [posts]);

  useEffect(() => {
    debounce(() => {
      resetFilter !== null && setFilterLoading(true);
    }, 500)();
  }, [keyword]);

  useEffect(() => {
    async function filterPosts() {
      if (keyword.length === 0) {
        await getPosts(curUser.id, "refresh");
        setCurPosts(posts);
      } else {
        await getFilteredPosts(curUser.id, keyword);
        setCurPosts(filteredPosts);
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
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-4 pb-2">
        <h1
          className="hover:cursor-pointer title-logo"
          onClick={() => router.reload()}
        >
          archive
        </h1>
        <WrapScroll>
          <div className="flex items-center justify-center">
            <IconBtn
              icon="alarm"
              onClick={() => {
                setModalLoader(true);
                router.push("/alarm");
              }}
            />
            <ProfileImg
              size="sm"
              photoURL={curUser.photoURL}
              onClick={() => {
                setModalLoader(true);
                router.push(`/profile/${curUser.id}`);
              }}
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
        }}
        keyword={keyword}
        placeholder={"찾고싶은 태그를 입력해보세요!"}
        style="margin-left: 1rem; margin-right: 1rem;"
      />
      <Loader isVisible={filterLoading} />
      <PostBox
        type="feed"
        posts={curPosts}
        onIntersect={() => keyword.length === 0 && getPosts(curUser.id, "load")}
        onChange={() => {}}
        onRefresh={async () => {
          await getPosts(curUser.id, "refresh");
        }}
        changeListener={posts}
        additionalRefCondition={keyword.length === 0}
      />
      <div className="mb-24"></div>
    </div>
  );
}
