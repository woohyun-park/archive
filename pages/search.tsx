import { collection, getDocs } from "firebase/firestore";
import { db } from "../apis/firebase";
import List from "../components/List";
import { COLOR, IPost, IUser, SIZE } from "../custom";
import { HiSearch } from "react-icons/hi";
import { useState } from "react";

interface ISearchProps {
  posts: IPost[];
  users: IUser[];
}

export default function Search({ posts, users }: ISearchProps) {
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
          post: posts,
          tag: {},
          people: users,
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

export async function getServerSideProps() {
  const postSnap = await getDocs(collection(db, "posts"));
  const posts: IPost[] = [];
  postSnap.forEach((doc) => {
    if (doc.data().isDeleted) {
      return;
    }
    posts.push({
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      id: doc.id,
    } as IPost);
  });
  const userSnap = await getDocs(collection(db, "users"));
  const users: IUser[] = [];
  userSnap.forEach((doc) => {
    users.push({ ...doc.data(), uid: doc.id } as IUser);
  });

  return { props: { posts, users } };
}
