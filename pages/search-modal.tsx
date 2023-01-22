import List from "../components/List";
import { IPost, IUser, SIZE } from "../custom";
import { HiSearch, HiX } from "react-icons/hi";
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../apis/zustand";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { db, getDatasByQuery, updateUser } from "../apis/firebase";
import { useRouter } from "next/router";
import MotionFade from "../motions/motionFade";
import MotionFloat from "../motions/motionFloat";
import { collection, endAt, orderBy, query, startAt } from "firebase/firestore";
import ProfileSmall from "../components/ProfileSmall";
import { useOutsideClick } from "../hooks/useOutsideClick";

interface ISearchState {
  keyword: string;
  prevKeyword: string;
  isInitial: boolean;
  searchedPosts: IUser[];
  searchedKeyword: string;
}

export default function Search() {
  const { gCurUser } = useStore();
  const [state, setState] = useState<ISearchState>({
    keyword: "",
    prevKeyword: "",
    isInitial: true,
    searchedPosts: [],
    searchedKeyword: "",
  });
  const [focus, setFocus] = useState(false);
  const { setLastIntersecting } = useInfiniteScroll("searchPost");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setState({ ...state, keyword: e.currentTarget.value });
  }
  async function handleClick(keyword: string) {
    if (!gCurUser.history) return;
    const index = gCurUser.history.indexOf(keyword);
    if (gCurUser.history) {
      index === -1
        ? updateUser({
            ...gCurUser,
            history: [keyword, ...gCurUser.history],
          })
        : updateUser({
            ...gCurUser,
            history: [
              keyword,
              ...gCurUser.history.slice(0, index),
              ...gCurUser.history.slice(index + 1, gCurUser.history.length),
            ],
          });
    } else {
      updateUser({
        ...gCurUser,
        history: [keyword],
      });
    }
    const data = await getDatasByQuery<IUser>(
      query(
        collection(db, "users"),
        orderBy("displayName"),
        startAt(keyword),
        endAt(keyword + "\uf8ff")
      )
    );
    setState({
      ...state,
      isInitial: false,
      searchedKeyword: keyword,
      keyword,
      searchedPosts: data,
    });
    setFocus(false);
  }
  async function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
      if (!gCurUser.history) return;
      const index = gCurUser.history.indexOf(state.keyword);
      if (gCurUser.history) {
        index === -1
          ? updateUser({
              ...gCurUser,
              history: [state.keyword, ...gCurUser.history],
            })
          : updateUser({
              ...gCurUser,
              history: [
                state.keyword,
                ...gCurUser.history.slice(0, index),
                ...gCurUser.history.slice(index + 1, gCurUser.history.length),
              ],
            });
      } else {
        updateUser({
          ...gCurUser,
          history: [state.keyword],
        });
      }
      const data = await getDatasByQuery<IUser>(
        query(
          collection(db, "users"),
          orderBy("displayName"),
          startAt(state.keyword),
          endAt(state.keyword + "\uf8ff")
        )
      );
      setState({
        ...state,
        isInitial: false,
        searchedKeyword: state.keyword,
        searchedPosts: data,
      });
      setFocus(false);
    }
  }
  function handleDeleteAll(e: React.MouseEvent<HTMLElement>) {
    updateUser({
      ...gCurUser,
      history: [],
    });
  }
  function handleDelete(e: React.MouseEvent<HTMLElement>) {
    const history = gCurUser.history;
    const id = e.currentTarget.id;
    if (history) {
      updateUser({
        ...gCurUser,
        history: [
          ...history.slice(0, Number(id)),
          ...history.slice(Number(id) + 1, history.length),
        ],
      });
    }
  }
  const router = useRouter();
  const recentRef = useRef<HTMLDivElement>(null);
  const click = useOutsideClick({
    ref: recentRef,
    onClick: () => setFocus(false),
  });
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <>
      {state.searchedKeyword && (
        // key에 변수를 넣어서 강제로 리렌더링!
        // 왜냐하면 그냥 {resultTitle}에 대한 검색결과에만 변수를 넣으면
        // 해당부분만 리렌더링되므로 애니메이션이 트리거되지 않기때문
        <MotionFloat key={state.searchedKeyword}>
          <h1 className="mt-8 mb-2 text-lg font-bold">
            {state.searchedKeyword}에 대한 검색결과
          </h1>
        </MotionFloat>
      )}
      <MotionFade>
        <div ref={recentRef}>
          <div className="flex mb-4">
            <div className="flex items-center w-full p-1 rounded-md bg-gray-3 hover:cursor-pointer">
              <HiSearch size={SIZE.iconSmall} />
              <input
                className="w-full m-1 bg-gray-3"
                type="text"
                value={state.keyword}
                onChange={handleChange}
                onFocus={() => setFocus(true)}
                onKeyDown={handleSearch}
                ref={searchRef}
              />
              <HiX
                className="mx-1"
                size={SIZE.iconSmall}
                onClick={() => {
                  setState({ ...state, keyword: "" });
                  // searchRef.current?.focus();
                }}
              />
            </div>
            <div
              className="flex items-center justify-end ml-3 mr-1 min-w-fit hover:cursor-pointer"
              onClick={() => router.push("/search")}
            >
              취소
            </div>
          </div>

          {(state.isInitial || focus) && (
            <>
              <div className="relative">
                <div className="absolute z-10 w-full bg-white">
                  <div className="flex justify-between my-4 text-xs text-gray-1">
                    <div>최근 검색어</div>
                    <div
                      className="hover:cursor-pointer"
                      onClick={handleDeleteAll}
                    >
                      모두 삭제
                    </div>
                  </div>
                  {[...(gCurUser.history || [])]
                    ?.filter(
                      (each) =>
                        state.keyword === "" ||
                        each.indexOf(state.keyword) === 0
                    )
                    .map((e, i) => (
                      <MotionFloat key={i}>
                        <div
                          key={i}
                          className="flex justify-between my-4 text-sm text-gray-1"
                        >
                          <div
                            className="hover:cursor-pointer"
                            onClick={() => handleClick(e)}
                          >
                            {e}
                          </div>
                          <div
                            className="hover:cursor-pointer"
                            id={String(i)}
                            onClick={handleDelete}
                          >
                            <HiX />
                          </div>
                        </div>
                      </MotionFloat>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        {!state.isInitial && (
          <>
            {state.searchedPosts.map((user) => (
              <MotionFloat key={user.id}>
                <ProfileSmall user={user} style="search" key={user.id} />
              </MotionFloat>
            ))}
          </>
        )}
      </MotionFade>
    </>
  );
}
