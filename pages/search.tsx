import List from "../components/List";
import { COLOR, IPost, IUser, SIZE } from "../custom";
import { HiSearch, HiX } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Box from "../components/Box";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Loader from "../components/Loader";
import { updateUser } from "../apis/firebase";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import MotionFade from "../motions/motionFade";

export default function Search() {
  const { gSearch, gPage, gCurUser } = useStore();
  const [loading, setLoading] = useState(false);
  const { setLastIntersecting } = useInfiniteScroll("searchPost");

  useEffect(() => {
    setLoading(false);
  }, [gSearch]);

  useEffect(() => {
    setLoading(true);
  }, [gPage.sPost]);

  const router = useRouter();

  return (
    <>
      <MotionFade>
        <h1 className="title-page">검색</h1>
        <Link href="/search-modal">
          <div className="flex">
            <div className="flex items-center w-full p-1 mb-1 rounded-md bg-gray-3 hover:cursor-pointer">
              <HiSearch size={SIZE.iconSmall} />
            </div>
          </div>
        </Link>
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
