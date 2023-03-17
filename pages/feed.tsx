import React, { useEffect, useState } from "react";
import { useUser } from "../stores/useUser";
import ProfileImg from "../components/ProfileImg";
import BtnIcon from "../components/atoms/BtnIcon";
import InputIcon from "../components/atoms/InputIcon";
import { debounce } from "lodash";
import PagePosts from "../components/PagePosts";
import { createHash } from "crypto";
import { useLoading } from "../hooks/useLoading";
import useCustomRouter from "../hooks/useCustomRouter";
import { useScrollBack } from "../hooks/useScrollBack";

export default function Feed() {
  const [tag, setTag] = useState("");
  const [debounceTag, setDebounceTag] = useState("");

  const router = useCustomRouter();
  const { curUser, hasNewAlarms } = useUser();

  useLoading(["posts"]);
  useScrollBack();

  // tag가 바뀔때마다 서버에 요청을 보내지 않도록 debounceTag라는 state을 따로 만들어놓고,
  // tag가 바뀔때마다 debounce를 사용하여 debounceTag를 set하도록 만들었다.
  // 따라서 tag를 사용하는 부분(PagePosts)에서는 debounceTag를 사용한다.
  useEffect(() => {
    debounce(() => {
      setDebounceTag(tag);
    }, 500)();
  }, [tag]);

  // 피드의 게시물들을 cache에 "posts"라는 key로 저장하는데,
  // 만약 피드를 tag로 필터한 게시물들을 cache에 각 tag를 key로 사용해서 저장하게 되면 "posts"라는 tag로 검색할때에는 중복이 일어날 수 있으므로,
  // 아래 hash 함수를 사용해서 tag로 필터된 게시물들을 cache에 저장할 때 해쉬된 값을 key로 사용하도록 한다.
  function hash(key: string) {
    const hash = createHash("sha256");
    hash.update(key);
    return hash.digest("hex");
  }

  return (
    <div className="relative flex flex-col mt-4 bg-white">
      <div className="flex items-center justify-between px-4 pb-2">
        <h1
          className="hover:cursor-pointer title-logo"
          onClick={() => router.reload()}
        >
          archive
        </h1>
        <div className="flex items-center justify-center">
          <BtnIcon
            icon="alarm"
            fill={hasNewAlarms ? true : false}
            onClick={() => router.push("/alarm")}
          />
          <ProfileImg
            size="sm"
            photoURL={curUser.photoURL}
            onClick={() => router.push(`/profile/${curUser.id}`)}
          />
        </div>
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
          paddingBottom="pb-24"
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
    </div>
  );
}
