import Tab from "../components/Tab";
import { SIZE } from "../libs/custom";
import { HiSearch, HiX } from "react-icons/hi";
import React, { Children, useEffect, useRef, useState } from "react";
import { useStore } from "../stores/useStore";
import { updateUser } from "../apis/firebase";
import { useRouter } from "next/router";
import WrapMotion from "../components/wrappers/WrapMotion";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useUser } from "../stores/useUser";
import { useKeyword } from "../stores/useKeyword";
import IconInput from "../components/atoms/IconInput";
import IconBtn from "../components/atoms/IconBtn";

interface ISearchState {
  isInitial: boolean;
  searchedKeyword: string;
}

export default function Search() {
  const { gSetSearch, gSearch, gStatus, gSetStatus, gPage } = useStore();
  const router = useRouter();
  const { curUser } = useUser();
  const [state, setState] = useState<ISearchState>({
    isInitial: true,
    searchedKeyword: "",
  });

  const { keywords, setKeywords } = useKeyword();
  const keyword = keywords[router.pathname] || "";

  const [focus, setFocus] = useState(false);
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
    setKeywords(router.pathname, e.currentTarget.value);
  }

  function updateHistory(keyword: string) {
    if (curUser.history) {
      const index = curUser.history.indexOf(keyword);
      index === -1
        ? updateUser({
            ...curUser,
            history: [keyword, ...curUser.history],
          })
        : updateUser({
            ...curUser,
            history: [
              keyword,
              ...curUser.history.slice(0, index),
              ...curUser.history.slice(index + 1, curUser.history.length),
            ],
          });
    } else {
      updateUser({
        ...curUser,
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
    setKeywords(router.pathname, keyword);
  }

  // TODO: 한글을 치고 엔터를 누르면 블루갈롤 -> 블루갈롤롤과 같이 검색되는 현상이 있다.
  // 콘솔창에서 확인해보니 dev 환경에서 2번 실행되어 그런 것 같은데, 2번 실행되어도 변하면 안되는거 아닌가?
  async function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    // if (state.keyword === "") return;
    if (e.key === "Enter") {
      e.currentTarget.blur();
      handleClick(keyword);
    }
  }

  function handleDeleteAll(e: React.MouseEvent<HTMLElement>) {
    updateUser({
      ...curUser,
      history: [],
    });
  }

  function handleDelete(e: React.MouseEvent<HTMLElement>) {
    const history = curUser.history;
    const id = e.currentTarget.id;
    if (history) {
      updateUser({
        ...curUser,
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
        <WrapMotion type="float" key={state.searchedKeyword}>
          <h1 className="mt-8 mb-2 text-lg font-bold">
            {state.searchedKeyword}에 대한 검색결과
          </h1>
        </WrapMotion>
      )}
      <WrapMotion type="fade">
        <div ref={recentRef}>
          <div className="flex w-full">
            <div className="w-full">
              <IconInput
                icon="search"
                keyword={keyword}
                onChange={handleChange}
                onDelete={() => {
                  setKeywords(router.pathname, "");
                  searchRef.current?.focus();
                }}
                onKeyDown={handleSearch}
                style="margin: 0"
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
                {Children.toArray(
                  [...(curUser.history || [])]
                    ?.filter(
                      (each) => keyword === "" || each.indexOf(keyword) === 0
                    )
                    .map((e, i) => (
                      <WrapMotion type="float">
                        <div className="flex items-center justify-between my-4 text-sm text-gray-1">
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
                            <HiX size={SIZE.iconSm} />
                          </div>
                        </div>
                      </WrapMotion>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
        {!state.isInitial && !focus && (
          <Tab
            data={{
              person: [...gSearch.users],
              tag: [...gSearch.tags],
            }}
            tab={[
              ["person", "user"],
              ["tag", "list"],
            ]}
            route="search"
          />
        )}
      </WrapMotion>
    </>
  );
}
