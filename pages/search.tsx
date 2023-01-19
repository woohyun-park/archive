import List from "../components/List";
import { COLOR, IPost, IUser, SIZE } from "../custom";
import { HiSearch } from "react-icons/hi";
import { useState } from "react";
import { useStore } from "../apis/zustand";

export default function Search() {
  const { gSearch } = useStore();
  const [search, setSearch] = useState("");

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
      <List
        data={{
          post: gSearch.posts,
          tag: {},
          people: gSearch.users,
        }}
        style="search"
      />

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
      `}</style>
    </>
  );
}
