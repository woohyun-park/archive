import List from "../components/List";
import { SIZE } from "../custom";
import { HiSearch, HiX } from "react-icons/hi";
import React, { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import Box from "../components/Box";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Loader from "../components/Loader";
import Link from "next/link";
import { useRouter } from "next/router";
import MotionFade from "../motions/motionFade";

export default function Search() {
  const { gSearch, gPage } = useStore();

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
        <List
          data={gSearch.posts}
          page="search"
          type="post"
          loadingRef={[gPage.sPost, gSearch]}
        />
      </MotionFade>
    </>
  );
}
