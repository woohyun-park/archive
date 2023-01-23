import Tab from "../components/Tab";
import { SIZE } from "../custom";
import { HiSearch, HiX } from "react-icons/hi";
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../apis/zustand";
import { updateUser } from "../apis/firebase";
import { useRouter } from "next/router";
import MotionFade from "../motions/motionFade";
import MotionFloat from "../motions/motionFloat";
import { useOutsideClick } from "../hooks/useOutsideClick";

interface ISearchState {
  isInitial: boolean;
  searchedKeyword: string;
}

export default function Search() {
  const { gCurUser, gSetSearch, gSearch, gStatus, gSetStatus, gPage } =
    useStore();
  const [state, setState] = useState<ISearchState>({
    isInitial: true,
    searchedKeyword: "",
  });
  const [keyword, setKeyword] = useState(gStatus.keyword);
  const [focus, setFocus] = useState(false);
  const router = useRouter();
  const recentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    gSetStatus({ ...gStatus, keyword });
  }, [keyword]);
  useOutsideClick({
    ref: recentRef,
    onClick: () => setFocus(false),
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setKeyword(e.currentTarget.value);
  }

  function updateHistory(keyword: string) {
    if (gCurUser.history) {
      const index = gCurUser.history.indexOf(keyword);
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
  }

  async function handleClick(keyword: string) {
    updateHistory(keyword);
    await gSetSearch("tags", gPage.search.tag, keyword);
    await gSetSearch("users", gPage.search.user, keyword);
    setState({
      ...state,
      isInitial: false,
      searchedKeyword: keyword,
    });
    setFocus(false);
    setKeyword(keyword);
  }

  // TODO: 한글을 치고 엔터를 누르면 블루갈롤 -> 블루갈롤롤과 같이 검색되는 현상이 있다.
  // 콘솔창에서 확인해보니 dev 환경에서 2번 실행되어 그런 것 같은데, 2번 실행되어도 변하면 안되는거 아닌가?
  async function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    // if (state.keyword === "") return;
    if (e.key === "Enter") {
      e.currentTarget.blur();
      handleClick(gStatus.keyword);
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

  return (
    <>
      {!focus && state.searchedKeyword && (
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
                onChange={handleChange}
                value={keyword}
                onFocus={() => setFocus(true)}
                onKeyDown={handleSearch}
                ref={searchRef}
              />
              <HiX
                className="mx-1"
                size={SIZE.iconSmall}
                onClick={() => {
                  setKeyword("");
                  searchRef.current?.focus();
                }}
              />
            </div>
            <div
              className="flex items-center justify-end ml-3 mr-1 min-w-fit hover:cursor-pointer"
              onClick={() => (focus ? setFocus(false) : router.push("/search"))}
            >
              취소
            </div>
          </div>

          {(state.isInitial || focus) && (
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
                      gStatus.keyword === "" ||
                      each.indexOf(gStatus.keyword) === 0
                  )
                  .map((e, i) => (
                    <MotionFloat key={i}>
                      <div
                        key={i}
                        className="flex items-center justify-between my-4 text-sm text-gray-1"
                      >
                        <div
                          className="w-full hover:cursor-pointer"
                          onClick={() => handleClick(e)}
                        >
                          {e}
                        </div>
                        <div
                          className="flex items-center hover:cursor-pointer"
                          id={String(i)}
                          onClick={handleDelete}
                        >
                          <HiX size={SIZE.iconSmall} />
                        </div>
                      </div>
                    </MotionFloat>
                  ))}
              </div>
            </div>
          )}
        </div>
        {!state.isInitial && !focus && (
          <Tab
            data={{
              person: [...gSearch.users],
              tag: { ...gSearch.tags },
            }}
            tab={[
              ["person", "user"],
              ["tag", "list"],
            ]}
          />
        )}
      </MotionFade>
    </>
  );
}
