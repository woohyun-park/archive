import List from "../components/List";
import { COLOR, IPost, IUser, SIZE } from "../custom";
import { HiSearch, HiX } from "react-icons/hi";
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../apis/zustand";
import Box from "../components/Box";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Loader from "../components/Loader";
import { db, getDatasByQuery, updateUser } from "../apis/firebase";
import { useRouter } from "next/router";
import { AnimatePresence, motion, Transition } from "framer-motion";
import MotionFade from "../motions/motionFade";
import MotionFloat from "../motions/motionFloat";
import {
  collection,
  endAt,
  orderBy,
  query,
  startAt,
  where,
} from "firebase/firestore";
import ProfileSmall from "../components/ProfileSmall";
import { useOutsideAlerter } from "../hooks/useOutsideClick";

export default function Search() {
  const { gSearch, gPage, gCurUser } = useStore();
  const [search, setSearch] = useState("");
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const [resultPosts, setResultPosts] = useState<IUser[]>([]);
  const [resultTitle, setResultTitle] = useState("");
  const { setLastIntersecting } = useInfiniteScroll("searchPost");

  useEffect(() => {
    setLoading(false);
  }, [gSearch]);

  useEffect(() => {
    setLoading(true);
  }, [gPage.sPost]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }
  async function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      setResult(true);
      setResultTitle(search);
      setFocus(false);
      e.currentTarget.blur();
      const index = gCurUser.history?.indexOf(search) || -1;
      if (gCurUser.history) {
        index === -1
          ? updateUser({
              ...gCurUser,
              history: [search, ...gCurUser.history],
            })
          : updateUser({
              ...gCurUser,
              history: [
                search,
                ...gCurUser.history.slice(0, index),
                ...gCurUser.history.slice(index + 1, gCurUser.history.length),
              ],
            });
      } else {
        updateUser({
          ...gCurUser,
          history: [search],
        });
      }
      const data = await getDatasByQuery<IUser>(
        query(
          collection(db, "users"),
          orderBy("displayName"),
          startAt(search),
          endAt(search + "\uf8ff")
        )
      );
      setResultPosts(data);
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
  useEffect(() => {
    console.log(gCurUser.history);
  }, [gCurUser]);
  const recentRef = useRef(null);
  useOutsideAlerter({ ref: recentRef, onClick: () => setFocus(false) });

  return (
    <>
      <MotionFade>
        <div ref={recentRef}>
          <div className="flex">
            <div className="flex items-center w-full p-1 mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
              <HiSearch size={SIZE.iconSmall} />
              <input
                className="w-full m-1 bg-gray-3"
                type="text"
                value={search}
                onChange={handleChange}
                onFocus={() => setFocus(true)}
                onKeyDown={handleSearch}
              />
              <HiX
                className="mx-1"
                size={SIZE.iconSmall}
                onClick={() => setSearch("")}
              />
            </div>
            <div
              className="flex items-center justify-end ml-3 mr-1 min-w-fit"
              onClick={() => router.push("/search")}
            >
              취소
            </div>
          </div>

          {(!result || focus) && (
            // {true && (
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
                      (each) => search === "" || each.indexOf(search) === 0
                    )
                    .map((e, i) => (
                      <MotionFloat key={i}>
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
                      </MotionFloat>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        {result && (
          <>
            <div>{resultTitle}에 대한 검색 결과</div>
            {resultPosts.map((user) => (
              <ProfileSmall user={user} style="search" key={user.id} />
            ))}
          </>
        )}
      </MotionFade>

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
