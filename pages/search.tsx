import List from "../components/List";
import { COLOR, IPost, IUser, SIZE } from "../custom";
import { HiSearch } from "react-icons/hi";
import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Box from "../components/Box";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Loader from "../components/Loader";

export default function Search() {
  const { gSearch, gPage } = useStore();
  const [search, setSearch] = useState("");
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

  return (
    <>
      <h1>검색</h1>
      <div className="search">
        <HiSearch size={SIZE.iconSmall} onClick={handleSearchClick} />
        <input
          className="searchInput"
          type="text"
          value={search}
          onChange={handleChange}
        />
      </div>
      {search === "" ? (
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
          width: 100%;
          margin: 2px;
          border: none;
          background-color: ${COLOR.bg2};
        }
        .postCont {
          display: grid;
          grid-template-columns: 1fr;
           {
            /* grid-template-columns: 1fr 1fr 1fr; */
          }
          row-gap: 4px;
          column-gap: 4px;
          margin-top: 8px;
        }
        .loaderCont {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
