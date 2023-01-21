import List from "../components/List";
import { COLOR, IPost, IUser, SIZE } from "../custom";
import { HiSearch, HiX } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Box from "../components/Box";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Loader from "../components/Loader";
import { updateUser } from "../apis/firebase";

export default function Search() {
  const { gSearch, gPage, gCurUser } = useStore();
  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setLastIntersecting } = useInfiniteScroll("searchPost");

  useEffect(() => {
    setLoading(false);
  }, [gSearch]);

  useEffect(() => {
    setLoading(true);
  }, [gPage.sPost]);

  function handleSearchClick() {}
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }
  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (gCurUser.history) {
        updateUser({
          ...gCurUser,
          history: [search, ...gCurUser.history],
        });
      } else {
        updateUser({
          ...gCurUser,
          history: [search],
        });
      }
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
      <h1 className="mb-9">검색</h1>
      <div className="flex">
        <div className="flex items-center w-full p-1 mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
          <HiSearch size={SIZE.iconSmall} onClick={handleSearchClick} />
          <input
            className="w-full m-1 bg-gray-3"
            type="text"
            value={search}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyDown={handleSearch}
          />
        </div>
        {focus && (
          <div className="flex items-center justify-end ml-3 mr-1 min-w-fit">
            취소
          </div>
        )}
      </div>

      {!focus ? (
        <>
          <div className="grid grid-cols-3 mt-4 gap-y-2 gap-x-2">
            {gSearch.posts.map((e, i) => (
              <>
                <div>
                  <Box
                    post={{ ...e, id: e.id }}
                    style={"search"}
                    key={e.id}
                  ></Box>
                </div>
                {i === gSearch.posts.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            ))}
          </div>
          <div className="flex justify-center"> {loading && <Loader />}</div>
        </>
      ) : search === "" ? (
        <>
          <div className="flex justify-between my-4 text-xs text-gray-1">
            <div>최근 검색어</div>
            <div className="hover:cursor-pointer" onClick={handleDeleteAll}>
              모두 삭제
            </div>
          </div>
          {gCurUser.history?.map((e, i) => (
            <div
              key={i}
              className="flex justify-between my-4 text-sm text-gray-1"
            >
              <div className="hover:cursor-pointer">{e}</div>
              <div
                className="hover:cursor-pointer"
                id={String(i)}
                onClick={handleDelete}
              >
                <HiX />
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <List
            data={{
              post: gSearch.posts,
              tag: {},
              people: gSearch.users,
            }}
            style="search"
          />
        </>
      )}

      <style jsx>{`
        .titleCont {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .search:hover {
          cursor: pointer;
        }
        .recentCont {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: ${COLOR.txt2};
          margin: 16px 0;
        }
        .historyCont {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: ${COLOR.txt1};
          margin: 16px 0;
        }
      `}</style>
    </>
  );
}
