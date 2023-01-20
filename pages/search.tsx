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
      <h1>검색</h1>
      <div className="flex">
        <div className="search">
          <HiSearch size={SIZE.iconSmall} onClick={handleSearchClick} />
          <input
            className="searchInput"
            type="text"
            value={search}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            onKeyDown={handleSearch}
          />
        </div>
        {focus && <div>취소</div>}
      </div>

      {!focus ? (
        <>
          <div className="postCont">
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
          <div className="loaderCont"> {loading && <Loader />}</div>
        </>
      ) : search === "" ? (
        <>
          <div className="recentCont">
            <div>최근 검색어</div>
            <div className="deleteAll" onClick={handleDeleteAll}>
              모두 삭제
            </div>
          </div>
          {gCurUser.history?.map((e, i) => (
            <div key={i} className="recentCont">
              <div className="recent">{e}</div>
              <div className="delete" id={String(i)} onClick={handleDelete}>
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
        h1 {
          margin-bottom: 36px;
        }
        .titleCont {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .search {
          display: flex;
          padding: 4px;
          background-color: ${COLOR.btn2};
          border-radius: 4px;
          margin-bottom: 4px;
          align-items: center;
        }
        .search:hover {
          cursor: pointer;
        }
        .searchInput {
          outline: none;
          width: 100%;
          margin: 2px;
          border: none;
          background-color: ${COLOR.bg2};
        }
        .postCont {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          row-gap: 8px;
          column-gap: 8px;
          margin-top: 16px;
        }
        .loaderCont {
          display: flex;
          justify-content: center;
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
        .deleteAll:hover,
        .recent:hover,
        .delete:hover {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
