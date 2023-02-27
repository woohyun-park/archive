import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useUser } from "../stores/useUser";
import ProfileImg from "../components/ProfileImg";
import BtnIcon from "../components/atoms/BtnIcon";
import InputIcon from "../components/atoms/InputIcon";
import { debounce } from "lodash";
import WrapScroll from "../components/wrappers/WrapScroll";
import WrapLink from "../components/wrappers/WrapLink";
import PagePosts from "../components/PagePosts";
import { createHash } from "crypto";

export default function Feed() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [debounceTag, setDebounceTag] = useState("");

  const { curUser } = useUser();

  useEffect(() => {
    debounce(() => {
      setDebounceTag(tag);
    }, 500)();
  }, [tag]);

  function hash(key: string) {
    const hash = createHash("sha256");
    hash.update(key);
    return hash.digest("hex");
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
          const newTag = e.target.value;
          if (newTag.slice(newTag.length - 1) !== " ") {
            setTag(newTag);
          }
        }}
        onDelete={() => {
          setTag("");
        }}
        keyword={tag}
        placeholder={"찾고싶은 태그를 입력해보세요!"}
        style="margin-left: 1rem; margin-right: 1rem;"
      />
      {tag.length === 0 ? (
        <PagePosts
          query={{
            type: "follow",
            value: {
              follow: [...curUser.followings, curUser.id],
            },
          }}
          as="posts"
          numCols={1}
        />
      ) : (
        <PagePosts
          key={hash(debounceTag)}
          query={{
            type: "followAndTag",
            value: {
              follow: [...curUser.followings, curUser.id],
              tag,
            },
          }}
          as={hash(debounceTag)}
          numCols={1}
        />
      )}
      <div className="mb-24"></div>
    </div>
  );
}
